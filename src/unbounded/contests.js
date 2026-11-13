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
// The Discovery contests, Methuselah (#41) and Contained chaos (#42), will be added here. The
// pinned values come from #39's benchmarks (#44's Pinned values table).
//
// Nothing here imports `state` or touches the page.

import { validateRules } from './rules.js';
import { normaliseRun, canonicalJson } from './canonical.js';

/**
 * The seed box (#44's shared decisions): cells -5 to 4 on each axis, a fixed place in the world,
 * centred on the origin. The seed editor designs in it, Explore's default cube fills it, and the
 * Discovery contests' seeds must lie in it, so a design moves into a contest unchanged.
 */
export const SEED_BOX = Object.freeze({ min: Object.freeze([-5, -5, -5]), max: Object.freeze([4, 4, 4]) });

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
 * @property {{rules?: object, seed?: number[][], arena: object | null,
 *   limits: {cells: number | null, extent: number | null, generations: number | null}}} fixes -
 *   what the contest fixes; what it leaves out (rules, seed) comes from the entry
 * @property {number} chunkSize - the chunk size its runs use: not in the hash, but fixed so every
 *   entrant runs the same engine
 * @property {string | null} closes - the day entries close, as YYYY-MM-DD, or null while it is
 *   still to be announced. It decides nothing about a result, so setting it needs no new id
 * @property {number} [seconds] - Speed: how long a run lasts
 * @property {number} [ceiling] - Speed: the generation that ends a run early (limits.generations)
 */

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
  closes: null,
  seconds: 6,
  ceiling: 1000,
};

/** @type {readonly Contest[]} */
export const CONTESTS = deepFreeze([SPEED_1]);

/** @returns {Contest | undefined} */
export function contestById(id) {
  return CONTESTS.find((contest) => contest.id === id);
}

/**
 * A run's definition, in normal form: the contest's fixed parts, and the entry's for the rest.
 * @param {Contest} contest
 * @param {{rules?: object, seed?: number[][]}} [entry] - Speed's entry brings nothing
 * @throws {ResultError} if the entry's part doesn't make a run
 */
export function runFor(contest, entry = {}) {
  const { fixes } = contest;
  return normaliseRun({
    contest: contest.id,
    rules: fixes.rules ?? entry.rules,
    seed: fixes.seed ?? entry.seed,
    arena: fixes.arena,
    limits: fixes.limits,
  });
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
  const wrong = SCORE_CHECKS[contest.kind](result, contest);
  return wrong ? { verdict: 'mismatch', message: wrong } : null;
}
