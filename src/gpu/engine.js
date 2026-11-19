// SPDX-License-Identifier: Apache-2.0
//
// Runs Rule 30 (1D and 2D) on the GPU with a WebGPU compute shader.
//
// The CPU functions in matrixFunctions.js are the reference: every grid this yields must equal
// theirs, cell for cell, and compare.js checks that. Cells live on the GPU packed four to a u32
// word, which is byte for byte the layout of a Uint8Array, so results read back with one copy.
//
// Rule 30 only ever grows one layer below its lowest, so the GPU steps just that size² layer, and
// each grid is built here from the one before it plus the new layer, as evolveRule30() builds it.
// (The old, precomputed Game of Life 3D mode had a kernel here too; it was retired in #116, and
// Game of Life 3D runs on the unbounded engine, src/unbounded/, on the CPU.)

import { Grid3D } from '../grid3D.js';
import rule30Source from '../shaders/rule30.wgsl?raw';

const WORKGROUP_SIZE = 64;
// Generations are read back in batches through one staging buffer of up to this size
const STAGING_BYTES = 64 * 1024 * 1024;

/** The GPU mode for a run's mode flags, or null if that mode runs on the CPU only. */
export function gpuModeOf({ useRule30, useRule30_2D, useSineWave, useSandpile }) {
  if (useSineWave || useSandpile) return null;
  if (useRule30_2D) return 'rule30_2D';
  if (useRule30) return 'rule30';
  return null;
}

/**
 * True if `grid` is a plain seed: every cell 0 or 1, and `active` lists exactly the 1s, each once,
 * inside the grid. The GPU only takes plain seeds; any other grid runs on the CPU.
 */
export function isPlainGrid(grid) {
  const { size, data, active } = grid;
  let live = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 1) live++;
    else if (data[i] !== 0) return false;
  }
  if (live !== active.length) return false;
  const seen = new Uint8Array(data.length);
  for (const [x, y, z] of active) {
    const inside = [x, y, z].every((c) => Number.isInteger(c) && c >= 0 && c < size);
    if (!inside) return false;
    const i = grid._idx(x, y, z);
    if (data[i] !== 1 || seen[i]) return false;
    seen[i] = 1;
  }
  return true;
}

/**
 * Evolves `seed` for `generations` steps on the GPU and yields each new Grid3D in order.
 * Throws if the GPU fails or the device is lost; the grids already yielded are still good, so
 * the caller can carry on from the last one on the CPU.
 *
 * @param {GPUDevice} device
 * @param {object} run
 * @param {'rule30'|'rule30_2D'} run.mode
 * @param {Grid3D} run.seed - a plain grid (see isPlainGrid)
 * @param {number} run.generations
 * @param {boolean} run.wrapping
 */
export async function* evolveOnGpu(device, { mode, seed, generations, wrapping }) {
  const plan = rule30Plan(seed, mode === 'rule30_2D');
  const { cellCount } = plan;
  const wordCount = Math.ceil(cellCount / 4);
  const slotBytes = wordCount * 4;
  if (slotBytes > device.limits.maxStorageBufferBindingSize) {
    throw new Error(`A ${seed.size}³ grid is larger than this GPU's storage buffer limit`);
  }

  let lost = false;
  const lostSignal = device.lost.then(() => {
    lost = true;
    throw new Error('The GPU device was lost');
  });
  lostSignal.catch(() => {});

  const batchMax = Math.max(1, Math.min(generations, Math.floor(STAGING_BYTES / slotBytes)));
  const groups = Math.ceil(wordCount / WORKGROUP_SIZE);
  const groupsX = Math.min(groups, device.limits.maxComputeWorkgroupsPerDimension);
  const groupsY = Math.ceil(groups / groupsX);
  const buffers = [];
  const createBuffer = (descriptor) => {
    const buffer = device.createBuffer(descriptor);
    buffers.push(buffer);
    return buffer;
  };

  try {
    device.pushErrorScope('out-of-memory');
    device.pushErrorScope('validation');

    const { layout, pipeline } = getPipelines(device)[plan.kernel];

    // Params, as the shader's struct: size, cellCount, wordCount, wrap, rowWords, then the mode's
    const params = new Uint32Array(16);
    params.set([seed.size, cellCount, wordCount, wrapping ? 1 : 0, groupsX * WORKGROUP_SIZE]);
    params.set(plan.params, 5);
    const paramsBuffer = createBuffer({ size: params.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(paramsBuffer, 0, params);

    const cells = [0, 1].map(() => createBuffer({
      size: slotBytes,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    }));
    const initial = new Uint8Array(slotBytes);
    initial.set(plan.initial);
    device.queue.writeBuffer(cells[0], 0, initial);

    // bindGroups[k] reads cells[k] and writes the other buffer
    const bindGroups = [0, 1].map((k) => device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: paramsBuffer } },
        { binding: 1, resource: { buffer: cells[k] } },
        { binding: 2, resource: { buffer: cells[1 - k] } },
      ],
    }));

    const staging = createBuffer({ size: batchMax * slotBytes, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });

    const setupErrors = [device.popErrorScope(), device.popErrorScope()];
    const setupError = (await Promise.all(setupErrors)).find(Boolean);
    if (setupError) throw new Error(`GPU setup failed: ${setupError.message}`);

    let source = 0;
    let previous = seed;
    for (let done = 0; done < generations; ) {
      const batch = Math.min(batchMax, generations - done);

      device.pushErrorScope('out-of-memory');
      device.pushErrorScope('validation');
      const encoder = device.createCommandEncoder();
      for (let k = 0; k < batch; k++) {
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroups[source]);
        pass.dispatchWorkgroups(groupsX, groupsY);
        pass.end();
        source = 1 - source;
        encoder.copyBufferToBuffer(cells[source], 0, staging, k * slotBytes, slotBytes);
      }
      device.queue.submit([encoder.finish()]);
      const batchErrors = [device.popErrorScope(), device.popErrorScope()];

      const mapped = staging.mapAsync(GPUMapMode.READ, 0, batch * slotBytes);
      mapped.catch(() => {});
      await Promise.race([mapped, lostSignal]);
      const batchError = (await Promise.all(batchErrors)).find(Boolean);
      if (lost || batchError) {
        throw new Error(batchError ? `GPU step failed: ${batchError.message}` : 'The GPU device was lost');
      }

      const bytes = new Uint8Array(staging.getMappedRange(0, batch * slotBytes));
      const grids = [];
      for (let k = 0; k < batch; k++) {
        previous = plan.toGrid(bytes.subarray(k * slotBytes, k * slotBytes + cellCount), previous);
        grids.push(previous);
      }
      staging.unmap();

      for (const grid of grids) yield grid;
      done += batch;
    }
  } finally {
    for (const buffer of buffers) buffer.destroy();
  }
}

// Rule 30: the GPU holds only the lowest layer, and each generation reads back the layer below
// it. As in evolveRule30(), a new layer goes one below the lowest live cell; it becomes the
// lowest only if it has a live cell. If it has none, every later layer is empty too, on the CPU
// (which steps the same layer again) and on the GPU (which steps the empty one).
function rule30Plan(seed, twoD) {
  const { size } = seed;
  let bottom = -1;
  for (const [, y] of seed.active) bottom = Math.max(bottom, y);

  const initial = new Uint8Array(size * size);
  if (bottom >= 0) {
    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) initial[x + z * size] = seed.get(x, bottom, z);
    }
  }

  return {
    kernel: 'rule30',
    cellCount: size * size,
    initial,
    params: [twoD ? 1 : 0],
    toGrid(layer, previous) {
      const grid = new Grid3D(size, 0);
      if (bottom < 0) return grid; // an empty grid stays empty
      // Keep every cell, in the same order; the cells' [x, y, z] arrays are shared, read-only
      grid.data.set(previous.data);
      grid.active = previous.active.slice();
      if (bottom >= size - 1) return grid; // the lowest layer is the grid's last
      const y = bottom + 1;
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          if (layer[x + z * size] === 1) {
            grid.data[grid._idx(x, y, z)] = 1;
            grid.active.push([x, y, z]);
            bottom = y;
          }
        }
      }
      return grid;
    },
  };
}

// Compiled once per device. The shader binds params, the current cells and the next cells.
const pipelineCache = new WeakMap();

function getPipelines(device) {
  let cached = pipelineCache.get(device);
  if (cached) return cached;

  const entry = (binding, type) => ({ binding, visibility: GPUShaderStage.COMPUTE, buffer: { type } });
  const layout = device.createBindGroupLayout({
    entries: [entry(0, 'uniform'), entry(1, 'read-only-storage'), entry(2, 'storage')],
  });
  const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [layout] });
  const pipeline = (label, code) => device.createComputePipeline({
    layout: pipelineLayout,
    compute: { module: device.createShaderModule({ label, code }), entryPoint: 'stepGeneration' },
  });

  cached = {
    rule30: { layout, pipeline: pipeline('rule30.wgsl', rule30Source) },
  };
  pipelineCache.set(device, cached);
  return cached;
}
