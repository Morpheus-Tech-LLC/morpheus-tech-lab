#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
//
// Computes the reference table for a run: the hash of every generation, from 0 to --to.
//
//   node scripts/reference-hashes.mjs <run.json> --to <generation> --out <table> [--max-memory-mb N]
//
// <run.json> is a run's definition (src/unbounded/canonical.js), or a result file, whose run is
// used. Every honest run of a fixed seed and rules passes through the same states, so checking
// such a result (Speed's) is then a lookup in the table, with scripts/verify.mjs --table, and
// never needs a machine as fast as the entrant's. It runs at whatever pace this machine allows,
// once.
//
// The table is text: a first line naming the run, then one hash per line, so line g + 2 is
// generation g. If the run ends before --to (a limit), the table stops at its last generation.

import { readFile, writeFile } from 'node:fs/promises';
import { World } from '../src/unbounded/world.js';
import { step } from '../src/unbounded/step.js';
import {
  normaliseRun, readResult, hashWorld, tableText, worldOptions, RESULT_FORMAT, ResultError,
} from '../src/unbounded/canonical.js';

const USAGE = 'Usage: node scripts/reference-hashes.mjs <run.json> --to <generation> --out <table> [--max-memory-mb N]';

function usage(message) {
  console.error(`${message}\n${USAGE}`);
  process.exit(2);
}

function parseArgs(args) {
  let file = null;
  let to = null;
  let out = null;
  let memory;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = () => {
      if (i + 1 >= args.length) usage(`${arg} needs a value.`);
      return args[++i];
    };
    const count = (min) => {
      const n = Number(value());
      if (!Number.isSafeInteger(n) || n < min) usage(`${arg} needs a whole number.`);
      return n;
    };
    if (arg === '--to') to = count(0);
    else if (arg === '--out') out = value();
    else if (arg === '--max-memory-mb') memory = count(1) * 1024 * 1024;
    else if (arg === '--help' || arg === '-h') {
      console.log(USAGE);
      process.exit(0);
    } else if (arg.startsWith('-')) usage(`Unknown option ${arg}.`);
    else if (file) usage('Give one run file.');
    else file = arg;
  }
  if (!file || to === null || !out) usage('Give a run file, --to and --out.');
  return { file, to, out, memory };
}

async function readRun(file) {
  let data;
  try {
    const text = await readFile(file, 'utf8');
    data = JSON.parse(text);
    return data?.format === RESULT_FORMAT ? readResult(text).run : normaliseRun(data);
  } catch (err) {
    if (err instanceof ResultError) usage(`${file}: ${err.message}`);
    usage(data === undefined ? `Can't read ${file} as JSON.` : String(err));
  }
}

async function main() {
  const { file, to, out, memory } = parseArgs(process.argv.slice(2));
  const run = await readRun(file);
  const limit = run.limits.generations;
  if (limit !== null && to > limit) usage(`--to ${to} is past the run's generation limit, ${limit}.`);

  const world = new World(worldOptions(run, { memory }));
  world.setCells(run.seed);
  const hashes = [await hashWorld(world, run)];
  const started = Date.now();
  let reported = started;
  let ended = null;
  while (world.generation < to) {
    ended = step(world);
    if (ended) break;
    hashes.push(await hashWorld(world, run));
    if (Date.now() - reported >= 2000) {
      reported = Date.now();
      console.error(`generation ${world.generation} of ${to}, ${world.liveCells} live cells`);
    }
  }

  await writeFile(out, tableText(run, hashes));
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const live = `${world.liveCells.toLocaleString('en')} live cells at generation ${world.generation}`;
  if (ended) {
    console.log(`The run ended at generation ${world.generation} (${ended}). Wrote generations 0 to ${world.generation} to ${out} in ${seconds} s; ${live}.`);
  } else {
    console.log(`Wrote generations 0 to ${to} to ${out} in ${seconds} s; ${live}.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
