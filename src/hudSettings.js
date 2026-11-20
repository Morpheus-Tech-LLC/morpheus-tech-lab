// SPDX-License-Identifier: Apache-2.0
//
// Every mode's settings in the HUD (#130), as Game of Life 3D (unbounded) has had them since #69
// (src/explore/hud.js). The settings dialog these replace is gone:
//
// - The Mode box's gear picks the mode. Each mode keeps its own settings, so switching back to one
//   runs it as it was.
// - In the precomputed modes, Game of Life 3D (bounded), Rule 30, the sine wave and the sandpile,
//   the Grid, Seed and Rules boxes' gears open popovers beside their box, whose Apply computes the
//   run again. Grid: size and generations (Rule 30's size follows its generations; the sandpile's
//   follows them until it is changed), Rule 30's 3D, the sandpile's initial sand, and the bounded
//   mode's edge: wrapping around, or walls with their own corner, edge and face rules. Seed: the
//   bounded mode's shape. Rules: its birth and survival.
//
// Above a high memory estimate, Apply asks first (#123), in the popover: Run anyway, or Change
// settings. Cancel, Esc or a click outside changes nothing (popover.js).

import { state } from './state.js';
import { initSimulation } from './simulationModel.js';
import { openPopover, closePopover, isPopoverOpen, placeOpenPopover } from './explore/popover.js';
import { parseCounts } from './explore/seed.js';
import { parseWalls } from './explore/setup.js';
import { rule30Size, sandpileSize, needsConfirmation, confirmText, MAX_SAND } from './memoryAdvice.js';
import { initAdvice, refreshAdvice, closeAdvice } from './adviceControl.js';
import { perlinShape, worleyShape, cubeShape, tetrahedronShape, octahedronShape } from './shapeGenerators.js';

/** The modes the Mode popover offers, in its order; Contest opens from its banner. */
export const MODES = [
  {
    id: 'explore', name: 'Game of Life 3D', kind: 'Unbounded',
    about: "Conway's Game of Life in three dimensions, where each cell has 26 neighbours, in a world without walls: the pattern grows as far as it likes, for as long as you let it run. It computes on the CPU, in a background thread, keeping only the current generation, so its memory follows the live cells. Pause, step and restart it, try a preset simulation, a seed file or a seed of your own design, other rules, and an arena that ends the run, lets ships leave, wraps around or has walls.",
  },
  {
    id: 'gameOfLife', name: 'Game of Life 3D', kind: 'Bounded',
    about: "Conway's Game of Life in three dimensions, where each cell has 26 neighbours, in a fixed grid that wraps around, or has walls with their own corner, edge and face rules. The whole run is computed before it plays, so you can scrub it and play it backwards. It computes on your GPU with WebGPU where your browser has it, and on the CPU otherwise, with the same cells either way. It holds every generation in memory, so the grid's size and the run's length are what limit it.",
  },
  {
    id: 'rule30', name: 'Rule 30', kind: 'Cellular',
    about: "A one-dimensional cellular automaton that generates complex, seemingly random patterns from simple rules. Each cell's state depends on its left, centre and right neighbours, producing fractal-like structures.",
  },
  {
    id: 'sineWave', name: 'Sine Wave', kind: 'Continuous',
    about: 'A continuous mathematical function visualised in discrete 3D space. It shows periodic oscillations and wave patterns, and how a continuous phenomenon can be sampled and displayed on a grid.',
  },
  {
    id: 'sandpile', name: 'Sandpile', kind: 'Abelian',
    about: 'The Abelian sandpile model, a self-organised critical system. Sand grains pile up and topple when they reach a threshold, setting off cascading avalanches with power-law sizes and fractal patterns.',
  },
];

/** The modes computed in full before they play, whose settings this module holds. */
const PRECOMPUTED = ['gameOfLife', 'rule30', 'sineWave', 'sandpile'];

/** The bounded mode's shapes, their fields' names, and the largest size each takes. */
const SHAPES = [
  { key: 'cube', name: 'Cube' },
  { key: 'tetrahedron', name: 'Tetrahedron' },
  { key: 'octahedron', name: 'Octahedron' },
  { key: 'perlin', name: 'Perlin noise', noise: true, size: 'Noise detail', sizeMax: 100, density: 'Fill amount',
    about: 'Noise detail sets how fine the pattern is; fill amount how many cells live; the region how wide it spreads.' },
  { key: 'worley', name: 'Worley noise', noise: true, size: 'Feature points', sizeMax: 50, density: 'Activation distance',
    about: 'Feature points are the centres of its cells; activation distance how far from them cells live; the region how wide it spreads.' },
];
const shapeByKey = (key) => SHAPES.find((shape) => shape.key === key) ?? SHAPES[0];

/** The walls' kinds, as the bounded engine names them, and the neighbours each has. */
const WALLS = [
  { key: 'corner', state: 'corner', name: 'Corner', neighbours: 7 },
  { key: 'edge', state: 'edgeTwoFaces', name: 'Edge', neighbours: 11 },
  { key: 'face', state: 'face', name: 'Face', neighbours: 17 },
];

let wired = false;
/** What controls.js does around a run: reset the control bar, leave the streaming modes, etc. */
let hooks = { beforeRun: () => {}, afterRun: () => {}, enterExplore: () => {}, showMode: () => {} };

/**
 * Wires the gears and the popovers. Runs once; controls.js calls it.
 * @param {{beforeRun: () => void, afterRun: () => void, enterExplore: () => void,
 *   showMode: () => void}} options - beforeRun: leaves Explore and Contests and resets the control
 *   bar; afterRun: refreshes the controls; enterExplore: starts Explore with its settings;
 *   showMode: shows the mode's name and boxes
 */
export function initSettingsHud(options) {
  hooks = { ...hooks, ...options };
  if (wired) return;
  wired = true;
  wireMode();
  wireGrid();
  wireSeed();
  wireRules();
  initAdvice(() => (isPopoverOpen(byId('grid-popover')) ? adviceRun(gridDraft()) : adviceRun(runOf(state.simulationMode))));
}

/** Opens the Mode popover, from the control bar's gear as from the Mode box's. */
export function openModePopover() {
  const button = byId('hud-change-mode');
  if (button && !isPopoverOpen(byId('mode-popover'))) button.click();
}

// ---- A precomputed run: its settings, its estimate, and running it ----

/**
 * The settings of a precomputed mode, as they are now: its own size and generations, and the
 * settings it alone has.
 */
function runOf(mode) {
  const values = state.modeValues[mode] ?? {};
  const generations = values.generations ?? 100;
  const is3D = Boolean(values.is3D);
  const key = state.lifeShapeKey ?? 'cube';
  return {
    mode,
    generations,
    size: mode === 'rule30' ? rule30Size(generations, is3D) : values.size ?? 50,
    is3D,
    initialSand: state.sandpileParams?.initialSand ?? 0,
    wrap: state.gridWrapping ?? true,
    walls: Object.fromEntries(WALLS.map((w) => [w.key, {
      birth: state.boundaryRules[w.state].birth, survival: state.boundaryRules[w.state].survival,
    }])),
    shape: { key, ...defaultParams(key), ...state.shapeParams[key] },
    rules: { birth: state.rules.birth, survival: state.rules.survival },
  };
}

function defaultParams(key) {
  return shapeByKey(key).noise ? { size: 10, density: 0.3, regionSize: 25 } : { size: 10, density: 1 };
}

/** A run as memoryAdvice.js's estimateRun() takes it. */
function adviceRun(run) {
  if (!run || !PRECOMPUTED.includes(run.mode)) return null;
  const { generations, size } = run;
  if (run.mode === 'rule30') return { mode: run.is3D ? 'rule30_2D' : 'rule30', size, generations };
  if (run.mode === 'sineWave') return { mode: 'sineWave', size, generations };
  if (run.mode === 'sandpile') return { mode: 'sandpile', size, generations, initialSand: run.initialSand };
  const { key, size: shapeSize, density, regionSize } = run.shape;
  return {
    mode: 'gameOfLife', size, generations,
    seed: { shape: key, size: shapeSize, density, regionSize: shapeByKey(key).noise ? regionSize : null },
  };
}

/** Runs `run`: its settings become the mode's, and the run is computed again. */
export async function startRun(run) {
  const { mode } = run;
  closeAdvice();
  state.simulationMode = mode;
  state.useRule30 = mode === 'rule30' && !run.is3D;
  state.useRule30_2D = mode === 'rule30' && run.is3D; // the engine's name for Rule 30 in 3D
  state.useSineWave = mode === 'sineWave';
  state.useSandpile = mode === 'sandpile';
  state.modeValues[mode] = { ...state.modeValues[mode], size: run.size, generations: run.generations, is3D: run.is3D };
  state.sim_size = run.size;
  state.sim_generations = run.generations;
  if (mode === 'sandpile') state.sandpileParams.initialSand = run.initialSand;
  if (mode === 'rule30') state.shapeKey = 'rule30';
  if (mode === 'gameOfLife') {
    const { key, size, density, regionSize } = run.shape;
    const noise = shapeByKey(key).noise;
    const region = noise ? Math.min(run.size, regionSize) : null;
    state.shapes[key] = makeShape(key, size, density, region);
    state.shapeKey = key;
    state.lifeShapeKey = key;
    state.shapeParams[key] = noise ? { size, density, regionSize: region } : { size, density };
    state.gridWrapping = run.wrap;
    state.rules = { ...run.rules, ...deathRules(run.rules.survival, 26) };
    for (const w of WALLS) {
      const rules = run.walls[w.key];
      state.boundaryRules[w.state] = { ...rules, ...deathRules(rules.survival, w.neighbours) };
    }
  }
  hooks.beforeRun();
  hooks.showMode();
  await initSimulation();
  hooks.afterRun();
  showBoxes();
}

function makeShape(key, size, density, regionSize) {
  switch (key) {
    case 'perlin': return perlinShape(size, density, regionSize);
    case 'worley': return worleyShape(size, density, regionSize);
    case 'tetrahedron': return tetrahedronShape(size, density);
    case 'octahedron': return octahedronShape(size, density);
    default: return cubeShape(Math.max(1, Math.floor(size / 2)), density);
  }
}

/** Isolation and overcrowding: the counts below and above every survival count. */
function deathRules(survival, neighbours) {
  if (!survival.length) return { isolation: [], overcrowding: [] };
  const all = Array.from({ length: neighbours + 1 }, (_, n) => n);
  return {
    isolation: all.filter((n) => n < survival[0]),
    overcrowding: all.filter((n) => n > survival[survival.length - 1]),
  };
}

/** Fills the precomputed modes' boxes from their settings. */
export function showBoxes() {
  const mode = state.simulationMode;
  if (!PRECOMPUTED.includes(mode)) return;
  const run = runOf(mode);
  setText('sim-size-value', n(state.sim_size));
  setText('sim-generations-value', n(state.sim_generations));
  setText('grid-edge-value', run.wrap ? 'wraps around' : 'walls');
  setText('grid-3d-value', run.is3D ? 'on' : 'off');
  setText('grid-sand-value', n(run.initialSand));
  const shape = shapeByKey(run.shape.key);
  setText('shape-name-value', shape.name);
  setText('shape-size-value', String(run.shape.size));
  setText('shape-density-value', Number(run.shape.density).toFixed(2));
  setText('rules-birth', counts(state.rules.birth));
  setText('rules-survival', counts(state.rules.survival));
  setText('rules-isolation', counts(state.rules.isolation ?? []));
  setText('rules-overcrowd', counts(state.rules.overcrowding ?? []));
}

// ---- The popovers, shared ----

/**
 * Wires a gear to its popover. `build` gives the run Apply starts, or throws saying why not;
 * above a high memory estimate, Apply asks first.
 */
function wire(buttonId, popoverId, fill, build) {
  const button = byId(buttonId);
  const popover = byId(popoverId);
  if (!button || !popover) return;
  const error = popover.querySelector('.explore-error');
  const confirm = confirmBox(popover);
  button.onclick = () => {
    if (isPopoverOpen(popover)) {
      closePopover();
      return;
    }
    showError(error, null);
    confirm.hidden = true;
    fill();
    openPopover(button, popover, { onClose: closeAdvice });
    refreshAdvice();
  };
  popover.querySelector('[data-cancel]').onclick = () => closePopover();
  popover.addEventListener('input', () => {
    confirm.hidden = true;
    refreshAdvice();
  });
  const submit = (confirmed) => {
    let run;
    try {
      run = build();
    } catch (err) {
      showError(error, err.message);
      placeOpenPopover();
      return;
    }
    const advice = adviceRun(run);
    if (!confirmed && advice && needsConfirmation(advice)) {
      confirm.querySelector('p').textContent = confirmText(advice);
      confirm.hidden = false;
      confirm.querySelector('[data-run]').onclick = () => submit(true);
      confirm.querySelector('[data-back]').focus();
      placeOpenPopover();
      return;
    }
    closePopover();
    if (run.mode === 'explore') hooks.enterExplore();
    else if (run.mode !== 'none') startRun(run);
  };
  popover.onsubmit = (e) => {
    e.preventDefault();
    submit(false);
  };
}

// Apply's question above a high memory estimate (#123), at the popover's foot
function confirmBox(popover) {
  const box = document.createElement('div');
  box.className = 'memory-confirm hud-confirm';
  box.setAttribute('role', 'alertdialog');
  box.hidden = true;
  const text = document.createElement('p');
  const back = Object.assign(document.createElement('button'), { type: 'button', className: 'glass-button explore-small-button', textContent: 'Change settings' });
  back.dataset.back = '';
  back.onclick = () => {
    box.hidden = true;
    popover.querySelector('input, select')?.focus();
  };
  const run = Object.assign(document.createElement('button'), { type: 'button', className: 'glass-button explore-small-button', textContent: 'Run anyway' });
  run.dataset.run = '';
  const buttons = document.createElement('div');
  buttons.className = 'explore-save-actions';
  buttons.append(back, run);
  box.append(text, buttons);
  popover.append(box);
  return box;
}

// ---- Mode ----

let modeDraft = 'explore';

function wireMode() {
  const list = byId('mode-popover-list');
  if (!list) return;
  list.replaceChildren(...MODES.map((mode) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'mode-option';
    option.dataset.mode = mode.id;
    option.setAttribute('aria-pressed', 'false');
    const name = document.createElement('span');
    name.className = 'mode-option-name';
    name.textContent = mode.name;
    const kind = document.createElement('span');
    kind.className = 'mode-option-kind';
    kind.textContent = mode.kind;
    option.append(name, kind);
    option.onclick = () => {
      modeDraft = mode.id;
      showModeDraft();
    };
    return option;
  }));
  wire('hud-change-mode', 'mode-popover', () => {
    modeDraft = MODES.some((mode) => mode.id === state.simulationMode) ? state.simulationMode : 'explore';
    showModeDraft();
  }, () => {
    if (modeDraft === state.simulationMode) return { mode: 'none' }; // already running
    if (modeDraft === 'explore') return { mode: 'explore' };
    return runOf(modeDraft);
  });
}

function showModeDraft() {
  for (const option of byId('mode-popover-list').children) {
    option.setAttribute('aria-pressed', String(option.dataset.mode === modeDraft));
  }
  const mode = MODES.find((m) => m.id === modeDraft);
  setText('mode-popover-about', mode?.about ?? '');
  const same = modeDraft === state.simulationMode;
  setText('mode-popover-note', same
    ? 'This mode is running now.'
    : `Applying switches to ${mode.name} (${mode.kind.toLowerCase()}), with the settings it had last. Change them from its boxes.`);
  placeOpenPopover();
}

// ---- Grid: size, generations, and each mode's own ----

function wireGrid() {
  const generations = byId('sim-generations');
  const size = byId('sim-size');
  if (!generations || !size) return;
  // Rule 30's size follows its generations; the sandpile's starts from them
  generations.addEventListener('input', () => {
    const mode = state.simulationMode;
    const gens = Math.max(1, parseInt(generations.value, 10) || 1);
    if (mode === 'rule30') size.value = String(rule30Size(gens, byId('rule30-3d').checked));
    else if (mode === 'sandpile') size.value = String(sandpileSize(gens));
  });
  byId('rule30-3d').addEventListener('change', () => generations.dispatchEvent(new Event('input', { bubbles: true })));
  for (const id of ['grid-edge-wrap', 'grid-edge-walls']) byId(id).addEventListener('change', showWallFields);
  wire('grid-change', 'grid-popover', fillGrid, () => {
    const run = gridDraft();
    if (!Number.isInteger(run.generations) || run.generations < 1) throw new Error('Generations must be a whole number, 1 or more.');
    if (!Number.isInteger(run.size) || run.size < 1) throw new Error('Size must be a whole number, 1 or more.');
    if (!Number.isInteger(run.initialSand) || run.initialSand < 0 || run.initialSand > MAX_SAND) {
      throw new Error(`Initial sand must be a whole number from 0 to ${MAX_SAND}.`);
    }
    if (run.mode === 'gameOfLife' && !run.wrap) run.walls = wallsFrom(parseWalls(wallTexts()));
    return run;
  });
}

function fillGrid() {
  const run = runOf(state.simulationMode);
  const mode = run.mode;
  byId('sim-size').value = String(run.size);
  byId('sim-generations').value = String(run.generations);
  byId('rule30-3d').checked = run.is3D;
  byId('sandpile-initial-sand').value = String(run.initialSand);
  byId('grid-edge-wrap').checked = run.wrap;
  byId('grid-edge-walls').checked = !run.wrap;
  for (const w of WALLS) {
    byId(`wall-${w.key}-birth`).value = counts(run.walls[w.key].birth);
    byId(`wall-${w.key}-survival`).value = counts(run.walls[w.key].survival);
  }
  byId('grid-size-row').hidden = mode === 'rule30';
  byId('grid-rule30-row').hidden = mode !== 'rule30';
  byId('grid-sand-row').hidden = mode !== 'sandpile';
  byId('grid-edge-row').hidden = mode !== 'gameOfLife';
  setText('grid-size-about', mode === 'sandpile'
    ? 'The sandpile spreads as its grains pile up, so its size follows the generations as you change them; you can still set it yourself.' : '');
  byId('grid-size-about').hidden = mode !== 'sandpile';
  setText('grid-rule30-about', "Rule 30's size follows its generations, so it has only those to set.");
  setText('grid-note', 'Applying computes the run again, from generation 0.');
  showWallFields();
}

// The Grid popover's fields as a run, for the advice and for Apply
function gridDraft() {
  const run = runOf(state.simulationMode);
  const int = (id) => (byId(id).value.trim() === '' ? NaN : Number(byId(id).value));
  run.generations = int('sim-generations');
  run.is3D = byId('rule30-3d').checked;
  run.size = run.mode === 'rule30' ? rule30Size(Math.max(1, run.generations || 1), run.is3D) : int('sim-size');
  run.initialSand = int('sandpile-initial-sand');
  run.wrap = byId('grid-edge-wrap').checked;
  return run;
}

function showWallFields() {
  byId('grid-walls').hidden = byId('grid-edge-wrap').checked;
  placeOpenPopover();
}

function wallTexts() {
  return Object.fromEntries(WALLS.map((w) => [w.key, {
    birth: byId(`wall-${w.key}-birth`).value, survival: byId(`wall-${w.key}-survival`).value,
  }]));
}

const wallsFrom = (walls) => Object.fromEntries(WALLS.map((w) => [w.key, walls[w.key]]));

// ---- Seed: the bounded mode's shape ----

function wireSeed() {
  const select = byId('life-shape');
  if (!select) return;
  select.replaceChildren(...SHAPES.map((shape) => new Option(shape.name, shape.key)));
  select.onchange = () => fillShapeFields(select.value);
  wire('life-change-seed', 'life-seed-popover', () => {
    const key = state.lifeShapeKey ?? 'cube';
    select.value = key;
    fillShapeFields(key);
  }, () => {
    const run = runOf('gameOfLife');
    const key = select.value;
    const shape = shapeByKey(key);
    const sizeMax = shape.sizeMax ?? run.size;
    const size = Number(byId('life-shape-size').value);
    const density = Number(byId('life-shape-density').value);
    const regionSize = Number(byId('life-shape-region').value);
    if (!Number.isInteger(size) || size < 1 || size > sizeMax) {
      throw new Error(`${shape.size ?? 'Size'} must be a whole number from 1 to ${sizeMax}${shape.sizeMax ? '' : ', the grid\'s size'}.`);
    }
    if (!(density >= 0 && density <= 1) || byId('life-shape-density').value.trim() === '') {
      throw new Error(`${shape.density ?? 'Density'} must be from 0 to 1.`);
    }
    if (shape.noise && (!Number.isInteger(regionSize) || regionSize < 1 || regionSize > run.size)) {
      throw new Error(`The region size must be a whole number from 1 to ${run.size}, the grid's size.`);
    }
    run.shape = shape.noise ? { key, size, density, regionSize } : { key, size, density };
    return run;
  });
}

// The shape's fields: its settings as they were last used
function fillShapeFields(key) {
  const shape = shapeByKey(key);
  const p = { ...defaultParams(key), ...state.shapeParams[key] };
  const gridSize = runOf('gameOfLife').size;
  setText('life-shape-size-label', shape.size ?? 'Size');
  setText('life-shape-size-hint', `1 - ${shape.sizeMax ?? gridSize}`);
  setText('life-shape-density-label', shape.density ?? 'Density');
  setText('life-shape-region-hint', `1 - ${gridSize}`);
  byId('life-shape-size').value = String(p.size);
  byId('life-shape-density').value = String(p.density);
  byId('life-shape-region').value = String(p.regionSize ?? 25);
  byId('life-shape-region-row').hidden = !shape.noise;
  setText('life-shape-about', shape.about ?? 'Density is the chance that each cell of the shape is alive.');
  setText('life-seed-note', 'Applying changes only the seed: the rules stay. It computes the run again, from generation 0.');
  placeOpenPopover();
}

// ---- Rules: the bounded mode's birth and survival ----

function wireRules() {
  const birth = byId('life-rule-birth');
  const survival = byId('life-rule-survival');
  if (!birth || !survival) return;
  survival.addEventListener('input', showDeathCounts);
  wire('life-change-rules', 'life-rules-popover', () => {
    birth.value = counts(state.rules.birth);
    survival.value = counts(state.rules.survival);
    setText('life-rules-note', 'Applying changes only the rules: the seed stays. It computes the run again, from generation 0.');
    showDeathCounts();
  }, () => {
    const run = runOf('gameOfLife');
    run.rules = { birth: parseCounts(birth.value, 'birth'), survival: parseCounts(survival.value, 'survival') };
    return run;
  });
}

function showDeathCounts() {
  let text = '–';
  let over = '–';
  try {
    const { isolation, overcrowding } = deathRules(parseCounts(byId('life-rule-survival').value, 'survival'), 26);
    text = isolation.length ? counts(isolation) : 'none';
    over = overcrowding.length ? counts(overcrowding) : 'none';
  } catch {
    // The field's message comes on Apply
  }
  setText('life-rules-isolation', text);
  setText('life-rules-overcrowding', over);
}

// ---- Small helpers ----

function byId(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const el = byId(id);
  if (el) el.textContent = text;
}

function showError(el, message) {
  if (!el) return;
  el.hidden = !message;
  el.textContent = message ?? '';
}

const n = (x) => Number(x).toLocaleString('en');

/** Counts as the HUD writes them: runs of three or more as ranges, such as 5-15. */
function counts(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    let j = i;
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
    if (j - i >= 2) out.push(`${list[i]}-${list[j]}`);
    else for (let k = i; k <= j; k++) out.push(String(list[k]));
    i = j;
  }
  return out.join(',');
}
