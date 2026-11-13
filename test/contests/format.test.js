// SPDX-License-Identifier: Apache-2.0
//
// What the Contests panel says and draws (#77): the countdown, the chart, scores, endings,
// file names and statistics.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contestById } from '../../src/unbounded/contests.js';
import {
  countdownText, niceScale, chartLayout, CHART_MARGIN, speedHero, speedScoreText, speedEndingText, resultFileName, statsRows,
  rulesText, bytesText, extentText, verdictTitle, closingText,
} from '../../src/contests/format.js';

const SPEED = contestById('speed-1');

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
  assert.deepEqual([near.seconds, near.generation], [2, 210]);
  assert.equal(chartLayout([], { seconds: 6, width: 560, height: 260 }).end, null);
});

test("Speed's score and ending, in words", () => {
  assert.deepEqual(speedHero({ generations: 412, ms: null }, SPEED), { value: '412', unit: 'generations in 6 seconds' });
  assert.deepEqual(speedHero({ generations: 1000, ms: 4210 }, SPEED), { value: '1,000', unit: 'generations in 4.21 s, the ceiling' });
  assert.equal(speedScoreText({ generations: 412, ms: null }), '412 generations');
  assert.equal(speedScoreText({ generations: 1, ms: null }), '1 generation');
  assert.equal(speedScoreText({ generations: 1000, ms: 4210 }), '1,000 generations in 4.21 s');
  assert.equal(speedEndingText('deadline', SPEED), 'The 6 seconds ran out.');
  assert.match(speedEndingText('generation-limit', SPEED), /reached the ceiling, generation 1,000/);
  for (const reason of ['stopped', 'memory-limit', 'out-of-memory', 'error', 'cell-limit']) {
    assert.match(speedEndingText(reason, SPEED), /no score/, reason);
  }
});

test('the closing date is the earliest set, or to be announced', () => {
  assert.equal(SPEED.closes, null);
  assert.equal(closingText([SPEED]), 'Closing date to be announced');
  assert.equal(closingText([{ closes: '2027-03-31' }, { closes: null }, { closes: '2027-02-28' }]), 'Entries close 28 February 2027');
  assert.equal(closingText([SPEED], { short: true }), 'Closes TBD');
  assert.equal(closingText([{ closes: '2027-02-28' }], { short: true }), 'Closes 28 Feb 2027');
});

test("a result's file name gives the contest and the score", () => {
  assert.equal(resultFileName(SPEED, { generations: 412, ms: null }), 'speed-1-412.json');
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
