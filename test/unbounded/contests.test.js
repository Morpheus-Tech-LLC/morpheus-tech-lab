// SPDX-License-Identifier: Apache-2.0
//
// The contests as data (#40, #41): Speed's and Methuselah's definitions, a result's score,
// checking a result against its contest, by replay and by table lookup, and the scripts that do it
// in Node.

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
  resultOf, resultText, readResult, hashWorld, stateHash, worldOptions, tableText, readTable, ResultError,
} from '../../src/unbounded/canonical.js';
import {
  CONTESTS, SEED_BOX, DISCOVERY_ARENA, contestById, runFor, checkContest, speedScore, compareSpeed,
  methuselahScore, compareMethuselah, methuselahWarnings,
} from '../../src/unbounded/contests.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { Run } from '../../src/unbounded/run.js';
import { presetById } from '../../src/explore/presets.js';
import { SEED_BOX as EXPLORE_SEED_BOX } from '../../src/explore/seed.js';
import { GROWING, DIES, STILL, OSCILLATOR, SHIP } from './helpers.js';

const SPEED = contestById('speed-1');
const METHUSELAH = contestById('methuselah-1');
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
/** Generations a test Speed result reaches: enough to grow, few enough to replay at once. */
const GENS = 6;

/** Speed's run for `generations`, its world, and the hash of every generation, for a table. */
async function speedRun(generations = GENS) {
  const run = runFor(SPEED);
  const world = new World(worldOptions(run, { chunkSize: SPEED.chunkSize }));
  world.setCells(run.seed);
  const hashes = [await hashWorld(world, run)];
  while (world.generation < generations) {
    assert.equal(step(world), null);
    hashes.push(await hashWorld(world, run));
  }
  return { run, world, hashes };
}

/** A Speed result that the 6 seconds ended at generation GENS, as its file's text. */
async function speedFile() {
  const { run, world } = await speedRun();
  const result = await resultOf(world, {
    run, ending: 'deadline', score: speedScore(SPEED, world.generation, 6000.4),
    details: { elapsedMs: 6000.4, browser: { name: 'Firefox', version: '155.0' } },
  });
  return resultText(result);
}

const edit = (text, fn) => {
  const data = JSON.parse(text);
  fn(data);
  return JSON.stringify(data);
};

let fileCache;
const goodFile = async () => (fileCache ??= await speedFile());

test("Speed's definition is #44's pinned values", () => {
  assert.deepEqual(CONTESTS.map((c) => c.id), ['speed-1', 'methuselah-1', 'classic-methuselah-1']);
  assert.equal(SPEED.kind, 'speed');
  assert.equal(SPEED.title, 'Speed');
  assert.equal(SPEED.chunkSize, 16);
  assert.equal(SPEED.seconds, 6);
  assert.equal(SPEED.ceiling, 1000);
  const run = runFor(SPEED);
  assert.equal(run.contest, 'speed-1');
  assert.deepEqual(run.rules, { birth: [9, 10], survival: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] });
  assert.equal(run.seed.length, 1000);
  assert.deepEqual(run.seed[0], [-5, -5, -5]);
  assert.deepEqual(run.seed[999], [4, 4, 4]);
  assert.equal(run.arena, null);
  assert.deepEqual(run.limits, { cells: null, extent: null, generations: 1000 });
  assert.ok(Object.isFrozen(SPEED) && Object.isFrozen(SPEED.fixes.seed[0]));
});

test("Speed's run is Explore's Cube10, in the seed box Explore shares", () => {
  assert.equal(EXPLORE_SEED_BOX, SEED_BOX);
  assert.deepEqual([...SEED_BOX.min], [-5, -5, -5]);
  assert.deepEqual([...SEED_BOX.max], [4, 4, 4]);
  const cube10 = presetById('cube10');
  const run = runFor(SPEED);
  assert.deepEqual(run.rules, cube10.rules);
  const cells = [];
  for (let i = 0; i < cube10.cells.length; i += 3) cells.push([cube10.cells[i], cube10.cells[i + 1], cube10.cells[i + 2]]);
  assert.deepEqual(runFor({ ...SPEED, id: 'x', fixes: { ...SPEED.fixes, seed: cells } }).seed, run.seed);
  // Speed fixes everything, so an entry changes nothing
  assert.deepEqual(runFor(SPEED, { rules: GROWING, seed: [[0, 0, 0]] }), run);
});

test("Speed's score: generations, and the time only at the ceiling; ranked by both", () => {
  assert.deepEqual(speedScore(SPEED, 412, 6003.7), { generations: 412, ms: null });
  assert.deepEqual(speedScore(SPEED, 1000, 4210.4), { generations: 1000, ms: 4210 });
  assert.deepEqual(speedScore(SPEED, 1000, 0.2), { generations: 1000, ms: 1 });
  const ranked = [
    { generations: 412, ms: null }, { generations: 1000, ms: 5000 }, { generations: 999, ms: null },
    { generations: 1000, ms: 4210 },
  ].sort(compareSpeed);
  assert.deepEqual(ranked.map((s) => [s.generations, s.ms]), [[1000, 4210], [1000, 5000], [999, null], [412, null]]);
});

test('a Speed result verifies by replay, and by table lookup', async () => {
  const text = await goodFile();
  const result = readResult(text);
  assert.deepEqual(result.score, { generations: GENS, ms: null });
  assert.equal(checkContest(result), null);

  const replay = await verifyResult(text);
  assert.equal(replay.verdict, 'verified', replay.message);

  const { run, hashes } = await speedRun();
  const table = readTable(tableText(run, hashes));
  const lookup = await verifyResult(text, { table });
  assert.equal(lookup.verdict, 'verified', lookup.message);
  assert.equal(lookup.ending, 'table');
});

test('a Speed result that reached the ceiling scores its time', () => {
  const result = {
    run: runFor(SPEED), generation: 1000, ending: 'generation-limit', score: { generations: 1000, ms: 4210 },
  };
  assert.equal(checkContest(result), null);
  for (const ms of [null, 0, 6001]) {
    const wrong = checkContest({ ...result, score: { generations: 1000, ms } });
    assert.equal(wrong?.verdict, 'mismatch', `ms ${ms}`);
  }
  assert.match(checkContest({ ...result, ending: 'deadline' }).message, /can't end a run at the ceiling/);
});

test("a file whose run isn't its contest's fails, naming the field, before any replay or lookup", async () => {
  const text = await goodFile();
  const { run, hashes } = await speedRun();
  const table = readTable(tableText(run, hashes));
  const cases = [
    ['rules', (d) => { d.run.rules.birth = [9]; }],
    ['seed', (d) => { d.run.seed.pop(); }],
    ['arena', (d) => { d.run.arena = { min: [-32, -32, -32], max: [31, 31, 31] }; }],
    ['limits.generations', (d) => { d.run.limits.generations = 2000; }],
    ['limits.cells', (d) => { d.run.limits.cells = 1_000_000; }],
  ];
  for (const [field, fn] of cases) {
    for (const options of [{}, { table }]) {
      const verdict = await verifyResult(edit(text, fn), options);
      assert.equal(verdict.verdict, 'mismatch', field);
      assert.match(verdict.message, new RegExp(`isn't speed-1's: its ${field.replace('.', '\\.')} differs`), verdict.message);
    }
  }
});

test("a score that doesn't follow from the generation and ending fails, saying which", async () => {
  const text = await goodFile();
  const cases = [
    [(d) => { d.ending = 'stopped'; }, /ended with stopped has no score/],
    [(d) => { d.ending = 'memory-limit'; }, /ended with memory-limit has no score/],
    [(d) => { delete d.score; }, /needs its score/],
    [(d) => { d.score.generations = GENS + 1; }, /says 7 generations, but the file is generation 6/],
    [(d) => { d.score.ms = 6000; }, /below the ceiling has no time/],
    [(d) => { d.score.rank = 1; }, /\{generations, ms\}, and nothing else/],
    [(d) => { d.score = { generations: GENS }; }, /\{generations, ms\}, and nothing else/],
  ];
  for (const [fn, message] of cases) {
    const verdict = await verifyResult(edit(text, fn));
    assert.equal(verdict.verdict, 'mismatch', String(message));
    assert.match(verdict.message, message);
  }
});

test("a contest this lab doesn't know isn't checked; a score without a contest fails", async () => {
  const text = await goodFile();
  const future = await verifyResult(edit(text, (d) => { d.run.contest = 'speed-2'; }));
  assert.equal(future.verdict, 'not-checked');
  assert.match(future.message, /doesn't know the contest speed-2/);

  const noContest = await verifyResult(edit(text, (d) => { d.run.contest = null; }));
  assert.equal(noContest.verdict, 'mismatch');
  assert.match(noContest.message, /score but no contest/);
});

test("changing the browser in a file doesn't change its verdict", async () => {
  const text = await goodFile();
  for (const browser of [null, { name: 'Netscape', version: '4.0' }]) {
    const verdict = await verifyResult(edit(text, (d) => { d.details.browser = browser; }));
    assert.equal(verdict.verdict, 'verified', verdict.message);
  }
});

test("a score's shape is checked when a file is read", async () => {
  const text = await goodFile();
  const bad = [
    [(d) => { d.score = 412; }, /score must be an object/],
    [(d) => { d.score = [412]; }, /score must be an object/],
    [(d) => { d.score.generations = -1; }, /score\.generations must be null or a whole number/],
    [(d) => { d.score.generations = 1.5; }, /score\.generations must be null or a whole number/],
    [(d) => { d.score.ms = '6000'; }, /score\.ms must be null or a whole number/],
    [(d) => { d.score['__proto__x'] = 1; }, /name that isn't a word/],
    [(d) => { for (let i = 0; i < 9; i++) d.score[`f${i}`] = i; }, /more than 8 fields/],
  ];
  for (const [fn, message] of bad) {
    assert.throws(() => readResult(edit(text, fn)), (err) => err instanceof ResultError && message.test(err.message), String(message));
  }
  // The score isn't part of the hash: the same state with any well-formed score still hashes the same
  assert.equal(readResult(edit(text, (d) => { d.score.generations = 99; })).hash, readResult(text).hash);
});

test('scripts: reference-hashes.mjs --contest makes the table verify.mjs looks Speed up in', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'contests-'));
  try {
    const node = (args) => spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
    const tablePath = join(dir, 'speed.table');
    const made = node(['scripts/reference-hashes.mjs', '--contest', 'speed-1', '--to', String(GENS), '--out', tablePath]);
    assert.equal(made.status, 0, made.stderr);
    const { run, hashes } = await speedRun();
    assert.equal(readFileSync(tablePath, 'utf8'), tableText(run, hashes));

    const resultPath = join(dir, 'speed-1-6.json');
    writeFileSync(resultPath, await goodFile());
    const checked = node(['scripts/verify.mjs', resultPath, '--table', tablePath]);
    assert.equal(checked.status, 0, checked.stdout + checked.stderr);
    assert.match(checked.stdout, /^verified: Generation 6 matches the table\./);
    assert.match(checked.stdout, /contest speed-1/);
    assert.match(checked.stdout, /score: generations 6, ms none \(the time is self-reported\)/);

    // Several files at once, as for the Hall of Fame: each checked, and the worst decides
    const secondPath = join(dir, 'speed-1-6-again.json');
    writeFileSync(secondPath, await goodFile());
    const both = node(['scripts/verify.mjs', resultPath, secondPath, '--table', tablePath]);
    assert.equal(both.status, 0, both.stdout + both.stderr);
    assert.equal(both.stdout.match(/^verified: /gm).length, 2);
    assert.match(both.stdout, /^2 files: 2 verified$/m);

    writeFileSync(resultPath, edit(await goodFile(), (d) => { d.score.generations = 7; }));
    assert.equal(node(['scripts/verify.mjs', resultPath, '--table', tablePath]).status, 1);
    const mixed = node(['scripts/verify.mjs', secondPath, join(dir, 'missing.json'), resultPath, '--table', tablePath]);
    assert.equal(mixed.status, 1, 'a mismatch outranks a refusal');
    assert.match(mixed.stdout, /^3 files: 1 mismatch, 1 refused, 1 verified$/m);
    assert.match(mixed.stdout, /^refused: can't read .*missing\.json\.$/m);

    const unknown = node(['scripts/reference-hashes.mjs', '--contest', 'nope-1', '--to', '1', '--out', tablePath]);
    assert.equal(unknown.status, 2);
    assert.match(unknown.stderr, /There is no contest nope-1/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ---- Methuselah (#41) ----

/**
 * A Methuselah entry run as the page will run it: a settling Run with the contest's budget, in
 * its arena, at a chunk size. Returns how it ended, and its result file's text if it scored.
 */
async function methuselahRun(pattern, { chunkSize = METHUSELAH.chunkSize } = {}) {
  const run = runFor(METHUSELAH, { rules: pattern.rules, seed: pattern.seed });
  const messages = [];
  const queue = [];
  const host = new Run({ post: (m) => messages.push(m), now: () => 0, yieldThen: (fn) => queue.push(fn), wait: (ms, fn) => queue.push(fn) });
  host.receive({
    type: 'start', world: { ...worldOptions(run, { chunkSize }), slabBytes: 1 << 20 }, seed: Int32Array.from(run.seed.flat()),
    run: { kind: 'open', settle: true }, generations: run.limits.generations,
  });
  while (queue.length) queue.shift()();
  const end = messages.find((m) => m.type === 'state' && m.state === 'ended');
  const score = methuselahScore(METHUSELAH, { ending: end.reason, generation: end.stats.generation, period: end.cycle?.period });
  const text = score && resultText(await resultOf(host.world, {
    run, ending: end.reason, score, details: { browser: { name: 'Firefox', version: '155.0' } },
  }));
  return { ending: end.reason, generation: end.stats.generation, score, text, run };
}

const methuselahFiles = new Map();
async function methuselahFile(pattern) {
  if (!methuselahFiles.has(pattern)) methuselahFiles.set(pattern, (await methuselahRun(pattern)).text);
  return methuselahFiles.get(pattern);
}

test("Methuselah's definition is #44's pinned values", () => {
  assert.equal(METHUSELAH.kind, 'methuselah');
  assert.equal(METHUSELAH.title, 'Methuselah');
  assert.equal(METHUSELAH.chunkSize, 16);
  assert.equal(METHUSELAH.budget, 10_000);
  const run = runFor(METHUSELAH, { rules: GROWING, seed: [[0, 0, 0]] });
  assert.equal(run.contest, 'methuselah-1');
  assert.deepEqual(run.arena, { min: [-32, -32, -32], max: [31, 31, 31] });
  assert.deepEqual(run.limits, { cells: null, extent: null, generations: 10_000 });
  assert.equal(METHUSELAH.fixes.seedBox, SEED_BOX);
  assert.ok(Object.isFrozen(METHUSELAH) && Object.isFrozen(METHUSELAH.fixes.arena.min));
  // 27 free cells between the seed box and the arena's wall on every side
  for (let a = 0; a < 3; a++) {
    assert.equal(SEED_BOX.min[a] - DISCOVERY_ARENA.min[a], 27);
    assert.equal(DISCOVERY_ARENA.max[a] - SEED_BOX.max[a], 27);
  }
});

test("runFor() takes an entry's rules and seed: a fully live 10³ seed is accepted, never shifted", () => {
  const full = [];
  for (let z = -5; z <= 4; z++) for (let y = -5; y <= 4; y++) for (let x = -5; x <= 4; x++) full.push([x, y, z]);
  const run = runFor(METHUSELAH, { rules: GROWING, seed: [...full].reverse() });
  assert.equal(run.seed.length, 1000);
  assert.deepEqual(run.seed, full, 'sorted, and in place');
  assert.deepEqual(runFor(METHUSELAH, STILL).seed, [...STILL.seed].sort((a, b) => a[2] - b[2] || a[1] - b[1] || a[0] - b[0]));
});

test('runFor() refuses a B0 rule, an empty seed, or any cell outside the seed box', () => {
  const refused = [
    [{ rules: { birth: [0, 5], survival: [] }, seed: [[0, 0, 0]] }, /B0/],
    [{ rules: GROWING, seed: [] }, /seed is empty/],
    [{ rules: GROWING, seed: [[0, 0, 0], [5, 0, 0]] }, /\[5, 0, 0\] is outside the seed box, cells -5 to 4/],
    [{ rules: GROWING, seed: [[-6, 0, 0]] }, /\[-6, 0, 0\] is outside the seed box/],
    [{ rules: GROWING, seed: [[0, 4, -6]] }, /\[0, 4, -6\] is outside the seed box/],
    [{ rules: GROWING, seed: [[40, 0, 0]] }, /outside the arena/],
    [{ seed: [[0, 0, 0]] }, /needs its rules/],
    [{ rules: GROWING }, /needs its seed/],
  ];
  for (const [entry, message] of refused) {
    assert.throws(() => runFor(METHUSELAH, entry), (err) => err instanceof ResultError && message.test(err.message), String(message));
  }
});

test("Methuselah's score: h and its period, once the cycle closes within the budget; the top is 9,999", () => {
  const score = (ending, generation, period) => methuselahScore(METHUSELAH, { ending, generation, period });
  assert.deepEqual(score('died', 10), { generations: 10, period: 1 });
  assert.deepEqual(score('died', 9999), { generations: 9999, period: 1 });
  assert.equal(score('died', 10_000), null, 'a death at 10,000 would close at 10,001');
  assert.deepEqual(score('repeat', 4, 5), { generations: 4, period: 5 });
  assert.deepEqual(score('repeat', 9999, 1), { generations: 9999, period: 1 });
  assert.deepEqual(score('repeat', 0, 10_000), { generations: 0, period: 10_000 }, 'found at 10,000 itself');
  assert.equal(score('repeat', 9999, 2), null);
  for (const ending of ['arena-edge', 'generation-limit', 'stopped', 'memory-limit']) assert.equal(score(ending, 50, 1), null, ending);
});

test('Methuselah ranks more generations first, then fewer seed cells', () => {
  const at = (name, generations, seedCells) => ({ name, score: { generations, period: 1 }, seedCells });
  const ranked = [at('short', 40, 3), at('lean', 900, 7), at('long', 1200, 400), at('heavy', 900, 30)].sort(compareMethuselah);
  assert.deepEqual(ranked.map((e) => e.name), ['long', 'lean', 'heavy', 'short']);
});

test('B1 rules get a warning, and nothing else does', () => {
  assert.equal(methuselahWarnings({ birth: [1], survival: [] }).length, 1);
  assert.match(methuselahWarnings({ birth: [1, 5], survival: [2] })[0], /B1.*reaches the edge of the arena, by generation 37, and can't score/);
  assert.deepEqual(methuselahWarnings({ birth: [5, 7, 8], survival: [1, 4] }), []);
  assert.deepEqual(methuselahWarnings({ birth: [2], survival: [1] }), []);
});

test('each ending of a Methuselah run scores as the definition says, at every chunk size', async () => {
  for (const pattern of [DIES, STILL, OSCILLATOR]) {
    const files = [];
    for (const chunkSize of [8, 16, 32]) {
      const { ending, score, text } = await methuselahRun(pattern, { chunkSize });
      assert.equal(ending, pattern === DIES ? 'died' : 'repeat');
      assert.deepEqual(score, { generations: pattern.from, period: pattern.period ?? 1 });
      files.push(readResult(text));
    }
    // The same file, whatever the chunk size: the hash, the generation, the ending and the score
    const same = files.map((r) => JSON.stringify([r.hash, r.generation, r.ending, r.score]));
    assert.equal(new Set(same).size, 1, same.join('\n'));
  }
  // A moving object reaches the edge, and doesn't score
  const ship = await methuselahRun(SHIP);
  assert.deepEqual([ship.ending, ship.score], ['arena-edge', null]);
});

test('a Methuselah file verifies by replay, at every chunk size, with a forced false match too', async () => {
  for (const pattern of [DIES, STILL, OSCILLATOR]) {
    const text = await methuselahFile(pattern);
    assert.deepEqual(readResult(text).score, { generations: pattern.from, period: pattern.period ?? 1 });
    assert.equal(checkContest(readResult(text)), null);
    for (const chunkSize of [8, 16, 32]) {
      const answer = await verifyResult(text, { chunkSize });
      assert.equal(answer.verdict, 'verified', answer.message);
      assert.equal(answer.ending, 'confirmed');
      assert.match(answer.message, new RegExp(`^Generation ${pattern.from} matches the file's hash, and the run first settles there`));
    }
    const forced = await verifyResult(text, { fingerprint: () => 'same' });
    assert.equal(forced.verdict, 'verified', forced.message);
  }
});

test("checkContest(): a Methuselah score must follow from the file's generation and ending, within the budget", async () => {
  const text = await methuselahFile(STILL);
  const cases = [
    [(d) => { d.ending = 'arena-edge'; }, /ended with arena-edge has no score: only a run that dies or repeats, within 10,000 generations/],
    [(d) => { d.ending = 'generation-limit'; }, /ended with generation-limit has no score/],
    [(d) => { delete d.score; }, /needs its score/],
    [(d) => { d.score.generations = 5; }, /says 5 generations, but the file is generation 4/],
    [(d) => { d.score.period = 0; }, /period is a whole number of at least 1/],
    [(d) => { d.score.period = null; }, /period is a whole number of at least 1/],
    [(d) => { d.score.ms = 1; }, /\{generations, period\}, and nothing else/],
    [(d) => { d.ending = 'died'; d.score.period = 2; }, /A death is a cycle of period 1, not 2/],
    [(d) => { d.score.period = 9997; }, /closes at 10001, past the budget of 10,000 generations/],
    [(d) => { d.run.arena = null; }, /isn't methuselah-1's: its arena differs/],
    [(d) => { d.run.limits.generations = 20_000; }, /isn't methuselah-1's: its limits\.generations differs/],
    [(d) => { d.run.seed.push([4, 4, 5]); }, /can't run in methuselah-1: The seed's cell \[4, 4, 5\] is outside the seed box/],
    [(d) => { d.run.rules.birth = [0, 5]; }, /B0/],
  ];
  for (const [fn, message] of cases) {
    const answer = await verifyResult(edit(text, fn));
    assert.notEqual(answer.verdict, 'verified', String(message));
    assert.match(answer.message, message);
  }
  // At the budget's boundary, without a replay: a death at 9,999 holds, at 10,000 it doesn't
  const result = (generation, ending, period) => ({ run: runFor(METHUSELAH, STILL), generation, ending, score: { generations: generation, period } });
  assert.equal(checkContest(result(9999, 'died', 1)), null);
  assert.match(checkContest(result(10_000, 'died', 1)).message, /closes at 10001/);
  assert.equal(checkContest(result(9998, 'repeat', 2)), null);
  assert.equal(checkContest(result(0, 'repeat', 10_000)), null);
});

test("a Methuselah file whose ending, period or generation is wrong fails by replay, saying which", async () => {
  const still = await methuselahFile(STILL);
  const dies = await methuselahFile(DIES);
  const { run } = readResult(still);
  /** The file claiming a different generation, with the hash of the run's real cells there. */
  const claiming = async (generation) => {
    const world = new World(worldOptions(run));
    world.setCells(run.seed);
    while (world.generation < generation) step(world);
    const hash = await stateHash(run, generation, world.cells());
    return edit(still, (d) => { d.generation = generation; d.score.generations = generation; d.hash = hash; });
  };
  const cases = [
    // A later h than the true first repeat: the still life also equals itself at 7
    [await claiming(7), /says the run settled at generation 7 \(repeat\), but the run first settles at generation 4, a cycle of period 1/],
    [await claiming(3), /says the run settled at generation 3 \(repeat\), but the run first settles at generation 4/],
    [edit(still, (d) => { d.score.period = 2; }), /The score says period 2, but the run first settles at generation 4, a cycle of period 1/],
    [edit(still, (d) => { d.ending = 'died'; }), /says the run settled at generation 4 \(died\), but the run first settles at generation 4, a cycle of period 1/],
    [edit(dies, (d) => { d.ending = 'repeat'; }), /says the run settled at generation 10 \(repeat\), but the run dies at generation 10/],
    [edit(still, (d) => { d.hash = `sha256:${'0'.repeat(64)}`; }), /settles at generation 4, as the file says, but the cells there don't match/],
  ];
  for (const [text, message] of cases) {
    const answer = await verifyResult(text);
    assert.equal(answer.verdict, 'mismatch', `${message}: ${answer.message}`);
    assert.match(answer.message, message);
  }
  // A pattern that reaches the edge can't claim to have settled
  const ship = await methuselahRun(SHIP);
  const world = new World(worldOptions(ship.run));
  world.setCells(ship.run.seed);
  while (world.generation < 30) step(world);
  const flown = resultText(await resultOf(world, { run: ship.run, ending: 'repeat', score: { generations: 30, period: 1 } }));
  const answer = await verifyResult(flown);
  assert.equal(answer.verdict, 'mismatch');
  assert.match(answer.message, /ends at generation \d+ \(arena-edge\) without settling/);
});

test('a table lookup leaves a Methuselah file not checked: it can only be replayed', async () => {
  const text = await methuselahFile(STILL);
  const result = readResult(text);
  const table = readTable(tableText(result.run, [result.hash, result.hash, result.hash, result.hash, result.hash]));
  const answer = await verifyResult(text, { table });
  assert.equal(answer.verdict, 'not-checked');
  assert.match(answer.message, /can't show where a run settles/);
  // The contest is still checked first
  assert.equal((await verifyResult(edit(text, (d) => { d.score.period = 0; }), { table })).verdict, 'mismatch');
});

test('scripts: verify.mjs replays a Methuselah file and prints its score', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'methuselah-'));
  try {
    const node = (args) => spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
    const stillPath = join(dir, 'methuselah-1-4.json');
    const diesPath = join(dir, 'methuselah-1-10.json');
    writeFileSync(stillPath, await methuselahFile(STILL));
    writeFileSync(diesPath, await methuselahFile(DIES));
    const both = node(['scripts/verify.mjs', stillPath, diesPath]);
    assert.equal(both.status, 0, both.stdout + both.stderr);
    assert.match(both.stdout, /contest methuselah-1, rules B5,7,8\/S0,1,7, seed of 13 cells, generation 4, ended with repeat/);
    assert.match(both.stdout, /^ {2}score: settled at generation 4 \(period 1\)$/m);
    assert.match(both.stdout, /^ {2}score: died at generation 10$/m);

    const result = readResult(await methuselahFile(STILL));
    const tablePath = join(dir, 'any.table');
    writeFileSync(tablePath, tableText(result.run, [result.hash]));
    const looked = node(['scripts/verify.mjs', stillPath, '--table', tablePath]);
    assert.equal(looked.status, 3, looked.stdout);

    writeFileSync(stillPath, edit(await methuselahFile(STILL), (d) => { d.score.period = 3; }));
    const wrong = node(['scripts/verify.mjs', stillPath]);
    assert.equal(wrong.status, 1);
    assert.match(wrong.stdout, /^mismatch: The score says period 3/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
