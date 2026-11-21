// SPDX-License-Identifier: Apache-2.0
//
// The precomputed modes' memory estimate and advice (#123): the estimate against real runs, the
// suggested ranges against the estimate, and the runs the old caps allowed, which must not ask
// for confirmation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateRun, largestWithin, needsConfirmation, hintText, adviceFor, confirmText, outOfMemoryText,
  rule30Size, sandpileSize, seedEstimate, formatBytes, formatCount, isOutOfMemory,
  LAPTOP_BYTES, DESKTOP_BYTES, CONFIRM_BYTES, SEARCH_MAX, GB, MB,
} from '../src/memoryAdvice.js';
import { Grid3D } from '../src/grid3D.js';
import { convolve3D } from '../src/denseStep.js';
import { cubeShape } from '../src/shapeGenerators.js';
import { state } from '../src/state.js';

/** The dialog's default seed for Game of Life 3D (bounded): a 10³ cube, every cell alive. */
const CUBE = { shape: 'cube', size: 10, density: 1 };

/** Within `ratio` of `actual`, either way. */
function near(estimate, actual, ratio, what) {
  assert.ok(estimate >= actual / ratio && estimate <= actual * ratio,
    `${what}: estimated ${Math.round(estimate)}, measured ${actual}`);
}

test("Game of Life 3D (bounded)'s live cells: near a real run under the default rules", () => {
  // The dense step the lab runs on the CPU, from the dialog's default seed
  const size = 40;
  const generations = 60;
  let grid = new Grid3D(size, 0);
  cubeShape(5, 1)(grid, size);
  let total = grid.active.length;
  for (let g = 0; g < generations; g++) {
    grid = convolve3D(grid, { wrapping: true, rules: state.rules, boundaryRules: state.boundaryRules });
    total += grid.active.length;
  }
  near(estimateRun({ mode: 'gameOfLife', size, generations, seed: CUBE }).cells, total, 1.3, 'live cells');
});

test('the other modes: near generateSimulation() on the CPU, as measured for #123', () => {
  // generateSimulation() needs Vite (its shaders are ?raw imports), so these are its live cells,
  // summed over every generation, measured in Node with the GPU off
  const MEASURED = [
    { run: { mode: 'gameOfLife', size: 50, generations: 100, seed: CUBE }, cells: 1_217_136 },
    { run: { mode: 'rule30', size: 106, generations: 50 }, cells: 24_946 },
    { run: { mode: 'rule30', size: 211, generations: 100 }, cells: 183_477 },
    { run: { mode: 'rule30_2D', size: 109, generations: 50 }, cells: 430_160 },
    { run: { mode: 'rule30_2D', size: 216, generations: 100 }, cells: 5_043_861 },
    { run: { mode: 'rule30_2D', size: 324, generations: 150 }, cells: 21_831_353 },
    { run: { mode: 'sineWave', size: 60, generations: 50 }, cells: 183_600, exact: true },
    { run: { mode: 'sandpile', size: 50, generations: 300, initialSand: 0 }, cells: 102_000, frames: 676 },
    { run: { mode: 'sandpile', size: 50, generations: 1000, initialSand: 0 }, cells: 1_127_500, frames: 2251 },
    { run: { mode: 'sandpile', size: 40, generations: 200, initialSand: 255 }, cells: 160_209, frames: 452 },
  ];
  for (const { run, cells, frames, exact } of MEASURED) {
    const estimate = estimateRun(run);
    if (exact) assert.equal(estimate.cells, cells, run.mode);
    else near(estimate.cells, cells, 1.25, `${run.mode} ${run.size}/${run.generations}`);
    if (frames) near(estimate.frames, frames, 1.02, `${run.mode} frames`);
  }
});

test('the grids are size³ bytes per generation kept, whatever the mode', () => {
  assert.equal(estimateRun({ mode: 'gameOfLife', size: 50, generations: 100, seed: CUBE }).grids, 50 ** 3 * 101);
  assert.equal(estimateRun({ mode: 'rule30', size: 211, generations: 100 }).grids, 211 ** 3 * 101);
  assert.equal(estimateRun({ mode: 'sandpile', size: 50, generations: 1000 }).frames, 2251);
});

test("Rule 30's size follows its generations as the dialog always set it", () => {
  assert.equal(rule30Size(50, false), 106);
  assert.equal(rule30Size(100, false), 211);
  assert.equal(rule30Size(50, true), 109);
  assert.equal(rule30Size(100, true), 216);
  assert.equal(sandpileSize(1000), 80);
  assert.equal(sandpileSize(10), 20);
  assert.equal(sandpileSize(10_000), 250, 'no longer capped at 200');
});

test("the seed's box and cells, per shape", () => {
  assert.deepEqual(seedEstimate(CUBE, 50), { side: 10, cells: 1000 });
  assert.deepEqual(seedEstimate({ shape: 'cube', size: 10, density: 0.5 }, 50), { side: 10, cells: 500 });
  assert.deepEqual(seedEstimate({ shape: 'cube', size: 3, density: 1 }, 50), { side: 3, cells: 27 }, 'an odd size (#49)');
  assert.deepEqual(seedEstimate({ shape: 'cube', size: 1, density: 1 }, 50), { side: 1, cells: 1 });
  assert.equal(seedEstimate({ shape: 'tetrahedron', size: 13, density: 1 }, 50).cells, 455);
  assert.equal(seedEstimate({ shape: 'octahedron', size: 8, density: 1 }, 50).cells, 833);
  assert.deepEqual(seedEstimate({ shape: 'perlin', size: 10, density: 0.3, regionSize: 300 }, 50), { side: 50, cells: 0.3 * 50 ** 3 },
    'a region larger than the grid is the grid');
  assert.deepEqual(seedEstimate({ shape: 'cube', size: NaN, density: NaN }, 50), { side: 1, cells: 1 }, 'an empty field');
});

test('every default run within the old caps runs without asking', () => {
  const OLD_CAPS = [
    { mode: 'gameOfLife', size: 200, generations: 100, seed: CUBE },
    { mode: 'gameOfLife', size: 200, generations: 100, seed: { shape: 'octahedron', size: 8, density: 1 } },
    { mode: 'sineWave', size: 200, generations: 100 },
    { mode: 'rule30', size: rule30Size(100, false), generations: 100 },
    { mode: 'rule30_2D', size: rule30Size(100, true), generations: 100 },
    { mode: 'sandpile', size: 50, generations: 1000, initialSand: 0 },
    { mode: 'sandpile', size: sandpileSize(1000), generations: 1000, initialSand: 0 },
  ];
  for (const run of OLD_CAPS) {
    assert.equal(needsConfirmation(run), false, `${run.mode} ${run.size}/${run.generations}: ${formatBytes(estimateRun(run).total)}`);
  }
});

test('a run past the threshold asks first', () => {
  assert.ok(needsConfirmation({ mode: 'gameOfLife', size: 400, generations: 100, seed: CUBE }));
  assert.ok(needsConfirmation({ mode: 'rule30_2D', size: rule30Size(150, true), generations: 150 }));
  assert.ok(needsConfirmation({ mode: 'sandpile', size: sandpileSize(10_000), generations: 10_000 }));
  assert.ok(estimateRun({ mode: 'gameOfLife', size: 400, generations: 100, seed: CUBE }).total > CONFIRM_BYTES);
});

test('the suggested ranges are the largest values within each budget', () => {
  const runs = [
    { run: { mode: 'gameOfLife', size: 50, generations: 100, seed: CUBE }, field: 'size' },
    { run: { mode: 'gameOfLife', size: 50, generations: 100, seed: CUBE }, field: 'generations' },
    { run: { mode: 'rule30_2D', size: 216, generations: 100 }, field: 'generations' },
    { run: { mode: 'sandpile', size: 50, generations: 1000 }, field: 'generations' },
    { run: { mode: 'sineWave', size: 50, generations: 100 }, field: 'size' },
  ];
  for (const { run, field } of runs) {
    for (const budget of [LAPTOP_BYTES, DESKTOP_BYTES]) {
      const n = largestWithin(run, field, budget);
      assert.ok(n >= 1, `${run.mode} ${field}`);
      const at = (value) => {
        const next = { ...run, [field]: value };
        if (field === 'generations' && run.mode.startsWith('rule30')) next.size = rule30Size(value, run.mode === 'rule30_2D');
        return estimateRun(next).total;
      };
      assert.ok(at(n) <= budget && at(n + 1) > budget, `${run.mode} ${field}: ${n}`);
    }
    assert.ok(largestWithin(run, field, DESKTOP_BYTES) > largestWithin(run, field, LAPTOP_BYTES));
  }
  // The old size cap is about what a typical laptop runs at 100 generations
  const laptopSize = largestWithin({ mode: 'gameOfLife', size: 50, generations: 100, seed: CUBE }, 'size', LAPTOP_BYTES);
  assert.ok(laptopSize > 200 && laptopSize < 260, `${laptopSize}`);
});

test('a range that nothing fits, or that runs past the search', () => {
  const huge = { mode: 'gameOfLife', size: 2000, generations: 100, seed: CUBE };
  assert.equal(largestWithin(huge, 'generations', LAPTOP_BYTES), 0);
  assert.equal(hintText(huge, 'generations'), 'advice');
  assert.match(adviceFor(huge, 'generations').suggestions[0].text, /lower the size first/);
  const tiny = { mode: 'sineWave', size: 1, generations: 1 };
  assert.equal(largestWithin(tiny, 'generations', 1e15), SEARCH_MAX.generations);
});

test('what the hint and its popover say', () => {
  const run = { mode: 'gameOfLife', size: 50, generations: 100, seed: CUBE };
  assert.match(hintText(run, 'size'), /^1 - \d+$/);
  const advice = adviceFor(run, 'size');
  assert.match(advice.estimate, /^About \d+ MB for this run, by estimate\.$/);
  assert.match(advice.parts, /^Grids: 50³ × 101 = 12 MB\. Live cells: about 1\.2 million/);
  assert.ok(advice.cellsNote, 'Game of Life says its live cells are a guess');
  assert.equal(adviceFor({ mode: 'sineWave', size: 50, generations: 100 }, 'size').cellsNote, null);
  assert.deepEqual(advice.suggestions.map((s) => s.label), ['Typical laptop (1.5 GB)', 'Strong desktop (4.0 GB)']);
  assert.match(advice.suggestions[0].text, /^up to \d+ at 100 generations$/);
  assert.match(adviceFor(run, 'generations').suggestions[0].text, /^up to [\d,]+ generations at size 50$/);
  assert.match(adviceFor({ mode: 'rule30', size: 211, generations: 100 }, 'generations').suggestions[0].text, /\(the size follows\)$/);
  assert.match(advice.past, /Above 2\.0 GB, Apply asks first\.$/);
  assert.match(confirmText({ mode: 'gameOfLife', size: 400, generations: 100, seed: CUBE }), /^This run, a 400³ grid over 100 generations, needs about [\d.]+ GB by estimate/);
  assert.match(outOfMemoryText({ mode: 'gameOfLife', size: 400, generations: 1000 }), /^The browser refused the memory for a 400³ grid over 1,000 generations/);
});

test('bytes and counts as the dialog writes them', () => {
  assert.equal(formatBytes(1000), 'under 1 MB');
  assert.equal(formatBytes(820 * MB), '820 MB');
  assert.equal(formatBytes(1.5 * GB), '1.5 GB');
  assert.equal(formatBytes(64 * GB), '64 GB');
  assert.equal(formatCount(830.4), '830');
  assert.equal(formatCount(48_000), '48,000');
  assert.equal(formatCount(5_043_861), '5.0 million');
  assert.equal(formatCount(2.1e9), '2.1 billion');
});

test("a refused allocation is the browser's RangeError", () => {
  let refused = null;
  try {
    new Uint8Array(2 ** 53); // past any typed array's length
  } catch (err) {
    refused = err;
  }
  assert.ok(isOutOfMemory(refused));
  assert.equal(isOutOfMemory(new Error('The GPU device was lost')), false);
});
