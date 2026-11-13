// SPDX-License-Identifier: Apache-2.0
//
// The canonical state of an unbounded run, its SHA-256 hash, and the result file.
//
// A run's state at one generation becomes bytes that depend only on the automaton: the run's
// definition, the generation and the live cells. They don't depend on the chunk size or layout,
// the order cells were added in, timings, or anything about the machine. Two runs that reach the
// same cells from the same definition get the same hash, on any machine.
//
// The bytes are a header, a newline (0x0A), then a body:
//
//   header  JSON, keys sorted at every level, no whitespace, whole numbers only:
//           {"format":1,"generation":G,"run":<the run's definition>}
//   body    the number of live cells, then each cell, sorted by z, then y, then x, as its
//           difference from the cell before (the first from 0, 0, 0): dz, dy, dx. Every number
//           is zigzag-encoded (0, -1, 1, -2, … become 0, 1, 2, 3, …) and written as a varint:
//           seven bits a byte, low bits first, the top bit set on every byte but the last.
//
// The run's definition is always given in full, even where a contest fixes it, so a result file
// can be checked on its own:
//
//   {contest: id | null, rules: {birth, survival}, seed: [[x, y, z], …] sorted by z, y, x,
//    arena: {min, max} | null, limits: {cells, extent, generations}, each a number or null}
//
// Only limits stated in terms of the pattern are part of it. The memory limit depends on the
// machine, so it isn't. The engine's version isn't either: the cells at a generation follow
// from the rules and the seed alone, so a fix to the engine makes a wrong result fail instead
// of protecting it. FORMAT_VERSION changes only when these bytes do.
//
// A result file may also carry two things a verifier doesn't need, for the lab (#66): `cells`,
// the live cells at its generation, sorted by z, y, x, so the lab can load the generation and run
// on from it without replaying; and `seedHash`, the hash of generation 0 (the seed) under the
// same run, which names the run's starting point. Both are hashed state, so checkResultHashes()
// confirms them without a replay, and an edited file fails.
//
// A contest's result also carries a `score` (#40): a small object of whole numbers, such as
// Speed's {generations, ms}. It is outside the hash and never trusted: contests.js's
// checkContest() works out what it must be from the replayed or looked-up state, and the one part
// that can't be (Speed's time) is self-reported.
//
// Result files arrive from strangers, so readResult() treats one as untrusted data: it refuses
// a file over MAX_RESULT_BYTES unread, and anything that doesn't match the format exactly,
// unknown fields included. Only the known fields are ever read, and nothing in a file is run.
//
// SHA-256 comes from crypto.subtle, which works the same in the browser, a Web Worker and Node.
// Nothing here imports `state` or touches the page.

import { validateRules, RuleError } from './rules.js';
import { COORDINATE_LIMIT, CHUNK_SIZES } from './world.js';
import { END_REASONS } from './endings.js';

/** The version of the canonical bytes. */
export const FORMAT_VERSION = 1;
export const RESULT_FORMAT = 'morpheus-tech-lab/result';
export const RESULT_VERSION = 1;
export const TABLE_FORMAT = 'morpheus-tech-lab/hash-table';
export const TABLE_VERSION = 1;
/**
 * The largest result file read at all: room for a seed and a generation of a million cells each
 * (about 33 bytes a cell as text), as the lab saves them.
 */
export const MAX_RESULT_BYTES = 128 * 1024 * 1024;

/** How a result's run can have ended: every end reason but a fault in the engine. */
export const RESULT_ENDINGS = END_REASONS.filter((reason) => reason !== 'error');

const CONTEST_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const HASH = /^sha256:[0-9a-f]{64}$/;
const MAX_TEXT = 100;
/** A score's field names, and the most fields it may have. */
const SCORE_KEY = /^[a-z][A-Za-z]{0,31}$/;
const MAX_SCORE_FIELDS = 8;
const STATS_NUMBERS = [
  'generation', 'elapsedMs', 'generationMs', 'rate', 'live', 'livePeak', 'chunks', 'chunksPeak', 'chunksCreated',
  'memoryBytes', 'usedBytes',
];

/** A result file, or a run's definition, that doesn't match the format. */
export class ResultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResultError';
  }
}

// ---- Canonical JSON ----

/**
 * JSON with object keys sorted at every level and no whitespace. Only null, booleans, strings,
 * whole numbers, arrays and plain objects are allowed, so the text is the same everywhere.
 */
export function canonicalJson(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) throw new ResultError(`${value} is not a whole number.`);
    return String(value); // -0 becomes "0"
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
  }
  throw new ResultError(`A ${typeof value} can't be written as canonical JSON.`);
}

// ---- Cells ----

/**
 * The cells sorted by z, then y, then x.
 * @param {Int32Array} flat - x, y, z triples, each cell once
 * @returns {Int32Array} a sorted copy
 */
export function sortCells(flat) {
  const count = flat.length / 3;
  if (count === 0) return new Int32Array(0);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < flat.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      const c = flat[i + a];
      if (c < min[a]) min[a] = c;
      if (c > max[a]) max[a] = c;
    }
  }
  const [wx, wy, wz] = max.map((hi, a) => hi - min[a] + 1);
  const out = new Int32Array(flat.length);

  // Each cell's position in its bounding box, z-major, is its sort key. Unless the box is
  // enormous, the keys are exact in a double and sort natively; otherwise they are BigInts.
  if (wx * wy * wz <= Number.MAX_SAFE_INTEGER) {
    const keys = new Float64Array(count);
    for (let i = 0, k = 0; k < count; i += 3, k++) {
      keys[k] = ((flat[i + 2] - min[2]) * wy + (flat[i + 1] - min[1])) * wx + (flat[i] - min[0]);
    }
    keys.sort();
    const plane = wx * wy;
    for (let k = 0; k < count; k++) {
      const key = keys[k];
      const z = Math.floor(key / plane);
      const rest = key - z * plane;
      const y = Math.floor(rest / wx);
      out[3 * k] = rest - y * wx + min[0];
      out[3 * k + 1] = y + min[1];
      out[3 * k + 2] = z + min[2];
    }
  } else {
    // Coordinates span at most 2 · COORDINATE_LIMIT = 2²⁰ per axis: 20 bits each
    const keys = new BigUint64Array(count);
    for (let i = 0, k = 0; k < count; i += 3, k++) {
      keys[k] = (BigInt(flat[i + 2] - min[2]) << 40n) | (BigInt(flat[i + 1] - min[1]) << 20n) | BigInt(flat[i] - min[0]);
    }
    keys.sort();
    const mask = (1n << 20n) - 1n;
    for (let k = 0; k < count; k++) {
      const key = keys[k];
      out[3 * k] = Number(key & mask) + min[0];
      out[3 * k + 1] = Number((key >> 20n) & mask) + min[1];
      out[3 * k + 2] = Number(key >> 40n) + min[2];
    }
  }
  return out;
}

const zigzag = (n) => (n >= 0 ? 2 * n : -2 * n - 1);

function varintLength(v) {
  let length = 1;
  while (v >= 128) {
    v = Math.floor(v / 128);
    length++;
  }
  return length;
}

function writeVarint(bytes, at, v) {
  while (v >= 128) {
    bytes[at++] = (v % 128) | 128;
    v = Math.floor(v / 128);
  }
  bytes[at++] = v;
  return at;
}

/**
 * The body of the canonical bytes: the count, then each cell's zigzag-varint differences.
 * @param {Int32Array} sorted - x, y, z triples, sorted by sortCells()
 * @returns {Uint8Array}
 */
export function encodeCells(sorted) {
  const count = sorted.length / 3;
  // Two passes, measuring then writing, so a large state needs only its own bytes
  let length = varintLength(count);
  let px = 0, py = 0, pz = 0;
  for (let i = 0; i < sorted.length; i += 3) {
    const [x, y, z] = [sorted[i], sorted[i + 1], sorted[i + 2]];
    length += varintLength(zigzag(z - pz)) + varintLength(zigzag(y - py)) + varintLength(zigzag(x - px));
    px = x; py = y; pz = z;
  }
  const bytes = new Uint8Array(length);
  let at = writeVarint(bytes, 0, count);
  px = 0; py = 0; pz = 0;
  for (let i = 0; i < sorted.length; i += 3) {
    const [x, y, z] = [sorted[i], sorted[i + 1], sorted[i + 2]];
    at = writeVarint(bytes, at, zigzag(z - pz));
    at = writeVarint(bytes, at, zigzag(y - py));
    at = writeVarint(bytes, at, zigzag(x - px));
    px = x; py = y; pz = z;
  }
  return bytes;
}

// ---- The canonical bytes and the hash ----

/**
 * @param {object} run - a definition from normaliseRun()
 * @param {number} generation
 * @param {Int32Array} cells - the live cells as x, y, z triples, in any order
 * @returns {Uint8Array}
 */
export function canonicalBytes(run, generation, cells) {
  return canonicalBytesSorted(run, generation, sortCells(cells));
}

// canonicalBytes() for cells already sorted by sortCells()
function canonicalBytesSorted(run, generation, sorted) {
  const header = new TextEncoder().encode(`${canonicalJson({ format: FORMAT_VERSION, generation, run })}\n`);
  const body = encodeCells(sorted);
  const bytes = new Uint8Array(header.length + body.length);
  bytes.set(header, 0);
  bytes.set(body, header.length);
  return bytes;
}

/** @returns {Promise<string>} "sha256:" and 64 hex digits */
export async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return `sha256:${Array.from(digest, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}

/** The hash of a state. @returns {Promise<string>} */
export function stateHash(run, generation, cells) {
  return sha256(canonicalBytes(run, generation, cells));
}

/** The hash of a world's current generation, under a run's definition. @returns {Promise<string>} */
export function hashWorld(world, run) {
  return stateHash(run, world.generation, world.cells());
}

// ---- The run's definition ----

/**
 * Checks a run's definition and returns it in normal form: rules normalised, the seed sorted by
 * z, y, x without duplicates.
 * @throws {ResultError} if it doesn't match the format, or can't start (a seed cell outside the
 *   arena, or a seed already past a limit)
 */
export function normaliseRun(run, path = 'run') {
  exactKeys(run, path, ['contest', 'rules', 'seed', 'arena', 'limits']);

  const { contest } = run;
  if (contest !== null && !(typeof contest === 'string' && CONTEST_ID.test(contest))) {
    throw new ResultError(`${path}.contest must be null or a contest id (lower-case letters, digits and dashes).`);
  }

  exactKeys(run.rules, `${path}.rules`, ['birth', 'survival']);
  let rules;
  try {
    rules = validateRules(run.rules);
  } catch (err) {
    if (err instanceof RuleError) throw new ResultError(`${path}.rules: ${err.message}`);
    throw err;
  }

  let arena = null;
  if (run.arena !== null) {
    exactKeys(run.arena, `${path}.arena`, ['min', 'max']);
    const min = point(run.arena.min, `${path}.arena.min`);
    const max = point(run.arena.max, `${path}.arena.max`);
    if (!min.every((lo, a) => lo <= max[a])) throw new ResultError(`${path}.arena.min must not be past ${path}.arena.max.`);
    arena = { min, max };
  }

  exactKeys(run.limits, `${path}.limits`, ['cells', 'extent', 'generations']);
  const limits = {};
  for (const name of ['cells', 'extent', 'generations']) {
    const value = run.limits[name];
    if (value !== null && !(Number.isSafeInteger(value) && value >= 0)) {
      throw new ResultError(`${path}.limits.${name} must be null or a whole number.`);
    }
    limits[name] = value;
  }

  if (!Array.isArray(run.seed)) throw new ResultError(`${path}.seed must be a list of [x, y, z] cells.`);
  const flat = new Int32Array(3 * run.seed.length);
  run.seed.forEach((cell, i) => {
    const [x, y, z] = point(cell, `${path}.seed[${i}]`);
    if (arena && !(x >= arena.min[0] && x <= arena.max[0] && y >= arena.min[1] && y <= arena.max[1]
      && z >= arena.min[2] && z <= arena.max[2])) {
      throw new ResultError(`${path}.seed[${i}], [${x}, ${y}, ${z}], is outside the arena.`);
    }
    flat.set([x, y, z], 3 * i);
  });
  const seed = [];
  const sorted = sortCells(flat);
  for (let i = 0; i < sorted.length; i += 3) {
    const [x, y, z] = [sorted[i], sorted[i + 1], sorted[i + 2]];
    const last = seed[seed.length - 1];
    if (!last || last[0] !== x || last[1] !== y || last[2] !== z) seed.push([x, y, z]);
  }
  if (limits.cells !== null && seed.length > limits.cells) {
    throw new ResultError(`${path}.seed has more cells than ${path}.limits.cells.`);
  }
  if (limits.extent !== null && seed.length) {
    const lo = [...seed[0]];
    const hi = [...seed[0]];
    for (const cell of seed) {
      for (let a = 0; a < 3; a++) {
        if (cell[a] < lo[a]) lo[a] = cell[a];
        if (cell[a] > hi[a]) hi[a] = cell[a];
      }
    }
    const longest = Math.max(...hi.map((h, a) => h - lo[a] + 1));
    if (longest > limits.extent) throw new ResultError(`${path}.seed is wider than ${path}.limits.extent.`);
  }

  return { contest, rules, seed, arena, limits };
}

/** The options for a World that replays a run, beside the caller's own (chunk size, memory). */
export function worldOptions(run, { chunkSize, slabBytes, memory } = {}) {
  const options = {
    rules: run.rules,
    arena: run.arena,
    limits: {
      cells: run.limits.cells ?? undefined,
      extent: run.limits.extent ?? undefined,
      memory,
    },
  };
  if (chunkSize !== undefined) options.chunkSize = chunkSize;
  if (slabBytes !== undefined) options.slabBytes = slabBytes;
  return options;
}

// ---- The result file ----

/**
 * The result of a run, ready to write as a file.
 * @param {import('./world.js').World} world - after its run
 * @param {object} options
 * @param {object} options.run - the run's definition
 * @param {string} options.ending - how the run ended, one of RESULT_ENDINGS
 * @param {object} [options.details] - the run details, outside the hash: chunkSize,
 *   elapsedMs, stats (run.js's statistics) and browser ({name, version}); each may be left out
 * @param {boolean} [options.withCells] - include the generation's live cells
 * @param {object} [options.score] - the contest's score (contests.js), outside the hash
 * @returns {Promise<object>}
 */
export async function resultOf(world, { run, ending, details = {}, withCells = false, score }) {
  if (canonicalJson(world.rules) !== canonicalJson(normaliseRun(run).rules)) {
    throw new ResultError("The world's rules are not the run's.");
  }
  return resultFromCells({
    run, generation: world.generation, cells: world.cells(), ending,
    details: { chunkSize: world.n, ...details }, withCells, score,
  });
}

/**
 * The result of a run from the cells of its generation, where there is no World at hand: the
 * page has only the cells a Worker sent it.
 * @param {object} options - as resultOf()'s, with the generation and its cells
 * @param {number} options.generation
 * @param {Int32Array} options.cells - the live cells as x, y, z triples, in any order
 * @returns {Promise<object>}
 */
export async function resultFromCells({ run, generation, cells, ending, details = {}, withCells = false, score }) {
  const definition = normaliseRun(run);
  if (!RESULT_ENDINGS.includes(ending)) {
    throw new ResultError(`A run that ended with ${JSON.stringify(ending)} can't be a result.`);
  }
  if (!(Number.isSafeInteger(generation) && generation >= 0)) throw new ResultError('generation must be a whole number.');
  const sorted = sortCells(cells);
  const result = {
    format: RESULT_FORMAT,
    version: RESULT_VERSION,
    run: definition,
    generation,
    ending,
  };
  if (score !== undefined) result.score = checkScore(score);
  Object.assign(result, {
    hash: await sha256(canonicalBytesSorted(definition, generation, sorted)),
    seedHash: await stateHash(definition, 0, Int32Array.from(definition.seed.flat())),
    details: {
      chunkSize: details.chunkSize ?? null,
      elapsedMs: details.elapsedMs ?? null,
      stats: details.stats ?? null,
      browser: details.browser ?? null,
    },
  });
  checkDetails(result.details);
  if (withCells) {
    const list = new Array(sorted.length / 3);
    for (let k = 0; k < list.length; k++) list[k] = [sorted[3 * k], sorted[3 * k + 1], sorted[3 * k + 2]];
    result.cells = list;
  }
  return result;
}

/**
 * Checks what a result says about its own cells, without a replay: that its seedHash is the
 * seed's, and that its cells, if it has them, are the ones its hash names.
 * @param {object} result - from readResult()
 * @returns {Promise<string | null>} what doesn't match, for a person, or null
 */
export async function checkResultHashes(result) {
  const { run, generation } = result;
  if (result.seedHash !== undefined) {
    if (await stateHash(run, 0, Int32Array.from(run.seed.flat())) !== result.seedHash) {
      return "The file's seedHash isn't the hash of its seed.";
    }
  }
  if (result.cells !== undefined) {
    if (await sha256(canonicalBytesSorted(run, generation, Int32Array.from(result.cells.flat()))) !== result.hash) {
      return `The file's cells aren't the ones its hash names for generation ${generation}.`;
    }
  }
  return null;
}

/**
 * A result as the text of its file: indented JSON, with each cell and each number list on one
 * line, so a person can read it.
 */
export function resultText(result) {
  return `${JSON.stringify(result, null, 2).replace(/\[\s+([-\d.eE+,\s]+?)\s+\]/g, (_, inner) => `[${inner.split(/,\s*/).join(', ')}]`)}\n`;
}

/**
 * Reads a result file as untrusted data.
 * @param {string} text - the file's contents
 * @returns {object} the result, its run in normal form
 * @throws {ResultError} saying what is wrong, if the file is too large or doesn't match the format
 */
export function readResult(text) {
  if (typeof text !== 'string') throw new ResultError('A result file is text.');
  if (text.length > MAX_RESULT_BYTES || new TextEncoder().encode(text).length > MAX_RESULT_BYTES) {
    throw new ResultError(`The file is larger than ${MAX_RESULT_BYTES / 1024 / 1024} MB, so it isn't a result file.`);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ResultError("The file isn't JSON.");
  }
  exactKeys(data, 'The file', ['format', 'version', 'run', 'generation', 'ending', 'hash', 'details'], ['score', 'seedHash', 'cells']);
  if (data.format !== RESULT_FORMAT) throw new ResultError(`The file isn't a result file (its format isn't "${RESULT_FORMAT}").`);
  if (data.version !== RESULT_VERSION) {
    throw new ResultError(`The file's version is ${JSON.stringify(data.version)}; this lab reads version ${RESULT_VERSION}.`);
  }
  const run = normaliseRun(data.run);
  if (!(Number.isSafeInteger(data.generation) && data.generation >= 0)) {
    throw new ResultError('generation must be a whole number.');
  }
  if (!RESULT_ENDINGS.includes(data.ending)) {
    throw new ResultError(`ending must be one of ${RESULT_ENDINGS.join(', ')}.`);
  }
  if (typeof data.hash !== 'string' || !HASH.test(data.hash)) {
    throw new ResultError('hash must be "sha256:" and 64 lower-case hex digits.');
  }
  if (data.seedHash !== undefined && (typeof data.seedHash !== 'string' || !HASH.test(data.seedHash))) {
    throw new ResultError('seedHash must be "sha256:" and 64 lower-case hex digits.');
  }
  checkDetails(data.details);
  const result = {
    format: data.format,
    version: data.version,
    run,
    generation: data.generation,
    ending: data.ending,
  };
  if (data.score !== undefined) result.score = checkScore(data.score);
  result.hash = data.hash;
  if (data.seedHash !== undefined) result.seedHash = data.seedHash;
  result.details = data.details;
  if (data.cells !== undefined) result.cells = readCells(data.cells);
  return result;
}

// A result's cells: [x, y, z] each, sorted by z, y, x, each once. @returns {number[][]}
function readCells(cells) {
  if (!Array.isArray(cells)) throw new ResultError('cells must be a list of [x, y, z] cells.');
  return cells.map((cell, i) => {
    const [x, y, z] = point(cell, `cells[${i}]`);
    if (i > 0) {
      const [px, py, pz] = cells[i - 1];
      const after = z > pz || (z === pz && (y > py || (y === py && x > px)));
      if (!after) throw new ResultError(`cells[${i}] is out of order or listed twice: cells are sorted by z, then y, then x.`);
    }
    return [x, y, z];
  });
}

/**
 * Checks a score's shape: an object of at most MAX_SCORE_FIELDS fields, each a whole number or
 * null. What the fields must be is its contest's to say (contests.js).
 * @returns {object} a copy, its fields in the order given
 */
function checkScore(score) {
  if (!isPlainObject(score)) throw new ResultError('score must be an object.');
  const keys = Object.keys(score);
  if (keys.length > MAX_SCORE_FIELDS) throw new ResultError(`score has more than ${MAX_SCORE_FIELDS} fields.`);
  const copy = {};
  for (const key of keys) {
    if (!SCORE_KEY.test(key)) throw new ResultError(`score has a field with a name that isn't a word, ${JSON.stringify(key.slice(0, MAX_TEXT))}.`);
    const value = score[key];
    if (value !== null && !(Number.isSafeInteger(value) && value >= 0)) {
      throw new ResultError(`score.${key} must be null or a whole number.`);
    }
    copy[key] = value;
  }
  return copy;
}

function checkDetails(details) {
  exactKeys(details, 'details', ['chunkSize', 'elapsedMs', 'stats', 'browser']);
  if (details.chunkSize !== null && !CHUNK_SIZES.includes(details.chunkSize)) {
    throw new ResultError(`details.chunkSize must be null or one of ${CHUNK_SIZES.join(', ')}.`);
  }
  if (details.elapsedMs !== null && !isAmount(details.elapsedMs)) {
    throw new ResultError('details.elapsedMs must be null or a number of milliseconds.');
  }
  if (details.stats !== null) {
    const { stats } = details;
    if (!isPlainObject(stats)) throw new ResultError('details.stats must be null or an object.');
    for (const key of Object.keys(stats)) {
      if (key === 'extent') {
        if (stats.extent === null) continue;
        exactKeys(stats.extent, 'details.stats.extent', ['min', 'max']);
        point(stats.extent.min, 'details.stats.extent.min');
        point(stats.extent.max, 'details.stats.extent.max');
      } else if (!STATS_NUMBERS.includes(key)) {
        throw new ResultError(`details.stats has an unknown field, ${JSON.stringify(key)}.`);
      } else if (!isAmount(stats[key])) {
        throw new ResultError(`details.stats.${key} must be a number.`);
      }
    }
  }
  if (details.browser !== null) {
    exactKeys(details.browser, 'details.browser', ['name', 'version']);
    for (const key of ['name', 'version']) {
      const value = details.browser[key];
      if (typeof value !== 'string' || value.length > MAX_TEXT) {
        throw new ResultError(`details.browser.${key} must be text of at most ${MAX_TEXT} characters.`);
      }
    }
  }
}

// ---- The reference table ----

/**
 * A reference table as text: a first line naming the run, then the hash of every generation
 * from 0, one per line, so line g + 2 is generation g.
 */
export function tableText(run, hashes) {
  const header = canonicalJson({ format: TABLE_FORMAT, version: TABLE_VERSION, run: normaliseRun(run) });
  return `${header}\n${hashes.join('\n')}\n`;
}

/**
 * Reads a reference table. Tables are made by maintainers, not strangers, but are still checked.
 * @returns {{run: object, hashes: string[]}}
 */
export function readTable(text) {
  const lines = String(text).split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  let header;
  try {
    header = JSON.parse(lines[0]);
  } catch {
    throw new ResultError("The table's first line isn't JSON.");
  }
  exactKeys(header, "The table's first line", ['format', 'version', 'run']);
  if (header.format !== TABLE_FORMAT || header.version !== TABLE_VERSION) {
    throw new ResultError(`The file isn't a version ${TABLE_VERSION} reference table.`);
  }
  const run = normaliseRun(header.run, 'The table\'s run');
  const hashes = lines.slice(1);
  hashes.forEach((hash, i) => {
    if (!HASH.test(hash)) throw new ResultError(`The table's line ${i + 2} isn't a hash.`);
  });
  return { run, hashes };
}

// ---- Checking shapes ----

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAmount(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/** Throws unless `value` is an object with exactly these keys, and perhaps the optional ones. */
function exactKeys(value, path, keys, optional = []) {
  if (!isPlainObject(value)) throw new ResultError(`${path} must be an object.`);
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) throw new ResultError(`${path} is missing ${JSON.stringify(key)}.`);
  }
  for (const key of Object.keys(value)) {
    if (!keys.includes(key) && !optional.includes(key)) throw new ResultError(`${path} has an unknown field, ${JSON.stringify(key)}.`);
  }
}

/** Checks an [x, y, z] of whole numbers inside the representable space. */
function point(value, path) {
  if (!Array.isArray(value) || value.length !== 3
    || !value.every((c) => Number.isInteger(c) && c >= -COORDINATE_LIMIT && c < COORDINATE_LIMIT)) {
    throw new ResultError(`${path} must be [x, y, z], whole numbers from ${-COORDINATE_LIMIT} to ${COORDINATE_LIMIT - 1}.`);
  }
  return [value[0], value[1], value[2]];
}
