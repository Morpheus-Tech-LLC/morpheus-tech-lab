// SPDX-License-Identifier: Apache-2.0
//
// The unbounded engine against the lab's dense step, convolve3D(), with wrapping off, cell for
// cell, while the pattern stays 2 cells clear of the dense grid's walls.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareWithDense } from '../../src/unbounded/compareDense.js';
import { GROWING } from './helpers.js';

const CASES = [
  { name: "the lab's starting rules", options: { size: 30, generations: 30, seedSize: 8 } },
  { name: 'a rule that grows', options: { size: 40, generations: 40, seedSize: 6, rules: GROWING } },
  { name: 'a dense seed and a narrow rule', options: { size: 30, generations: 20, density: 0.6, rules: { birth: [6, 7], survival: [5, 6, 7] } } },
];

for (const { name, options } of CASES) {
  for (const randomSeed of [1, 2]) {
    test(`matches convolve3D() with ${name} (random seed ${randomSeed})`, async () => {
      const result = await compareWithDense({ ...options, randomSeed });
      assert.equal(result.mismatch, null, JSON.stringify(result.mismatch));
      assert.ok(result.liveCells.first > 0, 'the seed is empty');
    });
  }
}
