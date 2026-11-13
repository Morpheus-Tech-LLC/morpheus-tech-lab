// SPDX-License-Identifier: Apache-2.0
//
// The seed editor (#70): designing a seed cell by cell in the 10³ seed box. It opens from the Seed
// box's popover (hud.js), Design… under Custom or Edit a copy… under Preset, and takes over the
// main 3D view: Explore's view pauses behind it, and its run, if any, goes on in its Worker. A
// panel at the side holds the tools, and every tool has a key. Use makes the design Explore's
// seed and restarts the run; Cancel, or Esc, leaves everything as it was.
//
// The model (editorModel.js) holds the cells, the cursor, the selection and the history; the view
// (editorView.js) draws them into the lab's renderer, only when something changes.

import { state } from '../state.js';
import { DesignModel, KINDS, AXIS_NAMES, DEFAULT_DENSITY, MOVE_KEYS, moveFor, cursorText, selectionText } from './editorModel.js';
import { EditorView } from './editorView.js';
import { toSeedFile } from './seed.js';
import { readSeedOrSave, SEED_FILE_NAME } from './save.js';
import { designFile } from './setup.js';
import { MAX_RESULT_BYTES } from '../unbounded/canonical.js';
import { writeJsonFile, exploreViewChanged } from './explore.js';

/** A click that moves the pointer less than this, in pixels, picks a cell rather than turning the view. */
const CLICK_SLOP = 5;

/**
 * The open editor, or null.
 * @type {{model: DesignModel, view: EditorView, rules: {birth: number[], survival: number[]},
 *   rulesFrom: string, onUse: (cells: Int32Array, rules: object) => void, returnFocus: HTMLElement | null,
 *   fade: boolean, help: boolean, down: {x: number, y: number} | null} | null}
 */
let session = null;
let wired = false;

export function isEditorOpen() {
  return session !== null;
}

/** Called every frame instead of Explore's: draws the editor if anything changed. */
export function editorFrame() {
  session?.view.render();
}

/**
 * Opens the editor over the main view.
 * @param {object} options
 * @param {Uint8Array | null} options.places - the box's cells (designCells()), or null for an empty box
 * @param {{birth: number[], survival: number[]}} options.rules - the rules Use and Export bring
 * @param {string} options.rulesFrom - where those rules come from, for the panel: "the Rules box"
 * @param {string | null} [options.note] - shown at the panel's head: why the seed couldn't open,
 *   or what a copy is
 * @param {(cells: Int32Array, rules: object) => void} options.onUse - makes the design the seed and
 *   restarts the run; throws saying why it can't
 * @param {HTMLElement | null} [options.returnFocus] - takes focus back when the editor closes
 */
export function openEditor({ places, rules, rulesFrom, note = null, onUse, returnFocus = null }) {
  if (session) closeEditor();
  wire();
  const canvas = state.renderer.domElement;
  if (state.controls) state.controls.enabled = false; // Explore's camera stays where it was
  const view = new EditorView(state.renderer, { flip: Boolean(state.flipOrientation) });
  session = {
    model: new DesignModel(places),
    view,
    rules,
    rulesFrom,
    onUse,
    returnFocus,
    fade: false,
    help: false,
    down: null,
  };
  document.body.classList.add('seed-editor-open');
  const panel = byId('seed-editor');
  panel.hidden = false;
  showNote('seed-editor-note', note);
  showNote('seed-editor-status', null);
  showNote('seed-editor-error', null);
  byId('seed-editor-density').value = `${DEFAULT_DENSITY}`;
  showHelp(false);
  fitToPanel();
  view.setView('angled');
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'The seed box. Arrow keys and Page Up / Page Down move the cursor; Space switches the selection; ? lists every key.');
  refresh();
  canvas.focus({ preventScroll: true });
}

/** Closes the editor without using the design. */
export function closeEditor() {
  if (!session) return;
  const { view, returnFocus } = session;
  session = null;
  view.dispose();
  const canvas = state.renderer?.domElement;
  if (canvas) {
    canvas.removeAttribute('tabindex');
    canvas.removeAttribute('aria-label');
  }
  if (state.controls) state.controls.enabled = true;
  document.body.classList.remove('seed-editor-open');
  byId('seed-editor').hidden = true;
  exploreViewChanged(); // Explore's view draws again, from a fresh snapshot
  if (returnFocus?.isConnected && !returnFocus.disabled) returnFocus.focus({ preventScroll: true });
}

// ---- What the editor does ----

function act(action) {
  if (!session) return;
  const { model } = session;
  showNote('seed-editor-error', null);
  switch (action) {
    case 'switch':
      model.switchSelection();
      break;
    case 'random': {
      const density = Number(byId('seed-editor-density').value);
      if (!(density >= 0 && density <= 1) || byId('seed-editor-density').value === '') {
        showNote('seed-editor-error', 'The density must be from 0 to 1.');
        return;
      }
      model.randomFill(density, Math.random);
      break;
    }
    case 'undo':
      model.undo();
      break;
    case 'redo':
      model.redo();
      break;
    case 'fade':
      session.fade = !session.fade;
      break;
    case 'help':
      showHelp(!session.help);
      return;
    case 'use':
      use();
      return;
    case 'cancel':
      closeEditor();
      return;
    case 'load':
      byId('seed-editor-file').click();
      return;
    case 'export':
      exportDesign();
      return;
    default:
      return;
  }
  refresh();
}

function use() {
  const { model, rules, onUse } = session;
  try {
    onUse(model.toCells(), rules);
  } catch (err) {
    showNote('seed-editor-error', err.message);
  }
}

async function exportDesign() {
  const { model, rules } = session;
  if (!model.count) {
    showNote('seed-editor-error', 'The design has no live cells to export: switch some on first.');
    return;
  }
  const text = toSeedFile({ rules, cells: model.toCells() });
  try {
    const status = await writeJsonFile(SEED_FILE_NAME, text, 'Explore seed file');
    showNote('seed-editor-status', `${status} Load it in the Seed box, under Custom, File, or in this editor with Load…, to open it again.`);
  } catch (err) {
    if (err?.name !== 'AbortError') showNote('seed-editor-error', `Not exported: ${err.message}`);
  }
}

async function load(file) {
  if (!session || !file) return;
  const open = session;
  try {
    if (file.size > MAX_RESULT_BYTES) throw new Error(`${file.name} is larger than ${MAX_RESULT_BYTES / 2 ** 20} MB.`);
    const loaded = designFile(file.name, await readSeedOrSave(await file.text()));
    if (session !== open) return;
    open.model.replace(loaded.places);
    open.rules = loaded.rules;
    open.rulesFrom = file.name;
    showNote('seed-editor-status', `Loaded ${file.name}: ${open.model.count.toLocaleString('en')} cells. Undo goes back to the design before it.`);
    showNote('seed-editor-error', null);
  } catch (err) {
    if (session !== open) return;
    const message = err.message.startsWith(file.name) ? err.message : `${file.name} can't be used: ${err.message}`;
    showNote('seed-editor-error', message);
  }
  refresh();
}

function move(key) {
  const step = moveFor(key, session.view.screenView());
  if (!step) return;
  session.model.moveCursor(step.axis, step.delta);
  refresh();
}

function setKind(kind) {
  session.model.setKind(kind);
  refresh();
}

function setAxis(axis) {
  session.model.setAxis(axis);
  refresh();
}

// ---- The page ----

// Shows the model in the view and the panel
function refresh() {
  if (!session) return;
  const { model, view, fade, rules, rulesFrom } = session;
  view.update(model, { fade });
  const n = (x) => x.toLocaleString('en');
  setText('seed-editor-count', n(model.count));
  setText('seed-editor-cursor', cursorText(model.cursor));
  setText('seed-editor-selection', selectionText(model));
  for (const button of document.querySelectorAll('#seed-editor [data-kind]')) {
    button.setAttribute('aria-pressed', String(button.dataset.kind === model.kind));
  }
  const axisMatters = model.kind === 'line' || model.kind === 'plane' || model.kind === 'cell';
  for (const button of document.querySelectorAll('#seed-editor [data-axis]')) {
    button.setAttribute('aria-pressed', String(Number(button.dataset.axis) === model.axis));
  }
  byId('seed-editor-axes').classList.toggle('is-quiet', !axisMatters);
  byId('seed-editor-undo').disabled = !model.canUndo;
  byId('seed-editor-redo').disabled = !model.canRedo;
  byId('seed-editor-fade').setAttribute('aria-pressed', String(fade));
  setText('seed-editor-rules', `Use runs it, and Export saves it, with ${ruleText(rules)}, from ${rulesFrom}.`);
}

// The view's centre moves into the part of the window the panel leaves free
function fitToPanel() {
  if (!session) return;
  const panel = byId('seed-editor');
  const rect = panel.getBoundingClientRect();
  const atFoot = rect.top > window.innerHeight / 3;
  session.view.setInset(atFoot ? { bottom: window.innerHeight - rect.top } : { right: window.innerWidth - rect.left });
}

function showHelp(on) {
  if (session) session.help = on;
  byId('seed-editor-help').hidden = !on;
  byId('seed-editor-help-button').setAttribute('aria-expanded', String(on));
}

function wire() {
  if (wired) return;
  wired = true;
  const panel = byId('seed-editor');
  const canvas = state.renderer.domElement;

  panel.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button || !session) return;
    if (button.dataset.action) act(button.dataset.action);
    else if (button.dataset.kind) setKind(button.dataset.kind);
    else if (button.dataset.axis) setAxis(Number(button.dataset.axis));
    else if (button.dataset.move) move(button.dataset.move);
    else if (button.dataset.view) session.view.setView(button.dataset.view);
    // A button pressed with the pointer hands the keys back to the view, so Space switches the
    // selection rather than pressing the button again; one pressed from the keyboard keeps focus
    if (session && e.detail > 0) canvas.focus({ preventScroll: true });
  });
  byId('seed-editor-file').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // so loading the same file again still fires
    load(file);
  });

  // A click on a cell moves the cursor there; Shift+click sets a box's anchor. A drag turns the view.
  canvas.addEventListener('pointerdown', (e) => {
    if (session && e.button === 0) session.down = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('pointerup', (e) => {
    if (!session?.down) return;
    const { x, y } = session.down;
    session.down = null;
    if (Math.hypot(e.clientX - x, e.clientY - y) > CLICK_SLOP) return;
    const cell = session.view.pick(e.clientX, e.clientY);
    if (!cell) return;
    if (e.shiftKey) session.model.setAnchor(cell);
    else session.model.setCursor(cell);
    refresh();
  });

  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', () => {
    if (!session) return;
    fitToPanel();
  });
}

function onKey(e) {
  if (!session) return;
  const target = e.target;
  const typing = target instanceof HTMLElement && target.closest('input, select, textarea');
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    if (session.help) showHelp(false);
    else closeEditor();
    return;
  }
  if (typing) return; // the density field takes its own keys
  const onButton = target instanceof HTMLElement && target.closest('button, a');
  const ctrl = e.ctrlKey || e.metaKey;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (ctrl && (key === 'z' || key === 'y')) {
    e.preventDefault();
    act(key === 'y' || e.shiftKey ? 'redo' : 'undo');
    return;
  }
  if (ctrl || e.altKey) return;
  if (MOVE_KEYS[e.key]) {
    e.preventDefault();
    move(e.key);
    return;
  }
  if (key === ' ' || key === 'Enter') {
    if (onButton) return; // Space and Enter press the focused button
    e.preventDefault();
    act('switch');
    return;
  }
  const kind = KINDS[Number(key) - 1];
  if (kind) {
    e.preventDefault();
    setKind(kind);
  } else if (AXIS_NAMES.includes(key)) {
    e.preventDefault();
    setAxis(AXIS_NAMES.indexOf(key));
  } else if (key === 'r') {
    e.preventDefault();
    act('random');
  } else if (key === 'f') {
    e.preventDefault();
    act('fade');
  } else if (key === '?') {
    e.preventDefault();
    act('help');
  }
}

function byId(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const el = byId(id);
  if (el) el.textContent = text;
}

function showNote(id, text) {
  const el = byId(id);
  if (!el) return;
  el.hidden = !text;
  el.textContent = text ?? '';
}

function ruleText(rules) {
  const counts = (list) => {
    const parts = [];
    for (let i = 0; i < list.length; i++) {
      let j = i;
      while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
      parts.push(j > i ? `${list[i]}-${list[j]}` : `${list[i]}`);
      i = j;
    }
    return parts.join(',') || 'none';
  };
  return `B${counts(rules.birth)} / S${counts(rules.survival)}`;
}
