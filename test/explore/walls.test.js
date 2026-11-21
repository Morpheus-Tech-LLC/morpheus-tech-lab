// SPDX-License-Identifier: Apache-2.0
//
// Explore's arena with walls (#119): the choice and the walls' rules in Explore's settings, the
// refusals, the world a run steps in and a run in it, Design a seed in
// Explore, a saved generation, and Save this generation's refusal.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialSetup, changeArena, changeSeed, makeShape, fileSeed, simulationFile, configOf, boxesOf, edgeOf, wallsOf, wrapOf,
  worldOf, contestArena, ownRules, parseWalls, DEFAULT_WALLS, EDGES, WALL_KINDS,
} from '../../src/explore/setup.js';
import { arenaBox } from '../../src/explore/seed.js';
import { generationSave, readSeedOrSave, WALLS_SAVE_REASON } from '../../src/explore/save.js';
import { Run } from '../../src/unbounded/run.js';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { ReferenceWorld } from '../../src/unbounded/reference.js';
import { SHIP } from '../unbounded/helpers.js';

const start = () => initialSetup({ size: 10, density: 1 });
const OLD_TEXTS = {
  corner: { birth: '2,3', survival: '2-4' },
  edge: { birth: '4', survival: '2-6' },
  face: { birth: '6', survival: '3-9' },
};
const walled = (setup = start(), side = 64, walls) => changeArena(setup, true, side, { edge: 'walls', walls });

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

test("Walls is the fourth choice at the edge, with the old mode's rules until the visitor sets others", () => {
  assert.deepEqual(EDGES, ['end', 'ships', 'wrap', 'walls']);
  assert.deepEqual(WALL_KINDS.map(({ key, neighbours }) => [key, neighbours]), [['corner', 7], ['edge', 11], ['face', 17]]);
  assert.deepEqual(DEFAULT_WALLS, {
    corner: { birth: [2, 3], survival: [2, 3, 4] },
    edge: { birth: [4], survival: [2, 3, 4, 5, 6] },
    face: { birth: [6], survival: [3, 4, 5, 6, 7, 8, 9] },
  });
  const setup = start();
  assert.equal(setup.walls, DEFAULT_WALLS);
  assert.equal(wallsOf(setup), null);
  const on = walled(setup);
  assert.equal(edgeOf(on), 'walls');
  assert.deepEqual(wallsOf(on), DEFAULT_WALLS);
  assert.deepEqual(configOf(on).walls, DEFAULT_WALLS);
  assert.equal(configOf(on).wrap, false);
  assert.equal(configOf(on).ships, false);
  assert.equal(boxesOf(on).edge, 'walls');
  assert.deepEqual(boxesOf(on).walls, DEFAULT_WALLS);
  // The old mode's text gives the same rules
  assert.deepEqual(wallsOf(walled(setup, 64, OLD_TEXTS)), DEFAULT_WALLS);
});

test("the walls' rules are the visitor's, remembered while another choice is made or the arena is off", () => {
  const texts = { ...OLD_TEXTS, face: { birth: '5, 7-8', survival: '0, 17' } };
  const on = walled(start(), 64, texts);
  assert.deepEqual(wallsOf(on).face, { birth: [5, 7, 8], survival: [0, 17] });
  const wrapping = changeArena(on, true, 64, { edge: 'wrap' });
  assert.equal(wrapOf(wrapping), true);
  assert.equal(wallsOf(wrapping), null);
  assert.equal(configOf(wrapping).walls, null);
  assert.deepEqual(wallsOf(changeArena(wrapping, true, 64, { edge: 'walls' })).face, { birth: [5, 7, 8], survival: [0, 17] });
  const off = changeArena(on, false, 64);
  assert.equal(wallsOf(off), null);
  assert.deepEqual(wallsOf(changeArena(off, true, 64)).face, { birth: [5, 7, 8], survival: [0, 17] });
  // No birth count: that kind of wall cell is never born
  assert.deepEqual(parseWalls({ ...OLD_TEXTS, corner: { birth: '', survival: '1-7' } }).corner, { birth: [], survival: [1, 2, 3, 4, 5, 6, 7] });
});

test("a wall rule is refused with B0, a count past its cells' neighbours, or text that isn't counts, saying which", () => {
  const refused = (kind, birth, survival) => {
    try {
      parseWalls({ ...OLD_TEXTS, [kind]: { birth, survival } });
    } catch (err) {
      return err.message;
    }
    return null;
  };
  assert.match(refused('edge', '0,4', '2-6'), /^On the walls' edge cells: Birth with 0 live neighbours \(B0\) is not allowed/);
  assert.equal(refused('corner', '2', '8'), 'A corner cell has 7 neighbours inside the walls, so its counts go from 0 to 7; 8 is past them.');
  assert.equal(refused('edge', '12', '2'), 'An edge cell has 11 neighbours inside the walls, so its counts go from 0 to 11; 12 is past them.');
  assert.equal(refused('face', '6', '3-18'), 'A face cell has 17 neighbours inside the walls, so its counts go from 0 to 17; 18 is past them.');
  assert.match(refused('face', 'six', '3'), /^The face cells' birth counts can't include "six"/);
  // Refused, the setup stays as it was
  const on = walled();
  assert.throws(() => changeArena(on, true, 64, { edge: 'walls', walls: { ...OLD_TEXTS, corner: { birth: '9', survival: '' } } }));
  assert.deepEqual(wallsOf(on), DEFAULT_WALLS);
});

test("the run's world has the walls only with an arena and the choice, and a run in it matches the reference", () => {
  const on = changeSeed(walled(start(), 12, { ...OLD_TEXTS, face: { birth: '3,4', survival: '0,5-9' } }), makeShape('cube', { size: 6, density: 1 }));
  const config = configOf(on);
  const world = worldOf(config);
  assert.deepEqual(world.walls, wallsOf(on));
  assert.deepEqual(world.arena, arenaBox(12));
  assert.equal(world.wrap, undefined);
  assert.equal(world.departures, undefined);
  assert.equal(worldOf({ ...config, arena: null }).walls, undefined);
  assert.equal(worldOf(configOf(changeArena(on, true, 12, { edge: 'end' }))).walls, undefined);

  // Explore's run, settling, against the reference with the same walls
  const end = exploreRun({ ...config, memoryMB: 64 });
  assert.notEqual(end.reason, 'arena-edge');
  const engine = new World({ ...world, chunkSize: 8, slabBytes: 1 << 20 });
  const cells = [];
  for (let i = 0; i < config.cells.length; i += 3) cells.push([config.cells[i], config.cells[i + 1], config.cells[i + 2]]);
  engine.setCells(cells);
  const reference = new ReferenceWorld(config.rules, cells, { walls: { box: world.arena, ...world.walls } });
  for (let g = 0; g < 30; g++) {
    step(engine);
    reference.step();
  }
  assert.equal(engine.liveCells, reference.cells().length);
});

test('Design a seed in Explore takes the walls off, as no contest has them', () => {
  const strict = contestArena(walled(), 64, 'Methuselah');
  assert.equal(edgeOf(strict.setup), 'end');
  assert.match(strict.note, /^The 64³ arena in Game of Life 3D \(unbounded\) no longer has walls, as in Methuselah: /);
  const classic = contestArena(walled(), 64, 'Classic Methuselah', true);
  assert.equal(edgeOf(classic.setup), 'ships');
  assert.match(classic.note, /^The 64³ arena in Game of Life 3D \(unbounded\) no longer has walls, and ships leave at its edge, as in Classic Methuselah: /);
  // The walls' rules are kept for when Walls is chosen again
  assert.deepEqual(classic.setup.walls, DEFAULT_WALLS);
});

test('a saved generation carries on with the run ending at the edge; Use your own rules gives the walls back', async () => {
  const world = new World({ rules: SHIP.rules, chunkSize: 8, slabBytes: 1 << 20, arena: arenaBox(64) });
  world.setCells(SHIP.seed);
  while (world.generation < 20) step(world);
  const cfg = { rules: SHIP.rules, cells: Int32Array.from(SHIP.seed.flat()), arena: 64 };
  const { text } = await generationSave({ config: cfg, generation: 20, cells: world.cells(), ending: 'stopped' });
  const setup = changeSeed(walled(), simulationFile('saved.json', await readSeedOrSave(text)));
  assert.equal(edgeOf(setup), 'end');
  assert.equal(configOf(setup).walls, null);
  assert.equal(boxesOf(setup).walls, null);
  assert.deepEqual(wallsOf(ownRules(setup)), DEFAULT_WALLS);
});

test('Save this generation says why it refuses while the arena has walls, and that Save simulation still works', () => {
  assert.match(WALLS_SAVE_REASON, /^This run's arena has walls, with their own corner, edge and face rules, and a saved generation can't record them/);
  assert.match(WALLS_SAVE_REASON, /no contest has walls/);
  assert.match(WALLS_SAVE_REASON, /Save simulation still saves the seed and its rules/);
});
