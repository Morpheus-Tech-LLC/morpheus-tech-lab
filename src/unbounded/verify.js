// SPDX-License-Identifier: Apache-2.0
//
// Checks a result file: replays its run from the seed to the stated generation and compares
// the replay's hash with the file's, or, given a reference table, looks the hash up instead.
// It has no page and no file system, so the lab can run it in a Worker and scripts/verify.mjs
// can run it in Node.
//
// The answer is one of:
//   verified     the cells at the stated generation are the file's, and its ending holds
//   mismatch     the file can't be what its run produced; the message says which check failed
//   refused      the file isn't a result file; the message says what is wrong with it
//   not-checked  the verifier's own limits (generations, memory) stopped it, or the table
//                doesn't cover the file: no judgement on the file either way
//
// How a run ended is checked when the pattern decides it. A pattern ending (a cell, extent,
// coordinate or arena limit) must recur: one more step must end the replay for the same reason.
// An ending that depends on the machine (stopped by hand, a deadline, memory) can't be checked,
// and doesn't need to be: the result stands at its last complete generation either way. 'died'
// and 'repeat' are scored, and checked, by the Methuselah contest (#41).
//
// Nothing here imports `state` or touches the page.

import { World, WorldError } from './world.js';
import { step as stepWorld } from './step.js';
import { readResult, hashWorld, canonicalJson, worldOptions, ResultError } from './canonical.js';

export const DEFAULT_MAX_GENERATIONS = 100_000;
export const DEFAULT_MAX_MEMORY = 2 * 1024 ** 3;

/** Endings the pattern decides, so a replay must meet them too. */
export const PATTERN_ENDINGS = ['cell-limit', 'extent-limit', 'coordinate-limit', 'arena-edge'];
/** Endings that depend on the machine or the visitor, which a replay can't check. */
export const MACHINE_ENDINGS = ['stopped', 'deadline', 'memory-limit', 'out-of-memory'];
/** Endings checked by the contest that scores them. */
export const LATER_ENDINGS = ['died', 'repeat'];

const MEMORY = ['memory-limit', 'out-of-memory'];

/**
 * @typedef {object} Verdict
 * @property {'verified' | 'mismatch' | 'refused' | 'not-checked'} verdict
 * @property {string} message - one sentence, for a person
 * @property {object} [result] - the file as read, unless it was refused
 * @property {'confirmed' | 'machine' | 'later' | 'table'} [ending] - for a verified file: whether
 *   its ending was confirmed, can't be checked (machine), is checked by its contest (later), or
 *   wasn't replayed (a table lookup)
 */

/**
 * @param {string} text - the result file's contents, untrusted
 * @param {object} [options]
 * @param {{run: object, hashes: string[]}} [options.table] - from readTable(): look the hash up
 *   instead of replaying
 * @param {number} [options.maxGenerations] - the most generations a replay may take
 * @param {number} [options.maxMemory] - the most bytes of slabs a replay may hold
 * @param {number} [options.chunkSize] - the replay's chunk size; the answer doesn't depend on it
 * @param {number} [options.slabBytes]
 * @param {typeof stepWorld} [options.step] - the tests wrap it to count the steps
 * @returns {Promise<Verdict>}
 */
export async function verifyResult(text, {
  table, maxGenerations = DEFAULT_MAX_GENERATIONS, maxMemory = DEFAULT_MAX_MEMORY,
  chunkSize, slabBytes, step = stepWorld,
} = {}) {
  let result;
  try {
    result = readResult(text);
  } catch (err) {
    if (err instanceof ResultError) return { verdict: 'refused', message: err.message };
    throw err;
  }
  const { run, generation, ending } = result;
  const answer = (verdict, message, extra = {}) => ({ verdict, message, result, ...extra });

  // What the file says about itself, before any replay
  const limit = run.limits.generations;
  if (limit !== null && generation > limit) {
    return answer('mismatch', `Generation ${generation} is past the run's generation limit, ${limit}.`);
  }
  if (ending === 'generation-limit' && generation !== limit) {
    return answer('mismatch', limit === null
      ? 'The file says the run reached its generation limit, but the run has none.'
      : `The file says the run reached its generation limit, ${limit}, at generation ${generation}.`);
  }

  if (table) {
    if (canonicalJson(table.run) !== canonicalJson(run)) {
      return answer('not-checked', "The table is for a different run from this file's.");
    }
    if (generation >= table.hashes.length) {
      return answer('not-checked', `The table stops at generation ${table.hashes.length - 1}, before generation ${generation}.`);
    }
    return table.hashes[generation] === result.hash
      ? answer('verified', `Generation ${generation} matches the table.`, { ending: 'table' })
      : answer('mismatch', `The file's hash isn't the table's for generation ${generation}.`);
  }

  if (generation > maxGenerations) {
    return answer('not-checked', `Generation ${generation} is past this verifier's limit of ${maxGenerations} generations.`);
  }
  const tooBig = () => answer('not-checked', `The replay needed more than this verifier's memory limit of ${formatBytes(maxMemory)}.`);

  const world = new World(worldOptions(run, { chunkSize, slabBytes, memory: maxMemory }));
  try {
    world.setCells(run.seed);
  } catch (err) {
    if (err instanceof WorldError && MEMORY.includes(err.reason)) return tooBig();
    throw err; // readResult() has already checked the seed against the arena and the limits
  }
  while (world.generation < generation) {
    const reason = step(world);
    if (!reason) continue;
    if (MEMORY.includes(reason)) return tooBig();
    return answer('mismatch', `The run ends at generation ${world.generation} (${reason}), so it can't reach generation ${generation}.`);
  }

  if (await hashWorld(world, run) !== result.hash) {
    return answer('mismatch', `The cells at generation ${generation} don't match the file's hash.`);
  }
  const matches = `Generation ${generation} matches the file's hash`;

  if (PATTERN_ENDINGS.includes(ending)) {
    const next = step(world);
    if (next === ending) return answer('verified', `${matches}, and the next generation does end the run (${ending}).`, { ending: 'confirmed' });
    if (MEMORY.includes(next)) return tooBig();
    return answer('mismatch', next
      ? `${matches}, but the run ends with ${next}, not ${ending}.`
      : `${matches}, but the next generation doesn't end the run (${ending}).`);
  }
  if (ending === 'generation-limit') {
    return answer('verified', `Generation ${generation}, the run's generation limit, matches the file's hash.`, { ending: 'confirmed' });
  }
  if (MACHINE_ENDINGS.includes(ending)) {
    return answer('verified', `${matches}. The run ended with ${ending}, which depends on the machine and isn't checked.`, { ending: 'machine' });
  }
  return answer('verified', `${matches}. Its ending, ${ending}, is checked by its contest.`, { ending: 'later' });
}

function formatBytes(bytes) {
  return bytes >= 1024 ** 3 ? `${+(bytes / 1024 ** 3).toFixed(2)} GB` : `${+(bytes / 1024 ** 2).toFixed(1)} MB`;
}
