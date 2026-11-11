// SPDX-License-Identifier: Apache-2.0
//
// Every limit ends a run with its reason, discards the step that would have crossed it, and
// keeps the last complete generation: whole, unwrapped and unclipped.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World, WorldError, COORDINATE_LIMIT } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { ReferenceWorld } from '../../src/unbounded/reference.js';
import { GROWING, randomSeed, cellsOf, difference } from './helpers.js';

const SEED = randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 });

/**
 * Runs a world until a limit ends it, beside the reference, and checks that it ended with
 * `reason`, kept the reference's cells at its last generation, and that the reference's next
 * generation does cross the limit (`crosses`), so the run didn't end early.
 */
function runToLimit({ reason, crosses, seed = SEED, maxGenerations = 200, ...options }) {
  const world = new World({ rules: GROWING, chunkSize: 8, slabBytes: 1 << 20, ...options });
  world.setCells(seed);
  const reference = new ReferenceWorld(GROWING, seed);
  let ended = null;
  while (!ended && world.generation < maxGenerations) {
    ended = step(world);
    if (!ended) reference.step();
  }
  assert.equal(ended, reason, `ended at generation ${world.generation} with ${ended}`);
  assert.equal(world.stopReason, reason);

  const last = reference.cells();
  assert.equal(difference(cellsOf(world), last), null, 'the last complete generation is kept');
  reference.step();
  assert.ok(crosses(reference.cells()), 'the discarded generation does cross the limit');

  // The run has ended: stepping again changes nothing
  const generation = world.generation;
  assert.equal(step(world), reason);
  assert.equal(world.generation, generation);
  assert.equal(difference(cellsOf(world), last), null);
  return world;
}

const extentOf = (cells) => {
  let longest = 0;
  for (let a = 0; a < 3; a++) {
    const values = cells.map((c) => c[a]);
    longest = Math.max(longest, Math.max(...values) - Math.min(...values) + 1);
  }
  return longest;
};

test('cell-limit: more live cells than the limit', () => {
  const world = runToLimit({ reason: 'cell-limit', limits: { cells: 1000 }, crosses: (cells) => cells.length > 1000 });
  assert.ok(world.liveCells <= 1000);
});

test('extent-limit: a side of the bounding box past the limit', () => {
  const world = runToLimit({ reason: 'extent-limit', limits: { extent: 20 }, crosses: (cells) => extentOf(cells) > 20 });
  assert.ok(extentOf(cellsOf(world)) <= 20);
});

test('arena-edge: a cell would come to life outside the arena', () => {
  const arena = { min: [-10, -12, -9], max: [9, 11, 10] };
  const outside = ([x, y, z]) => x < arena.min[0] || x > arena.max[0] || y < arena.min[1]
    || y > arena.max[1] || z < arena.min[2] || z > arena.max[2];
  const world = runToLimit({ reason: 'arena-edge', arena, crosses: (cells) => cells.some(outside) });
  assert.ok(!cellsOf(world).some(outside));
});

test('arena: refuses a seed cell outside it', () => {
  const world = new World({ rules: GROWING, arena: { min: [0, 0, 0], max: [9, 9, 9] } });
  assert.throws(() => world.setCells([[10, 0, 0]]), WorldError);
});

for (const side of ['high', 'low']) {
  test(`coordinate-limit: a cell past the representable space, on the ${side} side`, () => {
    const corner = side === 'high' ? COORDINATE_LIMIT - 6 : -COORDINATE_LIMIT;
    const seed = randomSeed({ min: [corner, 0, corner], size: [6, 6, 6], randomSeed: 1 });
    const beyond = ([x, y, z]) => [x, y, z].some((c) => c < -COORDINATE_LIMIT || c >= COORDINATE_LIMIT);
    const world = runToLimit({ reason: 'coordinate-limit', seed, crosses: (cells) => cells.some(beyond) });
    assert.ok(!cellsOf(world).some(beyond));
  });
}

test('memory-limit: another slab would pass the engine\'s memory ceiling', () => {
  const slabBytes = 2 * 8 ** 3; // one chunk per slab
  const limit = 60 * slabBytes;
  const world = runToLimit({
    reason: 'memory-limit', slabBytes, limits: { memory: limit },
    crosses: () => true, // the step needed more chunks than fit; its cells don't show that
  });
  assert.ok(world.memoryBytes <= limit);
  // A failed step returns the chunks it borrowed: only the live ones remain
  assert.equal(world.free.length + world.chunkCount, world.memoryBytes / slabBytes);
});

test('out-of-memory: the browser refuses a new slab', () => {
  let slabs = 0;
  const allocate = (bytes) => {
    if (++slabs > 30) throw new RangeError('Array buffer allocation failed');
    return new ArrayBuffer(bytes);
  };
  const world = runToLimit({ reason: 'out-of-memory', slabBytes: 2 * 8 ** 3, allocate, crosses: () => true });
  assert.equal(world.slabs.length, 30);
});

test('an allocation error other than a refusal is not mistaken for one', () => {
  const allocate = () => {
    throw new TypeError('a bug, not a refusal');
  };
  const world = new World({ rules: GROWING, allocate });
  assert.throws(() => world.setCells([[0, 0, 0]]), TypeError);
});

test('a seed that is already past a limit is refused', () => {
  assert.throws(() => new World({ rules: GROWING, limits: { cells: 3 } }).setCells(SEED), WorldError);
  assert.throws(() => new World({ rules: GROWING, limits: { extent: 3 } }).setCells(SEED), WorldError);
  assert.throws(
    () => new World({ rules: GROWING, chunkSize: 8, slabBytes: 1024, limits: { memory: 1024 } }).setCells(SEED),
    WorldError,
  );
});
