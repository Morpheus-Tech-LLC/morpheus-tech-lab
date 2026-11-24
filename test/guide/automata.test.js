// SPDX-License-Identifier: Apache-2.0
//
// The guide's automata (#159), checked against what the guide says about them and against
// published facts: what a visitor watches is the rule the words describe.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  seededRandom, ruleCases, elementaryStep, Life, parseRle, PATTERNS, torusLifeStep, hppStep, particles,
  EAST, WEST, NORTH, SOUTH, trafficStep, placeCars, Sandpile, hexNeighbours, scalesStep, LAB_RULE, CASES_3D,
} from '../../src/guide/automata.js';
import { STEPS } from '../../src/guide/steps.js';
import { DEFAULT_RULES } from '../../src/explore/setup.js';

const sorted = (cells) => cells.map(([x, y]) => `${x},${y}`).sort();
const shifted = (cells, dx, dy) => cells.map(([x, y]) => [x + dx, y + dy]);
const run = (life, generations) => {
  for (let i = 0; i < generations; i++) life.step();
  return life;
};

test('Rule 30 from one cell: its centre column starts 110111001100010 (OEIS A051023)', () => {
  let row = new Uint8Array(41);
  row[20] = 1;
  let column = '';
  for (let i = 0; i < 15; i++) {
    column += row[20];
    row = elementaryStep(row, 30);
  }
  assert.equal(column, '110111001100010');
});

test('the rule strip reads a rule’s number in binary, from 111 down to 000', () => {
  assert.equal(ruleCases(30).map((c) => c.next).join(''), '00011110');
  assert.equal(ruleCases(110).map((c) => c.next).join(''), '01101110');
  assert.deepEqual(ruleCases(30)[0], { left: 1, centre: 1, right: 1, next: 0 });
  assert.deepEqual(ruleCases(30)[7], { left: 0, centre: 0, right: 0, next: 0 });
});

test('Rule 110 from one cell grows to the left only, as its published picture does', () => {
  let row = new Uint8Array(30);
  row[25] = 1;
  for (let i = 0; i < 10; i++) row = elementaryStep(row, 110);
  assert.equal(row.slice(26).every((v) => v === 0), true);
  assert.ok(row.slice(0, 25).some((v) => v === 1));
});

test('Life: a block never changes, a blinker repeats every 2 generations', () => {
  const block = parseRle(PATTERNS.block);
  assert.deepEqual(sorted(run(new Life(block), 5).cells()), sorted(block));
  const blinker = parseRle(PATTERNS.blinker);
  const life = new Life(blinker);
  life.step();
  assert.notDeepEqual(sorted(life.cells()), sorted(blinker));
  life.step();
  assert.deepEqual(sorted(life.cells()), sorted(blinker));
});

test('Life: the glider moves one cell diagonally every 4 generations', () => {
  const glider = parseRle(PATTERNS.glider);
  assert.equal(glider.length, 5);
  assert.deepEqual(sorted(run(new Life(glider), 4).cells()), sorted(shifted(glider, 1, 1)));
});

test('Life: the R-pentomino settles at generation 1,103, as 116 cells', () => {
  const life = new Life(parseRle(PATTERNS.rPentomino));
  assert.equal(life.population, 5);
  run(life, 1102);
  assert.notEqual(life.population, 116);
  run(life, 1);
  assert.equal(life.population, 116);
  run(life, 400);
  assert.equal(life.population, 116, 'nothing changes in number after: still lifes, blinkers and gliders');
});

test('Life: Gosper’s gun repeats every 30 generations, firing a glider each time', () => {
  const gun = parseRle(PATTERNS.gosperGun);
  assert.equal(gun.length, 36);
  const life = new Life(gun);
  run(life, 30);
  assert.equal(life.population, 41);
  const inGun = life.cells().filter(([, y]) => y <= 8); // the gun's nine rows; the glider is below
  assert.deepEqual(sorted(inGun), sorted(gun), 'the gun is back as it was');
  run(life, 30);
  assert.equal(life.population, 46);
});

test('step 6’s counts: 2^18 = 262,144 rules on a flat grid, 2^54 (about 18 quadrillion) on a cubic one', () => {
  // Birth and survival are each any set of the possible counts: 0 to 8 neighbours, or 0 to 26
  const rules = (neighbours) => 2n ** BigInt(2 * (neighbours + 1));
  assert.equal(rules(8), 262144n);
  assert.equal(rules(26), 18014398509481984n);
  const words = STEPS.find((s) => s.id === 'three').body.join(' ');
  assert.ok(words.includes('262,144') && words.includes('about 18 quadrillion'));
  assert.ok(!/Life \d{4}/.test(words), 'no four-number rule names');
  assert.ok(words.includes('B3/S23') && words.includes('B9,10/S5–15'), 'Conway’s shorthand, then the lab’s rule in it');
});

test('step 6’s cases follow the lab’s default rule: each count, in every layer of the 26, decides as the words say', () => {
  assert.deepEqual(LAB_RULE.birth, [...DEFAULT_RULES.birth], 'the lab’s own default, B9,10/S5–15');
  assert.deepEqual(LAB_RULE.survival, [...DEFAULT_RULES.survival]);
  for (const c of CASES_3D) {
    const keys = c.live.map((p) => p.join());
    assert.equal(new Set(keys).size, keys.length, `${c.text}: each neighbour once`);
    assert.ok(c.live.every((p) => p.every((v) => v >= -1 && v <= 1) && p.some((v) => v !== 0)), `${c.text}: neighbours, not the cell`);
    assert.ok(c.live.some(([, y]) => y === 1) && c.live.some(([, y]) => y === -1), `${c.text}: some above and some below`);
    const count = c.live.length;
    assert.ok(c.text.startsWith(`${count} live neighbours`), `${c.text}: says its count`);
    const next = c.alive ? LAB_RULE.survival.includes(count) : LAB_RULE.birth.includes(count);
    assert.equal(next, /survives|is born/.test(c.text), `${c.text}: as the rule decides`);
  }
  const outcomes = CASES_3D.map((c) => c.text.split(': ')[1]);
  assert.deepEqual(outcomes, ['it survives', 'a cell is born', 'it dies of loneliness', 'it dies of overcrowding'], 'the four cases of step 3, in 3D');
  const lab = STEPS.find((s) => s.id === 'lab').body.join(' ');
  assert.ok(lab.startsWith('The lab opens on B9,10/S5–15.'), 'step 7 names the rule step 6 explains');
});

test('parseRle reads counts and row ends, and refuses anything else', () => {
  assert.deepEqual(parseRle('2o$b2o!'), [[0, 0], [1, 0], [1, 1], [2, 1]]);
  assert.deepEqual(parseRle('o2$o!'), [[0, 0], [0, 2]]);
  assert.throws(() => parseRle('ox!'), /Unexpected "x"/);
});

test('Life.clip drops cells outside a box, and Life.bounds finds the pattern', () => {
  const life = new Life([[0, 0], [5, 5], [20, 20]]);
  assert.deepEqual(life.bounds(), { minX: 0, minY: 0, maxX: 20, maxY: 20 });
  life.clip(0, 0, 10, 10);
  assert.deepEqual(sorted(life.cells()), sorted([[0, 0], [5, 5]]));
  assert.equal(new Life().bounds(), null);
});

test('Life on a torus wraps: a glider crossing the edge comes back the other side', () => {
  const W = 8, H = 8;
  let grid = new Uint8Array(W * H);
  for (const [x, y] of parseRle(PATTERNS.glider)) grid[y * W + x] = 1;
  const start = grid.slice();
  for (let i = 0; i < 4 * W; i++) grid = torusLifeStep(grid, W, H);
  assert.deepEqual(grid, start, 'after 32 generations it has gone once round');
});

test('the HPP gas conserves particles and momentum, and turns head-on pairs', () => {
  // A head-on pair, east and west in the middle of a 3 × 3 box, leaves north and south
  const pair = new Uint8Array(9);
  pair[4] = EAST | WEST;
  assert.deepEqual([...hppStep(pair, 3, 3)], [0, NORTH, 0, 0, 0, 0, 0, SOUTH, 0]);
  const W = 20, H = 12;
  const random = seededRandom(1);
  let cells = new Uint8Array(W * H);
  for (let i = 0; i < cells.length; i++) cells[i] = Math.floor(random() * 16);
  const count = (c) => c.reduce((s, v) => s + particles(v), 0);
  const total = count(cells);
  for (let i = 0; i < 200; i++) {
    cells = hppStep(cells, W, H);
    assert.equal(count(cells), total);
  }
  // In open space, momentum is conserved too: a lone pair crossing at right angles passes through
  const open = new Uint8Array(25);
  open[2 * 5 + 1] = EAST;
  open[1 * 5 + 2] = SOUTH;
  const next = hppStep(open, 5, 5);
  assert.equal(next[2 * 5 + 2], EAST | SOUTH);
  assert.equal(hppStep(next, 5, 5).reduce((s, v) => s + particles(v), 0), 2);
  // At a wall, a particle turns back
  assert.deepEqual([...hppStep(Uint8Array.of(0, EAST), 2, 1)], [0, WEST]);
});

test('traffic: cars keep their number and order, never pass or collide, and keep to the limit', () => {
  const L = 100;
  const random = seededRandom(9);
  let cars = placeCars(30, L, random);
  for (let t = 0; t < 300; t++) {
    cars = trafficStep(cars, L, { vmax: 5, p: 0.25, random });
    assert.equal(cars.length, 30);
    assert.equal(new Set(cars.map((c) => c.position)).size, 30, 'no two cars share a cell');
    assert.ok(cars.every((c) => c.speed >= 0 && c.speed <= 5));
  }
  // Jams appear on their own: at this density, some car is always stopped
  assert.ok(cars.some((c) => c.speed === 0));
});

test('traffic: an empty road lets a lone car reach the speed limit', () => {
  let cars = [{ position: 0, speed: 0 }];
  for (let t = 0; t < 10; t++) cars = trafficStep(cars, 50, { vmax: 5, p: 0, random: () => 1 });
  assert.equal(cars[0].speed, 5);
});

test('the sandpile: grains are kept or fall off the edge, and the order of drops doesn’t matter', () => {
  const a = new Sandpile(9, 9);
  for (let i = 0; i < 300; i++) a.drop(4, 4);
  assert.equal(a.total + a.lost, 300);
  assert.ok(a.grains.every((g) => g < 4));
  // Abelian: drop the same grains in another order, and the pile ends the same
  const drops = [[1, 1], [4, 4], [7, 2], [3, 6]];
  const b = new Sandpile(9, 9), c = new Sandpile(9, 9);
  for (let i = 0; i < 50; i++) for (const [x, y] of drops) b.drop(x, y);
  for (let i = 0; i < 50; i++) for (const [x, y] of [...drops].reverse()) c.drop(x, y);
  assert.deepEqual(b.grains, c.grains);
});

test('scales on a hexagonal grid: six neighbours inside, fewer at the edge, and only two colours', () => {
  assert.equal(hexNeighbours(3, 3, 8, 8).length, 6);
  assert.equal(hexNeighbours(0, 0, 8, 8).length, 2);
  const random = seededRandom(4);
  let scales = new Uint8Array(64).map(() => (random() < 0.5 ? 1 : 0));
  for (let i = 0; i < 20; i++) scales = scalesStep(scales, 8, 8, random);
  assert.ok(scales.every((s) => s === 0 || s === 1));
});

test('seededRandom repeats itself for a seed, and stays in [0, 1)', () => {
  const a = seededRandom(42), b = seededRandom(42);
  for (let i = 0; i < 100; i++) {
    const v = a();
    assert.equal(v, b());
    assert.ok(v >= 0 && v < 1);
  }
});
