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
