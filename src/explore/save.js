// SPDX-License-Identifier: Apache-2.0
//
// Explore's two saves (#66), apart from the page, so the tests run them in Node:
//
// - Save this generation writes a result file, the same file a contest entry is
//   (src/unbounded/canonical.js): the run's definition (its seed, rules, arena and limits), the
//   generation, how the run stands, the hash of that generation's cells and of the seed, the run's
//   details (statistics, chunk size, browser), and the generation's live cells. scripts/verify.mjs
//   checks it by replaying the seed; the lab loads it and carries on from its generation.
// - Save seed writes the seed the run started from, with its rules, as a seed file (seed.js).

import {
  resultFromCells, resultText, readResult, checkResultHashes, ResultError, RESULT_FORMAT, RESULT_ENDINGS,
} from '../unbounded/canonical.js';
import { arenaBox, toSeedFile, parseSeedFile, MAX_FILE_CELLS, SeedError } from './seed.js';

/** The file Save seed writes. */
export const SEED_FILE_NAME = 'explore-seed.json';
/** Browser names and versions are text of at most this many characters in a result. */
const MAX_TEXT = 100;

/** The file Save this generation writes. */
export function generationFileName(generation) {
  return `explore-generation-${generation}.json`;
}

/**
 * An Explore run's definition, as a result file states it. Explore has no contest and no cell,
 * extent or generation limit; its memory limit depends on the machine, so it isn't part of it.
 * @param {{rules: object, cells: Int32Array, seed?: Int32Array, arena: number | null}} config -
 *   Explore's config; `seed` is the run's first seed when `cells` is a saved generation
 */
export function runDefinition(config) {
  const seed = config.seed ?? config.cells;
  const list = new Array(seed.length / 3);
  for (let k = 0; k < list.length; k++) list[k] = [seed[3 * k], seed[3 * k + 1], seed[3 * k + 2]];
  return {
    contest: null,
    rules: config.rules,
    seed: list,
    arena: arenaBox(config.arena),
    limits: { cells: null, extent: null, generations: null },
  };
}

/**
 * How a run stands, as a result's ending: a run still going, or paused, is saved as stopped
 * there; a run that ended keeps its reason, unless it was an error, which isn't a result.
 * @param {string} status - 'running', 'paused' or 'ended'
 * @param {string} [reason] - why it ended
 */
export function savedEnding(status, reason) {
  return status === 'ended' && RESULT_ENDINGS.includes(reason) ? reason : 'stopped';
}

/**
 * Save this generation's file.
 * @param {object} options
 * @param {object} options.config - Explore's config, as runDefinition() takes it
 * @param {number} options.generation
 * @param {Int32Array} options.cells - the generation's live cells, in any order
 * @param {string} options.ending - from savedEnding()
 * @param {object} [options.stats] - run.js's statistics, at the same moment
 * @param {number} [options.chunkSize]
 * @param {{name: string, version: string}} [options.browser]
 * @returns {Promise<{result: object, text: string}>}
 * @throws {SeedError} past MAX_FILE_CELLS live cells
 */
export async function generationSave({ config, generation, cells, ending, stats = null, chunkSize = null, browser = null }) {
  const live = cells.length / 3;
  if (live > MAX_FILE_CELLS) {
    throw new SeedError(`Generation ${generation.toLocaleString('en')} has ${live.toLocaleString('en')} live cells; a saved generation holds at most ${MAX_FILE_CELLS.toLocaleString('en')}.`);
  }
  const result = await resultFromCells({
    run: runDefinition(config),
    generation,
    cells,
    ending,
    details: { chunkSize, elapsedMs: stats?.elapsedMs ?? null, stats, browser },
    withCells: true,
  });
  return { result, text: resultText(result) };
}

/** Save seed's file: the run's first seed and its rules. */
export function seedSave(config) {
  return toSeedFile({ rules: config.rules, cells: config.seed ?? config.cells });
}

/**
 * Reads a file from Save this generation, as untrusted data, for a run that carries on from it.
 * @returns {Promise<{rules: object, cells: Int32Array, seed: Int32Array, from: number,
 *   arena: number | null, hash: string}>}
 * @throws {SeedError} saying what's wrong with it
 */
export async function readGenerationSave(text) {
  let result;
  try {
    result = readResult(text);
  } catch (err) {
    if (err instanceof ResultError) throw new SeedError(err.message);
    throw err;
  }
  if (!result.cells) {
    throw new SeedError("This result file doesn't hold its generation's cells, so Explore can't start from it. Files from Save this generation do.");
  }
  const wrong = await checkResultHashes(result);
  if (wrong) throw new SeedError(wrong);
  const { run } = result;
  if (run.limits.cells !== null || run.limits.extent !== null || run.limits.generations !== null) {
    throw new SeedError("This run has cell, extent or generation limits, which Explore doesn't keep, so it can't carry on here.");
  }
  let arena = null;
  if (run.arena) {
    arena = run.arena.max[0] - run.arena.min[0] + 1;
    const box = arenaBox(arena);
    const same = [0, 1, 2].every((a) => run.arena.min[a] === box.min[a] && run.arena.max[a] === box.max[a]);
    if (!same) throw new SeedError("This run's arena isn't a cube centred on the origin, the only arena Explore has.");
  }
  if (result.cells.length / 3 > MAX_FILE_CELLS) {
    throw new SeedError(`This generation has more than ${MAX_FILE_CELLS.toLocaleString('en')} live cells, the most Explore loads.`);
  }
  return {
    rules: run.rules,
    cells: Int32Array.from(result.cells.flat()),
    seed: Int32Array.from(run.seed.flat()),
    from: result.generation,
    arena,
    hash: result.hash,
  };
}

/**
 * Reads what Load… was given: a seed file, or a file from Save this generation.
 * @returns {Promise<{kind: 'seed', rules: object, cells: Int32Array}
 *   | {kind: 'generation'} & Awaited<ReturnType<typeof readGenerationSave>>>}
 */
export async function readSeedOrSave(text) {
  // Both formats write "format" first; a file that doesn't is read, and refused, as a seed file
  const format = /"format"\s*:\s*"([^"]*)"/.exec(text.slice(0, 4096))?.[1];
  if (format === RESULT_FORMAT) return { kind: 'generation', ...await readGenerationSave(text) };
  return { kind: 'seed', ...parseSeedFile(text) };
}

/**
 * The browser's name and version from its user agent, for a result's details, or null.
 * Order matters: Edge and Opera also say Chrome, and Chrome also says Safari.
 */
export function browserOf(userAgent) {
  const patterns = [
    ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ['Opera', /OPR\/([\d.]+)/],
    ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
    ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari\//],
  ];
  for (const [name, pattern] of patterns) {
    const match = pattern.exec(String(userAgent ?? ''));
    if (match) return { name, version: match[1].slice(0, MAX_TEXT) };
  }
  return null;
}
