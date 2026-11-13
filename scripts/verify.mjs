#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
//
// Checks a result file from the unbounded engine, in Node:
//
//   node scripts/verify.mjs <result.json> [--table <table>] [--max-generations N] [--max-memory-mb N]
//
// It replays the file's run from its seed to the stated generation and compares the hash, or,
// with --table (from scripts/reference-hashes.mjs), looks the hash up without a replay. Result
// files come from strangers: a file is refused unread if it is over 128 MB (room for a generation
// saved from Explore, with its cells), and nothing in it is ever run. src/unbounded/verify.js
// does the checking. A contest's result is also checked against its contest
// (src/unbounded/contests.js), table lookup or not, and its score is printed.
//
// Exit status: 0 verified, 1 mismatch, 2 refused (or a mistake on the command line),
// 3 not checked (this verifier's own limits, or a table that doesn't cover the file).

import { stat, readFile } from 'node:fs/promises';
import { verifyResult, DEFAULT_MAX_GENERATIONS, DEFAULT_MAX_MEMORY } from '../src/unbounded/verify.js';
import { readTable, MAX_RESULT_BYTES, ResultError } from '../src/unbounded/canonical.js';
import { contestById } from '../src/unbounded/contests.js';

const EXIT = { verified: 0, mismatch: 1, refused: 2, 'not-checked': 3 };
const USAGE = 'Usage: node scripts/verify.mjs <result.json> [--table <table>] [--max-generations N] [--max-memory-mb N]';

function usage(message) {
  console.error(`${message}\n${USAGE}`);
  process.exit(EXIT.refused);
}

function parseArgs(args) {
  const options = { maxGenerations: DEFAULT_MAX_GENERATIONS, maxMemory: DEFAULT_MAX_MEMORY };
  let file = null;
  let table = null;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = () => {
      if (i + 1 >= args.length) usage(`${arg} needs a value.`);
      return args[++i];
    };
    const count = () => {
      const n = Number(value());
      if (!Number.isSafeInteger(n) || n < 1) usage(`${arg} needs a whole number.`);
      return n;
    };
    if (arg === '--table') table = value();
    else if (arg === '--max-generations') options.maxGenerations = count();
    else if (arg === '--max-memory-mb') options.maxMemory = count() * 1024 * 1024;
    else if (arg === '--help' || arg === '-h') {
      console.log(USAGE);
      process.exit(0);
    } else if (arg.startsWith('-')) usage(`Unknown option ${arg}.`);
    else if (file) usage('Give one result file.');
    else file = arg;
  }
  if (!file) usage('Give a result file.');
  return { file, table, options };
}

async function main() {
  const { file, table, options } = parseArgs(process.argv.slice(2));

  let info;
  try {
    info = await stat(file);
  } catch {
    usage(`Can't read ${file}.`);
  }
  if (!info.isFile()) usage(`${file} isn't a file.`);
  if (info.size > MAX_RESULT_BYTES) {
    console.log(`refused: the file is larger than ${MAX_RESULT_BYTES / 1024 / 1024} MB, so it isn't a result file. It wasn't read.`);
    process.exit(EXIT.refused);
  }
  const text = await readFile(file, 'utf8');

  if (table) {
    try {
      options.table = readTable(await readFile(table, 'utf8'));
    } catch (err) {
      usage(err instanceof ResultError ? `The table: ${err.message}` : `Can't read the table ${table}.`);
    }
  }

  const { verdict, message, result } = await verifyResult(text, options);
  console.log(`${verdict}: ${message}`);
  if (result) {
    const { run } = result;
    const rules = `B${run.rules.birth.join(',')}/S${run.rules.survival.join(',')}`;
    console.log(`  contest ${run.contest ?? 'none'}, rules ${rules}, seed of ${run.seed.length} cells, generation ${result.generation}, ended with ${result.ending}`);
    if (result.score) {
      const score = Object.entries(result.score).map(([key, value]) => `${key} ${value ?? 'none'}`).join(', ');
      console.log(`  score: ${score}${contestById(run.contest)?.kind === 'speed' ? ' (the time is self-reported)' : ''}`);
    }
  }
  process.exit(EXIT[verdict]);
}

main().catch((err) => {
  console.error(err);
  process.exit(EXIT.refused);
});
