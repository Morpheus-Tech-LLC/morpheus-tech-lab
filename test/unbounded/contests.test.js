// SPDX-License-Identifier: Apache-2.0
//
// The contests as data (#40): Speed's definition, a result's score, checking a result against
// its contest, by replay and by table lookup, and the scripts that do it in Node.

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
  resultOf, resultText, readResult, hashWorld, worldOptions, tableText, readTable, ResultError,
} from '../../src/unbounded/canonical.js';
import {
  CONTESTS, SEED_BOX, contestById, runFor, checkContest, speedScore, compareSpeed,
} from '../../src/unbounded/contests.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { presetById } from '../../src/explore/presets.js';
import { SEED_BOX as EXPLORE_SEED_BOX } from '../../src/explore/seed.js';
import { GROWING } from './helpers.js';

const SPEED = contestById('speed-1');
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
  assert.deepEqual(CONTESTS.map((c) => c.id), ['speed-1']);
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

    writeFileSync(resultPath, edit(await goodFile(), (d) => { d.score.generations = 7; }));
    assert.equal(node(['scripts/verify.mjs', resultPath, '--table', tablePath]).status, 1);

    const unknown = node(['scripts/reference-hashes.mjs', '--contest', 'nope-1', '--to', '1', '--out', tablePath]);
    assert.equal(unknown.status, 2);
    assert.match(unknown.stderr, /There is no contest nope-1/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
