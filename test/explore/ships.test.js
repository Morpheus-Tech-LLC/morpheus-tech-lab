// SPDX-License-Identifier: Apache-2.0
//
// Explore's Ships leave at the edge (#103): the option in Explore's settings, the world a run
// steps in, a run that ends where Classic Methuselah's would, Design a seed in Explore,
// and Save this generation once a ship has left.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialSetup, changeArena, changeSeed, makeShape, fileSeed, simulationFile, configOf, boxesOf, shipsOf, worldOf, contestArena,
  ownRules, SHIP_PERIOD,
} from '../../src/explore/setup.js';
import { arenaBox } from '../../src/explore/seed.js';
import { generationSave, readSeedOrSave, shipsLeftReason } from '../../src/explore/save.js';
import { contestById } from '../../src/unbounded/contests.js';
import { Run } from '../../src/unbounded/run.js';
import { World } from '../../src/unbounded/world.js';
import { stepWithDepartures } from '../../src/unbounded/departures.js';
import { readResult } from '../../src/unbounded/canonical.js';
import { verifyResult } from '../../src/unbounded/verify.js';
import { SHIP, SHIP_REST, OSCILLATOR } from '../unbounded/helpers.js';

const CLASSIC = contestById('classic-methuselah-1');
const start = () => initialSetup({ size: 10, density: 1 });
/** SHIP, which leaves a 64³ arena at generation 35, and a period-2 oscillator that settled long before. */
const SHIP_AND_REST = { rules: SHIP.rules, cells: Int32Array.from([...SHIP.seed, ...SHIP_REST].flat()) };

/** Explore's config for SHIP_AND_REST, in a 64³ arena, with ships leaving at its edge or not. */
const config = (ships) => ({ ...SHIP_AND_REST, memoryMB: 64, arena: 64, ships, label: 'test' });

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

test('Ships leave at the edge is off by default, needs an arena, and is remembered while the arena is off', () => {
  const setup = start();
  assert.equal(setup.edge, 'end');
  assert.equal(shipsOf(setup), false);
  const on = changeArena(setup, true, 64, { edge: 'ships' });
  assert.equal(shipsOf(on), true);
  assert.equal(configOf(on).ships, true);
  assert.equal(boxesOf(on).edge, 'ships');
  // Off with the arena, but remembered for when it comes back
  const off = changeArena(on, false, 64);
  assert.equal(shipsOf(off), false);
  assert.equal(configOf(off).ships, false);
  assert.equal(shipsOf(changeArena(off, true, 64)), true);
  // Not given: kept as it was
  assert.equal(shipsOf(changeArena(on, true, 100)), true);
  assert.equal(shipsOf(changeArena(on, true, 64, { edge: 'end' })), false);
  // A Classic Methuselah's P
  assert.equal(SHIP_PERIOD, CLASSIC.departures.period);
  assert.equal(SHIP_PERIOD, 32);
});

test("the run's world has the departure rule only with an arena and the option", () => {
  assert.deepEqual(worldOf(config(true)).departures, { period: 32 });
  assert.deepEqual(worldOf(config(true)).arena, arenaBox(64));
  assert.equal(worldOf(config(false)).departures, undefined);
  assert.equal(worldOf({ ...config(true), arena: null }).departures, undefined);
  assert.equal(worldOf({ ...config(true), arena: null }).arena, undefined);
});

test("with the option, Explore's run lets the ship leave and settles where Classic Methuselah scores; without, it ends at the edge as Methuselah's", () => {
  const leaving = exploreRun(config(true));
  assert.equal(leaving.reason, 'repeat');
  assert.deepEqual(leaving.cycle, { from: 36, period: 2 });
  assert.equal(leaving.stats.departed, 1);
  assert.deepEqual(leaving.stats.lastDeparture, { generation: 35, shift: [1, 0, 0] });
  assert.deepEqual(leaving.departures, [{ generation: 35, period: 1, shift: [1, 0, 0] }]);

  const strict = exploreRun(config(false));
  assert.equal(strict.reason, 'arena-edge');
  assert.equal(strict.stats.generation, 35);
  assert.equal(strict.stats.departed, undefined);
  assert.equal(strict.stats.lastDeparture, undefined);
  assert.equal(strict.departures, undefined);

  // A pattern that never reaches the edge runs as before, with the option on or off
  const oscillator = { rules: OSCILLATOR.rules, cells: Int32Array.from(OSCILLATOR.seed.flat()), memoryMB: 64, arena: 64, label: 'test' };
  for (const ships of [true, false]) {
    const end = exploreRun({ ...oscillator, ships });
    assert.deepEqual([end.reason, end.cycle], ['repeat', { from: OSCILLATOR.from, period: OSCILLATOR.period }]);
  }
});

test("Design a seed in Explore sets the arena, and the ships, to the contest's", () => {
  const setup = changeArena(start(), false, 64);
  const classic = contestArena(setup, 64, 'Classic Methuselah', true);
  assert.equal(shipsOf(classic.setup), true);
  assert.equal(configOf(classic.setup).arena, 64);
  assert.match(classic.note, /^The arena in Game of Life 3D \(unbounded\) is now on, at 64³, with ships leaving at its edge, as Classic Methuselah's: a run here settles, or reaches the edge, where Classic Methuselah's would/);
  // Already so: unchanged
  const again = contestArena(classic.setup, 64, 'Classic Methuselah', true);
  assert.equal(again.setup, classic.setup);
  assert.match(again.note, /^The arena in Game of Life 3D \(unbounded\) is 64³, with ships leaving at its edge, as Classic Methuselah's/);
  // From Classic Methuselah's to Methuselah's: the same arena, and ships no longer leave
  const strict = contestArena(classic.setup, 64, 'Methuselah');
  assert.equal(shipsOf(strict.setup), false);
  assert.match(strict.note, /^Ships no longer leave at the edge of the 64³ arena in Game of Life 3D \(unbounded\), as in Methuselah: /);
  // And back
  const back = contestArena(strict.setup, 64, 'Classic Methuselah', true);
  assert.equal(shipsOf(back.setup), true);
  assert.match(back.note, /^Ships now leave at the edge of the 64³ arena in Game of Life 3D \(unbounded\), as in Classic Methuselah: /);
  // Methuselah's, from no arena: as before (#94)
  assert.match(contestArena(setup, 64, 'Methuselah').note, /^The arena in Game of Life 3D \(unbounded\) is now on, at 64³, as Methuselah's: /);
});

test('a saved generation carries on without the rule, as it was saved; Use your own rules gives the option back', async () => {
  const world = new World({ rules: SHIP.rules, chunkSize: 8, slabBytes: 1 << 20, arena: arenaBox(64), departures: { period: 32 } });
  world.setCells(SHIP.seed);
  while (world.generation < 20) stepWithDepartures(world);
  const cfg = { rules: SHIP.rules, cells: Int32Array.from(SHIP.seed.flat()), arena: 64, ships: true };
  const { text } = await generationSave({ config: cfg, generation: 20, cells: world.cells(), ending: 'stopped' });
  const setup = changeSeed(changeArena(start(), true, 64, { edge: 'ships' }), simulationFile('saved.json', await readSeedOrSave(text)));
  assert.equal(setup.seed.kind, 'saved');
  assert.equal(shipsOf(setup), false);
  assert.equal(configOf(setup).ships, false);
  assert.equal(shipsOf(ownRules(setup)), true);
});

test('Save this generation: before a ship leaves the file verifies; once one has, it is refused, saying why', async () => {
  assert.equal(shipsLeftReason(0), null);
  assert.equal(shipsLeftReason(undefined), null);
  assert.match(shipsLeftReason(1), /^A ship has left the arena by this generation, and a saved generation can't record that ships leave at the edge/);
  assert.match(shipsLeftReason(3), /^3 ships have left/);
  assert.match(shipsLeftReason(1), /Save simulation still saves the seed and its rules\.$/);

  // Generation 30, before the ship leaves at 35: the run so far is the same without the rule
  const cfg = config(true);
  const world = new World({ ...worldOf(cfg), chunkSize: 8, slabBytes: 1 << 20 });
  world.setCells([...SHIP.seed, ...SHIP_REST]);
  while (world.generation < 30) stepWithDepartures(world);
  assert.equal(world.departed.length, 0);
  const stats = { generation: 30, live: world.liveCells, departed: 0, lastDeparture: null };
  const { text } = await generationSave({ config: cfg, generation: 30, cells: world.cells(), ending: 'stopped', stats });
  const result = readResult(text);
  // The page's counts aren't in the file
  assert.equal(result.details.stats.departed, undefined);
  assert.equal(result.details.stats.lastDeparture, undefined);
  assert.equal(result.departures, undefined);
  assert.equal((await verifyResult(text)).verdict, 'verified');

  // Past it, the run has a departure, which no saved generation can replay
  while (world.generation < 40) stepWithDepartures(world);
  assert.equal(world.departed.length, 1);
  assert.notEqual(shipsLeftReason(world.departed.length), null);
});
