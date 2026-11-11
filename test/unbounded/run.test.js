// SPDX-License-Identifier: Apache-2.0
//
// The run loop (run.js), on a fake clock: each generation takes a fixed number of
// milliseconds, and scheduled work runs in time order, so every timing below is exact.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { Run, STATS_INTERVAL_MS } from '../../src/unbounded/run.js';
import { GROWING, randomSeed, cellsOf, difference } from './helpers.js';

const SEED = randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 });
const WORLD = { rules: GROWING, chunkSize: 8, slabBytes: 1 << 20 };

/** The cells after `generations` generations, run straight through with no Run around them. */
function straight(generations) {
  const world = new World(WORLD);
  world.setCells(SEED);
  for (let g = 0; g < generations; g++) assert.equal(step(world), null);
  return cellsOf(world);
}

/**
 * A Run on a fake clock. Each step costs `msPerStep`; `until(ms)` runs scheduled work in time
 * order up to that time. Every message the run posts is kept, stamped with the time.
 */
function fakeRun({ msPerStep = 10, stepper = step } = {}) {
  let time = 0;
  let order = 0;
  const queue = [];
  const messages = [];
  const schedule = (at, fn) => queue.push({ at, order: order++, fn });
  const run = new Run({
    post: (message, transfer) => messages.push({ ...message, at: time, transfer }),
    now: () => time,
    yieldThen: (fn) => schedule(time, fn),
    wait: (ms, fn) => schedule(time + ms, fn),
    step: (world, options) => {
      time += msPerStep;
      return stepper(world, options);
    },
  });
  const until = (limit = Infinity) => {
    while (queue.length) {
      queue.sort((a, b) => a.at - b.at || a.order - b.order);
      if (queue[0].at > limit) break;
      const { at, fn } = queue.shift();
      time = Math.max(time, at);
      fn();
    }
    if (limit !== Infinity) time = Math.max(time, limit);
  };
  const start = ({ world = WORLD, run: kind, generations } = {}) => {
    const message = { type: 'start', world, seed: Int32Array.from(SEED.flat()), run: kind };
    if (generations !== undefined) message.generations = generations;
    run.receive(message);
  };
  const of = (type) => messages.filter((m) => m.type === type);
  const ended = () => of('state').find((m) => m.state === 'ended');
  return { run, messages, until, start, of, ended, get time() { return time; } };
}

const sameAs = (world, generations) => assert.equal(difference(cellsOf(world), straight(generations)), null);

for (const msPerStep of [10, 7, 1000]) {
  test(`a timed run counts only the generations completed before the deadline (${msPerStep} ms each)`, () => {
    const f = fakeRun({ msPerStep });
    f.start({ run: { kind: 'timed', seconds: 1 } });
    f.until();
    const end = f.ended();
    assert.equal(end.reason, 'deadline');
    // Generations finish at msPerStep, 2·msPerStep, ...; one finishing at or after 1000 is dropped
    const expected = Math.ceil(1000 / msPerStep) - 1;
    assert.equal(end.stats.generation, expected);
    assert.equal(f.run.world.generation, expected);
    sameAs(f.run.world, expected);
    // The dropped generation returned the chunks it borrowed
    assert.equal(f.run.world.chunkCount, new Set(cellsOf(f.run.world).map(([x, y, z]) => `${x >> 3},${y >> 3},${z >> 3}`)).size);
  });
}

test('a timed run ends at its generation budget, if that comes first', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'timed', seconds: 6 }, generations: 25 });
  f.until();
  assert.equal(f.ended().reason, 'generation-limit');
  sameAs(f.run.world, 25);
});

test('a budget of 0 generations ends the run without a step', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'open' }, generations: 0 });
  f.until();
  assert.equal(f.ended().reason, 'generation-limit');
  assert.equal(f.run.world.generation, 0);
});

test('stopping by hand keeps the last complete generation', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'open' } });
  f.until(205);
  f.run.receive({ type: 'stop' });
  f.until();
  const end = f.ended();
  assert.equal(end.reason, 'stopped');
  assert.ok(end.stats.generation > 0);
  sameAs(f.run.world, end.stats.generation);
  // Nothing runs after the end
  f.until(10_000);
  assert.equal(f.run.world.generation, end.stats.generation);
});

test('a timed run can be stopped by hand', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'timed', seconds: 6 } });
  f.until(300);
  f.run.receive({ type: 'stop' });
  assert.equal(f.ended().reason, 'stopped');
  sameAs(f.run.world, f.run.world.generation);
});

test('hitting a limit ends the run and keeps the last complete generation', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'open' }, world: { ...WORLD, limits: { cells: 1000 } } });
  f.until();
  const end = f.ended();
  assert.equal(end.reason, 'cell-limit');
  assert.ok(end.stats.live <= 1000);
  sameAs(f.run.world, end.stats.generation);
});

test('failing to allocate ends the run and keeps the last complete generation', () => {
  let slabs = 0;
  const allocate = (bytes) => {
    if (++slabs > 30) throw new RangeError('Array buffer allocation failed');
    return new ArrayBuffer(bytes);
  };
  const f = fakeRun();
  f.start({ run: { kind: 'timed', seconds: 60 }, world: { ...WORLD, slabBytes: 2 * 8 ** 3, allocate } });
  f.until();
  const end = f.ended();
  assert.equal(end.reason, 'out-of-memory');
  assert.equal(end.stats.memoryBytes, 30 * 2 * 8 ** 3);
  sameAs(f.run.world, end.stats.generation);
});

test('a fault in the engine is reported and ends the run, keeping the last complete generation', () => {
  const stepper = (world, options) => {
    if (world.generation === 5) throw new TypeError('a bug');
    return step(world, options);
  };
  const f = fakeRun({ stepper });
  f.start({ run: { kind: 'open' } });
  f.until();
  assert.equal(f.of('error')[0].message, 'a bug');
  assert.equal(f.ended().reason, 'error');
  sameAs(f.run.world, 5);
});

test('an open-ended run pauses, steps and resumes, with the same cells as a straight run', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'open' } });
  f.until(100);
  f.run.receive({ type: 'pause' });
  const paused = f.run.world.generation;
  assert.ok(paused > 0);
  f.until(5000);
  assert.equal(f.run.world.generation, paused, 'nothing runs while paused');

  for (let i = 1; i <= 3; i++) {
    f.run.receive({ type: 'step' });
    assert.equal(f.run.world.generation, paused + i);
    assert.equal(f.messages.at(-1).state, 'paused');
    assert.equal(f.messages.at(-1).stats.generation, paused + i);
  }
  f.run.receive({ type: 'resume' });
  f.until(5300);
  f.run.receive({ type: 'pause' });
  f.until(9000);
  const generation = f.run.world.generation;
  assert.ok(generation > paused + 3);
  sameAs(f.run.world, generation);

  // Paused time isn't running time: about 100 + 300 ms ran, plus the three steps
  const stats = f.messages.at(-1).stats;
  assert.equal(stats.elapsedMs, 10 * generation);
  assert.deepEqual(f.of('state').map((m) => m.state), ['running', 'paused', 'paused', 'paused', 'paused', 'running', 'paused']);
});

test('a run can start paused', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'open', paused: true } });
  f.until(1000);
  assert.equal(f.run.world.generation, 0);
  assert.equal(f.of('state')[0].state, 'paused');
  f.run.receive({ type: 'step' });
  sameAs(f.run.world, 1);
});

test('a rate cap holds an open-ended run to that many generations a second', () => {
  const f = fakeRun({ msPerStep: 1 });
  f.start({ run: { kind: 'open', rate: 20 } });
  f.until(1000);
  assert.ok(Math.abs(f.run.world.generation - 20) <= 1, `${f.run.world.generation} generations`);

  // Lifting the cap takes effect at once, not after the wait the cap had set
  f.run.receive({ type: 'rate', rate: null });
  const before = f.run.world.generation;
  f.until(1020);
  assert.ok(f.run.world.generation - before >= 15, `${f.run.world.generation - before} generations`);
});

test('statistics arrive at most four times a second', () => {
  const f = fakeRun({ msPerStep: 25 });
  f.start({ run: { kind: 'open' } });
  f.until(3000);
  f.run.receive({ type: 'stop' });
  const withStats = f.messages.filter((m) => m.stats);
  for (let i = 1; i < withStats.length; i++) {
    if (withStats[i].type !== 'stats') continue; // replies to a command come when asked
    assert.ok(withStats[i].at - withStats[i - 1].at >= STATS_INTERVAL_MS, `stats at ${withStats[i - 1].at} and ${withStats[i].at}`);
  }
  const periodic = f.of('stats');
  assert.ok(periodic.length >= 10 && periodic.length <= 12, `${periodic.length} in 3 s`);

  // Each carries the issue's figures
  assert.ok(periodic.every((m) => m.stats.rate === 1000 / 25), 'generations per second');
  const last = f.ended().stats;
  assert.equal(last.generation, f.run.world.generation);
  assert.equal(last.live, f.run.world.liveCells);
  assert.ok(last.livePeak >= last.live);
  assert.ok(last.chunksPeak >= last.chunks && last.chunksCreated >= last.chunksPeak);
  assert.equal(last.memoryBytes, f.run.world.memoryBytes);
  assert.ok(last.extent.min.length === 3 && last.extent.max.length === 3);
});

test('snapshots are made only when asked for, and transfer their cells', () => {
  let made = 0;
  const cells = World.prototype.cells;
  World.prototype.cells = function counted() {
    made++;
    return cells.call(this);
  };
  try {
    const f = fakeRun();
    f.start({ run: { kind: 'open' } });
    f.until(2000);
    assert.equal(made, 0);
    assert.equal(f.of('snapshot').length, 0);

    f.run.receive({ type: 'snapshot', id: 7 });
    assert.equal(made, 1);
    const [snapshot] = f.of('snapshot');
    assert.equal(snapshot.id, 7);
    assert.equal(snapshot.generation, f.run.world.generation);
    assert.ok(snapshot.cells instanceof Int32Array);
    assert.deepEqual(snapshot.transfer, [snapshot.cells.buffer]);
    assert.equal(snapshot.cells.length, 3 * f.run.world.liveCells);
  } finally {
    World.prototype.cells = cells;
  }
});

test('commands a run won\'t act on are refused, and the run carries on', () => {
  const f = fakeRun();
  f.run.receive({ type: 'snapshot', id: 1 });
  assert.equal(f.of('error')[0].id, 1, 'nothing to snapshot before the start');

  f.start({ run: { kind: 'timed', seconds: 1 } });
  for (const type of ['pause', 'step', 'resume']) f.run.receive({ type });
  f.run.receive({ type: 'rate', rate: 5 });
  assert.equal(f.of('error').length, 5);
  assert.match(f.of('error')[1].message, /timed run can't pause/);
  f.until();
  assert.equal(f.ended().reason, 'deadline');
});

test('a bad start is refused without starting', () => {
  const f = fakeRun();
  f.start({ run: { kind: 'open' }, world: { rules: { birth: [0, 4], survival: [4] } } });
  assert.match(f.of('error')[0].message, /B0/);
  assert.equal(f.of('state').length, 0);
  f.start({ run: { kind: 'sideways' } });
  f.start({ run: { kind: 'timed' } });
  assert.equal(f.of('error').length, 3);

  // ... and a refused start leaves the Run free to start properly
  f.start({ run: { kind: 'open' }, generations: 3 });
  f.until();
  assert.equal(f.ended().reason, 'generation-limit');
  f.start({ run: { kind: 'open' } });
  assert.match(f.of('error').at(-1).message, /already started/);
});
