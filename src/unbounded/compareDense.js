// SPDX-License-Identifier: Apache-2.0
//
// Checks the unbounded engine against the lab's dense Game of Life 3D step, convolve3D(), with
// wrapping off. The app doesn't import this; run it from the browser console while
// `npm run dev` is up:
//
//   const { compareWithDense } = await import('/src/unbounded/compareDense.js');
//   await compareWithDense({ size: 100, generations: 100 });
//
// With wrapping off, convolve3D() clamps at the walls, so a cell on a wall counts a neighbour
// more than once, and the wall cells follow the boundary rules. The unbounded world has no
// walls. The two agree only while the pattern keeps clear of them: at least 2 cells from every
// wall, so that no cell on a wall, or next to one, is ever a candidate. This script checks that
// clearance every generation, in both engines, and fails if the pattern comes closer.

import { state } from '../state.js';
import { Grid3D } from '../grid3D.js';
import { convolve3D } from '../matrixFunctions.js';
import { World } from './world.js';
import { step } from './step.js';

const CLEARANCE = 2;

/**
 * @param {object} [options]
 * @param {number} [options.size] - the dense grid's side
 * @param {number} [options.generations]
 * @param {number} [options.seedSize] - the side of the random seed's box, centred in the grid
 * @param {number} [options.density] - the share of the seed's box alive
 * @param {number} [options.randomSeed] - makes the random seed repeatable
 * @param {{birth: number[], survival: number[]}} [options.rules] - default: state.rules
 * @returns {Promise<object>} a summary; `mismatch` is null, or the first difference found
 */
export async function compareWithDense({
  size = 100, generations = 100, seedSize = 10, density = 0.3, randomSeed = 1, rules = state.rules,
} = {}) {
  const { birth, survival } = rules;
  if (!survival?.length) {
    // convolve3D() reads an empty survival list as 5-15, so the two would differ by design
    throw new Error('Give at least one survival count: convolve3D() treats an empty list as 5-15.');
  }

  const seed = new Grid3D(size, 0);
  const start = Math.floor((size - seedSize) / 2);
  const random = repeatableRandom(randomSeed);
  for (let z = 0; z < seedSize; z++) {
    for (let y = 0; y < seedSize; y++) {
      for (let x = 0; x < seedSize; x++) {
        if (random() < density) seed.set(start + x, start + y, start + z, 1);
      }
    }
  }

  const world = new World({ rules: { birth, survival } });
  world.setCells(seed.active);

  const saved = { gridWrapping: state.gridWrapping, rules: state.rules };
  Object.assign(state, { gridWrapping: false, rules: { ...state.rules, birth, survival } });
  try {
    let dense = seed;
    let denseMs = 0, unboundedMs = 0;
    let closest = clearanceOf(seed.active, size);
    let mismatch = null;
    for (let g = 1; g <= generations && !mismatch; g++) {
      let started = performance.now();
      dense = convolve3D(dense);
      denseMs += performance.now() - started;

      started = performance.now();
      const stopped = step(world);
      unboundedMs += performance.now() - started;
      if (stopped) {
        mismatch = { generation: g, reason: `the unbounded run ended: ${stopped}` };
        break;
      }

      const cells = triples(world.cells());
      closest = Math.min(closest, clearanceOf(dense.active, size), clearanceOf(cells, size));
      if (closest < CLEARANCE) {
        mismatch = { generation: g, reason: `the pattern came within ${closest} of a wall; the comparison needs ${CLEARANCE}` };
      } else {
        mismatch = firstDifference(dense, cells, g);
      }
    }
    return {
      size, generations, rules: { birth, survival },
      liveCells: { first: seed.active.length, last: dense.active.length },
      closestToWall: closest,
      denseMs: Math.round(denseMs), unboundedMs: Math.round(unboundedMs),
      mismatch,
    };
  } finally {
    Object.assign(state, saved);
  }
}

// The fewest cells between any live cell and the nearest wall
function clearanceOf(cells, size) {
  let closest = Infinity;
  for (const [x, y, z] of cells) {
    closest = Math.min(closest, x, y, z, size - 1 - x, size - 1 - y, size - 1 - z);
  }
  return closest;
}

function firstDifference(dense, cells, generation) {
  const size = dense.size;
  const unbounded = new Uint8Array(dense.data.length);
  for (const [x, y, z] of cells) unbounded[x + y * size + z * size * size] = 1;
  for (let i = 0; i < dense.data.length; i++) {
    if (dense.data[i] !== unbounded[i]) {
      const [x, y, z] = [i % size, Math.floor(i / size) % size, Math.floor(i / (size * size))];
      return { generation, cell: [x, y, z], dense: dense.data[i], unbounded: unbounded[i] };
    }
  }
  return null;
}

function triples(flat) {
  const cells = [];
  for (let i = 0; i < flat.length; i += 3) cells.push([flat[i], flat[i + 1], flat[i + 2]]);
  return cells;
}

// A small repeatable random number generator (xorshift32), so a failing seed can be rerun
function repeatableRandom(seed) {
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
