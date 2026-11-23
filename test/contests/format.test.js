// SPDX-License-Identifier: Apache-2.0
//
// What the Contests panel says and draws (#77, #94): the countdown, the charts, scores, endings,
// file names, statistics, and a Discovery entry's seed as a picture; and Classic Methuselah's
// departures, on the results card and in Watch (#102).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contestById, CONTESTS } from '../../src/unbounded/contests.js';
import {
  countdownText, niceScale, chartLayout, CHART_MARGIN, speedHero, speedScoreText, speedEndingText, resultFileName, statsRows,
  secondsText, boardScore, methuselahScoreText, scoreText, methuselahHero, methuselahEndingText, arenaText, budgetText,
  seedPicture, sentence,
  rulesText, bytesText, extentText, verdictTitle, closingText, watchGenerationText, selfVerifiedText,
  departuresText, headingText, watchDeparturesText, paceOf, paceTop, paceAt, raceText, paceLayout,
  ordinal, placeText, stripLayout, STRIP_MARGIN,
} from '../../src/contests/format.js';

const SPEED = contestById('speed-1');
const METHUSELAH = contestById('methuselah-1');
const CLASSIC = contestById('classic-methuselah-1');

test('the countdown runs from the full length to 0.0, rounding down', () => {
  assert.equal(countdownText(6, 0), '6.0');
  assert.equal(countdownText(6, 1), '5.9');
  assert.equal(countdownText(6, 1849), '4.1');
  assert.equal(countdownText(6, 5950), '0.0');
  assert.equal(countdownText(6, 9000), '0.0');
  assert.equal(countdownText(6, -50), '6.0');
});

test('the y-axis takes a clean step and tops out at or above the highest value', () => {
  assert.deepEqual(niceScale(0), { top: 5, step: 1 });
  assert.deepEqual(niceScale(3), { top: 3, step: 1 });
  assert.deepEqual(niceScale(48), { top: 50, step: 10 });
  assert.deepEqual(niceScale(412), { top: 500, step: 100 });
  assert.deepEqual(niceScale(1000), { top: 1000, step: 200 });
  assert.deepEqual(niceScale(1001), { top: 1500, step: 500 });
});

test("the chart puts time across and generations up, so a run climbs", () => {
  const points = [[0, 0], [1, 120], [2, 210], [3, 280], [6.02, 412]];
  const chart = chartLayout(points, { seconds: 6, width: 560, height: 260 });
  const { plot } = chart;
  assert.deepEqual(plot, { left: CHART_MARGIN.left, top: CHART_MARGIN.top, right: 560 - CHART_MARGIN.right, bottom: 260 - CHART_MARGIN.bottom });
  assert.deepEqual(chart.xTicks.map((t) => t.label), ['0', '1', '2', '3', '4', '5', '6']);
  assert.equal(chart.xTicks[0].at, plot.left);
  assert.equal(chart.xTicks[6].at, plot.right);
  assert.deepEqual(chart.yTicks.map((t) => t.label), ['0', '100', '200', '300', '400', '500']);
  assert.equal(chart.yTicks[0].at, plot.bottom);
  assert.equal(chart.yTicks.at(-1).at, plot.top);
  const xy = chart.line.split(' ').map((p) => p.split(',').map(Number));
  assert.equal(xy.length, 5);
  assert.ok(xy.every(([, py], i) => i === 0 || py < xy[i - 1][1]), 'each later point is higher on screen');
  assert.equal(xy.at(-1)[0], plot.right, 'time past the 6 seconds is drawn at the edge');
  assert.deepEqual(chart.end, { x: plot.right, y: xy.at(-1)[1], label: '412' });
  assert.ok(chart.area.startsWith(`M${plot.left},${plot.bottom} L`) && chart.area.endsWith(`L${plot.right},${plot.bottom} Z`));
  const near = chart.nearest(chart.xTicks[2].at + 3);
  assert.deepEqual([near.at, near.value], [2, 210]);
  assert.equal(chartLayout([], { seconds: 6, width: 560, height: 260 }).end, null);
});

test("Speed's score and ending, in words", () => {
  assert.deepEqual(speedHero({ generations: 412, ms: null }, SPEED), { value: '412', unit: 'generations in 6 seconds' });
  // At the ceiling the time ranks a run, so the card leads with it
  assert.deepEqual(speedHero({ generations: 1000, ms: 4210 }, SPEED), { value: '4.210', unit: 'seconds to reach the ceiling of 1,000 generations' });
  assert.equal(speedScoreText({ generations: 412, ms: null }), '412 generations');
  assert.equal(speedScoreText({ generations: 1, ms: null }), '1 generation');
  assert.equal(speedScoreText({ generations: 1000, ms: 4210 }), '1,000 generations in 4.210 s');
  // To the millisecond the score holds: times 3 ms apart, ranked apart, never read the same
  assert.equal(secondsText(3871), '3.871 s');
  assert.equal(secondsText(3874), '3.874 s');
  assert.equal(secondsText(1), '0.001 s');
  assert.equal(secondsText(6000), '6.000 s');
  assert.deepEqual(boardScore(SPEED, { generations: 1000, ms: 3871 }), { main: '3.871 s', detail: '1,000 generations, the ceiling' });
  assert.deepEqual(boardScore(SPEED, { generations: 742, ms: null }), { main: '742 generations', detail: 'in 6 seconds' });
  assert.equal(speedEndingText('deadline', SPEED), 'The 6 seconds ran out.');
  assert.match(speedEndingText('generation-limit', SPEED), /reached the ceiling, generation 1,000/);
  for (const reason of ['stopped', 'memory-limit', 'out-of-memory', 'error', 'cell-limit']) {
    assert.match(speedEndingText(reason, SPEED), /no score/, reason);
  }
});

test('the closing date is the earliest set, or to be announced', () => {
  assert.equal(closingText([{ closes: null }]), 'Closing date to be announced');
  assert.equal(closingText([{ closes: '2027-03-31' }, { closes: null }, { closes: '2027-02-28' }]), 'Entries close 28 February 2027');
  assert.equal(closingText([{ closes: null }], { short: true }), 'Closes TBD');
  assert.equal(closingText([{ closes: '2027-02-28' }], { short: true }), 'Closes 28 Feb 2027');
});

test('Season 0 closes at 11:59 PM Central Time on 31 December 2026, in Central Time wherever it is read (#130)', () => {
  assert.equal(SPEED.closes, '2026-12-31T23:59:00-06:00');
  assert.ok(CONTESTS.every((contest) => contest.closes === SPEED.closes), 'all three close together');
  assert.equal(closingText(CONTESTS), 'Entries close 31 December 2026, 11:59 PM Central Time');
  assert.equal(closingText(CONTESTS, { short: true }), 'Closes 31 Dec 2026');
  // A timed closing is ordered by its instant: 23:00 UTC on the 31st comes before it
  assert.equal(closingText([{ closes: '2026-12-31T23:59:00-06:00' }, { closes: '2026-12-31T23:00:00Z' }]), 'Entries close 31 December 2026, 5:00 PM Central Time');
});

test("a result's file name gives the contest and the score", () => {
  assert.equal(resultFileName(SPEED, { generations: 412, ms: null }), 'speed-1-412.json');
  // Every run at the ceiling has 1,000 generations: its time keeps the names apart
  assert.equal(resultFileName(SPEED, { generations: 1000, ms: 3871 }), 'speed-1-1000-3871ms.json');
});

test('the statistics as the panel lists them', () => {
  const rows = statsRows({
    generation: 412, rate: 68.6, live: 123456, livePeak: 123456, chunks: 210,
    memoryBytes: 64 * 1024 * 1024, extent: { min: [-20, -20, -20], max: [16, 16, 16] },
  });
  assert.deepEqual(rows, [
    ['Generation', '412'], ['Generations/s', '69'], ['Live cells', '123,456'], ['Peak live cells', '123,456'],
    ['Chunks', '210'], ['Memory', '64 MB'], ['Extent', '37 × 37 × 37'],
  ]);
  assert.equal(bytesText(300 * 1024), '300 KB');
  assert.equal(extentText(null), '–');
});

test('rules are written as the HUD writes them', () => {
  assert.equal(rulesText(SPEED.fixes.rules), 'B9-10/S5-15');
  assert.equal(rulesText({ birth: [5, 11, 12], survival: [0, 1, 4, 5, 10, 12, 13, 14] }), 'B5,11-12/S0-1,4-5,10,12-14');
  assert.equal(rulesText({ birth: [4], survival: [] }), 'B4/S–');
});

test('each verdict has a heading', () => {
  assert.equal(verdictTitle('verified'), 'Verified');
  assert.equal(verdictTitle('mismatch'), "Doesn't match");
  assert.equal(verdictTitle('refused'), 'Not a result file');
  assert.equal(verdictTitle('not-checked'), 'Not checked');
});

test('Watch shows where it is, and what its replay found at the result\'s generation', () => {
  assert.equal(watchGenerationText(212, 1000), '212 / 1,000');
  assert.deepEqual(selfVerifiedText({ generation: 412, hash: 'sha256:a', matches: true, reason: 'generation-limit' }, 412), {
    verdict: 'verified', text: "Self-verified: the replay's hash at generation 412 matches the run's.",
  });
  assert.deepEqual(selfVerifiedText({ generation: 1000, hash: 'sha256:b', matches: false, reason: 'generation-limit' }, 1000), {
    verdict: 'mismatch', text: "Not verified: the replay's hash at generation 1,000 doesn't match the run's.",
  });
  assert.deepEqual(selfVerifiedText({ generation: 30, hash: null, matches: false, reason: 'arena-edge' }, 412), {
    verdict: 'mismatch',
    text: "Not verified. The replay stopped at generation 30, before generation 412: it reached the edge of the run's arena, so this isn't the run's result.",
  });
  assert.deepEqual(selfVerifiedText({ generation: 300, hash: null, matches: null, reason: 'out-of-memory' }, 412), {
    verdict: 'not-checked',
    text: 'Not checked. The replay stopped at generation 300, before generation 412: the browser refused it more memory.',
  });
});

// ---- Methuselah (#94) ----

test("a Discovery run's chart puts generations across and live cells up, on clean scales that fit the run", () => {
  const points = [[0, 13], [1, 40], [2, 95], [3, 160], [1234, 22]];
  const chart = chartLayout(points, { width: 560, height: 260 });
  const { plot } = chart;
  assert.deepEqual(chart.xTicks.map((t) => t.label), ['0', '500', '1,000', '1,500']);
  assert.equal(chart.xTicks[0].at, plot.left);
  assert.equal(chart.xTicks.at(-1).at, plot.right);
  assert.deepEqual(chart.yTicks.map((t) => t.label), ['0', '50', '100', '150', '200']);
  assert.deepEqual(chart.end, { x: +(plot.left + (1234 / 1500) * (plot.right - plot.left)).toFixed(1), y: chart.end.y, label: '22' });
  const near = chart.nearest(plot.right);
  assert.deepEqual([near.at, near.value], [1234, 22]);
  // Before the run has gone anywhere, the scales still make sense
  assert.deepEqual(chartLayout([[0, 13]], { width: 560, height: 260 }).xTicks.map((t) => t.label), ['0', '1', '2', '3', '4', '5']);
});

test("Methuselah's score, in words: what it settled into, and where", () => {
  const still = { generations: 1234, period: 1 };
  const cycle = { generations: 1234, period: 2 };
  assert.equal(methuselahScoreText(still, 'repeat'), 'settled at generation 1,234: a still life');
  assert.equal(methuselahScoreText(cycle, 'repeat'), 'settled at generation 1,234: period 2');
  assert.equal(methuselahScoreText(still, 'died'), 'died at generation 1,234');
  // Without the ending, a period-1 score is still a settling: a death is the empty world's still life
  assert.equal(methuselahScoreText(still), 'settled at generation 1,234');
  assert.equal(methuselahScoreText(cycle), 'settled at generation 1,234: period 2');
  assert.equal(scoreText(METHUSELAH, cycle, 'repeat'), 'settled at generation 1,234: period 2');
  assert.equal(scoreText(SPEED, { generations: 412, ms: null }, 'deadline'), '412 generations');
  assert.equal(sentence('died at generation 4'), 'Died at generation 4');

  assert.deepEqual(methuselahHero(still, 'repeat'), { value: '1,234', unit: 'generations, until it settled into a still life' });
  assert.deepEqual(methuselahHero(cycle, 'repeat'), { value: '1,234', unit: 'generations, until it settled into a cycle of period 2' });
  assert.deepEqual(methuselahHero({ generations: 1, period: 1 }, 'died'), { value: '1', unit: 'generation, until every cell had died' });
  assert.deepEqual(methuselahHero({ generations: 0, period: 1 }, 'repeat'), { value: '0', unit: 'generations, until it settled into a still life' });

  // The Hall of Fame: the generations rank it; its period, rules and seed cells follow
  const entry = { rules: { birth: [5, 7, 8], survival: [1, 4] }, seedCells: 13 };
  assert.deepEqual(boardScore(METHUSELAH, cycle, entry), { main: '1,234 generations', detail: 'period 2 · B5,7-8/S1,4 · 13 seed cells' });
  assert.deepEqual(boardScore(METHUSELAH, still, { ...entry, seedCells: 1 }), { main: '1,234 generations', detail: 'B5,7-8/S1,4 · 1 seed cell' });
  // A result's file name has its score
  assert.equal(resultFileName(METHUSELAH, still), 'methuselah-1-1234.json');
});

test('how a Methuselah run ended: its score, or why it has none', () => {
  const at = (generation, live = 5) => ({ stats: { generation, live } });
  assert.equal(methuselahEndingText('died', METHUSELAH, at(1234, 0)),
    'Died at generation 1,234: no live cells remain. The empty world is a still life, so a death scores the generation the last cell died.');
  assert.match(methuselahEndingText('repeat', METHUSELAH, { ...at(1234), cycle: { from: 1234, period: 1 } }), /^Settled at generation 1,234: a still life\./);
  assert.match(methuselahEndingText('repeat', METHUSELAH, { ...at(1234), cycle: { from: 1234, period: 2 } }), /^Settled at generation 1,234: period 2\. From there its cells repeat every 2 generations, in place/);
  // The edge and the budget say why there is no score
  const edge = methuselahEndingText('arena-edge', METHUSELAH, at(37));
  assert.match(edge, /^Reached the edge at generation 37: .* outside the 64³ arena, so it has no score/);
  assert.match(edge, /sends something flying off/);
  const budget = methuselahEndingText('generation-limit', METHUSELAH, at(10_000));
  assert.equal(budget, 'Still unsettled at generation 10,000, the budget, so it has no score.');
  // A death at the budget's last generation doesn't score either, and says why
  assert.match(methuselahEndingText('generation-limit', METHUSELAH, at(10_000, 0)), /died at generation 10,000, the budget's last, so it has no score: .* closes a generation later, past the budget/);
  for (const reason of ['stopped', 'memory-limit', 'out-of-memory', 'error']) {
    assert.match(methuselahEndingText(reason, METHUSELAH, at(50)), /no score/, reason);
  }
  assert.equal(arenaText(METHUSELAH.fixes.arena), '64³');
  assert.equal(arenaText({ min: [0, 0, 0], max: [63, 31, 15] }), '64 × 32 × 16');
  assert.equal(budgetText(1234, 10_000), '1,234 / 10,000');
});

test('a seed is drawn as cubes in its box, back to front, leaving out those its neighbours hide', () => {
  const box = METHUSELAH.fixes.seedBox;
  const one = seedPicture([[0, 0, 0]], box);
  assert.equal(one.cubes.length, 1);
  assert.ok(one.width > 0 && one.height > 0);
  // Every point lies in the picture
  const inside = (points) => points.split(' ').every((p) => {
    const [x, y] = p.split(',').map(Number);
    return x >= 0 && x <= one.width && y >= 0 && y <= one.height;
  });
  assert.ok(inside(one.outline) && inside(one.cubes[0].top) && inside(one.cubes[0].left) && inside(one.cubes[0].right));
  assert.equal(one.outline.split(' ').length, 6);

  // A full box draws only what can be seen: the cubes with a free side towards the viewer
  const full = [];
  for (let z = -5; z <= 4; z++) for (let y = -5; y <= 4; y++) for (let x = -5; x <= 4; x++) full.push([x, y, z]);
  const shell = seedPicture(full, box);
  assert.equal(shell.cubes.length, 1000 - 9 ** 3);
  assert.deepEqual(seedPicture(full, box).outline, one.outline, 'the box is the same whatever the seed');

  // Back to front: a cube in front of another (further along x, y or z) is drawn after it
  const pair = seedPicture([[1, 0, 0], [0, 0, 0]], box);
  assert.deepEqual(pair.cubes.map((c) => c.top), [seedPicture([[0, 0, 0]], box).cubes[0].top, seedPicture([[1, 0, 0]], box).cubes[0].top]);
});

// ---- Classic Methuselah (#102) ----

test("how a Classic Methuselah run ended: 'emits' and the edge say why there is no score", () => {
  const at = (generation, live = 5) => ({ stats: { generation, live } });
  const emits = methuselahEndingText('emits', CLASSIC, { ...at(400), cycle: { from: 400, period: 30 } });
  assert.match(emits, /^Emits from generation 400: its cells repeat every 30 generations, but ships leave the arena during each cycle, so it never settles and has no score\./);
  const edge = methuselahEndingText('arena-edge', CLASSIC, at(37));
  assert.match(edge, /^Reached the edge at generation 37: .* outside the 64³ arena from something that isn't a ship of period 32 or less heading out, so it has no score\./);
  // Settling, and the budget, read as Methuselah's
  for (const [reason, end] of [['died', at(36, 0)], ['repeat', { ...at(36), cycle: { from: 36, period: 2 } }], ['generation-limit', at(10_000)]]) {
    assert.equal(methuselahEndingText(reason, CLASSIC, end), methuselahEndingText(reason, METHUSELAH, end));
  }
  // No ending suggests Contained chaos, a later season's
  for (const reason of ['died', 'repeat', 'emits', 'arena-edge', 'generation-limit']) {
    for (const contest of [METHUSELAH, CLASSIC]) {
      assert.doesNotMatch(methuselahEndingText(reason, contest, { ...at(10_000), cycle: { from: 9000, period: 2 } }), /Contained chaos/);
    }
  }
});

test('the ships that left, in words, for the results card', () => {
  const at = (...generations) => generations.map((generation) => ({ generation, period: 1, shift: [1, 0, 0] }));
  assert.equal(departuresText([]), 'No ship left the arena');
  assert.equal(departuresText(at(140)), '1 ship left, at generation 140');
  assert.equal(departuresText(at(35, 35)), '2 ships left, at generation 35');
  assert.equal(departuresText(at(140, 412)), '2 ships left, at generations 140 and 412');
  assert.equal(departuresText(at(140, 140, 290, 1412)), '4 ships left, at generations 140, 290 and 1,412');
  assert.equal(departuresText(at(1, 2, 3, 4, 5)), '5 ships left, at generations 1, 2, 3, 4 and 5');
  assert.equal(departuresText(at(140, 200, 260, 320, 380, 9412)), '6 ships left, from generation 140 to generation 9,412');
});

test('Watch says how many ships have left, as the replay passes each', () => {
  assert.equal(headingText([1, 0, 0]), '+x');
  assert.equal(headingText([0, -2, 1]), '−y +z');
  const departures = [
    { generation: 35, period: 1, shift: [1, 0, 0] },
    { generation: 35, period: 1, shift: [0, 0, -1] },
    { generation: 90, period: 4, shift: [0, 2, 0] },
  ];
  assert.equal(watchDeparturesText([], 12), 'No ship leaves in this run.');
  assert.equal(watchDeparturesText(departures, 0), '3 ships leave in this run, the first at generation 35.');
  // At generation 35 the ships are still there: they leave on the step to 36
  assert.equal(watchDeparturesText(departures, 35), '3 ships leave in this run, the first at generation 35.');
  assert.equal(watchDeparturesText(departures, 36), '2 of 3 ships have left, the last at generation 35, heading −z.');
  assert.equal(watchDeparturesText(departures, 91), 'All 3 ships have left, the last at generation 90, heading +y.');
  assert.equal(watchDeparturesText(departures.slice(2), 50), '1 ship leaves in this run, the first at generation 90.');
  assert.equal(watchDeparturesText(departures.slice(2), 91), 'The ship has left, at generation 90, heading +y.');
  assert.equal(watchDeparturesText([...departures.slice(0, 1), ...departures.slice(2)], 40), '1 of 2 ships has left, the last at generation 35, heading +x.');
});

test("a run where ships leave counts them among its statistics; others don't", () => {
  const stats = { generation: 40, rate: 100, live: 4, livePeak: 30, chunks: 1, memoryBytes: 1 << 20, extent: null };
  assert.equal(statsRows(stats).find(([label]) => label === 'Ships left'), undefined);
  assert.deepEqual(statsRows({ ...stats, departed: 2 }).at(-1), ['Ships left', '2']);
});

// ---- Racing the Hall of Fame's #1 (#149) ----

const TIMELINE = [[0, 0], [250, 160], [1000, 210], [3000, 330], [5970, 449]];
const timed = { score: { generations: 449, ms: null }, details: { timeline: TIMELINE } };

test("#1's pace is its timeline in seconds, or without one its final mark", () => {
  const pace = paceOf(timed, SPEED);
  assert.deepEqual(pace.points, [[0, 0], [0.25, 160], [1, 210], [3, 330], [5.97, 449]]);
  assert.equal(paceTop(pace), 449);
  const mark = paceOf({ score: { generations: 452, ms: null }, details: {} }, SPEED);
  assert.deepEqual(mark, { mark: [6, 452] });
  assert.equal(paceTop(mark), 452);
  assert.deepEqual(paceOf({ score: { generations: 1000, ms: 4210 }, details: {} }, SPEED), { mark: [4.21, 1000] }, 'at the ceiling, its time');
});

test('the pace at a moment is straight between its points, and its last after them', () => {
  const pace = paceOf(timed, SPEED);
  assert.equal(paceAt(pace, 0), 0);
  assert.equal(paceAt(pace, 0.25), 160);
  assert.equal(paceAt(pace, 2), 270);
  assert.equal(paceAt(pace, 5.97), 449);
  assert.equal(paceAt(pace, 6.02), 449);
  assert.equal(paceAt({ points: [[0, 0], [1, 5], [1, 9], [2, 10]] }, 1), 5, 'two points at one moment: the first');
});

test('the gap to #1: generations at the same moment, or the finish the rate so far points to', () => {
  const pace = paceOf(timed, SPEED);
  assert.deepEqual(raceText(pace, [0, 0]), { gap: 0, text: 'Level with #1' });
  assert.deepEqual(raceText(pace, [2, 281]), { gap: 11, text: 'Ahead of #1 by 11 generations' });
  assert.deepEqual(raceText(pace, [2, 269]), { gap: -1, text: 'Behind #1 by 1 generation' });
  assert.deepEqual(raceText(pace, [2, 270.4]), { gap: 0, text: 'Level with #1' });
  const mark = { mark: [6, 452] };
  assert.deepEqual(raceText(mark, [0, 0]), { gap: 0, text: '#1 reached 452 generations' });
  assert.deepEqual(raceText(mark, [3, 230]), { gap: 8, text: 'On pace to finish 8 generations ahead of #1' });
  assert.deepEqual(raceText(mark, [3, 225]), { gap: -2, text: 'On pace to finish 2 generations behind #1' });
  assert.deepEqual(raceText(mark, [3, 226]), { gap: 0, text: "On pace to match #1's mark" });
  assert.deepEqual(raceText(mark, [6, 440]), { gap: -12, text: 'On pace to finish 12 generations behind #1' }, 'at the mark, what was done');
});

test("the chart's scale fits #1 from the start, and its line or mark sits on it", () => {
  const pace = paceOf(timed, SPEED);
  const early = chartLayout([[0, 0], [0.25, 40]], { seconds: 6, width: 560, height: 260, floor: paceTop(pace) });
  assert.ok(early.yTicks.at(-1).value >= 449, `the scale reaches #1's 449 (${early.yTicks.at(-1).value})`);
  const placed = paceLayout(pace, early);
  const coords = placed.line.split(' ').map((p) => p.split(',').map(Number));
  assert.equal(coords.length, 5);
  assert.deepEqual(coords[0], [early.plot.left, early.plot.bottom]);
  assert.deepEqual([placed.end.x, placed.end.y], coords.at(-1));
  assert.equal(placed.end.label, '449');
  assert.ok(coords.every(([x, y]) => x >= early.plot.left && x <= early.plot.right && y >= early.plot.top && y <= early.plot.bottom), 'inside the plot');
  // Without a floor, the scale fits only the run: #1 would leave the plot
  assert.ok(chartLayout([[0, 0], [0.25, 40]], { seconds: 6, width: 560, height: 260 }).yTicks.at(-1).value < 449);
  const mark = paceLayout({ mark: [6, 452] }, chartLayout([], { seconds: 6, width: 560, height: 260, floor: 452 }));
  assert.equal(mark.line, null);
  assert.equal(mark.end.x, 560 - CHART_MARGIN.right);
  assert.equal(mark.end.label, '452');
});

// ---- Where a run would stand (#150) ----

test('places read as ordinals, and an empty Hall of Fame makes you the first', () => {
  assert.deepEqual([1, 2, 3, 4, 10, 11, 12, 13, 21, 22, 23, 101, 111, 1001].map(ordinal),
    ['1st', '2nd', '3rd', '4th', '10th', '11th', '12th', '13th', '21st', '22nd', '23rd', '101st', '111th', '1,001st']);
  assert.equal(placeText(7, 42), "You'd place 7th of 42");
  assert.equal(placeText(1, 2), "You'd place 1st of 2");
  assert.equal(placeText(1, 1), "You'd be the first in the Hall of Fame");
});

test('the strip runs from the lowest score to the highest, the better to the right, with yours among them', () => {
  const strip = stripLayout([449, 412, 430], 440, { width: 520, height: 64 });
  assert.equal(strip.left, STRIP_MARGIN.left);
  assert.equal(strip.right, 520 - STRIP_MARGIN.right);
  assert.deepEqual([strip.low.label, strip.high.label], ['412', '449']);
  assert.deepEqual(strip.dots, [strip.right, strip.left, +(strip.left + (18 / 37) * (strip.right - strip.left)).toFixed(1)]);
  assert.ok(strip.mine > strip.dots[2] && strip.mine < strip.right);
  const beyond = stripLayout([449], 1000, { width: 520, height: 64 });
  assert.equal(beyond.mine, beyond.right, 'a score past every entry is at the right end');
  const same = stripLayout([449], 449, { width: 520, height: 64 });
  assert.equal(same.mine, same.dots[0], 'the same score: the same place');
  assert.ok(same.mine > same.left && same.mine < same.right, 'in the middle, not on an end');
  assert.deepEqual([same.low.label, same.high.label], ['449', '449']);
});
