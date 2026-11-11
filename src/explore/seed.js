// SPDX-License-Identifier: Apache-2.0
//
// Explore's seeds and rules, apart from the page: the existing seed shapes lifted into the
// unbounded world, rules read from the dialog's text, and the seed file a visitor exports and
// loads back. Nothing here touches the page, so the tests run it in Node.

import { Grid3D } from '../grid3D.js';
import { validateRules, MAX_NEIGHBOURS } from '../unbounded/rules.js';
import { COORDINATE_LIMIT } from '../unbounded/world.js';

/** The largest shape size Explore takes: its scratch grid is (2·size + 3)³ bytes. */
export const MAX_SHAPE_SIZE = 100;
/** The most cells a seed file may hold. */
export const MAX_FILE_CELLS = 1_000_000;
export const SEED_FILE_FORMAT = 'morpheus-tech-lab/explore-seed';
export const SEED_FILE_VERSION = 1;

export class SeedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SeedError';
  }
}

/**
 * Runs one of the existing shape functions (src/shapeGenerators.js) into a scratch grid big
 * enough for it, and lifts its cells into world coordinates, centred on the origin.
 * @param {(grid: Grid3D, size: number) => void} shapeFn
 * @param {number} size - the shape's size parameter, as the dialog has it
 * @param {number} [regionSize] - Perlin and Worley's region, which can be wider than the shape
 * @returns {Int32Array} x, y, z triples
 */
export function shapeSeed(shapeFn, size, regionSize = 0) {
  if (!Number.isInteger(size) || size < 1 || size > MAX_SHAPE_SIZE) {
    throw new SeedError(`The seed's size must be a whole number from 1 to ${MAX_SHAPE_SIZE}.`);
  }
  // Every shape stays within `size` cells of the grid's centre (a cube's half side, a
  // tetrahedron's height, an octahedron's radius), or within its region
  const side = Math.max(2 * size + 3, (regionSize || 0) + 1);
  const grid = new Grid3D(side, 0);
  shapeFn(grid, side);
  const centre = Math.floor(side / 2);
  const cells = new Int32Array(3 * grid.active.length);
  grid.active.forEach(([x, y, z], i) => {
    cells[3 * i] = x - centre;
    cells[3 * i + 1] = y - centre;
    cells[3 * i + 2] = z - centre;
  });
  return cells;
}

/**
 * Reads neighbour counts as the dialog shows them, such as "9,10" or "5-15, 18".
 * Unlike the other modes, Explore says what's wrong rather than dropping it.
 * @returns {number[]} sorted, without duplicates
 */
export function parseCounts(text, name) {
  const counts = new Set();
  for (const part of String(text ?? '').split(',').map((p) => p.trim()).filter(Boolean)) {
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    const single = /^\d+$/.test(part);
    if (!range && !single) {
      throw new SeedError(`The ${name} counts can't include "${part}": use numbers and ranges, such as 9,10 or 5-15.`);
    }
    const [from, to] = range ? [Number(range[1]), Number(range[2])].sort((a, b) => a - b) : [Number(part), Number(part)];
    if (to > MAX_NEIGHBOURS) {
      throw new SeedError(`The ${name} counts go up to ${MAX_NEIGHBOURS}, the number of neighbours a cell has; ${to} is too many.`);
    }
    for (let n = from; n <= to; n++) counts.add(n);
  }
  return [...counts].sort((a, b) => a - b);
}

/**
 * Reads and checks a rule from the dialog's birth and survival text.
 * @throws {SeedError | import('../unbounded/rules.js').RuleError} saying what's wrong
 */
export function parseRules(birthText, survivalText) {
  const birth = parseCounts(birthText, 'birth');
  if (!birth.length) throw new SeedError('Give at least one birth count, or no cell can ever be born.');
  return validateRules({ birth, survival: parseCounts(survivalText, 'survival') });
}

/** An arena of `side` cells, centred on the origin, as the engine takes it; null for none. */
export function arenaBox(side) {
  if (!side) return null;
  const min = -Math.floor(side / 2);
  return { min: [min, min, min], max: [min + side - 1, min + side - 1, min + side - 1] };
}

/** A seed and its rules as the text of a seed file. */
export function toSeedFile({ rules, cells }) {
  const list = [];
  for (let i = 0; i < cells.length; i += 3) list.push([cells[i], cells[i + 1], cells[i + 2]]);
  const head = JSON.stringify({ format: SEED_FILE_FORMAT, version: SEED_FILE_VERSION, rules }, null, 2);
  // One cell per line keeps a big file readable and diffable
  return `${head.slice(0, -2)},\n  "cells": [\n${list.map((c) => `    [${c.join(', ')}]`).join(',\n')}\n  ]\n}\n`;
}

/**
 * Reads a seed file back.
 * @returns {{rules: {birth: number[], survival: number[]}, cells: Int32Array}}
 * @throws {SeedError | import('../unbounded/rules.js').RuleError} saying what's wrong with it
 */
export function parseSeedFile(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new SeedError("This isn't a seed file: it isn't JSON.");
  }
  if (data?.format !== SEED_FILE_FORMAT) throw new SeedError("This isn't an Explore seed file.");
  if (data.version !== SEED_FILE_VERSION) {
    throw new SeedError(`This seed file is version ${data.version}; this page reads version ${SEED_FILE_VERSION}.`);
  }
  const rules = validateRules(data.rules);
  if (!Array.isArray(data.cells)) throw new SeedError("The seed file's cells must be a list.");
  if (data.cells.length > MAX_FILE_CELLS) {
    throw new SeedError(`The seed file has ${data.cells.length.toLocaleString('en')} cells; the most it can have is ${MAX_FILE_CELLS.toLocaleString('en')}.`);
  }
  const cells = new Int32Array(3 * data.cells.length);
  const seen = new Set();
  data.cells.forEach((cell, i) => {
    const ok = Array.isArray(cell) && cell.length === 3
      && cell.every((c) => Number.isInteger(c) && c >= -COORDINATE_LIMIT && c < COORDINATE_LIMIT);
    if (!ok) {
      throw new SeedError(`Cell ${i + 1} of the seed file isn't [x, y, z] in whole numbers from ${-COORDINATE_LIMIT} to ${COORDINATE_LIMIT - 1}.`);
    }
    const key = cell.join(',');
    if (seen.has(key)) throw new SeedError(`Cell ${i + 1} of the seed file, [${key}], is listed twice.`);
    seen.add(key);
    cells.set(cell, 3 * i);
  });
  return { rules, cells };
}
