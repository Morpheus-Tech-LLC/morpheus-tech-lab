// SPDX-License-Identifier: Apache-2.0
//
// The chunked engine against the reference, cell for cell, every generation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World, WorldError, COORDINATE_LIMIT } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { ReferenceWorld } from '../../src/unbounded/reference.js';
import { validateRules, RuleError } from '../../src/unbounded/rules.js';
import { GROWING, randomSeed, repeatableRandom, cellsOf, difference } from './helpers.js';

const GENERATIONS = 200;

/** Runs both engines side by side and fails at the first generation they differ. */
function matchReference({ rules = GROWING, seed, generations = GENERATIONS, chunkSize = 8, order }) {
  const world = new World({ rules, chunkSize, slabBytes: 1 << 20 });
  world.setCells(seed);
  const reference = new ReferenceWorld(rules, seed);
  assert.equal(difference(cellsOf(world), reference.cells()), null, 'the seeds differ');
  for (let g = 1; g <= generations; g++) {
    assert.equal(step(world, { order }), null, `the run ended at generation ${g}`);
    reference.step();
    const diff = difference(cellsOf(world), reference.cells());
    assert.equal(diff, null, `generation ${g}: ${diff}`);
  }
  assert.equal(world.generation, generations);
  return world;
}

// Each seed is a 6³ box, placed so that it straddles chunk boundaries in different ways. With
// 8-cell chunks, the boundaries are at multiples of 8.
const STRADDLING = {
  'a corner, where eight chunks meet': [-3, -3, -3],
  'an edge, where four chunks meet': [-3, -3, 1],
  'a face, between two chunks': [-3, 1, 1],
};

for (const [where, min] of Object.entries(STRADDLING)) {
  test(`matches the reference over ${GENERATIONS} generations, with a seed across ${where}`, () => {
    matchReference({ seed: randomSeed({ min, size: [6, 6, 6], randomSeed: 2 }) });
  });
}

test('matches the reference with a seed at negative coordinates', () => {
  const seed = randomSeed({ min: [-1003, -517, -70], size: [6, 6, 6], randomSeed: 3 });
  matchReference({ seed, chunkSize: 16 });
});

test('matches the reference as a pattern grows past its start in all six directions', () => {
  const seed = randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 });
  const world = matchReference({ seed, chunkSize: 32 });
  const box = world.extent();
  // The seed spanned -3..2 on every axis; the pattern now reaches more than a chunk past it
  for (let a = 0; a < 3; a++) {
    assert.ok(box.min[a] < -3 - 8, `axis ${a}: grew to ${box.min[a]} on the low side`);
    assert.ok(box.max[a] > 2 + 8, `axis ${a}: grew to ${box.max[a]} on the high side`);
  }
});

test('gives the same cells at every chunk size', () => {
  const seed = randomSeed({ min: [5, -9, 13], size: [6, 6, 6], randomSeed: 4 });
  for (const chunkSize of [8, 16, 32]) matchReference({ seed, chunkSize, generations: 60 });
});

test('gives identical cells whatever order the chunks are processed in', () => {
  const seed = randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 5 });
  const random = repeatableRandom(42);
  const shuffle = (slots) => {
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
  };
  matchReference({ seed, order: shuffle });
  matchReference({ seed, order: (slots) => slots.reverse() });
});

test('refuses rules with B0, with a clear message', () => {
  for (const make of [
    () => validateRules({ birth: [0, 5], survival: [5] }),
    () => new World({ rules: { birth: [0], survival: [] } }),
    () => new ReferenceWorld({ birth: [0, 9], survival: [] }),
  ]) {
    assert.throws(make, (err) => err instanceof RuleError && /B0/.test(err.message));
  }
});

test('refuses malformed rules', () => {
  for (const rules of [
    null,
    { birth: [27], survival: [] },
    { birth: [5], survival: [-1] },
    { birth: [2.5], survival: [] },
    { birth: '5', survival: [] },
    { birth: [5] },
  ]) {
    assert.throws(() => validateRules(rules), RuleError, JSON.stringify(rules));
  }
  assert.deepEqual(validateRules({ birth: [10, 9, 9], survival: [] }), { birth: [9, 10], survival: [] });
});

test('an empty world stays empty', () => {
  const world = new World({ rules: GROWING });
  for (let g = 0; g < 10; g++) assert.equal(step(world), null);
  assert.equal(world.generation, 10);
  assert.equal(world.liveCells, 0);
  assert.equal(world.chunkCount, 0);
});

test('releases chunks once they are empty, and reuses their slots', () => {
  // Under B26 with no survival, every live cell dies at once
  const world = new World({ rules: { birth: [26], survival: [] }, chunkSize: 8, slabBytes: 1 << 20 });
  world.setCells(randomSeed({ min: [-20, -20, -20], size: [40, 40, 40], density: 0.05 }));
  assert.ok(world.chunkCount > 1);
  const memory = world.memoryBytes;
  assert.equal(step(world), null);
  assert.equal(world.liveCells, 0);
  assert.equal(world.chunkCount, 0);
  assert.equal(world.memoryBytes, memory, 'the slabs stay, for reuse');
  assert.equal(world.free.length, world.slabs.length * world.slotsPerSlab, 'every slot is free again');
});

test('a slot freed by one chunk is reused by another', () => {
  // One chunk's slot per slab, so every new slab shows up in memoryBytes
  const world = new World({ rules: GROWING, chunkSize: 8, slabBytes: 2 * 8 ** 3 });
  world.setCells(randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 }));
  let allocations = 0;
  const allocateSlot = world.allocateSlot.bind(world);
  world.allocateSlot = () => {
    allocations++;
    return allocateSlot();
  };
  for (let g = 0; g < 120; g++) assert.equal(step(world), null);
  const slots = world.slabs.length * world.slotsPerSlab;
  assert.ok(slots < allocations, `${allocations} chunks allocated in ${slots} slots`);
  assert.equal(world.free.length + world.chunkCount, slots);
});

test('refuses seed cells outside the representable space', () => {
  const world = new World({ rules: GROWING });
  assert.throws(() => world.setCells([[COORDINATE_LIMIT, 0, 0]]), WorldError);
  assert.throws(() => new World({ rules: GROWING }).setCells([[0, -COORDINATE_LIMIT - 1, 0]]), WorldError);
  assert.throws(() => new World({ rules: GROWING }).setCells([[0, 0, 0.5]]), WorldError);
});

test('refuses cells set after the first step', () => {
  const world = new World({ rules: GROWING });
  step(world);
  assert.throws(() => world.setCells([[0, 0, 0]]), WorldError);
});

test('has() reads single cells, including at negative coordinates', () => {
  const world = new World({ rules: GROWING, chunkSize: 8 });
  world.setCells([[-1, -8, -9], [7, 8, 0]]);
  assert.equal(world.has(-1, -8, -9), true);
  assert.equal(world.has(7, 8, 0), true);
  assert.equal(world.has(0, 0, 0), false);
  assert.equal(world.has(-COORDINATE_LIMIT * 4, 0, 0), false);
});
