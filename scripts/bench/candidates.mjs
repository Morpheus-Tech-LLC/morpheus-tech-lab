// SPDX-License-Identifier: Apache-2.0
//
// Candidates for the Speed contest's seed and rules. Each one is rebuilt from a single number, so
// the bench, the search below and any other machine all mean the same pattern by it: the number
// seeds a repeatable random sequence that picks the rules (births from 4 to 14, survival from 0
// to 26), a density, and the seed's cells inside the 10³ seed box (cells -5 to 4 on each axis).
// That keeps every seed within Speed's 1,000-cell limit.
//
// Searching, to find more:
//
//   node scripts/bench/candidates.mjs [--from N] [--count N] [--seconds S]
//
// steps each candidate for S seconds (1.5 by default) and prints those still alive at the end that
// have grown past the seed box but stayed sparse. The bench's Speed section then times the
// shortlist below properly. To check one up to a generation ceiling, write its run's definition
// and make its reference table, which ends by saying how many cells are alive at the last
// generation:
//
//   node scripts/bench/candidates.mjs --run <id | cube> > speed-run.json
//   node scripts/reference-hashes.mjs speed-run.json --to <ceiling> --out speed-table.txt

import { World } from '../../src/unbounded/world.js';
import { step } from '../../src/unbounded/step.js';
import { canonicalJson, normaliseRun } from '../../src/unbounded/canonical.js';
import { repeatableRandom, ruleText, sideOf } from './lib.mjs';

/**
 * The shortlist: first 'cube', what Explore opens on (the 10³ cube filling the seed box, all
 * 1,000 cells alive, under the lab's default rules, B9,10/S5-15), the maintainer's choice for
 * Speed. Then numbered candidates from a search of 0 to 14,999. Each one is still growing after
 * 48 seconds' running, at much the same rate in every direction, while staying sparse. No
 * candidate in that search stayed within a bounded box without settling: those that stopped
 * growing became still lifes or short cycles within a hundred generations, which would time the
 * engine's overhead, not its work.
 */
export const SHORTLIST = ['cube', 175, 4001, 5003, 12345, 13724];

/** Names for the candidates worth a name, as Explore's presets will call them. */
export const NAMES = { cube: 'Default cube', 12345: 'Spreading noise' };

/** A candidate's label: its id, and its name if it has one. */
export const labelOf = (id) => (NAMES[id] ? `${id} (${NAMES[id]})` : String(id));

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/**
 * @param {number | 'cube'} id
 * @returns {{id: number | 'cube', rules: {birth: number[], survival: number[]}, seed: number[][]}}
 */
export function candidate(id) {
  if (id === 'cube') {
    const seed = [];
    for (let z = -5; z < 5; z++) {
      for (let y = -5; y < 5; y++) {
        for (let x = -5; x < 5; x++) seed.push([x, y, z]);
      }
    }
    return { id, rules: { birth: [9, 10], survival: range(5, 15) }, seed };
  }
  const random = repeatableRandom(0x9e3779b1 ^ Math.imul(id, 2654435761));
  for (let k = 0; k < 5; k++) random();
  const pick = (lo, hi, p) => {
    const counts = [];
    for (let k = lo; k <= hi; k++) if (random() < p) counts.push(k);
    return counts;
  };
  let birth = pick(4, 14, 0.22);
  if (!birth.length) birth = [4 + Math.floor(random() * 11)];
  const survival = pick(0, 26, 0.3);
  const density = 0.2 + 0.4 * random();
  const seed = [];
  for (let z = -5; z < 5; z++) {
    for (let y = -5; y < 5; y++) {
      for (let x = -5; x < 5; x++) if (random() < density) seed.push([x, y, z]);
    }
  }
  return { id, rules: { birth, survival }, seed };
}

/** A candidate's run, as Speed would define it: no arena, no pattern limits. */
export function candidateRun(id) {
  const { rules, seed } = candidate(id);
  return normaliseRun({ contest: null, rules, seed, arena: null, limits: { cells: null, extent: null, generations: null } });
}

async function search({ from = 0, count = 1000, seconds = 1.5 }) {
  console.log(`Candidates ${from} to ${from + count - 1}, ${seconds} s each: those alive, past the seed box and sparse.`);
  for (let id = from; id < from + count; id++) {
    const { rules, seed } = candidate(id);
    const world = new World({ rules, chunkSize: 16 });
    world.setCells(seed);
    const started = performance.now();
    let ended = null;
    while (performance.now() - started < seconds * 1000) {
      ended = step(world);
      if (ended || world.liveCells === 0 || world.liveCells > 200_000) break;
    }
    const side = sideOf(world);
    if (ended || world.liveCells === 0 || world.liveCells > 60_000 || world.generation < 300 || side <= 12) continue;
    console.log(`${id}  ${ruleText(rules)}  seed ${seed.length} cells: generation ${world.generation}, ${world.liveCells} live, ${side} wide`);
  }
}

const USAGE = 'Usage: node scripts/bench/candidates.mjs [--from N] [--count N] [--seconds S] | --run <id | cube>';

// Run as a script (in Node), not imported (by the bench, or the memory page in the browser)
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args[0] === '--run') {
    const id = args[1] === 'cube' ? 'cube' : Number(args[1]);
    if (!(id === 'cube' || (Number.isSafeInteger(id) && id >= 0)) || args.length !== 2) {
      console.error(USAGE);
      process.exit(2);
    }
    console.log(canonicalJson(candidateRun(id)));
    process.exit(0);
  }
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const name = { '--from': 'from', '--count': 'count', '--seconds': 'seconds' }[args[i]];
    const value = Number(args[i + 1]);
    if (!name || !(value >= 0)) {
      console.error(USAGE);
      process.exit(2);
    }
    options[name] = value;
  }
  await search(options);
}
