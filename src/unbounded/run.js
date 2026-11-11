// SPDX-License-Identifier: Apache-2.0
//
// The run loop for the unbounded engine: it owns one World and steps it, either against a
// deadline (a timed run, for the contests) or until it is stopped (an open-ended run, for
// Explore). run.worker.js runs it in a Web Worker; driver.js is its other end, on the page.
//
// The loop steps for a short slice of time, then yields, so messages from the page (pause,
// step, stop, snapshot) are handled between generations. A generation itself can't be
// interrupted, and doesn't need to be: a timed run's deadline is checked once each generation
// is computed and before it is committed (step()'s veto), so a generation that finishes after
// the deadline is discarded, and the count is the generations completed before it.
//
// Messages to the run:
//   {type: 'start', world: {rules, chunkSize?, slabBytes?, limits?, arena?}, seed: Int32Array,
//    run: {kind: 'timed', seconds} | {kind: 'open', paused?, rate?, settle?}, generations?}
//     settle: end when every cell has died ('died') or the cells repeat, in place, those of
//     an earlier generation ('repeat', with the cycle: {from, period}; the generation count
//     goes back to `from`, whose cells they are)
//   {type: 'pause'} {type: 'resume'} {type: 'step'}   open-ended runs only
//   {type: 'rate', rate}                                open-ended runs only; null for flat out
//   {type: 'stop'}
//   {type: 'cycle', id, budget}                         after 'repeat': every generation of the cycle
//   {type: 'snapshot', id, budget?, slice?: {axis, index}}
//     cells, or chunks past `budget` live cells; with a slice, only those in the plane where
//     coordinate `axis` (0, 1, 2) equals `index`
// Messages from the run:
//   {type: 'state', state: 'running' | 'paused' | 'ended', reason?, cycle?, stats}
//   {type: 'cycle', id, from, period, frames: Int32Array[] | null}   null past `budget` cells
//   {type: 'stats', stats}                              at most every STATS_INTERVAL_MS
//   {type: 'snapshot', id, generation, live, chunkSize, slice?, cells?: Int32Array, chunks?: Int32Array}
//     cells as x, y, z triples, or chunks as x, y, z, live quadruples (World.chunkList()); the
//     array's buffer is transferred
//   {type: 'error', id?, message}
//
// Statistics go out on their own at most four times a second, and with every change of state.
// Snapshots go out only when asked for, so a run with no view attached pays nothing for them.
//
// Nothing here imports `state` or touches the page.

import { World, STOP_REASONS } from './world.js';
import { step as stepWorld } from './step.js';

export const STATS_INTERVAL_MS = 250;
/** How long the loop steps before yielding to messages, unless one generation takes longer. */
export const SLICE_MS = 16;
/** How many generations back a settling run looks for a repeat: the longest period it spots. */
export const REPEAT_WINDOW = 10_000;

/** The reasons a run can end: the engine's limits, plus the run's own. */
export const END_REASONS = [
  ...STOP_REASONS,
  'stopped', // stopped by hand
  'deadline', // a timed run reached its deadline
  'generation-limit', // the run completed the generations it was given
  'died', // a settling run: no live cells remain
  'repeat', // a settling run: the cells repeat, in place, an earlier generation's
  'error', // a fault in the engine; the message says what
];

/**
 * @typedef {object} Stats
 * @property {number} generation - generations completed
 * @property {number} elapsedMs - time spent running, without pauses
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
 */

export class Run {
  /**
   * @param {object} host
   * @param {(message: object, transfer?: Transferable[]) => void} host.post
   * @param {() => number} [host.now] - milliseconds
   * @param {(fn: () => void) => void} [host.yieldThen] - runs fn once pending messages are handled
   * @param {(ms: number, fn: () => void) => void} [host.wait] - runs fn after ms
   * @param {typeof stepWorld} [host.step] - the tests wrap it to move a fake clock
   */
  constructor({ post, now = () => performance.now(), yieldThen, wait = (ms, fn) => setTimeout(fn, ms), step = stepWorld }) {
    this.post = post;
    this.now = now;
    this.yieldThen = yieldThen ?? messageYield(this);
    this.wait = wait;
    this.stepWorld = step;
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
      case 'pause': return this.openOnly('pause') && this.state === 'running' && this.setState('paused');
      case 'resume': return this.openOnly('resume') && this.state === 'paused' && this.setState('running');
      case 'step': return this.openOnly('step') && this.state === 'paused' && this.stepByHand();
      case 'rate': return this.openOnly('rate') && this.live() && this.changeRate(message.rate);
      case 'stop': return this.live() && this.end('stopped');
      case 'snapshot': return this.snapshot(message.id, message.budget, message.slice);
      case 'cycle': return this.cycle(message.id, message.budget);
      default: throw new RunError(`Unknown message ${JSON.stringify(message?.type)}.`);
    }
  }

  start({ world: options, seed, run, generations = Infinity }) {
    if (this.state !== 'idle') throw new RunError('This run has already started; start another Worker.');
    if (!(seed instanceof Int32Array) || seed.length % 3) {
      throw new RunError('The seed must be an Int32Array of x, y, z triples.');
    }
    const timed = run?.kind === 'timed';
    if (timed && !(run.seconds > 0)) throw new RunError('A timed run needs a number of seconds.');
    if (!timed && run?.kind !== 'open') throw new RunError("The run's kind must be 'timed' or 'open'.");
    if (generations !== Infinity && !(Number.isInteger(generations) && generations >= 0)) {
      throw new RunError('The generations must be a whole number.');
    }

    const settle = !timed && Boolean(run.settle);
    const world = new World({ ...options, fingerprint: settle });
    world.setCells(triples(seed));
    this.world = world;
    this.kind = run.kind;
    this.settle = settle;
    this.cycleFound = null;
    if (settle) {
      this.seen = new Map(); // fingerprint -> generation, for the last REPEAT_WINDOW generations
      this.order = [];
      this.remember();
    }
    this.generations = generations;
    this.livePeak = world.liveCells;
    this.runningMs = 0;
    this.runningSince = null;

    const now = this.now();
    this.window = { at: now, generation: 0, runningMs: 0 };
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
    const live = this.world.liveCells;
    if (live > this.livePeak) this.livePeak = live;
    if (this.rate) this.dueAt = Math.max(this.dueAt + 1000 / this.rate, this.now());
    if (this.settle && this.settled(live)) return true;
    if (this.world.generation >= this.generations) {
      this.end('generation-limit');
      return true;
    }
    return false;
  }

  /** A settling run ends once every cell has died or the cells repeat. @returns {boolean} */
  settled(live) {
    if (live === 0) {
      this.end('died');
      return true;
    }
    const key = this.world.fingerprint();
    const from = this.seen.get(key);
    if (from !== undefined) {
      this.cycleFound = { from, period: this.world.generation - from };
      // The cells now are generation `from`'s, so the count goes back there: a settled run
      // reports the generation its cycle began, where its cells stay or keep returning
      this.world.generation = from;
      this.end('repeat');
      return true;
    }
    this.remember(key);
    return false;
  }

  remember(key = this.world.fingerprint()) {
    this.seen.set(key, this.world.generation);
    this.order.push(key);
    if (this.order.length > REPEAT_WINDOW) this.seen.delete(this.order.shift());
  }

  /**
   * Every generation of the cycle a 'repeat' found, as cells, starting with the current one
   * (the cycle's first). The world steps once round the cycle to make them, which brings it
   * back to the same cells; its generation count is put back. Null frames past `budget` cells
   * in all.
   */
  cycle(id, budget = Infinity) {
    if (!this.cycleFound) throw new RunError('The run has not settled into a repeating cycle.');
    const { world } = this;
    const { from, period } = this.cycleFound;
    const reason = world.stopReason;
    const generation = world.generation;
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
    }
    this.post({ type: 'cycle', id, from, period, frames }, frames ? frames.map((f) => f.buffer) : []);
  }

  stepByHand() {
    if (this.world.generation >= this.generations) return this.end('generation-limit');
    const started = this.now();
    if (!this.advance()) {
      this.runningMs += this.now() - started;
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
    if (state === 'running') this.schedule();
  }

  end(reason) {
    if (this.world.stopReason === null) this.world.stop(reason);
    this.setState('ended', reason);
  }

  sendState(reason) {
    const message = { type: 'state', state: this.state, stats: this.stats() };
    if (reason) message.reason = reason;
    if (reason === 'repeat') message.cycle = this.cycleFound;
    this.post(message);
  }

  maybeStats() {
    if (this.now() - this.lastStatsAt >= STATS_INTERVAL_MS) this.post({ type: 'stats', stats: this.stats() });
  }

  /** The statistics now; the next ones on their own come at least STATS_INTERVAL_MS later. */
  stats() {
    const world = this.world;
    const now = this.now();
    const runningMs = this.runningMs + (this.state === 'running' ? now - this.runningSince : 0);
    let rate = 0;
    if (this.state === 'running') {
      const ms = runningMs - this.window.runningMs;
      if (ms > 0) rate = ((world.generation - this.window.generation) * 1000) / ms;
      this.window = { at: now, generation: world.generation, runningMs };
    }
    this.lastStatsAt = now;
    return {
      generation: world.generation,
      elapsedMs: runningMs,
      rate,
      live: world.liveCells,
      livePeak: this.livePeak,
      chunks: world.chunkCount,
      chunksPeak: world.chunksPeak,
      chunksCreated: world.chunksCreated,
      extent: world.extent(),
      memoryBytes: world.memoryBytes,
      usedBytes: world.usedBytes,
    };
  }

  /**
   * Sends the live cells, or, if there are more than `budget` of them, the chunks that hold
   * them: a view can't draw more cells than its budget smoothly, and a chunk list is far smaller.
   * A slice limits both to one plane.
   */
  snapshot(id, budget = Infinity, slice = null) {
    if (!this.world) throw new RunError('There is nothing to snapshot before the run starts.');
    if (slice && !([0, 1, 2].includes(slice.axis) && Number.isInteger(slice.index))) {
      throw new RunError('A slice is {axis: 0, 1 or 2, index: a whole number}.');
    }
    const { world } = this;
    const live = world.liveCells;
    const message = { type: 'snapshot', id, generation: world.generation, live, chunkSize: world.n };
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

  live() {
    return this.state === 'running' || this.state === 'paused';
  }

  openOnly(what) {
    if (!this.world) throw new RunError(`There is nothing to ${what} before the run starts.`);
    if (this.kind !== 'open') throw new RunError(`A timed run can't ${what === 'rate' ? 'change its rate' : what}; it can only be stopped.`);
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

function* triples(flat) {
  for (let i = 0; i < flat.length; i += 3) yield [flat[i], flat[i + 1], flat[i + 2]];
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
