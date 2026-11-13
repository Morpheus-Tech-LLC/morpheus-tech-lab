// SPDX-License-Identifier: Apache-2.0
//
// Explore's settings (src/explore/setup.js): each seed source gives the config the settings dialog
// gave before #69, what locks the rules and the arena, Use your own rules, the changes each HUD
// popover makes and the messages it refuses them with, and what each box shows.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialSetup, makeShape, presetSeed, fileSeed, changeSeed, changeRules, changeArena, changeMemory,
  ownRules, configOf, boxesOf, lockOf, rulesOf, arenaOf, startOf, restartNote, seedLabel, SHAPES,
  DEFAULT_RULES, DEFAULT_MEMORY_MB, DEFAULT_ARENA, deathCounts, designOf, presetCopy, designFile, useDesign,
} from '../../src/explore/setup.js';
import { shapeSeed, toSeedFile, SeedError } from '../../src/explore/seed.js';
import { readSeedOrSave, generationSave } from '../../src/explore/save.js';
import { PRESETS, presetById } from '../../src/explore/presets.js';
import { cubeOfSide, octahedronShape } from '../../src/shapeGenerators.js';
import { state } from '../../src/state.js';

const CUBE10 = presetById('cube10');
const NOISE = presetById('spreading-noise');
const start = () => initialSetup({ size: 10, density: 1 });
const B5 = { birth: [5], survival: [4, 5, 6] };

/** A setup with a seed file of `cells` under B5 loaded. */
async function withSeedFile(setup, cells = Int32Array.from([0, 0, 0, 1, 0, 0])) {
  const loaded = await readSeedOrSave(toSeedFile({ rules: B5, cells }));
  return changeSeed(setup, fileSeed('mine.json', loaded));
}

/** A saved generation 412 of a run of `cells` under B5, in an arena of `arena`, as Load… reads it. */
async function savedGeneration(arena = 32) {
  const seed = Int32Array.from([0, 0, 0, 1, 0, 0, 0, 1, 0]);
  const cells = Int32Array.from([2, 2, 2, 3, 2, 2]);
  const { text } = await generationSave({
    config: { rules: B5, cells: seed, arena, memoryMB: 1024 },
    generation: 412,
    cells,
    ending: 'stopped',
  });
  return fileSeed('explore-generation-412.json', await readSeedOrSave(text));
}

/** Cells as sorted "x,y,z" keys, to compare sets of cells whatever their order. */
function keys(flat) {
  const out = [];
  for (let i = 0; i < flat.length; i += 3) out.push(`${flat[i]},${flat[i + 1]},${flat[i + 2]}`);
  return out.sort();
}

// ---- The config each seed source gives ----

test('Explore opens on the cube under the default rules, with no arena and a 1,024 MB limit', () => {
  const config = configOf(start());
  assert.deepEqual(keys(config.cells), keys(shapeSeed(cubeOfSide(10, 1), 10)));
  assert.deepEqual(config.rules, DEFAULT_RULES);
  assert.deepEqual(DEFAULT_RULES, state.explore.rules); // state.js's own default
  assert.equal(config.memoryMB, DEFAULT_MEMORY_MB);
  assert.equal(config.arena, null);
  assert.equal(config.label, 'Cube, size 10, density 1');
  assert.equal('seed' in config || 'from' in config, false);
});

test('a shape gives its cells, centred as shapeSeed() lifts them, under the Rules box\'s rules', () => {
  const setup = changeRules(start(), '5', '4-6');
  const next = changeSeed(setup, makeShape('octahedron', { size: 4, density: 1 }, setup.seed));
  const config = configOf(next);
  assert.deepEqual(keys(config.cells), keys(shapeSeed(octahedronShape(4, 1), 4)));
  assert.deepEqual(config.rules, B5);
  assert.equal(config.label, 'Octahedron, size 4, density 1');
});

test('a shape with the same settings keeps its cells, so a random density isn\'t drawn again', () => {
  const first = makeShape('cube', { size: 6, density: 0.4 });
  assert.equal(makeShape('cube', { size: 6, density: 0.4 }, first), first);
  assert.notEqual(makeShape('cube', { size: 6, density: 0.5 }, first), first);
  assert.notEqual(makeShape('tetrahedron', { size: 6, density: 0.4 }, first), first);
});

test('the noise shapes take a region, and the others don\'t', () => {
  const perlin = makeShape('perlin', { size: 10, density: 0.3, regionSize: 25 });
  assert.deepEqual(perlin.params, { size: 10, density: 0.3, regionSize: 25 });
  assert.equal(seedLabel(perlin), 'Perlin noise, detail 10, fill 0.3, region 25');
  const worley = makeShape('worley', { size: 8, density: 0.5, regionSize: 0 });
  assert.equal(seedLabel(worley), 'Worley noise, 8 points, distance 0.5');
  assert.deepEqual(makeShape('cube', { size: 3, density: 1, regionSize: 25 }).params, { size: 3, density: 1 });
});

for (const preset of PRESETS) {
  test(`the preset ${preset.name} gives its cells and its own rules, whatever the Rules box holds`, () => {
    const setup = changeSeed(changeRules(start(), '5', '4-6'), presetSeed(preset.id));
    const config = configOf(setup);
    assert.deepEqual(keys(config.cells), keys(preset.cells));
    assert.deepEqual(config.rules, preset.rules);
    assert.equal(config.label, preset.name);
    assert.deepEqual(setup.rules, B5, 'the visitor\'s own rules wait for the next Custom seed');
  });

  test(`${preset.name}'s cells, as a shape, run under the Rules box's rules (#67)`, () => {
    const key = `preset:${preset.id}`;
    assert.ok(SHAPES.some((shape) => shape.key === key));
    const setup = changeSeed(changeRules(start(), '5', '4-6'), makeShape(key));
    const config = configOf(setup);
    assert.deepEqual(keys(config.cells), keys(preset.cells));
    assert.deepEqual(config.rules, B5);
    assert.equal(config.label, `${preset.name}'s cells`);
    assert.equal(lockOf(setup), null);
  });
}

test('a seed file gives its cells, and its rules go into the Rules box, to edit', async () => {
  const setup = await withSeedFile(start());
  const config = configOf(setup);
  assert.deepEqual(keys(config.cells), ['0,0,0', '1,0,0']);
  assert.deepEqual(config.rules, B5);
  assert.deepEqual(setup.rules, B5);
  assert.equal(config.label, 'Seed file: mine.json');
  assert.equal(lockOf(setup), null);
  assert.deepEqual(rulesOf(changeRules(setup, '6', '5')), { birth: [6], survival: [5] });
});

test('a saved generation carries on from its generation, with its first seed, rules and arena', async () => {
  const setup = changeSeed(changeArena(start(), false, 100), await savedGeneration(32));
  const config = configOf(setup);
  assert.deepEqual(keys(config.cells), ['2,2,2', '3,2,2']);
  assert.deepEqual(keys(config.seed), ['0,0,0', '0,1,0', '1,0,0']);
  assert.equal(config.from, 412);
  assert.deepEqual(config.rules, B5);
  assert.equal(config.arena, 32);
  assert.equal(config.label, 'Saved generation 412: explore-generation-412.json');
  assert.equal(startOf(setup), 412);
  assert.equal(restartNote(startOf(setup)), 'Applying restarts the run from generation 412.');
  assert.equal(restartNote(startOf(start())), 'Applying restarts the run from generation 0.');
});

// ---- Locks, and Use your own rules ----

test('a preset locks its rules but not the arena', () => {
  const setup = changeSeed(start(), presetSeed('cube10'));
  assert.deepEqual(lockOf(setup), { by: 'preset', name: 'Cube10', text: 'with Cube10' });
  assert.throws(() => changeRules(setup, '5', '4-6'), {
    name: 'SeedError', message: 'Cube10 brings its own rules: press Use your own rules to change the rules.',
  });
  assert.equal(arenaOf(changeArena(setup, true, 64)), 64);
});

test('a saved generation locks its rules and its arena', async () => {
  const setup = changeSeed(start(), await savedGeneration(32));
  assert.equal(lockOf(setup).text, 'with the saved generation');
  assert.throws(() => changeRules(setup, '5', '4-6'), SeedError);
  assert.throws(() => changeArena(setup, false, 32), {
    name: 'SeedError',
    message: 'The saved generation carries on under its own rules and arena: press Use your own rules to change the arena.',
  });
  // The memory limit isn't part of the run, so it stays the visitor's
  assert.equal(changeMemory(setup, '512').memoryMB, 512);
  assert.equal(startOf(changeMemory(setup, '512')), 412);
});

test('Use your own rules on a preset keeps its cells and rules, now unlocked, from generation 0', () => {
  const own = ownRules(changeSeed(start(), presetSeed('spreading-noise')));
  assert.equal(lockOf(own), null);
  assert.equal(own.seed.key, 'preset:spreading-noise');
  assert.deepEqual(keys(configOf(own).cells), keys(NOISE.cells));
  assert.deepEqual(configOf(own).rules, NOISE.rules);
  assert.equal(startOf(own), 0);
  // Applied with edited rules, from the Rules popover
  const edited = changeRules(changeSeed(start(), presetSeed('spreading-noise')), '7', '2-6', { own: true });
  assert.deepEqual(rulesOf(edited), { birth: [7], survival: [2, 3, 4, 5, 6] });
  assert.deepEqual(keys(configOf(edited).cells), keys(NOISE.cells));
  assert.deepEqual(presetById('spreading-noise').rules, NOISE.rules, 'the preset itself is unchanged');
});

test('Use your own rules on a saved generation keeps its cells, rules and arena, from generation 0', async () => {
  const own = ownRules(changeSeed(start(), await savedGeneration(32)));
  assert.equal(lockOf(own), null);
  const config = configOf(own);
  assert.deepEqual(keys(config.cells), ['2,2,2', '3,2,2']);
  assert.deepEqual(config.rules, B5);
  assert.equal(config.arena, 32);
  assert.equal('from' in config || 'seed' in config, false);
  assert.equal(config.label, 'Generation 412 of explore-generation-412.json');
  // From the Limits popover: the arena changes, the rules stay
  const wider = changeArena(changeSeed(start(), await savedGeneration(32)), true, 48, { own: true });
  assert.equal(arenaOf(wider), 48);
  assert.deepEqual(rulesOf(wider), B5);
});

test('Use your own rules leaves an unlocked setup as it is', () => {
  const setup = start();
  assert.equal(ownRules(setup), setup);
});

// ---- Refusals, with the dialog's messages ----

test('bad rules are refused, B0 with its reason', () => {
  assert.throws(() => changeRules(start(), '0,9', '5'), /B0/);
  assert.throws(() => changeRules(start(), '', '5'), { message: 'Give at least one birth count, or no cell can ever be born.' });
  assert.throws(() => changeRules(start(), 'nine', '5'), /can't include "nine"/);
  assert.throws(() => changeRules(start(), '27', '5'), /too many/);
});

test('bad shape sizes, densities and regions are refused', () => {
  assert.throws(() => makeShape('cube', { size: 0, density: 1 }), { message: "In Explore, the seed's size must be a whole number from 1 to 100." });
  assert.throws(() => makeShape('cube', { size: 101, density: 1 }), SeedError);
  assert.throws(() => makeShape('cube', { size: 2.5, density: 1 }), SeedError);
  assert.throws(() => makeShape('cube', { size: 5, density: 1.5 }), { message: "The seed's density must be from 0 to 1." });
  assert.throws(() => makeShape('cube', { size: 5, density: '' }), SeedError);
  assert.throws(() => makeShape('perlin', { size: 5, density: 0.3, regionSize: 201 }), { message: 'In Explore, the region size must be a whole number up to 200.' });
  assert.throws(() => makeShape('dodecahedron', { size: 5, density: 1 }), { message: 'Pick a shape for the seed.' });
  assert.throws(() => presetSeed('no-such-preset'), SeedError);
});

test('an empty seed is refused, and the setup stays as it was', () => {
  const setup = start();
  assert.throws(() => changeSeed(setup, makeShape('cube', { size: 5, density: 0 })), {
    message: 'The seed has no live cells: raise its density or its size.',
  });
  assert.equal(configOf(setup).cells.length, 3000);
});

test('bad arena sides are refused, and a seed that doesn\'t fit the arena is too', () => {
  for (const side of [7, 1025, 12.5, '', 'big']) {
    assert.throws(() => changeArena(start(), true, side), { message: 'The arena size must be a whole number of cells, from 8 to 1024.' });
  }
  // Off, the side isn't checked, and a good one is remembered for next time
  assert.equal(changeArena(start(), false, 'big').arenaSize, DEFAULT_ARENA);
  assert.equal(changeArena(start(), false, 100).arenaSize, 100);
  // The cube covers -5 to 4, which an 8³ arena (-4 to 3) doesn't hold
  assert.throws(() => changeArena(start(), true, 8), {
    message: "The seed doesn't fit inside a 8³ arena: make the arena bigger or the seed smaller.",
  });
  assert.equal(arenaOf(changeArena(start(), true, 10)), 10);
  // ...and the same check stops a seed too big for the arena that is on
  const boxed = changeArena(start(), true, 10);
  assert.throws(() => changeSeed(boxed, makeShape('cube', { size: 20, density: 1 })), /doesn't fit inside a 10³ arena/);
});

test('bad memory limits are refused', () => {
  for (const mb of [63, 16385, 100.5, '', 'lots']) {
    assert.throws(() => changeMemory(start(), mb), { message: 'The memory limit must be a whole number of MB, from 64 to 16384.' });
  }
  assert.equal(changeMemory(start(), '64').memoryMB, 64);
  assert.equal(changeMemory(start(), 16384).memoryMB, 16384);
});

// ---- What the boxes show ----

test('each box shows its source\'s text', async () => {
  const cube = boxesOf(start());
  assert.deepEqual(cube, {
    seed: 'Cube, size 10, density 1', cells: 1000, rules: DEFAULT_RULES, lock: null,
    arena: null, arenaLocked: false, memoryMB: 1024,
  });
  const preset = boxesOf(changeSeed(start(), presetSeed('cube10')));
  assert.equal(preset.seed, 'Cube10');
  assert.equal(preset.cells, 1000);
  assert.equal(preset.lock, 'with Cube10');
  assert.equal(preset.arenaLocked, false);
  assert.equal(boxesOf(changeSeed(start(), presetSeed('spreading-noise'))).seed, 'Spreading noise');
  assert.equal(boxesOf(changeSeed(start(), makeShape('preset:cube10'))).seed, "Cube10's cells");
  assert.equal(boxesOf(await withSeedFile(start())).seed, 'Seed file: mine.json');
  const saved = boxesOf(changeSeed(start(), await savedGeneration(32)));
  assert.equal(saved.seed, 'Saved generation 412: explore-generation-412.json');
  assert.equal(saved.cells, 2);
  assert.equal(saved.lock, 'with the saved generation');
  assert.equal(saved.arena, 32);
  assert.equal(saved.arenaLocked, true);
  assert.equal(boxesOf(changeMemory(start(), 2048)).memoryMB, 2048);
  assert.equal(boxesOf(changeArena(start(), true, 64)).arena, 64);
});

test('a change never alters the setup it was made from', async () => {
  const setup = start();
  const before = JSON.stringify(setup, (k, v) => (ArrayBuffer.isView(v) ? Array.from(v) : v));
  changeRules(setup, '5', '4-6');
  changeArena(setup, true, 64);
  changeMemory(setup, 512);
  changeSeed(setup, presetSeed('cube10'));
  await withSeedFile(setup);
  ownRules(changeSeed(setup, presetSeed('cube10')));
  assert.equal(JSON.stringify(setup, (k, v) => (ArrayBuffer.isView(v) ? Array.from(v) : v)), before);
  assert.deepEqual(CUBE10.rules, { birth: [9, 10], survival: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] });
});

// ---- The Rules popover's derived counts ----

test('a live cell dies below, above and between the survival counts', () => {
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  assert.deepEqual(deathCounts(DEFAULT_RULES.survival), { isolation: range(0, 4), overcrowding: range(16, 26), gaps: [] });
  assert.deepEqual(deathCounts(NOISE.rules.survival), {
    isolation: [],
    overcrowding: [25, 26],
    gaps: [1, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22],
  });
  assert.deepEqual(deathCounts([]), { isolation: range(0, 26), overcrowding: [], gaps: [] });
  assert.deepEqual(deathCounts([0, 26]), { isolation: [], overcrowding: [], gaps: range(1, 25) });
});

// ---- The seed editor (#70) ----

test('Design… opens on the seed in use when it fits the seed box, with the Rules box rules', () => {
  const opened = designOf(start());
  assert.equal(opened.reason, null);
  assert.equal(opened.places.reduce((a, b) => a + b, 0), 1000);
  assert.deepEqual(opened.rules, DEFAULT_RULES);
  // A preset in use: its cells, and the rules the Rules box shows, its own
  const preset = designOf(changeSeed(start(), presetSeed('spreading-noise')));
  assert.equal(preset.places.reduce((a, b) => a + b, 0), 224);
  assert.deepEqual(preset.rules, NOISE.rules);
});

test('Design… opens on an empty box, saying why, for a seed outside the box or a saved generation', async () => {
  const big = changeSeed(start(), makeShape('cube', { size: 20, density: 1 }));
  const opened = designOf(big);
  assert.equal(opened.places, null);
  assert.equal(opened.reason, '7,000 cells of this seed lie outside the 10³ box.');
  const saved = designOf(changeSeed(start(), await savedGeneration()));
  assert.equal(saved.places, null);
  assert.match(saved.reason, /saved generation .* can't open as a design/);
});

test('Edit a copy… opens a preset with its rules; the preset is unchanged', () => {
  const before = Int32Array.from(CUBE10.cells);
  const copy = presetCopy('cube10');
  assert.equal(copy.name, 'Cube10');
  assert.deepEqual(copy.rules, CUBE10.rules);
  copy.places.fill(0);
  assert.deepEqual(Int32Array.from(CUBE10.cells), before);
  assert.throws(() => presetCopy('nope'), SeedError);
});

test("Use makes the design a Custom seed with the given rules, unlocked; a preset's copy keeps its rules", () => {
  const cells = Int32Array.from([0, 0, 0, 1, 0, 0, 0, 1, 0]);
  const fromPreset = changeSeed(start(), presetSeed('cube10'));
  const next = useDesign(fromPreset, cells, CUBE10.rules);
  assert.equal(next.seed.kind, 'design');
  assert.equal(lockOf(next), null);
  assert.deepEqual(rulesOf(next), CUBE10.rules);
  assert.equal(seedLabel(next.seed), 'Design: 3 cells');
  assert.deepEqual(boxesOf(next).cells, 3);
  assert.deepEqual(configOf(next).cells, cells);
  assert.equal(fromPreset.seed.kind, 'preset');
  // The design opens back in the editor as it was
  assert.deepEqual(designOf(next).places, designOf(useDesign(start(), cells, B5)).places);
});

test('Use refuses an empty design, and one outside the arena', () => {
  assert.throws(() => useDesign(start(), new Int32Array(0), B5), { message: 'The design has no live cells: switch some on first.' });
  const small = changeArena(useDesign(start(), Int32Array.from([0, 0, 0]), B5), true, 8);
  assert.throws(() => useDesign(small, Int32Array.from([4, 4, 4]), B5), /doesn't fit inside a 8³ arena/);
});

test("The editor's Load… takes seed files that fit, and refuses saved generations and seeds that don't", async () => {
  const fits = designFile('mine.json', await readSeedOrSave(toSeedFile({ rules: B5, cells: Int32Array.from([1, 2, 3]) })));
  assert.deepEqual(fits.rules, B5);
  assert.equal(fits.places.reduce((a, b) => a + b, 0), 1);
  const outside = await readSeedOrSave(toSeedFile({ rules: B5, cells: Int32Array.from([9, 0, 0]) }));
  assert.throws(() => designFile('far.json', outside), { message: /^far\.json can't open here: 1 cell of this seed lies outside the 10³ box\./ });
  const { text } = await generationSave({
    config: { rules: B5, cells: Int32Array.from([0, 0, 0]), arena: null, memoryMB: 1024 },
    generation: 3,
    cells: Int32Array.from([1, 1, 1]),
    ending: 'stopped',
  });
  const saved = await readSeedOrSave(text);
  assert.throws(() => designFile('run.json', saved), { message: /^run\.json is a saved generation\./ });
});
