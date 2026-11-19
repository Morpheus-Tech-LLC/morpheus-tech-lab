// SPDX-License-Identifier: Apache-2.0
//
// Checks that the GPU gives exactly the CPU's generations. The app doesn't import this; run it
// from the browser console while `npm run dev` is up, in a browser with WebGPU:
//
//   const { compareGpuWithCpu } = await import('/src/gpu/compare.js');
//   await compareGpuWithCpu({ mode: 'rule30_2D', size: 100, generations: 100, wrapping: false });
//
// It seeds one grid, evolves it with the CPU reference and with the GPU, and compares every
// generation: each cell, and that `active` lists exactly the live cells. Run it after any change
// to a shader, src/gpu/engine.js or a CPU evolve step.

import { state } from '../state.js';
import { Grid3D } from '../grid3D.js';
import { evolveRule30, evolveRule30_2D } from '../matrixFunctions.js';
import { rule30Shape } from '../shapeGenerators.js';
import { getGpuDevice } from './device.js';
import { evolveOnGpu } from './engine.js';

const CPU_STEP = { rule30: evolveRule30, rule30_2D: evolveRule30_2D };

/**
 * @param {object} options
 * @param {'rule30'|'rule30_2D'} [options.mode]
 * @param {number} [options.size]
 * @param {number} [options.generations]
 * @param {boolean} [options.wrapping]
 * @returns {Promise<object>} a summary; `mismatch` is null, or the first difference found
 */
export async function compareGpuWithCpu({
  mode = 'rule30', size = 50, generations = 100, wrapping = true,
} = {}) {
  const device = await getGpuDevice();
  if (!device) throw new Error('No GPU device here, so there is nothing to compare');

  if (!CPU_STEP[mode]) throw new Error(`The GPU runs ${Object.keys(CPU_STEP).join(' and ')}; there is no ${mode} to compare`);
  const seed = new Grid3D(size, 0);
  rule30Shape()(seed, size);

  // The CPU steps read the wrapping from state, so set it for the run and put it back after
  const saved = { gridWrapping: state.gridWrapping };
  Object.assign(state, { gridWrapping: wrapping });
  try {
    let started = performance.now();
    const cpu = [seed];
    for (let g = 0; g < generations; g++) cpu.push(CPU_STEP[mode](cpu[g]));
    const cpuMs = performance.now() - started;

    started = performance.now();
    const gpu = [seed];
    for await (const grid of evolveOnGpu(device, { mode, seed, generations, wrapping })) {
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
