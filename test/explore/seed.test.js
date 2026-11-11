// SPDX-License-Identifier: Apache-2.0
//
// Explore's seeds and rules (src/explore/seed.js): the shapes lifted into the unbounded world,
// rules read from text, and the seed file's round trip.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shapeSeed, parseCounts, parseRules, toSeedFile, parseSeedFile, arenaBox,
  SeedError, MAX_SHAPE_SIZE, SEED_FILE_FORMAT,
} from '../../src/explore/seed.js';
import { RuleError } from '../../src/unbounded/rules.js';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import * as shapes from '../../src/shapeGenerators.js';
import { cellsOf } from '../unbounded/helpers.js';

const RULES = { birth: [9, 10], survival: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] };

function bounds(cells) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < cells.length; i++) {
    min[i % 3] = Math.min(min[i % 3], cells[i]);
    max[i % 3] = Math.max(max[i % 3], cells[i]);
  }
  return { min, max };
}

test('a solid cube seed is centred on the origin', () => {
  const cells = shapeSeed(shapes.cubeShape(5, 1), 10);
  assert.equal(cells.length / 3, 1000);
  assert.deepEqual(bounds(cells), { min: [-5, -5, -5], max: [4, 4, 4] });
});

test('a cube seed is as many cells wide as its size, odd sizes too', () => {
  for (const side of [1, 2, 3, 4, 5, 10]) {
    const cells = shapeSeed(shapes.cubeOfSide(side, 1), side);
    assert.equal(cells.length / 3, side ** 3, `side ${side}`);
    const lo = 0 - Math.floor(side / 2); // 0 - 0 is 0, where -0 would fail a strict comparison
    assert.deepEqual(bounds(cells), { min: [lo, lo, lo], max: [lo + side - 1, lo + side - 1, lo + side - 1] }, `side ${side}`);
  }
});

test('an octahedron seed is whole and centred', () => {
  const radius = 3;
  const cells = shapeSeed(shapes.octahedronShape(radius, 1), radius);
  // Cells with |x| + |y| + |z| <= r: (2r + 1)(2r² + 2r + 3) / 3
  assert.equal(cells.length / 3, ((2 * radius + 1) * (2 * radius * radius + 2 * radius + 3)) / 3);
  assert.deepEqual(bounds(cells), { min: [-3, -3, -3], max: [3, 3, 3] });
});

test('every shape fits its scratch grid, at the largest size too', () => {
  const size = MAX_SHAPE_SIZE;
  const cases = {
    cube: [shapes.cubeShape(size / 2, 1), 0],
    tetrahedron: [shapes.tetrahedronShape(size, 1), 0],
    octahedron: [shapes.octahedronShape(size, 0.01), 0],
    perlin: [shapes.perlinShape(size, 0.3, 40), 40],
    worley: [shapes.worleyShape(8, 0.3, 40), 40],
  };
  for (const [name, [fn, region]] of Object.entries(cases)) {
    const cells = shapeSeed(fn, size, region);
    assert.ok(cells.length > 0, `${name} has cells`);
    const { min, max } = bounds(cells);
    for (let a = 0; a < 3; a++) {
      assert.ok(min[a] >= -size - 1 && max[a] <= size + 1, `${name} stays within its size`);
    }
  }
});

test('a seed size outside 1 to the maximum is refused', () => {
  assert.throws(() => shapeSeed(shapes.cubeShape(1, 1), 0), SeedError);
  assert.throws(() => shapeSeed(shapes.cubeShape(1, 1), MAX_SHAPE_SIZE + 1), SeedError);
});

test('neighbour counts are read as lists and ranges', () => {
  assert.deepEqual(parseCounts('9,10', 'birth'), [9, 10]);
  assert.deepEqual(parseCounts(' 5 - 7 , 1, 6', 'survival'), [1, 5, 6, 7]);
  assert.deepEqual(parseCounts('15-13', 'survival'), [13, 14, 15]);
  assert.deepEqual(parseCounts('', 'survival'), []);
});

test('counts that make no sense are refused, saying why', () => {
  assert.throws(() => parseCounts('9;10', 'birth'), /can't include "9;10"/);
  assert.throws(() => parseCounts('27', 'birth'), /up to 26/);
  assert.throws(() => parseCounts('5-30', 'survival'), /30 is too many/);
});

test('a rule needs a birth count, and B0 is refused', () => {
  assert.deepEqual(parseRules('9,10', '5-15'), RULES);
  assert.throws(() => parseRules('', '5-15'), SeedError);
  assert.throws(() => parseRules('0,9', '5-15'), RuleError);
});

test('an arena is centred on the origin', () => {
  assert.deepEqual(arenaBox(64), { min: [-32, -32, -32], max: [31, 31, 31] });
  assert.deepEqual(arenaBox(9), { min: [-4, -4, -4], max: [4, 4, 4] });
  assert.equal(arenaBox(null), null);
});

test('an exported seed loads back, and runs the same', () => {
  const cells = shapeSeed(shapes.perlinShape(10, 0.3, 25), 10, 25);
  const text = toSeedFile({ rules: RULES, cells });
  const loaded = parseSeedFile(text);
  assert.deepEqual(loaded.rules, RULES);
  assert.deepEqual([...loaded.cells], [...cells]);

  const run = (seed) => {
    const world = new World({ rules: RULES });
    const triples = [];
    for (let i = 0; i < seed.length; i += 3) triples.push([seed[i], seed[i + 1], seed[i + 2]]);
    world.setCells(triples);
    for (let g = 0; g < 20; g++) assert.equal(step(world), null);
    return cellsOf(world);
  };
  assert.deepEqual(run(loaded.cells), run(cells));
});

test('a seed file that is wrong is refused, saying why', () => {
  const file = (fields) => JSON.stringify({ format: SEED_FILE_FORMAT, version: 1, rules: RULES, cells: [[0, 0, 0]], ...fields });
  assert.throws(() => parseSeedFile('not json'), /isn't JSON/);
  assert.throws(() => parseSeedFile(file({ format: 'something else' })), /isn't an Explore seed file/);
  assert.throws(() => parseSeedFile(file({ version: 2 })), /version 2/);
  assert.throws(() => parseSeedFile(file({ rules: { birth: [0], survival: [] } })), RuleError);
  assert.throws(() => parseSeedFile(file({ cells: [[0, 0]] })), /Cell 1/);
  assert.throws(() => parseSeedFile(file({ cells: [[0, 0, 1.5]] })), /Cell 1/);
  assert.throws(() => parseSeedFile(file({ cells: [[0, 0, 2 ** 20]] })), /Cell 1/);
  assert.throws(() => parseSeedFile(file({ cells: [[1, 2, 3], [1, 2, 3]] })), /listed twice/);
  assert.equal(parseSeedFile(file({ cells: [] })).cells.length, 0);
});
