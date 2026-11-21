// SPDX-License-Identifier: Apache-2.0
//
// The Hall of Fame (#79): the verified entries in src/unbounded/hall-of-fame.json, read, ranked
// as each contest ranks them, and checked against their result files.
//
// Maintainers add an entry by pull request, after verifying it (CONTRIBUTING.md, "Contest
// entries"). Each entry names its contest, the entrant's chosen name, their picture (a path under
// public/hall-of-fame/, or null for the lab's logo), the score, the browser, the date the entry
// arrived, and its result file, under public/hall-of-fame/results/, which Watch replays and
// scripts/verify.mjs re-verifies. Paths are as the site serves them, without `public/`. A
// Methuselah entry also gives its rules, shown beside its score, and its seed's cells
// (`seedCells`), which break a tie in its score.
//
// `npm test` reads every entry's result file through checkEntry(): it must read as a result,
// pass checkContest(), and agree with its entry. The panel reads the data with readHallOfFame()
// too, so a malformed file shows as one message, never half a board.
//
// No DOM: the tests run it in Node.

import { readResult, canonicalJson, ResultError } from '../unbounded/canonical.js';
import { contestById, checkContest, compareSpeed, compareMethuselah } from '../unbounded/contests.js';
import { MAX_BROWSER_TEXT } from '../browser.js';

/** How many entries a contest's page shows. */
export const HALL_OF_FAME_TOP = 10;
/** A name to show is at most this many characters. */
export const MAX_NAME = 40;

/** A picture: a PNG or JPEG straight under public/hall-of-fame/, named in lower case. */
export const PICTURE_PATH = /^hall-of-fame\/[a-z0-9][a-z0-9-]*\.(png|jpg)$/;
/** A result file: a .json straight under public/hall-of-fame/results/, named in lower case. */
export const RESULT_PATH = /^hall-of-fame\/results\/[a-z0-9][a-z0-9-]*\.json$/;

const FIELDS = ['contest', 'name', 'picture', 'score', 'browser', 'date', 'result'];
/** The fields an entry has for its kind of contest, beside FIELDS. */
const KIND_FIELDS = { methuselah: ['rules', 'seedCells'] };

/** How each kind of contest orders two entries, best first, before the date. */
const RANKS = {
  speed: (a, b) => compareSpeed(a.score, b.score),
  methuselah: compareMethuselah,
};

export class HallOfFameError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HallOfFameError';
  }
}

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
  && Object.getPrototypeOf(value) === Object.prototype;

/** A date as YYYY-MM-DD, and a real day. */
function isDay(text) {
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function checkEntryShape(entry, at) {
  if (!isPlainObject(entry)) throw new HallOfFameError(`${at} must be an object.`);
  const kind = typeof entry.contest === 'string' ? contestById(entry.contest)?.kind : undefined;
  const fields = [...FIELDS, ...(KIND_FIELDS[kind] ?? [])];
  const keys = Object.keys(entry);
  const missing = fields.filter((key) => !keys.includes(key));
  const extra = keys.filter((key) => !fields.includes(key));
  if (missing.length) throw new HallOfFameError(`${at} has no ${missing[0]}.`);
  if (extra.length) throw new HallOfFameError(`${at} has an unknown field, ${JSON.stringify(extra[0])}.`);
  const { contest, name, picture, score, browser, date, result } = entry;
  if (typeof contest !== 'string' || !contestById(contest)) {
    throw new HallOfFameError(`${at}.contest must be one of this lab's contests.`);
  }
  if (typeof name !== 'string' || name.trim() !== name || !name || name.length > MAX_NAME || /[\u0000-\u001f\u007f]/.test(name)) {
    throw new HallOfFameError(`${at}.name must be text of 1 to ${MAX_NAME} characters, with no spaces at either end.`);
  }
  if (picture !== null && (typeof picture !== 'string' || !PICTURE_PATH.test(picture))) {
    throw new HallOfFameError(`${at}.picture must be null or a .png or .jpg under hall-of-fame/.`);
  }
  if (!isPlainObject(score) || !Object.values(score).every((v) => v === null || (Number.isSafeInteger(v) && v >= 0))) {
    throw new HallOfFameError(`${at}.score must be an object of whole numbers or nulls, as in its result file.`);
  }
  if (browser !== null) {
    const ok = isPlainObject(browser) && canonicalJson(Object.keys(browser).sort()) === '["name","version"]'
      && ['name', 'version'].every((key) => typeof browser[key] === 'string' && browser[key].length <= MAX_BROWSER_TEXT);
    if (!ok) throw new HallOfFameError(`${at}.browser must be null or {name, version}, as in its result file.`);
  }
  if (!isDay(date)) throw new HallOfFameError(`${at}.date must be the day the entry arrived, as YYYY-MM-DD.`);
  if ('rules' in entry) {
    const { rules } = entry;
    const counts = (list) => Array.isArray(list) && list.every((c, i) => Number.isSafeInteger(c) && c >= 0 && c <= 26 && (i === 0 || c > list[i - 1]));
    const ok = isPlainObject(rules) && canonicalJson(Object.keys(rules).sort()) === '["birth","survival"]'
      && counts(rules.birth) && counts(rules.survival);
    if (!ok) throw new HallOfFameError(`${at}.rules must be {birth, survival}, as in its result file.`);
  }
  if ('seedCells' in entry && !(Number.isSafeInteger(entry.seedCells) && entry.seedCells >= 1)) {
    throw new HallOfFameError(`${at}.seedCells must be the number of cells in its seed, as in its result file.`);
  }
  if (typeof result !== 'string' || !RESULT_PATH.test(result)) {
    throw new HallOfFameError(`${at}.result must be a .json under hall-of-fame/results/.`);
  }
}

/**
 * The Hall of Fame's entries, checked for shape (not against their result files: checkEntry()
 * does that, in `npm test`).
 * @param {unknown} data - hall-of-fame.json, parsed
 * @returns {object[]} the entries, in the file's order
 * @throws {HallOfFameError}
 */
export function readHallOfFame(data) {
  if (!isPlainObject(data) || canonicalJson(Object.keys(data)) !== '["entries"]' || !Array.isArray(data.entries)) {
    throw new HallOfFameError('The Hall of Fame must be {"entries": [...]}.');
  }
  const results = new Set();
  data.entries.forEach((entry, i) => {
    checkEntryShape(entry, `entries[${i}]`);
    if (results.has(entry.result)) throw new HallOfFameError(`entries[${i}].result is another entry's too.`);
    results.add(entry.result);
  });
  return data.entries;
}

/**
 * A contest's entries, best first, as the contest ranks them: Speed by its score, Methuselah by
 * its score, then fewer seed cells. Equal ones go to the earlier date, then to the file's order,
 * which is the order the entries arrived in.
 * @param {object[]} entries - from readHallOfFame()
 * @param {import('../unbounded/contests.js').Contest} contest
 */
export function rankEntries(entries, contest) {
  const byScore = RANKS[contest.kind] ?? (() => 0);
  return entries
    .map((entry, order) => ({ entry, order }))
    .filter(({ entry }) => entry.contest === contest.id)
    .sort((a, b) => byScore(a.entry, b.entry)
      || (a.entry.date < b.entry.date ? -1 : a.entry.date > b.entry.date ? 1 : 0)
      || a.order - b.order)
    .map(({ entry }) => entry);
}

/**
 * Checks an entry against its result file, without a replay: the file reads as a result, passes
 * checkContest(), and agrees with the entry's contest, score, browser and, for Methuselah, rules
 * and seed cells. scripts/verify.mjs replays the files.
 * @param {object} entry - from readHallOfFame()
 * @param {string} text - its result file's contents
 * @returns {string | null} what is wrong, or null
 */
export function checkEntry(entry, text) {
  let result;
  try {
    result = readResult(text);
  } catch (err) {
    if (err instanceof ResultError) return `${entry.result} isn't a result file: ${err.message}`;
    throw err;
  }
  const wrong = checkContest(result);
  if (wrong) return `${entry.result}: ${wrong.message}`;
  if (result.run.contest !== entry.contest) {
    return `${entry.result} is a result for ${result.run.contest ?? 'no contest'}, not ${entry.contest}.`;
  }
  if (canonicalJson(result.score) !== canonicalJson(entry.score)) {
    return `The entry's score isn't its result file's, ${canonicalJson(result.score)}.`;
  }
  if (canonicalJson(result.details.browser) !== canonicalJson(entry.browser)) {
    return `The entry's browser isn't its result file's, ${canonicalJson(result.details.browser)}.`;
  }
  if ('rules' in entry && canonicalJson(entry.rules) !== canonicalJson(result.run.rules)) {
    return `The entry's rules aren't its result file's, ${canonicalJson(result.run.rules)}.`;
  }
  if ('seedCells' in entry && entry.seedCells !== result.run.seed.length) {
    return `The entry's seedCells isn't its result file's seed, ${result.run.seed.length} cells.`;
  }
  return null;
}

/** A day as the board shows it: `20 Nov 2026`. */
export function dayText(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day))
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
