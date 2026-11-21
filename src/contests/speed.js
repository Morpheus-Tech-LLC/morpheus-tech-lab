// SPDX-License-Identifier: Apache-2.0
//
// One Speed run (#77): the contest's seed and rules, timed in a Web Worker for its seconds, with
// its ceiling as the run's generation limit, then its score and its result file. It holds no DOM,
// so the tests drive it with a Node worker_threads Worker; contests/panel.js shows it.
//
// The Worker's clock decides the score: a timed run counts only the generations completed before
// its deadline (run.js). The result file is made in the Worker too (driver.result()), so the
// page never holds the cells of a large generation.

import { EngineDriver } from '../unbounded/driver.js';
import { runFor, speedScore } from '../unbounded/contests.js';
import { resultText } from '../unbounded/canonical.js';

/**
 * The engine's own memory limit for a Speed run. It isn't part of the run's definition: a run
 * that reaches it ends without a score. Reaching the ceiling takes about 1 GB of cells.
 */
export const SPEED_MEMORY_MB = 2048;
/** Endings that score. */
export const SCORING_ENDINGS = ['deadline', 'generation-limit'];

export class SpeedRun {
  /**
   * @param {import('../unbounded/contests.js').Contest} contest - a Speed contest
   * @param {object} [options]
   * @param {(stats: object) => void} [options.onStats] - while it runs, at most four times a second
   * @param {(stats: object) => void} [options.onStart] - once the Worker has started it
   * @param {(end: {stats: object, reason: string, score: object | null}) => void} [options.onEnd]
   * @param {(message: string) => void} [options.onError]
   * @param {() => Worker} [options.createWorker] - the tests pass a Node one
   * @param {number} [options.seconds] - the tests run shorter; a real run takes the contest's
   */
  constructor(contest, { onStats, onStart, onEnd, onError, createWorker, seconds = contest.seconds } = {}) {
    this.contest = contest;
    this.run = runFor(contest);
    this.seconds = seconds;
    this.status = 'idle'; // then 'running', then 'ended'
    // [seconds, generation] from each statistics message, on the Worker's clock, for the chart
    this.points = [[0, 0]];
    this.end = null; // {stats, reason, score}
    const callbacks = { onStats, onStart, onEnd, onError };
    this.driver = new EngineDriver({
      createWorker,
      onStats: (stats) => {
        if (this.status !== 'running') return;
        this.points.push([stats.generationMs / 1000, stats.generation]);
        callbacks.onStats?.(stats);
      },
      onState: (state, stats, reason) => {
        if (state === 'running' && this.status === 'idle') {
          this.status = 'running';
          callbacks.onStart?.(stats);
        } else if (state === 'ended' && this.status !== 'ended') {
          this.status = 'ended';
          const score = SCORING_ENDINGS.includes(reason)
            ? speedScore(this.contest, stats.generation, stats.generationMs)
            : null;
          // When the last counted generation was completed: a run the deadline ended ran on a
          // little, computing a generation that finished too late and was discarded
          this.points.push([stats.generationMs / 1000, stats.generation]);
          this.end = { stats, reason, score };
          callbacks.onEnd?.(this.end);
        }
      },
      onError: (message) => callbacks.onError?.(message),
    });
  }

  start() {
    if (this.status !== 'idle') throw new Error('This Speed run has already started.');
    const { run, contest } = this;
    this.driver.start({
      world: { rules: run.rules, chunkSize: contest.chunkSize, limits: { memory: SPEED_MEMORY_MB * 1024 * 1024 } },
      seed: Int32Array.from(run.seed.flat()),
      run: { kind: 'timed', seconds: this.seconds },
      generations: run.limits.generations,
    });
  }

  /**
   * Ends the run by hand: it keeps its last generation, and has no score. It works from the
   * moment start() is called: the Worker takes the messages in order, so a stop sent before it
   * has reported that it is running still reaches the run, just after it starts.
   */
  stop() {
    if (this.status !== 'ended' && this.driver.worker) this.driver.stop();
  }

  /**
   * The result file of a run that scored.
   * @param {{name: string, version: string} | null} [browser]
   * @returns {Promise<{result: object, text: string}>}
   */
  async makeResult(browser = null) {
    if (!this.end?.score) throw new Error('Only a run that scored has a result to enter.');
    const { stats, score } = this.end;
    const result = await this.driver.result({
      run: this.run,
      score,
      details: { elapsedMs: stats.elapsedMs, stats, browser },
    });
    return { result, text: resultText(result) };
  }

  /** Terminates the Worker, and with it the run's memory. */
  close() {
    this.driver.close();
  }
}

/**
 * Checks a result file in a Worker (Verify a result), so a long replay never blocks the page.
 * @param {string} text - the file's contents, untrusted
 * @param {object} [options]
 * @param {() => Worker} [options.createWorker]
 * @returns {{promise: Promise<object>, cancel: () => void}} the Worker's answer (verify.worker.js)
 */
export function verifyInWorker(text, { createWorker = verifyWorker } = {}) {
  const worker = createWorker();
  let settle;
  const promise = new Promise((resolve) => { settle = resolve; });
  const finish = (answer) => {
    worker.terminate();
    settle(answer);
  };
  worker.onmessage = (event) => finish(event.data);
  worker.onerror = (event) => finish({ verdict: 'error', message: event?.message ?? 'The verifier failed.' });
  worker.postMessage({ text });
  return { promise, cancel: () => finish({ verdict: 'cancelled', message: 'Cancelled.' }) };
}

/** The browser's Worker for verify.worker.js. Vite bundles it from this exact form. */
function verifyWorker() {
  return new Worker(new URL('../unbounded/verify.worker.js', import.meta.url), { type: 'module' });
}
