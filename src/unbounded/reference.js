// SPDX-License-Identifier: Apache-2.0
//
// The reference for the unbounded Game of Life 3D: a deliberately simple engine, written to be
// easy to trust rather than fast. It keeps the live cells in a Set of "x,y,z" strings and has no
// chunks, slabs or limits. The tests check the chunked engine (world.js, step.js) against it.
// Given a box to wrap in, it is a torus: each neighbour's coordinates are taken round the box.
// Given walls, it is closed: neighbours past the box's faces don't count, and a cell on one, two or
// three of its faces follows the face, edge or corner rule.

import { validateRules } from './rules.js';

export class ReferenceWorld {
  /**
   * @param {{birth: number[], survival: number[]}} rules
   * @param {Iterable<number[]>} [cells] - live cells, as [x, y, z]; inside `wrap`, if given
   * @param {{wrap?: {min: number[], max: number[]}, walls?: {box: {min: number[], max: number[]},
   *   corner: object, edge: object, face: object}}} [options] - wrap: the box, inclusive, whose
   *   opposite faces are neighbours; walls: the box, inclusive, closed by walls, and the rules on them
   */
  constructor(rules, cells = [], { wrap = null, walls = null } = {}) {
    const { birth, survival } = validateRules(rules);
    this.birth = new Set(birth);
    this.survival = new Set(survival);
    this.live = new Set();
    this.generation = 0;
    this.wrap = wrap;
    this.walls = walls;
    // The rules by how many of the walls' faces a cell lies on: 0 (inside), 1, 2 or 3
    this.rules = [{ birth: this.birth, survival: this.survival }];
    if (walls) {
      for (const kind of ['face', 'edge', 'corner']) {
        const { birth: b, survival: s } = validateRules(walls[kind]);
        this.rules.push({ birth: new Set(b), survival: new Set(s) });
      }
    }
    for (const [x, y, z] of cells) this.live.add(`${x},${y},${z}`);
  }

  /** The rule for a cell: by how many of the walls' faces it lies on, or the Rules. */
  ruleFor(x, y, z) {
    if (!this.walls) return this.rules[0];
    const { min, max } = this.walls.box;
    const faces = [x, y, z].filter((c, a) => c === min[a] || c === max[a]).length;
    return this.rules[faces];
  }

  /** Whether a cell lies past the walls, where nothing lives and nothing counts. */
  pastWalls(x, y, z) {
    if (!this.walls) return false;
    const { min, max } = this.walls.box;
    return [x, y, z].some((c, a) => c < min[a] || c > max[a]);
  }

  /** A coordinate on axis a, taken round the wrapping box if there is one. */
  round(c, a) {
    if (!this.wrap) return c;
    const { min, max } = this.wrap;
    const side = max[a] - min[a] + 1;
    return min[a] + ((((c - min[a]) % side) + side) % side);
  }

  /** Advances one generation. */
  step() {
    // How many live neighbours each cell next to a live cell has
    const counts = new Map();
    for (const key of this.live) {
      const [x, y, z] = key.split(',').map(Number);
      for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0 && dz === 0) continue;
            if (this.pastWalls(x + dx, y + dy, z + dz)) continue;
            const neighbour = `${this.round(x + dx, 0)},${this.round(y + dy, 1)},${this.round(z + dz, 2)}`;
            counts.set(neighbour, (counts.get(neighbour) ?? 0) + 1);
          }
        }
      }
    }

    const next = new Set();
    // A live cell with no live neighbour isn't in `counts`; it survives only under S0
    for (const key of this.live) {
      if (!counts.has(key) && this.ruleFor(...key.split(',').map(Number)).survival.has(0)) next.add(key);
    }
    for (const [key, count] of counts) {
      const { birth, survival } = this.ruleFor(...key.split(',').map(Number));
      const rule = this.live.has(key) ? survival : birth;
      if (rule.has(count)) next.add(key);
    }
    this.live = next;
    this.generation++;
  }

  /** @returns {number[][]} the live cells as [x, y, z], sorted by z, then y, then x */
  cells() {
    return sortCells([...this.live].map((key) => key.split(',').map(Number)));
  }
}

/** Sorts [x, y, z] cells by z, then y, then x, in place, and returns them. */
export function sortCells(cells) {
  return cells.sort((a, b) => a[2] - b[2] || a[1] - b[1] || a[0] - b[0]);
}
