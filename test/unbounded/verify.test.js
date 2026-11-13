// SPDX-License-Identifier: Apache-2.0
//
// Verifying a result: by replay, by a reference table, and refusing files before any replay.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { normaliseRun, resultOf, resultText, hashWorld, worldOptions, MAX_RESULT_BYTES } from '../../src/unbounded/canonical.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { GROWING, randomSeed } from './helpers.js';

const SEED = randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 });
const fixture = (name) => readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8');

const runOf = (overrides = {}) => normaliseRun({
  contest: null,
  rules: GROWING,
  seed: SEED,
  arena: null,
  ...overrides,
  limits: { cells: null, extent: null, generations: null, ...overrides.limits },
});

/** Runs a definition until it ends or reaches `generations`, and returns its result file. */
async function resultFile(run, { generations = Infinity, ending, chunkSize = 8 } = {}) {
  const world = new World(worldOptions(run, { chunkSize, slabBytes: 1 << 20 }));
  world.setCells(run.seed);
  let reason = null;
  while (!reason && world.generation < generations) reason = step(world);
  return resultText(await resultOf(world, { run, ending: ending ?? reason }));
}

/** step(), counting its calls. */
function counted() {
  const counter = (world, options) => {
    counter.calls++;
    return step(world, options);
  };
  counter.calls = 0;
  return counter;
}

const edit = (text, fn) => {
  const data = JSON.parse(text);
  fn(data);
  return JSON.stringify(data);
};

test('the example result verifies, and its hand-edited copy does not', async () => {
  const good = await verifyResult(fixture('example-result.json'));
  assert.equal(good.verdict, 'verified', good.message);
  assert.equal(good.ending, 'confirmed');
  assert.equal(good.result.generation, 100);

  const edited = await verifyResult(fixture('example-result-edited.json'));
  assert.equal(edited.verdict, 'mismatch', edited.message);
});

test('the example run is the example result\'s', () => {
  const result = JSON.parse(fixture('example-result.json'));
  assert.deepEqual(normaliseRun(JSON.parse(fixture('example-run.json'))), result.run);
});

test('a run stopped by hand verifies at its last complete generation, whatever the chunk size', async () => {
  const text = await resultFile(runOf(), { generations: 40, ending: 'stopped', chunkSize: 32 });
  for (const chunkSize of [8, 16, 32]) {
    const answer = await verifyResult(text, { chunkSize });
    assert.equal(answer.verdict, 'verified', answer.message);
    assert.equal(answer.ending, 'machine');
  }
});

test('runs ended by a pattern limit verify, and their ending recurs on replay', async () => {
  const limited = [
    runOf({ limits: { cells: 1000 } }),
    runOf({ limits: { extent: 20 } }),
    runOf({ arena: { min: [-10, -10, -10], max: [10, 10, 10] } }),
  ];
  const endings = [];
  for (const run of limited) {
    const text = await resultFile(run, { generations: 300 });
    const answer = await verifyResult(text, { chunkSize: 16 });
    assert.equal(answer.verdict, 'verified', answer.message);
    assert.equal(answer.ending, 'confirmed');
    endings.push(answer.result.ending);
  }
  assert.deepEqual(endings, ['cell-limit', 'extent-limit', 'arena-edge']);
});

test("an ending that doesn't recur, or a generation the run can't reach, is a mismatch", async () => {
  const run = runOf({ limits: { cells: 1000 } });
  // Says the cell limit ended it 10 generations before it did
  const world = new World(worldOptions(run));
  world.setCells(run.seed);
  let ended = null;
  while (!ended) ended = step(world);
  const last = world.generation;
  const early = await resultFile(run, { generations: last - 10, ending: 'cell-limit' });
  assert.equal((await verifyResult(early)).verdict, 'mismatch');

  // Claims a generation past the one where the cell limit ends the run
  const real = JSON.parse(await resultFile(run));
  const past = edit(JSON.stringify(real), (r) => { r.generation = last + 5; r.ending = 'stopped'; });
  const answer = await verifyResult(past);
  assert.equal(answer.verdict, 'mismatch');
  assert.match(answer.message, /ends at generation/);
});

test('changing a seed cell, a rule, the arena, a limit, the generation or the hash fails; the details do not', async () => {
  const text = await resultFile(runOf({ limits: { generations: 50 } }), { generations: 40, ending: 'stopped' });
  const tampered = {
    'a seed cell': (r) => { r.run.seed[0][0] -= 1; },
    'a rule': (r) => { r.run.rules.survival = r.run.rules.survival.slice(1); },
    'the arena': (r) => { r.run.arena = { min: [-40, -40, -40], max: [40, 40, 40] }; },
    'a limit': (r) => { r.run.limits.cells = 100000; },
    'the generation limit': (r) => { r.run.limits.generations = 60; },
    'the generation': (r) => { r.generation = 39; },
    'a generation past the limit': (r) => { r.generation = 51; },
    'the contest': (r) => { r.run.contest = 'speed-1'; },
    'the hash': (r) => { r.hash = `sha256:${'0'.repeat(64)}`; },
    'the ending': (r) => { r.ending = 'generation-limit'; },
  };
  for (const [what, fn] of Object.entries(tampered)) {
    const answer = await verifyResult(edit(text, fn));
    assert.equal(answer.verdict, 'mismatch', `${what}: ${answer.message}`);
  }

  const details = edit(text, (r) => {
    r.details = { chunkSize: 32, elapsedMs: 1, stats: { live: 1, rate: 99999 }, browser: { name: 'Other', version: '1' } };
  });
  assert.equal((await verifyResult(details)).verdict, 'verified');
});

test('with a reference table, a result verifies by lookup, without a replay', async () => {
  const run = runOf({ limits: { generations: 30 } });
  const world = new World(worldOptions(run));
  world.setCells(run.seed);
  const hashes = [await hashWorld(world, run)];
  while (world.generation < 30) {
    step(world);
    hashes.push(await hashWorld(world, run));
  }
  const table = { run, hashes };
  const text = await resultFile(run, { generations: 17, ending: 'deadline' });

  const counter = counted();
  const answer = await verifyResult(text, { table, step: counter });
  assert.equal(answer.verdict, 'verified', answer.message);
  assert.equal(answer.ending, 'table');
  assert.equal(counter.calls, 0, 'no step was taken');

  const wrongHash = edit(text, (r) => { r.hash = hashes[18]; });
  assert.equal((await verifyResult(wrongHash, { table })).verdict, 'mismatch');

  const otherRun = { run: runOf({ rules: { ...GROWING, birth: [5, 11] }, limits: { generations: 30 } }), hashes };
  assert.equal((await verifyResult(text, { table: otherRun })).verdict, 'not-checked');

  const short = { run, hashes: hashes.slice(0, 10) };
  assert.equal((await verifyResult(text, { table: short })).verdict, 'not-checked');
});

test('an oversized or malformed file is refused before any replay starts', async () => {
  const text = await resultFile(runOf(), { generations: 10, ending: 'stopped' });
  const cases = [
    ' '.repeat(MAX_RESULT_BYTES + 1),
    'not json',
    edit(text, (r) => { r.run.rules.birth = [0, 5]; }),
    edit(text, (r) => { r.surprise = true; }),
    edit(text, (r) => { delete r.run.seed; }),
    edit(text, (r) => { r.run.seed = 'everything'; }),
  ];
  for (const bad of cases) {
    const counter = counted();
    const answer = await verifyResult(bad, { step: counter });
    assert.equal(answer.verdict, 'refused', bad.slice(0, 60));
    assert.ok(answer.message.length > 0);
    assert.equal(counter.calls, 0);
  }
});

test("a replay past the verifier's own generation or memory cap is not checked, not a mismatch", async () => {
  const text = await resultFile(runOf(), { generations: 40, ending: 'stopped' });

  const counter = counted();
  const long = await verifyResult(text, { maxGenerations: 39, step: counter });
  assert.equal(long.verdict, 'not-checked');
  assert.equal(counter.calls, 0, 'refused before replaying');

  // One chunk per slab, and one slab fewer than the run needs at its peak: the seed fits, the
  // replay doesn't
  const slot = 2 * 8 ** 3;
  const world = new World({ rules: GROWING, chunkSize: 8, slabBytes: slot });
  world.setCells(SEED);
  const seedChunks = world.chunkCount;
  while (world.generation < 100) step(world);
  assert.ok(world.chunksPeak > seedChunks + 1);
  const example = fixture('example-result.json');
  const big = await verifyResult(example, { chunkSize: 8, slabBytes: slot, maxMemory: (world.chunksPeak - 1) * slot });
  assert.equal(big.verdict, 'not-checked', big.message);
  assert.match(big.message, /memory/);

  // Not even the seed fits
  const tiny = await verifyResult(text, { chunkSize: 8, slabBytes: slot, maxMemory: 4 * slot });
  assert.equal(tiny.verdict, 'not-checked', tiny.message);
});
