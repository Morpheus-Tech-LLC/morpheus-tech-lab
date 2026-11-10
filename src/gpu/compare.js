// SPDX-License-Identifier: Apache-2.0
//
// Checks that the GPU gives exactly the CPU's generations. The app doesn't import this; run it
// from the browser console while `npm run dev` is up, in a browser with WebGPU:
//
//   const { compareGpuWithCpu } = await import('/src/gpu/compare.js');
//   await compareGpuWithCpu({ mode: 'gameOfLife3D', size: 50, generations: 100, wrapping: false });
//
// It seeds one grid, evolves it with the CPU reference and with the GPU, and compares every
// generation: each cell, and that `active` lists exactly the live cells. Run it after any change
// to a shader, src/gpu/engine.js or a CPU evolve step.

import { state } from '../state.js';
import { Grid3D } from '../grid3D.js';
import { convolve3D, evolveRule30, evolveRule30_2D } from '../matrixFunctions.js';
import { rule30Shape } from '../shapeGenerators.js';
import { getGpuDevice } from './device.js';
import { evolveOnGpu } from './engine.js';

const CPU_STEP = { gameOfLife3D: convolve3D, rule30: evolveRule30, rule30_2D: evolveRule30_2D };

/**
 * @param {object} options
 * @param {'gameOfLife3D'|'rule30'|'rule30_2D'} [options.mode]
 * @param {number} [options.size]
 * @param {number} [options.generations]
 * @param {boolean} [options.wrapping]
 * @param {number} [options.density] - Game of Life 3D: the share of cells alive in the random seed,
 *   which fills the whole grid so that faces, edges and corners are tested too
 * @param {number} [options.randomSeed] - makes the random seed repeatable
 * @param {object} [options.rules] - Game of Life 3D rules; default: state.rules
 * @param {object} [options.boundaryRules] - default: state.boundaryRules
 * @returns {Promise<object>} a summary; `mismatch` is null, or the first difference found
 */
export async function compareGpuWithCpu({
  mode = 'gameOfLife3D', size = 50, generations = 100, wrapping = true,
  density = 0.3, randomSeed = 1, rules = state.rules, boundaryRules = state.boundaryRules,
} = {}) {
  const device = await getGpuDevice();
  if (!device) throw new Error('No GPU device here, so there is nothing to compare');

  const seed = new Grid3D(size, 0);
  if (mode === 'gameOfLife3D') {
    const random = repeatableRandom(randomSeed);
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (random() < density) seed.set(x, y, z, 1);
        }
      }
    }
  } else {
    rule30Shape()(seed, size);
  }

  // The CPU steps read these from state, so set them for the run and put them back after
  const saved = { gridWrapping: state.gridWrapping, rules: state.rules, boundaryRules: state.boundaryRules };
  Object.assign(state, { gridWrapping: wrapping, rules, boundaryRules });
  try {
    let started = performance.now();
    const cpu = [seed];
    for (let g = 0; g < generations; g++) cpu.push(CPU_STEP[mode](cpu[g]));
    const cpuMs = performance.now() - started;

    started = performance.now();
    const gpu = [seed];
    for await (const grid of evolveOnGpu(device, { mode, seed, generations, wrapping, rules, boundaryRules })) {
      gpu.push(grid);
    }
    const gpuMs = performance.now() - started;

    let mismatch = gpu.length === cpu.length ? null : { reason: `GPU gave ${gpu.length - 1} generations` };
    for (let g = 1; g < cpu.length && !mismatch; g++) {
      mismatch = firstDifference(cpu[g], gpu[g], g);
    }
    return {
      mode, size, generations, wrapping,
      cpuMs: Math.round(cpuMs), gpuMs: Math.round(gpuMs),
      liveCells: { first: seed.active.length, last: cpu[cpu.length - 1].active.length },
      mismatch,
    };
  } finally {
    Object.assign(state, saved);
  }
}

function firstDifference(cpu, gpu, generation) {
  for (let i = 0; i < cpu.data.length; i++) {
    if (cpu.data[i] !== gpu.data[i]) {
      return { generation, index: i, cpu: cpu.data[i], gpu: gpu.data[i] };
    }
  }
  for (const [name, grid] of [['cpu', cpu], ['gpu', gpu]]) {
    if (!activeListsLiveCells(grid)) return { generation, reason: `${name} active list doesn't match its cells` };
  }
  return null;
}

// True if `active` names every cell whose value is 1, each once, and nothing else
function activeListsLiveCells(grid) {
  const seen = new Uint8Array(grid.data.length);
  for (const [x, y, z] of grid.active) {
    const i = grid._idx(x, y, z);
    if (grid.data[i] !== 1 || seen[i]) return false;
    seen[i] = 1;
  }
  return grid.data.every((v, i) => (v === 1) === (seen[i] === 1));
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
