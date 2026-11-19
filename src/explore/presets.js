// SPDX-License-Identifier: Apache-2.0
//
// Explore's preset seeds (#58): ready-made seeds, each with its own rules, offered in the
// settings beside the shapes and seed files. Choosing one works like loading a seed file: its
// cells and rules replace the shape and rules.
//
// Spreading noise is the Speed candidate 12345 from #39's search (scripts/bench/candidates.mjs).
// The lab never imports scripts/, so its cells are written out here; a test checks that they are
// still that candidate's. Nothing here touches the page, so the tests run it in Node.
//
// The ships (#105) are seeds found by a random search on 2026-11-19, while building Classic
// Methuselah's departure rule (#100): a few cells in a 3×3×3 box, centred in the seed box, that
// become a ship, a pattern that returns to its own shape moved. Each one's `ship` says when, with
// what period and shift; a test checks it on the engine. Speeds are in Life's unit, c: one cell
// per generation, which no pattern can beat.

import { validateRules } from '../unbounded/rules.js';

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** The 10³ cube in the seed box, cells -5 to 4 on each axis, all alive: what Explore opens on. */
function defaultCube() {
  const cells = new Int32Array(3 * 1000);
  let k = 0;
  for (let z = -5; z < 5; z++) {
    for (let y = -5; y < 5; y++) {
      for (let x = -5; x < 5; x++) {
        cells[k++] = x;
        cells[k++] = y;
        cells[k++] = z;
      }
    }
  }
  return cells;
}

// Spreading noise: 224 cells in the seed box, as x, y, z triples
const SPREADING_NOISE = Int32Array.from([
  -2, -5, -5,  3, -5, -5,  -2, -4, -5,  1, -4, -5,  -3, -3, -5,  -4, -2, -5,
  -2, -2, -5,  4, -2, -5,  -4, -1, -5,  1, 0, -5,  -5, 1, -5,  -4, 1, -5,
  -3, 1, -5,  -2, 1, -5,  -5, 3, -5,  -3, 3, -5,  -1, 3, -5,  -5, 4, -5,
  -3, 4, -5,  -2, 4, -5,  0, -5, -4,  3, -5, -4,  4, -5, -4,  -5, -4, -4,
  -2, -4, -4,  -1, -4, -4,  -2, -3, -4,  2, -3, -4,  3, -3, -4,  -4, -2, -4,
  -2, -2, -4,  2, -2, -4,  -4, -1, -4,  3, -1, -4,  -5, 0, -4,  -3, 0, -4,
  -1, 0, -4,  1, 0, -4,  3, 0, -4,  4, 0, -4,  3, 1, -4,  4, 1, -4,
  -5, 2, -4,  -3, 3, -4,  -2, 4, -4,  1, 4, -4,  2, 4, -4,  -1, -5, -3,
  1, -5, -3,  1, -4, -3,  -1, -3, -3,  0, -3, -3,  -1, -1, -3,  2, -1, -3,
  3, -1, -3,  4, -1, -3,  -5, 0, -3,  -3, 0, -3,  -2, 0, -3,  2, 0, -3,
  -3, 1, -3,  0, 1, -3,  -3, 2, -3,  2, 2, -3,  -1, 3, -3,  3, 4, -3,
  -2, -5, -2,  -2, -4, -2,  4, -4, -2,  -2, -2, -2,  1, -2, -2,  -5, -1, -2,
  -2, -1, -2,  2, -1, -2,  1, 0, -2,  3, 0, -2,  -2, 1, -2,  -1, 1, -2,
  0, 1, -2,  1, 1, -2,  -4, 2, -2,  -3, 2, -2,  0, 2, -2,  1, 2, -2,
  2, 2, -2,  2, 3, -2,  -3, 4, -2,  0, 4, -2,  1, 4, -2,  3, 4, -2,
  4, -5, -1,  -3, -4, -1,  0, -4, -1,  -2, -3, -1,  -4, -2, -1,  0, -2, -1,
  4, -2, -1,  -1, -1, -1,  0, -1, -1,  1, -1, -1,  -2, 0, -1,  2, 0, -1,
  0, 2, -1,  1, 2, -1,  -4, 4, -1,  2, 4, -1,  -5, -5, 0,  -1, -3, 0,
  0, -3, 0,  -5, -2, 0,  -3, -2, 0,  2, -2, 0,  3, -2, 0,  4, -2, 0,
  -4, -1, 0,  1, -1, 0,  -2, 0, 0,  4, 0, 0,  -5, 1, 0,  -4, 1, 0,
  -3, 1, 0,  1, 1, 0,  3, 1, 0,  -4, 2, 0,  1, 2, 0,  -3, 3, 0,
  -2, 3, 0,  -1, 3, 0,  1, 3, 0,  -2, 4, 0,  1, 4, 0,  2, 4, 0,
  -5, -5, 1,  -4, -5, 1,  -2, -5, 1,  -4, -4, 1,  -3, -4, 1,  4, -4, 1,
  -3, -3, 1,  -1, -3, 1,  1, -3, 1,  -1, -2, 1,  2, -2, 1,  0, 0, 1,
  -2, 1, 1,  2, 1, 1,  -3, 2, 1,  1, 2, 1,  2, 2, 1,  3, 2, 1,
  1, 3, 1,  3, 3, 1,  -3, 4, 1,  2, 4, 1,  4, 4, 1,  -2, -5, 2,
  1, -5, 2,  -5, -4, 2,  0, -4, 2,  0, -3, 2,  2, -3, 2,  0, -1, 2,
  1, 0, 2,  4, 0, 2,  1, 1, 2,  2, 1, 2,  3, 2, 2,  -2, 3, 2,
  -3, 4, 2,  -2, 4, 2,  0, 4, 2,  4, 4, 2,  -5, -5, 3,  -1, -5, 3,
  -5, -4, 3,  -3, -4, 3,  -2, -4, 3,  -3, -3, 3,  -2, -3, 3,  -1, -3, 3,
  4, -3, 3,  -1, -2, 3,  -4, -1, 3,  -3, -1, 3,  -1, -1, 3,  1, -1, 3,
  -4, 0, 3,  -3, 0, 3,  1, 0, 3,  2, 0, 3,  -5, 1, 3,  -1, 1, 3,
  0, 3, 3,  1, 3, 3,  2, 3, 3,  3, 3, 3,  0, 4, 3,  2, -5, 4,
  -2, -4, 4,  -4, -3, 4,  3, -3, 4,  -3, -2, 4,  0, -2, 4,  2, -2, 4,
  -5, -1, 4,  2, -1, 4,  3, -1, 4,  4, -1, 4,  -3, 0, 4,  0, 0, 4,
  2, 0, 4,  0, 1, 4,  2, 1, 4,  -2, 3, 4,  0, 3, 4,  2, 3, 4,
  -5, 4, 4,  -4, 4, 4,  -3, 4, 4,  -2, 4, 4,  -1, 4, 4,  0, 4, 4,
  2, 4, 4,  3, 4, 4,
]);

/**
 * @typedef {object} Preset
 * @property {string} id - stable, for remembering the choice
 * @property {string} name - as the settings show it
 * @property {string} description - one line, for its tooltip
 * @property {{birth: number[], survival: number[]}} rules
 * @property {Int32Array} cells - x, y, z triples. Shared: copy before changing.
 * @property {'ships'} [group] - the Preset list's group; none for the first presets
 * @property {{from: number, period: number, shift: number[]}} [ship] - a ship preset: the
 *   generation its whole pattern is first a ship, its period and its shift over one period
 */

/** A ship's seed, found in cells 0 to 2, centred in the seed box: cells -1 to 1. */
const shipSeed = (cells) => Int32Array.from(cells.flatMap(([x, y, z]) => [x - 1, y - 1, z - 1]));

/** The ships: straight ones by period, then speed; then the diagonal ones by period. */
const SHIPS = [
  {
    id: 'ship-p1',
    name: 'Ship: period 1, c',
    description: '17 cells that shed to an 8-cell ship by generation 24, then fly along +x one cell a generation, the fastest any pattern can go.',
    rules: { birth: [4], survival: [6] },
    seed: [[1, 0, 0], [0, 1, 0], [2, 1, 0], [0, 0, 1], [2, 0, 1], [0, 1, 1], [2, 1, 1], [0, 2, 1], [1, 2, 1], [0, 0, 2],
      [2, 0, 2], [0, 1, 2], [1, 1, 2], [2, 1, 2], [0, 2, 2], [1, 2, 2], [2, 2, 2]],
    ship: { from: 24, period: 1, shift: [1, 0, 0] },
  },
  {
    id: 'ship-p2-c',
    name: 'Ship: period 2, c',
    description: 'A ship by generation 10: 2 cells along +x every 2 generations, wobbling up and down in z as it goes.',
    rules: { birth: [4], survival: [7] },
    seed: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [2, 0, 1], [1, 1, 1], [0, 2, 1], [2, 2, 1], [0, 0, 2], [2, 0, 2], [1, 1, 2]],
    ship: { from: 10, period: 2, shift: [2, 0, 0] },
  },
  {
    id: 'ship-p2-c2',
    name: 'Ship: period 2, c/2',
    description: 'A ship by generation 3: one cell along -y every 2 generations, wobbling in x and z.',
    rules: { birth: [5, 6], survival: [1, 4, 9] },
    seed: [[1, 0, 0], [2, 0, 0], [1, 1, 0], [2, 1, 0], [0, 2, 0], [1, 2, 0], [2, 2, 0], [0, 0, 1], [2, 0, 1], [0, 1, 1], [1, 2, 1],
      [0, 0, 2], [1, 0, 2], [2, 0, 2], [0, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2]],
    ship: { from: 3, period: 2, shift: [0, -1, 0] },
  },
  {
    id: 'ship-p3',
    name: 'Ship: period 3, c',
    description: 'A ship by generation 19: 3 cells along +y every 3 generations.',
    rules: { birth: [4], survival: [7, 8, 11] },
    seed: [[2, 0, 0], [1, 1, 0], [2, 1, 0], [0, 2, 0], [2, 2, 0], [0, 1, 1], [1, 1, 1], [0, 2, 1], [2, 2, 1], [0, 0, 2], [2, 0, 2], [2, 1, 2], [1, 2, 2]],
    ship: { from: 19, period: 3, shift: [0, 3, 0] },
  },
  {
    id: 'ship-p4',
    name: 'Ship: period 4, c',
    description: 'A ship by generation 22: 4 cells down, along -z, every 4 generations, 17 and 13 cells by turns.',
    rules: { birth: [4], survival: [] },
    seed: [[1, 0, 0], [2, 0, 0], [1, 1, 0], [2, 1, 0], [0, 0, 1], [2, 0, 1], [2, 1, 1], [0, 2, 1], [2, 2, 1], [0, 0, 2], [0, 1, 2],
      [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2]],
    ship: { from: 22, period: 4, shift: [0, 0, -4] },
  },
  {
    id: 'ship-p6',
    name: 'Ship: period 6, c',
    description: 'A ship by generation 3: 6 cells along +x every 6 generations, between 8 and 11 cells on the way.',
    rules: { birth: [4], survival: [] },
    seed: [[1, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [2, 2, 0], [0, 0, 1], [2, 1, 1], [0, 2, 1], [1, 2, 1], [2, 2, 1], [1, 0, 2], [0, 1, 2], [1, 1, 2]],
    ship: { from: 3, period: 6, shift: [6, 0, 0] },
  },
  {
    id: 'ship-p12',
    name: 'Ship: period 12, c/6',
    description: 'A ship by generation 6: only 2 cells along +y every 12 generations, wobbling in x and z on the way.',
    rules: { birth: [4], survival: [1, 5] },
    seed: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 2, 0], [1, 0, 1], [1, 1, 1], [2, 1, 1], [2, 2, 1], [0, 0, 2], [1, 0, 2], [2, 0, 2], [1, 1, 2], [1, 2, 2]],
    ship: { from: 6, period: 12, shift: [0, 2, 0] },
  },
  {
    id: 'diagonal-p4',
    name: 'Diagonal ship: period 4, c/4',
    description: 'A ship by generation 36: one cell along +x and one along -y every 4 generations.',
    rules: { birth: [6, 7], survival: [2, 4, 5, 7, 10] },
    seed: [[0, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [0, 2, 0], [1, 2, 0], [2, 2, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [2, 1, 1],
      [0, 2, 1], [1, 2, 1], [0, 0, 2], [2, 0, 2], [0, 1, 2], [2, 1, 2], [0, 2, 2], [1, 2, 2], [2, 2, 2]],
    ship: { from: 36, period: 4, shift: [1, -1, 0] },
  },
  {
    id: 'diagonal-p6',
    name: 'Diagonal ship: period 6, c/6',
    description: 'A ship by generation 2: one cell along -x and one along -y every 6 generations.',
    rules: { birth: [5, 6], survival: [5, 7, 10, 12] },
    seed: [[2, 0, 0], [0, 2, 0], [1, 2, 0], [2, 0, 1], [2, 1, 1], [0, 2, 1], [1, 2, 1], [2, 2, 1], [0, 2, 2], [2, 2, 2]],
    ship: { from: 2, period: 6, shift: [-1, -1, 0] },
  },
].map(({ seed, rules, ...preset }) => ({ ...preset, rules: validateRules(rules), cells: shipSeed(seed), group: 'ships' }));

/** @type {Preset[]} */
export const PRESETS = [
  {
    id: 'cube10',
    name: 'Cube10',
    description: "The 10³ cube the lab opens on, under its default rules: a dense mass that keeps swelling outward.",
    rules: validateRules({ birth: [9, 10], survival: range(5, 15) }),
    cells: defaultCube(),
  },
  {
    id: 'spreading-noise',
    name: 'Spreading noise',
    description: '224 cells that look like chaotic noise, yet keep spreading outward.',
    rules: validateRules({ birth: [7, 13, 14], survival: [0, 2, 3, 4, 5, 6, 9, 13, 19, 23, 24] }),
    cells: SPREADING_NOISE,
  },
  ...SHIPS,
];

/** The Preset list's groups, in order, with their labels. */
export const PRESET_GROUPS = [{ id: 'ships', label: 'Ships' }];

/** @returns {Preset | undefined} */
export function presetById(id) {
  return PRESETS.find((preset) => preset.id === id);
}
