// SPDX-License-Identifier: Apache-2.0
//
// An arena with walls (#119): the chunked engine against the reference, with walls too, cell for
// cell, every generation; what a wall cell counts, by hand; and the worlds that are refused.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World, WorldError, WALL_NEIGHBOURS } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { ReferenceWorld } from '../../src/unbounded/reference.js';
import { RuleError } from '../../src/unbounded/rules.js';
import { GROWING, randomSeed, cellsOf, difference } from './helpers.js';

const GENERATIONS = 120;

/** The old Game of Life 3D mode's defaults for its walls. */
const OLD_DEFAULTS = {
  corner: { birth: [2, 3], survival: [2, 3, 4] },
  edge: { birth: [4], survival: [2, 3, 4, 5, 6] },
  face: { birth: [6], survival: [3, 4, 5, 6, 7, 8, 9] },
};
/** Busier walls, with a cell kept alive alone (S0) on each kind of wall. */
const BUSY = {
  corner: { birth: [1, 3], survival: [0, 2, 5, 7] },
  edge: { birth: [2, 5], survival: [0, 3, 4, 8, 11] },
  face: { birth: [3, 4], survival: [0, 5, 6, 9, 17] },
};

/** Random cells filling a whole arena, so the seed reaches every face, edge and corner. */
function filling(arena, density, randomSeed_) {
  const size = arena.min.map((lo, a) => arena.max[a] - lo + 1);
  return randomSeed({ min: arena.min, size, density, randomSeed: randomSeed_ });
}

/** Runs both engines side by side in an arena with walls, and fails at the first difference. */
function matchReference({ arena, walls, seed, rules = GROWING, generations = GENERATIONS, chunkSize = 8, order }) {
  const world = new World({ rules, chunkSize, slabBytes: 1 << 20, arena, walls });
  world.setCells(seed);
  const reference = new ReferenceWorld(rules, seed, { walls: { box: arena, ...walls } });
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
  // Smaller than a chunk: both of an axis's faces in one chunk
  'inside one chunk': { min: [1, 1, 1], max: [6, 5, 4] },
  // The smallest arena with walls: 3 cells a side, where only the centre is inside
  'of 3 cells a side': { min: [-1, -1, -1], max: [1, 1, 1] },
};

for (const [name, arena] of Object.entries(ARENAS)) {
  test(`matches the reference in an arena with walls ${name}`, () => {
    for (const [walls, density, randomSeed_] of [[OLD_DEFAULTS, 0.3, 1], [BUSY, 0.15, 2], [BUSY, 0.4, 3]]) {
      matchReference({ arena, walls, seed: filling(arena, density, randomSeed_) });
    }
  });
}

test('matches the reference with 16- and 32-cell chunks, and under the lab\'s rules', () => {
  const arena = { min: [-20, -20, -20], max: [19, 19, 19] };
  const labRules = { birth: [9, 10], survival: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] };
  for (const chunkSize of [16, 32]) {
    matchReference({ arena, walls: BUSY, seed: filling(arena, 0.3, 4), chunkSize, generations: 40 });
    matchReference({ arena, walls: OLD_DEFAULTS, rules: labRules, seed: filling(arena, 0.5, 5), chunkSize, generations: 40 });
  }
});

test('the order the chunks are computed in changes nothing in an arena with walls', () => {
  const arena = ARENAS['through chunks, a different side on each axis'];
  const seed = filling(arena, 0.3, 6);
  const forward = cellsOf(matchReference({ arena, walls: BUSY, seed, generations: 60 }));
  const backward = cellsOf(matchReference({ arena, walls: BUSY, seed, generations: 60, order: (slots) => slots.reverse() }));
  assert.equal(difference(backward, forward), null);
});

test('an arena with walls never ends a run at its edge, and no cell lies outside it', () => {
  const arena = { min: [-6, -6, -6], max: [5, 5, 5] };
  const world = matchReference({ arena, walls: BUSY, seed: filling(arena, 0.3, 7), generations: 80 });
  assert.equal(world.stopReason, null);
  const box = world.extent();
  for (let a = 0; a < 3; a++) {
    assert.ok(box.min[a] >= arena.min[a] && box.max[a] <= arena.max[a], `axis ${a}: [${box.min[a]}, ${box.max[a]}]`);
  }
});

test('a wall cell counts only its real neighbours: 7 at a corner, 11 on an edge, 17 on a face', () => {
  assert.deepEqual(WALL_NEIGHBOURS, { face: 17, edge: 11, corner: 7 });
  const arena = { min: [0, 0, 0], max: [9, 9, 9] };
  const none = { birth: [], survival: [] };
  // A full 3×3×3 block in the arena's corner: the corner cell has all 7 of its neighbours alive,
  // the edge cell at [1, 0, 0] all 11, and the face cell at [1, 1, 0] all 17
  const block = [];
  for (let z = 0; z < 3; z++) for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) block.push([x, y, z]);
  const survivesWith = (kind, count, cell) => {
    const walls = { corner: none, edge: none, face: none, [kind]: { birth: [], survival: [count] } };
    const world = new World({ rules: { birth: [], survival: [] }, chunkSize: 8, slabBytes: 1 << 20, arena, walls });
    world.setCells(block);
    step(world);
    return world.has(...cell);
  };
  for (const [kind, cell] of [['corner', [0, 0, 0]], ['edge', [1, 0, 0]], ['face', [1, 1, 0]]]) {
    const real = WALL_NEIGHBOURS[kind];
    assert.ok(survivesWith(kind, real, cell), `a ${kind} cell counts ${real}`);
    assert.ok(!survivesWith(kind, real - 1, cell), `a ${kind} cell doesn't count ${real - 1}`);
  }
});

test('walls are refused without an arena, with wrapping or departures, under 3 cells a side, with B0, or past a wall cell\'s neighbours', () => {
  const rules = GROWING;
  const arena = { min: [0, 0, 0], max: [9, 9, 9] };
  const walls = OLD_DEFAULTS;
  assert.throws(() => new World({ rules, walls }), WorldError);
  assert.throws(() => new World({ rules, arena, walls, wrap: true }), WorldError);
  assert.throws(() => new World({ rules, arena, walls, departures: { period: 4 } }), WorldError);
  assert.throws(() => new World({ rules, arena: { min: [0, 0, 0], max: [9, 1, 9] }, walls }), WorldError);
  assert.throws(() => new World({ rules, arena, walls: { ...walls, edge: { birth: [0, 4], survival: [] } } }), (err) => err instanceof RuleError && /^The edge rule: Birth with 0/.test(err.message));
  assert.throws(() => new World({ rules, arena, walls: { ...walls, corner: { birth: [2], survival: [8] } } }),
    (err) => err instanceof RuleError && err.message === 'A corner cell has 7 neighbours, so its counts go from 0 to 7; 8 is past them.');
  assert.throws(() => new World({ rules, arena, walls: { ...walls, face: undefined } }), RuleError);
  assert.equal(new World({ rules, arena }).walls, null);
  assert.deepEqual(new World({ rules, arena, walls }).walls, walls);
});
