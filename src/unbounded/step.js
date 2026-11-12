// SPDX-License-Identifier: Apache-2.0
//
// One generation of the unbounded Game of Life 3D, as a single lockstep over the whole world:
//
// 1. The work set is every chunk with live cells, plus every neighbouring chunk (across a face,
//    an edge or a corner) that a live border cell touches. Those neighbours are allocated empty.
// 2. Every chunk in the work set reads generation t, from its own current copy and its
//    neighbours' current copies, and writes generation t+1 to its other copy. Nothing is
//    updated in place, so the order the chunks are processed in can't change the result.
// 3. The candidate generation is checked against the caller's veto (a timed run's deadline),
//    then the limits. If either ends the run, the step is discarded: the run ends with that
//    reason, and generation t stands, whole and unclipped.
// 4. Otherwise every chunk switches to its new copy at once, and chunks left empty are released.
//
// Space with no live cell in or next to it is skipped, and that is exact: rules.js refuses B0,
// so a dead cell with no live neighbour can't be born.

import { COORDINATE_LIMIT, StopSignal, boxOf, inBox, longestSide, setFacts, borderClass, cellHashA, cellHashB } from './world.js';

/**
 * Advances the world one generation, unless a limit ends the run.
 * @param {import('./world.js').World} world
 * @param {object} [options]
 * @param {(slots: number[]) => void} [options.order] - may reorder the work set in place
 *   before it is computed; the tests use it to show that the order doesn't matter
 * @param {() => string | null} [options.veto] - called once generation t+1 is computed, before
 *   anything else: a reason it returns ends the run and discards the generation, as a limit
 *   does. A timed run uses it to drop a generation that finished after its deadline.
 * @returns {string | null} the stop reason if the run has ended, or null
 */
export function step(world, { order, veto } = {}) {
  if (world.stopReason) return world.stopReason;

  // 1. The work set
  const live = [...world.chunks.values()];
  const work = [...live];
  const created = [];
  try {
    for (const slot of live) {
      const touch = world.meta.touch[slot];
      if (!touch) continue;
      for (let d = 0; d < 27; d++) {
        if (!(touch & (1 << d))) continue;
        const cx = world.meta.cx[slot] + (d % 3) - 1;
        const cy = world.meta.cy[slot] + (Math.floor(d / 3) % 3) - 1;
        const cz = world.meta.cz[slot] + Math.floor(d / 9) - 1;
        const before = world.chunks.size;
        const neighbour = world.slotFor(cx, cy, cz);
        if (world.chunks.size > before) {
          created.push(neighbour);
          work.push(neighbour);
        }
      }
    }
  } catch (err) {
    if (!(err instanceof StopSignal)) throw err;
    for (const slot of created) world.release(slot);
    return world.stop(err.reason);
  }

  // 2. Compute generation t+1 for every chunk in the work set
  if (order) order(work);
  for (const slot of work) computeChunk(world, slot);

  // 3. Check the candidate against the veto, then the limits
  let cells = 0;
  for (const slot of work) cells += world.next.live[slot];
  const box = boxOf(world.next, work, world.n);
  const reason = (veto && veto()) || (box && limitCrossed(world, box, cells));
  if (reason) {
    for (const slot of created) world.release(slot);
    return world.stop(reason);
  }

  // 4. Commit: every chunk moves to generation t+1 together
  world.parity ^= 1;
  for (const slot of work) {
    world.meta.live[slot] = world.next.live[slot];
    world.meta.touch[slot] = world.next.touch[slot];
    world.meta.box.set(world.next.box.subarray(6 * slot, 6 * slot + 6), 6 * slot);
    world.meta.hashA[slot] = world.next.hashA[slot];
    world.meta.hashB[slot] = world.next.hashB[slot];
    if (!world.meta.live[slot]) world.release(slot);
  }
  world.generation++;
  return null;
}

/** The first limit a candidate generation crosses, in a fixed order, or null. */
function limitCrossed(world, box, cells) {
  const outside = box.min.some((c) => c < -COORDINATE_LIMIT) || box.max.some((c) => c >= COORDINATE_LIMIT);
  if (outside) return 'coordinate-limit';
  if (world.arena && !(inBox(world.arena, ...box.min) && inBox(world.arena, ...box.max))) return 'arena-edge';
  if (longestSide(box) > world.limits.extent) return 'extent-limit';
  if (cells > world.limits.cells) return 'cell-limit';
  return null;
}

/**
 * Writes generation t+1 of one chunk into its other copy, and records its live cells, border
 * contacts and bounding box in world.next. Reads only generation t. Exported for the bench
 * (scripts/bench/), which times it on its own; only step() calls it otherwise.
 */
export function computeChunk(world, slot) {
  const { n, padded: p, sumX, sumXY, table } = world;
  const m = n + 2, mm = m * m, nn = n * n, nm = n * m;
  const { cx, cy, cz } = world.meta;
  const ox = cx[slot], oy = cy[slot], oz = cz[slot];

  // The chunk's cells at generation t, with a one-cell border read from its neighbours.
  // Each axis offset d = -1, 0, +1 maps the neighbour's local range to the padded range.
  p.fill(0);
  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const neighbour = world.findSlot(ox + dx, oy + dy, oz + dz);
        if (neighbour === undefined) continue;
        const [slab, base] = world.current(neighbour);
        const [x0, xLen, px0] = span(dx, n);
        const [y0, yLen, py0] = span(dy, n);
        const [z0, zLen, pz0] = span(dz, n);
        for (let z = 0; z < zLen; z++) {
          for (let y = 0; y < yLen; y++) {
            const src = base + x0 + (y0 + y) * n + (z0 + z) * nn;
            const dst = px0 + (py0 + y) * m + (pz0 + z) * mm;
            for (let x = 0; x < xLen; x++) p[dst + x] = slab[src + x];
          }
        }
      }
    }
  }

  // Each cell's 3×3×3 block total, as three passes of three: along x, then y, then z
  for (let z = 0; z < m; z++) {
    for (let y = 0; y < m; y++) {
      const src = y * m + z * mm, dst = y * n + z * nm;
      for (let x = 0; x < n; x++) sumX[dst + x] = p[src + x] + p[src + x + 1] + p[src + x + 2];
    }
  }
  for (let z = 0; z < m; z++) {
    for (let y = 0; y < n; y++) {
      const src = y * n + z * nm, dst = y * n + z * nn;
      for (let x = 0; x < n; x++) sumXY[dst + x] = sumX[src + x] + sumX[src + x + n] + sumX[src + x + 2 * n];
    }
  }

  // Apply the rule: neighbours = block total - the cell itself
  const [slab, base] = world.copy(slot, world.parity ^ 1);
  const box = [n, n, n, -1, -1, -1];
  let live = 0;
  let classes = 0;
  const fingerprinting = world.fingerprinting;
  const gx = ox * n, gy = oy * n, gz = oz * n;
  let hashA = 0;
  let hashB = 0;
  for (let z = 0; z < n; z++) {
    const zClass = 9 * borderClass(z, n);
    for (let y = 0; y < n; y++) {
      const rowClass = zClass + 3 * borderClass(y, n);
      const row = y * n + z * nn;
      const self = (y + 1) * m + (z + 1) * mm + 1;
      for (let x = 0; x < n; x++) {
        const i = row + x;
        const alive = p[self + x];
        const count = sumXY[i] + sumXY[i + nn] + sumXY[i + 2 * nn] - alive;
        const next = table[alive * 27 + count];
        slab[base + i] = next;
        if (next) {
          live++;
          classes |= 1 << (rowClass + borderClass(x, n));
          if (fingerprinting) {
            hashA = (hashA + cellHashA(gx + x, gy + y, gz + z)) | 0;
            hashB = (hashB + cellHashB(gx + x, gy + y, gz + z)) | 0;
          }
          if (x < box[0]) box[0] = x;
          if (x > box[3]) box[3] = x;
          if (y < box[1]) box[1] = y;
          if (y > box[4]) box[4] = y;
          if (z < box[2]) box[2] = z;
          if (z > box[5]) box[5] = z;
        }
      }
    }
  }
  world.next.cx[slot] = ox;
  world.next.cy[slot] = oy;
  world.next.cz[slot] = oz;
  setFacts(world.next, slot, live, classes, box, n);
  world.next.hashA[slot] = hashA;
  world.next.hashB[slot] = hashB;
}

// [first local cell, length, first padded cell] of a neighbour's cells that border this chunk
function span(d, n) {
  if (d < 0) return [n - 1, 1, 0];
  if (d > 0) return [0, 1, n + 1];
  return [0, n, 1];
}
