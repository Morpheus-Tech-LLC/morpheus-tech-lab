// SPDX-License-Identifier: Apache-2.0
//
// Game of Life 3D (bounded) with wrapping off (#125): convolve3D()'s walls. A cell on a wall
// counts only its neighbours inside the grid, each once: by hand, and against the unbounded
// engine's reference closed by the same walls, cell for cell, every generation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Grid3D } from '../src/grid3D.js';
import { convolve3D } from '../src/denseStep.js';
import { ReferenceWorld, sortCells } from '../src/unbounded/reference.js';
import { GROWING, randomSeed, difference } from './unbounded/helpers.js';

const LAB_RULES = { birth: [9, 10], survival: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] };

/** The lab's default wall rules (state.boundaryRules), as the reference names them. */
const LAB_WALLS = {
  corner: { birth: [2, 3], survival: [2, 3, 4] },
  edge: { birth: [4], survival: [2, 3, 4, 5, 6] },
  face: { birth: [6], survival: [3, 4, 5, 6, 7, 8, 9] },
};
/** Busier walls, with a cell kept alive alone (S0) and the top count on each kind of wall. */
const BUSY = {
  corner: { birth: [1, 3], survival: [0, 2, 5, 7] },
  edge: { birth: [2, 5], survival: [0, 3, 4, 8, 11] },
  face: { birth: [3, 4], survival: [0, 5, 6, 9, 17] },
};

/** The walls as convolve3D() takes them. */
function boundaryRulesOf(walls) {
  return { corner: walls.corner, edgeTwoFaces: walls.edge, face: walls.face };
}

function gridOf(size, cells) {
  const grid = new Grid3D(size, 0);
  for (const [x, y, z] of cells) grid.set(x, y, z, 1);
  return grid;
}

function walled(grid, rules, walls) {
  return convolve3D(grid, { wrapping: false, rules, boundaryRules: boundaryRulesOf(walls) });
}

test('a lone live cell on an edge dies under the default edge rule, and nothing is born beside it', () => {
  const next = walled(gridOf(10, [[0, 0, 5]]), LAB_RULES, LAB_WALLS);
  assert.deepEqual(next.active, []);
});

test('a full grid: a corner counts 7, an edge 11, a face 17 and the inside 26', () => {
  const size = 6;
  const all = [];
  for (let z = 0; z < size; z++) for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) all.push([x, y, z]);
  // Each kind of cell survives only on its own top count, so every cell lives only if it counts
  // exactly its neighbours inside the grid
  const rules = { birth: [1], survival: [26] };
  const walls = {
    corner: { birth: [1], survival: [7] },
    edge: { birth: [1], survival: [11] },
    face: { birth: [1], survival: [17] },
  };
  const next = walled(gridOf(size, all), rules, walls);
  assert.equal(next.active.length, size ** 3);
});

test('a live corner cell survives with its 7 neighbours alive, under corner S7', () => {
  const cells = [];
  for (let z = 0; z < 2; z++) for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) cells.push([x, y, z]);
  const walls = { ...LAB_WALLS, corner: { birth: [2, 3], survival: [7] } };
  const next = walled(gridOf(10, cells), LAB_RULES, walls);
  assert.equal(next.get(0, 0, 0), 1);
});

const CASES = [
  { name: "the lab's default rules and walls", rules: LAB_RULES, walls: LAB_WALLS, density: 0.35 },
  { name: 'a rule that grows, with busy walls', rules: GROWING, walls: BUSY, density: 0.2 },
  { name: "the lab's rules with busy walls", rules: LAB_RULES, walls: BUSY, density: 0.5 },
];

for (const { name, rules, walls, density } of CASES) {
  for (const size of [3, 8, 13]) {
    for (const seed of [1, 2]) {
      test(`matches the reference closed by walls, ${size}³, ${name} (random seed ${seed})`, () => {
        const box = { min: [0, 0, 0], max: [size - 1, size - 1, size - 1] };
        const cells = randomSeed({ min: box.min, size: [size, size, size], density, randomSeed: seed });
        assert.ok(cells.length > 0, 'the seed is empty');
        let grid = gridOf(size, cells);
        const reference = new ReferenceWorld(rules, cells, { walls: { box, ...walls } });
        for (let g = 1; g <= 60; g++) {
          grid = walled(grid, rules, walls);
          reference.step();
          const diff = difference(sortCells(grid.active.map((c) => [...c])), reference.cells());
          assert.equal(diff, null, `generation ${g}: ${diff}`);
        }
      });
    }
  }
}
