// SPDX-License-Identifier: Apache-2.0
//
// The run loop for the unbounded engine: it owns one World and steps it, either against a
// deadline (a timed run, for the contests), until it is stopped (an open-ended run, for
// Explore), or up to a result's generation (a replay, for the contests' Watch). run.worker.js
// runs it in a Web Worker; driver.js is its other end, on the page.
//
// A replay keeps no history either, only keyframes (keyframes.js): the cells every K
// generations, under a memory budget. A seek restores the nearest keyframe at or before its
// target (or the seed) and steps on from there, in slices like the loop's, so a later seek takes
// over from one still on its way.
//
// A settling run ends when its pattern dies or repeats, as settle.js decides: a repeat is
// proposed by the cells' fingerprint and confirmed, cell for cell, before the run ends. It keeps
// keyframes of its own to confirm with. With a budget (`generations`), it looks back over the
// whole budget, and settles only by a cycle that closes within it.
//
// A world with departures (Classic Methuselah's, #100) lets ships leave at the arena's edge: every
// step goes through departures.js, which is step() itself for any other world. A repeat whose
// cycle had a departure ends as 'emits'.
//
// The loop steps for a short slice of time, then yields, so messages from the page (pause,
// step, stop, snapshot) are handled between generations. A generation itself can't be
// interrupted, and doesn't need to be: a timed run's deadline is checked once each generation
// is computed and before it is committed (step()'s veto), so a generation that finishes after
// the deadline is discarded, and the count is the generations completed before it.
//
// Messages to the run:
//   {type: 'start', world: {rules, chunkSize?, slabBytes?, limits?, arena?, wrap?, walls?}, seed: Int32Array,
//    run: {kind: 'timed', seconds}
//       | {kind: 'open', paused?, rate?, settle?, history?, keyframeBytes?, keyframeEvery?}
//       | {kind: 'replay', paused?, rate?, check?: {run, hash}, keyframeBytes?, keyframeEvery?},
//    generations?, from?}
//     from: the seed is generation `from` of an earlier run, and the count goes on from there
//     (Explore loads a saved generation this way); `generations` counts from 0 all the same
//     settle: end when every cell has died ('died') or the cells repeat, in place, those of
//     an earlier generation ('repeat', with the cycle: {from, period}; the generation count
//     goes back to `from`, whose cells they are; 'emits' likewise, if ships left during the
//     cycle). settle.js decides, confirming each repeat;
//     with `generations`, only a cycle that closes by then counts, and a death at the last
//     generation ends the run as 'generation-limit'. The keyframes are the settle detector's
//     replay: `generations` is the result's generation, where it ends ('generation-limit'),
//     and is required; it starts from the seed. With `check`, the result's run and hash, the
//     cells there are hashed under the run and compared with the hash ('replayed')
//     history: keep the live cells of every generation, for a chart of the whole run (a
//     Discovery contest's); it needs `generations`, and starts from generation 0
//   {type: 'pause'} {type: 'resume'} {type: 'step'}   open-ended runs and replays only
//   {type: 'rate', rate}                                the same; null for flat out
//   {type: 'seek', id, generation}                      replays only, even once ended: go to that
//     generation (up to the replay's last), then carry on as before (an ended replay pauses)
//   {type: 'stop'}
//   {type: 'cycle', id, budget}                         after 'repeat': every generation of the cycle
//   {type: 'history', id}                               a run with `history`: its live cells so far
//   {type: 'snapshot', id, budget?, slice?: {axis, index}, stats?: true}
//     cells, or chunks past `budget` live cells; with a slice, only those in the plane where
//     coordinate `axis` (0, 1, 2) equals `index`; with stats, the statistics of the same moment
//   {type: 'result', id, run, score?, details?}        once the run has ended: its result file
//     (canonical.js's resultOf()), made here so the page never holds a large generation's cells;
//     the ending is the run's own end reason
// Messages from the run:
//   {type: 'state', state: 'running' | 'paused' | 'seeking' | 'ended', reason?, cycle?, departures?, stats}
//     departures: once ended, in a world where ships leave at the edge, every departure so far,
//     {generation, period, shift}, without its cells (the result file has those)
//   {type: 'cycle', id, from, period, frames: Int32Array[] | null}   null past `budget` cells
//   {type: 'history', id, live: Uint32Array}           the live cells of generations 0 to the run's
//     generation now (a settled run's goes back to where its cycle began); the buffer is transferred
//   {type: 'stats', stats}                              at most every STATS_INTERVAL_MS
//   {type: 'snapshot', id, generation, live, chunkSize, slice?, stats?, cells?: Int32Array, chunks?: Int32Array}
//     cells as x, y, z triples, or chunks as x, y, z, live quadruples (World.chunkList()); the
//     array's buffer is transferred
//   {type: 'result', id, result}                       the result, as an object for resultText()
//   {type: 'seeked', id, generation, superseded?}       a seek has arrived, or a later one took over
//   {type: 'replayed', generation, hash, matches, reason}   once, when a replay first ends:
//     at its generation, the hash of its cells and whether it is the check's (null without a
//     check); before it, no hash, and matches false if the pattern ended it (a limit of the
//     run's), null if the machine did (memory)
//   {type: 'error', id?, message}
//
// Statistics go out on their own at most four times a second, and with every change of state.
// Snapshots go out only when asked for, so a run with no view attached pays nothing for them.
//
// Nothing here imports `state` or touches the page.

import { World } from './world.js';
import { step as stepWorld } from './step.js';
import { withDepartures } from './departures.js';
import { END_REASONS } from './endings.js';
import { resultOf, hashWorld } from './canonical.js';
import { Keyframes, KEYFRAME_BYTES, KEYFRAME_EVERY, triples } from './keyframes.js';
import { Settler, REPEAT_WINDOW } from './settle.js';

export const STATS_INTERVAL_MS = 250;
/** How long the loop steps before yielding to messages, unless one generation takes longer. */
export const SLICE_MS = 16;
/** settle.js's and keyframes.js's, here too for the code that already looks here. */
export { REPEAT_WINDOW, KEYFRAME_BYTES, KEYFRAME_EVERY };
/** Endings that come from the pattern under the run's own limits, not from the machine. */
const PATTERN_ENDINGS = ['cell-limit', 'extent-limit', 'coordinate-limit', 'arena-edge'];

/** The reasons a run can end (endings.js), here too for the code that already looks here. */
export { END_REASONS };

/**
 * @typedef {object} Stats
 * @property {number} generation - generations completed
 * @property {number} elapsedMs - time spent running, without pauses
 * @property {number} generationMs - the running time at which the current generation was
 *   completed. A timed run ends after its deadline, once the generation it was computing is done
 *   and discarded, so elapsedMs then passes the deadline; generationMs never does
 * @property {number} rate - generations per second since the last statistics; 0 unless running
 * @property {number} live - live cells, and `livePeak` the most there have been
 * @property {number} livePeak
 * @property {number} chunks - chunks allocated, `chunksPeak` the most at once, and
 *   `chunksCreated` how many have ever been
 * @property {number} chunksPeak
 * @property {number} chunksCreated
 * @property {{min: number[], max: number[]} | null} extent - the live cells' bounding box
 * @property {number} memoryBytes - the bytes of the slabs the engine holds: exact for the cells,
 *   without the browser's own overhead. It grows a slab at a time, and the memory limit counts it.
 * @property {number} usedBytes - the bytes of those slabs the chunks use now, two copies of
 *   each chunk's cells: it follows the pattern
 * @property {number} [departed] - only in a world where ships leave at the edge (#100): how many
 *   have left so far
 * @property {{generation: number, shift: number[]} | null} [lastDeparture] - the same: the last
 *   one to leave, for Explore to say where it went (#103)
 */

export class Run {
  /**
   * @param {object} host
   * @param {(message: object, transfer?: Transferable[]) => void} host.post
   * @param {() => number} [host.now] - milliseconds
   * @param {(fn: () => void) => void} [host.yieldThen] - runs fn once pending messages are handled
   * @param {(ms: number, fn: () => void) => void} [host.wait] - runs fn after ms
   * @param {typeof stepWorld} [host.step] - the tests wrap it to move a fake clock; the run
   *   applies a world's departures round it
   */
  constructor({ post, now = () => performance.now(), yieldThen, wait = (ms, fn) => setTimeout(fn, ms), step = stepWorld }) {
    this.post = post;
    this.now = now;
    this.yieldThen = yieldThen ?? messageYield(this);
    this.wait = wait;
    this.stepWorld = withDepartures(step);
    this.world = null;
    this.state = 'idle'; // then 'running' or 'paused', then 'ended'
    this.ticket = 0; // bumped on every change of state, so a stale scheduled loop does nothing
  }

  /** Handles one message from the page. */
  receive(message) {
    try {
      this.handle(message);
    } catch (err) {
      this.fail(err, message?.id);
    }
  }

  handle(message) {
    switch (message?.type) {
      case 'start': return this.start(message);
      case 'pause': return this.openOnly('pause') && this.pause();
      case 'resume': return this.openOnly('resume') && this.resume();
      case 'step': return this.openOnly('step') && this.state === 'paused' && this.stepByHand();
      case 'rate': return this.openOnly('rate') && this.live() && this.changeRate(message.rate);
      case 'stop': return this.live() && this.end('stopped');
      case 'snapshot': return this.snapshot(message.id, message.budget, message.slice, message.stats);
      case 'cycle': return this.cycle(message.id, message.budget);
      case 'history': return this.sendHistory(message.id);
      case 'result': return this.result(message);
      case 'seek': return this.seek(message.id, message.generation);
      default: throw new RunError(`Unknown message ${JSON.stringify(message?.type)}.`);
    }
  }

  start({ world: options, seed, run, generations = Infinity, from = 0 }) {
    if (this.state !== 'idle') throw new RunError('This run has already started; start another Worker.');
    if (!(seed instanceof Int32Array) || seed.length % 3) {
      throw new RunError('The seed must be an Int32Array of x, y, z triples.');
    }
    const timed = run?.kind === 'timed';
    const replay = run?.kind === 'replay';
    if (timed && !(run.seconds > 0)) throw new RunError('A timed run needs a number of seconds.');
    if (!timed && !replay && run?.kind !== 'open') throw new RunError("The run's kind must be 'timed', 'open' or 'replay'.");
    if (generations !== Infinity && !(Number.isInteger(generations) && generations >= 0)) {
      throw new RunError('The generations must be a whole number.');
    }
    if (!(Number.isSafeInteger(from) && from >= 0)) throw new RunError('The generation to start from must be a whole number.');
    if (replay) checkReplay(run, generations, from);
    const settle = !timed && !replay && Boolean(run.settle);
    if (replay || settle) checkKeyframes(run);
    const history = !timed && !replay && Boolean(run.history);
    if (history && (generations === Infinity || from !== 0)) {
      throw new RunError('A run keeps its history only with its generations, from generation 0.');
    }

    const world = new World({ ...options, fingerprint: settle });
    world.setCells(triples(seed));
    world.generation = from; // only the count: the step never reads it
    this.world = world;
    this.kind = run.kind;
    this.settle = settle;
    this.seeking = null; // a seek on its way: {id, target, resume}
    this.replay = replay ? {
      options: { ...options },
      check: run.check ?? null,
      // The seed was transferred to this thread: the run owns it, to restore generation 0 from
      keyframes: new Keyframes({ start: { generation: 0, cells: seed }, budget: run.keyframeBytes, every: run.keyframeEvery }),
      last: generations, // the furthest generation it can reach: less, once a limit ends it early
      done: false, // whether 'replayed' has gone out
    } : null;
    this.cycleFound = null;
    this.settler = settle ? new Settler(world, {
      world: options, budget: generations, keyframeBytes: run.keyframeBytes, keyframeEvery: run.keyframeEvery,
    }) : null;
    this.generations = generations;
    // The live cells of each generation, from 0: at most 4 bytes a generation
    this.history = history ? new Uint32Array(generations + 1) : null;
    if (history) this.history[0] = world.liveCells;
    this.livePeak = world.liveCells;
    this.runningMs = 0;
    this.runningSince = null;
    this.generationMs = 0;

    const now = this.now();
    this.window = { at: now, generation: from, runningMs: 0 };
    this.lastStatsAt = -Infinity;
    if (timed) {
      this.deadline = now + run.seconds * 1000;
      this.veto = () => (this.now() >= this.deadline ? 'deadline' : null);
    }
    this.setRate(timed ? null : run.rate ?? null);
    this.setState(!timed && run.paused ? 'paused' : 'running');
  }

  // ---- The loop ----

  loop(ticket) {
    if (ticket !== this.ticket) return; // paused, stopped or rescheduled since this was scheduled
    const sliceEnd = this.now() + SLICE_MS;
    for (;;) {
      if (this.seeking) {
        // Flat out, whatever the rate, and with no statistics on the way
        if (this.world.generation >= this.seeking.target) return this.arrive();
        if (this.advance()) return; // ended on the way: end() has answered the seek
        if (this.now() >= sliceEnd) return this.yieldThen(() => this.loop(ticket));
        continue;
      }
      if (this.deadline !== undefined && this.now() >= this.deadline) return this.end('deadline');
      if (this.world.generation >= this.generations) return this.end('generation-limit');
      if (this.rate) {
        const wait = this.dueAt - this.now();
        if (wait > 0) {
          this.maybeStats();
          return this.wait(wait, () => this.loop(ticket));
        }
      }
      if (this.advance()) return;
      this.maybeStats();
      if (this.now() >= sliceEnd) return this.yieldThen(() => this.loop(ticket));
    }
  }

  /** Steps once. @returns {boolean} whether the run has ended */
  advance() {
    let reason;
    try {
      reason = this.stepWorld(this.world, { veto: this.veto });
    } catch (err) {
      // A fault in the engine, not a limit: the current generation is still whole (a step
      // writes only the other copy), but the run can't go on
      this.fail(err);
      reason = 'error';
    }
    if (reason) {
      this.end(reason);
      return true;
    }
    if (this.state === 'running') this.generationMs = this.runningMs + this.now() - this.runningSince;
    if (this.replay) this.keep();
    const live = this.world.liveCells;
    if (live > this.livePeak) this.livePeak = live;
    if (this.history) this.history[this.world.generation] = live;
    if (this.rate) this.dueAt = Math.max(this.dueAt + 1000 / this.rate, this.now());
    if (this.settle && this.settled()) return true;
    if (this.world.generation >= this.generations) {
      this.end('generation-limit');
      return true;
    }
    return false;
  }

  /**
   * A settling run ends once every cell has died or the cells repeat, confirmed (settle.js).
   * @returns {boolean}
   */
  settled() {
    const found = this.settler.check(this.world);
    if (!found) return false;
    if (found.ending === 'repeat' || found.ending === 'emits') {
      this.cycleFound = { from: found.from, period: found.period };
      // The cells now are generation `from`'s, so the count goes back there: a settled run
      // reports the generation its cycle began, where its cells stay or keep returning
      this.world.generation = found.from;
    }
    // A death, a repeat, or the machine's memory, which a confirmation ran out of
    this.end(found.ending);
    return true;
  }

  /**
   * Every generation of the cycle a 'repeat' (or 'emits') found, as cells, starting with the
   * current one (the cycle's first). The world steps once round the cycle to make them, which
   * brings it back to the same cells; its generation count, and its departures, are put back.
   * Null frames past `budget` cells in all.
   */
  cycle(id, budget = Infinity) {
    if (!this.cycleFound) throw new RunError('The run has not settled into a repeating cycle.');
    const { world } = this;
    const { from, period } = this.cycleFound;
    const reason = world.stopReason;
    const generation = world.generation;
    const departed = world.departed.length;
    let frames = [];
    let cells = 0;
    world.stopReason = null;
    try {
      for (let i = 0; i < period; i++) {
        if (frames) {
          cells += world.liveCells;
          frames = cells > budget ? null : [...frames, world.cells()];
        }
        const ended = this.stepWorld(world);
        if (ended) throw new Error(`The cycle could not be replayed (${ended}).`);
      }
    } finally {
      world.stopReason = reason;
      world.generation = generation;
      world.departed.length = departed;
    }
    this.post({ type: 'cycle', id, from, period, frames }, frames ? frames.map((f) => f.buffer) : []);
  }

  /** The live cells of every generation so far, from 0 (a run with `history`). */
  sendHistory(id) {
    if (!this.history) throw new RunError('This run keeps no history.');
    const live = this.history.slice(0, this.world.generation + 1);
    this.post({ type: 'history', id, live }, [live.buffer]);
  }

  pause() {
    if (this.seeking) this.seeking.resume = 'paused';
    else if (this.state === 'running') this.setState('paused');
  }

  resume() {
    if (this.seeking) this.seeking.resume = 'running';
    else if (this.state === 'paused') this.setState('running');
  }

  // ---- Replays ----

  /** Keeps the generation just made as a keyframe, if it falls on one, within the budget. */
  keep() {
    this.replay.keyframes.keep(this.world);
  }

  /** The replay's keyframes now: which generations, every how many, and their bytes. For tests. */
  keyframes() {
    return this.replay.keyframes.list();
  }

  /**
   * Goes to a generation: from where the replay is, if that is on the way, or else from the
   * nearest keyframe at or before it. A later seek takes over from this one.
   */
  seek(id, generation) {
    if (!this.world) throw new RunError('There is nothing to seek before the run starts.');
    if (this.kind !== 'replay') throw new RunError('Only a replay can seek.');
    if (!(Number.isSafeInteger(generation) && generation >= 0)) throw new RunError('A seek needs a whole number of generations.');
    const r = this.replay;
    const target = Math.min(generation, r.last);
    let resume = this.state === 'running' ? 'running' : 'paused';
    if (this.seeking) {
      resume = this.seeking.resume;
      this.post({ type: 'seeked', id: this.seeking.id, generation: this.world.generation, superseded: true });
      this.seeking = null;
    }

    const from = r.keyframes.nearest(target);
    const here = this.world.generation;
    if (!(here <= target && here >= from)) this.restore(from);

    this.seeking = { id, target, resume };
    this.setState('seeking');
  }

  /** Puts a fresh world at a keyframe's generation (0: the seed). */
  restore(generation) {
    const r = this.replay;
    this.world = r.keyframes.restore(r.options, generation);
  }

  /** The seek has reached its generation: answer it, and carry on as before it. */
  arrive() {
    const { id, resume } = this.seeking;
    this.seeking = null;
    this.post({ type: 'seeked', id, generation: this.world.generation });
    if (this.world.generation >= this.generations) this.end('generation-limit');
    else this.setState(resume);
  }

  /** Once, when a replay first ends: the hash at its generation, or why it fell short. */
  replayed(reason) {
    const r = this.replay;
    r.done = true;
    const generation = this.world.generation;
    if (reason !== 'generation-limit') {
      r.last = generation;
      const matches = PATTERN_ENDINGS.includes(reason) ? false : null;
      this.post({ type: 'replayed', generation, hash: null, matches, reason });
      return;
    }
    if (!r.check) {
      this.post({ type: 'replayed', generation, hash: null, matches: null, reason });
      return;
    }
    // The cells are read now, before anything can move the world on; only the digest waits
    hashWorld(this.world, r.check.run)
      .then((hash) => this.post({ type: 'replayed', generation, hash, matches: hash === r.check.hash, reason }))
      .catch((err) => this.fail(err));
  }

  stepByHand() {
    if (this.world.generation >= this.generations) return this.end('generation-limit');
    const started = this.now();
    if (!this.advance()) {
      this.runningMs += this.now() - started;
      this.generationMs = this.runningMs;
      this.sendState();
    }
  }

  setRate(rate) {
    if (rate !== null && !(rate > 0)) throw new RunError('The rate must be a number of generations per second, or null.');
    this.rate = rate;
    this.dueAt = this.now();
  }

  changeRate(rate) {
    this.setRate(rate);
    if (this.state === 'running') this.schedule(); // don't sit out a wait set for the old rate
  }

  schedule() {
    const ticket = ++this.ticket;
    this.yieldThen(() => this.loop(ticket));
  }

  // ---- State ----

  setState(state, reason) {
    const now = this.now();
    if (this.state === 'running') this.runningMs += now - this.runningSince;
    this.state = state;
    this.ticket++;
    if (state === 'running') {
      this.runningSince = now;
      this.window = { at: now, generation: this.world.generation, runningMs: this.runningMs };
      this.dueAt = now;
    }
    this.sendState(reason);
    if (state === 'running' || state === 'seeking') this.schedule();
  }

  end(reason) {
    this.endReason = reason;
    if (this.world.stopReason === null) this.world.stop(reason);
    if (this.seeking) {
      // A limit on the way: the seek ends where the replay does
      this.post({ type: 'seeked', id: this.seeking.id, generation: this.world.generation });
      this.seeking = null;
    }
    if (this.replay && !this.replay.done && reason !== 'stopped') this.replayed(reason);
    this.setState('ended', reason);
  }

  sendState(reason) {
    const message = { type: 'state', state: this.state, stats: this.stats() };
    if (reason) message.reason = reason;
    if (reason === 'repeat' || reason === 'emits') message.cycle = this.cycleFound;
    if (this.state === 'ended' && this.world.departures) {
      message.departures = this.world.departed.map(({ generation, period, shift }) => ({ generation, period, shift: [...shift] }));
    }
    this.post(message);
  }

  maybeStats() {
    if (this.now() - this.lastStatsAt >= STATS_INTERVAL_MS) this.post({ type: 'stats', stats: this.stats() });
  }

  /**
   * The statistics now; the next ones on their own come at least STATS_INTERVAL_MS later.
   * @param {boolean} [peek] - for a snapshot: leave the rate's window and the timer alone
   */
  stats(peek = false) {
    const world = this.world;
    const now = this.now();
    const runningMs = this.runningMs + (this.state === 'running' ? now - this.runningSince : 0);
    let rate = 0;
    if (this.state === 'running') {
      const ms = runningMs - this.window.runningMs;
      if (ms > 0) rate = ((world.generation - this.window.generation) * 1000) / ms;
      if (!peek) this.window = { at: now, generation: world.generation, runningMs };
    }
    if (!peek) this.lastStatsAt = now;
    return {
      generation: world.generation,
      elapsedMs: runningMs,
      generationMs: this.generationMs,
      rate,
      live: world.liveCells,
      livePeak: this.livePeak,
      chunks: world.chunkCount,
      chunksPeak: world.chunksPeak,
      chunksCreated: world.chunksCreated,
      extent: world.extent(),
      memoryBytes: world.memoryBytes,
      usedBytes: world.usedBytes,
      // Only in a world where ships leave at the edge: how many have left so far
      ...(world.departures ? { departed: world.departed.length, lastDeparture: lastDeparture(world) } : {}),
    };
  }

  /**
   * Sends the live cells, or, if there are more than `budget` of them, the chunks that hold
   * them: a view can't draw more cells than its budget smoothly, and a chunk list is far smaller.
   * A slice limits both to one plane.
   */
  snapshot(id, budget = Infinity, slice = null, withStats = false) {
    if (!this.world) throw new RunError('There is nothing to snapshot before the run starts.');
    if (slice && !([0, 1, 2].includes(slice.axis) && Number.isInteger(slice.index))) {
      throw new RunError('A slice is {axis: 0, 1 or 2, index: a whole number}.');
    }
    const { world } = this;
    const live = world.liveCells;
    const message = { type: 'snapshot', id, generation: world.generation, live, chunkSize: world.n };
    if (withStats) message.stats = this.stats(true);
    let array;
    if (slice) {
      message.slice = { axis: slice.axis, index: slice.index };
      const cells = world.cellsInPlane(slice.axis, slice.index);
      array = cells.length / 3 > budget ? world.chunkList(slice) : cells;
      message[array === cells ? 'cells' : 'chunks'] = array;
    } else {
      array = live > budget ? world.chunkList() : world.cells();
      message[live > budget ? 'chunks' : 'cells'] = array;
    }
    this.post(message, [array.buffer]);
  }

  /**
   * Makes the ended run's result file: the hash of its last complete generation, under the
   * run's definition the page gives, with the score and details the page gives.
   */
  result({ id, run, score, details = {} }) {
    if (this.state !== 'ended') throw new RunError('A result is made once the run has ended.');
    resultOf(this.world, { run, ending: this.endReason, score, details })
      .then((result) => this.post({ type: 'result', id, result }))
      .catch((err) => this.fail(err, id));
  }

  live() {
    return this.state === 'running' || this.state === 'paused' || this.state === 'seeking';
  }

  openOnly(what) {
    if (!this.world) throw new RunError(`There is nothing to ${what} before the run starts.`);
    if (this.kind === 'timed') throw new RunError(`A timed run can't ${what === 'rate' ? 'change its rate' : what}; it can only be stopped.`);
    return true;
  }

  /** Reports an error. Only a fault while stepping ends the run (advance() sees to that). */
  fail(err, id) {
    const message = { type: 'error', message: err?.message ?? String(err) };
    if (id !== undefined) message.id = id;
    this.post(message);
  }

  /** Releases what the run holds open, so a Node process can exit. A Worker is terminated instead. */
  close() {
    this.ticket++;
    this.state = 'ended';
    this.channel?.port1.close();
  }
}

/**
 * Serves a run on a message port: a Worker's global scope, or one end of a MessageChannel.
 * @returns {Run}
 */
export function serve(port, host = {}) {
  const run = new Run({ post: (message, transfer) => port.postMessage(message, transfer ?? []), ...host });
  port.onmessage = (event) => run.receive(event.data);
  return run;
}

/** A message the run won't act on. The run carries on as before. */
export class RunError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RunError';
  }
}

/** Refuses a replay's start that can't make one. */
function checkReplay(run, generations, from) {
  if (generations === Infinity) throw new RunError('A replay needs the generation it replays to.');
  if (from !== 0) throw new RunError('A replay starts from its seed, at generation 0.');
  const check = run.check;
  if (check !== undefined && !(check && typeof check.hash === 'string' && check.run && typeof check.run === 'object')) {
    throw new RunError("A replay's check is the result's run and hash.");
  }
}

/** Refuses keyframe options, for a replay or a settling run, that can't make keyframes. */
function checkKeyframes(run) {
  if (run.keyframeBytes !== undefined && !(Number.isSafeInteger(run.keyframeBytes) && run.keyframeBytes >= 0)) {
    throw new RunError('The keyframe budget must be a whole number of bytes.');
  }
  const every = run.keyframeEvery;
  if (every !== undefined && !(Number.isSafeInteger(every) && every >= 1 && (every & (every - 1)) === 0)) {
    throw new RunError('Keyframes are kept every 1, 2, 4, 8, … generations.');
  }
}

// Yields through a MessageChannel rather than setTimeout(0), which browsers stretch to 4 ms
// once timers nest: that would cost a fast run a fifth of its time. A browser queues the
// channel's messages and the page's in the order they arrive. Node drains a channel's messages
// ahead of other ports', which would hold the page's commands back, so there setImmediate
// yields instead.
function messageYield(run) {
  if (typeof setImmediate === 'function') return (fn) => setImmediate(fn);
  const queue = [];
  return (fn) => {
    if (!run.channel) {
      run.channel = new MessageChannel();
      run.channel.port1.onmessage = () => queue.shift()();
    }
    queue.push(fn);
    run.channel.port2.postMessage(null);
  };
}

/** The last ship to leave a world, without its cells, or null if none has. */
function lastDeparture(world) {
  const last = world.departed[world.departed.length - 1];
  return last ? { generation: last.generation, shift: [...last.shift] } : null;
}
