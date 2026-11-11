// SPDX-License-Identifier: Apache-2.0
//
// The driver and the run together, on a real second thread and a real clock: Node's
// worker_threads standing in for the browser's Web Worker. Timings here are loose, to hold on
// a slow or busy machine.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { EngineDriver } from '../../src/unbounded/driver.js';
import { GROWING, randomSeed } from './helpers.js';

/** A Node Worker dressed as a browser one: onmessage, onerror, postMessage, terminate. */
function nodeWorker() {
  const worker = new Worker(new URL('./nodeWorker.js', import.meta.url));
  return {
    postMessage: (message, transfer) => worker.postMessage(message, transfer),
    terminate: () => worker.terminate(),
    set onmessage(fn) { worker.on('message', (data) => fn({ data })); },
    set onerror(fn) { worker.on('error', fn); },
  };
}

// A rule that keeps growing, from a seed big enough that the engine works flat out
const seed = () => Int32Array.from(randomSeed({ min: [-8, -8, -8], size: [16, 16, 16], randomSeed: 3 }).flat());
const world = { rules: GROWING, chunkSize: 16 };

/** A driver whose callbacks are recorded, with a promise for the run's end. */
function recorded() {
  const log = { stats: [], states: [], errors: [] };
  let ended;
  log.ended = new Promise((resolve) => { ended = resolve; });
  const driver = new EngineDriver({
    createWorker: nodeWorker,
    onStats: (stats) => log.stats.push({ at: performance.now(), stats }),
    onState: (state, stats, reason) => {
      log.states.push({ at: performance.now(), state, stats, reason });
      if (state === 'ended') ended({ stats, reason });
    },
    onError: (message) => log.errors.push(message),
  });
  return { driver, log };
}

test('a timed run in a Worker ends at its deadline, while this thread stays responsive', async () => {
  const { driver, log } = recorded();
  // This thread's timer, ticking through the run: long gaps would mean it was blocked
  let last = performance.now();
  let longestGap = 0;
  const ticker = setInterval(() => {
    const now = performance.now();
    longestGap = Math.max(longestGap, now - last);
    last = now;
  }, 5);
  try {
    const started = performance.now();
    driver.start({ world, seed: seed(), run: { kind: 'timed', seconds: 1 } });
    const { stats, reason } = await log.ended;
    const took = performance.now() - started;

    assert.equal(reason, 'deadline');
    assert.ok(stats.generation > 0, 'some generations completed');
    assert.ok(stats.elapsedMs >= 1000, `ran ${stats.elapsedMs} ms`);
    assert.ok(took < 5000, `ended ${took} ms after the start`);
    assert.ok(longestGap < 250, `this thread was blocked for ${longestGap} ms`);

    // About four statistics a second, never closer together than the interval allows
    assert.ok(log.stats.length >= 2 && log.stats.length <= 5, `${log.stats.length} statistics in 1 s`);
    assert.ok(log.stats.every((s) => s.stats.rate > 0));

    // The final generation stays available
    const snapshot = await driver.snapshot();
    assert.equal(snapshot.generation, stats.generation);
    assert.equal(snapshot.cells.length, 3 * stats.live);
    assert.deepEqual(log.errors, []);
  } finally {
    clearInterval(ticker);
    driver.close();
  }
});

test('an open-ended run in a Worker pauses, steps, resumes and stops', async () => {
  const { driver, log } = recorded();
  const nextState = () => new Promise((resolve) => {
    const count = log.states.length;
    const check = setInterval(() => {
      if (log.states.length > count) {
        clearInterval(check);
        resolve(log.states.at(-1));
      }
    }, 1);
  });
  try {
    driver.start({ world, seed: seed(), run: { kind: 'open', paused: true } });
    assert.equal((await nextState()).state, 'paused');

    driver.step();
    const stepped = await nextState();
    assert.equal(stepped.stats.generation, 1);

    driver.resume();
    assert.equal((await nextState()).state, 'running');
    await new Promise((resolve) => setTimeout(resolve, 200));
    driver.pause();
    const paused = await nextState();
    assert.equal(paused.state, 'paused');
    assert.ok(paused.stats.generation > 1);

    const snapshot = await driver.snapshot();
    assert.equal(snapshot.generation, paused.stats.generation, 'nothing ran while paused');

    driver.stop();
    const { reason, stats } = await log.ended;
    assert.equal(reason, 'stopped');
    assert.equal(stats.generation, paused.stats.generation);
  } finally {
    driver.close();
  }
});

test('the driver reports a refused start, and rejects a snapshot when the run is closed', async () => {
  const { driver, log } = recorded();
  driver.start({ world: { rules: { birth: [0], survival: [] } }, seed: new Int32Array(0), run: { kind: 'open' } });
  await assert.rejects(driver.snapshot(), /nothing to snapshot/);
  assert.match(log.errors[0], /B0/);

  const pending = driver.snapshot();
  driver.close();
  await assert.rejects(pending, /closed/);
});
