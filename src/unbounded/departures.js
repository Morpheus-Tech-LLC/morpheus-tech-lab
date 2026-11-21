// SPDX-License-Identifier: Apache-2.0
//
// Ships leave at the edge (#100): Classic Methuselah's rule, beside settle.js. A world built with
// the `departures` option ({period: P}) keeps the rule; stepping it through withDepartures() applies
// it. Without the option, the wrapper is step() itself.
//
// Write C(t) for the cells at generation t. When the step from C(t) would bring a cell to life
// outside the arena (step.js's 'arena-edge'), the rule first tries to let a ship leave:
//
//   1. Islands. Live cells within 2 of each other on every axis (Chebyshev distance 2), directly
//      or through other live cells, are one island. Cells 3 or more apart share no neighbour, so
//      removing one island never changes what the others do next.
//   2. The departing islands. A cell outside the arena is born if its live neighbours at t, which
//      all lie on the arena's outermost layer, number one of the rules' birth counts. An island
//      departs if it has a cell next to such a cell. Every such cell's neighbours lie within 2 of
//      each other, so they are all one island's.
//   3. The ship test. Each departing island runs alone, from its cells at t, under the world's
//      rules, with no arena, for up to P generations. It is a ship if at some generation s ≤ P its
//      cells are its cells at t shifted by some d ≠ 0; s is the least such generation. It needs no
//      catalogue of known ships, so it works under any rule.
//   4. Outward. For every face of the arena that the island's outside births cross, d must point
//      out through that face: a ship sliding along a wall isn't leaving.
//   5. If every departing island is an outward ship, each is deleted and recorded as a departure,
//      {generation: t, period: s, shift: d, cells}, and C(t + 1) is computed from what remains.
//      Otherwise the run ends with 'arena-edge', as Methuselah's does.
//
// The deletion belongs to the step from t to t + 1: C(t) itself, as it is hashed, kept as a
// keyframe and compared when settling, is the whole state, ship included. So a keyframe restored
// and stepped on through this wrapper meets the same departures again, and a replay records the
// same list as the run. Departures of one generation are listed in the order of their islands'
// first cells, sorted by z, then y, then x.
//
// It costs nothing until an edge event, and then only the departing islands are tested. A ship
// test's world has the run's memory limit of its own; running out ends the run with that memory
// ending, the machine's limit, never the pattern's.
//
// Nothing here imports `state` or touches the page.

import { World, StopSignal } from './world.js';
import { step } from './step.js';

/** Slab size for a ship test's world: a ship is small, so its slabs are too. */
const TEST_SLAB_BYTES = 1 << 20;
const MEMORY = ['memory-limit', 'out-of-memory'];

/** The 26 neighbour offsets, and the 124 offsets within Chebyshev distance 2. */
const NEAR1 = offsets(1);
const NEAR2 = offsets(2);

function offsets(r) {
  const list = [];
  for (let dz = -r; dz <= r; dz++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) if (dx || dy || dz) list.push([dx, dy, dz]);
    }
  }
  return list;
}

const key = (x, y, z) => `${x},${y},${z}`;

/**
 * A step function that applies a world's departure rule, if it has one, round `base`.
 * @param {typeof step} [base] - the step to wrap; the tests wrap one that counts or moves a clock
 * @returns {typeof step}
 */
export function withDepartures(base = step) {
  return (world, options) => {
    if (world.stopReason) return world.stopReason;
    const reason = base(world, options);
    if (reason !== 'arena-edge' || !world.departures) return reason;
    return depart(world, base, options);
  };
}

/** step(), with the departure rule of a world that has one. */
export const stepWithDepartures = withDepartures(step);

/**
 * The step from C(t) has just ended at the edge: lets the departing islands leave if they are all
 * outward ships, and steps again without them.
 * @returns {string | null} the stop reason, or null once generation t + 1 is made
 */
function depart(world, base, options) {
  world.stopReason = null;
  let found;
  try {
    found = departures(world);
  } catch (err) {
    if (err instanceof StopSignal && MEMORY.includes(err.reason)) return world.stop(err.reason);
    throw err;
  }
  if (!found) return world.stop('arena-edge');

  const cells = Int32Array.from(found.flatMap((d) => d.cells.flat()));
  world.writeCells(cells, 0);
  const reason = base(world, options);
  if (reason) {
    // Generation t stands as it was, ship included, as any failed step leaves it
    world.stopReason = null;
    world.writeCells(cells, 1);
    return world.stop(reason);
  }
  world.departed.push(...found);
  return null;
}

/**
 * The departures the rule makes from the world's current generation, if every departing island
 * is an outward ship; null if any isn't, or none departs.
 * @param {World} world - with an arena and a departure rule
 * @returns {{generation: number, period: number, shift: number[], cells: number[][]}[] | null}
 * @throws {StopSignal} if a ship test runs out of memory
 */
export function departures(world) {
  const islands = departingIslands(world);
  if (!islands.length) return null;
  const found = [];
  for (const island of islands) {
    const ship = shipTest(world, island.cells, world.departures.period);
    if (!ship || !outward(ship.shift, island.faces)) return null;
    found.push({ generation: world.generation, period: ship.period, shift: ship.shift, cells: island.cells });
  }
  return found;
}

/**
 * The islands with a cell next to a cell that would be born outside the arena, in the order of
 * their first cells (z, then y, then x), each with its cells, sorted the same way, and the faces
 * of the arena its outside births cross: [axis, -1 | 1] each.
 * @param {World} world
 * @returns {{cells: number[][], faces: number[][]}[]}
 */
export function departingIslands(world) {
  const { arena } = world;
  const inside = (x, y, z) => x >= arena.min[0] && x <= arena.max[0] && y >= arena.min[1] && y <= arena.max[1]
    && z >= arena.min[2] && z <= arena.max[2];

  // The live cells of the arena's outermost layer: the only ones next to a cell outside it
  const boundary = new Map();
  for (let axis = 0; axis < 3; axis++) {
    for (const index of new Set([arena.min[axis], arena.max[axis]])) {
      const flat = world.cellsInPlane(axis, index);
      for (let i = 0; i < flat.length; i += 3) boundary.set(key(flat[i], flat[i + 1], flat[i + 2]), [flat[i], flat[i + 1], flat[i + 2]]);
    }
  }

  // Each outside cell's live neighbours, and so which of them would be born
  const outside = new Map();
  for (const [x, y, z] of boundary.values()) {
    for (const [dx, dy, dz] of NEAR1) {
      const [ox, oy, oz] = [x + dx, y + dy, z + dz];
      if (inside(ox, oy, oz)) continue;
      const k = key(ox, oy, oz);
      const seen = outside.get(k);
      if (seen) seen.count++;
      else outside.set(k, { cell: [ox, oy, oz], count: 1 });
    }
  }

  // Flood each departing island from a live neighbour of a birth, Chebyshev distance 2 apart
  const islandOf = new Map(); // a live cell's key -> its island
  const islands = [];
  for (const { cell, count } of outside.values()) {
    if (!world.table[count]) continue; // a dead cell with `count` live neighbours stays dead
    const faces = [];
    for (let a = 0; a < 3; a++) {
      if (cell[a] < arena.min[a]) faces.push([a, -1]);
      if (cell[a] > arena.max[a]) faces.push([a, 1]);
    }
    let island = null;
    for (const [dx, dy, dz] of NEAR1) {
      const [x, y, z] = [cell[0] + dx, cell[1] + dy, cell[2] + dz];
      if (!inside(x, y, z) || !world.has(x, y, z)) continue;
      island = islandOf.get(key(x, y, z)) ?? flood(world, [x, y, z], islandOf, islands);
      break;
    }
    if (!island) continue; // can't happen: without B0, a birth has a live neighbour
    for (const face of faces) {
      if (!island.faces.some(([a, s]) => a === face[0] && s === face[1])) island.faces.push(face);
    }
  }

  for (const island of islands) island.cells.sort(zyx);
  islands.sort((a, b) => zyx(a.cells[0], b.cells[0]));
  return islands;
}

/** The island of live cells reached from `start`, Chebyshev distance 2 at a time. */
function flood(world, start, islandOf, islands) {
  const island = { cells: [], faces: [] };
  islands.push(island);
  const queue = [start];
  islandOf.set(key(...start), island);
  while (queue.length) {
    const [x, y, z] = queue.pop();
    island.cells.push([x, y, z]);
    for (const [dx, dy, dz] of NEAR2) {
      const [nx, ny, nz] = [x + dx, y + dy, z + dz];
      const k = key(nx, ny, nz);
      if (islandOf.has(k) || !world.has(nx, ny, nz)) continue;
      islandOf.set(k, island);
      queue.push([nx, ny, nz]);
    }
  }
  return island;
}

/** Orders cells by z, then y, then x. */
function zyx(a, b) {
  return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
}

/**
 * Runs an island alone, with no arena, for up to `period` generations.
 * @param {World} world - for its rules, chunk size and memory limit
 * @param {number[][]} cells
 * @param {number} period
 * @returns {{period: number, shift: number[]} | null} the least s at which its cells are its cells
 *   at the start shifted by some d ≠ 0, and d; null if there is none
 * @throws {StopSignal} if it runs out of memory
 */
export function shipTest(world, cells, period) {
  const test = new World({
    rules: world.rules, chunkSize: world.n, slabBytes: Math.max(TEST_SLAB_BYTES, world.slotBytes),
    limits: { memory: world.limits.memory },
  });
  try {
    test.setCells(cells);
  } catch (err) {
    if (err.reason && MEMORY.includes(err.reason)) throw new StopSignal(err.reason);
    throw err;
  }
  const start = test.extent();
  for (let s = 1; s <= period; s++) {
    const reason = step(test);
    if (reason) {
      if (MEMORY.includes(reason)) throw new StopSignal(reason);
      return null; // past the representable space: not a ship this test can see
    }
    if (test.liveCells !== cells.length) continue;
    const box = test.extent();
    const shift = box.min.map((c, a) => c - start.min[a]);
    if (!shift.some((d) => d !== 0)) continue;
    if (!box.max.every((c, a) => c - start.max[a] === shift[a])) continue;
    if (cells.every(([x, y, z]) => test.has(x + shift[0], y + shift[1], z + shift[2]))) return { period: s, shift };
  }
  return null;
}

/** Whether a shift points out through every one of the faces: [axis, -1 | 1] each. */
export function outward(shift, faces) {
  return faces.every(([axis, side]) => Math.sign(shift[axis]) === side);
}
