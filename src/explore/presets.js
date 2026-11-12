// SPDX-License-Identifier: Apache-2.0
//
// Explore's preset seeds (#58): ready-made seeds, each with its own rules, offered in the
// settings beside the shapes and seed files. Choosing one works like loading a seed file: its
// cells and rules replace the shape and rules.
//
// Spreading noise is the Speed candidate 12345 from #39's search (scripts/bench/candidates.mjs).
// The lab never imports scripts/, so its cells are written out here; a test checks that they are
// still that candidate's. Nothing here touches the page, so the tests run it in Node.

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
 */

/** @type {Preset[]} */
export const PRESETS = [
  {
    id: 'cube10',
    name: 'Cube10',
    description: "The 10³ cube Explore opens on, under the lab's default rules: a dense mass that keeps swelling outward.",
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
];

/** @returns {Preset | undefined} */
export function presetById(id) {
  return PRESETS.find((preset) => preset.id === id);
}
