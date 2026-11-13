// SPDX-License-Identifier: Apache-2.0
//
// Explore's saves (src/explore/save.js, #66): Save this generation writes a result file, the same
// file a contest entry is, with the generation's cells, which the verifier confirms and Load…
// carries on from; Save seed writes the run's first seed.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generationSave, seedSave, readSeedOrSave, readGenerationSave, runDefinition, savedEnding,
  generationFileName, SEED_FILE_NAME,
} from '../../src/explore/save.js';
import { parseSeedFile, toSeedFile, SeedError, MAX_FILE_CELLS } from '../../src/explore/seed.js';
import { normaliseRun, hashWorld, stateHash, readResult } from '../../src/unbounded/canonical.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { GROWING, randomSeed, cellsOf } from '../unbounded/helpers.js';

const SEED = Int32Array.from(randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 }).flat());
const CONFIG = { rules: GROWING, cells: SEED, memoryMB: 1024, arena: null, label: 'test' };
const STATS = {
  generation: 0, elapsedMs: 1234.5, rate: 0, live: 0, livePeak: 0, chunks: 1, chunksPeak: 1,
  chunksCreated: 1, extent: null, memoryBytes: 67108864, usedBytes: 4096,
};

function triples(flat) {
  const list = [];
  for (let i = 0; i < flat.length; i += 3) list.push([flat[i], flat[i + 1], flat[i + 2]]);
  return list;
}

/** A world run from `cells` (generation `from`) to generation `to`. */
function runTo(cells, to, { from = 0, arena = null } = {}) {
  const world = new World({ rules: GROWING, arena });
  world.setCells(triples(cells));
  world.generation = from;
  while (world.generation < to) assert.equal(step(world), null);
  return world;
}

async function saveOf(world, config = CONFIG, ending = 'stopped') {
  return generationSave({
    config, generation: world.generation, cells: world.cells(), ending,
    stats: { ...STATS, generation: world.generation, live: world.liveCells }, chunkSize: world.n,
    browser: { name: 'Firefox', version: '145.0' },
  });
}

test('a saved generation is a result file, as a contest entry is, and the verifier confirms it', async () => {
  const world = runTo(SEED, 40);
  assert.ok(world.liveCells > 100, 'the pattern is still going');
  const { result, text } = await saveOf(world);

  const run = normaliseRun(runDefinition(CONFIG));
  assert.deepEqual(result.run, run, 'the seed, rules, arena and limits, in full');
  assert.equal(result.generation, 40);
  assert.equal(result.ending, 'stopped');
  assert.equal(result.hash, await hashWorld(world, run));
  assert.equal(result.seedHash, await stateHash(run, 0, SEED));
  assert.equal(result.details.stats.live, world.liveCells);
  assert.equal(result.details.elapsedMs, 1234.5);
  assert.deepEqual(result.details.browser, { name: 'Firefox', version: '145.0' });
  assert.equal(result.cells.length, world.liveCells);

  assert.deepEqual(readResult(text).cells, result.cells, 'its cells read back');
  const verdict = await verifyResult(text);
  assert.equal(verdict.verdict, 'verified', verdict.message);
});

test('loaded, a saved generation carries on from it exactly, and saves from there still verify', async () => {
  const world = runTo(SEED, 40);
  const { text } = await saveOf(world);
  const loaded = await readSeedOrSave(text);
  assert.equal(loaded.kind, 'generation');
  assert.equal(loaded.from, 40);
  assert.deepEqual(loaded.rules, GROWING);
  assert.equal(loaded.arena, null);
  assert.deepEqual(triples(loaded.seed).map(String).sort(), triples(SEED).map(String).sort(), 'the first seed comes along');

  // Generation 40 is the new run's first, and the two runs stay together after it
  const carried = runTo(loaded.cells, 40, { from: 40 });
  assert.deepEqual(cellsOf(carried), cellsOf(world));
  for (let g = 0; g < 15; g++) {
    assert.equal(step(world), null);
    assert.equal(step(carried), null);
  }
  assert.deepEqual(cellsOf(carried), cellsOf(world));

  // Saved again from the carried-on run, it is still a result from the first seed
  const config = { ...CONFIG, cells: loaded.cells, seed: loaded.seed, from: loaded.from };
  const again = await saveOf(carried, config);
  assert.equal(again.result.generation, 55);
  assert.equal(again.result.hash, (await saveOf(world)).result.hash, 'the same hash as the run straight through');
  assert.equal((await verifyResult(again.text)).verdict, 'verified');
});

test('a saved generation keeps its arena, and an ending', async () => {
  const config = { ...CONFIG, arena: 32 };
  const world = runTo(SEED, 10, { arena: { min: [-16, -16, -16], max: [15, 15, 15] } });
  const { result, text } = await saveOf(world, config, 'memory-limit');
  assert.deepEqual(result.run.arena, { min: [-16, -16, -16], max: [15, 15, 15] });
  assert.equal(result.ending, 'memory-limit');
  assert.equal((await readGenerationSave(text)).arena, 32);

  const offCentre = JSON.parse(text);
  offCentre.run.arena = { min: [-16, -16, -16], max: [16, 16, 16] };
  await assert.rejects(readGenerationSave(JSON.stringify(offCentre)), SeedError, 'an arena Explore has no setting for');
});

test('an edited saved generation is refused, by the lab and by the verifier', async () => {
  const world = runTo(SEED, 20);
  const { text } = await saveOf(world);
  const moved = JSON.parse(text);
  const last = moved.cells[moved.cells.length - 1];
  moved.cells[moved.cells.length - 1] = [last[0] + 1, last[1], last[2]]; // still sorted
  const edited = JSON.stringify(moved);
  await assert.rejects(readSeedOrSave(edited), /cells aren't the ones its hash names/);
  assert.equal((await verifyResult(edited)).verdict, 'mismatch');

  const reseeded = JSON.parse(text);
  reseeded.seedHash = `sha256:${'0'.repeat(64)}`;
  await assert.rejects(readSeedOrSave(JSON.stringify(reseeded)), /seedHash isn't the hash of its seed/);

  const bare = JSON.parse(text);
  delete bare.cells;
  await assert.rejects(readSeedOrSave(JSON.stringify(bare)), /doesn't hold its generation's cells/);
  assert.equal((await verifyResult(JSON.stringify(bare))).verdict, 'verified', 'the verifier needs no cells');
});

test('past a million live cells, a generation is not saved', async () => {
  const cells = new Int32Array(3 * (MAX_FILE_CELLS + 1));
  await assert.rejects(
    generationSave({ config: CONFIG, generation: 7, cells, ending: 'stopped' }),
    (err) => err instanceof SeedError && /1,000,001 live cells.*at most 1,000,000/.test(err.message),
  );
});

test('Save seed saves the seed the run started from, with its rules', async () => {
  assert.deepEqual(parseSeedFile(seedSave(CONFIG)), { rules: GROWING, cells: SEED });
  const world = runTo(SEED, 30);
  const carried = { ...CONFIG, cells: world.cells(), seed: SEED, from: 30 };
  assert.deepEqual(parseSeedFile(seedSave(carried)).cells, SEED, 'not the generation it carried on from');
  const loaded = await readSeedOrSave(seedSave(CONFIG));
  assert.equal(loaded.kind, 'seed');
  assert.deepEqual(loaded.cells, SEED);
  assert.equal(SEED_FILE_NAME, 'explore-seed.json');
});

test('a saved generation is named for its generation', () => {
  assert.equal(generationFileName(0), 'explore-generation-0.json');
  assert.equal(generationFileName(1234), 'explore-generation-1234.json');
});

test('a run still going is saved as stopped there; an ended run keeps its reason', () => {
  assert.equal(savedEnding('running'), 'stopped');
  assert.equal(savedEnding('paused'), 'stopped');
  assert.equal(savedEnding('ended', 'repeat'), 'repeat');
  assert.equal(savedEnding('ended', 'arena-edge'), 'arena-edge');
  assert.equal(savedEnding('ended', 'error'), 'stopped');
});

test('a seed file still loads as a seed', async () => {
  const text = toSeedFile({ rules: GROWING, cells: SEED });
  assert.deepEqual(await readSeedOrSave(text), { kind: 'seed', rules: GROWING, cells: SEED });
});
