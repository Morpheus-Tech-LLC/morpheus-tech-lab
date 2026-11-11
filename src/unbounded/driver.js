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
   * @param {(state: string, stats: import('./run.js').Stats, reason?: string) => void} [options.onState]
   *   - 'running', 'paused' or 'ended' (with the reason, one of run.js's END_REASONS)
   * @param {(message: string) => void} [options.onError] - a command refused, or a fault
   * @param {() => Worker} [options.createWorker] - the tests pass an in-process stand-in
   */
  constructor({ onStats, onState, onError, createWorker = browserWorker } = {}) {
    this.onStats = onStats ?? (() => {});
    this.onState = onState ?? (() => {});
    this.onError = onError ?? (() => {});
    this.createWorker = createWorker;
    this.worker = null;
    this.pending = new Map(); // snapshot id -> {resolve, reject}
    this.nextId = 1;
  }

  /**
   * Starts a run in a new Worker, ending any run before it.
   * @param {object} config
   * @param {object} config.world - World options: {rules, chunkSize?, slabBytes?, limits?, arena?}
   * @param {Int32Array} config.seed - live cells as x, y, z triples. It is transferred: the
   *   page's copy is emptied.
   * @param {{kind: 'timed', seconds: number} | {kind: 'open', paused?: boolean, rate?: number}} config.run
   * @param {number} [config.generations] - end the run after this many generations
   */
  start({ world, seed, run, generations }) {
    this.close();
    const worker = this.createWorker();
    worker.onmessage = (event) => this.receive(event.data);
    worker.onerror = (event) => this.onError(event?.message ?? 'The engine Worker failed.');
    this.worker = worker;
    const message = { type: 'start', world, seed, run };
    if (generations !== undefined) message.generations = generations;
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
   * The live cells, now. Costs the engine a pass over its chunks, so ask only when there is a
   * view to draw them.
   * @returns {Promise<{generation: number, cells: Int32Array}>}
   */
  snapshot() {
    if (!this.worker) return Promise.reject(new Error('There is no run to snapshot.'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.send({ type: 'snapshot', id });
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
        return this.onState(message.state, message.stats, message.reason);
      case 'snapshot':
        return this.settle(message.id, (p) => p.resolve({ generation: message.generation, cells: message.cells }));
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
