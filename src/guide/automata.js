// SPDX-License-Identifier: Apache-2.0
//
// The small automata the guide's animations run (#159), written fresh for the lab. Each is the
// rule the guide's words describe, so what a visitor watches is the real thing, not a drawing of
// it. No DOM: the tests run them in Node and check them against known facts.

/** A small, seeded random generator (mulberry32), so a scene plays the same way each time. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Elementary cellular automata (one row, Wolfram's numbering) ----

/**
 * What an elementary rule gives each of the eight neighbourhoods, from 111 down to 000, as the
 * guide's rule strip draws them.
 * @param {number} rule - 0 to 255
 * @returns {{left: number, centre: number, right: number, next: number}[]}
 */
export function ruleCases(rule) {
  const cases = [];
  for (let pattern = 7; pattern >= 0; pattern--) {
    cases.push({ left: (pattern >> 2) & 1, centre: (pattern >> 1) & 1, right: pattern & 1, next: (rule >> pattern) & 1 });
  }
  return cases;
}

/**
 * One generation of an elementary cellular automaton. Cells past either end count as dead.
 * @param {Uint8Array} row
 * @param {number} rule - 0 to 255
 * @returns {Uint8Array}
 */
export function elementaryStep(row, rule) {
  const next = new Uint8Array(row.length);
  for (let i = 0; i < row.length; i++) {
    const pattern = ((row[i - 1] ?? 0) << 2) | (row[i] << 1) | (row[i + 1] ?? 0);
    next[i] = (rule >> pattern) & 1;
  }
  return next;
}

// ---- Life on an unbounded plane ----

const key = (x, y) => `${x},${y}`;

/**
 * Conway's Life, or another B/S rule on the plane, stored as a set of live cells, so a pattern
 * can grow as far as it likes. Small patterns only: the guide's are under a few hundred cells.
 */
export class Life {
  /**
   * @param {[number, number][]} cells
   * @param {{birth: number[], survival: number[]}} [rules] - Conway's B3/S23 by default
   */
  constructor(cells = [], rules = { birth: [3], survival: [2, 3] }) {
    this.birth = new Set(rules.birth);
    this.survival = new Set(rules.survival);
    this.live = new Map();
    for (const [x, y] of cells) this.live.set(key(x, y), [x, y]);
    this.generation = 0;
  }

  get population() {
    return this.live.size;
  }

  has(x, y) {
    return this.live.has(key(x, y));
  }

  /** @returns {[number, number][]} */
  cells() {
    return [...this.live.values()];
  }

  /** How many of the eight cells around (x, y) are alive. */
  neighbours(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if ((dx || dy) && this.live.has(key(x + dx, y + dy))) count++;
      }
    }
    return count;
  }

  step() {
    const counts = new Map();
    for (const [x, y] of this.live.values()) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const k = key(x + dx, y + dy);
          const entry = counts.get(k);
          if (entry) entry[2]++;
          else counts.set(k, [x + dx, y + dy, 1]);
        }
      }
    }
    const next = new Map();
    for (const [k, [x, y, n]] of counts) {
      if (this.live.has(k) ? this.survival.has(n) : this.birth.has(n)) next.set(k, [x, y]);
    }
    if (this.survival.has(0)) {
      for (const [k, cell] of this.live) if (!counts.has(k)) next.set(k, cell);
    }
    this.live = next;
    this.generation++;
  }

  /** Removes every cell outside the box, inclusive: gliders that have flown off the picture. */
  clip(minX, minY, maxX, maxY) {
    for (const [k, [x, y]] of this.live) {
      if (x < minX || x > maxX || y < minY || y > maxY) this.live.delete(k);
    }
  }

  /** @returns {{minX: number, minY: number, maxX: number, maxY: number} | null} */
  bounds() {
    if (!this.live.size) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [x, y] of this.live.values()) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    return { minX, minY, maxX, maxY };
  }
}

/**
 * One generation of Conway's Life on a small torus, whose opposite edges meet: the guide's
 * opening grid, where nothing can wander out of the picture.
 * @param {Uint8Array} grid - w × h, row by row
 * @returns {Uint8Array}
 */
export function torusLifeStep(grid, w, h) {
  const next = new Uint8Array(grid.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n = torusNeighbours(grid, w, h, x, y);
      const alive = grid[y * w + x];
      next[y * w + x] = n === 3 || (alive && n === 2) ? 1 : 0;
    }
  }
  return next;
}

/** How many of the eight cells around (x, y) are alive, on a torus. */
export function torusNeighbours(grid, w, h, x, y) {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx || dy) n += grid[((y + dy + h) % h) * w + ((x + dx + w) % w)];
    }
  }
  return n;
}

/**
 * Reads a pattern in run-length encoding, the format Life's pattern collections use:
 * `b` a dead cell, `o` a live one, `$` the end of a row, `!` the end, each with an optional count.
 * @param {string} rle - the pattern, without its `x = …` header
 * @returns {[number, number][]}
 */
export function parseRle(rle) {
  const cells = [];
  let x = 0, y = 0, count = '';
  for (const ch of rle.replace(/\s+/g, '')) {
    if (ch >= '0' && ch <= '9') {
      count += ch;
      continue;
    }
    const n = count ? Number(count) : 1;
    count = '';
    if (ch === 'b') x += n;
    else if (ch === 'o') {
      for (let i = 0; i < n; i++) cells.push([x + i, y]);
      x += n;
    } else if (ch === '$') {
      y += n;
      x = 0;
    } else if (ch === '!') break;
    else throw new Error(`Unexpected "${ch}" in a pattern.`);
  }
  return cells;
}

/** The patterns the guide shows, in run-length encoding. */
export const PATTERNS = {
  block: '2o$2o!',
  blinker: '3o!',
  glider: 'bo$2bo$3o!',
  rPentomino: 'b2o$2o$bo!',
  // Bill Gosper's glider gun (1970), which fires a glider every 30 generations
  gosperGun: `24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$
    10bo5bo7bo$11bo3bo$12b2o!`,
};

// ---- Life in three dimensions ----

/** The lab's default rule, B9,10/S5–15: born with 9 or 10 live neighbours of 26, survives with 5 to 15. */
export const LAB_RULE = { birth: [9, 10], survival: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] };

/**
 * The lab's rule at work, as step 6 shows it: a cell, alive or not, and its live neighbours among
 * the 26 around it (offsets from the cell, in every layer), with what happens to it. A test
 * checks each against the rule.
 */
export const CASES_3D = [
  { alive: 1, live: [[-1, 1, -1], [0, 1, 1], [1, 1, 0], [-1, 0, 1], [1, 0, -1], [0, -1, -1], [-1, -1, 0], [1, -1, 1]], text: '8 live neighbours of 26: it survives' },
  { alive: 0, live: [[-1, 1, 0], [0, 1, -1], [1, 1, 1], [-1, 0, -1], [1, 0, 1], [0, 0, -1], [-1, -1, 1], [0, -1, 0], [1, -1, -1]], text: '9 live neighbours: a cell is born' },
  { alive: 1, live: [[1, 1, -1], [-1, 0, 1], [0, -1, 1], [1, -1, 0]], text: '4 live neighbours: it dies of loneliness' },
  {
    alive: 1,
    live: [[-1, -1, 0], [-1, -1, 1], [-1, 0, -1], [-1, 0, 1], [-1, 1, -1], [-1, 1, 0], [0, -1, -1], [0, -1, 1], [0, 0, -1], [0, 1, -1], [0, 1, 1], [1, -1, -1], [1, -1, 0], [1, 0, 0], [1, 0, 1], [1, 1, -1], [1, 1, 0]],
    text: '17 live neighbours: it dies of overcrowding',
  },
];

// ---- The HPP lattice gas (Hardy, Pomeau and de Pazzis, 1973) ----

/** A cell's four particles, one bit each, by the way it is moving. */
export const EAST = 1, NORTH = 2, WEST = 4, SOUTH = 8;

/**
 * One generation of the HPP gas in a box with reflecting walls: particles that meet head-on, and
 * only those, leave at right angles; then every particle moves one cell, and one that would leave
 * the box turns back. Particles and momentum are conserved.
 * @param {Uint8Array} cells - width × height, row by row, north at row 0
 * @returns {Uint8Array}
 */
export function hppStep(cells, width, height) {
  const collided = new Uint8Array(cells.length);
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    collided[i] = c === (EAST | WEST) ? NORTH | SOUTH : c === (NORTH | SOUTH) ? EAST | WEST : c;
  }
  const next = new Uint8Array(cells.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const c = collided[y * width + x];
      if (!c) continue;
      if (c & EAST) next[x + 1 < width ? y * width + x + 1 : y * width + x] |= x + 1 < width ? EAST : WEST;
      if (c & WEST) next[x > 0 ? y * width + x - 1 : y * width + x] |= x > 0 ? WEST : EAST;
      if (c & NORTH) next[y > 0 ? (y - 1) * width + x : y * width + x] |= y > 0 ? NORTH : SOUTH;
      if (c & SOUTH) next[y + 1 < height ? (y + 1) * width + x : y * width + x] |= y + 1 < height ? SOUTH : NORTH;
    }
  }
  return next;
}

/** @returns {number} how many particles a cell holds */
export function particles(c) {
  return (c & 1) + ((c >> 1) & 1) + ((c >> 2) & 1) + ((c >> 3) & 1);
}

// ---- Traffic (Nagel and Schreckenberg, 1992) ----

/**
 * One time step of the Nagel–Schreckenberg model on a ring road: every car speeds up by one, up
 * to the limit; slows to the gap ahead; slows by one more at random, with probability `p`; then
 * moves. Cars never pass or collide.
 * @param {{position: number, speed: number}[]} cars - in order around the ring
 * @param {number} length - the ring's cells
 * @param {{vmax: number, p: number, random: () => number}} options
 */
export function trafficStep(cars, length, { vmax, p, random }) {
  const n = cars.length;
  const speeds = cars.map((car, i) => {
    const ahead = cars[(i + 1) % n];
    const gap = (ahead.position - car.position - 1 + length) % length;
    let v = Math.min(car.speed + 1, vmax);
    v = Math.min(v, n === 1 ? v : gap);
    if (v > 0 && random() < p) v--;
    return v;
  });
  return cars.map((car, i) => ({ position: (car.position + speeds[i]) % length, speed: speeds[i] }));
}

/** @returns {{position: number, speed: number}[]} `count` cars spread at random around the ring */
export function placeCars(count, length, random) {
  const spots = Array.from({ length }, (_, i) => i);
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [spots[i], spots[j]] = [spots[j], spots[i]];
  }
  return spots.slice(0, count).sort((a, b) => a - b).map((position) => ({ position, speed: 0 }));
}

// ---- The sandpile (Bak, Tang and Wiesenfeld, 1987) ----

/**
 * The Abelian sandpile on a square grid whose edges are open: a cell holding four grains or more
 * topples, giving one to each of its four neighbours, and grains that fall off the edge are lost.
 */
export class Sandpile {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grains = new Uint8Array(width * height);
    this.lost = 0;
  }

  /** Drops one grain on (x, y) and topples until stable. @returns {number} the avalanche's topplings */
  drop(x, y) {
    this.grains[y * this.width + x]++;
    return this.relax();
  }

  relax() {
    const { width, height, grains } = this;
    let topplings = 0;
    const queue = [];
    for (let i = 0; i < grains.length; i++) if (grains[i] >= 4) queue.push(i);
    while (queue.length) {
      const i = queue.pop();
      if (grains[i] < 4) continue;
      grains[i] -= 4;
      topplings++;
      if (grains[i] >= 4) queue.push(i);
      const x = i % width, y = (i - x) / width;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          this.lost++;
          continue;
        }
        const j = ny * width + nx;
        if (++grains[j] === 4) queue.push(j);
      }
    }
    return topplings;
  }

  get total() {
    let sum = 0;
    for (const g of this.grains) sum += g;
    return sum;
  }
}

// ---- Scales on a hexagonal grid: an illustration ----

/** The six neighbours of a hexagon, in offset rows where odd rows sit half a cell to the right. */
export function hexNeighbours(x, y, width, height) {
  const odd = y & 1;
  const around = [[-1, 0], [1, 0], [odd - 1, -1], [odd, -1], [odd - 1, 1], [odd, 1]];
  const out = [];
  for (const [dx, dy] of around) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < width && ny < height) out.push(ny * width + nx);
  }
  return out;
}

/**
 * One step of the guide's scale illustration, NOT the rule Manukyan et al. fitted to the lizard:
 * a scale that shares its colour with more than half its neighbours tends to switch, so the
 * colours break into the short chains the lizard's skin shows.
 * @param {Uint8Array} scales - 0 green, 1 black
 * @returns {Uint8Array}
 */
export function scalesStep(scales, width, height, random, flip = 0.25) {
  const next = scales.slice();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const around = hexNeighbours(x, y, width, height);
      const same = around.reduce((n, j) => n + (scales[j] === scales[i]), 0);
      if (same * 2 > around.length && random() < flip) next[i] = 1 - scales[i];
    }
  }
  return next;
}
