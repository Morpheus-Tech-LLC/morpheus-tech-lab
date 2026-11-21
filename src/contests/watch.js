// SPDX-License-Identifier: Apache-2.0
//
// Watch (#78): a result file played back in 3D. It works for any result: a Speed run's, one
// loaded through Verify a result, and later the Hall of Fame's. The panel hides, and the run is
// replayed from its seed in a Worker (run.js's replay kind) and drawn with Explore's view. The
// control bar's play, pause, step and speed work as in Explore, a scrub bar above it seeks to any
// generation up to the result's, and Close brings the panel back. The control bar's view
// settings apply as in Explore: the grid, the orientation, the cell size, and 3D or a 2D slice.
//
// The replay keeps no history, only keyframes, so a seek restores the nearest one and steps on.
// When the replay first reaches the result's generation, the Worker hashes its cells and compares
// them with the result's hash: Watch, and the results card, then say whether the run is
// self-verified.
//
// A Classic Methuselah result (#102) replays with ships leaving at the edge, as its run did: the
// scrub bar marks the generations they left at, and a line says how many have left so far.
//
// The result is read with readResult() before it gets here, and nothing from it is ever parsed
// as HTML: the text Watch shows is set with textContent.

import { state } from '../state.js';
import { EngineDriver } from '../unbounded/driver.js';
import { contestById, departuresFor } from '../unbounded/contests.js';
import { worldOptions } from '../unbounded/canonical.js';
import { ExploreView, RENDER_BUDGET } from '../explore/view.js';
import { rateFromSlider, fitSlice } from '../explore/explore.js';
import { SPEED_MEMORY_MB } from './speed.js';
import { watchGenerationText, selfVerifiedText, watchDeparturesText } from './format.js';

/** How long after the visitor lets go of the view the camera starts following again. */
const FOLLOW_AFTER_MS = 3000;
/** The speed slider's value when it isn't on the page: flat out. */
const SLIDER_MAX = 10;
const AXES = ['x', 'y', 'z'];

const watch = {
  driver: null,
  view: null,
  result: null,
  status: 'idle', // then 'running', 'paused', 'seeking' or 'ended', as the Worker reports
  generation: 0,
  wantSnapshot: false,
  snapshotPending: false,
  lastFrame: 0,
  followFrom: 0,
  dragging: false, // the scrub bar is held: the Worker's generation doesn't move it meanwhile
  seekTo: null, // the generation the scrub bar asked for, until the replay is there
  replayed: null, // what the replay found at the result's generation, once it has
  extent: null, // the live cells' bounding box, from the latest statistics: the grid and the slice
  chunkSize: 16, // from the latest snapshot
  onClose: null,
  onReplayed: null,
};

const el = (id) => document.getElementById(id);
const followed = new WeakSet(); // the orbit controls Watch has told to pause the following

export function isWatching() {
  return Boolean(watch.view);
}

/**
 * Plays a result back in 3D, over the Contests panel.
 * @param {object} result - read with readResult(): {run, generation, hash, …}
 * @param {object} [options]
 * @param {string} [options.title] - what is being watched, for the bar
 * @param {(found: {verdict: string, text: string}) => void} [options.onReplayed] - once the
 *   replay first ends: what it found, in words
 * @param {() => void} [options.onClose] - Watch has closed: the panel can come back
 */
export function openWatch(result, { title = 'Watch', onReplayed, onClose } = {}) {
  closeWatch({ quietly: true });
  const contest = contestById(result.run.contest);
  watch.result = result;
  watch.onClose = onClose ?? null;
  watch.onReplayed = onReplayed ?? null;
  watch.replayed = null;
  watch.status = 'idle';
  watch.generation = 0;
  watch.seekTo = null;
  watch.dragging = false;
  watch.wantSnapshot = true;
  watch.snapshotPending = false;
  watch.lastFrame = 0;
  watch.followFrom = 0;
  watch.extent = null;
  watch.chunkSize = contest?.chunkSize ?? 16;
  // 3D, or the 2D slice already chosen, through the middle of the pattern until moved
  if (state.viewMode !== 'slice') state.viewMode = 'full';
  state.sliceAxis ??= 'x';
  state.sliceIndex = null;

  // Explore's camera, aimed at the seed box, following the pattern as it grows
  const { camera, controls } = state;
  camera.position.set(45, 35, 55);
  controls.target.set(0, 0, 0);
  if (!followed.has(controls)) {
    followed.add(controls);
    controls.addEventListener('start', () => { watch.followFrom = Infinity; });
    controls.addEventListener('end', () => { watch.followFrom = performance.now() + FOLLOW_AFTER_MS; });
  }
  watch.view = new ExploreView(state.scene);
  watch.view.showArena(result.run.arena);

  document.body.classList.add('contests-watching');
  el('contests-panel').hidden = true;
  el('contests-watch').hidden = false;
  el('contests-watch-title').textContent = title;
  setVerified('Not checked yet: the replay is checked against the result\'s hash when it reaches the last generation.', 'pending');
  const scrub = el('contests-watch-scrub');
  scrub.min = '0';
  scrub.max = String(result.generation);
  scrub.value = '0';
  scrub.oninput = () => seek(Number(scrub.value));
  scrub.onpointerdown = () => { watch.dragging = true; };
  scrub.onpointerup = () => { watch.dragging = false; };
  scrub.onblur = () => { watch.dragging = false; };
  el('contests-watch-close').onclick = () => closeWatch();
  // Ships leaving: ticks on the scrub bar where they left, and a line that follows the replay
  const departures = result.departures ?? null;
  el('contests-watch-ticks').replaceChildren(...[...new Set((departures ?? []).map((d) => d.generation))].map((g) => {
    const tick = document.createElement('option');
    tick.value = String(g);
    return tick;
  }));
  el('contests-watch-departures').hidden = !departures;
  showGeneration(0);

  const slider = el('speed-control');
  const rate = rateFromSlider(slider ? slider.value : SLIDER_MAX);
  showSpeed(rate);
  const driver = new EngineDriver({
    onStats: (stats) => {
      if (watch.driver !== driver) return;
      moved(stats.generation);
      followExtent(stats.extent);
    },
    onState: (runState, stats) => {
      if (watch.driver !== driver) return;
      watch.status = runState;
      moved(stats.generation);
      followExtent(stats.extent);
      showPlaying();
      watch.wantSnapshot = true;
    },
    onReplayed: (replayed) => {
      if (watch.driver !== driver) return;
      const found = selfVerifiedText(replayed, result.generation);
      watch.replayed = found;
      setVerified(found.text, found.verdict);
      watch.onReplayed?.(found);
    },
    onError: (message) => watch.driver === driver && setVerified(`The engine says: ${message}`, 'not-checked'),
  });
  watch.driver = driver;
  driver.start({
    // Ships leave at the edge as they did in the run: a replay without the rule would end there
    world: {
      ...worldOptions(result.run, { chunkSize: contest?.chunkSize, memory: SPEED_MEMORY_MB * 1024 * 1024 }),
      departures: departuresFor(result.run),
    },
    seed: Int32Array.from(result.run.seed.flat()),
    run: { kind: 'replay', rate, check: { run: result.run, hash: result.hash } },
    generations: result.generation,
  });
  el('contests-watch-close').focus({ preventScroll: true });
}

/**
 * Ends Watch, its Worker and its view, and brings the panel back.
 * @param {{quietly?: boolean}} [options] - quietly: for leaving the mode, or opening Watch
 *   again; the panel stays as it is, and onClose isn't called
 */
export function closeWatch({ quietly = false } = {}) {
  if (!watch.view) return;
  watch.driver?.close();
  watch.driver = null;
  watch.view.dispose();
  watch.view = null;
  watch.result = null;
  document.body.classList.remove('contests-watching');
  el('contests-watch').hidden = true;
  el('contests-watch-scrub').oninput = null;
  el('contests-watch-ticks').replaceChildren();
  el('contests-watch-departures').hidden = true;
  const icon = el('playPauseIcon');
  if (icon) icon.className = 'play';
  setText('bottom-state-value', 'pause');
  // One frame of the empty scene, so the pattern doesn't stay behind the panel
  state.renderer.render(state.scene, state.camera);
  const onClose = watch.onClose;
  watch.onClose = null;
  watch.onReplayed = null;
  if (quietly) return;
  el('contests-panel').hidden = false;
  onClose?.();
}

// ---- The control bar ----

/** Play or pause; at the end, play goes back to the start and plays from there. */
export function watchTogglePlay() {
  const { driver } = watch;
  if (!driver) return;
  if (watch.status === 'running') driver.pause();
  else if (watch.status === 'paused') driver.resume();
  else if (watch.status === 'ended') {
    seek(0).then((answer) => {
      if (watch.driver === driver && answer && !answer.superseded) driver.resume();
    });
  }
}

/**
 * The control bar's view changed (3D or 2D, the slice's axis or index): fit the slice to the
 * pattern, and redraw from a new snapshot. Cell size and orientation apply every frame.
 */
export function watchViewChanged() {
  if (!watch.view) return;
  fitSlice(watch.extent);
  watch.wantSnapshot = true;
}

/** One generation, while paused. */
export function watchStep() {
  if (watch.status === 'paused') watch.driver.step();
}

/** The speed slider: generations per second, as in Explore. */
export function watchSpeed(value) {
  if (!watch.driver) return;
  const rate = rateFromSlider(value);
  watch.driver.setRate(rate);
  showSpeed(rate);
}

// ---- Every frame (contests.js) ----

/** Asks for a snapshot when the view is ready for one, moves the camera, and draws. */
export function watchFrame(now) {
  const { view, driver } = watch;
  if (!view) return;
  if (driver && watch.wantSnapshot && !watch.snapshotPending && watch.status !== 'seeking') {
    watch.wantSnapshot = false;
    watch.snapshotPending = true;
    const options = { budget: RENDER_BUDGET };
    if (state.viewMode === 'slice' && state.sliceIndex !== null) {
      options.slice = { axis: AXES.indexOf(state.sliceAxis), index: state.sliceIndex };
    }
    driver.snapshot(options)
      .then((snapshot) => {
        if (watch.view !== view) return;
        watch.chunkSize = snapshot.chunkSize;
        view.show(snapshot);
        moved(snapshot.generation);
        if (watch.status === 'running') watch.wantSnapshot = true; // the next, once this is drawn
      })
      .catch(() => {}) // closed meanwhile: nothing to draw
      .finally(() => { if (watch.view === view) watch.snapshotPending = false; });
  }
  const elapsedMs = watch.lastFrame ? Math.min(now - watch.lastFrame, 100) : 16;
  watch.lastFrame = now;
  view.showGrid(Boolean(state.showWireframeGrid), watch.extent, watch.chunkSize);
  view.frame({
    camera: state.camera,
    controls: state.controls,
    elapsedMs,
    follow: now >= watch.followFrom,
    cellSize: state.cellSize ?? 1.2,
    flip: state.flipOrientation,
  });
  if (state.controls?.enabled) state.controls.update();
  state.renderer.render(state.scene, state.camera);
}

// ---- Seeking ----

/**
 * Goes to a generation. The scrub bar sends one seek per movement; the Worker drops all but the
 * last, so dragging never queues up work.
 * @returns {Promise<{generation: number, superseded?: boolean} | null>}
 */
function seek(generation) {
  const { driver } = watch;
  if (!driver) return Promise.resolve(null);
  watch.seekTo = generation;
  showGeneration(generation);
  return driver.seek(generation)
    .then((answer) => {
      if (watch.driver !== driver || answer.superseded) return answer;
      watch.seekTo = null;
      moved(answer.generation);
      watch.wantSnapshot = true;
      return answer;
    })
    .catch(() => null); // closed meanwhile
}

/** The replay is at a generation: the bar and the labels follow, unless the visitor holds it. */
function moved(generation) {
  watch.generation = generation;
  if (watch.seekTo !== null) return; // still on its way to where the visitor asked
  showGeneration(generation);
  if (!watch.dragging) el('contests-watch-scrub').value = String(generation);
}

/** The pattern's extent: the grid follows it, and the slice slider spans it. */
function followExtent(extent) {
  watch.extent = extent;
  if (fitSlice(extent)) watch.wantSnapshot = true;
}

// ---- The page ----

function showGeneration(generation) {
  const last = watch.result?.generation ?? 0;
  const text = watchGenerationText(generation, last);
  setText('contests-watch-generation', text);
  setText('bottom-gen', text);
  setText('contest-hud-generation', text);
  const departures = watch.result?.departures;
  if (departures) setText('contests-watch-departures', watchDeparturesText(departures, generation));
}

function showPlaying() {
  const icon = el('playPauseIcon');
  if (icon) icon.className = watch.status === 'running' ? 'pause' : 'play';
  el('stepButton')?.classList.toggle('disabled', watch.status !== 'paused');
  const words = { running: 'play', paused: 'pause', seeking: 'seek', ended: 'end' };
  setText('bottom-state-value', words[watch.status] ?? watch.status);
  setText('contest-hud-status', watch.status === 'ended' ? 'Watched' : 'Watching');
}

function showSpeed(rate) {
  setText('bottom-speed-value', rate === null ? 'max' : `${Math.round(rate)}`);
}

function setVerified(text, verdict) {
  const line = el('contests-watch-verified');
  line.textContent = text;
  line.dataset.verdict = verdict;
}

function setText(id, text) {
  const node = el(id);
  if (node) node.textContent = text;
}
