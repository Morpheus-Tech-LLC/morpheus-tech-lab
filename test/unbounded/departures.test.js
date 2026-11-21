// SPDX-License-Identifier: Apache-2.0
//
// Ships leave at the edge (departures.js, #100): Classic Methuselah's rule. The ship test, the
// outward check and the islands on hand-made patterns; whole runs in classic-methuselah-1, at
// every chunk size, beside methuselah-1 on the same seeds; 'emits'; and the result file's
// departures, read, checked against the contest and verified by replay.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import {
  withDepartures, stepWithDepartures, shipTest, outward, departingIslands,
} from '../../src/unbounded/departures.js';
import { Settler } from '../../src/unbounded/settle.js';
import { Run } from '../../src/unbounded/run.js';
import {
  resultOf, resultText, readResult, worldOptions, tableText, readTable, ResultError,
} from '../../src/unbounded/canonical.js';
import {
  CONTESTS, contestById, runFor, checkContest, methuselahScore, departuresFor, DISCOVERY_ARENA,
} from '../../src/unbounded/contests.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { SHIP, SHIP_REST, WOBBLER, SLOW_SHIP, OSCILLATOR, STILL, cellsOf } from './helpers.js';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CLASSIC = contestById('classic-methuselah-1');
const METHUSELAH = contestById('methuselah-1');
const B1 = { rules: { birth: [1], survival: [] }, seed: [[0, 0, 0]] };
/** SHIP, which has left by generation 36, and an oscillator that settled long before. */
const SHIP_AND_REST = { rules: SHIP.rules, seed: [...SHIP.seed, ...SHIP_REST] };
/** Two SHIPs, side by side: they reach the edge, and leave, in the same generation. */
const TWO_SHIPS = { rules: SHIP.rules, seed: [...SHIP.seed, ...SHIP.seed.map(([x, y, z]) => [x, y - 5, z - 5])] };

/** A small world with an arena and a departure rule, seeded with `cells`. */
function arenaWorld(rules, cells, { arena, period = 32, chunkSize = 8 } = {}) {
  const world = new World({ rules, chunkSize, slabBytes: 1 << 20, arena, departures: { period } });
  world.setCells(cells);
  return world;
}

/** Steps a world through the departure rule until it ends, or reaches `generations`. */
function runOut(world, generations = 100) {
  let reason = null;
  while (!reason && world.generation < generations) reason = stepWithDepartures(world);
  return reason;
}

/**
 * An entry run as the page will run it: a settling Run with the contest's budget, in its arena,
 * with its departures, at a chunk size. Returns how it ended, its departures, and its result file.
 */
async function contestRun(pattern, { contest = CLASSIC, chunkSize = contest.chunkSize } = {}) {
  const run = runFor(contest, pattern);
  const messages = [];
  const queue = [];
  const host = new Run({ post: (m) => messages.push(m), now: () => 0, yieldThen: (fn) => queue.push(fn), wait: (ms, fn) => queue.push(fn) });
  host.receive({
    type: 'start', world: { ...worldOptions(run, { chunkSize }), departures: departuresFor(run), slabBytes: 1 << 20 },
    seed: Int32Array.from(run.seed.flat()), run: { kind: 'open', settle: true }, generations: run.limits.generations,
  });
  while (queue.length) queue.shift()();
  assert.deepEqual(messages.filter((m) => m.type === 'error'), []);
  const end = messages.find((m) => m.type === 'state' && m.state === 'ended');
  const score = methuselahScore(contest, { ending: end.reason, generation: end.stats.generation, period: end.cycle?.period });
  const result = await resultOf(host.world, { run, ending: end.reason, score: score ?? undefined });
  return { ending: end.reason, generation: end.stats.generation, score, departed: host.world.departed, text: resultText(result), run };
}

/** The file's text with its parsed JSON changed by fn. */
function edit(text, fn) {
  const data = JSON.parse(text);
  fn(data);
  return JSON.stringify(data);
}

/** A departure as the tests compare it: its generation, period, shift and size. */
const brief = (d) => [d.generation, d.period, d.shift, d.cells.length];

// ---- The rule's parts ----

test('the ship test finds the least period and its shift, under any rule, with no catalogue', () => {
  const ship = (rules, cells) => shipTest(new World({ rules, chunkSize: 8 }), cells, 32);
  const formed = new World({ rules: SHIP.rules, chunkSize: 8, slabBytes: 1 << 20 });
  formed.setCells(SHIP.seed);
  for (let g = 0; g < 24; g++) step(formed);
  assert.deepEqual(ship(SHIP.rules, cellsOf(formed)), { period: 1, shift: [1, 0, 0] });
  assert.deepEqual(ship(WOBBLER.rules, WOBBLER.cells), { period: 2, shift: [2, 0, 0] });
  assert.deepEqual(ship(SLOW_SHIP.rules, SLOW_SHIP.cells), { period: 6, shift: [6, 0, 0] });
  assert.equal(shipTest(new World({ rules: SLOW_SHIP.rules, chunkSize: 8 }), SLOW_SHIP.cells, 5), null);
  // Not ships: SHIP before it has formed, an oscillator, a still life, and a growth
  assert.equal(ship(SHIP.rules, SHIP.seed), null);
  assert.equal(ship(SHIP.rules, SHIP_REST), null);
  assert.equal(ship(OSCILLATOR.rules, OSCILLATOR.seed), null);
  assert.equal(ship(STILL.rules, STILL.seed), null);
  assert.equal(ship(B1.rules, B1.seed), null);
});

test('a ship is outward only if it moves out through every face its births cross', () => {
  assert.equal(outward([1, 0, 0], [[0, 1]]), true);
  assert.equal(outward([-1, 0, 0], [[0, -1]]), true);
  assert.equal(outward([1, 0, 0], [[0, -1]]), false);
  assert.equal(outward([2, 0, 0], [[2, -1]]), false); // sliding along a face
  assert.equal(outward([1, 1, 0], [[0, 1], [1, 1]]), true); // through a corner
  assert.equal(outward([1, 0, 0], [[0, 1], [1, 1]]), false); // past a corner, wobbling outward
});

test('departing islands: only those next to a birth outside the arena, each with its faces', () => {
  // Two SHIPs, about to leave together, and SHIP_REST, far from them and from any wall
  const rest = SHIP_REST.map(([x, y, z]) => [x, y + 12, z + 12]);
  const world = arenaWorld(SHIP.rules, [...TWO_SHIPS.seed, ...rest], { arena: DISCOVERY_ARENA });
  while (!step(world));
  assert.equal(world.generation, 35);
  world.stopReason = null;
  const islands = departingIslands(world);
  assert.deepEqual(islands.map((i) => [i.cells.length, i.faces]), [[8, [[0, 1]]], [8, [[0, 1]]]]);
  // In order of their first cells, z first; each sorted by z, y, x
  assert.ok(islands[0].cells[0][2] < islands[1].cells[0][2]);
  for (const { cells } of islands) {
    assert.deepEqual(cells, [...cells].sort((a, b) => a[2] - b[2] || a[1] - b[1] || a[0] - b[0]));
    assert.ok(cells.every(([x]) => x >= 28));
  }
});

test('without a departure rule, the step is step() itself', () => {
  for (const departures of [undefined, null]) {
    const world = new World({ rules: SHIP.rules, chunkSize: 8, arena: DISCOVERY_ARENA, departures });
    world.setCells(SHIP.seed);
    const twin = new World({ rules: SHIP.rules, chunkSize: 8, arena: DISCOVERY_ARENA });
    twin.setCells(SHIP.seed);
    let reason = null;
    while (!reason) {
      reason = stepWithDepartures(world);
      assert.equal(step(twin), reason);
    }
    assert.deepEqual([reason, world.generation, world.departed], ['arena-edge', 35, []]);
    assert.deepEqual(cellsOf(world), cellsOf(twin));
  }
  assert.throws(() => new World({ rules: SHIP.rules, departures: { period: 32 } }), /need one/);
  assert.throws(() => new World({ rules: SHIP.rules, arena: DISCOVERY_ARENA, departures: { period: 0 } }), /whole number of at least 1/);
});

test('a ship sliding along a face, or wobbling out of it, ends the run at the edge', () => {
  const arena = (zMin) => ({ min: [-4, -4, zMin], max: [20, 4, 4] });
  // The wobbler's next generation reaches z = -1: through the floor, while it moves along +x
  const sliding = arenaWorld(WOBBLER.rules, WOBBLER.cells, { arena: arena(0) });
  assert.equal(runOut(sliding), 'arena-edge');
  assert.deepEqual([sliding.generation, sliding.departed], [0, []]);
  assert.deepEqual(cellsOf(sliding), [...WOBBLER.cells].sort((a, b) => a[2] - b[2] || a[1] - b[1] || a[0] - b[0]));
  // With room to wobble, it flies to the +x wall and leaves there
  const room = arenaWorld(WOBBLER.rules, WOBBLER.cells, { arena: arena(-1) });
  assert.equal(runOut(room, 40), null);
  assert.deepEqual(room.departed.map(brief), [[17, 2, [2, 0, 0], 10]]);
  assert.equal(room.liveCells, 0);
});

test('a ship of a period over P ends the run at the edge; at P it leaves', () => {
  const arena = { min: [-4, -4, -4], max: [20, 4, 4] };
  const short = arenaWorld(SLOW_SHIP.rules, SLOW_SHIP.cells, { arena, period: 5 });
  assert.deepEqual([runOut(short), short.generation, short.departed], ['arena-edge', 16, []]);
  const enough = arenaWorld(SLOW_SHIP.rules, SLOW_SHIP.cells, { arena, period: 6 });
  assert.equal(runOut(enough, 40), null);
  assert.deepEqual(enough.departed.map(brief), [[16, 6, [6, 0, 0], 8]]);
});

test('a ship test that runs out of memory ends the run with the memory limit, generation t whole', () => {
  // The run's own world fits; a ship test's 1 MB slab doesn't
  const world = new World({ rules: SHIP.rules, chunkSize: 8, slabBytes: 64 * 1024, limits: { memory: 512 * 1024 }, arena: DISCOVERY_ARENA, departures: { period: 32 } });
  world.setCells(SHIP.seed);
  assert.equal(runOut(world), 'memory-limit');
  assert.equal(world.generation, 35);
  assert.equal(world.liveCells, 8);
  assert.deepEqual(world.departed, []);
});

test("a departure belongs to the step from t: generation t keeps the ship, and a rebuild meets it again", () => {
  const world = arenaWorld(SHIP.rules, SHIP.seed, { arena: DISCOVERY_ARENA });
  while (world.generation < 35) assert.equal(stepWithDepartures(world), null);
  const ship = cellsOf(world);
  assert.equal(ship.length, 8);
  assert.equal(stepWithDepartures(world), null);
  assert.deepEqual([world.generation, world.liveCells], [36, 0]);
  assert.deepEqual(world.departed.map(brief), [[35, 1, [1, 0, 0], 8]]);
  assert.deepEqual(world.departed[0].cells, ship);
  // The same generation, rebuilt from its cells, leaves the same way
  const rebuilt = arenaWorld(SHIP.rules, ship, { arena: DISCOVERY_ARENA, chunkSize: 32 });
  rebuilt.generation = 35;
  assert.equal(stepWithDepartures(rebuilt), null);
  assert.deepEqual(rebuilt.departed, world.departed);
  // A wrapped step that counts sees both tries: the edge, then the step without the ship
  let steps = 0;
  const counting = withDepartures((w, o) => { steps++; return step(w, o); });
  const again = arenaWorld(SHIP.rules, ship, { arena: DISCOVERY_ARENA });
  assert.equal(counting(again), null);
  assert.equal(steps, 2);
});

// ---- The contest ----

test("Classic Methuselah is Methuselah's definition with ships leaving at the edge, up to period 32", () => {
  assert.ok(CONTESTS.includes(CLASSIC));
  assert.equal(CLASSIC.kind, 'methuselah');
  assert.equal(CLASSIC.title, 'Classic Methuselah');
  assert.deepEqual(CLASSIC.departures, { period: 32 });
  assert.ok(Object.isFrozen(CLASSIC.departures));
  for (const key of ['fixes', 'chunkSize', 'budget', 'closes']) assert.deepEqual(CLASSIC[key], METHUSELAH[key], key);
  assert.equal(METHUSELAH.departures, undefined);
  const run = runFor(CLASSIC, SHIP);
  assert.equal(run.contest, 'classic-methuselah-1');
  assert.deepEqual(Object.keys(run).sort(), ['arena', 'contest', 'limits', 'rules', 'seed']);
  assert.deepEqual(departuresFor(run), { period: 32 });
  assert.equal(departuresFor(runFor(METHUSELAH, SHIP)), null);
  assert.equal(departuresFor({ contest: null }), null);
  assert.equal(departuresFor({ contest: 'classic-methuselah-9' }), null);
});

test('a run that sends off ships and then settles scores h, with its departures; Methuselah ends at the edge', async () => {
  const cases = [
    [SHIP, 'died', { generations: 36, period: 1 }, [[35, 1, [1, 0, 0], 8]]],
    [SHIP_AND_REST, 'repeat', { generations: 36, period: 2 }, [[35, 1, [1, 0, 0], 8]]],
    [TWO_SHIPS, 'died', { generations: 36, period: 1 }, [[35, 1, [1, 0, 0], 8], [35, 1, [1, 0, 0], 8]]],
  ];
  for (const [pattern, ending, score, departed] of cases) {
    const files = [];
    for (const chunkSize of [8, 16, 32]) {
      const run = await contestRun(pattern, { chunkSize });
      assert.deepEqual([run.ending, run.score, run.departed.map(brief)], [ending, score, departed]);
      files.push(readResult(run.text));
    }
    // The same file at every chunk size: hash, generation, ending, score and departures
    const same = files.map((r) => JSON.stringify([r.hash, r.generation, r.ending, r.score, r.departures]));
    assert.equal(new Set(same).size, 1, same.join('\n'));
    // Methuselah, on the same seed, ends when the first ship reaches the edge
    const strict = await contestRun(pattern, { contest: METHUSELAH });
    assert.deepEqual([strict.ending, strict.generation, strict.score, strict.departed], ['arena-edge', 35, null, []]);
    assert.equal(readResult(strict.text).departures, undefined);
  }
});

test("an island at the edge that isn't a ship (a B1 growth) ends the run at the edge, without a score", async () => {
  for (const contest of [CLASSIC, METHUSELAH]) {
    const run = await contestRun(B1, { contest });
    assert.deepEqual([run.ending, run.generation, run.score, run.departed], ['arena-edge', 31, null, []]);
  }
});

test('Methuselah scores as before on its own patterns', async () => {
  for (const [pattern, ending, score] of [[STILL, 'repeat', { generations: 4, period: 1 }], [OSCILLATOR, 'repeat', { generations: 4, period: 5 }]]) {
    for (const contest of [METHUSELAH, CLASSIC]) {
      const run = await contestRun(pattern, { contest });
      assert.deepEqual([run.ending, run.score, run.departed], [ending, score, []]);
    }
  }
});

test("a cycle with a departure in it ends as 'emits', from h, without a score; one before h doesn't", () => {
  // OSCILLATOR settles into a cycle of period 5 from generation 4, found at 9
  for (const [departedAt, ending] of [[3, 'repeat'], [4, 'emits'], [8, 'emits']]) {
    const options = { rules: OSCILLATOR.rules, chunkSize: 8, slabBytes: 1 << 20, arena: DISCOVERY_ARENA, departures: { period: 32 } };
    const world = new World({ ...options, fingerprint: true });
    world.setCells(OSCILLATOR.seed);
    const settler = new Settler(world, { world: options, budget: 10_000 });
    let found = null;
    while (!found) {
      if (world.generation === departedAt) world.departed.push({ generation: departedAt, period: 1, shift: [1, 0, 0], cells: [[40, 0, 0]] });
      assert.equal(stepWithDepartures(world), null);
      found = settler.check(world);
    }
    assert.deepEqual(found, { ending, from: 4, period: 5 }, `a departure at ${departedAt}`);
  }
  assert.equal(methuselahScore(CLASSIC, { ending: 'emits', generation: 4, period: 5 }), null);
});

// ---- The result file ----

test('a Classic Methuselah file lists its departures, and verifies by replay at every chunk size', async () => {
  for (const pattern of [SHIP, SHIP_AND_REST, TWO_SHIPS]) {
    const { text } = await contestRun(pattern);
    const result = readResult(text);
    assert.ok(Array.isArray(result.departures) && result.departures.length);
    assert.deepEqual(Object.keys(result.departures[0]), ['generation', 'period', 'shift', 'cells']);
    assert.equal(checkContest(result), null);
    for (const chunkSize of [8, 16, 32]) {
      const answer = await verifyResult(text, { chunkSize });
      assert.equal(answer.verdict, 'verified', answer.message);
      assert.equal(answer.ending, 'confirmed');
    }
    // The departures are outside the hash: editing them leaves it, and the replay catches it
    assert.equal(readResult(edit(text, (d) => { d.departures = []; })).hash, result.hash);
  }
  // A run where no ship left lists none
  const still = await contestRun(STILL);
  assert.deepEqual(readResult(still.text).departures, []);
  assert.equal((await verifyResult(still.text)).verdict, 'verified');
});

test('a file with a departure removed, added or changed fails by replay, saying which', async () => {
  const { text } = await contestRun(TWO_SHIPS);
  const extra = { generation: 36, period: 1, shift: [1, 0, 0], cells: [[31, 0, 0]] };
  const cases = [
    [(d) => { d.departures.pop(); }, /but the replay's departure 2, at generation 35, isn't in the file's list/],
    [(d) => { d.departures = []; }, /but the replay's departure 1, at generation 35, isn't in the file's list/],
    [(d) => { d.departures.push(extra); }, /but the file's departure 3, at generation 36, isn't in the replay: 2 ships left/],
    [(d) => { d.departures[1].period = 2; }, /but departure 2's period isn't the replay's \(generation 35\)/],
    [(d) => { d.departures[0].shift = [2, 0, 0]; }, /but departure 1's shift isn't the replay's/],
    [(d) => { d.departures[0].cells.pop(); }, /but departure 1's cells isn't the replay's/],
    [(d) => { d.departures[0].generation = 34; d.departures[1].generation = 34; }, /but departure 1's generation isn't the replay's/],
  ];
  for (const [fn, message] of cases) {
    const answer = await verifyResult(edit(text, fn));
    assert.equal(answer.verdict, 'mismatch', `${message}: ${answer.message}`);
    assert.match(answer.message, /^The run settles at generation 36, as the file says, but /);
    assert.match(answer.message, message);
  }
});

test('departures are checked against the contest, and their shape when a file is read', async () => {
  const { text } = await contestRun(SHIP);
  const methuselah = (await contestRun(STILL, { contest: METHUSELAH })).text;
  const contestCases = [
    [text, (d) => { delete d.departures; }, /A Classic Methuselah result lists its departures, even when no ship left/],
    [text, (d) => { d.departures[0].period = 33; }, /period 33, but Classic Methuselah recognises ships of period up to 32/],
    [text, (d) => { d.departures[0].generation = 10_000; }, /at generation 10000, past the budget/],
    [methuselah, (d) => { d.departures = []; }, /Ships don't leave the arena in methuselah-1, so its results list no departures/],
    [methuselah, (d) => { d.run.contest = null; delete d.score; d.departures = []; }, /lists departures, but has no contest where ships leave/],
  ];
  for (const [file, fn, message] of contestCases) {
    const answer = await verifyResult(edit(file, fn));
    assert.equal(answer.verdict, 'mismatch', String(message));
    assert.match(answer.message, message);
  }
  const shapeCases = [
    [(d) => { d.departures = {}; }, /departures must be a list/],
    [(d) => { d.departures[0].extra = 1; }, /departures\[0\] has an unknown field/],
    [(d) => { delete d.departures[0].shift; }, /departures\[0\] is missing "shift"/],
    [(d) => { d.departures[0].shift = [0, 0, 0]; }, /shift must move the ship/],
    [(d) => { d.departures[0].period = 0; }, /period must be a whole number of at least 1/],
    [(d) => { d.departures[0].generation = -1; }, /generation must be a whole number/],
    [(d) => { d.departures[0].cells = []; }, /cells must have a cell/],
    [(d) => { d.departures[0].cells.reverse(); }, /departures\[0\]\.cells\[1\] is out of order/],
    [(d) => { d.departures.push({ ...d.departures[0], generation: 3 }); }, /departures\[1\] is out of order/],
  ];
  for (const [fn, message] of shapeCases) {
    assert.throws(() => readResult(edit(text, fn)), (err) => err instanceof ResultError && message.test(err.message), String(message));
  }
});

test('scripts: verify.mjs prints the departures; reference-hashes.mjs steps through them', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'classic-'));
  try {
    const node = (args) => spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
    const two = join(dir, 'two.json');
    const one = join(dir, 'one.json');
    const { text } = await contestRun(TWO_SHIPS);
    writeFileSync(two, text);
    writeFileSync(one, (await contestRun(SHIP_AND_REST)).text);
    const both = node(['scripts/verify.mjs', two, one]);
    assert.equal(both.status, 0, both.stdout + both.stderr);
    assert.match(both.stdout, /contest classic-methuselah-1, rules B4\/S6, seed of 34 cells, generation 36, ended with died/);
    assert.match(both.stdout, /^ {2}departures: 2 ships left, at generations 35 and 35$/m);
    assert.match(both.stdout, /^ {2}score: settled at generation 36 \(period 2\)$/m);
    assert.match(both.stdout, /^ {2}departures: 1 ship left, at generation 35$/m);

    writeFileSync(two, edit(text, (d) => { d.departures.pop(); }));
    const wrong = node(['scripts/verify.mjs', two]);
    assert.equal(wrong.status, 1);
    assert.match(wrong.stdout, /^mismatch: .*departure 2, at generation 35, isn't in the file's list/);

    // The table of a run whose ship leaves carries on past the departure, to an empty world
    const table = join(dir, 'ship.table');
    const made = node(['scripts/reference-hashes.mjs', one, '--to', '40', '--out', table]);
    assert.equal(made.status, 0, made.stderr);
    assert.match(made.stdout, /^Wrote generations 0 to 40/);
    assert.equal(readTable(readFileSync(table, 'utf8')).hashes.length, 41);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
