// SPDX-License-Identifier: Apache-2.0
//
// Settling (settle.js, #41): a run ends when its pattern dies out or repeats in place, each repeat
// confirmed cell for cell. Each ending on small hand-made patterns, at every chunk size; the
// budget's boundary; false fingerprint matches; keyframes; and B1 rules, which always reach the
// arena's edge.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { Run } from '../../src/unbounded/run.js';
import { Settler, REPEAT_WINDOW, sameCells } from '../../src/unbounded/settle.js';
import { Keyframes } from '../../src/unbounded/keyframes.js';
import { ReferenceWorld } from '../../src/unbounded/reference.js';
import { DISCOVERY_ARENA, SEED_BOX } from '../../src/unbounded/contests.js';
import { cellsOf, DIES, STILL, OSCILLATOR, SHIP } from './helpers.js';

/**
 * The oracle: the reference engine, with every generation's cells kept as text, so the first
 * repeat is found by exact comparison alone. No arena: these patterns stay small.
 */
function firstSettling({ rules, seed }, generations) {
  const reference = new ReferenceWorld(rules, seed);
  const seen = new Map();
  for (let g = 0; g <= generations; g++) {
    const cells = reference.cells();
    if (!cells.length) return { ending: 'died', from: g, period: 1 };
    const key = JSON.stringify(cells);
    if (seen.has(key)) return { ending: 'repeat', from: seen.get(key), period: g - seen.get(key) };
    seen.set(key, g);
    reference.step();
  }
  return null;
}

/** A settling Run to its end, on a host whose clock stands still, so it runs straight through. */
function settle({ rules, seed }, { budget, chunkSize = 16, arena = DISCOVERY_ARENA, keyframeBytes, keyframeEvery } = {}) {
  const messages = [];
  const queue = [];
  const run = new Run({ post: (m) => messages.push(m), now: () => 0, yieldThen: (fn) => queue.push(fn), wait: (ms, fn) => queue.push(fn) });
  const kind = { kind: 'open', settle: true };
  if (keyframeBytes !== undefined) kind.keyframeBytes = keyframeBytes;
  if (keyframeEvery !== undefined) kind.keyframeEvery = keyframeEvery;
  const start = { type: 'start', world: { rules, chunkSize, arena, slabBytes: 1 << 20 }, seed: Int32Array.from(seed.flat()), run: kind };
  if (budget !== undefined) start.generations = budget;
  run.receive(start);
  while (queue.length) queue.shift()();
  const errors = messages.filter((m) => m.type === 'error');
  assert.deepEqual(errors, []);
  const end = messages.find((m) => m.type === 'state' && m.state === 'ended');
  return { reason: end.reason, generation: end.stats.generation, cycle: end.cycle ?? null, run };
}

/** A world and its settler, stepped by hand until it settles, ends, or reaches `budget`. */
function settleByHand({ rules, seed }, { budget = Infinity, fingerprint, keyframeBytes, keyframeEvery, chunkSize = 8 } = {}) {
  const options = { rules, chunkSize, arena: DISCOVERY_ARENA, slabBytes: 1 << 20 };
  const world = new World({ ...options, fingerprint: true });
  world.setCells(seed);
  const settler = new Settler(world, { world: options, budget, fingerprint, keyframeBytes, keyframeEvery });
  while (world.generation < budget) {
    const reason = step(world);
    if (reason) return { ending: reason, world, settler };
    const found = settler.check(world);
    if (found) return { ...found, world, settler };
  }
  return { ending: 'generation-limit', world, settler };
}

test('the patterns settle as the oracle says, cell for cell', () => {
  assert.deepEqual(firstSettling(DIES, 100), { ending: 'died', from: 10, period: 1 });
  assert.deepEqual(firstSettling(STILL, 100), { ending: 'repeat', from: 4, period: 1 });
  assert.deepEqual(firstSettling(OSCILLATOR, 100), { ending: 'repeat', from: 4, period: 5 });
  // Each lies in the seed box
  for (const { seed } of [DIES, STILL, OSCILLATOR, SHIP]) {
    assert.ok(seed.every((cell) => cell.every((c, a) => c >= SEED_BOX.min[a] && c <= SEED_BOX.max[a])));
  }
});

for (const chunkSize of [8, 16, 32]) {
  test(`each ending, as a settling run finds it, at chunk size ${chunkSize}`, () => {
    // Death: the generation the last cell died
    const dies = settle(DIES, { chunkSize, budget: 10_000 });
    assert.deepEqual([dies.reason, dies.generation, dies.cycle], ['died', 10, null]);
    // A still life formed at 4 ends at 4, a repeat of period 1
    const still = settle(STILL, { chunkSize, budget: 10_000 });
    assert.deepEqual([still.reason, still.generation, still.cycle], ['repeat', 4, { from: 4, period: 1 }]);
    // An oscillator ends where its cycle began, with its period
    const osc = settle(OSCILLATOR, { chunkSize, budget: 10_000 });
    assert.deepEqual([osc.reason, osc.generation, osc.cycle], ['repeat', 4, { from: 4, period: 5 }]);
    // A pattern that leaves a moving object behind never repeats in place: it reaches the edge
    const ship = settle(SHIP, { chunkSize, budget: 10_000 });
    assert.equal(ship.reason, 'arena-edge');
    assert.ok(ship.generation > 24 && ship.generation < 100, `the edge at generation ${ship.generation}`);
    assert.ok(ship.run.world.liveCells <= 20, 'only the ship and what it left');
    // A pattern still unsettled at the budget runs it out
    const budget = settle(OSCILLATOR, { chunkSize, budget: 8 });
    assert.deepEqual([budget.reason, budget.generation], ['generation-limit', 8]);
  });
}

test("the budget's boundary: a death at B − 1 settles and one at B doesn't; a repeat found at B settles", () => {
  // DIES dies at 10: its cycle C(10) = C(11) closes within a budget of 11, not of 10
  assert.deepEqual([settle(DIES, { budget: 11 }).reason, settle(DIES, { budget: 11 }).generation], ['died', 10]);
  const late = settle(DIES, { budget: 10 });
  assert.deepEqual([late.reason, late.generation], ['generation-limit', 10]);
  assert.equal(late.run.world.liveCells, 0, 'it did die, at the budget, too late to settle');
  // OSCILLATOR's cycle begins at 4 and is found at 9: within a budget of 9, not of 8
  assert.deepEqual(settle(OSCILLATOR, { budget: 9 }).cycle, { from: 4, period: 5 });
  assert.equal(settle(OSCILLATOR, { budget: 8 }).reason, 'generation-limit');
  // Without a budget, as in Explore, a death always settles
  assert.equal(settle(DIES).reason, 'died');
});

test('the repeat window covers the whole budget: a cycle from generation 0 that closes exactly at B is found', () => {
  // OSCILLATOR's generation 4 as a seed: a cycle of period 5 from generation 0
  const world = new World({ rules: OSCILLATOR.rules, chunkSize: 8 });
  world.setCells(OSCILLATOR.seed);
  while (world.generation < 4) step(world);
  const cycling = { rules: OSCILLATOR.rules, seed: cellsOf(world) };
  const found = settle(cycling, { budget: 5 });
  assert.deepEqual([found.reason, found.generation, found.cycle], ['repeat', 0, { from: 0, period: 5 }]);
  assert.equal(found.run.settler.window, 5, 'the window is the budget');
  assert.equal(settle(cycling, { budget: 4 }).reason, 'generation-limit');
  // An open-ended run looks back REPEAT_WINDOW generations
  assert.equal(settle(cycling).run.settler.window, REPEAT_WINDOW);
  assert.equal(REPEAT_WINDOW, 10_000);
});

test('a forced false fingerprint match is rejected, and the run carries on to its true repeat', () => {
  for (const pattern of [STILL, OSCILLATOR]) {
    const truth = settleByHand(pattern);
    assert.equal(truth.settler.rejected, 0, 'no false match on its own');
    // Every generation shares one fingerprint: each proposes every earlier generation
    const all = settleByHand(pattern, { fingerprint: () => 'same' });
    assert.deepEqual([all.ending, all.from, all.period], [truth.ending, truth.from, truth.period]);
    assert.ok(all.settler.rejected > 0, `${all.settler.rejected} false matches rejected`);
    assert.equal(all.settler.proposed, all.settler.rejected + 1);
    // One false match, forced on purpose: generation 3 looks like generation 1
    const one = settleByHand(pattern, {
      fingerprint: (w) => (w.generation === 1 || w.generation === 3 ? 'forced' : w.fingerprint()),
    });
    assert.deepEqual([one.ending, one.from, one.period], [truth.ending, truth.from, truth.period]);
    assert.deepEqual([one.settler.proposed, one.settler.rejected], [2, 1]);
  }
  // A fingerprint that never repeats would miss the repeat; one that always does can't fake one
  const never = settleByHand(OSCILLATOR, { fingerprint: (w) => `${w.generation}`, budget: 50 });
  assert.equal(never.ending, 'generation-limit');
});

test('a false match is rejected whatever the keyframes: none, every generation, or thinned', () => {
  for (const options of [{ keyframeBytes: 0 }, { keyframeEvery: 1 }, { keyframeEvery: 2, keyframeBytes: 200 }]) {
    const found = settleByHand(OSCILLATOR, { fingerprint: () => 'same', ...options });
    assert.deepEqual([found.ending, found.from, found.period], ['repeat', 4, 5], JSON.stringify(options));
    const run = settle(OSCILLATOR, { budget: 10_000, ...options });
    assert.deepEqual(run.cycle, { from: 4, period: 5 }, JSON.stringify(options));
  }
});

test('the settler keeps every generation that had a fingerprint, and forgets those past the window', () => {
  const { settler } = settleByHand(OSCILLATOR, { fingerprint: () => 'same' });
  assert.deepEqual(settler.seen.get('same'), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  // A window of 3: at generation g, only g − 3 to g − 1 can match
  const world = new World({ rules: OSCILLATOR.rules, chunkSize: 8, fingerprint: true });
  world.setCells(OSCILLATOR.seed);
  const short = new Settler(world, { world: { rules: OSCILLATOR.rules, chunkSize: 8 }, window: 3, fingerprint: () => 'same' });
  for (let g = 1; g <= 20; g++) {
    step(world);
    assert.equal(short.check(world), null, 'a period of 5 is past a window of 3');
    assert.deepEqual(short.seen.get('same'), [g - 2, g - 1, g].filter((h) => h >= 0));
  }
});

test('keyframes: kept on multiples of K, thinned under their budget, forgotten once no rebuild needs them', () => {
  const world = new World({ rules: OSCILLATOR.rules, chunkSize: 8 });
  world.setCells(OSCILLATOR.seed);
  const keyframes = new Keyframes({ start: { generation: 0, cells: world.cells() }, every: 2 });
  for (let g = 1; g <= 12; g++) {
    step(world);
    keyframes.keep(world);
  }
  assert.deepEqual(keyframes.list().generations, [2, 4, 6, 8, 10, 12]);
  assert.equal(keyframes.nearest(7), 6);
  assert.equal(keyframes.nearest(1), 0, 'the start');
  // Any generation rebuilds from the nearest one
  for (const target of [0, 3, 9, 12]) {
    const rebuilt = keyframes.restore({ rules: OSCILLATOR.rules, chunkSize: 16 }, target);
    while (rebuilt.generation < target) step(rebuilt);
    const straight = new World({ rules: OSCILLATOR.rules, chunkSize: 8 });
    straight.setCells(OSCILLATOR.seed);
    while (straight.generation < target) step(straight);
    assert.ok(sameCells(rebuilt, straight), `generation ${target}`);
  }
  keyframes.forget(7);
  assert.deepEqual(keyframes.list().generations, [6, 8, 10, 12], 'the nearest at or before 7 stays');
  // A budget smaller than two keyframes thins them as K doubles
  const bytes = keyframes.get(6).byteLength;
  const thin = new Keyframes({ start: { generation: 0, cells: new Int32Array(0) }, every: 1, budget: bytes * 2 });
  for (const g of [1, 2, 3, 4]) {
    world.generation = g;
    thin.keep(world);
  }
  assert.ok(thin.list().bytes <= bytes * 2);
  assert.ok(thin.list().generations.every((g) => g % thin.list().every === 0));
});

test('a settling run started from a later generation still settles where the oracle says', () => {
  // From generation 2 of STILL, the still life still forms at generation 4
  const world = new World({ rules: STILL.rules, chunkSize: 8 });
  world.setCells(STILL.seed);
  step(world);
  step(world);
  const messages = [];
  const queue = [];
  const run = new Run({ post: (m) => messages.push(m), now: () => 0, yieldThen: (fn) => queue.push(fn), wait: (ms, fn) => queue.push(fn) });
  run.receive({ type: 'start', world: { rules: STILL.rules, chunkSize: 8 }, seed: Int32Array.from(cellsOf(world).flat()), from: 2, run: { kind: 'open', settle: true } });
  while (queue.length) queue.shift()();
  const end = messages.find((m) => m.type === 'state' && m.state === 'ended');
  assert.deepEqual([end.reason, end.cycle], ['repeat', { from: 4, period: 1 }]);
});

test('a settling run needs a fingerprinting world, unless it is given a fingerprint', () => {
  const world = new World({ rules: STILL.rules });
  world.setCells(STILL.seed);
  assert.throws(() => new Settler(world, { world: { rules: STILL.rules } }), /fingerprint/);
  assert.doesNotThrow(() => new Settler(world, { world: { rules: STILL.rules }, fingerprint: () => 'x' }));
});

test('under B1, a pattern from anywhere in the seed box reaches the arena\'s edge by generation 37', () => {
  const rules = [{ birth: [1], survival: [] }, { birth: [1, 5, 11], survival: [2, 3, 26] }];
  const seeds = [[[-5, -5, -5]], [[4, 4, 4]], [[-1, 0, -1]], [[-5, 4, -5], [4, -5, 4]]];
  for (const [i, seed] of seeds.entries()) {
    const world = new World({ rules: rules[i % 2], chunkSize: 16, arena: DISCOVERY_ARENA });
    world.setCells(seed);
    let reason = null;
    while (!reason && world.generation <= 37) reason = step(world);
    assert.equal(reason, 'arena-edge', JSON.stringify(seed));
    assert.ok(world.generation <= 37, `${JSON.stringify(seed)}: generation ${world.generation}`);
  }
});
