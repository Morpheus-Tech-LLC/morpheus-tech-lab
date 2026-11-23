// SPDX-License-Identifier: Apache-2.0
//
// A Speed run (#77) on a real second thread and a real clock, Node's worker_threads standing in
// for the browser's Web Worker: its score, its result file made in the Worker, and Verify a
// result… in its own Worker. Runs are shorter than Speed's 6 seconds; the score doesn't depend on
// the length, only the generation and the ending do.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { contestById } from '../../src/unbounded/contests.js';
import { readResult, MAX_TIMELINE_POINTS } from '../../src/unbounded/canonical.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { SpeedRun, verifyInWorker } from '../../src/contests/speed.js';

const SPEED = contestById('speed-1');

/** A Node Worker dressed as a browser one: onmessage, onerror, postMessage, terminate. */
function nodeWorker(file) {
  return () => {
    const worker = new Worker(new URL(file, import.meta.url));
    return {
      postMessage: (message, transfer) => worker.postMessage(message, transfer),
      terminate: () => worker.terminate(),
      set onmessage(fn) { worker.on('message', (data) => fn({ data })); },
      set onerror(fn) { worker.on('error', fn); },
    };
  };
}
const engineWorker = nodeWorker('../unbounded/nodeWorker.js');
const verifierWorker = nodeWorker('./verifyNodeWorker.js');

/** Runs Speed for `seconds`, stopping it by hand after `stopAfterMs` if given. */
function speedRun({ seconds = 0.4, stopAfterMs } = {}) {
  const log = { stats: [], started: 0, errors: [] };
  let run;
  const ended = new Promise((resolve) => {
    run = new SpeedRun(SPEED, {
      seconds,
      createWorker: engineWorker,
      onStart: () => { log.started++; },
      onStats: (stats) => log.stats.push(stats),
      onEnd: resolve,
      onError: (message) => log.errors.push(message),
    });
  });
  run.start();
  if (stopAfterMs !== undefined) setTimeout(() => run.stop(), stopAfterMs);
  return { run, ended, log };
}

test('a timed Speed run scores the generations it completed, and its result file verifies', async () => {
  const { run, ended, log } = speedRun({ seconds: 0.5 });
  const end = await ended;
  try {
    assert.equal(log.started, 1);
    assert.deepEqual(log.errors, []);
    assert.equal(end.reason, 'deadline');
    assert.ok(end.stats.generation > 0, 'it completed some generations');
    assert.deepEqual(end.score, { generations: end.stats.generation, ms: null });
    // The chart's points: from 0, one per statistics message, and the end, climbing
    assert.equal(run.points.length, log.stats.length + 2);
    assert.deepEqual(run.points[0], [0, 0]);
    assert.deepEqual(run.points.at(-1), [end.stats.generationMs / 1000, end.stats.generation]);
    // The run itself ends after the deadline, but its last counted generation never does
    assert.ok(end.stats.generationMs <= 500 && end.stats.generationMs <= end.stats.elapsedMs, `generation ${end.stats.generation} completed at ${end.stats.generationMs} ms`);
    assert.ok(run.points.every(([t]) => t <= 0.5));
    assert.ok(run.points.every(([t, g], i) => i === 0 || (t >= run.points[i - 1][0] && g >= run.points[i - 1][1])));

    const browser = { name: 'Firefox', version: '155.0' };
    const { result, text } = await run.makeResult(browser);
    assert.equal(result.run.contest, 'speed-1');
    assert.equal(result.ending, 'deadline');
    assert.equal(result.generation, end.stats.generation);
    assert.deepEqual(result.score, end.score);
    assert.deepEqual(result.details.browser, browser);
    assert.equal(result.details.chunkSize, 16);
    assert.equal(result.cells, undefined, "a contest entry doesn't carry its cells");
    // Its timeline (#148): the chart's points, in whole milliseconds, ending at the score
    assert.deepEqual(result.details.timeline, run.points.map(([t, g]) => [Math.round(t * 1000), g]));
    assert.deepEqual(result.details.timeline[0], [0, 0]);
    assert.equal(result.details.timeline.at(-1)[1], end.stats.generation);
    assert.deepEqual(readResult(text).details.timeline, result.details.timeline);
    assert.deepEqual(readResult(text).score, end.score);

    const verdict = await verifyResult(text);
    assert.equal(verdict.verdict, 'verified', verdict.message);

    // The same file, checked in its own Worker as Verify a result… does
    const answer = await verifyInWorker(text, { createWorker: verifierWorker }).promise;
    assert.equal(answer.verdict, 'verified', answer.message);
    assert.equal(answer.contest, 'speed-1');
    assert.equal(answer.generation, end.stats.generation);
    assert.deepEqual(answer.score, end.score);
  } finally {
    run.close();
  }
});

test('a Speed run stopped by hand has no score, and no result to enter', async () => {
  const { run, ended } = speedRun({ seconds: 5, stopAfterMs: 150 });
  const end = await ended;
  try {
    assert.equal(end.reason, 'stopped');
    assert.equal(end.score, null);
    await assert.rejects(run.makeResult(), /Only a run that scored/);
  } finally {
    run.close();
  }
});

test('Stop pressed before the Worker has reported that it is running still stops the run', async () => {
  let run;
  const end = await new Promise((resolve) => {
    run = new SpeedRun(SPEED, { seconds: 5, createWorker: engineWorker, onEnd: resolve });
    run.start();
    run.stop(); // at once: the Worker hasn't even loaded yet
  });
  try {
    assert.equal(end.reason, 'stopped');
    assert.equal(end.score, null);
  } finally {
    run.close();
  }
});

test("the Worker makes a result only once the run has ended", async () => {
  const { run, ended } = speedRun({ seconds: 5 });
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));
    await assert.rejects(run.driver.result({ run: run.run }), /once the run has ended/);
  } finally {
    run.stop();
    await ended;
    run.close();
  }
});

test('Verify a result… in a Worker refuses a file that is not a result, and a hand-edited one fails', async () => {
  const refused = await verifyInWorker('{"hello": 1}', { createWorker: verifierWorker }).promise;
  assert.equal(refused.verdict, 'refused');
  assert.equal(refused.contest, null);

  const { run, ended } = speedRun({ seconds: 0.3 });
  await ended;
  try {
    const { text } = await run.makeResult();
    const edited = text.replace(/"hash": "sha256:[0-9a-f]/, (m) => `${m.slice(0, -1)}${m.endsWith('0') ? '1' : '0'}`);
    assert.notEqual(edited, text);
    const answer = await verifyInWorker(edited, { createWorker: verifierWorker }).promise;
    assert.equal(answer.verdict, 'mismatch', answer.message);
  } finally {
    run.close();
  }
});

test("a run's timeline is thinned evenly, keeping both ends, should it pass what a file may hold (#148)", () => {
  const run = Object.create(SpeedRun.prototype); // only its points: no Worker
  run.points = Array.from({ length: 2500 }, (_, i) => [i / 400, i]);
  const timeline = run.timeline();
  assert.equal(timeline.length, MAX_TIMELINE_POINTS);
  assert.deepEqual(timeline[0], [0, 0]);
  assert.deepEqual(timeline.at(-1), [6248, 2499]);
  assert.ok(timeline.every(([ms, g], i) => i === 0 || (ms > timeline[i - 1][0] && g > timeline[i - 1][1])));
  run.points = [[0, 0], [0.2504, 31], [0.4999, 60]];
  assert.deepEqual(run.timeline(), [[0, 0], [250, 31], [500, 60]], 'whole milliseconds');
});
