// SPDX-License-Identifier: Apache-2.0
//
// The settings dialog's range hints (#123). Size and generations have no hard cap in the
// precomputed modes: each hint shows the range a typical laptop runs comfortably at the other
// settings, and opens a popover with the run's memory estimate, the ranges for a laptop and a
// desktop, and what happens past them. The sandpile's Initial Sand hint opens one saying why its
// 0-255 stays. The texts are memoryAdvice.js's; this file only puts them on the page.
//
// The popovers use the browser's popover API (popovertarget): Esc and a click outside close them,
// and a click on the hint toggles its own. Where the API is missing, a click toggles `hidden`.

import { adviceFor, hintText, SAND_ADVICE } from './memoryAdvice.js';

const FIELDS = [
  { field: 'size', button: 'sim-size-range', text: 'sim-size-range-text', popover: 'sim-size-advice' },
  { field: 'generations', button: 'sim-generations-range', text: 'sim-generations-range-text', popover: 'sim-generations-advice' },
];
const SAND = { button: 'sandpile-initial-sand-range', popover: 'sandpile-sand-advice' };
/** Room kept between a popover and the window's edge, and below its hint, in pixels. */
const MARGIN = 16;
const GAP = 6;

const hasPopoverApi = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;

/** @type {(() => object | null) | null} */
let readRun = null;
let wired = false;

/**
 * Wires the hints once; later calls only replace `read`, which gives the run the dialog describes
 * (as memoryAdvice.js's estimateRun() takes it), or null in a mode that streams.
 * @param {() => object | null} read
 */
export function initAdvice(read) {
  readRun = read;
  if (wired) return;
  wired = true;
  for (const { field, button, popover } of [...FIELDS, { ...SAND, field: 'sand' }]) {
    const buttonEl = document.getElementById(button);
    const popoverEl = document.getElementById(popover);
    if (!buttonEl || !popoverEl) continue;
    const fillIt = () => fill(field, popoverEl);
    if (hasPopoverApi) {
      popoverEl.addEventListener('beforetoggle', (e) => { if (e.newState === 'open') fillIt(); });
      popoverEl.addEventListener('toggle', (e) => { if (e.newState === 'open') place(popoverEl, buttonEl); });
    } else {
      popoverEl.hidden = true;
      buttonEl.addEventListener('click', () => {
        const opening = popoverEl.hidden;
        closeAdvice();
        if (!opening) return;
        fillIt();
        popoverEl.hidden = false;
        place(popoverEl, buttonEl);
      });
    }
  }
  const placeOpen = () => {
    for (const { button, popover } of [...FIELDS, SAND]) {
      const popoverEl = document.getElementById(popover);
      if (popoverEl && isOpen(popoverEl)) place(popoverEl, document.getElementById(button));
    }
  };
  window.addEventListener('resize', placeOpen);
  document.addEventListener('scroll', placeOpen, true); // the dialog's body scrolls
}

/** Updates the hints, and an open popover, to the dialog's settings. */
export function refreshAdvice() {
  const run = readRun?.();
  if (!run) return;
  for (const { field, text, popover } of FIELDS) {
    const textEl = document.getElementById(text);
    if (textEl) textEl.textContent = hintText(run, field);
    const popoverEl = document.getElementById(popover);
    if (popoverEl && isOpen(popoverEl)) fill(field, popoverEl, run);
  }
}

/** Closes any open advice popover (the dialog is closing). */
export function closeAdvice() {
  for (const { popover } of [...FIELDS, SAND]) {
    const popoverEl = document.getElementById(popover);
    if (!popoverEl || !isOpen(popoverEl)) continue;
    if (hasPopoverApi) popoverEl.hidePopover();
    else popoverEl.hidden = true;
  }
}

function isOpen(popoverEl) {
  return hasPopoverApi ? popoverEl.matches(':popover-open') : !popoverEl.hidden;
}

function fill(field, popoverEl, run = readRun?.()) {
  if (field === 'sand') {
    popoverEl.replaceChildren(paragraph(SAND_ADVICE));
    return;
  }
  if (!run) {
    popoverEl.replaceChildren();
    return;
  }
  const advice = adviceFor(run, field);
  const ranges = document.createElement('dl');
  for (const { label, text } of advice.suggestions) {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = text;
    ranges.append(dt, dd);
  }
  popoverEl.replaceChildren(
    paragraph(advice.estimate, 'advice-estimate'),
    paragraph(advice.parts, 'advice-detail'),
    ...(advice.cellsNote ? [paragraph(advice.cellsNote, 'advice-detail')] : []),
    paragraph('Suggested:'),
    ranges,
    paragraph(advice.past),
  );
}

function paragraph(text, className) {
  const p = document.createElement('p');
  p.textContent = text;
  if (className) p.className = className;
  return p;
}

// Under its hint, its right edge with the hint's, kept inside the window; above the hint if there
// is no room below
function place(popoverEl, buttonEl) {
  if (!buttonEl) return;
  const hint = buttonEl.getBoundingClientRect();
  const { offsetWidth: width, offsetHeight: height } = popoverEl;
  const left = Math.min(Math.max(MARGIN, hint.right - width), window.innerWidth - width - MARGIN);
  let top = hint.bottom + GAP;
  if (top + height > window.innerHeight - MARGIN) top = Math.max(MARGIN, hint.top - GAP - height);
  popoverEl.style.left = `${Math.max(MARGIN, left)}px`;
  popoverEl.style.top = `${top}px`;
}
