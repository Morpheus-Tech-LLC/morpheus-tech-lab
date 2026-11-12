// SPDX-License-Identifier: Apache-2.0
//
// Explore: the unbounded world, run indefinitely, with no score and no clock. The engine runs
// in a Web Worker (src/unbounded/driver.js); this module starts it, sends it the control bar's
// commands, shows its statistics, and asks it for a snapshot whenever the view is ready for one.
//
// Unlike the other modes, Explore computes nothing ahead: state.simulationData stays null, and
// the other modes' playback (time.js, updatePoints()) leaves it alone.

import { state } from '../state.js';
import { initSpace } from '../space.js';
import { EngineDriver } from '../unbounded/driver.js';
import { ExploreView, RENDER_BUDGET } from './view.js';
import { toSeedFile, arenaBox, shapeSeed } from './seed.js';
import { cubeOfSide } from '../shapeGenerators.js';

/**
 * Defaults pinned by #39's measurements: one tab in Chrome on a 16 GB machine could take 6 GB of
 * slabs, so 1 GB stays well under any laptop browser's cap. The arena is the Discovery contests'.
 */
export const DEFAULT_MEMORY_MB = 1024;
export const DEFAULT_ARENA = 64;
/** How long after the visitor lets go of the view the camera starts following again. */
const FOLLOW_AFTER_MS = 3000;
/** The speed slider's top position runs as fast as possible. */
const SLIDER_MAX = 10;
/** A settled cycle plays back at the slider's rate, but no faster than this, or this when flat out. */
const CYCLE_MAX_RATE = 30;
const CYCLE_FLAT_OUT_RATE = 10;

const ENDINGS = {
  'died': (config, stats) => `Every cell died at generation ${stats.generation.toLocaleString('en')}.`,
  'repeat': (config, stats, cycle) => (cycle.period === 1
    ? `Settled at generation ${cycle.from.toLocaleString('en')}: a still life, which stays as it is from then on.`
    : `Settled at generation ${cycle.from.toLocaleString('en')}: from then on, the pattern repeats every ${cycle.period.toLocaleString('en')} generations. Its cycle keeps playing.`),
  'memory-limit': (config) => `Stopped at the memory limit (${config.memoryMB.toLocaleString('en')} MB): the next block of memory would pass it. A higher limit in the settings lets it go further.`,
  'out-of-memory': () => 'Stopped: the browser refused more memory.',
  'arena-edge': () => 'Stopped: the pattern reached the edge of the arena.',
  'coordinate-limit': () => 'Stopped: the pattern reached the edge of the space the engine can hold, half a million cells from the centre.',
  'error': () => 'Stopped by an error in the engine.',
};

const session = {
  driver: null,
  view: null,
  config: null, // {rules, cells, memoryMB, arena, label}
  status: 'idle', // 'paused', 'running' or 'ended'
  wantSnapshot: false,
  snapshotPending: false,
  lastFrame: 0,
  followFrom: 0, // the camera follows the pattern from this time on
  extent: null, // the live cells' bounding box, from the latest statistics
  chunkSize: 16, // from the latest snapshot
  cycle: null, // a settled run's cycle: {from, period, frames, index, nextAt, redraw}
};

const AXES = ['x', 'y', 'z'];

export function isExplore() {
  return state.simulationMode === 'explore';
}

/**
 * Starts Explore with a seed and rules, in a fresh scene. The caller has already reset the
 * controls (controls.js, on Apply).
 * @param {object} config
 * @param {{birth: number[], survival: number[]}} config.rules - already validated
 * @param {Int32Array} config.cells - the seed, as x, y, z triples
 * @param {number} config.memoryMB
 * @param {number | null} config.arena - the arena's side in cells, or null for none
 * @param {string} config.label - what the seed is, for the HUD
 */
export function startExplore(config) {
  stopExplore();
  state.reset();
  state.autoRotateActive = false; // the first visit's turn would fight the camera's following
  // 3D view, and a slice through the middle of the pattern when the visitor switches to 2D
  state.viewMode = 'full';
  state.sliceAxis = 'x';
  state.sliceIndex = null;
  initSpace();
  const { camera, controls } = state;
  camera.position.set(45, 35, 55);
  controls.target.set(0, 0, 0);
  controls.addEventListener('start', () => { session.followFrom = Infinity; });
  controls.addEventListener('end', () => { session.followFrom = performance.now() + FOLLOW_AFTER_MS; });

  session.view = new ExploreView(state.scene);
  session.config = config;
  session.view.showArena(arenaBox(config.arena));
  document.body.classList.add('mode-explore');
  showHud(config);
  launch();
  document.getElementById('loading-overlay')?.classList.add('hidden');
}

/**
 * The run the lab opens with: the default cube and Explore's default rules, paused on the seed,
 * so nothing runs until the visitor presses play.
 */
export function landingConfig() {
  const { size, density } = state.shapeParams.cube;
  return {
    rules: state.explore.rules,
    cells: shapeSeed(cubeOfSide(size, density), size),
    memoryMB: state.explore.memoryMB,
    arena: state.explore.arena,
    label: 'cube',
  };
}

/** Ends Explore, its Worker and its view: for leaving the mode. */
export function stopExplore() {
  const wasOn = Boolean(session.view);
  session.driver?.close();
  session.driver = null;
  session.view?.dispose();
  session.view = null;
  session.status = 'idle';
  session.wantSnapshot = false;
  session.snapshotPending = false;
  document.body.classList.remove('mode-explore');
  note('explore-view-note', null);
  note('explore-end-note', null);
  if (wasOn) restoreControls();
}

// Puts back what Explore changed in the control bar and the HUD, as the other modes show it
function restoreControls() {
  const slider = document.getElementById('speed-control');
  if (slider) setText('bottom-speed-value', `${Math.round(10 * Number(slider.value))}`);
  setText('bottom-state-value', 'pause');
  const icon = document.getElementById('playPauseIcon');
  if (icon) icon.className = 'play';
  document.getElementById('stepButton')?.classList.remove('disabled');
  setText('rules-birth', stringify(state.rules.birth));
  setText('rules-survival', stringify(state.rules.survival));
  setText('rules-isolation', stringify(state.rules.isolation));
  setText('rules-overcrowd', stringify(state.rules.overcrowding));
  const params = state.shapeParams?.[state.shapeKey];
  if (params) {
    setText('shape-size-value', `${params.size}`);
    setText('shape-density-value', Number(params.density).toFixed(2));
  }
}

/**
 * The view controls changed (3D or 2D, the slice's axis or index): redraw from a new snapshot,
 * and fit the slice slider to the pattern.
 */
export function exploreViewChanged() {
  if (!session.view) return;
  fitSliceSlider();
  session.wantSnapshot = true;
  if (session.cycle) session.cycle.redraw = true;
}

/** The seed and rules on screen as a seed file's text, or null when Explore isn't running. */
export function currentSeedFile() {
  return session.config ? toSeedFile(session.config) : null;
}

// ---- The control bar ----

export function togglePlay() {
  if (session.status === 'running') session.driver.pause();
  else if (session.status === 'paused') session.driver.resume();
}

export function stepOnce() {
  if (session.status === 'paused') session.driver.step();
}

export function restart() {
  if (session.config) launch();
}

/** The speed slider: generations per second, 10 per step of the slider, flat out at the top. */
export function rateFromSlider(value) {
  return Number(value) >= SLIDER_MAX ? null : Number(value) * 10;
}

export function setSpeed(value) {
  const rate = rateFromSlider(value);
  session.driver?.setRate(rate);
  showSpeed(rate);
}

// ---- Every frame (time.js) ----

/** Asks for a snapshot when the view is ready for one, and moves the camera. */
export function exploreFrame(now) {
  const { view, driver } = session;
  if (!view) return;
  const playing = playCycle(now);
  if (driver && session.wantSnapshot && !session.snapshotPending && !playing) {
    session.wantSnapshot = false;
    session.snapshotPending = true;
    const options = { budget: RENDER_BUDGET };
    if (state.viewMode === 'slice' && state.sliceIndex !== null) {
      options.slice = { axis: AXES.indexOf(state.sliceAxis), index: state.sliceIndex };
    }
    driver.snapshot(options)
      .then((snapshot) => {
        if (session.view !== view || session.cycle?.frames) return; // restarted, or a cycle plays
        session.chunkSize = snapshot.chunkSize;
        view.show(snapshot);
        showViewNote(snapshot);
        if (session.status === 'running') session.wantSnapshot = true; // the next, when drawn
      })
      .catch(() => {}) // the run was closed; nothing to draw
      .finally(() => { if (session.view === view) session.snapshotPending = false; });
  }
  const elapsedMs = session.lastFrame ? Math.min(now - session.lastFrame, 100) : 16;
  session.lastFrame = now;
  view.showGrid(Boolean(state.showWireframeGrid), session.extent, session.chunkSize);
  view.frame({
    camera: state.camera,
    controls: state.controls,
    elapsedMs,
    follow: now >= session.followFrom,
    cellSize: state.cellSize ?? 1.2,
    flip: state.flipOrientation,
  });
}

// A settled oscillator's cycle loops on screen, from frames the Worker made once, while the
// generation count stays where the run stopped. @returns {boolean} whether a cycle is playing
function playCycle(now) {
  const cycle = session.cycle;
  if (!cycle?.frames) return false;
  const slider = document.getElementById('speed-control');
  const rate = Math.min(CYCLE_MAX_RATE, rateFromSlider(slider ? slider.value : SLIDER_MAX) ?? CYCLE_FLAT_OUT_RATE);
  if (now >= cycle.nextAt) {
    cycle.index = (cycle.index + 1) % cycle.period;
    cycle.nextAt = now + 1000 / rate;
    cycle.redraw = true;
  }
  if (cycle.redraw) {
    cycle.redraw = false;
    let cells = cycle.frames[cycle.index];
    if (state.viewMode === 'slice' && state.sliceIndex !== null) {
      cells = inPlane(cells, AXES.indexOf(state.sliceAxis), state.sliceIndex);
    }
    session.view.show({ cells });
  }
  return true;
}

function inPlane(cells, axis, index) {
  const found = [];
  for (let i = 0; i < cells.length; i += 3) {
    if (cells[i + axis] === index) found.push(cells[i], cells[i + 1], cells[i + 2]);
  }
  return Int32Array.from(found);
}

// ---- The run ----

function launch() {
  const { config } = session;
  session.driver?.close();
  session.status = 'idle';
  session.wantSnapshot = false;
  session.snapshotPending = false;
  session.followFrom = 0;
  session.extent = null;
  session.cycle = null;
  setText('explore-settled', 'no');
  note('explore-end-note', null);
  setPlaying(false);

  const slider = document.getElementById('speed-control');
  const rate = rateFromSlider(slider ? slider.value : SLIDER_MAX);
  showSpeed(rate);
  const driver = new EngineDriver({
    onStats: (stats) => {
      if (session.driver !== driver) return;
      showStats(stats);
    },
    onState: (runState, stats, reason, cycle) => {
      if (session.driver !== driver) return;
      session.status = runState;
      setPlaying(runState === 'running');
      showStats(stats);
      session.wantSnapshot = true;
      if (runState === 'ended') endWith(driver, reason, stats, cycle);
    },
    onError: (message) => {
      if (session.driver !== driver) return;
      note('explore-end-note', message);
    },
  });
  session.driver = driver;
  const world = { rules: config.rules, limits: { memory: config.memoryMB * 2 ** 20 } };
  const arena = arenaBox(config.arena);
  if (arena) world.arena = arena;
  // The seed is transferred to the Worker, so it gets a copy: Restart needs the original.
  // Settling ends the run when the pattern dies or repeats.
  driver.start({ world, seed: config.cells.slice(), run: { kind: 'open', paused: true, rate, settle: true } });
}

function endWith(driver, reason, stats, cycle) {
  const { config } = session;
  const ending = ENDINGS[reason]?.(config, stats, cycle) ?? `Stopped (${reason}).`;
  const settled = reason === 'died' || reason === 'repeat';
  setText('bottom-state-value', reason === 'died' ? 'died' : reason === 'repeat' ? (cycle.period === 1 ? 'still' : 'cycle') : 'ended');
  setText('explore-settled', reason === 'died' ? 'died'
    : reason === 'repeat' ? (cycle.period === 1 ? 'still life' : `every ${cycle.period.toLocaleString('en')}`) : 'no');
  if (reason === 'repeat' && cycle.period > 1) {
    note('explore-end-note', ending);
    session.cycle = { ...cycle, frames: null, index: 0, nextAt: 0, redraw: true };
    // Frames for the whole cycle, if it is small enough to keep and redraw every frame
    driver.cycle({ budget: 4 * RENDER_BUDGET }).then((answer) => {
      if (session.driver !== driver) return;
      const fits = answer.frames?.every((frame) => frame.length / 3 <= RENDER_BUDGET);
      if (fits) session.cycle.frames = answer.frames;
      else note('explore-end-note', `${ending} The cycle is too large to play back, so its first generation stays on screen.`);
    }).catch(() => {});
    return;
  }
  const after = settled ? 'Restart runs the seed again.' : `Generation ${stats.generation.toLocaleString('en')} stays on screen; Restart runs the seed again.`;
  note('explore-end-note', `${ending} ${after}`);
}

// ---- The page ----

function setPlaying(playing) {
  state.isPlaying = playing;
  const icon = document.getElementById('playPauseIcon');
  if (icon) icon.className = playing ? 'pause' : 'play';
  const stateValue = document.getElementById('bottom-state-value');
  if (stateValue) stateValue.textContent = session.status === 'ended' ? 'ended' : playing ? 'play' : 'pause';
  document.getElementById('stepButton')?.classList.toggle('disabled', session.status !== 'paused');
}

function showSpeed(rate) {
  const el = document.getElementById('bottom-speed-value');
  if (el) el.textContent = rate === null ? 'max' : `${Math.round(rate)}`;
}

function showHud(config) {
  setText('shape-name-value', config.label);
  setText('shape-density-value', '–');
  setText('shape-size-value', `${(config.cells.length / 3).toLocaleString('en')} cells`);
  setText('rules-birth', stringify(config.rules.birth));
  setText('rules-survival', stringify(config.rules.survival));
  setText('rules-isolation', '–');
  setText('rules-overcrowd', '–');
  setText('bottom-direction-value', 'fwd');
}

function showStats(stats) {
  const n = (x) => x.toLocaleString('en');
  setText('explore-generation', n(stats.generation));
  setText('explore-live', n(stats.live));
  setText('explore-live-peak', n(stats.livePeak));
  setText('explore-chunks', n(stats.chunks));
  if (session.status === 'running' || stats.rate) setText('explore-rate', n(Math.round(stats.rate)));
  setText('explore-extent', stats.extent ? stats.extent.max.map((hi, a) => hi - stats.extent.min[a] + 1).join('×') : '–');
  // Memory: what the pattern's chunks use now, which moves with it, and what the engine has
  // reserved, a 64 MB block at a time, of the limit, which counts the reserved blocks
  setText('explore-memory-live', bytes(stats.usedBytes));
  const limit = session.config ? ` / ${n(session.config.memoryMB)}` : '';
  setText('explore-memory-used', `${n(Math.round(stats.memoryBytes / 2 ** 20))}${limit} MB`);
  setText('bottom-gen', n(stats.generation));
  session.extent = stats.extent;
  fitSliceSlider();
}

// The slice slider spans the pattern's extent on the slice's axis, which grows as it does. A
// slice that the pattern no longer reaches moves to its nearest edge.
function fitSliceSlider() {
  const slider = document.getElementById('slice-index');
  const a = Math.max(0, AXES.indexOf(state.sliceAxis));
  const min = session.extent ? session.extent.min[a] : 0;
  const max = session.extent ? session.extent.max[a] : 0;
  const index = state.sliceIndex ?? Math.round((min + max) / 2);
  const clamped = Math.min(max, Math.max(min, index));
  if (clamped !== state.sliceIndex) {
    state.sliceIndex = clamped;
    session.wantSnapshot = true;
  }
  if (slider) {
    slider.min = `${min}`;
    slider.max = `${max}`;
    slider.value = `${clamped}`;
  }
  // As in the other modes: the slice's position across the pattern, and the last position
  if (state.viewMode === 'slice') setText('view-controls-display-text', `${clamped - min} / ${max - min}`);
}

function showViewNote(snapshot) {
  if (snapshot.chunks && snapshot.slice) {
    note('explore-view-note', `This slice holds more than ${RENDER_BUDGET.toLocaleString('en')} live cells, so the view shows the chunks it crosses (${snapshot.chunkSize}³ cells each), brighter where fuller.`);
  } else if (snapshot.chunks) {
    note('explore-view-note', `${snapshot.live.toLocaleString('en')} live cells: more than ${RENDER_BUDGET.toLocaleString('en')}, so the view shows the chunks that hold them (${snapshot.chunkSize}³ cells each), brighter where fuller.`);
  } else {
    note('explore-view-note', null);
  }
}

function bytes(count) {
  if (count < 2 ** 20) return `${Math.round(count / 1024).toLocaleString('en')} KB`;
  return `${(count / 2 ** 20).toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`;
}

function note(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = !text;
  el.textContent = text ?? '';
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function stringify(counts) {
  const parts = [];
  for (let i = 0; i < counts.length; i++) {
    let j = i;
    while (j + 1 < counts.length && counts[j + 1] === counts[j] + 1) j++;
    parts.push(j > i ? `${counts[i]}-${counts[j]}` : `${counts[i]}`);
    i = j;
  }
  return parts.join(',') || '–';
}
