// SPDX-License-Identifier: Apache-2.0
//
// The contests, as data (#40), and checking a result against its contest.
//
// A contest is a definition; an entry is what a visitor brings to it. Each contest has a
// versioned id (`speed-1`), its kind and title, what it fixes (rules, seed, arena, the limits
// stated in the pattern's terms), the chunk size its runs use, and what its score must be.
// runFor(contest, entry) builds a run's definition (canonical.js) from the two. Changing
// anything that changes results means a new id, so a result is never checked against the wrong
// definition. There is no engine version (#38).
//
// A result's `score` is outside its hash and never trusted. checkContest() works out what it
// must be from the run's own generation and ending, which verifyResult() then checks by replay
// or by table lookup. Only Speed's time can't be worked out: it is self-reported.
//
// Speed (#40) fixes everything. The Discovery contests fix the arena, the seed box and the
// budget, and leave the rules and the seed to the entry: Methuselah (#41) and Classic Methuselah
// (#100), which is Methuselah with ships leaving at the edge (departures.js). Contained chaos
// (#42) is a later season's. They make up Season 0, and close together (SEASON_0_CLOSES). The pinned values come from #39's benchmarks (#44's Pinned values
// table).
//
// Nothing here imports `state` or touches the page.

import { validateRules } from './rules.js';
import { normaliseRun, canonicalJson, ResultError } from './canonical.js';

/**
 * The seed box (#44's shared decisions): cells -5 to 4 on each axis, a fixed place in the world,
 * centred on the origin. The seed editor designs in it, Explore's default cube fills it, and the
 * Discovery contests' seeds must lie in it, so a design moves into a contest unchanged.
 */
export const SEED_BOX = Object.freeze({ min: Object.freeze([-5, -5, -5]), max: Object.freeze([4, 4, 4]) });

/** The Discovery arena: 64³, cells -32 to 31 on each axis, centred on the origin as the seed box is. */
export const DISCOVERY_ARENA = Object.freeze({ min: Object.freeze([-32, -32, -32]), max: Object.freeze([31, 31, 31]) });

/** The kinds of contest. */
export const CONTEST_KINDS = Object.freeze(['speed', 'methuselah', 'contained-chaos']);

/** Every cell of a box, sorted by z, then y, then x. */
function boxCells({ min, max }) {
  const cells = [];
  for (let z = min[2]; z <= max[2]; z++) {
    for (let y = min[1]; y <= max[1]; y++) {
      for (let x = min[0]; x <= max[0]; x++) cells.push([x, y, z]);
    }
  }
  return cells;
}

const deepFreeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

/**
 * @typedef {object} Contest
 * @property {string} id - versioned, such as 'speed-1'
 * @property {'speed' | 'methuselah' | 'contained-chaos'} kind
 * @property {string} title
 * @property {string} summary - one line on what it measures
 * @property {{rules?: object, seed?: number[][], seedBox?: object, arena: object | null,
 *   limits: {cells: number | null, extent: number | null, generations: number | null}}} fixes -
 *   what the contest fixes; what it leaves out (rules, seed) comes from the entry, and a seed
 *   must then lie in the seed box
 * @property {number} chunkSize - the chunk size its runs use: not in the hash, but fixed so every
 *   entrant runs the same engine
 * @property {string | null} closes - when entries close: a day, YYYY-MM-DD, or an instant with its
 *   offset, such as Season 0's; or null while it is still to be announced. It decides nothing
 *   about a result, so setting it needs no new id
 * @property {number} [seconds] - Speed: how long a run lasts
 * @property {number} [ceiling] - Speed: the generation that ends a run early (limits.generations)
 * @property {number} [budget] - Discovery: the generations a run has (limits.generations)
 * @property {{period: number}} [departures] - Classic Methuselah: ships leave at the edge
 *   (departures.js), up to this period. It isn't in the run's definition: a replay reads it from
 *   the contest, through run.contest (departuresFor())
 */

/**
 * Season 0 (#130): Speed, Methuselah and Classic Methuselah, each a contest of its own, close
 * together at 11:59 PM Central Time on 31 December 2026, which is CST, six hours behind UTC.
 */
export const SEASON = 'Season 0';
const SEASON_0_CLOSES = '2026-12-31T23:59:00-06:00';

/**
 * Speed: generations completed in 6 seconds, on the visitor's own machine. It fixes everything,
 * from #39's pinned values: the Default cube (Cube10, all 1,000 cells of the seed box) under the
 * lab's default rules, B9,10/S5-15, unbounded, with chunk size 16, and a ceiling of 1,000
 * generations, so the fastest machines still rank: by the time they take to reach it.
 * @type {Contest}
 */
const SPEED_1 = {
  id: 'speed-1',
  kind: 'speed',
  title: 'Speed',
  summary: 'How many generations your browser computes in 6 seconds',
  fixes: {
    rules: validateRules({ birth: [9, 10], survival: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }),
    seed: boxCells(SEED_BOX),
    arena: null,
    limits: { cells: null, extent: null, generations: 1000 },
  },
  chunkSize: 16,
  closes: SEASON_0_CLOSES,
  seconds: 6,
  ceiling: 1000,
};

/**
 * Methuselah: the longest-lived pattern that settles, in place, inside the arena. It fixes, from
 * #39's pinned values, the 64³ arena, the 10³ seed box and a budget of 10,000 generations, with
 * chunk size 16; the entry brings the rules (any but B0) and the seed (1 to 1,000 cells, all in
 * the seed box). The arena already bounds the cells and the extent. A run scores h, the first
 * generation of the state or cycle it ends in, once that cycle closes, at h + period ≤ 10,000
 * (settle.js): the top score is 9,999.
 * @type {Contest}
 */
const METHUSELAH_1 = {
  id: 'methuselah-1',
  kind: 'methuselah',
  title: 'Methuselah',
  summary: 'The longest-lived pattern that settles inside the arena',
  fixes: {
    seedBox: SEED_BOX,
    arena: DISCOVERY_ARENA,
    limits: { cells: null, extent: null, generations: 10_000 },
  },
  chunkSize: 16,
  closes: SEASON_0_CLOSES,
  budget: 10_000,
};

/**
 * Classic Methuselah (#100): Methuselah with one rule changed, that a ship may leave the arena. It
 * fixes what Methuselah fixes, and adds the departure rule with P = 32, the longest ship period
 * recognised. A run that sends off outward ships and then settles scores h, as Methuselah's does;
 * one whose island at the edge isn't an outward ship of period 32 or less ends at the edge, and a
 * cycle that sends off ships ends as 'emits', neither with a score.
 * @type {Contest}
 */
const CLASSIC_METHUSELAH_1 = {
  id: 'classic-methuselah-1',
  kind: 'methuselah',
  title: 'Classic Methuselah',
  summary: 'The longest-lived pattern that settles once its ships have left the arena',
  fixes: {
    seedBox: SEED_BOX,
    arena: DISCOVERY_ARENA,
    limits: { cells: null, extent: null, generations: 10_000 },
  },
  chunkSize: 16,
  closes: SEASON_0_CLOSES,
  budget: 10_000,
  departures: { period: 32 },
};

/** @type {readonly Contest[]} */
export const CONTESTS = deepFreeze([SPEED_1, METHUSELAH_1, CLASSIC_METHUSELAH_1]);

/** @returns {Contest | undefined} */
export function contestById(id) {
  return CONTESTS.find((contest) => contest.id === id);
}

/**
 * The departure rule a run's world needs, from its contest: {period}, or null for a run whose
 * contest has none, or that has no contest this lab knows.
 * @param {{contest: string | null}} run
 * @returns {{period: number} | null}
 */
export function departuresFor(run) {
  const departures = run.contest === null ? undefined : contestById(run.contest)?.departures;
  return departures ? { period: departures.period } : null;
}

/**
 * A run's definition, in normal form: the contest's fixed parts, and the entry's for the rest.
 * An entry's seed must have a cell, and lie in the contest's seed box; it is never shifted.
 * @param {Contest} contest
 * @param {{rules?: object, seed?: number[][]}} [entry] - Speed's entry brings nothing
 * @throws {ResultError} if the entry's part doesn't make a run: a B0 rule, an empty seed, or a
 *   cell outside the seed box
 */
export function runFor(contest, entry = {}) {
  const { fixes } = contest;
  if (!fixes.rules && !entry.rules) throw new ResultError('The entry needs its rules.');
  if (!fixes.seed && !Array.isArray(entry.seed)) throw new ResultError('The entry needs its seed, a list of [x, y, z] cells.');
  const run = normaliseRun({
    contest: contest.id,
    rules: fixes.rules ?? entry.rules,
    seed: fixes.seed ?? entry.seed,
    arena: fixes.arena,
    limits: fixes.limits,
  });
  if (!fixes.seed) {
    if (!run.seed.length) throw new ResultError('The seed is empty: it needs at least one live cell.');
    const box = fixes.seedBox;
    const outside = run.seed.find((cell) => cell.some((c, a) => c < box.min[a] || c > box.max[a]));
    if (outside) {
      throw new ResultError(`The seed's cell [${outside.join(', ')}] is outside the seed box, cells ${box.min[0]} to ${box.max[0]} on each axis.`);
    }
  }
  return run;
}

/**
 * Speed's score for a run that ended at `generation`: the generations, and the time to reach the
 * ceiling, in whole milliseconds, or null for a run that the 6 seconds ended.
 * @returns {{generations: number, ms: number | null}}
 */
export function speedScore(contest, generation, elapsedMs) {
  return {
    generations: generation,
    ms: generation === contest.ceiling ? Math.max(1, Math.round(elapsedMs)) : null,
  };
}

/**
 * Orders two Speed scores, best first: more generations, then, at the ceiling, less time. Ties
 * go to the earlier submission, which the caller knows and this doesn't.
 * @returns {number} negative if `a` ranks above `b`
 */
export function compareSpeed(a, b) {
  if (a.generations !== b.generations) return b.generations - a.generations;
  return (a.ms ?? Infinity) - (b.ms ?? Infinity);
}

/**
 * Methuselah's score for a run that settled: h, the generation its final state or cycle began, and
 * the cycle's period (1 for a death), or null if the run didn't settle within the budget.
 * @param {Contest} contest
 * @param {{ending: string, generation: number, period?: number}} run - how the run ended, at
 *   which generation (h, for a settled run), and a repeat's period
 * @returns {{generations: number, period: number} | null}
 */
export function methuselahScore(contest, { ending, generation, period }) {
  if (ending !== 'died' && ending !== 'repeat') return null;
  const cycle = ending === 'died' ? 1 : period;
  if (!(Number.isSafeInteger(cycle) && cycle >= 1) || generation + cycle > contest.budget) return null;
  return { generations: generation, period: cycle };
}

/**
 * Orders two Methuselah entries, best first: more generations, then fewer seed cells. Ties go to
 * the earlier submission, which the caller knows and this doesn't.
 * @param {{score: {generations: number}, seedCells: number}} a
 * @param {{score: {generations: number}, seedCells: number}} b
 * @returns {number} negative if `a` ranks above `b`
 */
export function compareMethuselah(a, b) {
  if (a.score.generations !== b.score.generations) return b.score.generations - a.score.generations;
  return a.seedCells - b.seedCells;
}

/**
 * What the page warns of before a Methuselah run, for an entry's rules: under birth on 1
 * neighbour, the pattern grows by at least a cell a generation on every side, so it always
 * reaches the arena's edge (by generation 37 from the seed box) and can't score.
 * @param {{birth: number[]}} rules
 * @returns {string[]} the warnings, none for most rules
 */
export function methuselahWarnings(rules) {
  return rules.birth.includes(1)
    ? ['With birth on 1 neighbour (B1), a pattern grows by at least a cell a generation on every side, so it always reaches the edge of the arena, by generation 37, and can\'t score.']
    : [];
}

const FIELDS = [
  ['rules', (run) => run.rules],
  ['seed', (run) => run.seed],
  ['arena', (run) => run.arena],
  ['limits.cells', (run) => run.limits.cells],
  ['limits.extent', (run) => run.limits.extent],
  ['limits.generations', (run) => run.limits.generations],
];

/** What each kind's score must be, given a result whose run is its contest's. */
const SCORE_CHECKS = {
  speed(result, contest) {
    const { generation, ending, score } = result;
    if (ending !== 'deadline' && ending !== 'generation-limit') {
      return `A Speed run that ended with ${ending} has no score: only a run that the ${contest.seconds} seconds or the ceiling ended has one.`;
    }
    if (score === undefined) return 'A Speed result needs its score.';
    const keys = Object.keys(score);
    if (keys.length !== 2 || !keys.includes('generations') || !keys.includes('ms')) {
      return "A Speed score is {generations, ms}, and nothing else.";
    }
    if (score.generations !== generation) {
      return `The score says ${score.generations} generations, but the file is generation ${generation}.`;
    }
    if (ending === 'deadline' && generation >= contest.ceiling) {
      return `The ${contest.seconds} seconds can't end a run at the ceiling, generation ${contest.ceiling}.`;
    }
    const limitMs = contest.seconds * 1000;
    if (generation === contest.ceiling) {
      if (score.ms === null || score.ms < 1 || score.ms > limitMs) {
        return `A run that reached the ceiling scores the time it took, from 1 to ${limitMs} ms.`;
      }
    } else if (score.ms !== null) {
      return 'A run below the ceiling has no time in its score: ms must be null.';
    }
    return null;
  },

  methuselah(result, contest) {
    const { generation, ending, score } = result;
    if (ending === 'emits') {
      return `A ${contest.title} run that ended with emits has no score: it repeats while sending off ships, so it never settles.`;
    }
    if (ending !== 'died' && ending !== 'repeat') {
      return `A ${contest.title} run that ended with ${ending} has no score: only a run that dies or repeats, within ${contest.budget.toLocaleString('en')} generations, has one.`;
    }
    if (score === undefined) return `A ${contest.title} result needs its score.`;
    const keys = Object.keys(score);
    if (keys.length !== 2 || !keys.includes('generations') || !keys.includes('period')) {
      return 'A Methuselah score is {generations, period}, and nothing else.';
    }
    if (score.generations !== generation) {
      return `The score says ${score.generations} generations, but the file is generation ${generation}.`;
    }
    if (!(Number.isSafeInteger(score.period) && score.period >= 1)) {
      return 'A Methuselah score\'s period is a whole number of at least 1.';
    }
    if (ending === 'died' && score.period !== 1) {
      return `A death is a cycle of period 1, not ${score.period}.`;
    }
    if (generation + score.period > contest.budget) {
      return `A cycle that begins at generation ${generation} with period ${score.period} closes at ${generation + score.period}, past the budget of ${contest.budget.toLocaleString('en')} generations.`;
    }
    return null;
  },
};

/**
 * Checks a result against its contest, without a replay: that its run is the contest's, and that
 * its score follows from its generation and ending. verifyResult() runs it before anything else;
 * the replay, or the table, then confirms the generation itself.
 * @param {object} result - from readResult()
 * @returns {{verdict: 'mismatch' | 'not-checked', message: string} | null} null if it holds,
 *   or there is no contest
 */
export function checkContest(result) {
  const { run } = result;
  if (run.contest === null) {
    if (result.departures !== undefined) {
      return { verdict: 'mismatch', message: 'The file lists departures, but has no contest where ships leave.' };
    }
    return result.score === undefined ? null
      : { verdict: 'mismatch', message: 'The file has a score but no contest to score it.' };
  }
  const contest = contestById(run.contest);
  if (!contest) {
    return { verdict: 'not-checked', message: `This lab doesn't know the contest ${run.contest}, so the file wasn't checked.` };
  }
  let expected;
  try {
    expected = runFor(contest, { rules: run.rules, seed: run.seed });
  } catch (err) {
    return { verdict: 'mismatch', message: `The file's entry can't run in ${contest.id}: ${err.message}` };
  }
  for (const [name, of] of FIELDS) {
    if (canonicalJson(of(run)) !== canonicalJson(of(expected))) {
      return { verdict: 'mismatch', message: `The run isn't ${contest.id}'s: its ${name} differs from the contest's.` };
    }
  }
  const wrong = checkDepartures(result, contest) ?? SCORE_CHECKS[contest.kind](result, contest);
  return wrong ? { verdict: 'mismatch', message: wrong } : null;
}

/**
 * A contest where ships leave lists its departures, even none; any other lists none. Each must be
 * a ship the contest recognises, inside the budget. The replay checks the list itself.
 * @returns {string | null} what is wrong, for a person
 */
function checkDepartures(result, contest) {
  const { departures } = result;
  if (!contest.departures) {
    return departures === undefined ? null : `Ships don't leave the arena in ${contest.id}, so its results list no departures.`;
  }
  if (departures === undefined) return `A ${contest.title} result lists its departures, even when no ship left.`;
  const limit = contest.departures.period;
  for (const [i, departure] of departures.entries()) {
    if (departure.period > limit) {
      return `Departure ${i + 1} has period ${departure.period}, but ${contest.title} recognises ships of period up to ${limit}.`;
    }
    if (departure.generation >= contest.budget) {
      return `Departure ${i + 1} is at generation ${departure.generation}, past the budget of ${contest.budget.toLocaleString('en')} generations.`;
    }
  }
  return null;
}
