// SPDX-License-Identifier: Apache-2.0
//
// Explore's settings in the HUD (#69). The Simulation box, its two parts, the Seed and Rules
// boxes (#130), and the Limits box each have a gear in their title that opens a popover beside
// the box (popover.js), whose Apply changes Explore's settings (`state.explore`, a setup from
// setup.js) and restarts the run. Cancel, Esc or a click outside changes nothing: each popover
// fills its fields from the settings when it opens, and keeps what the visitor does there to
// itself until Apply.
//
// A seed is only cells; a simulation is a seed and its rules (#130). The Simulation popover sets
// both together: a preset, a simulation file or a saved generation. The Seed popover sets only the
// cells, and the rules stay.
//
// The popovers also open the seed editor (editor.js, #70): Design… in the Seed popover, on the
// seed in use, and Edit a copy… in the Simulation popover, on a preset. The editor's Use changes
// the settings and restarts the run as Apply does. A contest takes a simulation file, from Save
// simulation (#130).

import { state } from '../state.js';
import { startExplore } from './explore.js';
import { openPopover, closePopover, isPopoverOpen, placeOpenPopover } from './popover.js';
import { readSeedOrSave } from './save.js';
import { openEditor, closeEditor } from './editor.js';
import { MAX_RESULT_BYTES } from '../unbounded/canonical.js';
import { PRESETS, PRESET_GROUPS, presetById } from './presets.js';
import { MAX_SHAPE_SIZE, parseCounts } from './seed.js';
import {
  SHAPES, shapeByKey, makeShape, presetSeed, fileSeed, simulationFile, simulationOf, changeSeed, changeRules, changeArena, changeMemory,
  configOf, boxesOf, lockOf, rulesOf, arenaOf, edgeOf, startOf, WALL_KINDS, restartNote, seedLabel, deathCounts,
  designOf, presetCopy, useDesign,
} from './setup.js';

/** A loaded file larger than a result file may be is refused before it is read. */
const MAX_SEED_FILE_BYTES = MAX_RESULT_BYTES;

// The size and density fields' names and hints per shape, as the settings dialog has them
const SHAPE_FIELDS = {
  perlin: {
    size: 'Noise detail', sizeMax: 100, density: 'Fill amount',
    about: 'Noise detail sets how fine the pattern is; fill amount how many cells live; the region how wide it spreads (0 for as wide as the detail).',
  },
  worley: {
    size: 'Feature points', sizeMax: 50, density: 'Activation distance',
    about: 'Feature points are the centres of its cells; activation distance how far from them cells live; the region how wide it spreads (0 for as wide as the points).',
  },
};
const PLAIN_FIELDS = { size: 'Size', sizeMax: MAX_SHAPE_SIZE, density: 'Density', about: 'Density is the chance that each cell of the shape is alive.' };

let wired = false;
/** What Apply does after the settings change: controls.js resets the control bar, then starts. */
let restartRun = startFromSetup;

/**
 * Wires the boxes' gears and the popovers. Runs once; controls.js calls it.
 * @param {{restart?: () => void}} [options] - restart: resets the page around a run and calls
 *   startFromSetup()
 */
export function initHud({ restart } = {}) {
  if (restart) restartRun = restart;
  if (wired) return;
  wired = true;
  wireCollapse();
  wireSimulation();
  wireSeed();
  wireRules();
  wireLimits();
}

/** Starts Explore with the settings its boxes hold, and shows them. */
export function startFromSetup() {
  startExplore(configOf(state.explore));
  showBoxes();
}

/** Fills the boxes from the settings. */
export function showBoxes() {
  const boxes = boxesOf(state.explore);
  const n = (x) => x.toLocaleString('en');
  const simulation = simulationOf(state.explore);
  setText('hud-simulation-name', simulation.name);
  setText('explore-seed-label', boxes.seed);
  const edge = { end: '', ships: ', ships leave', wrap: ', wraps', walls: ', walls' }[boxes.edge];
  setText('explore-arena', boxes.arena ? `${n(boxes.arena)}³${boxes.arenaLocked ? ', saved' : ''}${edge}` : 'off');
  setText('explore-memory-limit', `${n(boxes.memoryMB)} MB`);
}

// ---- Folding a box down to its title ----

// A click on a box's title row folds the box, in every mode, to make room for the others on a
// short screen, except on the row's gear, which changes the box's settings. The arrow at the row's
// end is its button, for the keyboard, and its click reaches the row too. Folding the Simulation
// panel folds everything in it. A popover open in a box that folds closes with it. Not remembered
// past the visit.
function wireCollapse() {
  for (const button of document.querySelectorAll('.hud-collapse')) {
    const box = button.closest('.glass-display');
    const row = button.closest('.box-title');
    row.onclick = (e) => {
      if (e.target.closest?.('.hud-gear')) return; // the gear opens its popover instead
      const name = row.querySelector('.box-title-text')?.textContent ?? 'this';
      const folded = box.classList.toggle('is-collapsed');
      button.setAttribute('aria-expanded', String(!folded));
      button.setAttribute('aria-label', `${folded ? 'Expand' : 'Collapse'} the ${name} box`);
      if (folded) {
        const open = box.querySelector('.explore-popover.is-open');
        if (open) closePopover({ popover: open, restoreFocus: false });
      }
    };
  }
}

// ---- Shared by the popovers ----

/**
 * Wires one box's gear to its popover.
 * @param {string} buttonId
 * @param {string} popoverId
 * @param {() => void} fill - fills the fields from the settings, as the popover opens
 * @param {() => object} apply - the new settings, or throws saying why not
 */
function wirePopover(buttonId, popoverId, fill, apply) {
  const button = document.getElementById(buttonId);
  const popover = document.getElementById(popoverId);
  if (!button || !popover) return;
  const error = popover.querySelector('.explore-error');
  button.onclick = () => {
    if (isPopoverOpen(popover)) {
      closePopover();
      return;
    }
    showError(error, null);
    fill();
    openPopover(button, popover);
  };
  popover.querySelector('[data-cancel]').onclick = () => closePopover();
  popover.onsubmit = (e) => {
    e.preventDefault();
    let next;
    try {
      next = apply();
    } catch (err) {
      showError(error, err.message);
      placeOpenPopover();
      return;
    }
    state.explore = next;
    closePopover();
    restartRun();
  };
}

function showError(el, message) {
  if (!el) return;
  el.hidden = !message;
  el.textContent = message ?? '';
}

// ---- Simulation: a seed and its rules together (#130) ----

// What the Simulation popover holds until Apply: Preset or File, which preset, and a file loaded
// with Load simulation… (its simulation, or why it can't be used)
const simDraft = { kind: 'preset', presetId: PRESETS[0].id, file: null, fileError: null };

/**
 * A list's options: the items with no group on their own, then each group (#105's Ships) under its
 * label, in an optgroup.
 */
function groupedOptions(items, value, name) {
  const option = (item) => new Option(item[name], item[value]);
  const groups = PRESET_GROUPS.map(({ id, label }) => {
    const group = document.createElement('optgroup');
    group.label = label;
    group.append(...items.filter((item) => item.group === id).map(option));
    return group;
  });
  return [...items.filter((item) => !item.group).map(option), ...groups.filter((group) => group.children.length)];
}

/**
 * Reads a file the visitor picked, as untrusted data, into `draft.file` with `make`, or the reason
 * it can't be used into `draft.fileError`.
 */
function wireFileInput(input, draft, make, show) {
  input.onchange = async () => {
    const file = input.files?.[0];
    input.value = ''; // so loading the same file again still fires
    if (!file) return;
    try {
      if (file.size > MAX_SEED_FILE_BYTES) throw new Error(`it is larger than ${MAX_SEED_FILE_BYTES / 2 ** 20} MB.`);
      draft.file = make(file.name, await readSeedOrSave(await file.text()));
      draft.fileError = null;
    } catch (err) {
      draft.file = null;
      draft.fileError = err.message.startsWith(file.name) ? err.message : `${file.name} can't be used: ${err.message}`;
    }
    show();
  };
}

function wireSimulation() {
  const popover = document.getElementById('explore-simulation-popover');
  const presetSelect = document.getElementById('explore-preset');
  if (!popover || !presetSelect) return;
  presetSelect.replaceChildren(...groupedOptions(PRESETS, 'id', 'name'));

  const byId = (id) => document.getElementById(id);
  byId('explore-sim-preset').onclick = () => { simDraft.kind = 'preset'; showSimulationDraft(); };
  byId('explore-sim-file').onclick = () => { simDraft.kind = 'file'; showSimulationDraft(); };
  presetSelect.onchange = () => { simDraft.presetId = presetSelect.value; showSimulationDraft(); };
  byId('explore-edit-copy').onclick = openCopy;
  const fileInput = byId('explore-simulation-file');
  byId('explore-load-simulation').onclick = () => fileInput.click();
  wireFileInput(fileInput, simDraft, simulationFile, showSimulationDraft);
  wireHelp(popover, byId('explore-simulation-help'), simulationHelp);

  wirePopover('explore-change-simulation', 'explore-simulation-popover', fillSimulation, () => {
    const setup = state.explore;
    if (simDraft.kind === 'preset') return changeSeed(setup, presetSeed(simDraft.presetId));
    if (!simDraft.file) throw new Error(simDraft.fileError ?? 'Load a simulation file or a saved generation first, with Load simulation….');
    // The same file as now: its simulation as it is in use
    return simDraft.file === setup.seed ? setup : changeSeed(setup, simDraft.file);
  });
}

// The popover opens on the simulation in use
function fillSimulation() {
  const { seed } = state.explore;
  const { from, id } = simulationOf(state.explore);
  simDraft.kind = from === 'file' || from === 'saved' ? 'file' : 'preset';
  if (id) simDraft.presetId = id;
  simDraft.file = simDraft.kind === 'file' ? seed : null;
  simDraft.fileError = null;
  document.getElementById('explore-preset').value = simDraft.presetId;
  showSimulationDraft();
}

function showSimulationDraft() {
  const byId = (id) => document.getElementById(id);
  const preset = simDraft.kind === 'preset';
  byId('explore-sim-preset').setAttribute('aria-pressed', String(preset));
  byId('explore-sim-file').setAttribute('aria-pressed', String(!preset));
  byId('explore-sim-preset-part').hidden = !preset;
  byId('explore-sim-file-part').hidden = preset;

  // Each control's explanation shows at the popover's foot when it is pointed at or focused
  const chosen = presetById(simDraft.presetId);
  const n = (x) => x.toLocaleString('en');
  const help = (id, text) => { byId(id).dataset.help = text; };
  help('explore-sim-preset', 'A preset is a ready-made simulation: a seed with its own rules. Applying one replaces both.');
  help('explore-sim-file', LOAD_HELP);
  help('explore-load-simulation', LOAD_HELP);
  help('explore-preset', chosen
    ? `${chosen.description} Seed: ${n(chosen.cells.length / 3)} cells. Rules: ${ruleText(chosen.rules)}.` : 'Pick a preset.');
  help('explore-edit-copy', chosen
    ? `Opens ${chosen.name}'s cells in the seed editor, with its rules. Its Use makes them a Custom simulation, whose seed and rules you can then change; ${chosen.name} itself stays as it is.` : '');

  // A loaded file, or why it can't be used, stays in view: it answers the visitor's Load
  const { file, fileError } = simDraft;
  let status = '';
  if (fileError) status = fileError;
  else if (!file) status = '';
  else if (file === state.explore.seed) status = `${simulationOf(state.explore).name}: ${n(file.cells.length / 3)} cells, in use now.`;
  else if (file.kind === 'saved') status = `${file.name}: generation ${n(file.from)} of a saved run, ${n(file.cells.length / 3)} cells, with its own rules, ${ruleText(file.rules)}, and ${file.arena ? `a ${n(file.arena)}³ arena` : 'no arena'}. They stay locked while it runs.`;
  else status = `${file.name}: a seed of ${n(file.cells.length / 3)} cells, and its rules, ${ruleText(file.rules)}, which go into the Rules box, where you can change them.`;
  setText('explore-simulation-status', preset ? '' : status);

  const from = !preset && file?.kind === 'saved' ? file.from : 0;
  help('explore-simulation-apply', `Applying replaces the seed and the rules. ${restartNote(from)}`);
  showError(byId('explore-simulation-error'), null);
  setText('explore-simulation-help', simulationHelp());
  placeOpenPopover();
}

const LOAD_HELP = 'Load simulation… takes a simulation file, from Save simulation, whose seed and rules both come in, or a saved generation, from Save this generation, which carries on from its generation under its own rules and arena. A seed file has no rules: load it in the Seed box.';

// The foot's text when no control is pointed at or focused: the preset chosen, or what Load takes
function simulationHelp() {
  const id = simDraft.kind === 'preset' ? 'explore-preset' : 'explore-load-simulation';
  return document.getElementById(id)?.dataset.help ?? '';
}

/**
 * Shows, in `help` at a popover's foot, the explanation (`data-help`) of the control pointed at
 * or focused, and `fallback()` when there is none (#130).
 */
function wireHelp(popover, help, fallback) {
  if (!popover || !help) return;
  const show = (el) => {
    const text = el?.closest?.('[data-help]')?.dataset.help ?? fallback();
    if (help.textContent !== text) {
      help.textContent = text;
      placeOpenPopover();
    }
  };
  popover.addEventListener('pointerover', (e) => show(e.target));
  popover.addEventListener('pointerleave', () => show(popover.contains(document.activeElement) ? document.activeElement : null));
  popover.addEventListener('focusin', (e) => show(e.target));
}

// ---- Seed: the cells alone ----

// What the Seed popover holds until Apply: where the cells come from, and a file loaded with
// Load seed… (its cells, or why it can't be used)
const seedDraft = { source: 'shape', file: null, fileError: null };

function wireSeed() {
  const popover = document.getElementById('explore-seed-popover');
  const shapeSelect = document.getElementById('explore-shape');
  if (!popover || !shapeSelect) return;
  shapeSelect.replaceChildren(...groupedOptions(SHAPES, 'key', 'name'));

  const byId = (id) => document.getElementById(id);
  byId('explore-source-shape').onclick = () => { seedDraft.source = 'shape'; showSeedDraft(); };
  byId('explore-source-file').onclick = () => { seedDraft.source = 'file'; showSeedDraft(); };
  byId('explore-source-design').onclick = () => { seedDraft.source = 'design'; showSeedDraft(); };
  byId('explore-design').onclick = openDesign;
  shapeSelect.onchange = () => { fillShapeFields(shapeSelect.value); showSeedDraft(); };
  const fileInput = byId('explore-seed-file');
  byId('explore-load-seed').onclick = () => fileInput.click();
  wireFileInput(fileInput, seedDraft, fileSeed, showSeedDraft);

  wirePopover('explore-change-seed', 'explore-seed-popover', fillSeed, () => {
    const setup = state.explore;
    if (seedDraft.source === 'file') {
      if (!seedDraft.file) throw new Error(seedDraft.fileError ?? 'Load a seed file first, with Load seed….');
      return seedDraft.file === setup.seed ? setup : changeSeed(setup, seedDraft.file);
    }
    if (seedDraft.source === 'design') {
      // A design is made in the editor, whose Use applies it; Apply here runs the one in use again
      if (setup.seed.kind === 'design') return setup;
      throw new Error('Design a seed first: Design… opens the seed editor, and its Use makes the design the seed.');
    }
    const key = shapeSelect.value;
    const params = {
      size: byId('explore-shape-size').value,
      density: byId('explore-shape-density').value,
      regionSize: byId('explore-shape-region').value,
    };
    const next = changeSeed(setup, makeShape(key, params, setup.seed));
    // The shape's settings, so the popover, and the bounded mode's Seed box, open with them
    if (next.seed.params) state.shapeParams[key] = { ...next.seed.params };
    return next;
  });
}

// The popover opens on the seed in use; a preset's cells are a shape of their own
function fillSeed() {
  const { seed } = state.explore;
  seedDraft.source = seed.kind === 'file' && !seed.rules ? 'file' : seed.kind === 'design' ? 'design' : 'shape';
  seedDraft.file = seedDraft.source === 'file' ? seed : null;
  seedDraft.fileError = null;
  const key = seed.kind === 'shape' ? seed.key : seed.kind === 'preset' ? `preset:${seed.id}` : 'cube';
  document.getElementById('explore-shape').value = key;
  fillShapeFields(key, seed.kind === 'shape' ? seed.params : null);
  showSeedDraft();
}

// The shape's fields: the seed's own settings, or the ones last used for that shape
function fillShapeFields(key, params = null) {
  const shape = shapeByKey(key);
  const fields = SHAPE_FIELDS[key] ?? PLAIN_FIELDS;
  const p = params ?? state.shapeParams?.[key] ?? {};
  const size = document.getElementById('explore-shape-size');
  size.max = `${fields.sizeMax}`;
  size.value = `${p.size ?? 10}`;
  document.getElementById('explore-shape-density').value = `${p.density ?? (shape?.noise ? 0.3 : 1)}`;
  document.getElementById('explore-shape-region').value = `${p.regionSize ?? 25}`;
}

function showSeedDraft() {
  const byId = (id) => document.getElementById(id);
  const { source } = seedDraft;
  byId('explore-source-shape').setAttribute('aria-pressed', String(source === 'shape'));
  byId('explore-source-file').setAttribute('aria-pressed', String(source === 'file'));
  byId('explore-source-design').setAttribute('aria-pressed', String(source === 'design'));
  byId('explore-seed-shape-part').hidden = source !== 'shape';
  byId('explore-seed-file-part').hidden = source !== 'file';
  byId('explore-seed-design-part').hidden = source !== 'design';
  setText('explore-design-status', designStatus());

  // A preset's cells take no size or density
  const key = byId('explore-shape').value;
  const shape = shapeByKey(key);
  const fields = SHAPE_FIELDS[key] ?? PLAIN_FIELDS;
  byId('explore-shape-params').hidden = Boolean(shape?.preset);
  byId('explore-shape-region-row').hidden = !shape?.noise;
  setText('explore-shape-size-label', fields.size);
  setText('explore-shape-size-hint', `1 - ${fields.sizeMax}`);
  setText('explore-shape-density-label', fields.density);
  setText('explore-shape-about', shape?.preset
    ? `${presetById(shape.preset).name}'s ${(presetById(shape.preset).cells.length / 3).toLocaleString('en')} cells, without its rules: they run under the rules in the Rules box. For the preset with its rules, use Preset in the Simulation box.`
    : fields.about);

  const { file, fileError } = seedDraft;
  const n = (x) => x.toLocaleString('en');
  let status;
  if (fileError) status = fileError;
  else if (!file) status = 'Load seed… takes the cells of a seed file, from Save seed, or of a simulation file, leaving its rules out: the seed runs under the rules in the Rules box.';
  else if (file === state.explore.seed) status = `${seedLabel(file)}: ${n(file.cells.length / 3)} cells, in use now.`;
  else status = `${file.name}: ${n(file.cells.length / 3)} cells, to run under the rules in the Rules box.`;
  setText('explore-seed-status', status);

  setText('explore-seed-note', `Applying changes only the seed: the rules stay. ${restartNote(0)}`);
  showError(byId('explore-seed-error'), null);
  placeOpenPopover();
}

// ---- The seed editor ----

// What Design… says it will open
function designStatus() {
  const setup = state.explore;
  const n = (x) => x.toLocaleString('en');
  if (setup.seed.kind === 'design') {
    return `The design in use, ${n(setup.seed.cells.length / 3)} cells. Design… opens it in the seed editor, to change it; Apply runs it again.`;
  }
  const opened = designOf(setup);
  if (opened.reason) return `Design… opens the seed editor on an empty 10³ box: ${lowerFirst(opened.reason)} The seed in use still runs.`;
  return `Design… opens the seed editor on the seed in use (${seedLabel(setup.seed)}, ${n(setup.seed.cells.length / 3)} cells), in the 10³ seed box, to place cells one by one.`;
}

// Design…: the editor on the seed in use, if it fits the seed box, under the Rules box's rules
function openDesign({ note = null } = {}) {
  const opened = designOf(state.explore);
  const lock = lockOf(state.explore);
  openFromPopover({
    places: opened.places,
    rules: opened.rules,
    rulesFrom: lock ? `${lock.name}, as the Rules box shows them` : 'the Rules box',
    note: [opened.reason && `${opened.reason} The editor opens on an empty box; the seed in use is unchanged.`, note]
      .filter(Boolean).join(' ') || null,
  });
}

/**
 * Opens the seed editor as Design… does, once Explore is running: for a Discovery contest's
 * page (#94), which sends the visitor here to design an entry. `note` goes at the editor's head.
 */
export function openSeedEditor({ note = null } = {}) {
  openDesign({ note });
}

// Edit a copy…: the editor on the chosen preset's cells, which bring its rules, unlocked on Use
function openCopy() {
  const copy = presetCopy(simDraft.presetId);
  openFromPopover({
    places: copy.places,
    rules: copy.rules,
    rulesFrom: `${copy.name}'s rules`,
    note: `A copy of ${copy.name}. Use makes it a Custom simulation with ${copy.name}'s rules, which you can then change; ${copy.name} itself stays as it is.`,
  }, 'explore-change-simulation');
}

function lowerFirst(text) {
  return /^[A-Z][a-z]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;
}

function openFromPopover(options, gearId = 'explore-change-seed') {
  const gear = document.getElementById(gearId);
  closePopover({ restoreFocus: false });
  openEditor({
    ...options,
    returnFocus: gear,
    onUse: (cells, rules) => {
      const next = useDesign(state.explore, cells, rules); // throws, and the editor says why
      closeEditor();
      state.explore = next;
      restartRun();
    },
  });
}

// ---- Rules ----

// Use your own rules, pressed in the open popover and not yet applied
let rulesOwn = false;

function wireRules() {
  const birth = document.getElementById('explore-rule-birth');
  const survival = document.getElementById('explore-rule-survival');
  if (!birth || !survival) return;
  document.getElementById('explore-rules-own').onclick = () => {
    rulesOwn = true;
    showRulesLock();
    birth.focus();
  };
  survival.oninput = showDeathCounts;
  wirePopover('explore-change-rules', 'explore-rules-popover', () => {
    rulesOwn = false;
    const rules = rulesOf(state.explore);
    birth.value = ruleText(rules.birth);
    survival.value = ruleText(rules.survival);
    showRulesLock();
    showDeathCounts();
  }, () => changeRules(state.explore, birth.value, survival.value, { own: rulesOwn }));
}

// What a live cell dies with, from the Survival field as it is typed; nothing while it can't be read
function showDeathCounts() {
  let counts = null;
  try {
    counts = deathCounts(parseCounts(document.getElementById('explore-rule-survival').value, 'survival'));
  } catch {
    // The field's message comes on Apply
  }
  const show = (list) => {
    if (!counts) return '–';
    if (!counts[list].length) return 'none';
    // With no survival count, a live cell dies whatever its neighbours
    if (list === 'isolation' && !counts.overcrowding.length && counts.isolation.length === 27) return 'every count';
    return ruleText(counts[list]);
  };
  setText('explore-rules-isolation', show('isolation'));
  setText('explore-rules-overcrowding', show('overcrowding'));
  setText('explore-rules-gaps', show('gaps'));
  document.getElementById('explore-rules-gaps-line').hidden = !counts?.gaps.length;
  placeOpenPopover();
}

function showRulesLock() {
  const lock = rulesOwn ? null : lockOf(state.explore);
  const box = document.getElementById('explore-rules-locked');
  box.hidden = !lock;
  if (lock) {
    setText('explore-rules-locked-text', lock.by === 'preset'
      ? `These rules come with ${lock.name}, a simulation whose seed and rules go together, so it is always the same run. Use your own rules keeps its cells and these rules, as a Custom simulation, for you to change.`
      : 'These rules come with the saved generation, which carries on under them. Use your own rules starts its cells again from generation 0, with these rules for you to change.');
  }
  for (const id of ['explore-rule-birth', 'explore-rule-survival']) {
    const input = document.getElementById(id);
    input.readOnly = Boolean(lock);
  }
  // Locked rules can't be applied, only unlocked or left as they are
  applyButton('explore-rules-popover').hidden = Boolean(lock);
  const from = rulesOwn ? 0 : startOf(state.explore);
  setText('explore-rules-note', restartNote(from));
  placeOpenPopover();
}

// ---- Limits: the arena, what happens at its edge, and the memory limit ----

// Use your own rules, pressed in the open popover and not yet applied. A saved generation locks
// its arena, and with it what happens at the edge; the memory limit is never locked, as it isn't
// part of the run.
let limitsOwn = false;

function wireLimits() {
  const on = document.getElementById('explore-arena-on');
  const side = document.getElementById('explore-arena-side');
  const edge = document.getElementById('explore-edge');
  const memory = document.getElementById('explore-memory-input');
  if (!on || !side || !edge || !memory) return;
  on.onchange = () => {
    side.disabled = !on.checked || isArenaLocked();
    edge.disabled = side.disabled;
  };
  // The walls' rules show under Walls only (#119)
  edge.onchange = showWallRules;
  document.getElementById('explore-arena-own').onclick = () => {
    limitsOwn = true;
    showLimitsLock();
    on.focus();
  };
  wirePopover('explore-change-limits', 'explore-limits-popover', () => {
    limitsOwn = false;
    const arena = arenaOf(state.explore);
    on.checked = arena !== null;
    side.value = `${arena ?? state.explore.arenaSize}`;
    // A saved generation's edge is its own, and ends the run; otherwise the visitor's, remembered
    // while the arena is off
    const shown = lockOf(state.explore)?.by === 'saved' ? edgeOf(state.explore) : state.explore.edge;
    for (const radio of edge.querySelectorAll('input[name="explore-edge"]')) radio.checked = radio.value === shown;
    for (const { key } of WALL_KINDS) {
      document.getElementById(`explore-wall-${key}-birth`).value = counts(state.explore.walls[key].birth);
      document.getElementById(`explore-wall-${key}-survival`).value = counts(state.explore.walls[key].survival);
    }
    showWallRules();
    memory.value = `${state.explore.memoryMB}`;
    showLimitsLock();
  }, () => {
    const setup = isArenaLocked() ? state.explore
      : changeArena(state.explore, on.checked, side.value, { own: limitsOwn, edge: chosenEdge(), walls: chosenEdge() === 'walls' ? wallTexts() : undefined });
    return changeMemory(setup, memory.value);
  });
}

/** The choice at the arena's edge checked in the Limits popover. */
function chosenEdge() {
  return document.querySelector('#explore-edge input[name="explore-edge"]:checked')?.value;
}

/** The walls' rules as typed in the Limits popover, for changeArena(). */
function wallTexts() {
  const texts = {};
  for (const { key } of WALL_KINDS) {
    texts[key] = {
      birth: document.getElementById(`explore-wall-${key}-birth`).value,
      survival: document.getElementById(`explore-wall-${key}-survival`).value,
    };
  }
  return texts;
}

function showWallRules() {
  const rules = document.getElementById('explore-walls-rules');
  if (!rules) return;
  rules.hidden = chosenEdge() !== 'walls';
  placeOpenPopover();
}

function isArenaLocked() {
  return !limitsOwn && lockOf(state.explore)?.by === 'saved';
}

function showLimitsLock() {
  const locked = isArenaLocked();
  document.getElementById('explore-arena-locked').hidden = !locked;
  const on = document.getElementById('explore-arena-on');
  on.disabled = locked;
  document.getElementById('explore-arena-side').disabled = locked || !on.checked;
  document.getElementById('explore-edge').disabled = locked || !on.checked;
  setText('explore-limits-note', restartNote(limitsOwn ? 0 : startOf(state.explore)));
  placeOpenPopover();
}

// ---- The page ----

function applyButton(popoverId) {
  return document.getElementById(popoverId).querySelector('[type="submit"]');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/** Neighbour counts as the boxes show them, such as 5-15; a rule as B9,10 / S5-15. */
function ruleText(rules) {
  if (Array.isArray(rules)) return counts(rules);
  return `B${counts(rules.birth)} / S${counts(rules.survival)}`;
}

function counts(list) {
  const parts = [];
  for (let i = 0; i < list.length; i++) {
    let j = i;
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
    parts.push(j > i ? `${list[i]}-${list[j]}` : `${list[i]}`);
    i = j;
  }
  return parts.join(',');
}
