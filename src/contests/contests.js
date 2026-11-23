// SPDX-License-Identifier: Apache-2.0
//
// The Contests mode (#77): a sixth mode, opened from its banner. Like Explore, it never
// reaches initSimulation(): it shows the panel in the middle of the screen (panel.js), and
// nothing is drawn in 3D behind it, so a run has the machine to itself. Only Watch (watch.js,
// #78) draws, once a run is over, in place of the panel. Leaving the mode closes the panel,
// which ends any run, check or Watch and its Worker.

import { state } from '../state.js';
import { initSpace } from '../space.js';
import { openPanel, closePanel, panelFrame } from './panel.js';
import { isWatching, watchFrame } from './watch.js';

// The control bar and Esc reach Watch through here (controls.js, time.js)
export { isWatching, closeWatch, watchTogglePlay, watchStep, watchSpeed, watchViewChanged } from './watch.js';

let active = false;

export function isContests() {
  return state.simulationMode === 'contests';
}

/**
 * Starts the mode in a fresh, empty scene, with the panel on the list of contests, or on the
 * contest the visitor left to design an entry.
 * @param {object} [options]
 * @param {(contest: {note: string, arena: number, title: string, ships?: boolean, entry?: object}) => string | null} [options.designInExplore]
 *   - leaves for Explore with the contest's arena and the seed editor open (controls.js), for a
 *   Discovery contest's page
 */
export function startContests({ designInExplore } = {}) {
  stopContests();
  state.reset();
  state.autoRotateActive = false;
  initSpace();
  // One frame of the empty scene clears whatever the last mode drew; then nothing more is drawn
  state.renderer.render(state.scene, state.camera);
  active = true;
  document.body.classList.add('mode-contests');
  banner(true);
  openPanel({ designInExplore });
  document.getElementById('loading-overlay')?.classList.add('hidden');
}

/** Ends the mode, its panel and any run: for leaving it. */
export function stopContests() {
  if (!active) return;
  active = false;
  closePanel();
  document.body.classList.remove('mode-contests');
  banner(false);
}

// The banner by the company logo stays in Contests, pressed: clicking it there goes back
function banner(pressed) {
  const button = document.getElementById('contests-banner');
  if (!button) return;
  button.setAttribute('aria-pressed', String(pressed));
  button.title = pressed ? 'Leave the contests (Esc)' : 'Open the contests';
}

/**
 * animate() calls this instead of drawing: the countdown is all that moves, unless Watch is
 * playing a result back, which draws its own view.
 */
export function contestsFrame(now) {
  if (isWatching()) watchFrame(now);
  else panelFrame(now);
}
