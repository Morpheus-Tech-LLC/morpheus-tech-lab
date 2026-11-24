// SPDX-License-Identifier: Apache-2.0
//
// What the Contests panel says and draws, worked out apart from the page so the tests run it in
// Node: the countdown, the charts (Speed's generations over time, a Discovery run's live cells by
// generation), a score in words, how a run ended, the ships that left (Classic Methuselah's,
// #100), a result's file name, the statistics as the panel lists them, and a Discovery entry's
// seed as a small picture.

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
 * The layout of a run's chart. Speed's: generations completed (y) over the run's time (x), so a
 * faster machine climbs more steeply, with x over the contest's seconds. A Discovery run's: live
 * cells (y) by generation (x), with x over a clean scale that fits the generations so far. y runs
 * over a clean scale that fits the values so far; both rescale as the run goes on.
 * @param {[number, number][]} points - [x, y], from x = 0, in order
 * @param {{seconds?: number, width: number, height: number, floor?: number}} size - with
 *   `seconds`, x is time and runs over them, a tick a second; without, x fits the points. y's
 *   scale reaches at least `floor`: a race's pace line (#149) fits from the start
 */
export function chartLayout(points, { seconds, width, height, floor = 0 }) {
  const m = CHART_MARGIN;
  const plot = { left: m.left, top: m.top, right: width - m.right, bottom: height - m.bottom };
  const plotWidth = plot.right - plot.left;
  const plotHeight = plot.bottom - plot.top;
  const { top, step } = niceScale(Math.max(0, floor, ...points.map(([, g]) => g)));
  const xScale = seconds !== undefined ? { top: seconds, step: 1 } : niceScale(Math.max(0, ...points.map(([t]) => t)));
  const x = (t) => plot.left + (Math.min(Math.max(t, 0), xScale.top) / xScale.top) * plotWidth;
  const y = (g) => plot.bottom - (g / top) * plotHeight;
  const fixed = (v) => +v.toFixed(1);
  const xTicks = [];
  for (let t = 0; t <= xScale.top; t += xScale.step) xTicks.push({ value: t, label: n(t), at: fixed(x(t)) });
  const yTicks = [];
  for (let g = 0; g <= top; g += step) yTicks.push({ value: g, label: n(g), at: fixed(y(g)) });
  const xy = points.map(([t, g]) => [fixed(x(t)), fixed(y(g))]);
  const last = xy[xy.length - 1];
  return {
    plot,
    xTicks,
    yTicks,
    /** Where a point [x, y] of the data falls on the chart: a pace line is placed with it. */
    place: ([t, g]) => [fixed(x(t)), fixed(y(g))],
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
      return best < 0 ? null : { index: best, x: xy[best][0], y: xy[best][1], at: points[best][0], value: points[best][1] };
    },
  };
}

// ---- Where a run would stand (#150) ----

/** 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st, 1,001st. */
export function ordinal(place) {
  const tens = place % 100;
  const suffix = tens >= 11 && tens <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[place % 10] ?? 'th');
  return `${n(place)}${suffix}`;
}

/** Where a run would place: "You'd place 7th of 42", or first in an empty Hall of Fame. */
export function placeText(place, of) {
  return of === 1 ? "You'd be the first in the Hall of Fame" : `You'd place ${ordinal(place)} of ${n(of)}`;
}

/** Space round the strip, for its end labels and the visitor's. */
export const STRIP_MARGIN = Object.freeze({ left: 16, right: 16, top: 22, bottom: 20 });

/**
 * The strip of every entry's score (#150), with the visitor's marked: their generations along one
 * line, from the lowest to the highest, the better to the right.
 * @param {number[]} values - the entries' generations
 * @param {number} mine - the visitor's
 * @param {{width: number, height: number}} size
 * @returns {{y: number, left: number, right: number, low: object, high: object, dots: number[], mine: number}}
 *   the line's height and ends, its end labels ({x, label}), and each value's x
 */
export function stripLayout(values, mine, { width, height }) {
  const all = [...values, mine];
  let low = Math.min(...all);
  let high = Math.max(...all);
  if (low === high) {
    low -= 1;
    high += 1;
  }
  const left = STRIP_MARGIN.left;
  const right = width - STRIP_MARGIN.right;
  const x = (v) => +(left + ((v - low) / (high - low)) * (right - left)).toFixed(1);
  return {
    y: STRIP_MARGIN.top + (height - STRIP_MARGIN.top - STRIP_MARGIN.bottom) / 2,
    left,
    right,
    low: { x: left, label: n(Math.min(...all)) },
    high: { x: right, label: n(Math.max(...all)) },
    dots: values.map(x),
    mine: x(mine),
  };
}

// ---- Racing the Hall of Fame's #1 (#149) ----

/**
 * The pace a Speed run races: the Hall of Fame #1's timeline (#148), as [seconds, generation]
 * points, or, for a result file without one, its final mark only: its generations at the end of
 * the contest's seconds, or at its time if it reached the ceiling.
 * @param {object} result - #1's result file, read by readResult()
 * @param {import('../unbounded/contests.js').Contest} contest - Speed
 * @returns {{points: [number, number][]} | {mark: [number, number]}}
 */
export function paceOf(result, contest) {
  const timeline = result.details?.timeline;
  if (timeline) return { points: timeline.map(([ms, g]) => [ms / 1000, g]) };
  const { generations, ms } = result.score;
  return { mark: [ms === null ? contest.seconds : ms / 1000, generations] };
}

/** The most generations a pace reaches, for the chart's scale. */
export function paceTop(pace) {
  return pace.points ? pace.points[pace.points.length - 1][1] : pace.mark[1];
}

/**
 * The generations a timeline pace had completed at `seconds`: straight between its points, and
 * its last after them.
 */
export function paceAt(pace, seconds) {
  const { points } = pace;
  if (seconds <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [t1, g1] = points[i];
    if (seconds <= t1) {
      const [t0, g0] = points[i - 1];
      return t1 === t0 ? g1 : g0 + ((g1 - g0) * (seconds - t0)) / (t1 - t0);
    }
  }
  return points[points.length - 1][1];
}

const generationsWords = (count) => `${n(count)} generation${count === 1 ? '' : 's'}`;

/**
 * Where the visitor stands against #1, at their latest point [seconds, generation]. Against a
 * timeline: the generations between them at the same moment. Against a final mark: where the
 * visitor's rate so far would finish, at the mark's time, against the mark.
 * @returns {{gap: number, text: string}} gap > 0 ahead, < 0 behind, in whole generations
 */
export function raceText(pace, [seconds, generation]) {
  if (pace.points) {
    const gap = Math.round(generation - paceAt(pace, seconds));
    if (gap === 0) return { gap, text: 'Level with #1' };
    return { gap, text: `${gap > 0 ? 'Ahead of' : 'Behind'} #1 by ${generationsWords(Math.abs(gap))}` };
  }
  const [at, mark] = pace.mark;
  if (seconds <= 0) return { gap: 0, text: `#1 reached ${generationsWords(mark)}` };
  const projected = seconds >= at ? generation : Math.round((generation * at) / seconds);
  const gap = projected - mark;
  if (gap === 0) return { gap, text: "On pace to match #1's mark" };
  return { gap, text: `On pace to finish ${generationsWords(Math.abs(gap))} ${gap > 0 ? 'ahead of' : 'behind'} #1` };
}

/**
 * A pace on a chart laid out by chartLayout(): its line, or its final mark, and the label at its
 * end. Laid out again only when the chart's scale or size changes.
 * @returns {{line: string | null, end: {x: number, y: number, label: string}}}
 */
export function paceLayout(pace, layout) {
  if (pace.points) {
    const xy = pace.points.map(layout.place);
    const last = xy[xy.length - 1];
    return { line: xy.map(([px, py]) => `${px},${py}`).join(' '), end: { x: last[0], y: last[1], label: n(paceTop(pace)) } };
  }
  const [x, y] = layout.place(pace.mark);
  return { line: null, end: { x, y, label: n(pace.mark[1]) } };
}

/**
 * A time to the ceiling, to the millisecond, as the score holds it: `3.871 s`. Runs that reach
 * the ceiling compete on it, so it is never rounded further: two places would show 3,871 ms
 * and 3,874 ms as the same time, ranked apart.
 */
export function secondsText(ms) {
  return `${(ms / 1000).toFixed(3)} s`;
}

/**
 * A Speed score in words.
 * @param {{generations: number, ms: number | null}} score
 */
export function speedScoreText(score) {
  const generations = `${n(score.generations)} generation${score.generations === 1 ? '' : 's'}`;
  return score.ms === null ? generations : `${generations} in ${secondsText(score.ms)}`;
}

/**
 * A Methuselah score in words: "settled at generation 1,234: a still life", "settled at
 * generation 1,234: period 2", or "died at generation 1,234". Without the ending (the Hall of
 * Fame keeps only the score), a period-1 score is "settled at generation 1,234": a death is the
 * empty world's still life, so it settled too.
 * @param {{generations: number, period: number}} score
 * @param {'died' | 'repeat'} [ending]
 */
export function methuselahScoreText(score, ending) {
  const at = `generation ${n(score.generations)}`;
  if (ending === 'died') return `died at ${at}`;
  if (score.period !== 1) return `settled at ${at}: period ${n(score.period)}`;
  return ending === 'repeat' ? `settled at ${at}: a still life` : `settled at ${at}`;
}

/** A score in words, by its contest's kind; a Methuselah score says more with its ending. */
export function scoreText(contest, score, ending) {
  if (contest.kind === 'speed') return speedScoreText(score);
  if (contest.kind === 'methuselah') return methuselahScoreText(score, ending);
  return JSON.stringify(score);
}

/** Capitalised, for a sentence of its own. */
export const sentence = (text) => `${text[0].toUpperCase()}${text.slice(1)}`;

/**
 * A Methuselah score as the results card leads with it: the generations it took to settle, and
 * what it settled into.
 * @returns {{value: string, unit: string}}
 */
export function methuselahHero(score, ending) {
  const unit = score.generations === 1 ? 'generation' : 'generations';
  if (ending === 'died') return { value: n(score.generations), unit: `${unit}, until every cell had died` };
  const into = score.period === 1 ? 'a still life' : `a cycle of period ${n(score.period)}`;
  return { value: n(score.generations), unit: `${unit}, until it settled into ${into}` };
}

/**
 * A Speed score as the results card leads with it: the number that ranks it, and what it counts.
 * Below the ceiling that is the generations; at the ceiling every run has the same generations,
 * so it is the time taken to reach it.
 * @returns {{value: string, unit: string}}
 */
export function speedHero(score, contest) {
  const unit = score.generations === 1 ? 'generation' : 'generations';
  return score.ms === null
    ? { value: n(score.generations), unit: `${unit} in ${contest.seconds} seconds` }
    : { value: (score.ms / 1000).toFixed(3), unit: `seconds to reach the ceiling of ${n(score.generations)} ${unit}` };
}

/**
 * A score as the Hall of Fame shows it: what ranks it first, then the rest. At Speed's ceiling,
 * the time leads, since every entry there has the same generations. Methuselah's generations lead,
 * with the entry's rules and seed cells beside them: the rules are half the entry, and fewer
 * cells break a tie.
 * @param {object} [entry] - the Hall of Fame's entry, for a Methuselah score's rules and cells
 * @returns {{main: string, detail: string}}
 */
export function boardScore(contest, score, entry = {}) {
  if (contest.kind === 'methuselah') {
    const detail = [
      score.period === 1 ? null : `period ${n(score.period)}`,
      entry.rules ? rulesText(entry.rules) : null,
      entry.seedCells ? `${n(entry.seedCells)} seed cell${entry.seedCells === 1 ? '' : 's'}` : null,
    ].filter(Boolean).join(' · ');
    return { main: `${n(score.generations)} generation${score.generations === 1 ? '' : 's'}`, detail };
  }
  if (contest.kind !== 'speed') return { main: JSON.stringify(score), detail: '' };
  return score.ms === null
    ? { main: speedScoreText(score), detail: `in ${contest.seconds} seconds` }
    : { main: secondsText(score.ms), detail: `${n(score.generations)} generations, the ceiling` };
}

/** How a run ended by the visitor or the machine, the same for every contest: never a score. */
function machineEndingText(reason) {
  switch (reason) {
    case 'stopped': return 'Stopped by hand, so it has no score.';
    case 'memory-limit': return "Stopped at the engine's memory limit, so it has no score.";
    case 'out-of-memory': return 'Stopped: the browser refused the engine more memory, so it has no score.';
    case 'error': return 'Stopped by an error in the engine, so it has no score.';
    default: return `Ended (${reason}), so it has no score.`;
  }
}

/** How a Speed run ended, for the results card. */
export function speedEndingText(reason, contest) {
  switch (reason) {
    case 'deadline': return `The ${contest.seconds} seconds ran out.`;
    case 'generation-limit': return `It reached the ceiling, generation ${n(contest.ceiling)}, before the ${contest.seconds} seconds ran out, so its time counts too.`;
    default: return machineEndingText(reason);
  }
}

/** An arena's size, `64³`, for a cube; `64 × 32 × 16` otherwise. */
export function arenaText(arena) {
  const sides = arena.max.map((hi, a) => hi - arena.min[a] + 1);
  return sides.every((side) => side === sides[0]) ? `${n(sides[0])}³` : sides.map(n).join(' × ');
}

/**
 * How a Methuselah run ended, for the results card: what it settled into and its score, or why
 * it has none.
 * @param {string} reason - the run's end reason
 * @param {import('../unbounded/contests.js').Contest} contest
 * @param {{stats: {generation: number, live: number}, cycle?: {period: number} | null}} end
 */
export function methuselahEndingText(reason, contest, { stats, cycle }) {
  const at = `generation ${n(stats.generation)}`;
  const budget = n(contest.budget);
  switch (reason) {
    case 'died':
      return `Died at ${at}: no live cells remain. The empty world is a still life, so a death scores the generation the last cell died.`;
    case 'repeat':
      return cycle?.period > 1
        ? `Settled at ${at}: period ${n(cycle.period)}. From there its cells repeat every ${n(cycle.period)} generations, in place, so it scores where the cycle began.`
        : `Settled at ${at}: a still life. From there its cells stay the same, in place.`;
    case 'emits':
      return `Emits from ${at}: its cells repeat every ${n(cycle?.period ?? 1)} generation${cycle?.period === 1 ? '' : 's'}, but ships leave the arena during each cycle, so it never settles and has no score. A pattern scores once its last ship has left and the rest has settled.`;
    case 'arena-edge':
      return contest.departures
        ? `Reached the edge at ${at}: the next generation would bring a cell to life outside the ${arenaText(contest.fixes.arena)} arena from something that isn't a ship of period ${n(contest.departures.period)} or less heading out, so it has no score. Only ships leave: a pattern that keeps growing, or a ship sliding along a wall, ends here.`
        : `Reached the edge at ${at}: the next generation would bring a cell to life outside the ${arenaText(contest.fixes.arena)} arena, so it has no score. Only a pattern that settles in place inside the arena scores, and one that keeps growing, or sends something flying off, ends here.`;
    case 'generation-limit':
      return stats.live === 0
        ? `It died at generation ${budget}, the budget's last, so it has no score: a death is a cycle of period 1, which closes a generation later, past the budget.`
        : `Still unsettled at generation ${budget}, the budget, so it has no score.`;
    default: return machineEndingText(reason);
  }
}

/**
 * The ships that left a Classic Methuselah run (#100), in words: "No ship left the arena", "1 ship
 * left, at generation 140", "2 ships left, at generations 140 and 412". Ships that left together
 * share their generation; past five generations, only the first and last are named.
 * @param {{generation: number}[]} departures - in the order they left
 */
export function departuresText(departures) {
  if (!departures.length) return 'No ship left the arena';
  const ships = `${n(departures.length)} ship${departures.length === 1 ? '' : 's'} left`;
  const generations = [...new Set(departures.map((d) => d.generation))];
  if (generations.length === 1) return `${ships}, at generation ${n(generations[0])}`;
  if (generations.length > 5) return `${ships}, from generation ${n(generations[0])} to generation ${n(generations.at(-1))}`;
  const list = generations.map(n);
  return `${ships}, at generations ${list.slice(0, -1).join(', ')} and ${list.at(-1)}`;
}

/**
 * When entries close: the earliest closing among the contests, or that it is still to be
 * announced while none has one. A day ("2027-02-28") reads as that day; an instant with its offset
 * ("2027-03-31T23:59:00-05:00") reads as the day and time in Central Time, where the lab is.
 * @param {{closes: string | null}[]} contests
 * @param {{short?: boolean}} [options] - short, for the banner: "Closes TBD", "Closes 28 Feb 2027"
 */
export function closingText(contests, { short = false } = {}) {
  const closings = contests.map((c) => c.closes).filter(Boolean)
    .sort((a, b) => closingDate(a) - closingDate(b));
  if (!closings.length) return short ? 'Closes TBD' : 'Closing date to be announced';
  const closes = closings[0];
  const timed = closes.includes('T');
  const timeZone = timed ? 'America/Chicago' : 'UTC';
  const date = closingDate(closes);
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: short ? 'short' : 'long', year: 'numeric', timeZone });
  if (short || !timed) return short ? `Closes ${day}` : `Entries close ${day}`;
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone });
  return `Entries close ${day}, ${time} Central Time`;
}

function closingDate(closes) {
  if (closes.includes('T')) return new Date(closes);
  const [year, month, day] = closes.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * A result's file name: the contest and its score, `speed-1-412.json`, with the time at the
 * ceiling, `speed-1-1000-3871ms.json`, so two runs that both reach it don't share a name.
 */
export function resultFileName(contest, score) {
  return score.ms === null || score.ms === undefined
    ? `${contest.id}-${score.generations}.json`
    : `${contest.id}-${score.generations}-${score.ms}ms.json`;
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
 * A Discovery run's progress: the generation, out of the budget, `1,234 / 10,000`.
 */
export function budgetText(generation, budget) {
  return `${n(generation)} / ${n(budget)}`;
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
    // A world where ships leave at the edge (#100) counts them
    ...(stats.departed === undefined ? [] : [['Ships left', n(stats.departed)]]),
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

// ---- Watch (#78) ----

/** Where Watch is, out of the result's generation: "212 / 412". */
export function watchGenerationText(generation, last) {
  return `${n(generation)} / ${n(last)}`;
}

/** A ship's shift as the way it heads: [2, 0, -1] is "+x −z". */
export function headingText(shift) {
  return shift.map((d, a) => (d > 0 ? `+${'xyz'[a]}` : d < 0 ? `−${'xyz'[a]}` : null)).filter(Boolean).join(' ');
}

/**
 * Where Watch is among a run's departures (#102), at a generation: how many ships have left so
 * far, and the last one's generation and heading. A departure at t is the step from t to t + 1,
 * so at generation t the ship is still there, and from t + 1 it has gone.
 * @param {{generation: number, shift: number[]}[]} departures - the result's, in order
 * @param {number} generation - where Watch is
 */
export function watchDeparturesText(departures, generation) {
  const total = departures.length;
  if (!total) return 'No ship leaves in this run.';
  const ships = `${n(total)} ship${total === 1 ? '' : 's'}`;
  const gone = departures.filter((d) => d.generation < generation);
  if (!gone.length) return `${ships} leave${total === 1 ? 's' : ''} in this run, the first at generation ${n(departures[0].generation)}.`;
  const last = gone.at(-1);
  const at = `generation ${n(last.generation)}, heading ${headingText(last.shift)}`;
  if (gone.length === total) return total === 1 ? `The ship has left, at ${at}.` : `All ${ships} have left, the last at ${at}.`;
  return `${n(gone.length)} of ${ships} ${gone.length === 1 ? 'has' : 'have'} left, the last at ${at}.`;
}

/** How a replay that fell short of its generation ended, in words. */
const SHORT = {
  'cell-limit': "it passed the run's cell limit",
  'extent-limit': "it grew wider than the run's extent limit",
  'coordinate-limit': 'it reached the edge of the space the engine can hold',
  'arena-edge': "it reached the edge of the run's arena",
  'memory-limit': "it reached Watch's memory limit",
  'out-of-memory': 'the browser refused it more memory',
  'error': 'an error in the engine stopped it',
};

/**
 * What Watch found once its replay first ended, for Watch and the results card.
 * @param {{generation: number, hash: string | null, matches: boolean | null, reason: string}} replayed
 * @param {number} generation - the result's
 * @returns {{verdict: 'verified' | 'mismatch' | 'not-checked', text: string}}
 */
export function selfVerifiedText(replayed, generation) {
  const at = `generation ${n(generation)}`;
  if (replayed.matches === true) {
    return { verdict: 'verified', text: `Self-verified: the replay's hash at ${at} matches the run's.` };
  }
  if (replayed.hash) {
    return { verdict: 'mismatch', text: `Not verified: the replay's hash at ${at} doesn't match the run's.` };
  }
  const why = SHORT[replayed.reason] ?? `it ended (${replayed.reason})`;
  const stopped = `The replay stopped at generation ${n(replayed.generation)}, before ${at}: ${why}`;
  return replayed.matches === false
    ? { verdict: 'mismatch', text: `Not verified. ${stopped}, so this isn't the run's result.` }
    : { verdict: 'not-checked', text: `Not checked. ${stopped}.` };
}

// ---- A Discovery entry's seed, as a small picture ----

const COS30 = Math.sqrt(3) / 2;

/**
 * A seed drawn as cubes in its seed box, seen from above one corner (isometric), for the
 * contest's page. Cubes come back to front, so the later ones cover the earlier; a cube hidden
 * on all three of its visible sides by its neighbours is left out, so a full 10³ box draws only
 * its shell.
 * @param {number[][]} cells - [x, y, z], all inside the box
 * @param {{min: number[], max: number[]}} box - the seed box
 * @param {{unit?: number, pad?: number}} [options] - a cell's edge, and the margin, in pixels
 * @returns {{width: number, height: number, cubes: {top: string, right: string, left: string}[],
 *   outline: string, edges: string}} SVG points for each cube's three faces, the box's outline,
 *   and the box's three edges nearest the viewer, as a path
 */
export function seedPicture(cells, box, { unit = 9, pad = 4 } = {}) {
  // Screen x across, y down; world y is up. The viewer looks along (−1, −1, −1)
  const sx = (x, z) => (x - z) * COS30 * unit;
  const sy = (x, y, z) => ((x + z) / 2 - y) * unit;
  const lo = box.min;
  const hi = box.max.map((v) => v + 1);
  const corners = [];
  for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) corners.push([x, y, z]);
  const xs = corners.map(([x, , z]) => sx(x, z));
  const ys = corners.map(([x, y, z]) => sy(x, y, z));
  const left = Math.min(...xs) - pad;
  const top = Math.min(...ys) - pad;
  const at = (x, y, z) => `${+(sx(x, z) - left).toFixed(1)},${+(sy(x, y, z) - top).toFixed(1)}`;
  const face = (points) => points.map((p) => at(...p)).join(' ');

  const live = new Set(cells.map((c) => c.join(',')));
  const covered = ([x, y, z]) => live.has(`${x + 1},${y},${z}`) && live.has(`${x},${y + 1},${z}`) && live.has(`${x},${y},${z + 1}`);
  const cubes = cells
    .filter((cell) => !covered(cell))
    .sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[1] - b[1] || a[0] - b[0])
    .map(([x, y, z]) => ({
      top: face([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]),
      right: face([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]]),
      left: face([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]),
    }));
  const [x0, y0, z0] = lo;
  const [x1, y1, z1] = hi;
  return {
    width: Math.ceil(Math.max(...xs) - left + pad),
    height: Math.ceil(Math.max(...ys) - top + pad),
    cubes,
    outline: face([[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, y1, z1]]),
    edges: `M${at(x1, y1, z1)} L${at(x0, y1, z1)} M${at(x1, y1, z1)} L${at(x1, y1, z0)} M${at(x1, y1, z1)} L${at(x1, y0, z1)}`,
  };
}
