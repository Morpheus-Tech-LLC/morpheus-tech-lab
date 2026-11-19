// SPDX-License-Identifier: Apache-2.0
//
// Explore's settings in the HUD (#69). The Seed, Rules and Limits boxes, sections of the HUD's
// Simulation panel, each have a gear in their title that opens a popover beside the box
// (popover.js), whose Apply changes Explore's settings (`state.explore`, a setup from setup.js)
// and restarts the run. Cancel, Esc or a click outside changes nothing: each popover fills its
// fields from the settings when it opens, and keeps what the visitor does there to itself until
// Apply.
//
// The Seed popover also opens the seed editor (editor.js, #70): Design… under Custom, on the seed
// in use, and Edit a copy… under Preset. The editor's Use changes the settings and restarts the run
// as Apply does. Its Use in a contest (#95) takes the seed in use and its rules into the contest
// chosen beside it, Methuselah or Classic Methuselah (#102), through controls.js, or says why they
// can't be an entry.

import { state } from '../state.js';
import { startExplore } from './explore.js';
import { openPopover, closePopover, isPopoverOpen, placeOpenPopover } from './popover.js';
import { readSeedOrSave } from './save.js';
import { openEditor, closeEditor } from './editor.js';
import { MAX_RESULT_BYTES } from '../unbounded/canonical.js';
import { CONTESTS } from '../unbounded/contests.js';
import { PRESETS, PRESET_GROUPS, presetById } from './presets.js';
import { MAX_SHAPE_SIZE, parseCounts } from './seed.js';
import {
  SHAPES, shapeByKey, makeShape, presetSeed, fileSeed, changeSeed, changeRules, changeArena, changeMemory,
  configOf, boxesOf, lockOf, rulesOf, arenaOf, edgeOf, startOf, WALL_KINDS, restartNote, seedLabel, deathCounts,
  designOf, presetCopy, useDesign, contestEntry,
} from './setup.js';

/** The contests Use in a contest offers: those an entry brings its seed and rules to. */
const ENTRY_CONTESTS = CONTESTS.filter((contest) => contest.kind === 'methuselah');

/** The contest chosen beside Use in a contest: Methuselah, until the visitor picks another. */
function entryContest() {
  const chosen = document.getElementById('explore-contest-choice')?.value;
  return ENTRY_CONTESTS.find((contest) => contest.id === chosen) ?? ENTRY_CONTESTS[0];
}

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
/** Use in a contest: controls.js opens Contests on the contest, with the entry. */
let enterContest = null;

/**
 * Wires the boxes' gears and the popovers. Runs once; controls.js calls it.
 * @param {{restart?: () => void}} [options] - restart: resets the page around a run and calls
 *   startFromSetup()
 */
export function initHud({ restart, useInContest } = {}) {
  if (restart) restartRun = restart;
  if (useInContest) enterContest = useInContest;
  if (wired) return;
  wired = true;
  wireCollapse();
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
  setText('explore-seed-label', boxes.seed);
  setText('explore-seed-cells', n(boxes.cells));
  const lock = document.getElementById('explore-rules-lock');
  if (lock) {
    lock.hidden = !boxes.lock;
    lock.textContent = boxes.lock ?? '';
  }
  const edge = { end: '', ships: ', ships leave', wrap: ', wraps', walls: ', walls' }[boxes.edge];
  setText('explore-arena', boxes.arena ? `${n(boxes.arena)}³${boxes.arenaLocked ? ', saved' : ''}${edge}` : 'off');
  setText('explore-memory-limit', `${n(boxes.memoryMB)} MB`);
}

/** The settings dialog's line in Game of Life 3D, saying where its settings went. */
export function settingsNote() {
  const where = "Game of Life 3D's seed, rules, arena and memory limit are changed from its boxes at the top left, under Game of Life 3D.";
  return state.showHUD === false ? `${where} Show them with the HUD button.` : where;
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

// ---- Seed ----

// What the Seed popover holds until Apply: whether it shows Preset or Custom, which preset, where
// Custom's cells come from, and a file loaded with Load… (its seed, or why it can't be used)
const seedDraft = { preset: false, presetId: PRESETS[0].id, source: 'shape', file: null, fileError: null };

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

function wireSeed() {
  const popover = document.getElementById('explore-seed-popover');
  const presetSelect = document.getElementById('explore-preset');
  const shapeSelect = document.getElementById('explore-shape');
  if (!popover || !presetSelect || !shapeSelect) return;
  presetSelect.replaceChildren(...groupedOptions(PRESETS, 'id', 'name'));
  shapeSelect.replaceChildren(...groupedOptions(SHAPES, 'key', 'name'));

  const byId = (id) => document.getElementById(id);
  byId('explore-seed-custom').onclick = () => { seedDraft.preset = false; showSeedDraft(); };
  byId('explore-seed-preset').onclick = () => { seedDraft.preset = true; showSeedDraft(); };
  presetSelect.onchange = () => { seedDraft.presetId = presetSelect.value; showSeedDraft(); };
  byId('explore-source-shape').onclick = () => { seedDraft.source = 'shape'; showSeedDraft(); };
  byId('explore-source-file').onclick = () => { seedDraft.source = 'file'; showSeedDraft(); };
  byId('explore-source-design').onclick = () => { seedDraft.source = 'design'; showSeedDraft(); };
  byId('explore-design').onclick = openDesign;
  byId('explore-edit-copy').onclick = openCopy;
  byId('explore-use-in-contest').onclick = useInContest;
  const contestChoice = byId('explore-contest-choice');
  contestChoice.replaceChildren(...ENTRY_CONTESTS.map((contest) => {
    const option = document.createElement('option');
    option.value = contest.id;
    option.textContent = contest.title;
    return option;
  }));
  contestChoice.onchange = () => {
    showContestStatus();
    showError(byId('explore-contest-error'), null);
    placeOpenPopover();
  };
  shapeSelect.onchange = () => { fillShapeFields(shapeSelect.value); showSeedDraft(); };

  const fileInput = byId('explore-seed-file');
  byId('explore-load-seed').onclick = () => fileInput.click();
  fileInput.onchange = async () => {
    const file = fileInput.files?.[0];
    fileInput.value = ''; // so loading the same file again still fires
    if (!file) return;
    try {
      if (file.size > MAX_SEED_FILE_BYTES) throw new Error(`it is larger than ${MAX_SEED_FILE_BYTES / 2 ** 20} MB.`);
      seedDraft.file = fileSeed(file.name, await readSeedOrSave(await file.text()));
      seedDraft.fileError = null;
    } catch (err) {
      seedDraft.file = null;
      seedDraft.fileError = `${file.name} can't be used: ${err.message}`;
    }
    showSeedDraft();
  };

  wirePopover('explore-change-seed', 'explore-seed-popover', fillSeed, () => {
    const setup = state.explore;
    if (seedDraft.preset) return changeSeed(setup, presetSeed(seedDraft.presetId));
    if (seedDraft.source === 'file') {
      if (!seedDraft.file) throw new Error(seedDraft.fileError ?? 'Load a seed file or a saved generation first, with Load….');
      // The same file as now: its seed as it is in use, without its rules again
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
    // The shape's settings, so the popover, and the dialog in the other modes, open with them
    if (next.seed.params) state.shapeParams[key] = { ...next.seed.params };
    return next;
  });
}

// The popover opens on the seed in use
function fillSeed() {
  const { seed } = state.explore;
  seedDraft.preset = seed.kind === 'preset';
  if (seed.kind === 'preset') seedDraft.presetId = seed.id;
  seedDraft.source = seed.kind === 'file' || seed.kind === 'saved' ? 'file' : seed.kind === 'design' ? 'design' : 'shape';
  seedDraft.file = seedDraft.source === 'file' ? seed : null;
  seedDraft.fileError = null;
  document.getElementById('explore-preset').value = seedDraft.presetId;
  const key = seed.kind === 'shape' ? seed.key : 'cube';
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
  const { preset, source } = seedDraft;
  byId('explore-seed-custom').setAttribute('aria-pressed', String(!preset));
  byId('explore-seed-preset').setAttribute('aria-pressed', String(preset));
  byId('explore-seed-preset-part').hidden = !preset;
  byId('explore-seed-custom-part').hidden = preset;
  byId('explore-source-shape').setAttribute('aria-pressed', String(source === 'shape'));
  byId('explore-source-file').setAttribute('aria-pressed', String(source === 'file'));
  byId('explore-source-design').setAttribute('aria-pressed', String(source === 'design'));
  byId('explore-seed-shape-part').hidden = source !== 'shape';
  byId('explore-seed-file-part').hidden = source !== 'file';
  byId('explore-seed-design-part').hidden = source !== 'design';
  setText('explore-design-status', designStatus());

  const chosen = presetById(seedDraft.presetId);
  byId('explore-preset-description').textContent = chosen?.description ?? '';
  setText('explore-edit-copy-note', chosen
    ? `Edit a copy… opens ${chosen.name}'s cells in the seed editor. Its Use makes them a Custom seed with ${chosen.name}'s rules, which you can then change; ${chosen.name} itself stays as it is.` : '');
  byId('explore-preset-rules').textContent = chosen
    ? `It comes with its own rules, ${ruleText(chosen.rules)}, which can't be changed while it is the seed.` : '';

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
    ? `${presetById(shape.preset).name}'s ${(presetById(shape.preset).cells.length / 3).toLocaleString('en')} cells, under the rules in the Rules box.`
    : fields.about);

  const { file, fileError } = seedDraft;
  const n = (x) => x.toLocaleString('en');
  let status;
  if (fileError) status = fileError;
  else if (!file) status = 'Load takes a seed file, which brings its cells and puts its rules in the Rules box, or a saved generation, which carries on from its generation under its own rules and arena.';
  else if (file.kind === 'saved') status = `${file.name}: generation ${n(file.from)} of a saved run, ${n(file.cells.length / 3)} cells, with its own rules, ${ruleText(file.rules)}, and ${file.arena ? `a ${n(file.arena)}³ arena` : 'no arena'}. They stay locked while it is the seed.`;
  else if (file === state.explore.seed) status = `${seedLabel(file)}: ${n(file.cells.length / 3)} cells, in use now.`;
  else status = `${file.name}: ${n(file.cells.length / 3)} cells. Its rules, ${ruleText(file.rules)}, go into the Rules box, where you can change them.`;
  setText('explore-seed-status', status);

  const from = !preset && source === 'file' && file?.kind === 'saved' ? file.from : 0;
  setText('explore-seed-note', restartNote(from));
  showError(byId('explore-seed-error'), null);
  showContestStatus();
  showError(byId('explore-contest-error'), null);
  placeOpenPopover();
}

/** What Use in a contest will do, for the contest chosen beside it. */
function showContestStatus() {
  const n = (x) => x.toLocaleString('en');
  const contest = entryContest();
  const inUse = state.explore.seed;
  setText('explore-contest-status', `Use in a contest takes the seed in use (${seedLabel(inUse)}, ${n(inUse.cells.length / 3)} cells) and its rules, ${ruleText(rulesOf(state.explore))}, into ${contest.title}, ready to run, exactly as they are.`);
}

// Use in a contest: the seed in use and its rules into the contest, or why they can't be an entry
function useInContest() {
  const contest = entryContest();
  const found = contestEntry(state.explore, contest);
  if (found.reason || !enterContest) {
    showError(document.getElementById('explore-contest-error'), found.reason ?? 'The contests aren\'t available here.');
    placeOpenPopover();
    return;
  }
  closePopover({ restoreFocus: false });
  enterContest(contest.id, found.entry);
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
  const copy = presetCopy(seedDraft.presetId);
  openFromPopover({
    places: copy.places,
    rules: copy.rules,
    rulesFrom: `${copy.name}'s rules`,
    note: `A copy of ${copy.name}. Use makes it a Custom seed with ${copy.name}'s rules, which you can then change; ${copy.name} itself stays as it is.`,
  });
}

function lowerFirst(text) {
  return /^[A-Z][a-z]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;
}

function openFromPopover(options) {
  const gear = document.getElementById('explore-change-seed');
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
      ? `These rules come with ${lock.name}, so it is always the same run. Use your own rules keeps its cells, as a Custom seed, with these rules for you to change.`
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
