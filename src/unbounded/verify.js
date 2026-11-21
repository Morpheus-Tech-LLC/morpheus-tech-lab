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
// and doesn't need to be: the result stands at its last complete generation either way.
//
// A settled run ('died' or 'repeat') can't be checked by replaying to its generation and stepping
// once: a still life formed at 100 also equals itself at 500. So it is replayed from the seed with
// the settle detector (settle.js), as the run itself was, and verifies only if the run first
// settles at the file's generation, with its ending, and the cells there match the file's hash. A
// score's period (Methuselah's, #41) must be the cycle's. A table lookup can't see settling, so
// with a table such a file is not checked.
//
// Where ships leave at the edge (Classic Methuselah, #100), the replay steps through the departure
// rule (departures.js), which it reads from the contest, and makes the same departures as the run.
// Once the cells match, the file's list must be the replay's, departure for departure. 'emits' is
// checked as a settled ending is. Only a settled ending scores there, and a table can't check one.
//
// A contest's result is first checked against its contest (contests.js's checkContest()): its run
// must be the contest's, and its score must follow from its generation and ending. That needs no
// replay, so it holds for a table lookup too. A contest this lab doesn't know isn't checked.
//
// Nothing here imports `state` or touches the page.

import { World, WorldError } from './world.js';
import { step as stepWorld } from './step.js';
import { readResult, hashWorld, canonicalJson, worldOptions, checkResultHashes, ResultError } from './canonical.js';
import { checkContest, departuresFor } from './contests.js';
import { Settler } from './settle.js';
import { withDepartures } from './departures.js';

export const DEFAULT_MAX_GENERATIONS = 100_000;
export const DEFAULT_MAX_MEMORY = 2 * 1024 ** 3;

/** Endings the pattern decides, so a replay must meet them too. */
export const PATTERN_ENDINGS = ['cell-limit', 'extent-limit', 'coordinate-limit', 'arena-edge'];
/** Endings that depend on the machine or the visitor, which a replay can't check. */
export const MACHINE_ENDINGS = ['stopped', 'deadline', 'memory-limit', 'out-of-memory'];
/** Endings checked by replaying the settling from the seed. */
export const SETTLED_ENDINGS = ['died', 'repeat', 'emits'];

const MEMORY = ['memory-limit', 'out-of-memory'];

/**
 * @typedef {object} Verdict
 * @property {'verified' | 'mismatch' | 'refused' | 'not-checked'} verdict
 * @property {string} message - one sentence, for a person
 * @property {object} [result] - the file as read, unless it was refused
 * @property {'confirmed' | 'machine' | 'table'} [ending] - for a verified file: whether its
 *   ending was confirmed, can't be checked (machine), or wasn't replayed (a table lookup)
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
 * @param {typeof stepWorld} [options.step] - the tests wrap it to count the steps; a run's
 *   departures are applied round it
 * @param {(world: object) => string} [options.fingerprint] - a settling replay's fingerprint; the
 *   tests force false matches with it
 * @returns {Promise<Verdict>}
 */
export async function verifyResult(text, {
  table, maxGenerations = DEFAULT_MAX_GENERATIONS, maxMemory = DEFAULT_MAX_MEMORY,
  chunkSize, slabBytes, step: baseStep = stepWorld, fingerprint,
} = {}) {
  const step = withDepartures(baseStep);
  let result;
  try {
    result = readResult(text);
  } catch (err) {
    if (err instanceof ResultError) return { verdict: 'refused', message: err.message };
    throw err;
  }
  const { run, generation, ending } = result;
  const answer = (verdict, message, extra = {}) => ({ verdict, message, result, ...extra });

  // A contest's result must be its contest's run, with the score that follows from it
  const contest = checkContest(result);
  if (contest) return answer(contest.verdict, contest.message);

  // A saved generation's cells and seed hash must be what they claim
  const wrong = await checkResultHashes(result);
  if (wrong) return answer('mismatch', wrong);

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

  const settled = SETTLED_ENDINGS.includes(ending);
  const departures = departuresFor(run);

  if (table) {
    if (settled) {
      return answer('not-checked', `A table can't show where a run settles, so a file that ended with ${ending} is checked by replay.`);
    }
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

  const options = { ...worldOptions(run, { chunkSize, slabBytes, memory: maxMemory }), departures };
  const world = new World({ ...options, fingerprint: settled });
  try {
    world.setCells(run.seed);
  } catch (err) {
    if (err instanceof WorldError && MEMORY.includes(err.reason)) return tooBig();
    throw err; // readResult() has already checked the seed against the arena and the limits
  }
  if (settled) return replaySettling(world, result, { options, maxGenerations, step, fingerprint, answer, tooBig });

  while (world.generation < generation) {
    const reason = step(world);
    if (!reason) continue;
    if (MEMORY.includes(reason)) return tooBig();
    return answer('mismatch', `The run ends at generation ${world.generation} (${reason}), so it can't reach generation ${generation}.`);
  }

  if (await hashWorld(world, run) !== result.hash) {
    return answer('mismatch', `The cells at generation ${generation} don't match the file's hash.`);
  }
  const departed = compareDepartures(world, result);
  if (departed) return answer('mismatch', `Generation ${generation} matches the file's hash, but ${departed}`);
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
  return answer('verified', `${matches}. The run ended with ${ending}, which depends on the machine and isn't checked.`, { ending: 'machine' });
}

/**
 * Replays a settled run from its seed with the settle detector, as the run itself was: the file
 * verifies only if the run first settles at its generation, with its ending (and, for a score with
 * a period, that period), and the cells there match its hash.
 */
async function replaySettling(world, result, { options, maxGenerations, step, fingerprint, answer, tooBig }) {
  const { run, generation, ending, score } = result;
  const budget = run.limits.generations ?? Infinity;
  const settler = new Settler(world, { world: options, budget, fingerprint, step });
  const claim = `The file says the run settled at generation ${generation} (${ending})`;
  let found = null;
  while (!found) {
    // A cycle found from here on begins at or after world.generation + 1 − window: past the
    // file's generation, the file can't be right
    if (world.generation + 1 - settler.window > generation) {
      return answer('mismatch', `${claim}, but it hasn't settled by generation ${world.generation}.`);
    }
    if (budget !== Infinity && world.generation >= budget) {
      return answer('mismatch', `${claim}, but it reaches its generation limit, ${budget}, without settling.`);
    }
    if (world.generation >= maxGenerations) {
      return answer('not-checked', `The run hadn't settled by generation ${world.generation}, this verifier's limit.`);
    }
    const reason = step(world);
    if (reason) {
      if (MEMORY.includes(reason)) return tooBig();
      return answer('mismatch', `${claim}, but it ends at generation ${world.generation} (${reason}) without settling.`);
    }
    found = settler.check(world);
    if (found && MEMORY.includes(found.ending)) return tooBig();
  }
  const settledText = found.ending === 'died' ? `the run dies at generation ${found.from}`
    : found.ending === 'emits' ? `the run first repeats at generation ${found.from}, a cycle of period ${found.period} that sends off ships`
      : `the run first settles at generation ${found.from}, a cycle of period ${found.period}`;
  if (found.from !== generation || found.ending !== ending) {
    return answer('mismatch', `${claim}, but ${settledText}.`);
  }
  if (score && score.period !== undefined && score.period !== found.period) {
    return answer('mismatch', `The score says period ${score.period}, but ${settledText}.`);
  }
  world.generation = found.from; // a repeat's cells now are the cycle's first generation's
  if (await hashWorld(world, run) !== result.hash) {
    return answer('mismatch', `The run settles at generation ${generation}, as the file says, but the cells there don't match the file's hash.`);
  }
  const departed = compareDepartures(world, result);
  if (departed) return answer('mismatch', `The run settles at generation ${generation}, as the file says, but ${departed}`);
  const how = ending === 'died' ? 'every cell has died'
    : ending === 'emits' ? `the cells repeat with period ${found.period}, sending off ships each time round`
      : `the cells repeat with period ${found.period}`;
  return answer('verified', `Generation ${generation} matches the file's hash, and the run first settles there: ${how}.`, { ending: 'confirmed' });
}

/**
 * Compares the file's departures with the replay's: the same departures, in the same order.
 * @returns {string | null} the first difference, as the end of a sentence, or null
 */
function compareDepartures(world, result) {
  if (!world.departures) return null; // checkContest() has seen that the file lists none
  const replayed = world.departed;
  const claimed = result.departures;
  for (let i = 0; i < Math.max(replayed.length, claimed.length); i++) {
    const [ours, theirs] = [replayed[i], claimed[i]];
    if (!theirs) return `the replay's departure ${i + 1}, at generation ${ours.generation}, isn't in the file's list.`;
    if (!ours) return `the file's departure ${i + 1}, at generation ${theirs.generation}, isn't in the replay: ${shipsLeft(replayed.length)}.`;
    for (const field of ['generation', 'period', 'shift', 'cells']) {
      if (canonicalJson(ours[field]) !== canonicalJson(theirs[field])) {
        return `departure ${i + 1}'s ${field} isn't the replay's (generation ${ours.generation}).`;
      }
    }
  }
  return null;
}

function shipsLeft(count) {
  return count === 0 ? 'no ship left' : count === 1 ? 'one ship left' : `${count} ships left`;
}

function formatBytes(bytes) {
  return bytes >= 1024 ** 3 ? `${+(bytes / 1024 ** 3).toFixed(2)} GB` : `${+(bytes / 1024 ** 2).toFixed(1)} MB`;
}
