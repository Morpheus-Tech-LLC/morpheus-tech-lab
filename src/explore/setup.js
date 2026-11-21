// SPDX-License-Identifier: Apache-2.0
//
// Explore's settings (#69), apart from the page: the seed's source, the rules, the arena (with
// what happens at its edge: the run ends, ships leave as in Classic Methuselah, #103, it wraps
// around, #115, or it has walls with their own corner, edge and face rules, #119) and the memory
// limit, held as one value,
// `state.explore`. The HUD's boxes show it and their popovers
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
// - {kind: 'file', name, cells, label?, rules?}: a file's cells. From a simulation file (#130),
//   `rules` are the file's, which went into the Rules box too: while the Rules box still holds
//   them, the simulation is the file's. From a seed file, or a file loaded as a seed, it has none.
// - {kind: 'saved', name, cells, seed, from, rules, arena}: a saved generation (#66), which
//   carries on from generation `from` under its own rules and arena, both locked.
// - {kind: 'design', cells}: a seed designed in the seed editor (#70), in the seed box, under the
//   rules in the Rules box.

import { PRESETS, presetById } from './presets.js';
import { shapeSeed, parseRules, parseCounts, arenaBox, MAX_SHAPE_SIZE, SeedError } from './seed.js';
import { designCells } from './editorModel.js';
import { MAX_NEIGHBOURS, validateRules, RuleError } from '../unbounded/rules.js';
import { WALL_NEIGHBOURS } from '../unbounded/world.js';
import { contestById } from '../unbounded/contests.js';
import { perlinShape, worleyShape, cubeOfSide, tetrahedronShape, octahedronShape } from '../shapeGenerators.js';

/**
 * Defaults pinned by #39's measurements: one tab in Chrome on a 16 GB machine could take 6 GB of
 * slabs, so 1 GB stays well under any laptop browser's cap. The arena is the Discovery contests'.
 */
export const DEFAULT_MEMORY_MB = 1024;
export const DEFAULT_ARENA = 64;
export const MEMORY_MB = { min: 64, max: 16384 };
export const ARENA_SIDE = { min: 8, max: 1024 };
/**
 * Ships leave at the edge (#103): with an arena, Explore lets ships of up to this period leave, as
 * Classic Methuselah does (departures.js), so a design behaves in Explore as it will there.
 */
export const SHIP_PERIOD = contestById('classic-methuselah-1').departures.period;
/**
 * What happens at the arena's edge (#115): the run ends, as in Methuselah; ships leave, as in
 * Classic Methuselah (#103); the arena wraps around, a torus whose opposite walls meet; or it has
 * walls (#119), past which is empty, whose corner, edge and face cells follow their own rules. No
 * contest wraps or has walls, so no such run can be saved as a result.
 */
export const EDGES = ['end', 'ships', 'wrap', 'walls'];
/** The kinds of wall cell, in the Limits popover's order, and the neighbours each has. */
export const WALL_KINDS = [
  { key: 'corner', name: 'Corner', neighbours: WALL_NEIGHBOURS.corner },
  { key: 'edge', name: 'Edge', neighbours: WALL_NEIGHBOURS.edge },
  { key: 'face', name: 'Face', neighbours: WALL_NEIGHBOURS.face },
];
/** The walls' rules until the visitor sets others: the old Game of Life 3D mode's defaults. */
export const DEFAULT_WALLS = Object.freeze({
  corner: Object.freeze({ birth: [2, 3], survival: [2, 3, 4] }),
  edge: Object.freeze({ birth: [4], survival: [2, 3, 4, 5, 6] }),
  face: Object.freeze({ birth: [6], survival: [3, 4, 5, 6, 7, 8, 9] }),
});
/** Explore's rules until the visitor sets others: the lab's default, B9,10/S5-15. */
export const DEFAULT_RULES = Object.freeze({
  birth: [9, 10],
  survival: Array.from({ length: 11 }, (_, i) => 5 + i),
});

const PRESET_SHAPE = 'preset:';

/** The shapes a seed can take, in the Seed popover's order: a preset's cells are one, without its rules. */
export const SHAPES = [
  { key: 'cube', name: 'Cube' },
  { key: 'tetrahedron', name: 'Tetrahedron' },
  { key: 'octahedron', name: 'Octahedron' },
  { key: 'perlin', name: 'Perlin noise', short: 'Perlin', noise: true },
  { key: 'worley', name: 'Worley noise', short: 'Worley', noise: true },
  // #67: the presets' cells, under the rules in the Rules box; the ships' (#105) in their group
  ...PRESETS.map((preset) => ({
    key: `${PRESET_SHAPE}${preset.id}`, name: `${preset.name}'s cells`, preset: preset.id, ...(preset.group && { group: preset.group }),
  })),
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
 * with no arena, the run ending at its edge when there is one, and the walls' default rules for
 * when it has walls.
 * @param {{size: number, density: number}} cube - the cube's size and density
 */
export function initialSetup(cube) {
  return {
    seed: makeShape('cube', cube),
    rules: DEFAULT_RULES,
    arena: null,
    arenaSize: DEFAULT_ARENA,
    edge: 'end',
    walls: DEFAULT_WALLS,
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
    throw new SeedError(`In Game of Life 3D (unbounded), the seed's size must be a whole number from 1 to ${MAX_SHAPE_SIZE}.`);
  }
  if (!(density >= 0 && density <= 1)) throw new SeedError("The seed's density must be from 0 to 1.");
  if (!Number.isInteger(regionSize) || regionSize < 0 || regionSize > 2 * MAX_SHAPE_SIZE) {
    throw new SeedError(`In Game of Life 3D (unbounded), the region size must be a whole number up to ${2 * MAX_SHAPE_SIZE}.`);
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
 * The simulation a file loaded with the Simulation box's Load simulation… gives (#130): a
 * simulation file's seed and rules, or a saved generation, which carries on from its generation.
 * @param {string} name - the file's name
 * @param {object} loaded - what readSeedOrSave() read from it
 * @throws {SeedError} for a seed file, which has no rules to make a simulation
 */
export function simulationFile(name, loaded) {
  if (loaded.kind === 'generation') {
    const { cells, seed, from, rules, arena } = loaded;
    return { kind: 'saved', name, cells, seed, from, rules, arena };
  }
  if (!loaded.rules) {
    throw new SeedError(`${name} is a seed file: it holds cells, but no rules, so it isn't a simulation. Load it from the Seed box, under File, to run it under the rules in the Rules box.`);
  }
  return { kind: 'file', name, cells: loaded.cells, rules: loaded.rules };
}

/**
 * The seed a file loaded with the Seed box's Load seed… gives: its cells only, under the rules in
 * the Rules box, from a seed file or a simulation file (#130).
 * @param {string} name - the file's name
 * @param {object} loaded - what readSeedOrSave() read from it
 * @throws {SeedError} for a saved generation, which is a whole simulation mid-run
 */
export function fileSeed(name, loaded) {
  if (loaded.kind === 'generation') {
    throw new SeedError(`${name} is a saved generation: a simulation carried on from generation ${loaded.from.toLocaleString('en')}, not a seed. Load it from the Simulation box, with Load simulation….`);
  }
  return { kind: 'file', name, cells: loaded.cells };
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
 * A file loaded with the editor's own Load…, which takes seed files and simulation files, not
 * saved generations.
 * @param {string} name - the file's name
 * @param {object} loaded - what readSeedOrSave() read from it
 * @returns {{places: Uint8Array, rules: {birth: number[], survival: number[]} | null}} - no rules
 *   from a seed file
 * @throws {SeedError} for a saved generation, or a seed that doesn't fit the seed box
 */
export function designFile(name, loaded) {
  if (loaded.kind === 'generation') {
    throw new SeedError(`${name} is a saved generation. ${SAVED_NO_DESIGN} Load simulation… in the Simulation box carries it on.`);
  }
  try {
    return { places: designCells(loaded.cells), rules: loaded.rules };
  } catch (err) {
    if (err instanceof SeedError) throw new SeedError(`${name} can't open here: ${err.message} Load seed… in the Seed box still runs it.`);
    throw err;
  }
}

/**
 * The editor's Use: the design becomes the seed, a Custom simulation, with `rules` in the Rules box,
 * unlocked: the rules it opened with, or those of a simulation file it loaded.
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
 * What happens at the arena's edge (one of EDGES): the visitor's choice, with an arena. A saved
 * generation carries on as it was saved, and a saved file records neither departures nor
 * wrapping (Save this generation refuses once a ship has left, and while the arena wraps), so its
 * run ends at the edge. With no arena, there is no edge to reach.
 */
export function edgeOf(setup) {
  return setup.seed.kind !== 'saved' && setup.arena !== null ? setup.edge : 'end';
}

/** Whether ships leave at the arena's edge (#103). */
export function shipsOf(setup) {
  return edgeOf(setup) === 'ships';
}

/** Whether the arena wraps around (#115). */
export function wrapOf(setup) {
  return edgeOf(setup) === 'wrap';
}

/** The walls' rules, when the arena has walls (#119), or null. */
export function wallsOf(setup) {
  return edgeOf(setup) === 'walls' ? setup.walls : null;
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

/**
 * What the Seed box names the seed: short, to share its line with the save icon (#130). A shape
 * is its name and size, and its density as a share when not every cell lives ("Cube 10",
 * "Perlin 10, 30%"); the popover has the rest.
 */
export function seedLabel(seed) {
  const n = (x) => x.toLocaleString('en');
  switch (seed.kind) {
    case 'preset':
      return presetById(seed.id).name;
    case 'file':
      return seed.label ?? seed.name;
    case 'saved':
      return `Gen ${n(seed.from)}: ${seed.name}`;
    case 'design':
      return 'Design';
    default: {
      const shape = shapeByKey(seed.key);
      if (shape.preset) return presetById(shape.preset).name;
      if (!seed.params) return shape.name;
      const { size, density } = seed.params;
      const share = density === 1 ? '' : `, ${Math.round(density * 100)}%`;
      return `${shape.short ?? shape.name} ${size}${share}`;
    }
  }
}

/**
 * The simulation in use, a seed and its rules (#130), as the Simulation box names it: a saved
 * generation, or a simulation file while its seed and rules are the ones it brought; a preset
 * whenever the seed and rules are a preset's, however they were set, so the lab opens on Cube10;
 * and otherwise Custom, a seed and rules of the visitor's own.
 * @returns {{name: string, from: 'preset' | 'file' | 'saved' | null, id?: string}} - id: the preset's
 */
export function simulationOf(setup) {
  const { seed } = setup;
  if (seed.kind === 'preset') return { name: presetById(seed.id).name, from: 'preset', id: seed.id };
  if (seed.kind === 'saved') return { name: `Generation ${seed.from.toLocaleString('en')} of ${seed.name}`, from: 'saved' };
  if (seed.kind === 'file' && seed.rules && sameRules(seed.rules, setup.rules)) return { name: seed.name, from: 'file' };
  const preset = matchingPreset(seed.cells, setup.rules);
  if (preset) return { name: preset.name, from: 'preset', id: preset.id };
  return { name: 'Custom', from: null };
}

/** The preset whose cells and rules these are, in any order of cells, or undefined. */
function matchingPreset(cells, rules) {
  return PRESETS.find((preset) => preset.cells.length === cells.length && sameRules(preset.rules, rules)
    && cellsKey(preset.cells) === cellsKey(cells));
}

// Cells as one string, sorted, so the same cells match in any order; kept per array
const cellKeys = new WeakMap();
function cellsKey(cells) {
  let key = cellKeys.get(cells);
  if (key === undefined) {
    const list = [];
    for (let i = 0; i < cells.length; i += 3) list.push(`${cells[i]},${cells[i + 1]},${cells[i + 2]}`);
    key = list.sort().join(';');
    cellKeys.set(cells, key);
  }
  return key;
}

function sameRules(a, b) {
  const same = (x, y) => x.length === y.length && x.every((v, i) => v === y[i]);
  return same(a.birth, b.birth) && same(a.survival, b.survival);
}

/**
 * What each HUD box shows.
 * @returns {{seed: string, cells: number, rules: {birth: number[], survival: number[]},
 *   lock: string | null, arena: number | null, arenaLocked: boolean, edge: string, walls: object | null,
 *   memoryMB: number}}
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
    edge: edgeOf(setup),
    walls: wallsOf(setup),
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
  const ships = shipsOf(setup);
  const wrap = wrapOf(setup);
  const walls = wallsOf(setup);
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
  if (seed.kind === 'saved') return { rules, cells, memoryMB, arena, ships, wrap, walls, label, seed: seed.seed, from: seed.from };
  return { rules, cells, memoryMB, arena, ships, wrap, walls, label };
}

/**
 * The world a run of a config steps in, as the Worker takes it: the rules, the memory limit, the
 * arena, and with Ships leave (#103) the departure rule, as Classic Methuselah's world has it, so
 * a run settles, emits or ends at the edge where the contest's would; with It wraps around
 * (#115), the arena as a torus; or with Walls (#119), the walls' rules.
 * @param {{rules: object, memoryMB: number, arena: number | null, ships?: boolean, wrap?: boolean,
 *   walls?: object | null}} config - from configOf()
 */
export function worldOf(config) {
  const world = { rules: config.rules, limits: { memory: config.memoryMB * 2 ** 20 } };
  const arena = arenaBox(config.arena);
  if (arena) world.arena = arena;
  if (arena && config.ships) world.departures = { period: SHIP_PERIOD };
  else if (arena && config.wrap) world.wrap = true;
  else if (arena && config.walls) world.walls = config.walls;
  return world;
}

// Every change ends here: the new setup must make a run, or it is refused
function checked(setup) {
  configOf(setup);
  return setup;
}

// ---- Changes, one per popover ----

/**
 * A new seed. A simulation, from the Simulation box (#130), brings its rules: a simulation
 * file's go into the Rules box; a preset's and a saved generation's come with the seed, locked.
 * A seed alone, from the Seed box, keeps the rules in use, a preset's or a saved generation's
 * (and its arena) too, now the visitor's own.
 * @param {object} seed - from makeShape(), presetSeed(), simulationFile(), fileSeed() or designSeed()
 */
export function changeSeed(setup, seed) {
  if (seed.kind === 'file' && seed.rules) return checked({ ...setup, seed, rules: seed.rules });
  if (seed.kind === 'preset' || seed.kind === 'saved') return checked({ ...setup, seed });
  return checked({ ...ownRules(setup), seed });
}

/**
 * Use your own rules: the same cells, as a Custom simulation from generation 0, with the rules (and,
 * for a saved generation, the arena) it had, now the visitor's to change. A setup that nothing
 * locks comes back as it is.
 */
export function ownRules(setup) {
  const { seed } = setup;
  if (seed.kind === 'preset') {
    return { ...setup, seed: makeShape(`${PRESET_SHAPE}${seed.id}`), rules: rulesOf(setup) };
  }
  if (seed.kind === 'saved') {
    const label = `Gen ${seed.from.toLocaleString('en')}: ${seed.name}`;
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
 * The walls' rules from the Limits popover's text, each kind checked against the neighbours its
 * cells have. A wall may have no birth count: its cells are then only ever kept, never born.
 * @param {{corner: {birth: string, survival: string}, edge: object, face: object}} texts
 * @returns {{corner: object, edge: object, face: object}}
 * @throws {SeedError | RuleError} naming the kind of wall cell
 */
export function parseWalls(texts) {
  const walls = {};
  for (const { key, name, neighbours } of WALL_KINDS) {
    const what = `${name.toLowerCase()} cells'`;
    const birth = parseCounts(texts[key]?.birth, `${what} birth`);
    const survival = parseCounts(texts[key]?.survival, `${what} survival`);
    try {
      walls[key] = validateRules({ birth, survival });
    } catch (err) {
      if (err instanceof RuleError) throw new RuleError(`On the walls' ${name.toLowerCase()} cells: ${err.message}`);
      throw err;
    }
    const past = [...birth, ...survival].find((count) => count > neighbours);
    if (past !== undefined) {
      const a = key === 'edge' ? 'An' : 'A';
      throw new SeedError(`${a} ${name.toLowerCase()} cell has ${neighbours} neighbours inside the walls, so its counts go from 0 to ${neighbours}; ${past} is past them.`);
    }
  }
  return walls;
}

/**
 * The Limits popover's arena: on or off, its side, and what happens at its edge.
 * @param {boolean} on
 * @param {string | number} sideText - the side, also remembered while the arena is off
 * @param {{own?: boolean, edge?: string, walls?: object}} [options] - own: the visitor pressed Use
 *   your own rules; edge: one of EDGES, remembered while the arena is off; walls: the walls'
 *   rules, as parseWalls() takes them, remembered while another edge is chosen. Each is kept as it
 *   was if not given.
 */
export function changeArena(setup, on, sideText, { own = false, edge, walls } = {}) {
  const lock = lockOf(setup);
  if (lock?.by === 'saved' && !own) throw new SeedError(lockedMessage(lock, 'arena'));
  const base = own ? ownRules(setup) : setup;
  const side = Number(sideText);
  const ok = Number.isInteger(side) && side >= ARENA_SIDE.min && side <= ARENA_SIDE.max;
  if (on && !ok) {
    throw new SeedError(`The arena size must be a whole number of cells, from ${ARENA_SIDE.min} to ${ARENA_SIDE.max}.`);
  }
  if (edge !== undefined && !EDGES.includes(edge)) throw new SeedError(`What happens at the edge must be one of ${EDGES.join(', ')}.`);
  const wallRules = walls === undefined ? base.walls : parseWalls(walls);
  return checked({ ...base, arena: on ? side : null, arenaSize: ok ? side : base.arenaSize, edge: edge ?? base.edge, walls: wallRules });
}

/**
 * Explore's arena set to a contest's (#94), for designing an entry: with the same arena, and ships
 * leaving at its edge as they do in Classic Methuselah (#103) or not as in Methuselah, a run in
 * Explore settles, or reaches the edge, where the contest's run would. No contest wraps or has
 * walls, so an arena that wrapped (#115) or had walls (#119) no longer does. A saved generation
 * keeps its own arena, so it is left as it is, and the note says so.
 * @param {number} side - the contest's arena, a cube of this many cells a side
 * @param {string} title - the contest's, for the note
 * @param {boolean} [ships] - whether ships leave at the contest's edge
 * @returns {{setup: object, note: string}} the setup to use, and what changed, for the editor
 */
export function contestArena(setup, side, title, ships = false) {
  const same = `a run here settles, or reaches the edge, where ${title}'s would, though Game of Life 3D (unbounded) doesn't stop at its budget.`;
  const leaving = ships ? ', with ships leaving at its edge' : '';
  const edge = ships ? 'ships' : 'end';
  if (arenaOf(setup) === side && edgeOf(setup) === edge) return { setup, note: `The arena in Game of Life 3D (unbounded) is ${side}³${leaving}, as ${title}'s: ${same}` };
  try {
    const next = changeArena(setup, true, side, { edge });
    let note;
    if (arenaOf(setup) !== side) {
      note = `The arena in Game of Life 3D (unbounded) is now on, at ${side}³${leaving}, as ${title}'s: ${same} The Limits box turns it off.`;
    } else if (wrapOf(setup) || wallsOf(setup)) {
      const was = wrapOf(setup) ? 'no longer wraps around' : 'no longer has walls';
      note = `The ${side}³ arena in Game of Life 3D (unbounded) ${was}${ships ? ', and ships leave at its edge' : ''}, as in ${title}: ${same} The Limits box changes it.`;
    } else {
      note = `Ships ${ships ? 'now leave' : 'no longer leave'} at the edge of the ${side}³ arena in Game of Life 3D (unbounded), as in ${title}: ${same} The Limits box changes it.`;
    }
    return { setup: next, note };
  } catch (err) {
    if (!(err instanceof SeedError)) throw err;
    return { setup, note: `The arena in Game of Life 3D (unbounded) stays the saved generation's, so a run of it here may not end as ${title}'s would.` };
  }
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
