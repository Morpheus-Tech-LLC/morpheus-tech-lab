// SPDX-License-Identifier: Apache-2.0
//
// The driver and the run together, on a real second thread and a real clock: Node's
// worker_threads standing in for the browser's Web Worker. Timings here are loose, to hold on
// a slow or busy machine.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { EngineDriver } from '../../src/unbounded/driver.js';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { normaliseRun, resultOf } from '../../src/unbounded/canonical.js';
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

test('a replay in a Worker seeks, and confirms the result\'s hash at its generation', async () => {
  // A result at generation 30, from a straight run on this thread
  const cells = randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 });
  const run = normaliseRun({ contest: null, rules: GROWING, seed: cells, arena: null, limits: { cells: null, extent: null, generations: null } });
  const straight = new World({ rules: GROWING });
  straight.setCells(cells);
  const at = {};
  for (let g = 0; g <= 30; g++) {
    at[g] = straight.liveCells;
    if (g < 30) step(straight);
  }
  const result = await resultOf(straight, { run, ending: 'stopped' });

  let replayedNow;
  const replayed = new Promise((resolve) => { replayedNow = resolve; });
  const driver = new EngineDriver({ createWorker: nodeWorker, onReplayed: (r) => replayedNow(r) });
  try {
    driver.start({
      world: { rules: run.rules },
      seed: Int32Array.from(cells.flat()),
      run: { kind: 'replay', paused: true, keyframeEvery: 4, check: { run: result.run, hash: result.hash } },
      generations: result.generation,
    });
    for (const target of [17, 3, 30, 12]) {
      assert.deepEqual(await driver.seek(target), { generation: target });
      const snapshot = await driver.snapshot();
      assert.equal(snapshot.generation, target);
      assert.equal(snapshot.live, at[target]);
    }
    const answer = await replayed;
    assert.deepEqual(answer, { generation: 30, hash: result.hash, matches: true, reason: 'generation-limit' });

    // Two seeks at once: the first arrives or is taken over (run.test.js pins which, on a fake
    // clock); either way both answer, and the replay ends up at the second
    const [first, second] = await Promise.all([driver.seek(25), driver.seek(5)]);
    assert.ok(first.superseded === true || first.generation === 25, JSON.stringify(first));
    assert.deepEqual(second, { generation: 5 });
    assert.equal((await driver.snapshot()).generation, 5);
  } finally {
    driver.close();
  }
});
