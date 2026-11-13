// SPDX-License-Identifier: Apache-2.0
//
// What the Contests panel says and draws, worked out apart from the page so the tests run it in
// Node: the countdown, the chart of generations over time, a score in words, how a run ended,
// a result's file name, and the statistics as the panel lists them.

/** Thousands separators, the same in every browser. */
export const n = (value) => Math.round(value).toLocaleString('en');

/** The rules as the lab's HUD writes them: B9-10/S5-15 (consecutive counts as a range). */
export function rulesText({ birth, survival }) {
  return `B${counts(birth) || '–'}/S${counts(survival) || '–'}`;
}

function counts(list) {
  const parts = [];
  for (let i = 0; i < list.length;) {
    let j = i;
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
    parts.push(j > i ? `${list[i]}-${list[j]}` : String(list[i]));
    i = j + 1;
  }
  return parts.join(',');
}

/**
 * The seconds left, to one decimal place, never below 0.0 or above the run's length.
 * @param {number} seconds - the run's length
 * @param {number} elapsedMs - how long it has run
 */
export function countdownText(seconds, elapsedMs) {
  const left = Math.min(seconds, Math.max(0, seconds - elapsedMs / 1000));
  // Round down, so 0.0 shows only once the time is up
  return (Math.floor(left * 10) / 10).toFixed(1);
}

/**
 * A y-axis that fits `max`: a clean step (1, 2 or 5 times a power of ten, at least 1) and the
 * first multiple of it at or above `max`, in about five steps.
 * @returns {{top: number, step: number}}
 */
export function niceScale(max) {
  if (!(max > 0)) return { top: 5, step: 1 };
  const raw = max / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  let step = magnitude;
  for (const factor of [1, 2, 5, 10]) {
    step = factor * magnitude;
    if (step * 5 >= max) break;
  }
  step = Math.max(1, step);
  return { top: Math.ceil(max / step) * step, step };
}

/** Space round the plot, for the axes' ticks and titles, and the end label. */
export const CHART_MARGIN = Object.freeze({ top: 14, right: 48, bottom: 42, left: 60 });

/**
 * The layout of the run's chart: generations completed (y) over the run's time (x), so a faster
 * machine climbs more steeply. x runs over the contest's seconds; y over a clean scale that
 * fits the generations so far, rescaled as the run climbs.
 * @param {[number, number][]} points - [seconds, generation], from 0, in time order
 * @param {{seconds: number, width: number, height: number}} size
 */
export function chartLayout(points, { seconds, width, height }) {
  const m = CHART_MARGIN;
  const plot = { left: m.left, top: m.top, right: width - m.right, bottom: height - m.bottom };
  const plotWidth = plot.right - plot.left;
  const plotHeight = plot.bottom - plot.top;
  const { top, step } = niceScale(Math.max(0, ...points.map(([, g]) => g)));
  const x = (t) => plot.left + (Math.min(Math.max(t, 0), seconds) / seconds) * plotWidth;
  const y = (g) => plot.bottom - (g / top) * plotHeight;
  const fixed = (v) => +v.toFixed(1);
  const xTicks = [];
  for (let t = 0; t <= seconds; t++) xTicks.push({ value: t, label: String(t), at: fixed(x(t)) });
  const yTicks = [];
  for (let g = 0; g <= top; g += step) yTicks.push({ value: g, label: n(g), at: fixed(y(g)) });
  const xy = points.map(([t, g]) => [fixed(x(t)), fixed(y(g))]);
  const last = xy[xy.length - 1];
  return {
    plot,
    xTicks,
    yTicks,
    line: xy.map(([px, py]) => `${px},${py}`).join(' '),
    area: xy.length ? `M${xy[0][0]},${plot.bottom} ${xy.map(([px, py]) => `L${px},${py}`).join(' ')} L${last[0]},${plot.bottom} Z` : '',
    end: last ? { x: last[0], y: last[1], label: n(points[points.length - 1][1]) } : null,
    /** The point nearest a horizontal position on the chart, for the hover readout. */
    nearest(px) {
      let best = -1;
      let distance = Infinity;
      xy.forEach(([qx], i) => {
        const d = Math.abs(qx - px);
        if (d <= distance) { best = i; distance = d; }
      });
      return best < 0 ? null : { index: best, x: xy[best][0], y: xy[best][1], seconds: points[best][0], generation: points[best][1] };
    },
  };
}

/**
 * A Speed score in words.
 * @param {{generations: number, ms: number | null}} score
 */
export function speedScoreText(score) {
  const generations = `${n(score.generations)} generation${score.generations === 1 ? '' : 's'}`;
  return score.ms === null ? generations : `${generations} in ${(score.ms / 1000).toFixed(2)} s`;
}

/**
 * A Speed score as the results card leads with it: the number, and what it counts.
 * @returns {{value: string, unit: string}}
 */
export function speedHero(score, contest) {
  const unit = score.generations === 1 ? 'generation' : 'generations';
  return score.ms === null
    ? { value: n(score.generations), unit: `${unit} in ${contest.seconds} seconds` }
    : { value: n(score.generations), unit: `${unit} in ${(score.ms / 1000).toFixed(2)} s, the ceiling` };
}

/** How a Speed run ended, for the results card. */
export function speedEndingText(reason, contest) {
  switch (reason) {
    case 'deadline': return `The ${contest.seconds} seconds ran out.`;
    case 'generation-limit': return `It reached the ceiling, generation ${n(contest.ceiling)}, before the ${contest.seconds} seconds ran out, so its time counts too.`;
    case 'stopped': return 'Stopped by hand, so it has no score.';
    case 'memory-limit': return "Stopped at the engine's memory limit, so it has no score.";
    case 'out-of-memory': return 'Stopped: the browser refused the engine more memory, so it has no score.';
    case 'error': return 'Stopped by an error in the engine, so it has no score.';
    default: return `Ended (${reason}), so it has no score.`;
  }
}

/**
 * When entries close: the earliest closing date among the contests, or that it is still to be
 * announced while none has one.
 * @param {{closes: string | null}[]} contests
 * @param {{short?: boolean}} [options] - short, for the banner: "Closes TBD", "Closes 28 Feb 2027"
 */
export function closingText(contests, { short = false } = {}) {
  const dates = contests.map((c) => c.closes).filter(Boolean).sort();
  if (!dates.length) return short ? 'Closes TBD' : 'Closing date to be announced';
  const [year, month, day] = dates[0].split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const text = date.toLocaleDateString('en-GB', { day: 'numeric', month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' });
  return short ? `Closes ${text}` : `Entries close ${text}`;
}

/** A result's file name: the contest and its score, `speed-1-412.json`. */
export function resultFileName(contest, score) {
  return `${contest.id}-${score.generations}.json`;
}

/** Bytes as MB, or KB below a megabyte. */
export function bytesText(bytes) {
  return bytes >= 1024 * 1024 ? `${n(bytes / (1024 * 1024))} MB` : `${n(bytes / 1024)} KB`;
}

/** The live cells' bounding box as its sides, `37 × 37 × 37`, or a dash for none. */
export function extentText(extent) {
  if (!extent) return '–';
  return extent.max.map((hi, a) => n(hi - extent.min[a] + 1)).join(' × ');
}

/**
 * The statistics the panel lists, during a run and on the results card.
 * @param {import('../unbounded/run.js').Stats} stats
 * @returns {[string, string][]} label and value
 */
export function statsRows(stats) {
  return [
    ['Generation', n(stats.generation)],
    ['Generations/s', n(stats.rate)],
    ['Live cells', n(stats.live)],
    ['Peak live cells', n(stats.livePeak)],
    ['Chunks', n(stats.chunks)],
    ['Memory', bytesText(stats.memoryBytes)],
    ['Extent', extentText(stats.extent)],
  ];
}

/** A verdict from Verify a result, as a heading. */
export function verdictTitle(verdict) {
  return {
    verified: 'Verified',
    mismatch: "Doesn't match",
    refused: 'Not a result file',
    'not-checked': 'Not checked',
    error: 'The check failed',
  }[verdict] ?? verdict;
}
