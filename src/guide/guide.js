// SPDX-License-Identifier: Apache-2.0
//
// The guide (#159): a short tour of cellular automata, opened by the Guide button left of
// the Contests banner. Each step's words (steps.js) come with an animation (scenes.js) on the
// guide's own 2D canvas; the lab's WebGL view waits behind it, paused. The last page lists every
// source the tour cites. The Guide button stays above the guide, pressed, and closes it, as do
// Close and Esc. Sets only textContent.

import { STEPS, SOURCES, sourcesInOrder, citation } from './steps.js';
import { SCENES } from './scenes.js';

const SOURCES_PAGE = STEPS.length;

let els = null;
let hooks = null;
let index = 0;
let returnTo = 0;
let scene = null;
let sceneStart = 0;
let pausedAt = null;
let frame = 0;
let open = false;
let labWasPlaying = false;
let reducedMotion = null;

/** @returns {boolean} whether the guide is open; the lab skips drawing behind it */
export function isGuideOpen() {
  return open;
}

/**
 * Wires the Guide button and the guide.
 * @param {object} options
 * @param {() => boolean} options.pauseLab - pauses a playing simulation; true if it was playing
 * @param {() => void} options.resumeLab - plays it again
 * @param {() => void} options.openModes - the finale's Pick a mode
 * @param {() => void} options.openContests - the finale's Open the Contests
 */
export function initGuide(options) {
  hooks = options;
  const $ = (id) => document.getElementById(id);
  els = {
    button: $('info-button'),
    guide: $('guide'),
    backdrop: $('guide-backdrop'),
    count: $('guide-count'),
    stage: $('guide-stage'),
    canvas: $('guide-canvas'),
    pause: $('guide-pause'),
    text: $('guide-text'),
    title: $('guide-title'),
    body: $('guide-body'),
    cites: $('guide-cites'),
    finale: $('guide-finale'),
    sources: $('guide-sources'),
    sourcesList: $('guide-sources-list'),
    back: $('guide-back'),
    next: $('guide-next'),
    dots: $('guide-dots'),
  };
  if (!els.button || !els.guide) return;
  reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;

  els.button.addEventListener('click', () => (open ? closeGuide() : openGuide()));
  $('guide-close')?.addEventListener('click', () => closeGuide());
  $('guide-sources-button')?.addEventListener('click', () => go(SOURCES_PAGE));
  els.backdrop?.addEventListener('click', () => closeGuide());
  els.back.addEventListener('click', () => go(index === SOURCES_PAGE ? returnTo : index - 1));
  els.next.addEventListener('click', () => go(index + 1));
  els.pause.addEventListener('click', () => setPaused(pausedAt === null));
  $('guide-open-modes')?.addEventListener('click', () => closeGuide(() => hooks.openModes()));
  $('guide-open-contests')?.addEventListener('click', () => closeGuide(() => hooks.openContests()));
  // In the capture phase, so Esc closes the guide before anything behind it hears the key
  document.addEventListener('keydown', onKey, true);
  reducedMotion?.addEventListener?.('change', () => open && restartScene());
  new ResizeObserver(() => open && sizeCanvas()).observe(els.stage);

  buildDots();
  buildSources();
}

function buildDots() {
  els.dots.replaceChildren();
  [...STEPS, { title: 'Sources and credits' }].forEach((step, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = i === SOURCES_PAGE ? 'guide-dot guide-dot--sources' : 'guide-dot';
    dot.setAttribute('aria-label', i === SOURCES_PAGE ? step.title : `Step ${i + 1}: ${step.title}`);
    dot.title = step.title;
    dot.addEventListener('click', () => go(i));
    els.dots.append(dot);
  });
}

function sourceLink(key, text) {
  const source = SOURCES[key];
  if (!source.url) {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }
  const a = document.createElement('a');
  a.href = source.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = text;
  a.title = citation(source);
  return a;
}

function buildSources() {
  els.sourcesList.replaceChildren();
  for (const key of sourcesInOrder()) {
    const source = SOURCES[key];
    const li = document.createElement('li');
    const head = document.createElement('span');
    head.textContent = `${source.authors}${source.year ? ` (${source.year})` : ''}. `;
    const title = document.createElement('cite');
    title.textContent = source.title;
    const venue = document.createElement('span');
    venue.textContent = `. ${source.venue}.`;
    li.append(head, title, venue);
    if (source.url) {
      li.append(' ');
      li.append(sourceLink(key, source.url.replace(/^https:\/\//, '')));
    }
    const steps = STEPS.filter((step) => step.sources.includes(key)).map((step) => STEPS.indexOf(step));
    const where = document.createElement('span');
    where.className = 'guide-source-steps';
    where.textContent = ` Cited in step${steps.length > 1 ? 's' : ''} ${steps.map((i) => i + 1).join(', ')}.`;
    li.append(where);
    els.sourcesList.append(li);
  }
}

/** Opens the guide, at its first step or the one given. */
export function openGuide(at = 0) {
  if (open || !els) return;
  open = true;
  labWasPlaying = hooks.pauseLab();
  document.body.classList.add('guide-open');
  els.button.setAttribute('aria-expanded', 'true');
  els.button.setAttribute('aria-pressed', 'true');
  // Everything else on the page is out of reach while the guide is open, but the top bar
  for (const child of document.body.children) {
    if (child !== els.guide && child !== els.backdrop && !child.contains(els.button) && child.tagName !== 'SCRIPT') {
      child.inert = true;
      child.dataset.guideInert = '';
    }
  }
  els.backdrop.hidden = false;
  els.guide.hidden = false;
  sizeCanvas();
  go(at);
  els.next.focus();
}

/**
 * Closes the guide, and plays the lab again if it was playing.
 * @param {() => void} [then] - what to do once it has closed (the finale's buttons)
 */
export function closeGuide(then) {
  if (!open) return;
  open = false;
  cancelAnimationFrame(frame);
  scene = null;
  els.guide.hidden = true;
  els.backdrop.hidden = true;
  for (const child of document.querySelectorAll('[data-guide-inert]')) {
    child.inert = false;
    delete child.dataset.guideInert;
  }
  document.body.classList.remove('guide-open');
  els.button.setAttribute('aria-expanded', 'false');
  els.button.setAttribute('aria-pressed', 'false');
  if (labWasPlaying) hooks.resumeLab();
  labWasPlaying = false;
  if (then) then();
  else els.button.focus();
}

function onKey(event) {
  if (!open || event.defaultPrevented) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeGuide();
  } else if (event.key === 'ArrowRight' && !event.altKey && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    if (index < SOURCES_PAGE) els.next.click();
  } else if (event.key === 'ArrowLeft' && !event.altKey && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    if (index > 0) els.back.click();
  }
}

function go(i) {
  const next = Math.max(0, Math.min(SOURCES_PAGE, i));
  if (next === SOURCES_PAGE && index !== SOURCES_PAGE) returnTo = index;
  index = next;
  const onSources = index === SOURCES_PAGE;
  els.guide.classList.toggle('guide--sources', onSources);
  els.sources.hidden = !onSources;
  els.stage.hidden = onSources;
  els.text.hidden = onSources;
  els.count.textContent = onSources ? 'Sources and credits' : `${index + 1} / ${STEPS.length}`;
  [...els.dots.children].forEach((dot, k) => {
    if (k === index) dot.setAttribute('aria-current', 'step');
    else dot.removeAttribute('aria-current');
  });
  els.back.disabled = index === 0;
  els.back.textContent = onSources ? `Back to step ${returnTo + 1}` : 'Back';
  els.next.disabled = onSources;
  els.next.textContent = index === SOURCES_PAGE - 1 ? 'Sources' : 'Next';
  if (onSources) {
    cancelAnimationFrame(frame);
    scene = null;
    els.sources.scrollTop = 0;
    if (document.activeElement === els.next) els.back.focus();
    return;
  }
  showStep(STEPS[index]);
}

function showStep(step) {
  els.title.textContent = step.title;
  els.body.replaceChildren(...step.body.map((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
  }));
  const cites = [document.createTextNode('Sources: ')];
  step.sources.forEach((key, i) => {
    if (i) cites.push(document.createTextNode(' · '));
    cites.push(sourceLink(key, SOURCES[key].short));
  });
  const all = document.createElement('button');
  all.type = 'button';
  all.className = 'guide-link';
  all.textContent = 'All sources';
  all.addEventListener('click', () => go(SOURCES_PAGE));
  cites.push(document.createTextNode(' · '), all);
  els.cites.replaceChildren(...cites);
  els.finale.hidden = !step.finale;
  els.text.scrollTop = 0;
  els.canvas.setAttribute('aria-label', step.alt);
  restartScene();
}

function restartScene() {
  cancelAnimationFrame(frame);
  const step = STEPS[index];
  try {
    scene = SCENES[step.scene]();
  } catch (err) {
    console.error('The guide could not start its animation:', err);
    scene = null;
  }
  sceneStart = performance.now();
  pausedAt = null;
  const still = reducedMotion?.matches;
  els.pause.hidden = still;
  setPaused(false, still);
}

function setPaused(paused, still = false) {
  if (paused) {
    pausedAt = (performance.now() - sceneStart) / 1000;
    cancelAnimationFrame(frame);
  } else if (pausedAt !== null) {
    sceneStart = performance.now() - pausedAt * 1000;
    pausedAt = null;
  }
  els.pause.setAttribute('aria-pressed', String(paused));
  els.pause.textContent = paused ? 'Play' : 'Pause';
  els.pause.title = paused ? 'Play the animation' : 'Pause the animation';
  if (still) {
    draw(scene?.still ?? 0);
  } else if (!paused) {
    tick();
  } else {
    draw(pausedAt);
  }
}

function tick() {
  draw((performance.now() - sceneStart) / 1000);
  frame = requestAnimationFrame(tick);
}

function draw(t) {
  if (!scene) return;
  const { ctx, w, h } = canvasSize();
  if (!w || !h) return;
  try {
    scene.draw(ctx, w, h, t);
  } catch (err) {
    console.error('The guide’s animation failed:', err);
    scene = null;
  }
}

let size = { w: 0, h: 0, dpr: 1 };

function sizeCanvas() {
  const rect = els.stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  size = { w: Math.floor(rect.width), h: Math.floor(rect.height), dpr };
  els.canvas.width = Math.max(1, Math.floor(size.w * dpr));
  els.canvas.height = Math.max(1, Math.floor(size.h * dpr));
  els.canvas.style.width = `${size.w}px`;
  els.canvas.style.height = `${size.h}px`;
  // A still frame has to be drawn again at the new size; a moving one redraws on its own
  if (scene && (reducedMotion?.matches || pausedAt !== null)) draw(reducedMotion?.matches ? scene.still : pausedAt);
}

function canvasSize() {
  const ctx = els.canvas.getContext('2d');
  ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
  return { ctx, w: size.w, h: size.h };
}
