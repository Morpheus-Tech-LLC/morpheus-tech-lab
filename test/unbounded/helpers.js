// SPDX-License-Identifier: Apache-2.0
//
// Shared by the unbounded engine's tests.

import { sortCells } from '../../src/unbounded/reference.js';

/**
 * A rule that grows past a small random seed in all six directions, slowly enough that the
 * reference keeps up: from a 6³ seed, a few thousand cells after 200 generations. It includes
 * S0, so a live cell with no neighbours survives.
 */
export const GROWING = { birth: [5, 11, 12], survival: [0, 1, 4, 5, 10, 12, 13, 14] };

/** A small repeatable random number generator (xorshift32), so a failing seed can be rerun. */
export function repeatableRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/**
 * Random live cells in a box.
 * @param {number[]} min - the box's lowest corner, inclusive
 * @param {number[]} size - its side lengths
 */
export function randomSeed({ min, size, density = 0.2, randomSeed = 1 }) {
  const random = repeatableRandom(randomSeed);
  const cells = [];
  for (let z = 0; z < size[2]; z++) {
    for (let y = 0; y < size[1]; y++) {
      for (let x = 0; x < size[0]; x++) {
        if (random() < density) cells.push([min[0] + x, min[1] + y, min[2] + z]);
      }
    }
  }
  return cells;
}

/** A world's live cells as sorted [x, y, z] arrays, to compare with the reference's. */
export function cellsOf(world) {
  const flat = world.cells();
  const cells = [];
  for (let i = 0; i < flat.length; i += 3) cells.push([flat[i], flat[i + 1], flat[i + 2]]);
  return sortCells(cells);
}

/** The first difference between two sorted cell lists, as text, or null. */
export function difference(actual, expected) {
  if (actual.length !== expected.length) {
    return `${actual.length} live cells, expected ${expected.length}`;
  }
  for (let i = 0; i < actual.length; i++) {
    const [a, e] = [actual[i], expected[i]];
    if (a[0] !== e[0] || a[1] !== e[1] || a[2] !== e[2]) return `cell ${i}: [${a}], expected [${e}]`;
  }
  return null;
}

// ---- Settling (#41) ----

// Small patterns found by a search, each inside the seed box (cells 0 to 3)
/** Dies out at generation 10. */
export const DIES = {
  rules: { birth: [5, 7, 8], survival: [1, 4] },
  seed: [[0, 0, 0], [2, 0, 0], [2, 2, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [2, 1, 1], [2, 0, 2], [0, 1, 2], [2, 1, 2], [2, 2, 2]],
  from: 10,
};
/** Becomes a still life at generation 4. */
export const STILL = {
  rules: { birth: [5, 7, 8], survival: [0, 1, 7] },
  seed: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [2, 0, 1], [0, 2, 1], [1, 2, 1], [2, 0, 2], [2, 2, 2]],
  from: 4,
  period: 1,
};
/** Settles into a period-5 cycle from generation 4. */
export const OSCILLATOR = {
  rules: { birth: [4], survival: [9] },
  seed: [[2, 0, 0], [1, 2, 0], [2, 0, 1], [0, 1, 1], [0, 2, 1], [0, 0, 2], [0, 2, 2]],
  from: 4,
  period: 5,
};
/** Becomes, by generation 24, a ship of 8 cells moving a cell a generation along +x: never in place. */
export const SHIP = {
  rules: { birth: [4], survival: [6] },
  seed: [[1, 0, 0], [0, 1, 0], [2, 1, 0], [0, 0, 1], [2, 0, 1], [0, 1, 1], [2, 1, 1], [0, 2, 1], [1, 2, 1], [0, 0, 2],
    [2, 0, 2], [0, 1, 2], [1, 1, 2], [2, 1, 2], [0, 2, 2], [1, 2, 2], [2, 2, 2]],
};

// ---- Departures (#100) ----

/** Under SHIP's rules, settles into a period-2 cycle of 4 cells from generation 8: SHIP's rest, at cells -5 to -3. */
export const SHIP_REST = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [2, 2, 0], [0, 0, 1], [2, 0, 1],
  [0, 1, 1], [1, 1, 1], [2, 1, 1], [1, 2, 1], [0, 0, 2], [0, 1, 2], [0, 2, 2], [2, 2, 2]].map(([x, y, z]) => [x - 5, y - 5, z - 5]);
/**
 * A ship of period 2 moving 2 cells along +x, which wobbles in z: these cells span z 0 to 2, and
 * the next generation's span -1 to 2.
 */
export const WOBBLER = {
  rules: { birth: [4], survival: [7] },
  cells: [[2, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [1, -1, 1], [3, 0, 1], [3, 1, 1], [1, 2, 1], [2, 2, 1], [3, 0, 2], [3, 1, 2], [2, 2, 2]],
};
/** A ship of period 6 moving 6 cells along +x. */
export const SLOW_SHIP = {
  rules: { birth: [4], survival: [] },
  cells: [[0, 0, -1], [2, 0, -1], [3, 1, -1], [3, 0, 0], [4, 1, 0], [1, 2, 0], [4, 2, 0], [1, 1, 1], [4, 1, 1], [4, 2, 1]],
};
