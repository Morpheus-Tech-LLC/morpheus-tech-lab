// SPDX-License-Identifier: Apache-2.0
//
// Explore's preset seeds (src/explore/presets.js): their cells and rules, where they came from,
// and their round trip through a seed file; and that each ship (#105) becomes the ship it says,
// on the lab's own engine.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, PRESET_GROUPS, presetById } from '../../src/explore/presets.js';
import { SHAPES, makeShape, ownRules, initialSetup, changeSeed, presetSeed, configOf, lockOf } from '../../src/explore/setup.js';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
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

// ---- Ships (#105) ----

const SHIPS = PRESETS.filter((preset) => preset.group === 'ships');
const start = () => initialSetup({ size: 10, density: 1 });

/** The cells of a seed under its rules, every generation from 0 to `last`, as sorted keys. */
function generations(preset, last) {
  const world = new World({ rules: preset.rules, chunkSize: 8, slabBytes: 1 << 20 });
  world.setCells(Array.from({ length: preset.cells.length / 3 }, (_, i) => [...preset.cells.subarray(3 * i, 3 * i + 3)]));
  const out = [keys(world.cells())];
  while (world.generation < last) {
    assert.equal(step(world), null);
    out.push(keys(world.cells()));
  }
  return out;
}

const moved = (cellKeys, [dx, dy, dz]) => cellKeys.map((k) => {
  const [x, y, z] = k.split(',').map(Number);
  return `${x + dx},${y + dy},${z + dz}`;
}).sort();

/** The least s ≤ 32 at which generation g's cells come back moved by some d ≠ 0, and d; or null. */
function shipAt(all, g) {
  const first = all[g];
  const lowest = (cellKeys) => [0, 1, 2].map((a) => Math.min(...cellKeys.map((k) => Number(k.split(',')[a]))));
  for (let s = 1; s <= 32; s++) {
    const later = all[g + s];
    if (later.length !== first.length) continue;
    const d = lowest(later).map((c, a) => c - lowest(first)[a]);
    if (d.some(Boolean) && moved(first, d).join() === later.join()) return { period: s, shift: d };
  }
  return null;
}

test('the ships are nine presets under Ships, after the first two, and among the Custom shapes', () => {
  assert.deepEqual(PRESET_GROUPS, [{ id: 'ships', label: 'Ships' }]);
  assert.deepEqual(PRESETS.slice(0, 2).map((p) => [p.id, p.group]), [['cube10', undefined], ['spreading-noise', undefined]]);
  assert.equal(SHIPS.length, 9);
  assert.ok(PRESETS.slice(2).every((p) => p.group === 'ships'));
  // Straight ships by period, then the diagonal ones by period
  const order = SHIPS.map((p) => [p.name.startsWith('Diagonal') ? 1 : 0, p.ship.period]);
  assert.deepEqual(order, [...order].sort((a, b) => a[0] - b[0] || a[1] - b[1]));
  for (const preset of SHIPS) {
    assert.match(preset.name, /^(Diagonal ship|Ship): period \d+, \d*c(\/\d+)?$/);
    assert.match(preset.description, new RegExp(`by generation ${preset.ship.from}\\b`));
    // Centred in the seed box: a 3×3×3 box, cells -1 to 1
    for (const c of preset.cells) assert.ok(c >= -1 && c <= 1);
    const shape = SHAPES.find((s) => s.preset === preset.id);
    assert.deepEqual([shape.name, shape.group], [`${preset.name}'s cells`, 'ships']);
  }
  assert.ok(SHAPES.filter((s) => !s.group).some((s) => s.preset === 'cube10'));
});

for (const preset of SHIPS) {
  test(`${preset.name}: a ship from generation ${preset.ship.from}, with its period and shift`, () => {
    const { from, period, shift } = preset.ship;
    const all = generations(preset, from + 32);
    assert.deepEqual(shipAt(all, from), { period, shift });
    if (from > 0) assert.equal(shipAt(all, from - 1), null, `already a ship at generation ${from - 1}`);
    // Its speed in the name is the shift's largest step over the period, in c
    const most = Math.max(...shift.map(Math.abs));
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const [n, q] = [most / gcd(most, period), period / gcd(most, period)];
    assert.ok(preset.name.endsWith(`${n === 1 ? '' : n}c${q === 1 ? '' : `/${q}`}`), preset.name);
    assert.equal(preset.name.startsWith('Diagonal'), shift.filter(Boolean).length > 1);
  });
}

test("a ship preset is locked to its rules, and Use your own rules makes it a Custom shape", () => {
  for (const preset of SHIPS) {
    const setup = changeSeed(start(), presetSeed(preset.id));
    assert.deepEqual(configOf(setup).rules, preset.rules);
    assert.notEqual(lockOf(setup), null);
    const own = ownRules(setup);
    assert.equal(own.seed.kind, 'shape');
    assert.deepEqual(own.seed, makeShape(`preset:${preset.id}`));
    assert.deepEqual(keys(configOf(own).cells), keys(preset.cells));
  }
});
