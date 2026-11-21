// SPDX-License-Identifier: Apache-2.0
//
// A Methuselah run (#94) on a real second thread, Node's worker_threads standing in for the
// browser's Web Worker, as the page runs it: its ending and score, every generation's live cells
// for the chart, and its result file, made in the Worker, which verifies by replay; a run that
// reaches the edge, or is stopped, has no score; an entry that can't run is refused. And Classic
// Methuselah's (#102): ships leave at the edge in the Worker's world, the run ends with its
// departures, and its result file lists them and verifies, Verify a result… reporting them.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { contestById } from '../../src/unbounded/contests.js';
import { readResult, ResultError } from '../../src/unbounded/canonical.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { ReferenceWorld } from '../../src/unbounded/reference.js';
import { DiscoveryRun } from '../../src/contests/discovery.js';
import { verifyInWorker } from '../../src/contests/speed.js';
import { resultFileName } from '../../src/contests/format.js';
import { DIES, OSCILLATOR, SHIP, SHIP_REST, GROWING, randomSeed } from '../unbounded/helpers.js';

const METHUSELAH = contestById('methuselah-1');
const CLASSIC = contestById('classic-methuselah-1');

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

/** Runs an entry in Methuselah, or another Discovery contest; `stop` stops it as soon as it has started. */
function methuselahRun(entry, { stop = false, contest = METHUSELAH } = {}) {
  const log = { stats: [], started: 0, errors: [] };
  let run;
  const ended = new Promise((resolve) => {
    run = new DiscoveryRun(contest, entry, {
      createWorker: engineWorker,
      onStart: () => { log.started++; },
      onStats: (stats) => log.stats.push(stats),
      onEnd: resolve,
      onError: (message) => log.errors.push(message),
    });
  });
  run.start();
  if (stop) run.stop();
  return { run, ended, log };
}

/** The live cells of generations 0 to `last`, as the reference engine counts them. */
function referenceLive({ rules, seed }, last) {
  const world = new ReferenceWorld(rules, seed);
  const live = [world.cells().length];
  for (let g = 1; g <= last; g++) {
    world.step();
    live.push(world.cells().length);
  }
  return live;
}

test('a Methuselah run that dies scores the generation the last cell died, and its result file verifies', async () => {
  const { run, ended, log } = methuselahRun(DIES);
  const end = await ended;
  try {
    assert.equal(log.started, 1);
    assert.deepEqual(log.errors, []);
    assert.equal(end.reason, 'died');
    assert.equal(end.stats.generation, DIES.from);
    assert.deepEqual(end.score, { generations: DIES.from, period: 1 });
    assert.equal(run.budget, 10_000);

    // The chart: every generation's live cells, from the seed's to the last's (none)
    const points = await run.loadHistory();
    assert.deepEqual(points, referenceLive(DIES, DIES.from).map((live, g) => [g, live]));
    assert.equal(points.at(-1)[1], 0);

    const browser = { name: 'Firefox', version: '155.0' };
    const { result, text } = await run.makeResult(browser);
    assert.equal(result.run.contest, 'methuselah-1');
    assert.deepEqual(result.run.arena, METHUSELAH.fixes.arena);
    assert.equal(result.ending, 'died');
    assert.equal(result.generation, DIES.from);
    assert.deepEqual(result.score, end.score);
    assert.deepEqual(result.details.browser, browser);
    assert.equal(result.details.chunkSize, 16);
    assert.equal(resultFileName(METHUSELAH, result.score), `methuselah-1-${DIES.from}.json`);
    // The seed in the file is exactly the entry's
    assert.deepEqual(result.run.seed, [...DIES.seed].sort((a, b) => a[2] - b[2] || a[1] - b[1] || a[0] - b[0]));
    const verdict = await verifyResult(text);
    assert.equal(verdict.verdict, 'verified', verdict.message);

    // The same file, checked in its own Worker as Verify a result… does, with the entry's facts
    const answer = await verifyInWorker(text, { createWorker: verifierWorker }).promise;
    assert.equal(answer.verdict, 'verified', answer.message);
    assert.equal(answer.contest, 'methuselah-1');
    assert.equal(answer.ending, 'died');
    assert.deepEqual(answer.score, end.score);
    assert.deepEqual(answer.rules, DIES.rules);
    assert.equal(answer.seedCells, DIES.seed.length);
  } finally {
    run.close();
  }
});

test('a Methuselah run that repeats scores where its cycle began, with its period; a hand-edited file fails', async () => {
  const { run, ended } = methuselahRun(OSCILLATOR);
  const end = await ended;
  try {
    assert.equal(end.reason, 'repeat');
    assert.deepEqual(end.cycle, { from: OSCILLATOR.from, period: OSCILLATOR.period });
    assert.deepEqual(end.score, { generations: OSCILLATOR.from, period: OSCILLATOR.period });
    // The history stops where the cycle began, as the run's generation does
    const points = await run.loadHistory();
    assert.deepEqual(points, referenceLive(OSCILLATOR, OSCILLATOR.from).map((live, g) => [g, live]));

    const { text } = await run.makeResult();
    assert.equal(readResult(text).ending, 'repeat');
    assert.equal((await verifyResult(text)).verdict, 'verified');
    // A later h, with its score to match, is the same cycle but not the first repeat
    const later = OSCILLATOR.from + OSCILLATOR.period;
    const edited = text
      .replace(`"generation": ${OSCILLATOR.from},`, `"generation": ${later},`)
      .replace(`"generations": ${OSCILLATOR.from},`, `"generations": ${later},`);
    assert.notEqual(edited, text);
    const answer = await verifyInWorker(edited, { createWorker: verifierWorker }).promise;
    assert.equal(answer.verdict, 'mismatch', answer.message);
    assert.match(answer.message, new RegExp(`first settles at generation ${OSCILLATOR.from}`));
  } finally {
    run.close();
  }
});

test('a Methuselah run that reaches the edge has no score, and no result to enter', async () => {
  const { run, ended } = methuselahRun(SHIP);
  const end = await ended;
  try {
    assert.equal(end.reason, 'arena-edge');
    assert.equal(end.score, null);
    const points = await run.loadHistory();
    assert.equal(points.length, end.stats.generation + 1);
    await assert.rejects(run.makeResult(), /Only a run that scored/);
  } finally {
    run.close();
  }
});

test('a Methuselah run stopped by hand has no score', async () => {
  const seed = randomSeed({ min: [-5, -5, -5], size: [10, 10, 10], density: 0.3, randomSeed: 7 });
  const { run, ended } = methuselahRun({ rules: GROWING, seed }, { stop: true });
  const end = await ended;
  try {
    assert.equal(end.reason, 'stopped');
    assert.equal(end.score, null);
  } finally {
    run.close();
  }
});

test('an entry that can\'t run in Methuselah is refused before it starts, saying why', () => {
  const refuse = (entry, message) => assert.throws(
    () => new DiscoveryRun(METHUSELAH, entry, { createWorker: engineWorker }),
    (err) => err instanceof ResultError && message.test(err.message),
    String(message),
  );
  refuse({ rules: DIES.rules, seed: [] }, /seed is empty/);
  refuse({ rules: DIES.rules, seed: [[0, 0, 0], [5, 0, 0]] }, /\[5, 0, 0\] is outside the seed box, cells -5 to 4/);
  refuse({ rules: { birth: [0, 3], survival: [] }, seed: [[0, 0, 0]] }, /B0/);
  // A fully live seed box is an entry
  const full = [];
  for (let z = -5; z <= 4; z++) for (let y = -5; y <= 4; y++) for (let x = -5; x <= 4; x++) full.push([x, y, z]);
  const run = new DiscoveryRun(METHUSELAH, { rules: DIES.rules, seed: full }, { createWorker: engineWorker });
  assert.equal(run.run.seed.length, 1000);
  assert.deepEqual(run.points, [[0, 1000]]);
  // Speed isn't a Discovery contest
  assert.throws(() => new DiscoveryRun(contestById('speed-1'), DIES), /isn't a Discovery contest/);
});

// ---- Classic Methuselah (#102) ----

/** SHIP, which leaves at generation 35, and a period-2 oscillator that settled long before. */
const SHIP_AND_REST = { rules: SHIP.rules, seed: [...SHIP.seed, ...SHIP_REST] };

test('a Classic Methuselah run lets its ship leave, then scores where it settled, with its departures', async () => {
  const { run, ended, log } = methuselahRun(SHIP_AND_REST, { contest: CLASSIC });
  const end = await ended;
  try {
    assert.deepEqual(log.errors, []);
    assert.equal(end.reason, 'repeat');
    assert.deepEqual(end.score, { generations: 36, period: 2 });
    assert.deepEqual(end.departures, [{ generation: 35, period: 1, shift: [1, 0, 0] }]);
    assert.equal(end.stats.departed, 1);
    assert.ok(log.stats.every((stats) => Number.isInteger(stats.departed)));

    const { result, text } = await run.makeResult();
    assert.equal(result.run.contest, 'classic-methuselah-1');
    assert.equal(result.departures.length, 1);
    assert.deepEqual(result.departures[0].shift, [1, 0, 0]);
    assert.equal(result.departures[0].cells.length, 8);
    assert.equal(resultFileName(CLASSIC, result.score), 'classic-methuselah-1-36.json');
    assert.equal((await verifyResult(text)).verdict, 'verified');

    // Verify a result… reports the file's departures, without their cells
    const answer = await verifyInWorker(text, { createWorker: verifierWorker }).promise;
    assert.equal(answer.verdict, 'verified', answer.message);
    assert.equal(answer.contest, 'classic-methuselah-1');
    assert.deepEqual(answer.departures, [{ generation: 35, period: 1, shift: [1, 0, 0] }]);
  } finally {
    run.close();
  }
});

test('Methuselah runs as before beside it: no departures, and the same seed ends at the edge', async () => {
  const { run, ended } = methuselahRun(SHIP_AND_REST);
  const end = await ended;
  try {
    assert.equal(end.reason, 'arena-edge');
    assert.equal(end.stats.generation, 35);
    assert.equal(end.departures, null);
    assert.equal(end.stats.departed, undefined);
  } finally {
    run.close();
  }
  // A Methuselah file reports no departures to Verify a result…
  const dies = methuselahRun(DIES);
  await dies.ended;
  try {
    const { text } = await dies.run.makeResult();
    const answer = await verifyInWorker(text, { createWorker: verifierWorker }).promise;
    assert.equal(answer.departures, null);
  } finally {
    dies.run.close();
  }
});

test('a Classic Methuselah run whose island at the edge is no ship ends there, without a score, listing none', async () => {
  // Under B1, the pattern grows a cell a generation on every side: never a ship
  const { run, ended } = methuselahRun({ rules: { birth: [1], survival: [] }, seed: [[0, 0, 0]] }, { contest: CLASSIC });
  const end = await ended;
  try {
    assert.equal(end.reason, 'arena-edge');
    assert.equal(end.score, null);
    assert.deepEqual(end.departures, []);
  } finally {
    run.close();
  }
});
