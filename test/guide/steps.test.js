// SPDX-License-Identifier: Apache-2.0
//
// The guide's steps, its sources and its animations (#159): every step cites sources that exist,
// every source is cited and complete, and every animation draws its frames without failing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STEPS, SOURCES, sourcesInOrder, citation } from '../../src/guide/steps.js';
import { SCENES } from '../../src/guide/scenes.js';
import { camera, visibleFaces, fitBox } from '../../src/guide/iso.js';
import { World } from '../../src/unbounded/world.js';
import { step as worldStep } from '../../src/unbounded/step.js';
import { presetById } from '../../src/explore/presets.js';
import { OSCILLATORS } from '../../src/guide/automata.js';

test('ten steps, each with a title, words, an animation, a description of it and its sources', () => {
  assert.equal(STEPS.length, 10);
  assert.equal(new Set(STEPS.map((s) => s.id)).size, STEPS.length, 'ids are unique');
  for (const step of STEPS) {
    assert.ok(step.title && step.body.length >= 1 && step.body.every((p) => p.length > 40), step.id);
    assert.ok(step.alt.length > 20, `${step.id} describes its animation`);
    assert.ok(SCENES[step.scene], `${step.id}'s animation, ${step.scene}, exists`);
    assert.ok(step.sources.length >= 1, `${step.id} cites a source`);
  }
  assert.deepEqual(STEPS.filter((s) => s.finale).map((s) => s.id), ['yours'], 'the last step, only, leads into the lab');
  assert.equal(STEPS.at(-1).finale, true);
});

test('every source a step cites exists, and every source is cited', () => {
  const cited = new Set(STEPS.flatMap((s) => s.sources));
  for (const key of cited) assert.ok(SOURCES[key], `${key} is in SOURCES`);
  for (const key of Object.keys(SOURCES)) assert.ok(cited.has(key), `${key} is cited by a step`);
  assert.deepEqual(new Set(sourcesInOrder()), cited);
  assert.equal(sourcesInOrder()[0], STEPS[0].sources[0], 'in the order the guide first cites them');
});

test('every source credits its authors, and a published one its year, venue and a secure link', () => {
  for (const [key, source] of Object.entries(SOURCES)) {
    assert.ok(source.authors && source.title && source.venue && source.short, key);
    if (source.year !== undefined) assert.ok(Number.isInteger(source.year) && source.year >= 1940 && source.year <= 2026, key);
    if (source.url !== undefined) assert.match(source.url, /^https:\/\/[^\s]+$/, key);
    if (/^(Physical Review|Nature|Journal|Reviews|Acta|Advances|Mathematical Medicine|Scientific American)/.test(source.venue)) {
      assert.match(source.url, /^https:\/\/doi\.org\/10\./, `${key}, a journal article, links its DOI`);
      assert.ok(source.year, `${key} has its year`);
    }
  }
  assert.equal(citation(SOURCES.btw1987), 'Per Bak, Chao Tang and Kurt Wiesenfeld (1987). Self-organized criticality: An explanation of the 1/f noise. Physical Review Letters 59, 381–384.');
  assert.equal(citation(SOURCES.rPentomino), 'LifeWiki contributors. R-pentomino. LifeWiki, the wiki of the Game of Life community.');
});

test('the words say what the tests of the automata check', () => {
  const text = (id) => STEPS.find((s) => s.id === id).body.join(' ');
  assert.match(text('zoo'), /1,103 generations, ending as 116 cells/);
  assert.match(text('gun'), /every 30 generations/);
  assert.match(text('rule30'), /256 possible rules/);
  assert.match(text('lab'), /B9,10\/S5–15/);
  assert.match(text('lab'), /17 on a face, 11 on an edge, 7 at a corner/);
});

/** A 2D context that does nothing, but fails on a drawing call that doesn't exist. */
function fakeContext() {
  const calls = { fills: 0, texts: [] };
  const noop = () => {};
  const ctx = {
    calls,
    fillRect: () => calls.fills++,
    fill: () => calls.fills++,
    fillText: (text) => calls.texts.push(text),
    // About as wide as Roboto Mono at 11px
    measureText: (text) => ({ width: text.length * 6.6 }),
    strokeRect: noop, beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, stroke: noop,
    rect: noop, clip: noop, save: noop, restore: noop, setTransform: noop,
  };
  return new Proxy(ctx, {
    get(target, prop) {
      if (prop in target) return target[prop];
      throw new Error(`The fake context has no ${String(prop)}`);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  });
}

test('every animation draws, at the start, later, after it loops and at its still frame', () => {
  for (const [name, make] of Object.entries(SCENES)) {
    const scene = make();
    assert.ok(Number.isFinite(scene.still) && scene.still >= 0, `${name} has a still frame`);
    for (const t of [0, 0.5, 3, scene.still, 60, 1, 0]) {
      for (const [w, h] of [[720, 460], [360, 220]]) {
        const ctx = fakeContext();
        scene.draw(ctx, w, h, t);
        assert.ok(ctx.calls.fills > 0, `${name} draws something at ${t}s, ${w} × ${h}`);
      }
    }
  }
});

test('step 9 labels each of Life’s oscillators with its name and period, beside Rule 110', () => {
  for (const [w, h] of [[720, 460], [360, 220]]) {
    const ctx = fakeContext();
    SCENES.rule110().draw(ctx, w, h, 2);
    for (const { name, period } of OSCILLATORS) {
      assert.ok(ctx.calls.texts.includes(name) && ctx.calls.texts.includes(`period ${period}`), `${name}, at ${w} × ${h}`);
    }
    assert.ok(ctx.calls.texts.some((t) => t.startsWith('Rule 110 · ')), ctx.calls.texts.join(' | '));
  }
});

test('the R-pentomino and the gun say where they are; the ship is run by the lab’s engine', () => {
  const ctx = fakeContext();
  SCENES.zoo().draw(ctx, 720, 460, 1103 / 50 + 1);
  assert.ok(ctx.calls.texts.some((t) => t === 'R-pentomino · settled at generation 1,103 · 116 cells'), ctx.calls.texts.join(' | '));
  const lab = fakeContext();
  SCENES.lab3d().draw(lab, 720, 460, 24 / 3 + 2.5 + 60 / 6);
  assert.ok(lab.calls.texts.some((t) => /^A ship · B4\/S6 · generation 60 · its front at x = \d+/.test(t)), lab.calls.texts.join(' | '));
});

const n = (value) => value.toLocaleString('en');

/** The cells of a lab preset's layer y = 0 at a generation, counted from all its cells. */
function layerCount(id, generation) {
  const preset = presetById(id);
  const world = new World({ rules: preset.rules, slabBytes: 1 << 20 });
  const cells = [];
  for (let i = 0; i < preset.cells.length; i += 3) cells.push([preset.cells[i], preset.cells[i + 1], preset.cells[i + 2]]);
  world.setCells(cells);
  for (let g = 0; g < generation; g++) worldStep(world);
  const all = world.cells();
  let count = 0;
  for (let i = 1; i < all.length; i += 3) if (all[i] === 0) count++;
  return count;
}

test('step 7’s cross-section holds exactly the layer y = 0 of the world beside it, wide or narrow', () => {
  const cubeCount = layerCount('cube10', 24);
  const shipCount = layerCount('ship-p1', 60);
  assert.equal(shipCount, 4, 'the ship’s middle layer');
  for (const [w, h] of [[720, 460], [360, 520]]) {
    const cube = fakeContext();
    SCENES.lab3d().draw(cube, w, h, SCENES.lab3d().still);
    assert.ok(cube.calls.texts.some((t) => t.endsWith(`y = 0 · ${n(cubeCount)} cells`)), cube.calls.texts.join(' | '));
    const ship = fakeContext();
    SCENES.lab3d().draw(ship, w, h, 24 / 3 + 2.5 + 60 / 6);
    assert.ok(ship.calls.texts.some((t) => t.endsWith('y = 0 · 4 cells')), ship.calls.texts.join(' | '));
  }
});

test('the 3D camera: straight down shows only tops; tilted, three faces, and a box fits', () => {
  assert.deepEqual(visibleFaces(camera(0, Math.PI / 2)).map((f) => f.normal), [[0, 1, 0]]);
  const cam = camera(0.6, 0.55);
  assert.equal(visibleFaces(cam).length, 3);
  assert.ok(cam.depth(0, 5, 0) > cam.depth(0, 0, 0), 'looking down, higher is nearer');
  const fit = fitBox({ min: [-1, -1, -1], max: [1, 1, 1] }, cam, 400, 300, 0.8);
  for (const x of [-1.5, 1.5]) {
    for (const y of [-1.5, 1.5]) {
      for (const z of [-1.5, 1.5]) {
        const [px, py] = cam.project(x, y, z);
        const sx = fit.cx + px * fit.scale, sy = fit.cy + py * fit.scale;
        assert.ok(sx >= 0 && sx <= 400 && sy >= 0 && sy <= 300, `corner ${x},${y},${z} is on screen`);
      }
    }
  }
});
