// SPDX-License-Identifier: Apache-2.0
//
// An arena that wraps (#114): the chunked engine against the reference, wrapping too, cell for
// cell, every generation; against convolve3D() with wrapping on; a ship that comes round; and
// the worlds that are refused.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World, WorldError } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { ReferenceWorld } from '../../src/unbounded/reference.js';
import { compareWithDense } from '../../src/unbounded/compareDense.js';
import { GROWING, SHIP, randomSeed, cellsOf, difference } from './helpers.js';

const GENERATIONS = 150;

/** Random cells in a box that straddles the arena's corner at `max`, taken round into the arena. */
function seedAcrossCorner(arena, size, randomSeed_) {
  const side = arena.min.map((lo, a) => arena.max[a] - lo + 1);
  const min = arena.max.map((hi) => hi - Math.floor(size / 2) + 1);
  return randomSeed({ min, size: [size, size, size], density: 0.3, randomSeed: randomSeed_ })
    .map((cell) => cell.map((c, a) => (c > arena.max[a] ? c - side[a] : c)));
}

/** Runs both engines side by side in a wrapping arena, and fails at the first difference. */
function matchReference({ arena, seed, rules = GROWING, generations = GENERATIONS, chunkSize = 8, order }) {
  const world = new World({ rules, chunkSize, slabBytes: 1 << 20, arena, wrap: true });
  world.setCells(seed);
  const reference = new ReferenceWorld(rules, seed, { wrap: arena });
  for (let g = 1; g <= generations; g++) {
    assert.equal(step(world, { order }), null, `the run ended at generation ${g}`);
    reference.step();
    const diff = difference(cellsOf(world), reference.cells());
    assert.equal(diff, null, `generation ${g}: ${diff}`);
  }
  return world;
}

const ARENAS = {
  // With 8-cell chunks, the faces lie on chunk boundaries
  'on chunk boundaries': { min: [-8, -8, -8], max: [7, 7, 7] },
  // Faces through the middle of chunks, a different side on each axis, at negative coordinates
  'through chunks, a different side on each axis': { min: [-5, -9, -30], max: [6, 3, -18] },
  // The smallest arena that wraps: 3 cells a side
  'of 3 cells a side': { min: [1, 1, 1], max: [3, 3, 3] },
};

for (const [name, arena] of Object.entries(ARENAS)) {
  test(`matches the reference in a wrapping arena ${name}, with a seed across its corner`, () => {
    const size = Math.min(6, ...arena.min.map((lo, a) => arena.max[a] - lo + 1));
    for (const randomSeed_ of [1, 2]) {
      matchReference({ arena, seed: seedAcrossCorner(arena, size, randomSeed_) });
    }
  });
}

test('the order the chunks are computed in changes nothing in a wrapping arena', () => {
  const arena = ARENAS['through chunks, a different side on each axis'];
  const seed = seedAcrossCorner(arena, 6, 3);
  const forward = cellsOf(matchReference({ arena, seed, generations: 60 }));
  const backward = cellsOf(matchReference({ arena, seed, generations: 60, order: (slots) => slots.reverse() }));
  assert.equal(difference(backward, forward), null);
});

test('a wrapping arena never ends a run at its edge, and no cell lies outside it', () => {
  const arena = { min: [-6, -6, -6], max: [5, 5, 5] };
  const world = matchReference({ arena, seed: seedAcrossCorner(arena, 6, 4), generations: 80 });
  assert.equal(world.stopReason, null);
  const box = world.extent();
  for (let a = 0; a < 3; a++) {
    assert.ok(box.min[a] >= arena.min[a] && box.max[a] <= arena.max[a], `axis ${a}: [${box.min[a]}, ${box.max[a]}]`);
  }
});

for (const [size, chunkSize] of [[20, 8], [24, 16], [33, 32]]) {
  test(`a wrapping arena of ${size}³ gives convolve3D()'s cells with wrapping on (${chunkSize}-cell chunks)`, async () => {
    for (const rules of [undefined, GROWING]) {
      const result = await compareWithDense({ size, generations: 40, seedSize: 8, wrap: true, chunkSize, ...(rules ? { rules } : {}) });
      assert.equal(result.mismatch, null, JSON.stringify(result.mismatch));
      assert.ok(result.liveCells.first > 0, 'the seed is empty');
    }
  });
}

test('a ship in a wrapping arena comes round to its own cells', () => {
  // SHIP is a ship moving a cell a generation along +x by generation 24, so it is back after a
  // lap of the arena's x side
  const arena = { min: [-10, -6, -6], max: [9, 5, 5] };
  const world = new World({ rules: SHIP.rules, chunkSize: 8, slabBytes: 1 << 20, arena, wrap: true });
  world.setCells(SHIP.seed);
  for (let g = 0; g < 24; g++) assert.equal(step(world), null);
  const formed = cellsOf(world);
  const lap = arena.max[0] - arena.min[0] + 1;
  for (let g = 0; g < lap; g++) {
    assert.equal(step(world), null);
    if (g < lap - 1) assert.notEqual(difference(cellsOf(world), formed), null, `back too early, after ${g + 1}`);
  }
  assert.equal(difference(cellsOf(world), formed), null);
});

test('wrapping is refused without an arena, with departures, under 3 cells a side, or not a boolean', () => {
  const rules = SHIP.rules;
  const arena = { min: [0, 0, 0], max: [9, 9, 9] };
  assert.throws(() => new World({ rules, wrap: true }), WorldError);
  assert.throws(() => new World({ rules, arena, wrap: true, departures: { period: 4 } }), WorldError);
  assert.throws(() => new World({ rules, arena: { min: [0, 0, 0], max: [9, 1, 9] }, wrap: true }), WorldError);
  assert.throws(() => new World({ rules, arena, wrap: 'yes' }), WorldError);
  assert.equal(new World({ rules, arena }).wrap, false);
  assert.equal(new World({ rules, arena, wrap: true }).wrap, true);
});
