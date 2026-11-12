// SPDX-License-Identifier: Apache-2.0
//
// The worst case for replaying a Discovery entry: the most work this engine can be given in an
// arena, for the whole generation budget.
//
// A replay's cost is the chunks the engine computes each generation, and barely depends on how
// many of their cells are alive. The most it ever computes in an arena is every chunk the arena
// covers, plus every chunk just outside it that a live border cell makes it visit. So:
//
// - Rules: births at 10 to 26 neighbours only, survival at 0 to 26. A cell just outside a flat
//   wall has at most 9 neighbours inside it, so nothing is ever born outside the arena, and
//   nothing ever dies. The run lasts its whole budget.
// - Seed: in every chunk the arena covers, the corners of the part inside the arena, which touch
//   every neighbouring chunk the engine could visit; then random cells, as many as a result file
//   under 1 MB has room for.
//
// Writing a result file means running it to the end, to know the final hash:
//
//   node scripts/bench/worst-case.mjs [--arena 64] [--generations 10000] [--chunk 16] --out <file>
//
// Then `node scripts/verify.mjs <file>` times the replay a maintainer would do.

import { writeFile } from 'node:fs/promises';
import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { normaliseRun, resultOf, resultText, worldOptions, MAX_RESULT_BYTES } from '../../src/unbounded/canonical.js';
import { repeatableRandom, fmt, now } from './lib.mjs';

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

export const WORST_RULES = { birth: range(10, 26), survival: range(0, 26) };

/** A centred box of side n: cells -⌊n/2⌋ to -⌊n/2⌋ + n - 1 on each axis. */
export function centredBox(n) {
  const lo = -Math.floor(n / 2);
  return { min: [lo, lo, lo], max: [lo + n - 1, lo + n - 1, lo + n - 1] };
}

/** The cells that keep every chunk of the arena, and every chunk the engine visits around it, busy. */
export function cornerCells(arena, chunkSize) {
  const cells = new Map();
  const lo = arena.min[0], hi = arena.max[0];
  const first = Math.floor(lo / chunkSize), last = Math.floor(hi / chunkSize);
  // Along one axis: for each chunk, the lowest and highest arena cells in it
  const ends = [];
  for (let c = first; c <= last; c++) {
    const a = Math.max(lo, c * chunkSize), b = Math.min(hi, c * chunkSize + chunkSize - 1);
    ends.push(a === b ? [a] : [a, b]);
  }
  for (const zs of ends) {
    for (const ys of ends) {
      for (const xs of ends) {
        for (const z of zs) for (const y of ys) for (const x of xs) cells.set(`${x},${y},${z}`, [x, y, z]);
      }
    }
  }
  return [...cells.values()];
}

/**
 * The worst-case run for an arena and budget, as a run definition: no contest, so it is a valid
 * result file without being a Discovery entry.
 * @param {object} options
 * @param {number} options.arena - the arena's side
 * @param {number} options.generations - the budget
 * @param {number} [options.chunkSize]
 * @param {number} [options.fill] - extra random cells; by default as many as fit under 1 MB
 */
export function worstCaseRun({ arena: side, generations, chunkSize = 16, fill }) {
  const arena = centredBox(side);
  const seed = cornerCells(arena, chunkSize);
  const taken = new Set(seed.map((c) => c.join()));
  // A seed cell takes about 22 bytes in the file ("      [-32, -32, -32],"); keep a margin
  const room = Math.floor((MAX_RESULT_BYTES - 64 * 1024) / 23) - seed.length;
  const extra = Math.min(fill ?? room, room, side ** 3 - seed.length);
  const random = repeatableRandom(39);
  const target = seed.length + extra;
  while (seed.length < target) {
    const cell = [0, 1, 2].map((a) => arena.min[a] + Math.floor(random() * side));
    const key = cell.join();
    if (!taken.has(key)) {
      taken.add(key);
      seed.push(cell);
    }
  }
  return normaliseRun({
    contest: null,
    rules: WORST_RULES,
    seed,
    arena,
    limits: { cells: null, extent: null, generations },
  });
}

/**
 * The same arena with every cell alive, which no result file can hold: the issue's "every cell
 * of the arena active for the whole budget", to compare the file's worst case with.
 */
export function fullArenaWorld({ arena: side, chunkSize = 16, fingerprint = false }) {
  const arena = centredBox(side);
  const world = new World({ rules: WORST_RULES, arena, chunkSize, fingerprint });
  const cells = [];
  for (let z = arena.min[2]; z <= arena.max[2]; z++) {
    for (let y = arena.min[1]; y <= arena.max[1]; y++) {
      for (let x = arena.min[0]; x <= arena.max[0]; x++) cells.push([x, y, z]);
    }
  }
  world.setCells(cells);
  return world;
}

async function main() {
  const args = process.argv.slice(2);
  const options = { arena: 64, generations: 10_000, chunkSize: 16, out: null };
  const names = { '--arena': 'arena', '--generations': 'generations', '--chunk': 'chunkSize', '--out': 'out' };
  for (let i = 0; i < args.length; i += 2) {
    const name = names[args[i]];
    if (!name || args[i + 1] === undefined) {
      console.error('Usage: node scripts/bench/worst-case.mjs [--arena 64] [--generations 10000] [--chunk 16] --out <file>');
      process.exit(2);
    }
    options[name] = name === 'out' ? args[i + 1] : Number(args[i + 1]);
  }
  if (!options.out) {
    console.error('Give --out <file>.');
    process.exit(2);
  }
  const run = worstCaseRun(options);
  const world = new World(worldOptions(run, { chunkSize: options.chunkSize }));
  world.setCells(run.seed);
  console.error(`Arena ${options.arena}³, seed of ${run.seed.length.toLocaleString('en')} cells, ${world.chunkCount} chunks; running ${options.generations.toLocaleString('en')} generations...`);
  const started = now();
  let reported = started;
  while (world.generation < options.generations) {
    const ended = step(world);
    if (ended) throw new Error(`The worst case ended early, at generation ${world.generation}: ${ended}`);
    if (now() - reported > 5000) {
      reported = now();
      console.error(`  generation ${world.generation}, ${world.liveCells.toLocaleString('en')} live, ${world.chunkCount} chunks`);
    }
  }
  const elapsed = now() - started;
  const result = await resultOf(world, { run, ending: 'generation-limit', details: { chunkSize: options.chunkSize, elapsedMs: Math.round(elapsed) } });
  const text = resultText(result);
  await writeFile(options.out, text);
  console.log(`Wrote ${options.out} (${fmt.mb(text.length)} MB): ${options.generations.toLocaleString('en')} generations in ${fmt.seconds(elapsed)}, ${world.liveCells.toLocaleString('en')} live cells at the end.`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
