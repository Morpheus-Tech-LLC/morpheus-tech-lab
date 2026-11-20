// SPDX-License-Identifier: Apache-2.0
//
// How much memory a precomputed run takes, and the advice the settings dialog gives about it
// (#123): Game of Life 3D (bounded), Rule 30, the sine wave and the sandpile have no hard size or
// generation caps; their range hints open a popover with the estimate for the current settings,
// the sizes that suit a typical laptop and a strong desktop, and what happens past them. Above
// CONFIRM_BYTES, Apply asks first. No DOM; tested in Node.
//
// The estimate follows what the run holds at once (AGENTS.md, Risky operations):
// - every generation's grid, a size³ Uint8Array, whatever the mode (Grid3D always allocates the
//   whole cube, so Rule 30 and the sandpile pay for it too); the sandpile keeps about 2.25 grids
//   per generation (after the drop, at the threshold, after toppling);
// - every generation's `active` list, about 40 bytes of JavaScript memory per live cell in Chrome
//   (measured: 77-86 bytes in Node, which has no pointer compression);
// - the point cloud's positions and colours, 24 bytes per cell of the grid (simulationModel.js).
//
// Live cells aren't known before the run, so they are estimated per mode, from measurements of
// generateSimulation() on the CPU (#123): exact for the sine wave; fitted for Rule 30 and the
// sandpile; and for Game of Life 3D (bounded), the default rules' growth: the pattern's box widens
// by about 0.4 cells a generation from the seed's, with about 30% of it alive. Other rules can
// hold far fewer or far more, and the popover says so.

export const MB = 1024 ** 2;
export const GB = 1024 ** 3;

/** What a typical laptop (8 GB of RAM) runs comfortably. */
export const LAPTOP_BYTES = 1.5 * GB;
/** What a strong desktop runs: about what one Chrome tab gets for JavaScript (README §4). */
export const DESKTOP_BYTES = 4 * GB;
/** Above this estimate, Apply asks before it starts the run. */
export const CONFIRM_BYTES = 2 * GB;

export const BYTES_PER_LIVE_CELL = 40;
export const VIEW_BYTES_PER_CELL = 24;
export const SANDPILE_FRAMES_PER_GENERATION = 2.25;
export const LIFE_GROWTH = 0.4;
export const LIFE_FILL = 0.3;
/** A sandpile cell holds its grains in one byte. */
export const MAX_SAND = 255;

/** The largest size and generations the suggestions search; past them they read "or more". */
export const SEARCH_MAX = { size: 100_000, generations: 10_000_000 };

/**
 * Rule 30's grid size for `generations`: it grows a cell a generation each way, so the grid is
 * 2g + 1 wide, plus 10% padding (15% in 3D). The size field follows it.
 * @param {number} generations
 * @param {boolean} is3D - the 3D toggle (`useRule30_2D` in the code)
 */
export function rule30Size(generations, is3D) {
  const padding = Math.ceil(generations * (is3D ? 0.15 : 0.1));
  return Math.max(2 * generations + 1 + padding, generations + 1 + padding);
}

/** The sandpile's suggested size for `generations`: sand spreads about as √generations. */
export function sandpileSize(generations) {
  return Math.max(20, Math.ceil(Math.sqrt(generations) * 2.5));
}

/**
 * The seed's box side and live cells, for Game of Life 3D (bounded), from the dialog's shape
 * settings, as onConfirm (controls.js) builds the shape.
 * @param {{shape: string, size: number, density: number, regionSize?: number | null}} seed
 * @param {number} gridSize
 * @returns {{side: number, cells: number}}
 */
export function seedEstimate(seed, gridSize) {
  const size = Math.max(1, seed?.size || 1);
  const density = Math.min(1, Math.max(0, Number.isFinite(seed?.density) ? seed.density : 1));
  let side;
  let volume;
  switch (seed?.shape) {
    case 'cube': {
      side = 2 * Math.max(1, Math.floor(size / 2));
      volume = side ** 3;
      break;
    }
    case 'tetrahedron':
      side = size;
      volume = (size * (size + 1) * (size + 2)) / 6;
      break;
    case 'octahedron':
      side = 2 * size + 1;
      volume = ((2 * size + 1) * (2 * size * size + 2 * size + 3)) / 3;
      break;
    default: // perlin, worley: noise over a central region, the whole grid without one
      side = Math.min(gridSize, Math.max(1, seed?.regionSize || gridSize));
      volume = side ** 3;
  }
  side = Math.min(side, gridSize);
  return { side, cells: Math.min(volume, side ** 3) * density };
}

/** Live cells summed over every generation, by mode (see the top of this file). */
function liveCells({ mode, size, generations: g, seed, initialSand = 0 }) {
  switch (mode) {
    case 'sineWave':
      return size * size * (g + 1);
    case 'rule30':
      return g ** 3 / 5.5 + g + 1;
    case 'rule30_2D':
      return 0.4 * g ** 3.55 + g + 1;
    case 'sandpile': {
      const sand = Math.min(MAX_SAND, Math.max(0, initialSand));
      return sand + SANDPILE_FRAMES_PER_GENERATION * (g * sand + (g * (g + 1)) / 2);
    }
    default: { // gameOfLife
      const { side, cells } = seedEstimate(seed, size);
      const full = LIFE_FILL * size ** 3;
      // The box reaches the grid's side at generation `filled`; after that every generation holds
      // the same, so the loop never runs longer than the grid is wide
      const filled = Math.ceil((size - side) / LIFE_GROWTH);
      let total = cells;
      const last = Math.min(g, filled);
      for (let k = 1; k <= last; k++) {
        total += LIFE_FILL * Math.min(size, side + LIFE_GROWTH * k) ** 3;
      }
      if (g > last) total += (g - last) * full;
      return total;
    }
  }
}

/**
 * What a precomputed run holds in memory, in bytes, by part.
 * @param {object} run
 * @param {'gameOfLife'|'rule30'|'rule30_2D'|'sineWave'|'sandpile'} run.mode
 * @param {number} run.size - the grid's side (Rule 30's comes from rule30Size())
 * @param {number} run.generations
 * @param {object} [run.seed] - Game of Life 3D (bounded)'s shape settings (seedEstimate())
 * @param {number} [run.initialSand] - the sandpile's
 */
export function estimateRun(run) {
  const { mode, size, generations } = run;
  const frames = mode === 'sandpile'
    ? 1 + Math.ceil(SANDPILE_FRAMES_PER_GENERATION * generations)
    : generations + 1;
  const grids = size ** 3 * frames;
  const cells = liveCells(run);
  const cellBytes = cells * BYTES_PER_LIVE_CELL;
  const depth = mode === 'rule30' ? 1 : size; // simulationModel.js draws Rule 30 (1D) flat
  const view = size * size * depth * VIEW_BYTES_PER_CELL;
  return { frames, grids, cells, cellBytes, view, total: grids + cellBytes + view };
}

/** Whether Apply should ask before starting `run`. */
export function needsConfirmation(run) {
  return estimateRun(run).total > CONFIRM_BYTES;
}

/**
 * The largest value of `field` whose run fits in `budget` bytes, the other settings as they are:
 * 0 if even 1 doesn't fit, SEARCH_MAX[field] if that still fits. Rule 30's size follows its
 * generations, so for Rule 30 only 'generations' applies.
 * @param {object} run - as estimateRun() takes it
 * @param {'size'|'generations'} field
 * @param {number} budget
 */
export function largestWithin(run, field, budget) {
  const fits = (value) => estimateRun(withField(run, field, value)).total <= budget;
  if (!fits(1)) return 0;
  let lo = 1;
  let hi = SEARCH_MAX[field];
  if (fits(hi)) return hi;
  while (hi - lo > 1) { // fits(lo), !fits(hi)
    const mid = Math.floor((lo + hi) / 2);
    if (fits(mid)) lo = mid; else hi = mid;
  }
  return lo;
}

function withField(run, field, value) {
  const next = { ...run, [field]: value };
  if (field === 'generations' && (run.mode === 'rule30' || run.mode === 'rule30_2D')) {
    next.size = rule30Size(value, run.mode === 'rule30_2D');
  }
  return next;
}

/** Bytes as the dialog says them: "under 1 MB", "820 MB", "1.5 GB", "64 GB". */
export function formatBytes(bytes) {
  if (bytes < MB) return 'under 1 MB';
  if (bytes < GB) return `${Math.round(bytes / MB).toLocaleString('en')} MB`;
  if (bytes < 10 * GB) return `${(bytes / GB).toFixed(1)} GB`;
  return `${Math.round(bytes / GB).toLocaleString('en')} GB`;
}

/** A count as the dialog says it: "830", "48,000", "5.0 million", "2.1 billion". */
export function formatCount(n) {
  if (n < 1e5) return Math.round(n).toLocaleString('en');
  if (n < 1e9) return `${(n / 1e6).toFixed(1)} million`;
  return `${(n / 1e9).toFixed(1)} billion`;
}

const count = (n) => Math.round(n).toLocaleString('en');

/** "a 216³ grid over 100 generations" */
export function describeRun({ size, generations }) {
  return `a ${count(size)}³ grid over ${count(generations)} generation${generations === 1 ? '' : 's'}`;
}

/**
 * The range hint's text: the range a typical laptop runs comfortably, the other settings as
 * they are ("1 - 230"), or "advice" when nothing fits.
 * @param {object} run
 * @param {'size'|'generations'} field
 */
export function hintText(run, field) {
  const laptop = largestWithin(run, field, LAPTOP_BYTES);
  if (laptop < 1) return 'advice';
  return `1 - ${count(laptop)}${laptop >= SEARCH_MAX[field] ? '+' : ''}`;
}

/**
 * What a size or generations popover says, as plain strings; adviceControl.js puts them on the
 * page. `field` is the setting whose hint opened it.
 * @param {object} run
 * @param {'size'|'generations'} field
 * @returns {{estimate: string, parts: string, cellsNote: string | null,
 *   suggestions: {label: string, text: string}[], past: string}}
 */
export function adviceFor(run, field) {
  const est = estimateRun(run);
  const others = field === 'size'
    ? `at ${count(run.generations)} generations`
    : run.mode === 'rule30' || run.mode === 'rule30_2D'
      ? '(the size follows)'
      : `at size ${count(run.size)}`;
  const range = (budget) => {
    const n = largestWithin(run, field, budget);
    if (n < 1) {
      return field === 'generations' ? 'none at this size: lower the size first' : 'none at these generations';
    }
    const unit = field === 'generations' ? ' generations' : '';
    return `up to ${count(n)}${n >= SEARCH_MAX[field] ? ' or more' : ''}${unit} ${others}`;
  };
  return {
    estimate: `About ${formatBytes(est.total)} for this run, by estimate.`,
    parts: `Grids: ${count(run.size)}³ × ${count(est.frames)} = ${formatBytes(est.grids)}. `
      + `Live cells: about ${formatCount(est.cells)} in all generations, ${formatBytes(est.cellBytes)}. `
      + `View: ${formatBytes(est.view)}.`,
    cellsNote: run.mode === 'gameOfLife'
      ? 'Live cells are a guess before the run: under the default rules a pattern widens by about '
        + '0.4 cells a generation, with about 30% of it alive. Other rules can hold far fewer, or more.'
      : null,
    suggestions: [
      { label: `Typical laptop (${formatBytes(LAPTOP_BYTES)})`, text: range(LAPTOP_BYTES) },
      { label: `Strong desktop (${formatBytes(DESKTOP_BYTES)})`, text: range(DESKTOP_BYTES) },
    ],
    past: 'Past them, the run takes longer to compute, the view stutters as it draws more cells, '
      + 'and at last the browser refuses the memory, which stops the run with a message, or closes '
      + `the tab, which no page can catch. Above ${formatBytes(CONFIRM_BYTES)}, Apply asks first.`,
  };
}

/** The sandpile's Initial Sand popover: the 0-255 limit stays, and why. */
export const SAND_ADVICE = 'Initial Sand stays between 0 and 255: each cell keeps its grains in one '
  + 'byte, and 255 is the most one byte holds. Size and generations have no such limit.';

/** What Apply says before a run over CONFIRM_BYTES. */
export function confirmText(run) {
  const { total } = estimateRun(run);
  return `This run, ${describeRun(run)}, needs about ${formatBytes(total)} by estimate, more than `
    + `${formatBytes(CONFIRM_BYTES)}. On a typical laptop it may slow the page to a crawl, or the `
    + 'browser may close the tab. Run it anyway?';
}

/** What the page says when a run's memory was refused. */
export function outOfMemoryText(run) {
  const { total } = estimateRun(run);
  return `The browser refused the memory for ${describeRun(run)} (about ${formatBytes(total)} by `
    + 'estimate), so the run stopped. Open the settings to choose a smaller size or fewer generations.';
}

/** Whether `err` is the browser refusing memory: an allocation that failed or was too large. */
export function isOutOfMemory(err) {
  return err instanceof RangeError;
}
