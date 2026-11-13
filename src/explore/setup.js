// SPDX-License-Identifier: Apache-2.0
//
// Explore's settings (#69), apart from the page: the seed's source, the rules, the arena and the
// memory limit, held as one value, `state.explore`. The HUD's boxes show it and their popovers
// change it (hud.js); this module says what each box shows, what is locked and why, checks a
// change and gives the config startExplore() takes. Nothing here touches the page, so the tests
// run it in Node.
//
// A setup is never changed in place: each change gives a new one, or throws a SeedError saying
// why it is refused, and the setup stays as it was.
//
// The seed is one of:
// - {kind: 'shape', key, params, cells}: a shape (cube, tetrahedron, octahedron, perlin, worley)
//   with its parameters, or a preset's cells without its rules (key 'preset:<id>', no params).
//   Its cells are made once, when it is chosen, so a change to the rules or the arena runs the
//   same cells again.
// - {kind: 'preset', id, cells}: a preset, whose rules are locked (#58).
// - {kind: 'file', name, cells, label?}: a seed file's cells. Its rules went into the Rules box.
// - {kind: 'saved', name, cells, seed, from, rules, arena}: a saved generation (#66), which
//   carries on from generation `from` under its own rules and arena, both locked.
// - {kind: 'design', cells}: a seed designed in the seed editor (#70), in the seed box, under the
//   rules in the Rules box.

import { PRESETS, presetById } from './presets.js';
import { shapeSeed, parseRules, arenaBox, MAX_SHAPE_SIZE, SeedError } from './seed.js';
import { designCells } from './editorModel.js';
import { MAX_NEIGHBOURS } from '../unbounded/rules.js';
import { perlinShape, worleyShape, cubeOfSide, tetrahedronShape, octahedronShape } from '../shapeGenerators.js';

/**
 * Defaults pinned by #39's measurements: one tab in Chrome on a 16 GB machine could take 6 GB of
 * slabs, so 1 GB stays well under any laptop browser's cap. The arena is the Discovery contests'.
 */
export const DEFAULT_MEMORY_MB = 1024;
export const DEFAULT_ARENA = 64;
export const MEMORY_MB = { min: 64, max: 16384 };
export const ARENA_SIDE = { min: 8, max: 1024 };
/** Explore's rules until the visitor sets others: the lab's default, B9,10/S5-15. */
export const DEFAULT_RULES = Object.freeze({
  birth: [9, 10],
  survival: Array.from({ length: 11 }, (_, i) => 5 + i),
});

const PRESET_SHAPE = 'preset:';

/** The shapes a Custom seed can take, in the Seed popover's order. */
export const SHAPES = [
  { key: 'cube', name: 'Cube' },
  { key: 'tetrahedron', name: 'Tetrahedron' },
  { key: 'octahedron', name: 'Octahedron' },
  { key: 'perlin', name: 'Perlin noise', noise: true },
  { key: 'worley', name: 'Worley noise', noise: true },
  // #67: the presets' cells, under the rules in the Rules box
  ...PRESETS.map((preset) => ({ key: `${PRESET_SHAPE}${preset.id}`, name: `${preset.name}'s cells`, preset: preset.id })),
];

const MAKERS = {
  cube: ({ size, density }) => cubeOfSide(size, density),
  tetrahedron: ({ size, density }) => tetrahedronShape(size, density),
  octahedron: ({ size, density }) => octahedronShape(size, density),
  perlin: ({ size, density, regionSize }) => perlinShape(size, density, regionSize || null),
  worley: ({ size, density, regionSize }) => worleyShape(size, density, regionSize || null),
};

/** @returns {{key: string, name: string, noise?: boolean, preset?: string} | undefined} */
export function shapeByKey(key) {
  return SHAPES.find((shape) => shape.key === key);
}

/**
 * The setup Explore opens with: the cube in the dialog's shape settings, under the default rules,
 * with no arena.
 * @param {{size: number, density: number}} cube - the cube's size and density
 */
export function initialSetup(cube) {
  return {
    seed: makeShape('cube', cube),
    rules: DEFAULT_RULES,
    arena: null,
    arenaSize: DEFAULT_ARENA,
    memoryMB: DEFAULT_MEMORY_MB,
  };
}

// ---- Seeds ----

/**
 * A shape seed, its parameters checked and its cells made.
 * @param {string} key - one of SHAPES
 * @param {{size?: number, density?: number, regionSize?: number}} [params] - as the popover's
 *   fields give them; a preset's cells take none
 * @param {object} [current] - the seed now in use: if it is the same shape with the same
 *   parameters, its cells are kept, so a random density doesn't draw new ones
 * @throws {SeedError} saying what's wrong
 */
export function makeShape(key, params = {}, current = null) {
  const shape = shapeByKey(key);
  if (!shape) throw new SeedError('Pick a shape for the seed.');
  if (shape.preset) return { kind: 'shape', key, cells: presetById(shape.preset).cells };
  // An empty field is refused, not read as 0
  const number = (value) => (value === '' || value === null || value === undefined ? NaN : Number(value));
  const size = number(params.size);
  const density = number(params.density);
  const regionSize = shape.noise ? Number(params.regionSize) || 0 : 0;
  if (!Number.isInteger(size) || size < 1 || size > MAX_SHAPE_SIZE) {
    throw new SeedError(`In Explore, the seed's size must be a whole number from 1 to ${MAX_SHAPE_SIZE}.`);
  }
  if (!(density >= 0 && density <= 1)) throw new SeedError("The seed's density must be from 0 to 1.");
  if (!Number.isInteger(regionSize) || regionSize < 0 || regionSize > 2 * MAX_SHAPE_SIZE) {
    throw new SeedError(`In Explore, the region size must be a whole number up to ${2 * MAX_SHAPE_SIZE}.`);
  }
  const checked = shape.noise ? { size, density, regionSize } : { size, density };
  if (current?.kind === 'shape' && current.key === key && sameParams(current.params, checked)) return current;
  return { kind: 'shape', key, params: checked, cells: shapeSeed(MAKERS[key](checked), size, regionSize) };
}

function sameParams(a, b) {
  if (!a) return false;
  const keys = Object.keys(b);
  return keys.length === Object.keys(a).length && keys.every((k) => a[k] === b[k]);
}

/** A preset seed. @throws {SeedError} for an unknown preset */
export function presetSeed(id) {
  const preset = presetById(id);
  if (!preset) throw new SeedError('Pick a preset.');
  return { kind: 'preset', id, cells: preset.cells };
}

/**
 * The seed a file loaded with Load… gives.
 * @param {string} name - the file's name
 * @param {object} loaded - what readSeedOrSave() read from it
 */
export function fileSeed(name, loaded) {
  if (loaded.kind === 'generation') {
    const { cells, seed, from, rules, arena } = loaded;
    return { kind: 'saved', name, cells, seed, from, rules, arena };
  }
  return { kind: 'file', name, cells: loaded.cells, rules: loaded.rules };
}

/** A seed designed in the seed editor. @param {Int32Array} cells */
export function designSeed(cells) {
  return { kind: 'design', cells };
}

// ---- The seed editor ----

const SAVED_NO_DESIGN = "A saved generation carries on under its own rules and arena, so it can't open as a design.";

/**
 * What the seed editor opens on from Design…: the seed in use, if it is a seed that fits the seed
 * box, with the rules in the Rules box; otherwise an empty box, and why.
 * @returns {{places: Uint8Array | null, rules: {birth: number[], survival: number[]},
 *   reason: string | null}} places from designCells(), or null with the reason
 */
export function designOf(setup) {
  const rules = rulesOf(setup);
  if (setup.seed.kind === 'saved') return { places: null, rules, reason: SAVED_NO_DESIGN };
  try {
    return { places: designCells(setup.seed.cells), rules, reason: null };
  } catch (err) {
    if (!(err instanceof SeedError)) throw err;
    return { places: null, rules, reason: err.message };
  }
}

/**
 * What Edit a copy… opens: a preset's cells, which come with its rules, to be used unlocked.
 * @returns {{places: Uint8Array, rules: {birth: number[], survival: number[]}, name: string}}
 * @throws {SeedError} for an unknown preset
 */
export function presetCopy(id) {
  const preset = presetById(id);
  if (!preset) throw new SeedError('Pick a preset.');
  return { places: designCells(preset.cells), rules: preset.rules, name: preset.name };
}

/**
 * A file loaded with the editor's own Load…, which takes seed files only.
 * @param {string} name - the file's name
 * @param {object} loaded - what readSeedOrSave() read from it
 * @returns {{places: Uint8Array, rules: {birth: number[], survival: number[]}}}
 * @throws {SeedError} for a saved generation, or a seed that doesn't fit the seed box
 */
export function designFile(name, loaded) {
  if (loaded.kind === 'generation') {
    throw new SeedError(`${name} is a saved generation. ${SAVED_NO_DESIGN} Load… in the Seed box carries it on.`);
  }
  try {
    return { places: designCells(loaded.cells), rules: loaded.rules };
  } catch (err) {
    if (err instanceof SeedError) throw new SeedError(`${name} can't open here: ${err.message} Load… in the Seed box still runs it.`);
    throw err;
  }
}

/**
 * The editor's Use: the design becomes the seed, under Custom, with `rules` in the Rules box,
 * unlocked: the rules it opened with, a copied preset's or a loaded file's.
 * @param {Int32Array} cells
 * @param {{birth: number[], survival: number[]}} rules
 * @throws {SeedError} for an empty design, or one that doesn't fit the arena
 */
export function useDesign(setup, cells, rules) {
  return checked({ ...setup, seed: designSeed(cells), rules });
}

// ---- What the boxes show ----

/** The rules a run uses: a preset's or a saved generation's, or the visitor's own. */
export function rulesOf(setup) {
  const { seed } = setup;
  if (seed.kind === 'preset') return presetById(seed.id).rules;
  if (seed.kind === 'saved') return seed.rules;
  return setup.rules;
}

/** The arena a run uses: a saved generation's, or the visitor's. @returns {number | null} */
export function arenaOf(setup) {
  return setup.seed.kind === 'saved' ? setup.seed.arena : setup.arena;
}

/**
 * What locks the rules (and, for a saved generation, the arena), or null when nothing does.
 * @returns {{by: 'preset' | 'saved', name: string, text: string} | null}
 */
export function lockOf(setup) {
  const { seed } = setup;
  if (seed.kind === 'preset') {
    const { name } = presetById(seed.id);
    return { by: 'preset', name, text: `with ${name}` };
  }
  if (seed.kind === 'saved') return { by: 'saved', name: seed.name, text: 'with the saved generation' };
  return null;
}

/** The generation a run of this setup starts from: 0, or a saved generation's. */
export function startOf(setup) {
  return setup.seed.kind === 'saved' ? setup.seed.from : 0;
}

/** What Apply does to the run, said before it is pressed. */
export function restartNote(from) {
  return `Applying restarts the run from generation ${from.toLocaleString('en')}.`;
}

/** What the Seed box names the seed. */
export function seedLabel(seed) {
  const n = (x) => x.toLocaleString('en');
  switch (seed.kind) {
    case 'preset':
      return presetById(seed.id).name;
    case 'file':
      return seed.label ?? `Seed file: ${seed.name}`;
    case 'saved':
      return `Saved generation ${n(seed.from)}: ${seed.name}`;
    case 'design':
      return `Design: ${n(seed.cells.length / 3)} cells`;
    default: {
      const shape = shapeByKey(seed.key);
      if (!seed.params) return shape.name;
      const { size, density, regionSize } = seed.params;
      const region = regionSize ? `, region ${regionSize}` : '';
      if (seed.key === 'perlin') return `${shape.name}, detail ${size}, fill ${density}${region}`;
      if (seed.key === 'worley') return `${shape.name}, ${size} points, distance ${density}${region}`;
      return `${shape.name}, size ${size}, density ${density}`;
    }
  }
}

/**
 * What each HUD box shows.
 * @returns {{seed: string, cells: number, rules: {birth: number[], survival: number[]},
 *   lock: string | null, arena: number | null, arenaLocked: boolean, memoryMB: number}}
 */
export function boxesOf(setup) {
  const lock = lockOf(setup);
  return {
    seed: seedLabel(setup.seed),
    cells: setup.seed.cells.length / 3,
    rules: rulesOf(setup),
    lock: lock?.text ?? null,
    arena: arenaOf(setup),
    arenaLocked: lock?.by === 'saved',
    memoryMB: setup.memoryMB,
  };
}

/**
 * The neighbour counts a live cell dies with, under `survival`: isolation (below every survival
 * count), overcrowding (above every one), and the gaps Survival leaves between them, which the
 * other modes' isolation and overcrowding don't show. With no survival count, every count kills.
 * @param {number[]} survival - sorted, without duplicates
 * @returns {{isolation: number[], overcrowding: number[], gaps: number[]}}
 */
export function deathCounts(survival) {
  const all = Array.from({ length: MAX_NEIGHBOURS + 1 }, (_, n) => n);
  if (!survival.length) return { isolation: all, overcrowding: [], gaps: [] };
  const lo = survival[0];
  const hi = survival[survival.length - 1];
  const keeps = new Set(survival);
  return {
    isolation: all.filter((n) => n < lo),
    overcrowding: all.filter((n) => n > hi),
    gaps: all.filter((n) => n > lo && n < hi && !keeps.has(n)),
  };
}

// ---- The run ----

/**
 * The config startExplore() takes, as the settings dialog built it before #69.
 * @throws {SeedError} when the run can't start: an empty seed, or one outside the arena
 */
export function configOf(setup) {
  const { seed, memoryMB } = setup;
  const rules = rulesOf(setup);
  const arena = arenaOf(setup);
  const { cells } = seed;
  if (!cells.length) {
    const why = {
      saved: 'This saved generation has no live cells, so there is nothing to carry on.',
      design: 'The design has no live cells: switch some on first.',
    };
    throw new SeedError(why[seed.kind] ?? 'The seed has no live cells: raise its density or its size.');
  }
  const box = arenaBox(arena);
  if (box) {
    for (let i = 0; i < cells.length; i++) {
      const a = i % 3;
      if (cells[i] < box.min[a] || cells[i] > box.max[a]) {
        throw new SeedError(`The seed doesn't fit inside a ${arena}³ arena: make the arena bigger or the seed smaller.`);
      }
    }
  }
  const label = seedLabel(seed);
  // A saved generation: `cells` is generation `from`, and `seed` the run's first seed
  if (seed.kind === 'saved') return { rules, cells, memoryMB, arena, label, seed: seed.seed, from: seed.from };
  return { rules, cells, memoryMB, arena, label };
}

// Every change ends here: the new setup must make a run, or it is refused
function checked(setup) {
  configOf(setup);
  return setup;
}

// ---- Changes, one per popover ----

/**
 * The Seed popover's Apply. A seed file's rules go into the Rules box; a preset's and a saved
 * generation's come with the seed, and the visitor's own rules stay for the next Custom seed.
 * @param {object} seed - from makeShape(), presetSeed() or fileSeed()
 */
export function changeSeed(setup, seed) {
  const next = { ...setup, seed };
  if (seed.kind === 'file' && seed.rules) {
    next.rules = seed.rules;
    next.seed = { ...seed };
    delete next.seed.rules;
  }
  return checked(next);
}

/**
 * Use your own rules: the same cells, as a Custom seed from generation 0, with the rules (and,
 * for a saved generation, the arena) it had, now the visitor's to change. A setup that nothing
 * locks comes back as it is.
 */
export function ownRules(setup) {
  const { seed } = setup;
  if (seed.kind === 'preset') {
    return { ...setup, seed: makeShape(`${PRESET_SHAPE}${seed.id}`), rules: rulesOf(setup) };
  }
  if (seed.kind === 'saved') {
    const label = `Generation ${seed.from.toLocaleString('en')} of ${seed.name}`;
    return {
      ...setup,
      seed: { kind: 'file', name: seed.name, cells: seed.cells, label },
      rules: seed.rules,
      arena: seed.arena,
      arenaSize: seed.arena ?? setup.arenaSize,
    };
  }
  return setup;
}

/**
 * The Rules popover's Apply.
 * @param {string} birthText
 * @param {string} survivalText
 * @param {{own?: boolean}} [options] - own: the visitor pressed Use your own rules
 */
export function changeRules(setup, birthText, survivalText, { own = false } = {}) {
  const lock = lockOf(setup);
  if (lock && !own) throw new SeedError(lockedMessage(lock, 'rules'));
  const base = own ? ownRules(setup) : setup;
  return checked({ ...base, rules: parseRules(birthText, survivalText) });
}

/**
 * The Limits popover's arena: on or off, and its side.
 * @param {boolean} on
 * @param {string | number} sideText - the side, also remembered while the arena is off
 * @param {{own?: boolean}} [options] - own: the visitor pressed Use your own rules
 */
export function changeArena(setup, on, sideText, { own = false } = {}) {
  const lock = lockOf(setup);
  if (lock?.by === 'saved' && !own) throw new SeedError(lockedMessage(lock, 'arena'));
  const base = own ? ownRules(setup) : setup;
  const side = Number(sideText);
  const ok = Number.isInteger(side) && side >= ARENA_SIDE.min && side <= ARENA_SIDE.max;
  if (on && !ok) {
    throw new SeedError(`The arena size must be a whole number of cells, from ${ARENA_SIDE.min} to ${ARENA_SIDE.max}.`);
  }
  return checked({ ...base, arena: on ? side : null, arenaSize: ok ? side : base.arenaSize });
}

/** The Limits popover's memory limit. @param {string | number} text - the limit in MB */
export function changeMemory(setup, text) {
  const memoryMB = Number(text);
  if (!Number.isInteger(memoryMB) || memoryMB < MEMORY_MB.min || memoryMB > MEMORY_MB.max) {
    throw new SeedError(`The memory limit must be a whole number of MB, from ${MEMORY_MB.min} to ${MEMORY_MB.max}.`);
  }
  return checked({ ...setup, memoryMB });
}

function lockedMessage(lock, what) {
  const owner = lock.by === 'preset' ? `${lock.name} brings its own rules` : `The saved generation carries on under its own rules and arena`;
  return `${owner}: press Use your own rules to change the ${what}.`;
}
