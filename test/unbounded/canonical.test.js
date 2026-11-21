// SPDX-License-Identifier: Apache-2.0
//
// The canonical state: its bytes, its hash, and reading a result file as untrusted data.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World, COORDINATE_LIMIT } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import {
  canonicalJson, canonicalBytes, encodeCells, sortCells, stateHash, hashWorld, normaliseRun,
  resultOf, resultText, readResult, tableText, readTable, ResultError, MAX_RESULT_BYTES, checkResultHashes,
} from '../../src/unbounded/canonical.js';
import { GROWING, randomSeed, repeatableRandom } from './helpers.js';

const L = COORDINATE_LIMIT;
const SEED = randomSeed({ min: [-3, -3, -3], size: [6, 6, 6], randomSeed: 1 });

const runOf = (overrides = {}) => normaliseRun({
  contest: null,
  rules: GROWING,
  seed: SEED,
  arena: null,
  limits: { cells: null, extent: null, generations: null },
  ...overrides,
});

function shuffled(cells, seed) {
  const random = repeatableRandom(seed);
  const out = cells.map((c) => [...c]);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function hashAfter(run, generations, { chunkSize = 16, seed = run.seed } = {}) {
  const world = new World({ rules: run.rules, chunkSize, slabBytes: 1 << 20 });
  world.setCells(seed);
  while (world.generation < generations) assert.equal(step(world), null);
  return hashWorld(world, run);
}

/** Reads the body back: the inverse of encodeCells(), written separately as a check. */
function decodeCells(bytes) {
  let at = 0;
  const read = () => {
    let v = 0;
    let scale = 1;
    for (;;) {
      const byte = bytes[at++];
      v += (byte & 127) * scale;
      if (byte < 128) return v;
      scale *= 128;
    }
  };
  const unzigzag = (v) => (v % 2 ? -(v + 1) / 2 : v / 2);
  const count = read();
  const cells = [];
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < count; i++) {
    z += unzigzag(read());
    y += unzigzag(read());
    x += unzigzag(read());
    cells.push([x, y, z]);
  }
  assert.equal(at, bytes.length, 'nothing left over');
  return cells;
}

const byZYX = (a, b) => a[2] - b[2] || a[1] - b[1] || a[0] - b[0];

test('canonical JSON sorts keys at every level, has no whitespace and takes only whole numbers', () => {
  assert.equal(canonicalJson({ b: [1, { d: null, c: 'x' }], a: true }), '{"a":true,"b":[1,{"c":"x","d":null}]}');
  assert.equal(canonicalJson(-0), '0');
  assert.throws(() => canonicalJson(1.5), ResultError);
  assert.throws(() => canonicalJson(Infinity), ResultError);
  assert.throws(() => canonicalJson(undefined), ResultError);
});

test('known answer: the bytes and hash of a fixed state never change', async () => {
  const run = runOf({ rules: { birth: [4], survival: [4] }, seed: [[0, 0, 0]] });
  // In no particular order; sorted by z, y, x they are (0,0,0) (1,0,0) (-1,2,0) (0,0,1)
  const cells = Int32Array.from([0, 0, 1, -1, 2, 0, 1, 0, 0, 0, 0, 0]);
  const bytes = canonicalBytes(run, 0, cells);
  const newline = bytes.indexOf(10);
  assert.equal(
    new TextDecoder().decode(bytes.subarray(0, newline)),
    '{"format":1,"generation":0,"run":{"arena":null,"contest":null,'
    + '"limits":{"cells":null,"extent":null,"generations":null},'
    + '"rules":{"birth":[4],"survival":[4]},"seed":[[0,0,0]]}}',
  );
  // 4 cells; then dz, dy, dx zigzagged: (0,0,0) (0,0,+1) (0,+2,-2) (+1,-2,+1)
  assert.deepEqual([...bytes.subarray(newline + 1)], [4, 0, 0, 0, 0, 0, 2, 0, 4, 3, 2, 3, 2]);
  assert.equal(
    await stateHash(run, 0, cells),
    'sha256:cd9683c2dd994f433bca45840d7a6a51bf0b16ccce1cad2f9ddb1281aa0308bc',
  );
});

test('varints take more bytes past 127, and the body reads back exactly', () => {
  // x = -200 zigzags to 399: 0b11_0001111, written low bits first
  assert.deepEqual([...encodeCells(Int32Array.from([-200, 0, 0]))], [1, 0, 0, 143, 3]);

  const corners = [];
  for (const x of [-L, L - 1]) for (const y of [-L, L - 1]) for (const z of [-L, L - 1]) corners.push([x, y, z]);
  const random = repeatableRandom(7);
  const cells = [...corners];
  for (let i = 0; i < 500; i++) {
    cells.push([0, 1, 2].map(() => Math.floor(random() * 2 * L) - L));
  }
  const unique = [...new Map(cells.map((c) => [c.join(), c])).values()];
  const decoded = decodeCells(encodeCells(sortCells(Int32Array.from(unique.flat()))));
  assert.deepEqual(decoded, [...unique].sort(byZYX));
});

test('cells sort by z, y, x, in a small box and across the whole space', () => {
  for (const spread of [20, 2 * L]) {
    const random = repeatableRandom(spread);
    const cells = new Map();
    while (cells.size < 2000) {
      const cell = [0, 1, 2].map(() => Math.floor(random() * spread) - Math.floor(spread / 2));
      cells.set(cell.join(), cell);
    }
    const list = [...cells.values()];
    const sorted = sortCells(Int32Array.from(list.flat()));
    const back = [];
    for (let i = 0; i < sorted.length; i += 3) back.push([sorted[i], sorted[i + 1], sorted[i + 2]]);
    assert.deepEqual(back, list.sort(byZYX), `spread ${spread}`);
  }
});

test('the same cells hash the same at chunk sizes 8, 16 and 32, whatever order the seed was added in', async () => {
  const run = runOf();
  const hashes = new Set();
  for (const chunkSize of [8, 16, 32]) {
    for (const order of [0, 1, 2]) {
      const seed = order ? shuffled(SEED, order) : SEED;
      hashes.add(await hashAfter(run, 60, { chunkSize, seed }));
    }
  }
  assert.equal(hashes.size, 1);
});

test('one cell, a rule, the arena, a limit or the generation changes the hash', async () => {
  const run = runOf();
  const world = new World({ rules: run.rules });
  world.setCells(run.seed);
  for (let g = 0; g < 20; g++) step(world);
  const cells = world.cells();
  const base = await stateHash(run, 20, cells);

  const moved = Int32Array.from(cells);
  moved[0] += 1000; // one cell, moved far from the rest
  const changes = [
    stateHash(run, 20, moved),
    stateHash(run, 20, cells.subarray(3)),
    stateHash(run, 21, cells),
    stateHash(runOf({ rules: { ...GROWING, birth: [5, 11] } }), 20, cells),
    stateHash(runOf({ arena: { min: [-50, -50, -50], max: [50, 50, 50] } }), 20, cells),
    stateHash(runOf({ limits: { cells: 100000, extent: null, generations: null } }), 20, cells),
    stateHash(runOf({ contest: 'other' }), 20, cells),
    stateHash(runOf({ seed: SEED.slice(1) }), 20, cells),
  ];
  for (const hash of await Promise.all(changes)) assert.notEqual(hash, base);
});

test("a run's definition is normalised: rules sorted, the seed sorted by z, y, x, duplicates dropped", () => {
  const run = normaliseRun({
    contest: 'speed-1',
    rules: { birth: [6, 5, 5], survival: [7, 4] },
    seed: [[1, 0, 1], [0, 0, 0], [1, 0, 1], [5, 0, 0]],
    arena: { min: [-8, -8, -8], max: [8, 8, 8] },
    limits: { cells: 10, extent: null, generations: 50 },
  });
  assert.deepEqual(run, {
    contest: 'speed-1',
    rules: { birth: [5, 6], survival: [4, 7] },
    seed: [[0, 0, 0], [5, 0, 0], [1, 0, 1]],
    arena: { min: [-8, -8, -8], max: [8, 8, 8] },
    limits: { cells: 10, extent: null, generations: 50 },
  });
});

test("a run that can't start is refused: B0, a seed outside the arena or past a limit", () => {
  const bad = [
    { rules: { birth: [0, 5], survival: [] } },
    { arena: { min: [0, 0, 0], max: [2, 2, 2] } },
    { limits: { cells: 3, extent: null, generations: null } },
    { limits: { cells: null, extent: 5, generations: null } },
    { contest: 'Has Spaces' },
    { seed: [[0, 0, L]] },
  ];
  for (const overrides of bad) assert.throws(() => runOf(overrides), ResultError, JSON.stringify(overrides));
});

async function exampleText() {
  const run = runOf({ limits: { cells: null, extent: null, generations: 30 } });
  const world = new World({ rules: run.rules });
  world.setCells(run.seed);
  while (world.generation < 30) step(world);
  return resultText(await resultOf(world, {
    run, ending: 'generation-limit',
    details: { elapsedMs: 12.5, browser: { name: 'Firefox', version: '145.0' }, stats: { live: world.liveCells, extent: world.extent(), rate: 2400.5 } },
  }));
}

test('a result reads back as it was written', async () => {
  const text = await exampleText();
  const result = readResult(text);
  assert.equal(result.generation, 30);
  assert.equal(result.details.browser.name, 'Firefox');
  assert.equal(resultText(result), text);
});

test('a result file that is too large or malformed is refused, saying why', async () => {
  const good = JSON.parse(await exampleText());
  const edit = (fn) => {
    const copy = structuredClone(good);
    fn(copy);
    return JSON.stringify(copy);
  };
  const cases = {
    'too large': ' '.repeat(MAX_RESULT_BYTES + 1),
    'not JSON': '{"format": ',
    'not an object': '[]',
    'missing field': edit((r) => delete r.hash),
    'unknown field': edit((r) => { r.extra = 1; }),
    'unknown nested field': edit((r) => { r.run.limits.memory = 1; }),
    'unknown details field': edit((r) => { r.details.browser.os = 'x'; }),
    'unknown stats field': edit((r) => { r.details.stats.secret = 1; }),
    '__proto__ field': JSON.stringify(good).replace('{', '{"__proto__":{"x":1},'),
    'wrong format': edit((r) => { r.format = 'something-else'; }),
    'newer version': edit((r) => { r.version = 2; }),
    'generation not whole': edit((r) => { r.generation = 1.5; }),
    'generation as text': edit((r) => { r.generation = '30'; }),
    'B0 rule': edit((r) => { r.run.rules.birth = [0]; }),
    'cell past the limit': edit((r) => { r.run.seed[0] = [L, 0, 0]; }),
    'cell not a triple': edit((r) => { r.run.seed[0] = [1, 2]; }),
    'error ending': edit((r) => { r.ending = 'error'; }),
    'unknown ending': edit((r) => { r.ending = 'bored'; }),
    'bad hash': edit((r) => { r.hash = 'sha256:XYZ'; }),
    'long browser name': edit((r) => { r.details.browser.name = 'x'.repeat(101); }),
    'negative time': edit((r) => { r.details.elapsedMs = -1; }),
  };
  for (const [name, text] of Object.entries(cases)) {
    assert.throws(() => readResult(text), (err) => err instanceof ResultError && err.message.length > 0, name);
  }
});

test('a reference table reads back, and a broken one is refused', () => {
  const run = runOf();
  const hashes = [`sha256:${'a'.repeat(64)}`, `sha256:${'b'.repeat(64)}`];
  const table = readTable(tableText(run, hashes));
  assert.deepEqual(table, { run, hashes });
  assert.throws(() => readTable('not json\n'), ResultError);
  assert.throws(() => readTable(`${tableText(run, hashes)}oops\n`), ResultError);
});

test('a result may carry its cells and its seed\'s hash, which must be what they claim', async () => {
  const run = runOf({ limits: { cells: null, extent: null, generations: 30 } });
  const world = new World({ rules: run.rules });
  world.setCells(run.seed);
  while (world.generation < 12) step(world);
  const text = resultText(await resultOf(world, { run, ending: 'stopped', withCells: true }));
  const result = readResult(text);
  assert.equal(result.cells.length, world.liveCells);
  assert.match(result.seedHash, /^sha256:[0-9a-f]{64}$/);
  assert.equal(await checkResultHashes(result), null);
  assert.equal(resultText(readResult(text)), text, 'it reads back as it was written');

  const good = JSON.parse(text);
  const edit = (fn) => {
    const copy = structuredClone(good);
    fn(copy);
    return JSON.stringify(copy);
  };
  const malformed = {
    'cells not a list': edit((r) => { r.cells = 5; }),
    'cell not a triple': edit((r) => { r.cells[0] = [1, 2]; }),
    'cells out of order': edit((r) => { r.cells.reverse(); }),
    'cell listed twice': edit((r) => { r.cells.splice(1, 0, r.cells[0]); }),
    'bad seed hash': edit((r) => { r.seedHash = 'sha256:XYZ'; }),
  };
  for (const [name, bad] of Object.entries(malformed)) {
    assert.throws(() => readResult(bad), (err) => err instanceof ResultError && err.message.length > 0, name);
  }
  const lying = readResult(edit((r) => { r.cells.pop(); }));
  assert.match(await checkResultHashes(lying), /cells aren't the ones/);
});
