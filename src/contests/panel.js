// SPDX-License-Identifier: Apache-2.0
//
// The Contests panel (#77), in the middle of the screen: the list of contests, a contest's page,
// its run (a clock, a chart of the generations over time and the statistics, nothing drawn in
// 3D), its results card,
// Submit by email, and Verify a result; and each contest's Hall of Fame (#79). It also keeps the
// HUD's Contest section up to date. Watch (watch.js, #78) hides it, plays a result back in 3D,
// and brings it back on Close.
//
// Text from a result file comes from strangers, so the panel only ever sets textContent: nothing
// from a file is parsed as HTML. What it says is worked out in format.js. A Speed run is
// speed.js's SpeedRun, and a Discovery run, Methuselah's or Classic Methuselah's (#102),
// discovery.js's DiscoveryRun (#94), with the entry the visitor brought: a simulation, a seed and
// its rules (#130), from Load simulation…. The two Methuselah contests share a page, which says
// where Classic Methuselah differs: ships may leave at the arena's edge.

import { CONTESTS, SEASON, contestById, runFor, methuselahWarnings } from '../unbounded/contests.js';
import { MAX_RESULT_BYTES, readResult, ResultError } from '../unbounded/canonical.js';
import hallOfFameData from '../unbounded/hall-of-fame.json';
import labLogo from '../assets/images/morpheus-tech.png';
import { detectBrowser } from '../browser.js';
import { writeJsonFile } from '../explore/explore.js';
import { parseSeedFile } from '../explore/seed.js';
import { SpeedRun, verifyInWorker } from './speed.js';
import { DiscoveryRun } from './discovery.js';
import { openWatch, closeWatch } from './watch.js';
import {
  n, rulesText, countdownText, chartLayout, speedHero, speedScoreText, speedEndingText, resultFileName,
  statsRows, verdictTitle, closingText, scoreText, boardScore, methuselahHero, methuselahEndingText,
  arenaText, budgetText, seedPicture, sentence, departuresText,
} from './format.js';
import { SUBMIT_ADDRESS, emailSubject, emailBody, mailtoLink } from './submit.js';
import { HALL_OF_FAME_TOP, readHallOfFame, rankEntries, dayText } from './hallOfFame.js';
import { LOOKS, logo, lookOf, verifyGlyph } from './looks.js';

/** The kinds of contest this page can run: Speed, and Methuselah's, Classic Methuselah included. */
const ON_PAGE = ['speed', 'methuselah'];
const onPage = (contest) => ON_PAGE.includes(contest.kind);
const SELF_REPORTED = 'The time is measured by your own browser, on your own machine. Replaying a result proves '
  + 'that its generation is right, but not how long it took, so the Speed board is self-reported.';
const SAME_EVERYWHERE = 'Your score depends only on the seed and the rules, never on time or the machine: anyone '
  + 'replaying the result file, in the lab or with scripts/verify.mjs, gets the same ending and the same score.';
const STRICT = "This is a stricter methuselah than classic Life's: the whole pattern must settle inside the arena, "
  + 'and anything that flies off ends the run unscored. Classic Methuselah lets ships leave.';
/** How Classic Methuselah differs from Methuselah, in one sentence, with P from the contest. */
const differs = (contest) => `Unlike Methuselah, a ship may leave the arena here: an island that reaches a wall and is a ship heading out, of period up to ${contest.departures.period}, the longest recognised, is deleted and listed as a departure, and the rest of the pattern must still settle.`;

const panel = {
  open: false,
  contest: null,
  run: null, // the SpeedRun or DiscoveryRun on screen, until the panel moves on
  startedAt: 0, // when the Worker started a Speed run, on the page's clock, for the countdown
  verify: null, // the check in progress: {cancel}
  view: null, // 'list', 'contest', 'running', 'results', 'verifying', 'verdict'
  // Each Discovery contest's entry, by contest id: {rules, seed, source}, checked by runFor().
  // It stays while the page is open, so Run again runs it again
  entries: new Map(),
  refused: null, // why the last simulation file loaded was refused: {contest, message}
  designInExplore: null, // leaves for Explore's seed editor (controls.js), from the mode's start
  resume: null, // the contest the visitor left to design an entry in, to come back to
};

const el = (id) => document.getElementById(id);

/**
 * An element: h('p', {className: 'x', text: 'y'}, child, …). Text is always set as text.
 * @param {string} tag
 * @param {object} [props] - className, text, onclick, and attributes in `attrs`
 */
function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  if (props.className) node.className = props.className;
  if (props.text !== undefined) node.textContent = props.text;
  if (props.onclick) node.onclick = props.onclick;
  for (const [name, value] of Object.entries(props.attrs ?? {})) node.setAttribute(name, value);
  node.append(...children.filter(Boolean));
  return node;
}

function button(text, onclick, { main = false, id, title } = {}) {
  const attrs = { type: 'button' };
  if (id) attrs.id = id;
  if (title) attrs.title = title;
  return h('button', { className: `glass-button contests-button${main ? ' contests-button--main' : ''}`, text, onclick, attrs });
}

/**
 * Verify a result's button: the scales, what it does, and a line on how. It judges every
 * contest's entries, so it looks the same wherever it appears.
 */
function verifyButton(label = 'Verify a result', { wide = false } = {}) {
  return h('button', {
    className: `contests-verify-button${wide ? ' contests-verify-button--wide' : ''}`,
    onclick: chooseFile,
    attrs: { type: 'button', id: 'contests-verify' },
  },
  verifyGlyph(wide ? 28 : 20),
  h('span', { className: 'contests-verify-text' },
    h('span', { className: 'contests-verify-label', text: label }),
    wide ? h('span', { className: 'contests-verify-sub', text: 'Replay a result file from any contest to check it, in your browser' }) : null));
}

/** A definition list of [label, value] rows; values given as nodes are kept, ids too. */
function facts(rows, idPrefix) {
  const list = h('dl', { className: 'contests-facts' });
  rows.forEach(([label, value], i) => {
    const dd = h('dd', {}, typeof value === 'string' ? document.createTextNode(value) : value);
    if (idPrefix) dd.id = `${idPrefix}-${i}`;
    list.append(h('dt', { text: label }), dd);
  });
  return list;
}

/** Replaces the panel's contents with a view, and focuses its main button. */
function show(view, title, nodes) {
  panel.view = view;
  el('contests-panel-title').textContent = title;
  el('contests-panel-body').replaceChildren(...nodes.filter(Boolean));
  status('');
  const body = el('contests-panel-body');
  const main = body.querySelector('.contests-button--main:not([disabled])') ?? body.querySelector('button:not([disabled])');
  main?.focus({ preventScroll: true });
}

function status(text) {
  el('contests-panel-status').textContent = text;
}

function hud(name, state, generation) {
  if (name !== undefined) el('contest-hud-name').textContent = name;
  if (state !== undefined) el('contest-hud-status').textContent = state;
  if (generation !== undefined) el('contest-hud-generation').textContent = generation;
}

// ---- Opening and closing ----

/**
 * Shows the panel, on the list of contests, or back on the contest the visitor left for Explore
 * to design an entry.
 * @param {object} [options]
 * @param {(contest: {note: string, arena: number, title: string, ships: boolean}) => void} [options.designInExplore]
 *   - leaves for Explore with the contest's arena and the seed editor open
 */
export function openPanel({ designInExplore = null } = {}) {
  panel.open = true;
  panel.designInExplore = designInExplore;
  el('contests-panel').hidden = false;
  const input = el('contests-verify-file');
  input.onchange = () => {
    const file = input.files?.[0];
    input.value = ''; // so choosing the same file again still counts as a change
    if (file) verifyFile(file);
  };
  const seedInput = el('contests-seed-file');
  seedInput.onchange = () => {
    const file = seedInput.files?.[0];
    seedInput.value = '';
    if (file && panel.contest) loadSeedFile(panel.contest, file);
  };
  const resume = panel.resume;
  panel.resume = null;
  if (resume) showContest(resume);
  else showList();
}

/** Hides the panel, ending any run or check: for leaving the mode. */
export function closePanel() {
  panel.open = false;
  closeWatch({ quietly: true });
  endRun();
  cancelVerify();
  el('contests-panel').hidden = true;
  el('contests-panel-body').replaceChildren();
  panel.view = null;
}

/**
 * Each frame: the clock follows the page's clock between the Worker's statistics. Its arc
 * empties over the run's seconds; the Worker's own clock decides the score.
 */
export function panelFrame(now) {
  if (panel.view !== 'running' || !panel.startedAt || !(panel.run instanceof SpeedRun)) return;
  const elapsed = now - panel.startedAt;
  const value = el('contests-countdown');
  if (value) value.textContent = countdownText(panel.run.seconds, elapsed);
  const arc = el('contests-clock-arc');
  if (arc) arc.style.strokeDashoffset = String(Math.min(100, (elapsed / (panel.run.seconds * 1000)) * 100));
}

function endRun() {
  panel.run?.close();
  panel.run = null;
  panel.startedAt = 0;
}

function cancelVerify() {
  panel.verify?.cancel();
  panel.verify = null;
}

// ---- The list ----

/** A contest's square card, to open it: its logo in its colour, its name and what it measures. */
function tile(contest) {
  const node = h('button', {
    className: 'contests-tile',
    onclick: () => showContest(contest),
    attrs: { type: 'button', id: `contests-open-${contest.id}` },
  },
  logo(lookOf(contest), 56, 'contests-tile-logo'),
  h('span', { className: 'contests-tile-name', text: contest.title }),
  h('span', { className: 'contests-tile-about', text: contest.summary }),
  h('span', { className: 'contests-tile-foot', text: 'Open' }));
  node.style.setProperty('--contest-color', LOOKS[lookOf(contest)].color);
  return node;
}

function showList() {
  endRun();
  cancelVerify();
  panel.contest = null;
  hud('–', 'Choosing', '–');
  const tiles = h('div', { className: 'contests-tiles' }, ...CONTESTS.filter(onPage).map(tile));
  show('list', SEASON, [
    h('p', { text: 'Three contests on the engine of Game of Life 3D (unbounded). Each fixes its own rules, and all run on the CPU, so every entrant runs the same thing. Anyone can check any result by replaying it.', attrs: { id: 'contests-list-about' } }),
    h('p', { className: 'contests-closes', text: closingText(CONTESTS), attrs: { id: 'contests-closes' } }),
    tiles,
    // Verify a result judges every contest: a bar across the panel under its own heading, apart
    // from the contests' cards
    h('div', { className: 'contests-judge' },
      h('span', { className: 'contests-judge-title', text: 'For every contest' }),
      verifyButton('Verify a result', { wide: true })),
  ]);
}

// ---- A contest's page ----

/** A titled area of a contest's page. */
function section(title, ...children) {
  return h('section', { className: 'contests-section' }, h('h3', { className: 'contests-section-title', text: title }), ...children);
}

/** One fact about the run, as a tile: what it is, the value, and a line about it. */
function factTile(label, value, about) {
  return h('div', { className: 'contests-fact' },
    h('span', { className: 'contests-fact-label', text: label }),
    h('span', { className: 'contests-fact-value', text: value }),
    h('span', { className: 'contests-fact-about', text: about }));
}

/** The big Run button that leads a contest's page. */
function runButton(contest, sub, { disabled = false } = {}) {
  const run = h('button', {
    className: 'contests-run-button',
    onclick: () => startRun(contest),
    attrs: { type: 'button', id: 'contests-run' },
  },
  h('span', { className: 'contests-run-icon', attrs: { 'aria-hidden': 'true' } }),
  h('span', { className: 'contests-run-text' },
    h('span', { className: 'contests-run-label', text: `Run ${contest.title}` }),
    h('span', { className: 'contests-run-sub', text: sub })));
  run.disabled = disabled;
  return run;
}

/** A contest's page's head: its logo, what it measures, and when entries close. */
function pageHead(contest) {
  const header = h('div', { className: 'contests-page-head' },
    logo(lookOf(contest), 64, 'contests-page-logo'),
    h('div', {},
      h('p', { className: 'contests-page-kicker', text: `A ${SEASON} contest` }),
      h('p', { className: 'contests-page-summary', text: `${contest.summary}.` }),
      h('p', { className: 'contests-closes', text: closingText([contest]) })));
  header.style.setProperty('--contest-color', LOOKS[lookOf(contest)].color);
  return header;
}

function showContest(contest) {
  endRun();
  panel.contest = contest;
  hud(contest.title, 'Ready', '–');
  if (contest.kind === 'methuselah') {
    showMethuselah(contest);
    return;
  }
  const { fixes } = contest;
  const { birth, survival } = fixes.rules;
  const range = (list) => (list.length > 1 ? `${list[0]}–${list[list.length - 1]}` : String(list[0]));
  const run = runButton(contest, `${contest.seconds} seconds, on your machine`);
  show('contest', contest.title, [
    pageHead(contest),
    run,
    section('What everyone runs',
      h('div', { className: 'contests-facts-grid' },
        factTile('Seed', 'Cube10', `All ${n(fixes.seed.length)} cells of the 10³ seed box, cells −5 to 4 on each axis`),
        factTile('Rules', rulesText(fixes.rules), `A cell is born with ${range(birth)} live neighbours, and survives with ${range(survival)}`),
        factTile('Time', `${contest.seconds} seconds`, 'Timed by your own browser'),
        factTile('Ceiling', `${n(contest.ceiling)} generations`, 'A run that reaches it sooner also scores its time'))),
    hallOfFame(contest),
    section('How it runs',
      h('p', { text: `On the CPU, in a background thread (a Web Worker), with chunks of ${contest.chunkSize}³ cells, so every entrant runs the same engine. Nothing is drawn while it runs, so the run has your machine to itself. Your score is the generations completed in the ${contest.seconds} seconds. Runs that reach the ceiling of ${n(contest.ceiling)} all have the same generations, so they rank by the time they took, to the millisecond.` })),
    section('Fair play',
      h('p', { className: 'contests-note', text: SELF_REPORTED })),
    h('div', { className: 'contests-actions' },
      verifyButton(),
      button('Back', showList, { id: 'contests-back' })),
  ]);
  run.focus({ preventScroll: true });
}

// ---- Methuselah's page: the entry, and what the contest fixes ----

/**
 * Methuselah's page, and Classic Methuselah's: the entry it will run (its seed, drawn, and its
 * rules) with Load simulation…, Run, what the contest fixes, how a run ends and what scores, the Hall of
 * Fame, and how it runs. Classic Methuselah's also says how it differs, and its ships' period.
 */
function showMethuselah(contest) {
  const entry = panel.entries.get(contest.id) ?? null;
  const { fixes } = contest;
  const side = (box) => box.max[0] - box.min[0] + 1;
  const run = runButton(contest, entry
    ? `Up to ${n(contest.budget)} generations, on your machine: it can take a few minutes`
    : 'Load a seed first', { disabled: !entry });
  show('contest', contest.title, [
    pageHead(contest),
    entrySection(contest, entry),
    run,
    section('What the contest fixes',
      h('div', { className: 'contests-facts-grid' },
        factTile('Arena', arenaText(fixes.arena), `Cells ${fixes.arena.min[0]} to ${fixes.arena.max[0]} on each axis. The cells never see its walls: it only decides when a run is over`),
        factTile('Seed box', `${side(fixes.seedBox)}³`, `Your seed: 1 to ${n(side(fixes.seedBox) ** 3)} cells, all within cells ${fixes.seedBox.min[0]} to ${fixes.seedBox.max[0]} on each axis, never shifted`),
        factTile('Budget', `${n(contest.budget)} generations`, `A pattern still unsettled at generation ${n(contest.budget)} scores nothing`),
        factTile('Top score', n(contest.budget - 1), `A run scores once its final state or cycle closes, by generation ${n(contest.budget)}`),
        contest.departures ? factTile('Ships leave', `Period ≤ ${contest.departures.period}`, 'A ship heading out through a wall is deleted and listed; anything else at the edge ends the run') : null)),
    section('How a run ends', endingsTable(contest),
      contest.departures
        ? h('p', { className: 'contests-note', text: differs(contest), attrs: { id: 'contests-differs' } })
        : h('p', { className: 'contests-note', text: STRICT, attrs: { id: 'contests-strict' } })),
    hallOfFame(contest),
    section('How it runs',
      h('p', { text: `On the CPU, in a background thread (a Web Worker), with chunks of ${contest.chunkSize}³ cells, and nothing drawn while it runs. A run can take a few minutes. A repeat is confirmed cell for cell before it ends a run.${contest.departures ? ` A ship needs no catalogue: under your rules, an island at a wall is a ship if, run alone, it returns to its own shape, moved, within ${contest.departures.period} generations.` : ''} Equal scores rank by fewer seed cells, then the earlier submission.` })),
    section('Fair play',
      h('p', { className: 'contests-note', text: SAME_EVERYWHERE })),
    h('div', { className: 'contests-actions' },
      verifyButton(),
      button('Back', showList, { id: 'contests-back' })),
  ]);
  (entry ? run : el('contests-load-seed'))?.focus({ preventScroll: true });
}

/**
 * The endings of a Methuselah run, and which score: four, and for Classic Methuselah a fifth,
 * Emits, a cycle that sends off ships.
 */
function endingsTable(contest) {
  const budget = n(contest.budget);
  const ships = contest.departures;
  const rows = [
    ['Death', 'No live cells remain, by generation ' + n(contest.budget - 1), 'The generation the last cell died'],
    ['Repeat', `The cells equal, in place, those of an earlier generation h, by generation ${budget}${ships ? ', with no ship leaving in the cycle' : ''}`, 'h, where the final cycle began'],
    ships ? ['Emits', 'The cells repeat, but ships leave the arena during the cycle', 'None: it never settles'] : null,
    ships
      ? ['Edge', `A step would bring a cell to life outside the arena, from something that isn't a ship of period up to ${n(ships.period)} heading out`, 'None']
      : ['Edge', 'A step would bring a cell to life outside the arena', 'None'],
    ['Budget', `Generation ${budget} is reached unsettled`, 'None'],
  ].filter(Boolean);
  return h('table', { className: 'contests-endings', attrs: { id: 'contests-endings' } },
    h('thead', {}, h('tr', {}, h('th', { text: 'Ending' }), h('th', { text: 'When' }), h('th', { text: 'Score' }))),
    h('tbody', {}, ...rows.map(([name, when, score]) => h('tr', {},
      h('th', { text: name, attrs: { scope: 'row' } }), h('td', { text: when }), h('td', { text: score })))));
}

/**
 * The entry, a simulation: its seed, drawn in the seed box with its cell count, its rules and its
 * file, a warning for rules that can't score, and Load simulation…; or, with none yet, a line on
 * what it is. Kept short (#130): the buttons' titles say the rest.
 */
function entrySection(contest, entry) {
  const load = button(entry ? 'Load another simulation…' : 'Load simulation…', () => el('contests-seed-file').click(), { main: !entry, id: 'contests-load-seed' });
  const design = panel.designInExplore ? button('Design a seed…', () => designSeed(contest), {
    id: 'contests-design-seed', title: "Opens the seed editor in Game of Life 3D (unbounded), in this contest's arena",
  }) : null;
  const refused = panel.refused?.contest === contest.id ? h('p', {
    className: 'contests-refused', text: panel.refused.message, attrs: { id: 'contests-entry-refused', role: 'alert' },
  }) : null;
  if (!entry) {
    return section('Your entry',
      h('p', { text: 'A simulation file: a seed and its rules.', attrs: { id: 'contests-entry-none' } }),
      refused,
      h('div', { className: 'contests-actions' }, load, design));
  }
  const cells = entry.seed.length;
  const warnings = methuselahWarnings(entry.rules);
  return section('Your entry',
    h('div', { className: 'contests-entry' },
      seedSvg(entry.seed, contest.fixes.seedBox),
      h('div', { className: 'contests-entry-facts' },
        facts([
          ['Seed', `${n(cells)} cell${cells === 1 ? '' : 's'}`],
          ['Rules', rulesText(entry.rules)],
          ['File', entry.source],
        ], 'contests-entry'))),
    ...warnings.map((text) => h('p', { className: 'contests-warning', text, attrs: { id: 'contests-entry-warning', role: 'note' } })),
    refused,
    h('div', { className: 'contests-actions' }, load, design));
}

/**
 * Design a seed in Explore: leaves Contests for Explore, with the contest's arena and the seed
 * editor open on Explore's seed, and comes back to this contest's page with the banner.
 */
function designSeed(contest) {
  const design = panel.designInExplore;
  if (!design) return;
  panel.resume = contest;
  const { arena } = contest.fixes;
  design({
    note: `For ${contest.title}: keep the seed in this 10³ box, Use it, and save the simulation with the Simulation box's save icon. The Contests banner brings you back.`,
    arena: arena.max[0] - arena.min[0] + 1,
    title: contest.title,
    ships: Boolean(contest.departures),
  });
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** The seed as cubes in its seed box (format.js's seedPicture()), in the contest's colour. */
function seedSvg(seed, box) {
  const picture = seedPicture(seed, box);
  const make = (tag, attrs) => {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
    return node;
  };
  const svg = make('svg', {
    class: 'contests-seed-picture', viewBox: `0 0 ${picture.width} ${picture.height}`,
    width: picture.width, height: picture.height, role: 'img',
    'aria-label': `The seed: ${n(seed.length)} live cells in the seed box`, id: 'contests-seed-picture',
  });
  svg.append(make('polygon', { class: 'contests-seed-box', points: picture.outline }));
  for (const cube of picture.cubes) {
    svg.append(
      make('polygon', { class: 'contests-seed-top', points: cube.top }),
      make('polygon', { class: 'contests-seed-right', points: cube.right }),
      make('polygon', { class: 'contests-seed-left', points: cube.left }));
  }
  svg.append(make('path', { class: 'contests-seed-edges', d: picture.edges }));
  return svg;
}

/**
 * Makes an entry the contest's, if it can run there: runFor() refuses a B0 rule, an empty seed
 * or a cell outside the seed box, with the reason. Seeds are never shifted.
 * @returns {string | null} why it was refused, or null
 */
function setEntry(contest, { rules, cells }, source) {
  const seed = [];
  for (let i = 0; i < cells.length; i += 3) seed.push([cells[i], cells[i + 1], cells[i + 2]]);
  let run;
  try {
    run = runFor(contest, { rules, seed });
  } catch (err) {
    if (!(err instanceof ResultError)) throw err;
    const outside = outsideCount(seed, contest.fixes.seedBox);
    return outside > 1 ? `${err.message} ${n(outside)} of its ${n(seed.length)} cells are outside it.` : err.message;
  }
  panel.entries.set(contest.id, { rules: run.rules, seed: run.seed, source });
  return null;
}

function outsideCount(seed, box) {
  return seed.filter((cell) => cell.some((c, a) => c < box.min[a] || c > box.max[a])).length;
}

/**
 * Load simulation…: reads a simulation file as untrusted data, and makes it the entry, or says
 * why not. A seed file has no rules (#130), so it can't be one.
 */
async function loadSeedFile(contest, file) {
  const view = panel.view;
  let refusal = null;
  // A simulation file holds at most a million cells, about 30 MB written out
  if (file.size > 64 * 1024 * 1024) {
    refusal = "The file is larger than 64 MB, so it isn't a simulation file. It wasn't read.";
  } else {
    try {
      const text = await file.text();
      const seed = parseSeedFile(text);
      refusal = seed.rules
        ? setEntry(contest, seed, file.name)
        : 'This is a seed file: it holds cells, but no rules, so it isn\'t a simulation, and an entry is one. In Game of Life 3D (unbounded), load it in the Seed box, set the rules, and save both with the Simulation box\'s save icon, as a simulation file.';
    } catch (err) {
      refusal = /"format"\s*:\s*"morpheus-tech-lab\/result"/.test(await file.slice(0, 4096).text().catch(() => ''))
        ? 'This is a result file, not a simulation file. Check one with Verify a result; load a simulation saved with Save simulation.'
        : err?.message ?? String(err);
    }
  }
  if (panel.contest !== contest || panel.view !== view || !panel.open) return; // the panel has moved on
  panel.refused = refusal ? { contest: contest.id, message: `Not loaded: ${refusal}` } : null;
  showContest(contest);
  if (!refusal) status(`Loaded ${file.name}.`);
}

// ---- The Hall of Fame ----

/** Where the site serves a file from public/: the Hall of Fame's paths are written without it. */
const served = (path) => `${import.meta.env.BASE_URL}${path}`;

/**
 * A contest's Hall of Fame: its top entries, best first, from hall-of-fame.json, or that there
 * are none yet. Names come from entrants, so they are set as text, like everything else.
 */
function hallOfFame(contest) {
  let entries;
  try {
    entries = rankEntries(readHallOfFame(hallOfFameData), contest);
  } catch (err) {
    return section('Hall of Fame', h('p', { className: 'contests-note', text: `The Hall of Fame couldn't be read: ${err.message}` }));
  }
  if (!entries.length) {
    return section('Hall of Fame', h('p', {
      className: 'contests-hof-empty',
      text: `No entries yet. Run ${contest.title}, then Submit by email from your results card: once verified, entries are listed here.`,
      attrs: { id: 'contests-hof-empty' },
    }));
  }
  const top = entries.slice(0, HALL_OF_FAME_TOP);
  return section('Hall of Fame',
    h('ol', { className: 'contests-hof', attrs: { id: 'contests-hof' } }, ...top.map((entry, i) => hallOfFameRow(entry, i + 1, contest))),
    entries.length > top.length ? h('p', { className: 'contests-note', text: `The top ${top.length} of ${n(entries.length)} entries.` }) : null);
}

/** One entry: its place, picture (or the lab's logo), name, browser and date, score, and Watch. */
function hallOfFameRow(entry, place, contest) {
  const picture = h('img', {
    className: 'contests-hof-picture',
    attrs: { src: entry.picture ? served(entry.picture) : labLogo, alt: '', width: '40', height: '40', loading: 'lazy', decoding: 'async' },
  });
  // A picture that doesn't load gives way to the logo
  picture.onerror = () => {
    picture.onerror = null;
    picture.src = labLogo;
  };
  if (!entry.picture) picture.classList.add('contests-hof-picture--logo');
  const score = scoreText(contest, entry.score);
  const watch = button('Watch', null, { id: `contests-hof-watch-${place}` });
  watch.onclick = () => watchEntry(entry, `Hall of Fame: ${entry.name}, ${score}`, watch);
  watch.setAttribute('aria-label', `Watch ${entry.name}'s run`);
  const browser = entry.browser ? `${entry.browser.name} ${entry.browser.version}` : 'Browser not given';
  return h('li', { className: 'contests-hof-entry' },
    h('span', { className: 'contests-hof-place', text: String(place) }),
    picture,
    h('span', { className: 'contests-hof-who' },
      h('span', { className: 'contests-hof-name', text: entry.name }),
      h('span', { className: 'contests-hof-meta', text: `${browser} · ${dayText(entry.date)}` })),
    hallOfFameScore(contest, entry),
    watch);
}

/**
 * An entry's score: what ranks it, then the rest; at Speed's ceiling, the time leads, and
 * Methuselah's rules and seed cells follow its generations.
 */
function hallOfFameScore(contest, entry) {
  const { main, detail } = boardScore(contest, entry.score, entry);
  return h('span', { className: 'contests-hof-score' },
    h('span', { className: 'contests-hof-score-main', text: main }),
    detail ? h('span', { className: 'contests-hof-score-detail', text: detail }) : null);
}

/**
 * Loads an entry's result file from the site, reads it as untrusted data like any other, and
 * plays it in Watch.
 */
async function watchEntry(entry, title, from) {
  const view = panel.view;
  status("Loading the entry's result file…");
  let result;
  try {
    const response = await fetch(served(entry.result));
    if (!response.ok) throw new Error(`the site answered ${response.status}.`);
    const text = await response.text();
    if (text.length > MAX_RESULT_BYTES) throw new Error(`it is larger than ${MAX_RESULT_BYTES / 1024 / 1024} MB.`);
    result = readResult(text);
  } catch (err) {
    if (panel.view === view) status(`It can't be watched: ${err?.message ?? err}`);
    return;
  }
  if (panel.view !== view || !panel.open) return; // the panel has moved on
  status('');
  watchResult(result, title, from);
}

// ---- The chart: generations completed over the run's time ----

const SVG = 'http://www.w3.org/2000/svg';

function svgNode(tag, attrs = {}, text) {
  const node = document.createElementNS(SVG, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * What a contest's chart shows. Speed's: the generations completed over its seconds. A Discovery
 * run's: the live cells by generation.
 */
function chartSpec(contest) {
  if (contest.kind === 'speed') {
    return {
      seconds: contest.seconds,
      label: 'Generations completed over the run',
      title: 'Generations completed',
      subtitle: `over the ${contest.seconds} seconds: the steeper the line, the faster the machine`,
      xTitle: 'Time (seconds)',
      yTitle: 'Generations',
      readout: (p) => `${p.at.toFixed(2)} s · ${n(p.value)} generations`,
      columns: ['Time (s)', 'Generations'],
      row: ([t, g]) => [t.toFixed(2), n(g)],
    };
  }
  return {
    label: 'Live cells by generation',
    title: 'Live cells',
    subtitle: 'by generation: how the pattern grew, and where it settled',
    xTitle: 'Generation',
    yTitle: 'Live cells',
    readout: (p) => `generation ${n(p.at)} · ${n(p.value)} live cells`,
    columns: ['Generation', 'Live cells'],
    row: ([g, live]) => [n(g), n(live)],
  };
}

/**
 * A line chart of a run (chartSpec()), drawn at the width it is given on the page, with axes,
 * their titles, a value at the line's end, and a crosshair that reads out the nearest point on
 * hover. With `table`, a table of the same points follows it, built when it is opened.
 * @returns {{node: HTMLElement, update: (points: [number, number][]) => void}}
 */
function createChart(spec, { table = false } = {}) {
  const { seconds } = spec;
  const svg = svgNode('svg', { class: 'contests-chart-svg', role: 'img', 'aria-label': spec.label });
  const readout = h('div', { className: 'contests-chart-readout', attrs: { 'aria-hidden': 'true' } });
  readout.hidden = true;
  const tableBox = table ? h('details', { className: 'contests-chart-table' }, h('summary', { text: 'Show the data as a table' })) : null;
  const node = h('figure', { className: 'contests-chart' },
    h('figcaption', { className: 'contests-chart-caption' },
      h('span', { className: 'contests-chart-title', text: spec.title }),
      h('span', { className: 'contests-chart-subtitle', text: spec.subtitle })),
    h('div', { className: 'contests-chart-plot' }, svg, readout),
    tableBox);
  let layout = null;
  let latest = [];

  function draw() {
    const width = Math.max(280, Math.round(svg.parentElement?.clientWidth || 520));
    drawnWidth = Math.round(node.clientWidth);
    const height = Math.round(Math.min(260, Math.max(200, width * 0.42)));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    layout = chartLayout(latest, { seconds, width, height });
    const { plot } = layout;
    const parts = [];
    for (const tick of layout.yTicks) {
      parts.push(svgNode('line', { class: 'contests-chart-grid', x1: plot.left, x2: plot.right, y1: tick.at, y2: tick.at }));
      parts.push(svgNode('text', { class: 'contests-chart-tick', x: plot.left - 8, y: tick.at, 'text-anchor': 'end', 'dominant-baseline': 'middle' }, tick.label));
    }
    for (const tick of layout.xTicks) {
      parts.push(svgNode('text', { class: 'contests-chart-tick', x: tick.at, y: plot.bottom + 16, 'text-anchor': 'middle' }, tick.label));
    }
    parts.push(svgNode('line', { class: 'contests-chart-axis', x1: plot.left, x2: plot.right, y1: plot.bottom, y2: plot.bottom }));
    parts.push(svgNode('text', { class: 'contests-chart-axis-title', x: (plot.left + plot.right) / 2, y: height - 4, 'text-anchor': 'middle' }, spec.xTitle));
    parts.push(svgNode('text', {
      class: 'contests-chart-axis-title', x: 0, y: 0, 'text-anchor': 'middle',
      transform: `translate(14 ${(plot.top + plot.bottom) / 2}) rotate(-90)`,
    }, spec.yTitle));
    if (layout.end) {
      parts.push(svgNode('path', { class: 'contests-chart-area', d: layout.area }));
      parts.push(svgNode('polyline', { class: 'contests-chart-line', points: layout.line }));
      parts.push(svgNode('circle', { class: 'contests-chart-dot', cx: layout.end.x, cy: layout.end.y, r: 4 }));
      parts.push(svgNode('text', { class: 'contests-chart-end', x: layout.end.x + 8, y: layout.end.y, 'dominant-baseline': 'middle' }, layout.end.label));
    }
    parts.push(svgNode('line', { class: 'contests-chart-crosshair', y1: plot.top, y2: plot.bottom, x1: 0, x2: 0, visibility: 'hidden' }));
    parts.push(svgNode('circle', { class: 'contests-chart-dot contests-chart-hover', r: 4, cx: 0, cy: 0, visibility: 'hidden' }));
    svg.replaceChildren(...parts);
  }

  function hover(event) {
    if (!layout?.end) return;
    const box = svg.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * svg.viewBox.baseVal.width;
    const point = layout.nearest(px);
    if (!point) return;
    const [line, dot] = [svg.querySelector('.contests-chart-crosshair'), svg.querySelector('.contests-chart-hover')];
    line.setAttribute('x1', point.x);
    line.setAttribute('x2', point.x);
    line.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);
    dot.setAttribute('visibility', 'visible');
    readout.textContent = spec.readout(point);
    readout.hidden = false;
    const scale = box.width / svg.viewBox.baseVal.width;
    readout.style.left = `${Math.min(point.x * scale + 10, box.width - readout.offsetWidth - 4)}px`;
    readout.style.top = `${Math.max(0, point.y * scale - 34)}px`;
  }
  function unhover() {
    svg.querySelector('.contests-chart-crosshair')?.setAttribute('visibility', 'hidden');
    svg.querySelector('.contests-chart-hover')?.setAttribute('visibility', 'hidden');
    readout.hidden = true;
  }
  svg.addEventListener('pointermove', hover);
  svg.addEventListener('pointerleave', unhover);
  // Redrawn at the new width when the panel's changes (a window resized, a phone turned)
  let drawnWidth = 0;
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (width && width !== drawnWidth && layout) draw();
    }).observe(node);
  }

  // The table is built when it is first opened, and again once the points have changed: a
  // Discovery run has a row for each of up to 10,001 generations
  let tabled = null;
  function fillTable() {
    if (!tableBox?.open || tabled === latest) return;
    tabled = latest;
    tableBox.querySelector('table')?.remove();
    const rows = latest.map((point) => h('tr', {}, ...spec.row(point).map((text) => h('td', { text }))));
    tableBox.append(h('table', {},
      h('thead', {}, h('tr', {}, ...spec.columns.map((text) => h('th', { text })))),
      h('tbody', {}, ...rows)));
  }
  tableBox?.addEventListener('toggle', fillTable);

  return {
    node,
    update(points) {
      latest = points.slice();
      draw();
      fillTable();
    },
  };
}

/** The statistics as a grid of small figures: secondary to the countdown and the score. */
function statsGrid(rows, idPrefix) {
  return h('div', { className: 'contests-stats' }, ...rows.map(([label, value], i) => h('div', { className: 'contests-stat' },
    h('span', { className: 'contests-stat-label', text: label }),
    h('span', { className: 'contests-stat-value', text: value, attrs: idPrefix ? { id: `${idPrefix}-${i}` } : {} }))));
}

// ---- The run ----

function startRun(contest) {
  if (contest.kind === 'methuselah') {
    startDiscovery(contest);
    return;
  }
  endRun();
  const chart = createChart(chartSpec(contest));
  const run = new SpeedRun(contest, {
    onStart: () => {
      if (panel.run !== run) return;
      panel.startedAt = performance.now();
      hud(undefined, 'Running');
    },
    onStats: (stats) => panel.run === run && showStats(stats, chart),
    onEnd: (end) => panel.run === run && showResults(run, end),
    onError: (message) => panel.run === run && status(`The engine says: ${message}`),
  });
  panel.run = run;
  // The ring is a clock: its arc empties over the contest's seconds, on the page's clock
  const ring = svgNode('svg', { class: 'contests-clock-ring', viewBox: '0 0 160 160', 'aria-hidden': 'true' });
  ring.append(
    svgNode('circle', { class: 'contests-clock-track', cx: 80, cy: 80, r: 72 }),
    svgNode('circle', { class: 'contests-clock-arc', cx: 80, cy: 80, r: 72, pathLength: 100, id: 'contests-clock-arc' }));
  show('running', `${contest.title}: running`, [
    h('div', { className: 'contests-run-top' },
      h('div', { className: 'contests-clock' },
        ring,
        h('div', { className: 'contests-clock-face' },
          h('span', { className: 'contests-countdown-value', text: countdownText(contest.seconds, 0), attrs: { id: 'contests-countdown' } }),
          h('span', { className: 'contests-clock-unit', text: 'seconds left' }))),
      statsGrid(statsRows(emptyStats(contest)), 'contests-stat')),
    chart.node,
    h('div', { className: 'contests-actions' }, button('Stop', () => run.stop(), { id: 'contests-stop' })),
  ]);
  chart.update(run.points);
  hud(contest.title, 'Starting', '0');
  run.start();
}

/**
 * A Discovery run: a ring that fills as the generations go by, out of the budget, the
 * statistics, a chart of the live cells by generation, and Stop. Nothing is drawn in 3D.
 */
function startDiscovery(contest) {
  const entry = panel.entries.get(contest.id);
  if (!entry) return;
  endRun();
  const chart = createChart(chartSpec(contest));
  let run;
  try {
    run = new DiscoveryRun(contest, { rules: entry.rules, seed: entry.seed }, {
      onStart: () => panel.run === run && hud(undefined, 'Running'),
      onStats: (stats) => panel.run === run && showDiscoveryStats(run, stats, chart),
      onEnd: (end) => panel.run === run && showResults(run, end),
      onError: (message) => panel.run === run && status(`The engine says: ${message}`),
    });
  } catch (err) {
    status(`It can't run: ${err.message}`);
    return;
  }
  panel.run = run;
  const ring = svgNode('svg', { class: 'contests-clock-ring', viewBox: '0 0 160 160', 'aria-hidden': 'true' });
  ring.append(
    svgNode('circle', { class: 'contests-clock-track', cx: 80, cy: 80, r: 72 }),
    svgNode('circle', { class: 'contests-clock-arc', cx: 80, cy: 80, r: 72, pathLength: 100, id: 'contests-clock-arc', style: 'stroke-dashoffset: 100' }));
  ring.style.setProperty('--contest-color', LOOKS[lookOf(contest)].color);
  show('running', `${contest.title}: running`, [
    h('div', { className: 'contests-run-top' },
      h('div', { className: 'contests-clock contests-clock--budget', attrs: { role: 'group', 'aria-label': 'Generation, out of the budget' } },
        ring,
        h('div', { className: 'contests-clock-face' },
          h('span', { className: 'contests-countdown-value contests-countdown-value--small', text: '0', attrs: { id: 'contests-countdown' } }),
          h('span', { className: 'contests-clock-unit', text: `of ${n(run.budget)} generations`, attrs: { id: 'contests-budget' } }))),
      statsGrid(statsRows(emptyStats(contest)), 'contests-stat')),
    chart.node,
    h('p', { className: 'contests-note', text: `Running ${rulesText(entry.rules)} from ${n(entry.seed.length)} seed cells until the pattern settles, reaches the edge of the arena, or reaches generation ${n(run.budget)}.${contest.departures ? ` Ships of period up to ${n(contest.departures.period)} leave at the edge, and are counted.` : ''} Stop ends it without a score.` }),
    h('div', { className: 'contests-actions' }, button('Stop', () => run.stop(), { id: 'contests-stop' })),
  ]);
  chart.update(run.points);
  hud(contest.title, 'Starting', '0');
  run.start();
}

function showDiscoveryStats(run, stats, chart) {
  statsRows(stats).forEach(([, value], i) => {
    const cell = el(`contests-stat-${i}`);
    if (cell) cell.textContent = value;
  });
  const value = el('contests-countdown');
  if (value) value.textContent = n(stats.generation);
  const arc = el('contests-clock-arc');
  if (arc) arc.style.strokeDashoffset = String(100 - Math.min(100, (stats.generation / run.budget) * 100));
  chart.update(run.points);
  hud(undefined, undefined, budgetText(stats.generation, run.budget));
}

/** Statistics before the first: a contest where ships leave counts them too. */
function emptyStats(contest) {
  const stats = { generation: 0, rate: 0, live: 0, livePeak: 0, chunks: 0, memoryBytes: 0, extent: null };
  if (contest?.departures) stats.departed = 0;
  return stats;
}

function showStats(stats, chart) {
  statsRows(stats).forEach(([, value], i) => {
    const cell = el(`contests-stat-${i}`);
    if (cell) cell.textContent = value;
  });
  chart.update(panel.run.points);
  hud(undefined, undefined, n(stats.generation));
}

// ---- The results card ----

async function showResults(run, end) {
  const { stats, reason, score } = end;
  const { contest } = run;
  const speed = contest.kind === 'speed';
  panel.startedAt = 0;
  hud(contest.title, score ? 'Finished' : reason === 'stopped' || speed ? 'Stopped' : 'No score', n(stats.generation));
  const again = button('Run again', () => showContest(contest), { main: !score, id: 'contests-again' });
  const back = button(`Back to ${SEASON}`, showList, { id: 'contests-back' });
  const chart = createChart(chartSpec(contest), { table: true });
  const endingText = speed ? speedEndingText(reason, contest) : methuselahEndingText(reason, contest, end);
  const entryFacts = speed ? null : facts([
    ['Seed', `${n(run.run.seed.length)} cell${run.run.seed.length === 1 ? '' : 's'}`],
    ['Rules', rulesText(run.run.rules)],
  ], 'contests-result-entry');
  // Classic Methuselah's ships, scored or not
  const departed = end.departures
    ? h('p', { className: 'contests-departures', text: `${departuresText(end.departures)}.`, attrs: { id: 'contests-departures' } })
    : null;
  // A Discovery run's chart: every generation's live cells, which the Worker kept
  const history = speed ? Promise.resolve() : run.loadHistory().then(() => {
    if (panel.run === run) chart.update(run.points);
  }).catch(() => {}); // the statistics' points stay
  if (!score) {
    await history;
    run.close();
    if (panel.run !== run) return;
    show('results', `${contest.title}: no score`, [
      h('p', { className: 'contests-ending', text: endingText, attrs: { id: 'contests-ending' } }),
      departed,
      chart.node,
      entryFacts,
      statsGrid(statsRows(stats)),
      h('div', { className: 'contests-actions' }, again, back),
    ]);
    chart.update(run.points);
    return;
  }

  const exportButton = button('Export result', null, { main: true, id: 'contests-export' });
  exportButton.disabled = true;
  const watchButton = button('Watch', null, { id: 'contests-watch-run' });
  watchButton.disabled = true;
  const verified = h('p', {
    className: 'contests-self-verified',
    text: `Watch plays the run back in 3D, replayed from its seed, and checks the replay's hash at generation ${n(stats.generation)} against this one.`,
    attrs: { id: 'contests-self-verified', 'data-verdict': 'pending' },
  });
  const hero = speed ? speedHero(score, contest) : methuselahHero(score, reason);
  const scoreWords = scoreText(contest, score, reason);
  const meta = h('span', { className: 'contests-hero-meta', text: 'Detecting the browser…', attrs: { id: 'contests-hero-meta' } });
  const hash = h('span', { className: 'contests-hash', text: `Hashing generation ${n(stats.generation)}…`, attrs: { id: 'contests-hash' } });
  const copy = button('Copy', null, { id: 'contests-copy-hash' });
  copy.disabled = true;
  const submitBox = h('section', { className: 'contests-section contests-submit', attrs: { id: 'contests-submit', 'aria-labelledby': 'contests-submit-title' } },
    h('h3', { className: 'contests-section-title', text: 'Submit by email', attrs: { id: 'contests-submit-title' } }),
    h('p', { className: 'contests-note', text: 'Ready once the result file is made.' }));
  show('results', `${contest.title}: your result`, [
    h('div', { className: 'contests-hero', attrs: { role: 'group', 'aria-label': `Your score: ${scoreWords}` } },
      h('span', { className: 'contests-hero-kicker' }, logo(lookOf(contest), 22, 'contests-hero-logo'), document.createTextNode(`${contest.title} · your score`)),
      h('span', { className: 'contests-hero-value', text: hero.value, attrs: { id: 'contests-score' } }),
      h('span', { className: 'contests-hero-unit', text: hero.unit, attrs: { id: 'contests-score-unit' } }),
      meta),
    chart.node,
    h('p', { className: 'contests-ending', text: endingText, attrs: { id: 'contests-ending' } }),
    departed,
    entryFacts,
    statsGrid(statsRows(stats)),
    h('div', { className: 'contests-hash-box' },
      h('span', { className: 'contests-hash-label', text: "The result's hash" }),
      h('div', { className: 'contests-hash-row' }, hash, copy)),
    verified,
    h('p', { className: 'contests-note', text: speed ? SELF_REPORTED : SAME_EVERYWHERE }),
    h('div', { className: 'contests-actions' }, exportButton, watchButton, again, back),
    submitBox,
  ]);
  chart.update(run.points);

  let made;
  try {
    await history;
    const detected = await detectBrowser();
    if (panel.run !== run) return;
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    meta.textContent = `${detected ? `${detected.name} ${detected.version}` : 'Browser not detected'} · ${date}`;
    made = await run.makeResult(detected);
  } catch (err) {
    if (panel.run === run) status(`The result file couldn't be made: ${err.message}`);
    return;
  } finally {
    // The result is made: the run's Worker, and its memory, can go
    if (panel.run === run) run.close();
  }
  if (panel.run !== run) return;
  hash.textContent = made.result.hash;
  copy.disabled = false;
  copy.onclick = () => copyText(made.result.hash, 'hash');
  const submit = submitParts({ contest, score, browser: made.result.details.browser, text: made.text, ending: reason });
  submitBox.replaceChildren(submitBox.firstChild, ...submit.parts);
  exportButton.disabled = false;
  // Export result saves the same file, so it readies the email too
  exportButton.onclick = async () => {
    const saved = await saveResult(contest, score, made.text);
    if (saved) submit.saved(saved);
  };
  watchButton.disabled = false;
  watchButton.onclick = () => watchResult(made.result, `${contest.title}: ${scoreWords}`, watchButton, verified);
  // Export is what comes next, unless the visitor has moved on to another button meanwhile
  if (!el('contests-panel').contains(document.activeElement) || document.activeElement === again) {
    exportButton.focus({ preventScroll: true });
  }
}

/**
 * Saves the result file, with the browser's save dialog where it has one, and says where it went.
 * @returns {Promise<string | null>} what was said, or null if it wasn't saved
 */
async function saveResult(contest, score, text) {
  try {
    const said = await writeJsonFile(resultFileName(contest, score), text, `Contest result, ${contest.title}`);
    status(said);
    return said;
  } catch (err) {
    if (err?.name !== 'AbortError') status(`Not saved: ${err.message}`); // AbortError: the visitor cancelled the save dialog
    return null;
  }
}

/** Copies text to the clipboard; `what` names it, should the browser refuse. */
async function copyText(text, what) {
  try {
    await navigator.clipboard.writeText(text);
    status('Copied.');
  } catch {
    status(`The browser didn't allow copying; select the ${what} and copy it by hand.`);
  }
}

// ---- Submit by email ----

/**
 * The results card's Submit by email, as three numbered steps (#140): save the result file, open
 * the email, attach the file. The entry is the file, so the email opens only once it is saved,
 * by step 1 or by Export result. Saving and opening are separate clicks: done in one, a mailto:
 * link's hand-off to the mail app can lose the download (#140). Under them, folded away, the
 * address, subject and text with Copy, for webmail.
 * @returns {{parts: Node[], saved: (said: string) => void}} the section's contents, and what
 *   Export result calls once it has saved the file
 */
function submitParts({ contest, score, browser, text, ending }) {
  const fileName = resultFileName(contest, score);
  const subject = emailSubject(contest, score, ending);
  const body = emailBody({ contest, browser, fileName });
  const fileWords = () => h('strong', { className: 'contests-submit-file', text: fileName });

  const savedLine = h('p', { className: 'contests-submit-done', attrs: { id: 'contests-submit-saved' } });
  savedLine.hidden = true;
  const saveButton = button('Save result file', null, { id: 'contests-submit-save' });
  const link = h('a', {
    className: 'glass-button contests-button contests-submit-button',
    text: 'Open the email',
    attrs: { id: 'contests-submit-email', 'aria-disabled': 'true', 'aria-describedby': 'contests-submit-wait' },
  });
  const wait = h('p', { className: 'contests-submit-wait', text: 'Save the result file first.', attrs: { id: 'contests-submit-wait' } });
  const step = (...content) => h('li', { className: 'contests-submit-step' }, ...content);
  const saveStep = step(
    h('p', {}, document.createTextNode('Save your result file, '), fileWords(), document.createTextNode('.')),
    saveButton, savedLine);
  const emailStep = step(
    h('p', { text: `Open the email to ${SUBMIT_ADDRESS}, with its text filled in.` }),
    link, wait);

  const saved = (said) => {
    savedLine.textContent = said;
    savedLine.hidden = false;
    saveStep.dataset.done = 'true';
    link.href = mailtoLink(subject, body);
    link.removeAttribute('aria-disabled');
    link.removeAttribute('aria-describedby');
    wait.hidden = true;
    status(`${said} Now open the email, and attach ${fileName} to it.`);
  };
  saveButton.onclick = async () => {
    const said = await saveResult(contest, score, text);
    if (said) {
      saved(said);
      link.focus({ preventScroll: true });
    }
  };
  link.onclick = (event) => {
    if (link.hasAttribute('href')) {
      emailStep.dataset.done = 'true';
      return;
    }
    event.preventDefault();
    status('Save the result file first: the email needs it attached.');
    saveButton.focus({ preventScroll: true });
  };

  const copyRow = (label, value, id, what) => h('div', { className: 'contests-submit-row' },
    h('span', { className: 'contests-submit-label', text: label }),
    h('span', { className: 'contests-submit-value', text: value, attrs: { id } }),
    button('Copy', () => copyText(value, what), { id: `${id}-copy` }));
  const textBox = h('textarea', {
    className: 'contests-submit-text',
    attrs: { id: 'contests-submit-body', readonly: '', rows: '8', spellcheck: 'false', 'aria-label': 'The email\'s text' },
  });
  textBox.value = body;
  return {
    saved,
    parts: [
      h('p', { className: 'contests-submit-lead', text: "Your entry is an email with your result file attached. Without the file, it can't be verified or listed." }),
      h('ol', { className: 'contests-submit-steps' },
        saveStep,
        emailStep,
        step(
          h('p', { attrs: { id: 'contests-submit-attach' } },
            h('strong', { text: 'Attach ' }), fileWords(), h('strong', { text: ' to the email' }),
            document.createTextNode(" by hand: an email link can't attach it for you. Add a picture if you like, fill in the name to show, keep or delete the Hall of Fame line, and send it.")))),
      h('details', { className: 'contests-submit-webmail', attrs: { id: 'contests-submit-webmail' } },
        h('summary', { text: 'No mail app? Copy the address, subject and text into webmail' }),
        h('div', { className: 'contests-submit-copy' },
          copyRow('To', SUBMIT_ADDRESS, 'contests-submit-to', 'address'),
          copyRow('Subject', subject, 'contests-submit-subject', 'subject'),
          h('div', { className: 'contests-submit-row contests-submit-row--text' },
            h('span', { className: 'contests-submit-label', text: 'Text' }),
            textBox,
            button('Copy', () => copyText(body, 'text'), { id: 'contests-submit-body-copy' })))),
    ],
  };
}

// ---- Watch ----

/**
 * Plays a result back in 3D (watch.js), and comes back to the button that opened it. What the
 * replay finds goes on the card's line too, if it has one.
 */
function watchResult(result, title, from, line = null) {
  const view = panel.view;
  hud(undefined, 'Watching');
  openWatch(result, {
    title,
    onReplayed: (found) => {
      if (!line) return;
      line.textContent = found.text;
      line.dataset.verdict = found.verdict;
    },
    onClose: () => {
      if (panel.view !== view) return;
      hud(undefined, { results: 'Finished', contest: 'Ready' }[view] ?? 'Checked');
      from.focus({ preventScroll: true });
    },
  });
}

// ---- Verify a result ----

function chooseFile() {
  el('contests-verify-file').click();
}

async function verifyFile(file) {
  endRun();
  cancelVerify();
  const back = panel.contest;
  if (file.size > MAX_RESULT_BYTES) {
    showVerdict(file.name, { verdict: 'refused', message: `The file is larger than ${MAX_RESULT_BYTES / 1024 / 1024} MB, so it isn't a result file. It wasn't read.` }, back);
    return;
  }
  let text;
  try {
    text = await file.text();
  } catch (err) {
    showVerdict(file.name, { verdict: 'error', message: `The file couldn't be read: ${err.message}` }, back);
    return;
  }
  const check = verifyInWorker(text);
  panel.verify = check;
  hud(undefined, 'Verifying');
  show('verifying', 'Verify a result', [
    h('p', { text: `Checking ${file.name}: replaying its run from the seed, in a background thread. A long run takes a while.` }),
    h('div', { className: 'contests-actions' }, button('Cancel', () => check.cancel(), { id: 'contests-cancel' })),
  ]);
  const answer = await check.promise;
  if (panel.verify !== check) return; // the panel has moved on
  panel.verify = null;
  showVerdict(file.name, answer, back, text);
}

/**
 * The verdict on a file, with Watch for any file that could be read: a mismatch can be watched
 * too, to see where it goes.
 * @param {string} [text] - the file's contents, for Watch
 */
function showVerdict(name, answer, back, text) {
  hud(undefined, answer.verdict === 'verified' ? 'Verified' : 'Checked');
  const rows = [['File', name]];
  if (answer.contest !== undefined) rows.push(['Contest', answer.contest ?? 'none']);
  if (answer.generation !== null && answer.generation !== undefined) rows.push(['Generation', n(answer.generation)]);
  if (answer.ending) rows.push(['Ended', answer.ending]);
  if (answer.score) {
    const contest = answer.contest ? contestById(answer.contest) : undefined;
    const known = contest && (contest.kind === 'speed'
      ? 'generations' in answer.score && 'ms' in answer.score
      : 'generations' in answer.score && 'period' in answer.score);
    rows.push(['Score', !known ? JSON.stringify(answer.score)
      : contest.kind === 'speed' ? `${speedScoreText(answer.score)} (the time is self-reported)`
        : sentence(scoreText(contest, answer.score, answer.ending))]);
  }
  if (answer.rules) rows.push(['Rules', rulesText(answer.rules)]);
  if (answer.seedCells) rows.push(['Seed', `${n(answer.seedCells)} cell${answer.seedCells === 1 ? '' : 's'}`]);
  if (answer.departures) rows.push(['Ships left', `${departuresText(answer.departures)}${answer.verdict === 'verified' ? ', as the replay found' : ''}`]);
  // Watch reads the file again, on this thread: readResult() checks it as untrusted data
  const readable = text !== undefined && ['verified', 'mismatch', 'not-checked'].includes(answer.verdict);
  const line = readable ? h('p', {
    className: 'contests-self-verified',
    text: 'Watch plays the run back in 3D, replayed from its seed, and checks the replay\'s hash at the file\'s generation.',
    attrs: { id: 'contests-self-verified', 'data-verdict': 'pending' },
  }) : null;
  let watchButton = null;
  if (readable) {
    watchButton = button('Watch', () => {
      let result;
      try {
        result = readResult(text);
      } catch (err) {
        status(err instanceof ResultError ? `It can't be watched: ${err.message}` : `It can't be watched: ${err?.message ?? err}`);
        return;
      }
      watchResult(result, `Watch: ${name}`, watchButton, line);
    }, { id: 'contests-watch-run' });
  }
  show('verdict', 'Verify a result', [
    h('div', { className: 'contests-verdict-head' },
      verifyGlyph(30),
      h('p', { className: `contests-verdict contests-verdict--${answer.verdict}`, text: verdictTitle(answer.verdict), attrs: { id: 'contests-verdict' } })),
    h('p', { text: answer.message, attrs: { id: 'contests-verdict-message' } }),
    facts(rows),
    line,
    h('div', { className: 'contests-actions' },
      watchButton,
      verifyButton('Verify another'),
      back ? button(`Back to ${back.title}`, () => showContest(back), { id: 'contests-back' }) : null,
      button(`Back to ${SEASON}`, showList, { id: 'contests-list' })),
  ]);
}

