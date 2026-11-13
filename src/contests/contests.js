// SPDX-License-Identifier: Apache-2.0
//
// The Contests mode (#77): a sixth mode, chosen in the settings dialog. Like Explore, it never
// reaches initSimulation(): it shows the panel in the middle of the screen (panel.js), and
// nothing is drawn in 3D behind it, so a run has the machine to itself. Leaving the mode closes
// the panel, which ends any run or check and its Worker.

import { state } from '../state.js';
import { initSpace } from '../space.js';
import { openPanel, closePanel, panelFrame } from './panel.js';

let active = false;

export function isContests() {
  return state.simulationMode === 'contests';
}

/** Starts the mode in a fresh, empty scene, with the panel on the list of contests. */
export function startContests() {
  stopContests();
  state.reset();
  state.autoRotateActive = false;
  initSpace();
  // One frame of the empty scene clears whatever the last mode drew; then nothing more is drawn
  state.renderer.render(state.scene, state.camera);
  active = true;
  document.body.classList.add('mode-contests');
  banner(true);
  openPanel();
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
  button.title = pressed ? 'Leave the contest (Esc)' : 'Open the contest';
}

/** animate() calls this instead of drawing: the countdown is all that moves. */
export function contestsFrame(now) {
  panelFrame(now);
}
