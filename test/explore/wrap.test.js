// SPDX-License-Identifier: Apache-2.0
//
// Game of Life 3D's arena that wraps around (#115): the choice of what happens at the arena's edge, the
// world a run steps in, the Ships presets coming round and settling, Use in a contest and Design a
// seed in Explore, a saved generation, and Save this generation's refusal.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialSetup, changeArena, changeSeed, makeShape, fileSeed, presetSeed, configOf, boxesOf, edgeOf, shipsOf, wrapOf,
  worldOf, contestArena, contestEntry, ownRules, EDGES,
} from '../../src/explore/setup.js';
import { arenaBox, SeedError } from '../../src/explore/seed.js';
import { generationSave, readSeedOrSave, WRAP_SAVE_REASON } from '../../src/explore/save.js';
import { PRESETS } from '../../src/explore/presets.js';
import { contestById } from '../../src/unbounded/contests.js';
import { Run } from '../../src/unbounded/run.js';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { SHIP } from '../unbounded/helpers.js';

const CLASSIC = contestById('classic-methuselah-1');
const METHUSELAH = contestById('methuselah-1');
const start = () => initialSetup({ size: 10, density: 1 });
const wrapping = (setup = start(), side = 64) => changeArena(setup, true, side, { edge: 'wrap' });

/** Runs a config as Explore does (open-ended, settling), flat out, until it ends. */
function exploreRun(cfg) {
  const messages = [];
  const queue = [];
  const host = new Run({ post: (m) => messages.push(m), now: () => 0, yieldThen: (fn) => queue.push(fn), wait: (ms, fn) => queue.push(fn) });
  host.receive({
    type: 'start', world: { ...worldOf(cfg), slabBytes: 1 << 20 }, seed: cfg.cells.slice(), run: { kind: 'open', settle: true },
  });
  while (queue.length) queue.shift()();
  assert.deepEqual(messages.filter((m) => m.type === 'error'), []);
  return messages.find((m) => m.type === 'state' && m.state === 'ended');
}

test('at the edge, the run ends by default; the arena can wrap, which is remembered while the arena is off', () => {
  assert.deepEqual(EDGES, ['end', 'ships', 'wrap', 'walls']);
  const setup = start();
  assert.equal(setup.edge, 'end');
  assert.equal(edgeOf(setup), 'end');
  const on = wrapping(setup);
  assert.equal(edgeOf(on), 'wrap');
  assert.equal(wrapOf(on), true);
  assert.equal(shipsOf(on), false);
  assert.equal(configOf(on).wrap, true);
  assert.equal(configOf(on).ships, false);
  assert.equal(boxesOf(on).edge, 'wrap');
  // With no arena there is no edge, but the choice comes back with the arena
  const off = changeArena(on, false, 64);
  assert.equal(edgeOf(off), 'end');
  assert.equal(configOf(off).wrap, false);
  assert.equal(wrapOf(changeArena(off, true, 64)), true);
  // Not given: kept as it was; given: one of the three, or refused
  assert.equal(wrapOf(changeArena(on, true, 100)), true);
  assert.equal(shipsOf(changeArena(on, true, 64, { edge: 'ships' })), true);
  assert.throws(() => changeArena(on, true, 64, { edge: 'bounce' }), SeedError);
});

test("the run's world wraps only with an arena and the choice, and never has departures too", () => {
  const cfg = { rules: SHIP.rules, cells: Int32Array.from(SHIP.seed.flat()), memoryMB: 64, arena: 64, label: 'test' };
  const world = worldOf({ ...cfg, wrap: true, ships: false });
  assert.equal(world.wrap, true);
  assert.deepEqual(world.arena, arenaBox(64));
  assert.equal(world.departures, undefined);
  assert.equal(worldOf({ ...cfg, wrap: false }).wrap, undefined);
  assert.equal(worldOf({ ...cfg, arena: null, wrap: true }).wrap, undefined);
  // configOf() never gives both, and the World refuses them together
  assert.equal(worldOf({ ...cfg, wrap: true, ships: true }).wrap, undefined);
  assert.doesNotThrow(() => new World(worldOf(configOf(wrapping()))));
});

test('every Ships preset comes round a wrapping 64³ arena, and the run settles on its lap', () => {
  const ships = PRESETS.filter((preset) => preset.group === 'ships');
  assert.ok(ships.length >= 9);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  for (const preset of ships) {
    const setup = wrapping(changeSeed(start(), presetSeed(preset.id)));
    const { period, shift } = preset.ship;
    // Back where it started once each axis's shift adds up to whole laps of 64
    const step_ = shift.map(Math.abs).reduce(gcd, 64);
    const lap = period * (64 / step_);
    const end = exploreRun({ ...configOf(setup), memoryMB: 64 });
    assert.equal(end.reason, 'repeat', `${preset.name}: ended ${end.reason}`);
    assert.equal(end.cycle.period, lap, `${preset.name}: a cycle of ${end.cycle.period}, expected ${lap}`);
    assert.ok(end.cycle.from >= preset.ship.from - period, `${preset.name}: settled at ${end.cycle.from}`);
  }
});

test('Use in a contest notes that the contest\'s arena doesn\'t wrap, and Explore\'s did', () => {
  const seed = makeShape('cube', { size: 4, density: 1 });
  const setup = wrapping(changeSeed(start(), seed));
  for (const contest of [METHUSELAH, CLASSIC]) {
    assert.equal(contestEntry(setup, contest).entry.note,
      `${contest.title}'s arena doesn't wrap around, and Game of Life 3D's did, so a run here may end differently from one in Game of Life 3D.`);
  }
  // Another arena: the arena's note says it
  assert.match(contestEntry(changeArena(setup, true, 100), METHUSELAH).entry.note, /^Methuselah runs in its own 64³ arena, and Game of Life 3D's was 100³/);
});

test("Design a seed in Explore stops the arena wrapping, as no contest's does", () => {
  const strict = contestArena(wrapping(), 64, 'Methuselah');
  assert.equal(edgeOf(strict.setup), 'end');
  assert.match(strict.note, /^Game of Life 3D's 64³ arena no longer wraps around, as in Methuselah: a run here settles, or reaches the edge, where Methuselah's would/);
  const classic = contestArena(wrapping(), 64, 'Classic Methuselah', true);
  assert.equal(edgeOf(classic.setup), 'ships');
  assert.match(classic.note, /^Game of Life 3D's 64³ arena no longer wraps around, and ships leave at its edge, as in Classic Methuselah: /);
  // From another arena: on, at the contest's, as before
  const other = contestArena(wrapping(start(), 100), 64, 'Methuselah');
  assert.equal(edgeOf(other.setup), 'end');
  assert.match(other.note, /^Game of Life 3D's arena is now on, at 64³, as Methuselah's: /);
});

test('a saved generation carries on with the run ending at the edge; Use your own rules gives the choice back', async () => {
  const world = new World({ rules: SHIP.rules, chunkSize: 8, slabBytes: 1 << 20, arena: arenaBox(64) });
  world.setCells(SHIP.seed);
  while (world.generation < 20) step(world);
  const cfg = { rules: SHIP.rules, cells: Int32Array.from(SHIP.seed.flat()), arena: 64 };
  const { text } = await generationSave({ config: cfg, generation: 20, cells: world.cells(), ending: 'stopped' });
  const setup = changeSeed(wrapping(), fileSeed('saved.json', await readSeedOrSave(text)));
  assert.equal(setup.seed.kind, 'saved');
  assert.equal(edgeOf(setup), 'end');
  assert.equal(configOf(setup).wrap, false);
  assert.equal(boxesOf(setup).edge, 'end');
  assert.equal(wrapOf(ownRules(setup)), true);
});

test('Save this generation says why it refuses while the arena wraps, and that Save seed still works', () => {
  assert.match(WRAP_SAVE_REASON, /^This run's arena wraps around, and a saved generation can't record that/);
  assert.match(WRAP_SAVE_REASON, /no contest wraps/);
  assert.match(WRAP_SAVE_REASON, /Save seed still saves the seed/);
});
