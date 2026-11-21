// SPDX-License-Identifier: Apache-2.0
//
// One Discovery run (#94): an entry's seed and rules, run in its contest's arena in a Web Worker
// until the pattern settles, reaches the arena's edge or runs out the budget, then its score and
// its result file: Methuselah's (#41) and Classic Methuselah's (#100), whose world lets ships
// leave at the arena's edge (departures.js), so its run ends with its departures. It holds no DOM, so the tests drive it with a Node worker_threads Worker; contests/panel.js
// shows it.
//
// Nothing here depends on time: the run settles through settle.js, as a replay of its result file
// does, so any machine gets the same ending and score. The Worker keeps the live cells of every
// generation for the chart, and makes the result file, so the page never holds the cells.

import { EngineDriver } from '../unbounded/driver.js';
import { runFor, methuselahScore, departuresFor } from '../unbounded/contests.js';
import { resultText, worldOptions } from '../unbounded/canonical.js';

/**
 * The engine's own memory limit for a Discovery run. It isn't part of the run's definition: a run
 * that reaches it ends without a score. The 64³ arena holds at most 262,144 cells, so a run needs
 * a few MB for its cells and its keyframes; the rest is headroom.
 */
export const DISCOVERY_MEMORY_MB = 512;

/** How each kind of Discovery contest scores a run that has ended, or null for no score. */
const SCORES = {
  methuselah: (contest, { reason, stats, cycle }) => methuselahScore(contest, {
    ending: reason, generation: stats.generation, period: cycle?.period,
  }),
};

export class DiscoveryRun {
  /**
   * @param {import('../unbounded/contests.js').Contest} contest - a Discovery contest
   * @param {{rules: object, seed: number[][]}} entry - checked by runFor(), which throws a
   *   ResultError, saying why, for one that can't run
   * @param {object} [options]
   * @param {(stats: object) => void} [options.onStats] - while it runs, at most four times a second
   * @param {(stats: object) => void} [options.onStart] - once the Worker has started it
   * @param {(end: {stats: object, reason: string, cycle: object | null, score: object | null,
   *   departures: {generation: number, period: number, shift: number[]}[] | null}) => void} [options.onEnd] -
   *   departures: every ship that left, for a contest where ships leave at the edge, or null
   * @param {(message: string) => void} [options.onError]
   * @param {() => Worker} [options.createWorker] - the tests pass a Node one
   */
  constructor(contest, entry, { onStats, onStart, onEnd, onError, createWorker } = {}) {
    if (!SCORES[contest.kind]) throw new Error(`${contest.title} isn't a Discovery contest this page can run.`);
    this.contest = contest;
    this.run = runFor(contest, entry);
    this.status = 'idle'; // then 'running', then 'ended'
    // [generation, live cells] from each statistics message, for the chart while it runs;
    // replaced by every generation's once it has ended (loadHistory())
    this.points = [[0, this.run.seed.length]];
    this.end = null; // {stats, reason, cycle, score}
    const callbacks = { onStats, onStart, onEnd, onError };
    this.driver = new EngineDriver({
      createWorker,
      onStats: (stats) => {
        if (this.status !== 'running') return;
        this.addPoint(stats);
        callbacks.onStats?.(stats);
      },
      onState: (state, stats, reason, cycle, departures) => {
        if (state === 'running' && this.status === 'idle') {
          this.status = 'running';
          callbacks.onStart?.(stats);
        } else if (state === 'ended' && this.status !== 'ended') {
          this.status = 'ended';
          const end = { stats, reason, cycle: cycle ?? null, departures: departures ?? null };
          end.score = SCORES[this.contest.kind](this.contest, end);
          this.end = end;
          callbacks.onEnd?.(end);
        }
      },
      onError: (message) => callbacks.onError?.(message),
    });
  }

  addPoint(stats) {
    const last = this.points[this.points.length - 1];
    if (stats.generation > last[0]) this.points.push([stats.generation, stats.live]);
  }

  /** The contest's budget: the run ends there unsettled. */
  get budget() {
    return this.run.limits.generations;
  }

  start() {
    if (this.status !== 'idle') throw new Error('This run has already started.');
    const { run, contest } = this;
    this.driver.start({
      world: {
        ...worldOptions(run, { chunkSize: contest.chunkSize, memory: DISCOVERY_MEMORY_MB * 1024 * 1024 }),
        departures: departuresFor(run),
      },
      seed: Int32Array.from(run.seed.flat()),
      run: { kind: 'open', settle: true, history: true },
      generations: run.limits.generations,
    });
  }

  /**
   * Ends the run by hand: it keeps its last generation, and has no score. It works from the
   * moment start() is called, as SpeedRun's does.
   */
  stop() {
    if (this.status !== 'ended' && this.driver.worker) this.driver.stop();
  }

  /**
   * Once the run has ended: the chart's points become every generation's live cells, from 0 to
   * where the run ended (a settled run's, to where its cycle began).
   * @returns {Promise<[number, number][]>}
   */
  async loadHistory() {
    if (this.status !== 'ended') throw new Error('The history is read once the run has ended.');
    const { live } = await this.driver.history();
    this.points = Array.from(live, (cells, generation) => [generation, cells]);
    return this.points;
  }

  /**
   * The result file of a run that scored.
   * @param {{name: string, version: string} | null} [browser]
   * @returns {Promise<{result: object, text: string}>}
   */
  async makeResult(browser = null) {
    if (!this.end?.score) throw new Error('Only a run that scored has a result to enter.');
    // The ships that left are counted for the page: the file lists the departures themselves
    const { score, stats: { departed, lastDeparture, ...stats } } = this.end;
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
