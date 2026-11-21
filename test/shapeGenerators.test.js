// SPDX-License-Identifier: Apache-2.0
//
// The seed shapes Game of Life 3D (bounded)'s Seed popover applies (src/shapeGenerators.js's
// boundedShape()): a cube of size N is N×N×N cells, odd sizes too (#49), and the other shapes are
// the ones they were.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Grid3D } from '../src/grid3D.js';
import { boundedShape, cubeShape, tetrahedronShape, octahedronShape } from '../src/shapeGenerators.js';

const GRID = 20;

/** The live cells a shape sets in a fresh grid, as sorted "x,y,z" keys. */
function cellsOf(shape, size = GRID) {
  const grid = new Grid3D(size, 0);
  shape(grid, size);
  return grid.active.map(([x, y, z]) => `${x},${y},${z}`).sort();
}

/** The width of the cells along each axis. */
function widths(keys) {
  const cells = keys.map((k) => k.split(',').map(Number));
  return [0, 1, 2].map((a) => Math.max(...cells.map((c) => c[a])) - Math.min(...cells.map((c) => c[a])) + 1);
}

test('a cube of size N is N×N×N cells, odd sizes too (#49)', () => {
  for (const size of [1, 2, 3, 4, 5, 9, 10]) {
    const cells = cellsOf(boundedShape('cube', size, 1));
    assert.equal(cells.length, size ** 3, `size ${size}`);
    assert.deepEqual(widths(cells), [size, size, size], `size ${size}`);
  }
});

test('an even cube is the same cells as before', () => {
  for (const size of [2, 4, 10, 16]) {
    assert.deepEqual(cellsOf(boundedShape('cube', size, 1)), cellsOf(cubeShape(size / 2, 1)), `size ${size}`);
  }
});

test('the tetrahedron and octahedron are unchanged', () => {
  assert.deepEqual(cellsOf(boundedShape('tetrahedron', 7, 1)), cellsOf(tetrahedronShape(7, 1)));
  assert.deepEqual(cellsOf(boundedShape('octahedron', 5, 1)), cellsOf(octahedronShape(5, 1)));
});
