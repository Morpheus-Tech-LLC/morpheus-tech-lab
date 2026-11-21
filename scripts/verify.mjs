#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
//
// Checks result files from the unbounded engine, in Node:
//
//   node scripts/verify.mjs <result.json>... [--table <table>] [--max-generations N] [--max-memory-mb N]
//
// It replays each file's run from its seed to the stated generation and compares the hash, or,
// with --table (from scripts/reference-hashes.mjs), looks the hash up without a replay. A run that
// settled (died or repeated, as Methuselah's do) is replayed with the settle detector, to check
// that it first settles at the stated generation; a table can't show that, so it isn't used. A
// Classic Methuselah file's ships leave the arena in the replay as in the run, and its list of
// departures must be the replay's; it is printed. Result
// files come from strangers: a file is refused unread if it is over 128 MB (room for a generation
// saved from Explore, with its cells), and nothing in it is ever run. src/unbounded/verify.js
// does the checking. A contest's result is also checked against its contest
// (src/unbounded/contests.js), table lookup or not, and its score is printed.
//
// It takes several files, so `node scripts/verify.mjs public/hall-of-fame/results/*.json`
// re-verifies the Hall of Fame (#79). Each file is checked on its own, one after another.
//
// Exit status: 0 verified, 1 mismatch, 2 refused (or a mistake on the command line),
// 3 not checked (this verifier's own limits, or a table that doesn't cover the file). With
// several files, it is the worst file's: a mismatch, then a refusal, then a file not checked.

import { stat, readFile } from 'node:fs/promises';
import { verifyResult, DEFAULT_MAX_GENERATIONS, DEFAULT_MAX_MEMORY } from '../src/unbounded/verify.js';
import { readTable, MAX_RESULT_BYTES, ResultError } from '../src/unbounded/canonical.js';
import { contestById } from '../src/unbounded/contests.js';

const EXIT = { verified: 0, mismatch: 1, refused: 2, 'not-checked': 3 };
/** The order verdicts count in, with several files: the first one found decides the exit status. */
const WORST = ['mismatch', 'refused', 'not-checked', 'verified'];
const USAGE = 'Usage: node scripts/verify.mjs <result.json>... [--table <table>] [--max-generations N] [--max-memory-mb N]';

function usage(message) {
  console.error(`${message}\n${USAGE}`);
  process.exit(EXIT.refused);
}

function parseArgs(args) {
  const options = { maxGenerations: DEFAULT_MAX_GENERATIONS, maxMemory: DEFAULT_MAX_MEMORY };
  const files = [];
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
    else files.push(arg);
  }
  if (!files.length) usage('Give a result file.');
  return { files, table, options };
}

/** A file's score, as its contest states it. */
function scoreText(kind, { score, ending }) {
  if (kind === 'methuselah' && Number.isSafeInteger(score.generations)) {
    const at = score.generations.toLocaleString('en');
    return ending === 'died' ? `died at generation ${at}` : `settled at generation ${at} (period ${score.period})`;
  }
  const fields = Object.entries(score).map(([key, value]) => `${key} ${value ?? 'none'}`).join(', ');
  return `${fields}${kind === 'speed' ? ' (the time is self-reported)' : ''}`;
}

/** A file's departures: "2 ships left, at generations 140 and 412". */
function departuresText(departures) {
  if (!departures.length) return 'no ship left';
  const at = departures.map((d) => d.generation.toLocaleString('en'));
  const list = at.length === 1 ? at[0] : `${at.slice(0, -1).join(', ')} and ${at[at.length - 1]}`;
  return `${departures.length === 1 ? '1 ship' : `${departures.length} ships`} left, at generation${at.length === 1 ? '' : 's'} ${list}`;
}

/**
 * Checks one file, and prints its verdict.
 * @returns {Promise<string>} the verdict
 */
async function verifyFile(file, options) {
  let info;
  try {
    info = await stat(file);
  } catch {
    console.log(`refused: can't read ${file}.`);
    return 'refused';
  }
  if (!info.isFile()) {
    console.log(`refused: ${file} isn't a file.`);
    return 'refused';
  }
  if (info.size > MAX_RESULT_BYTES) {
    console.log(`refused: the file is larger than ${MAX_RESULT_BYTES / 1024 / 1024} MB, so it isn't a result file. It wasn't read.`);
    return 'refused';
  }
  const text = await readFile(file, 'utf8');

  const { verdict, message, result } = await verifyResult(text, options);
  console.log(`${verdict}: ${message}`);
  if (result) {
    const { run } = result;
    const rules = `B${run.rules.birth.join(',')}/S${run.rules.survival.join(',')}`;
    console.log(`  contest ${run.contest ?? 'none'}, rules ${rules}, seed of ${run.seed.length} cells, generation ${result.generation}, ended with ${result.ending}`);
    if (result.score) console.log(`  score: ${scoreText(contestById(run.contest)?.kind, result)}`);
    if (result.departures) console.log(`  departures: ${departuresText(result.departures)}`);
  }
  return verdict;
}

async function main() {
  const { files, table, options } = parseArgs(process.argv.slice(2));

  if (table) {
    try {
      options.table = readTable(await readFile(table, 'utf8'));
    } catch (err) {
      usage(err instanceof ResultError ? `The table: ${err.message}` : `Can't read the table ${table}.`);
    }
  }

  if (files.length === 1) process.exit(EXIT[await verifyFile(files[0], options)]);

  const verdicts = [];
  for (const file of files) {
    console.log(`${file}`);
    verdicts.push(await verifyFile(file, options));
  }
  const counts = WORST.map((verdict) => [verdict, verdicts.filter((v) => v === verdict).length]).filter(([, count]) => count);
  console.log(`${files.length} files: ${counts.map(([verdict, count]) => `${count} ${verdict}`).join(', ')}`);
  process.exit(EXIT[WORST.find((verdict) => verdicts.includes(verdict))]);
}

main().catch((err) => {
  console.error(err);
  process.exit(EXIT.refused);
});
