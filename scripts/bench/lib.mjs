// SPDX-License-Identifier: Apache-2.0
//
// Shared by scripts/bench.mjs and its sections: timing, seeds, the rule list, and the tables the
// bench prints. Nothing here needs Node, so the memory page (src/unbounded/memory.html) can load
// the Speed candidates in the browser.

/** Milliseconds since an arbitrary start, with sub-millisecond resolution. */
export const now = () => performance.now();

/**
 * Times fn() until at least `minMs` have passed and it has run `minRuns` times, after one
 * warm-up run. @returns {number} the median time of one run, in milliseconds
 */
export function timeIt(fn, { minMs = 300, minRuns = 3 } = {}) {
  fn();
  const times = [];
  const started = now();
  while (times.length < minRuns || now() - started < minMs) {
    const t = now();
    fn();
    times.push(now() - t);
  }
  return median(times);
}

/** The async form of timeIt(). */
export async function timeItAsync(fn, { minMs = 300, minRuns = 3 } = {}) {
  await fn();
  const times = [];
  const started = now();
  while (times.length < minRuns || now() - started < minMs) {
    const t = now();
    await fn();
    times.push(now() - t);
  }
  return median(times);
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** A small repeatable random number generator (xorshift32): every machine measures the same seeds. */
export function repeatableRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/** Random live cells in a box, as [x, y, z] arrays. */
export function boxSeed({ min = [-5, -5, -5], size = [10, 10, 10], density = 0.5, randomSeed = 1 } = {}) {
  const random = repeatableRandom(randomSeed);
  const cells = [];
  for (let z = 0; z < size[2]; z++) {
    for (let y = 0; y < size[1]; y++) {
      for (let x = 0; x < size[0]; x++) {
        if (random() < density) cells.push([min[0] + x, min[1] + y, min[2] + z]);
      }
    }
  }
  return cells;
}

/**
 * The bench's two seeds. Dense: the 10³ seed box, half alive. Sparse: eight small clusters,
 * each 4³ and half alive, scattered through a box 400 cells wide, so most of the space between
 * them is empty and chunk size decides how much of it is computed.
 */
export const SEEDS = {
  dense: () => boxSeed({ density: 0.5, randomSeed: 1 }),
  sparse: () => {
    const random = repeatableRandom(2);
    const cells = [];
    for (let k = 0; k < 8; k++) {
      const min = [0, 1, 2].map(() => Math.floor(random() * 400) - 200);
      cells.push(...boxSeed({ min, size: [4, 4, 4], density: 0.5, randomSeed: 10 + k }));
    }
    return cells;
  },
};

/** Rule text, B…/S…, with runs of counts shortened: B9,10/S5-15. */
export function ruleText({ birth, survival }) {
  const list = (counts) => {
    const parts = [];
    for (let i = 0; i < counts.length; i++) {
      let j = i;
      while (j + 1 < counts.length && counts[j + 1] === counts[j] + 1) j++;
      parts.push(j - i >= 2 ? `${counts[i]}-${counts[j]}` : counts.slice(i, j + 1).join(','));
      i = j;
    }
    return parts.join(',');
  };
  return `B${list(birth)}/S${list(survival)}`;
}

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/**
 * The rules every section that loops over rules uses, named by where they come from: the lab's
 * starting rules, the tests' growing rule (test/unbounded/helpers.js), Speed candidate 4001's
 * rules, and a narrow rule. How each behaves depends on the seed; the tables show it.
 */
export const RULES = [
  { name: 'lab default', rules: { birth: [9, 10], survival: range(5, 15) } },
  { name: "tests' growing rule", rules: { birth: [5, 11, 12], survival: [0, 1, 4, 5, 10, 12, 13, 14] } },
  { name: 'candidate 4001', rules: { birth: [8, 11], survival: [3, 4, 5, 6, 7, 9, 11, 12, 13, 17, 18, 19, 20, 23, 24, 25, 26] } },
  { name: 'narrow', rules: { birth: [6, 7], survival: [5, 6, 7] } },
];

/**
 * A table: a title, column headings and rows. Printed aligned for the terminal, or as Markdown
 * for the pull request.
 */
export function printTable({ title, note, columns, rows }, { markdown = false } = {}) {
  const cells = rows.map((row) => row.map((value) => (value === null || value === undefined ? '' : String(value))));
  if (markdown) {
    console.log(`\n#### ${title}\n`);
    if (note) console.log(`${note}\n`);
    console.log(`| ${columns.join(' | ')} |`);
    console.log(`|${columns.map((_, i) => (i === 0 ? ' --- ' : ' ---: ')).join('|')}|`);
    for (const row of cells) console.log(`| ${row.join(' | ')} |`);
    return;
  }
  const widths = columns.map((c, i) => Math.max(c.length, ...cells.map((row) => row[i].length)));
  const line = (row) => row.map((value, i) => (i === 0 ? value.padEnd(widths[i]) : value.padStart(widths[i]))).join('  ');
  console.log(`\n${title}`);
  if (note) console.log(note);
  console.log(line(columns));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const row of cells) console.log(line(row));
}

/** Formatting for the tables. */
export const fmt = {
  ms: (ms) => (ms >= 100 ? ms.toFixed(0) : ms >= 10 ? ms.toFixed(1) : ms.toFixed(2)),
  int: (n) => Math.round(n).toLocaleString('en'),
  mb: (bytes) => (bytes / 2 ** 20).toFixed(bytes >= 10 * 2 ** 20 ? 0 : bytes >= 2 ** 20 ? 1 : 2),
  rate: (perSecond) => `${(perSecond / 1e6).toFixed(1)}M`,
  seconds: (ms) => (ms >= 600_000 ? `${(ms / 60_000).toFixed(1)} min` : `${(ms / 1000).toFixed(ms >= 10_000 ? 0 : 1)} s`),
};

/** The side of a world's live cells' bounding box, or 0 if none. */
export function sideOf(world) {
  const box = world.extent();
  return box ? Math.max(...box.max.map((hi, a) => hi - box.min[a] + 1)) : 0;
}
