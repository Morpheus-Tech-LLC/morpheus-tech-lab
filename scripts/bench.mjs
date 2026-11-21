#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
//
// Benchmarks for the unbounded engine (#39). Its results pin the values the contests depend on:
// the chunk size, Speed's seed, rules and generation ceiling, and the Discovery arena and budget.
//
//   node scripts/bench.mjs [--quick] [--only <section>,…] [--markdown]
//
// Sections, in order:
//   chunks     chunk sizes 8, 16 and 32, dense and sparse seeds, the rule list
//   bits       one chunk's step: the engine's bytes against bit-packed cells (checked equal)
//   dense      the unbounded engine against the dense convolve3D() (checked cell for cell)
//   serialize  the canonical bytes, the SHA-256 hash and the result file
//   speed      the Speed candidates: 6-second timed runs, as in the contest
//   discovery  the Discovery worst case: the busiest replay an arena allows
//
// --quick is a smoke run of a minute or so; the full run takes several minutes. --markdown prints
// the tables ready to paste into a pull request. Every seed comes from a fixed pseudo-random
// sequence, so every machine measures the same patterns. The header names the machine by its CPU,
// thread count and memory only.

import os from 'node:os';
import { World } from '../src/unbounded/world.js';
import { step } from '../src/unbounded/step.js';
import { Run } from '../src/unbounded/run.js';
import { compareWithDense } from '../src/unbounded/compareDense.js';
import {
  canonicalBytes, sha256, normaliseRun, resultOf, resultText, readResult, worldOptions,
} from '../src/unbounded/canonical.js';
import {
  timeIt, timeItAsync, now, repeatableRandom, boxSeed, SEEDS, RULES, ruleText, printTable, fmt,
} from './bench/lib.mjs';
import { kernelPair } from './bench/bitpacked.mjs';
import { SHORTLIST, candidate, labelOf } from './bench/candidates.mjs';
import { worstCaseRun, fullArenaWorld } from './bench/worst-case.mjs';

/** The machine, without anything that names it: no host name, no user. */
function machine() {
  const cpus = os.cpus();
  return {
    node: process.version,
    cpu: cpus[0]?.model.trim() ?? 'unknown',
    threads: cpus.length,
    memoryGB: Math.round(os.totalmem() / 2 ** 30),
    platform: `${os.platform()} ${os.arch()}`,
  };
}

const SECTIONS = ['chunks', 'bits', 'dense', 'serialize', 'speed', 'discovery'];
const CHUNK_SIZES = [8, 16, 32];
const USAGE = `Usage: node scripts/bench.mjs [--quick] [--only ${SECTIONS.join(',')}] [--markdown]`;

function parseArgs(args) {
  const options = { quick: false, markdown: false, only: SECTIONS };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--quick') options.quick = true;
    else if (arg === '--markdown') options.markdown = true;
    else if (arg === '--only') {
      const names = (args[++i] ?? '').split(',').filter(Boolean);
      const unknown = names.filter((name) => !SECTIONS.includes(name));
      if (!names.length || unknown.length) usage(`--only takes sections from: ${SECTIONS.join(', ')}.`);
      options.only = names;
    } else if (arg === '--help' || arg === '-h') {
      console.log(USAGE);
      process.exit(0);
    } else usage(`Unknown option ${arg}.`);
  }
  return options;
}

function usage(message) {
  console.error(`${message}\n${USAGE}`);
  process.exit(2);
}

// ---- Chunk sizes, seeds and rules ----

function chunksSection({ quick }) {
  const generations = quick ? 20 : 200;
  const rows = [];
  // Each run: its time, and every chunk computed in every generation (those that held live cells,
  // and the empty neighbours the step brought in)
  const measure = (rules, seed, chunkSize) => {
    const world = new World({ rules, chunkSize });
    world.setCells(seed);
    let computed = 0;
    let ended = null;
    const started = now();
    while (world.generation < generations && !ended) {
      const before = world.chunkCount;
      const created = world.chunksCreated;
      ended = step(world);
      computed += before + world.chunksCreated - created;
    }
    return { world, ended, ms: now() - started, computed };
  };
  // Warm up the JIT, so the first row isn't slower for being first
  for (const chunkSize of CHUNK_SIZES) measure(RULES[0].rules, SEEDS.dense(), chunkSize);

  for (const { name, rules } of RULES) {
    for (const [seedName, makeSeed] of Object.entries(SEEDS)) {
      const seed = makeSeed();
      for (const chunkSize of CHUNK_SIZES) {
        const { world, ended, ms, computed } = measure(rules, seed, chunkSize);
        const perGen = ms / Math.max(1, world.generation);
        rows.push([
          `${name} (${ruleText(rules)})`, seedName, chunkSize, fmt.ms(perGen),
          fmt.rate((computed * world.volume) / (ms / 1000)),
          fmt.int(world.liveCells), fmt.int(world.chunksPeak), fmt.mb(world.chunksPeak * world.slotBytes),
          ended ?? '',
        ]);
      }
    }
  }
  return [{
    title: `Chunk size, seed and rules: ${generations} generations from each seed`,
    note: 'Dense: the 10³ seed box, half alive. Sparse: eight 4³ clusters scattered through 400³. Cells/s: cell updates per second, counting every cell of every chunk computed, empty neighbours included.',
    columns: ['Rules', 'Seed', 'Chunk', 'ms/gen', 'Cells/s', 'Live at end', 'Peak chunks', 'Peak MB', 'Ended'],
    rows,
  }];
}

// ---- Bytes against bit-packed cells ----

function bitsSection({ quick }) {
  const rows = [];
  let checked = 0;
  let failures = 0;
  // Agreement first, over more cases than are timed
  for (const n of CHUNK_SIZES) {
    for (const density of [0.02, 0.1, 0.3, 0.6, 0.9]) {
      for (const { rules } of RULES) {
        for (let s = 1; s <= (quick ? 1 : 3); s++) {
          const pair = kernelPair(World, { n, rules, density, random: repeatableRandom(1000 * n + 7 * s) });
          checked++;
          if (pair.check()) failures++;
        }
      }
    }
  }
  const timing = quick ? { minMs: 50, minRuns: 3 } : { minMs: 400, minRuns: 5 };
  for (const n of CHUNK_SIZES) {
    for (const density of [0.1, 0.3]) {
      for (const { name, rules } of [RULES[0], RULES[2]]) {
        const pair = kernelPair(World, { n, rules, density, random: repeatableRandom(n + 3) });
        const problem = pair.check();
        const byte = timeIt(pair.byteStep, timing);
        const bit = timeIt(pair.bitStep, timing);
        const cells = n ** 3;
        rows.push([
          n, density, name, ((byte * 1e6) / cells).toFixed(2), ((bit * 1e6) / cells).toFixed(2),
          `${(byte / bit).toFixed(1)}×`, problem ? `no: ${problem}` : 'yes',
        ]);
      }
    }
  }
  return [{
    title: "One chunk's step: bytes (the engine) against bit-packed cells (the bench's prototype)",
    note: `Each step reads the chunk and its 26 neighbours, and records live cells, box and border contacts. Checked equal in ${checked} cases (chunk sizes, densities, rules): ${failures ? `${failures} FAILED` : 'all agree'}.`,
    columns: ['Chunk', 'Density', 'Rules', 'Bytes ns/cell', 'Bits ns/cell', 'Bits faster', 'Same cells'],
    rows,
  }];
}

// ---- The unbounded engine against convolve3D() ----

async function denseSection({ quick }) {
  const generations = quick ? 10 : 50;
  const rows = [];
  for (const size of [50, 100]) {
    for (const { name, rules } of [RULES[0], RULES[1]]) {
      const result = await compareWithDense({ size, generations, seedSize: 10, density: 0.5, rules });
      const ran = result.mismatch?.generation ? result.mismatch.generation - 1 : generations;
      rows.push([
        `${size}³`, `${name} (${ruleText(rules)})`, ran,
        fmt.ms(result.denseMs / Math.max(1, ran)), fmt.ms(result.unboundedMs / Math.max(1, ran)),
        `${(result.denseMs / Math.max(1, result.unboundedMs)).toFixed(1)}×`,
        fmt.int(result.liveCells.last),
        result.mismatch ? `no: ${result.mismatch.reason ?? `generation ${result.mismatch.generation}`}` : 'yes',
      ]);
    }
  }
  return [{
    title: `The unbounded engine against convolve3D(), wrapping off: ${generations} generations from the 10³ seed box, half alive`,
    note: 'Only the steps are timed. The two must agree cell for cell while the pattern stays 2 cells clear of the walls.',
    columns: ['Grid', 'Rules', 'Generations', 'Dense ms/gen', 'Unbounded ms/gen', 'Unbounded faster', 'Live at end', 'Same cells'],
    rows,
  }];
}

// ---- Serialization ----

async function serializeSection({ quick }) {
  const rules = RULES[0].rules;
  const run = normaliseRun({
    contest: null, rules, seed: [[0, 0, 0]], arena: null, limits: { cells: null, extent: null, generations: null },
  });
  const timing = quick ? { minMs: 50, minRuns: 2 } : { minMs: 500, minRuns: 3 };
  const rows = [];
  for (const live of quick ? [1e3, 1e4, 1e5] : [1e3, 1e4, 1e5, 1e6]) {
    const side = Math.ceil(Math.cbrt(live / 0.3));
    const world = new World({ rules });
    world.setCells(boxSeed({ min: [0, 0, 0], size: [side, side, side], density: live / side ** 3, randomSeed: 5 }));
    let cells;
    const tCells = timeIt(() => { cells = world.cells(); }, timing);
    let bytes;
    const tBytes = timeIt(() => { bytes = canonicalBytes(run, 0, cells); }, timing);
    const tHash = await timeItAsync(() => sha256(bytes), timing);
    rows.push([
      fmt.int(world.liveCells), fmt.ms(tCells), fmt.ms(tBytes), fmt.ms(tHash), fmt.ms(tCells + tBytes + tHash),
      fmt.mb(bytes.length), (bytes.length / world.liveCells).toFixed(2),
    ]);
  }

  // A result file for a Speed-sized seed, and the largest seed a file can hold
  const fileRows = [];
  for (const seedCells of [100, 1000]) {
    const seed = boxSeed({ density: seedCells / 1000, randomSeed: 9 }).slice(0, seedCells);
    const fileRun = { ...run, seed };
    const world = new World(worldOptions(normaliseRun(fileRun)));
    world.setCells(seed);
    for (let g = 0; g < 50; g++) step(world);
    let text;
    const tWrite = await timeItAsync(async () => {
      text = resultText(await resultOf(world, { run: fileRun, ending: 'stopped' }));
    }, timing);
    const tRead = timeIt(() => readResult(text), timing);
    fileRows.push([fmt.int(seed.length), fmt.ms(tWrite), fmt.ms(tRead), fmt.int(text.length), fmt.int(world.liveCells)]);
  }
  return [{
    title: 'The canonical state and its hash, by live cells',
    note: 'Cells: World.cells(). Bytes: sorting and encoding them. A Speed reference table hashes every generation, so this is its cost per generation at that size.',
    columns: ['Live cells', 'Cells ms', 'Bytes ms', 'SHA-256 ms', 'Total ms', 'Bytes MB', 'Bytes/cell'],
    rows,
  }, {
    title: 'A result file, by seed size (the seed is in the file; the cells are only hashed)',
    note: 'Write: resultOf() and resultText(), hash included, after 50 generations. Read: readResult(), which checks the whole file.',
    columns: ['Seed cells', 'Write ms', 'Read ms', 'File bytes', 'Live cells'],
    rows: fileRows,
  }];
}

// ---- Speed candidates ----

/** A timed run through the real run loop (run.js), as a Speed entry runs in the Worker. */
function timedRun({ rules, seed, chunkSize, seconds }) {
  return new Promise((resolve, reject) => {
    const samples = [];
    const run = new Run({
      post: (message) => {
        if (message.type === 'error') reject(new Error(message.message));
        const stats = message.stats;
        if (stats) samples.push(stats);
        if (message.type === 'state' && message.state === 'ended') {
          run.close();
          resolve({ stats, reason: message.reason, samples });
        }
      },
    });
    run.receive({
      type: 'start',
      world: { rules, chunkSize },
      seed: Int32Array.from(seed.flat()),
      run: { kind: 'timed', seconds },
    });
  });
}

const sideOfExtent = (extent) => (extent ? Math.max(...extent.max.map((hi, a) => hi - extent.min[a] + 1)) : 0);

async function speedSection({ quick }) {
  const seconds = quick ? 1 : 6;
  const rows = [];
  for (const id of SHORTLIST) {
    const { rules, seed } = candidate(id);
    for (const chunkSize of CHUNK_SIZES) {
      const { stats, reason, samples } = await timedRun({ rules, seed, chunkSize, seconds });
      const half = samples.find((s) => s.elapsedMs >= (seconds * 1000) / 2);
      const growing = half && sideOfExtent(stats.extent) > sideOfExtent(half.extent) && stats.live > half.live;
      rows.push([
        labelOf(id), ruleText(rules), seed.length, chunkSize, fmt.int(stats.generation), fmt.int(stats.live),
        sideOfExtent(stats.extent), fmt.mb(stats.usedBytes), growing ? 'yes' : 'no', reason,
      ]);
    }
  }
  return [{
    title: `Speed candidates: ${seconds}-second timed runs through the run loop, as in the contest`,
    note: 'cube: what Explore opens on, the 10³ cube under the lab default rules. The numbered candidates are rebuilt from their number (scripts/bench/candidates.mjs). Growing: wider, with more live cells, than at half time. A run of one candidate to a ceiling: write its run with `node scripts/bench/candidates.mjs --run <id or cube>`, then `node scripts/reference-hashes.mjs`.',
    columns: ['Candidate', 'Rules', 'Seed cells', 'Chunk', 'Generations', 'Live', 'Side', 'MB used', 'Growing', 'Ended'],
    rows,
  }];
}

// ---- The Discovery worst case ----

function discoverySection({ quick }) {
  const generations = quick ? 10 : 100;
  const rows = [];
  for (const side of [50, 64, 100]) {
    for (const chunkSize of CHUNK_SIZES) {
      const run = worstCaseRun({ arena: side, generations: 10_000, chunkSize });
      const world = new World(worldOptions(run, { chunkSize }));
      world.setCells(run.seed);
      // The random fill floods the arena within a few dozen generations; time it once full
      for (let g = 0; g < (quick ? 20 : 60); g++) step(world);
      const started = now();
      for (let g = 0; g < generations; g++) {
        const ended = step(world);
        if (ended) throw new Error(`The worst case ended early: ${ended}`);
      }
      const perGen = (now() - started) / generations;
      rows.push([
        `${side}³`, chunkSize, 'file', fmt.int(run.seed.length), fmt.int(world.liveCells), fmt.ms(perGen),
        fmt.seconds(perGen * 10_000), fmt.seconds(perGen * 5_000),
      ]);
    }
    const full = fullArenaWorld({ arena: side, chunkSize: 16, fingerprint: true });
    const started = now();
    for (let g = 0; g < generations; g++) step(full);
    const perGen = (now() - started) / generations;
    rows.push([
      `${side}³`, 16, 'all alive, fingerprint', '', fmt.int(full.liveCells), fmt.ms(perGen),
      fmt.seconds(perGen * 10_000), fmt.seconds(perGen * 5_000),
    ]);
  }
  return [{
    title: `The Discovery worst case: ${generations} generations, timed after the arena fills`,
    note: 'File: the worst-case result file (scripts/bench/worst-case.mjs). All alive: every arena cell alive from the start, with the fingerprint (#41\'s repeat detection) on; too big for a result file. The projections are a replay of the whole budget; `node scripts/verify.mjs` on the file is the real test.',
    columns: ['Arena', 'Chunk', 'Pattern', 'Seed cells', 'Live', 'ms/gen', '10,000 gens', '5,000 gens'],
    rows,
  }];
}

// ---- Main ----

const RUNNERS = {
  chunks: chunksSection, bits: bitsSection, dense: denseSection, serialize: serializeSection,
  speed: speedSection, discovery: discoverySection,
};

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const m = machine();
  const header = `Node ${m.node} on ${m.cpu}, ${m.threads} threads, ${m.memoryGB} GB, ${m.platform}${options.quick ? ' (quick run)' : ''}`;
  console.log(options.markdown ? `### Benchmarks\n\n${header}` : header);
  const started = now();
  for (const name of SECTIONS) {
    if (!options.only.includes(name)) continue;
    const sectionStarted = now();
    const tables = await RUNNERS[name](options);
    for (const table of tables) printTable(table, options);
    if (!options.markdown) console.log(`(${name}: ${fmt.seconds(now() - sectionStarted)})`);
  }
  if (!options.markdown) console.log(`\nDone in ${fmt.seconds(now() - started)}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
