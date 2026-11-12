// SPDX-License-Identifier: Apache-2.0
//
// Explore's preset seeds (src/explore/presets.js): their cells and rules, where they came from,
// and their round trip through a seed file.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, presetById } from '../../src/explore/presets.js';
import { shapeSeed, toSeedFile, parseSeedFile } from '../../src/explore/seed.js';
import { validateRules } from '../../src/unbounded/rules.js';
import { cubeOfSide } from '../../src/shapeGenerators.js';
import { state } from '../../src/state.js';
import { candidate } from '../../scripts/bench/candidates.mjs';

/** Cells as sorted "x,y,z" keys, to compare sets of cells whatever their order. */
function keys(flat) {
  const out = [];
  for (let i = 0; i < flat.length; i += 3) out.push(`${flat[i]},${flat[i + 1]},${flat[i + 2]}`);
  return out.sort();
}

test('the presets have distinct ids and names, and presetById finds each one', () => {
  assert.equal(new Set(PRESETS.map((p) => p.id)).size, PRESETS.length);
  assert.equal(new Set(PRESETS.map((p) => p.name)).size, PRESETS.length);
  for (const preset of PRESETS) assert.equal(presetById(preset.id), preset);
  assert.equal(presetById('no-such-preset'), undefined);
});

for (const preset of PRESETS) {
  test(`${preset.name}: its cells are in the seed box, none twice, and its rules are valid`, () => {
    assert.ok(preset.cells instanceof Int32Array && preset.cells.length > 0 && preset.cells.length % 3 === 0);
    for (const c of preset.cells) assert.ok(c >= -5 && c <= 4, `${c} is outside the seed box, -5 to 4`);
    const cells = keys(preset.cells);
    assert.equal(new Set(cells).size, cells.length, 'a cell is listed twice');
    assert.deepEqual(validateRules(preset.rules), preset.rules); // refuses B0, and is in normal form
    assert.ok(preset.description.length > 0);
  });

  test(`${preset.name}: a seed file of it reads back as the same cells and rules`, () => {
    const back = parseSeedFile(toSeedFile({ rules: preset.rules, cells: preset.cells }));
    assert.deepEqual(back.rules, preset.rules);
    assert.deepEqual(keys(back.cells), keys(preset.cells));
  });
}

test("Cube10 is the seed Explore opens on: the default cube shape, under Explore's default rules", () => {
  const preset = presetById('cube10');
  const { size, density } = state.shapeParams.cube;
  assert.equal(density, 1, "the lab's default cube is solid");
  assert.deepEqual(keys(preset.cells), keys(shapeSeed(cubeOfSide(size, density), size)));
  assert.deepEqual(preset.rules, validateRules(state.explore.rules));
  assert.equal(preset.cells.length / 3, 1000);
});

test("Spreading noise is the bench's Speed candidate 12345", () => {
  const preset = presetById('spreading-noise');
  const bench = candidate(12345);
  assert.deepEqual(preset.rules, validateRules(bench.rules));
  assert.deepEqual(keys(preset.cells), keys(bench.seed.flat()));
  assert.equal(preset.cells.length / 3, 224);
});
