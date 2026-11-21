// SPDX-License-Identifier: Apache-2.0
//
// The page's side of an unbounded run: it starts the engine in a Web Worker (run.worker.js),
// sends it commands and hands its messages to callbacks. The page never steps the engine
// itself, so it stays responsive however hard the engine works. Message formats are in run.js.
//
// Each start() gets a fresh Worker, and the previous one is terminated, which frees all of its
// memory at once.

/** The browser's Worker for run.worker.js. Vite bundles it from this exact form. */
function browserWorker() {
  return new Worker(new URL('./run.worker.js', import.meta.url), { type: 'module' });
}

export class EngineDriver {
  /**
   * @param {object} [options]
   * @param {(stats: import('./run.js').Stats) => void} [options.onStats] - at most four times a
   *   second while running
   * @param {(state: string, stats: import('./run.js').Stats, reason?: string, cycle?: {from: number, period: number},
   *   departures?: {generation: number, period: number, shift: number[]}[]) => void} [options.onState]
   *   - 'running', 'paused', 'seeking' (a replay) or 'ended' (with the reason, one of run.js's
   *   END_REASONS, for 'repeat' and 'emits' the cycle it found, and in a world where ships leave
   *   at the edge, every departure, without its cells)
   * @param {(replayed: {generation: number, hash: string | null, matches: boolean | null, reason: string}) => void} [options.onReplayed]
   *   - once, when a replay first ends: at its generation, the hash of its cells and whether
   *   it is the check's; before it, why (run.js)
   * @param {(message: string) => void} [options.onError] - a command refused, or a fault
   * @param {() => Worker} [options.createWorker] - the tests pass an in-process stand-in
   */
  constructor({ onStats, onState, onReplayed, onError, createWorker = browserWorker } = {}) {
    this.onStats = onStats ?? (() => {});
    this.onState = onState ?? (() => {});
    this.onReplayed = onReplayed ?? (() => {});
    this.onError = onError ?? (() => {});
    this.createWorker = createWorker;
    this.worker = null;
    this.pending = new Map(); // snapshot id -> {resolve, reject}
    this.nextId = 1;
  }

  /**
   * Starts a run in a new Worker, ending any run before it.
   * @param {object} config
   * @param {object} config.world - World options: {rules, chunkSize?, slabBytes?, limits?, arena?, wrap?, walls?}
   * @param {Int32Array} config.seed - live cells as x, y, z triples. It is transferred: the
   *   page's copy is emptied.
   * @param {{kind: 'timed', seconds: number} | {kind: 'open', paused?: boolean, rate?: number,
   *   settle?: boolean, history?: boolean}
   *   | {kind: 'replay', paused?: boolean, rate?: number, check?: {run: object, hash: string},
   *   keyframeBytes?: number, keyframeEvery?: number}} config.run
   * @param {number} [config.generations] - end the run after this many generations; a replay's
   *   is the result's generation, and required
   * @param {number} [config.from] - the seed is this generation of an earlier run: count from it
   */
  start({ world, seed, run, generations, from }) {
    this.close();
    const worker = this.createWorker();
    worker.onmessage = (event) => this.receive(event.data);
    worker.onerror = (event) => this.onError(event?.message ?? 'The engine Worker failed.');
    this.worker = worker;
    const message = { type: 'start', world, seed, run };
    if (generations !== undefined) message.generations = generations;
    if (from !== undefined) message.from = from;
    worker.postMessage(message, seed?.buffer ? [seed.buffer] : []);
  }

  pause() { this.send({ type: 'pause' }); }
  resume() { this.send({ type: 'resume' }); }
  /** One generation, while an open-ended run is paused. */
  step() { this.send({ type: 'step' }); }
  /** @param {number | null} rate - generations per second at most, or null for flat out */
  setRate(rate) { this.send({ type: 'rate', rate }); }
  stop() { this.send({ type: 'stop' }); }

  /**
   * A replay only: goes to a generation, from the nearest keyframe. A later seek takes over
   * from this one, which then resolves with `superseded`.
   * @param {number} generation - past the replay's last, it goes to its last
   * @returns {Promise<{generation: number, superseded?: boolean}>}
   */
  seek(generation) {
    if (!this.worker) return Promise.reject(new Error('There is no run.'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.send({ type: 'seek', id, generation });
    });
  }

  /**
   * The live cells, now. Costs the engine a pass over its chunks, so ask only when there is a
   * view to draw them.
   * @param {object} [options]
   * @param {number} [options.budget] - past this many live cells, send the chunks instead
   * @param {{axis: number, index: number}} [options.slice] - only the plane where coordinate
   *   `axis` (0, 1, 2 for x, y, z) equals `index`
   * @param {boolean} [options.stats] - the statistics of the same moment, too
   * @returns {Promise<{generation: number, live: number, chunkSize: number, stats?: object,
   *   cells?: Int32Array, chunks?: Int32Array}>} cells as x, y, z triples, or chunks as x, y, z,
   *   live quadruples
   */
  snapshot({ budget, slice, stats } = {}) {
    if (!this.worker) return Promise.reject(new Error('There is no run to snapshot.'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const message = { type: 'snapshot', id };
      if (budget !== undefined) message.budget = budget;
      if (slice) message.slice = slice;
      if (stats) message.stats = true;
      this.send(message);
    });
  }

  /**
   * After a settling run ends with 'repeat': every generation of its cycle, as cells.
   * @param {object} [options]
   * @param {number} [options.budget] - past this many cells in all, frames is null
   * @returns {Promise<{from: number, period: number, frames: Int32Array[] | null}>}
   */
  cycle({ budget } = {}) {
    if (!this.worker) return Promise.reject(new Error('There is no run.'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.send({ type: 'cycle', id, budget });
    });
  }

  /**
   * A run started with `history`: the live cells of each generation so far, from generation 0.
   * @returns {Promise<{live: Uint32Array}>}
   */
  history() {
    if (!this.worker) return Promise.reject(new Error('There is no run.'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.send({ type: 'history', id });
    });
  }

  /**
   * After the run has ended: its result file, made in the Worker from its last complete
   * generation (run.js), so the page never holds the cells.
   * @param {object} options
   * @param {object} options.run - the run's definition (canonical.js)
   * @param {object} [options.score] - the contest's score
   * @param {object} [options.details] - elapsedMs, stats, browser; the Worker adds the chunk size
   * @returns {Promise<object>} the result, for resultText()
   */
  result({ run, score, details }) {
    if (!this.worker) return Promise.reject(new Error('There is no run.'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const message = { type: 'result', id, run };
      if (score !== undefined) message.score = score;
      if (details !== undefined) message.details = details;
      this.send(message);
    });
  }

  /** Terminates the Worker, if any, and with it the run and its memory. */
  close() {
    if (!this.worker) return;
    this.worker.terminate();
    this.worker = null;
    for (const { reject } of this.pending.values()) reject(new Error('The run was closed.'));
    this.pending.clear();
  }

  send(message) {
    if (!this.worker) {
      this.onError('There is no run.');
      return;
    }
    this.worker.postMessage(message);
  }

  receive(message) {
    switch (message.type) {
      case 'stats':
        return this.onStats(message.stats);
      case 'state':
        return this.onState(message.state, message.stats, message.reason, message.cycle, message.departures);
      case 'result':
        return this.settle(message.id, (p) => p.resolve(message.result));
      case 'seeked':
        return this.settle(message.id, (p) => p.resolve(message.superseded
          ? { generation: message.generation, superseded: true }
          : { generation: message.generation }));
      case 'replayed': {
        const { type, ...replayed } = message;
        return this.onReplayed(replayed);
      }
      case 'cycle':
      case 'history':
      case 'snapshot':
        return this.settle(message.id, (p) => {
          const { type, id, ...snapshot } = message;
          p.resolve(snapshot);
        });
      case 'error':
        if (message.id !== undefined && this.pending.has(message.id)) {
          return this.settle(message.id, (p) => p.reject(new Error(message.message)));
        }
        return this.onError(message.message);
    }
  }

  settle(id, fn) {
    const promise = this.pending.get(id);
    if (!promise) return;
    this.pending.delete(id);
    fn(promise);
  }
}
