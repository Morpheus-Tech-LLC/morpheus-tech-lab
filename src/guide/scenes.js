// SPDX-License-Identifier: Apache-2.0
//
// The guide's animations (#159), one per step, drawn on a 2D canvas. Each scene runs the rule its
// step describes, from automata.js or, for the lab's own 3D rules, the lab's unbounded engine.
// A scene is { draw(ctx, w, h, t), still }: draw() paints the frame at t seconds after the step
// opened, in CSS pixels, stepping its automaton as far as t needs, so a frame depends only on t;
// `still` is the moment shown on its own when the visitor prefers reduced motion.

import {
  seededRandom, ruleCases, elementaryStep, Life, parseRle, PATTERNS, torusLifeStep, torusNeighbours,
  hppStep, particles, trafficStep, placeCars, Sandpile, scalesStep, LAB_RULE, CASES_3D, OSCILLATORS,
} from './automata.js';
import { camera, drawCubes, fitBox } from './iso.js';
import { World } from '../unbounded/world.js';
import { step as worldStep } from '../unbounded/step.js';
import { presetById } from '../explore/presets.js';

const COLORS = {
  bg: '#0b0e13',
  grid: 'rgba(180, 200, 255, 0.07)',
  live: '#4da3ff',
  liveRGB: [77, 163, 255],
  accent: '#ffa200',
  accentRGB: [255, 162, 0],
  text: '#d8e2f0',
  dim: '#8492a8',
  panel: 'rgba(255, 255, 255, 0.03)',
};
const FONT = '"Roboto Mono", ui-monospace, monospace';

function clear(ctx, w, h) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);
}

function label(ctx, text, x, y, { align = 'left', color = COLORS.dim, size = 12, weight = 400 } = {}) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

const n = (value) => value.toLocaleString('en');
const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

/**
 * Lays a grid of cols × rows square cells into a rectangle, centred.
 * @returns {{size: number, x0: number, y0: number}} the cell's size and the grid's top left
 */
function gridLayout(rect, cols, rows) {
  const size = Math.max(1, Math.min(rect.w / cols, rect.h / rows));
  return { size, x0: rect.x + (rect.w - cols * size) / 2, y0: rect.y + (rect.h - rows * size) / 2 };
}

function drawCell(ctx, layout, x, y, color, gap = 0.12) {
  const { size, x0, y0 } = layout;
  const g = size > 4 ? size * gap : 0;
  ctx.fillStyle = color;
  ctx.fillRect(x0 + x * size + g / 2, y0 + y * size + g / 2, size - g, size - g);
}

function drawGridLines(ctx, layout, cols, rows) {
  const { size, x0, y0 } = layout;
  if (size < 6) return;
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= cols; i++) {
    ctx.moveTo(x0 + i * size + 0.5, y0);
    ctx.lineTo(x0 + i * size + 0.5, y0 + rows * size);
  }
  for (let j = 0; j <= rows; j++) {
    ctx.moveTo(x0, y0 + j * size + 0.5);
    ctx.lineTo(x0 + cols * size, y0 + j * size + 0.5);
  }
  ctx.stroke();
}

/** Keeps an automaton at the generation a frame needs: steps forward, or starts again. */
function stepper(reset, advance) {
  let sim = reset();
  return (target) => {
    if (target < sim.generation) sim = reset();
    while (sim.generation < target) advance(sim);
    return sim;
  };
}

// ---- 1. What is a cellular automaton? ----

function intro() {
  const W = 36, H = 22, TICK = 0.8, RUN = 40;
  const fx = Math.floor(W / 2), fy = Math.floor(H / 2);
  const at = stepper(() => {
    const random = seededRandom(7);
    const grid = new Uint8Array(W * H);
    for (let i = 0; i < grid.length; i++) grid[i] = random() < 0.32 ? 1 : 0;
    return { grid, generation: 0 };
  }, (sim) => {
    sim.grid = torusLifeStep(sim.grid, W, H);
    sim.generation++;
  });
  return {
    still: 2 * TICK,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const gen = Math.floor(t / TICK) % RUN;
      const { grid } = at(gen);
      const layout = gridLayout({ x: 16, y: 14, w: w - 32, h: h - 50 }, W, H);
      drawGridLines(ctx, layout, W, H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) if (grid[y * W + x]) drawCell(ctx, layout, x, y, COLORS.live);
      }
      // One cell, its neighbours outlined, and what the rule makes of it
      const { size, x0, y0 } = layout;
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(x0 + (fx - 1) * size, y0 + (fy - 1) * size, 3 * size, 3 * size);
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x0 + fx * size + 2, y0 + fy * size + 2, size - 4, size - 4);
      const count = torusNeighbours(grid, W, H, fx, fy);
      const alive = grid[fy * W + fx];
      const next = count === 3 || (alive && count === 2);
      const fate = alive ? (next ? 'stays alive' : 'dies') : (next ? 'is born' : 'stays empty');
      label(ctx, `Generation ${gen} · the outlined cell has ${count} live neighbour${count === 1 ? '' : 's'}, so it ${fate}`,
        w / 2, h - 16, { align: 'center', color: COLORS.text });
    },
  };
}

// ---- 2. Rule 30 ----

function rule30() {
  const ROWS = 52, WIDTH = 2 * ROWS + 1, RATE = 14, HOLD = 3;
  const rows = [];
  let row = new Uint8Array(WIDTH);
  row[ROWS] = 1;
  for (let i = 0; i < ROWS; i++) {
    rows.push(row);
    row = elementaryStep(row, 30);
  }
  const cases = ruleCases(30);
  return {
    still: ROWS / RATE + 1,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const cycle = ROWS / RATE + HOLD;
      const shown = Math.min(ROWS, Math.floor((t % cycle) * RATE) + 1);
      // The rule: eight neighbourhoods and what each gives
      const strip = Math.min(h * 0.2, 64);
      const caseW = Math.min((w - 32) / 8, 74);
      const cell = Math.min(caseW / 4, strip / 2.6);
      const left = (w - caseW * 8) / 2;
      cases.forEach((c, i) => {
        const cx = left + i * caseW + caseW / 2;
        [c.left, c.centre, c.right].forEach((v, j) => {
          ctx.fillStyle = v ? COLORS.text : 'rgba(255,255,255,0.08)';
          ctx.fillRect(cx - 1.5 * cell + j * cell + 1, 10, cell - 2, cell - 2);
        });
        ctx.fillStyle = c.next ? COLORS.accent : 'rgba(255,255,255,0.08)';
        ctx.fillRect(cx - cell / 2 + 1, 10 + cell * 1.15, cell - 2, cell - 2);
      });
      label(ctx, 'Rule 30 = 00011110 in binary: the bottom cell of each case, read left to right', w / 2, 10 + cell * 2.15 + 14,
        { align: 'center', size: 11 });
      const top = 10 + cell * 2.15 + 26;
      const layout = gridLayout({ x: 16, y: top, w: w - 32, h: h - top - 10 }, WIDTH, ROWS);
      for (let y = 0; y < shown; y++) {
        const r = rows[y];
        const color = y === shown - 1 && shown < ROWS ? COLORS.accent : COLORS.live;
        for (let x = 0; x < WIDTH; x++) if (r[x]) drawCell(ctx, layout, x, y, color, 0.06);
      }
    },
  };
}

// ---- 3. Conway's rules, one neighbourhood at a time ----

const RULE_CASES = [
  { alive: 1, around: [0, 2], text: '2 live neighbours: it survives' },
  { alive: 0, around: [0, 2, 6], text: '3 live neighbours: a cell is born' },
  { alive: 1, around: [5], text: '1 live neighbour: it dies of loneliness' },
  { alive: 1, around: [0, 1, 3, 7], text: '4 live neighbours: it dies of overcrowding' },
];
// The eight neighbours, clockwise from the top left, as [column, row] in the 3 × 3 block
const AROUND = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];

function rules() {
  const PER = 4;
  return {
    still: 3,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const which = RULE_CASES[Math.floor(t / PER) % RULE_CASES.length];
      const u = t % PER;
      const size = Math.min((w - 120) / 6.5, (h - 70) / 3);
      const top = (h - 3 * size) / 2 - 12;
      const leftX = w / 2 - size * 3.6, rightX = w / 2 + size * 0.6;
      const counted = Math.min(which.around.length, Math.floor(u / 0.45));
      const block = (x0, faded, centreAlive, showCount) => {
        for (let j = 0; j < 3; j++) {
          for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = COLORS.grid;
            ctx.lineWidth = 1;
            ctx.strokeRect(x0 + i * size + 0.5, top + j * size + 0.5, size, size);
          }
        }
        which.around.forEach((k, idx) => {
          const [i, j] = AROUND[k];
          ctx.globalAlpha = faded ? 0.25 : 1;
          ctx.fillStyle = COLORS.live;
          ctx.fillRect(x0 + i * size + 4, top + j * size + 4, size - 8, size - 8);
          ctx.globalAlpha = 1;
          if (showCount && idx < counted) {
            label(ctx, String(idx + 1), x0 + i * size + size / 2, top + j * size + size / 2 + 7,
              { align: 'center', color: '#0b0e13', size: Math.round(size * 0.4), weight: 700 });
          }
        });
        if (centreAlive) {
          ctx.fillStyle = COLORS.accent;
          ctx.fillRect(x0 + size + 4, top + size + 4, size - 8, size - 8);
        }
        ctx.strokeStyle = COLORS.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(x0 + size + 1, top + size + 1, size - 2, size - 2);
      };
      label(ctx, 'Now', leftX + 1.5 * size, top - 10, { align: 'center', color: COLORS.text });
      block(leftX, false, which.alive, true);
      const reveal = u >= 2;
      const next = which.around.length === 3 || (which.alive && which.around.length === 2);
      label(ctx, 'Next generation', rightX + 1.5 * size, top - 10, { align: 'center', color: COLORS.text });
      block(rightX, true, reveal && next, false);
      if (!reveal) {
        label(ctx, '?', rightX + 1.5 * size, top + 1.5 * size + size * 0.17, { align: 'center', color: COLORS.accent, size: Math.round(size * 0.5), weight: 700 });
      }
      {
        ctx.strokeStyle = COLORS.dim;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX + 3 * size + 12, top + 1.5 * size);
        ctx.lineTo(rightX - 12, top + 1.5 * size);
        ctx.lineTo(rightX - 20, top + 1.5 * size - 6);
        ctx.moveTo(rightX - 12, top + 1.5 * size);
        ctx.lineTo(rightX - 20, top + 1.5 * size + 6);
        ctx.stroke();
      }
      if (reveal) label(ctx, which.text, w / 2, top + 3 * size + 34, { align: 'center', color: COLORS.text, size: 14 });
      else label(ctx, `Counting live neighbours: ${counted}`, w / 2, top + 3 * size + 34, { align: 'center', size: 14 });
    },
  };
}

// ---- 4. What lives in Life ----

function lifePanel(ctx, rect, cells, view, color = COLORS.live) {
  const cols = view.maxX - view.minX + 1, rows = view.maxY - view.minY + 1;
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  const layout = gridLayout({ x: rect.x + 6, y: rect.y + 22, w: rect.w - 12, h: rect.h - 28 }, cols, rows);
  drawGridLines(ctx, layout, cols, rows);
  for (const [x, y] of cells) {
    if (x >= view.minX && x <= view.maxX && y >= view.minY && y <= view.maxY) {
      drawCell(ctx, layout, x - view.minX, y - view.minY, color);
    }
  }
}

function zoo() {
  const block = parseRle(PATTERNS.block);
  const blinker = new Life(parseRle(PATTERNS.blinker).map(([x, y]) => [x + 1, y + 2]));
  const blinkerAt = stepper(() => new Life(blinker.cells()), (s) => s.step());
  const gliderAt = stepper(() => new Life(parseRle(PATTERNS.glider)), (s) => s.step());
  const rAt = stepper(() => new Life(parseRle(PATTERNS.rPentomino)), (s) => s.step());
  const SETTLED = 1103, RATE = 50, HOLD = 4;
  const R_VIEW = { minX: -46, minY: -36, maxX: 56, maxY: 42 };
  return {
    still: SETTLED / RATE + 1,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const pad = 10;
      const narrow = w < 560;
      const colW = narrow ? (w - 4 * pad) / 3 : Math.min(w * 0.3, 200);
      const smallH = narrow ? Math.min(h * 0.3, 120) : (h - 4 * pad) / 3;
      const rect = (i) => (narrow
        ? { x: pad + i * (colW + pad), y: pad, w: colW, h: smallH }
        : { x: pad, y: pad + i * (smallH + pad), w: colW, h: smallH });
      const small = { minX: 0, minY: 0, maxX: 5, maxY: 5 };
      lifePanel(ctx, rect(0), block.map(([x, y]) => [x + 2, y + 2]), small);
      lifePanel(ctx, rect(1), blinkerAt(Math.floor(t * 2) % 2).cells(), small);
      const g = Math.floor(t * 4) % 20;
      const glider = gliderAt(g);
      lifePanel(ctx, rect(2), glider.cells(), { minX: 0, minY: 0, maxX: 7, maxY: 7 });
      const names = narrow ? ['Block', 'Blinker', 'Glider'] : ['Still life: block', 'Oscillator: blinker', 'Spaceship: glider'];
      names.forEach((text, i) => {
        const r = rect(i);
        label(ctx, text, r.x + 6, r.y + 15, { size: 11, color: COLORS.text });
      });
      // The R-pentomino, run to where it settles
      const big = narrow
        ? { x: pad, y: smallH + 2 * pad, w: w - 2 * pad, h: h - smallH - 3 * pad }
        : { x: colW + 2 * pad, y: pad, w: w - colW - 3 * pad, h: h - 2 * pad };
      const cycle = SETTLED / RATE + HOLD;
      const gen = Math.min(SETTLED, Math.floor((t % cycle) * RATE));
      const r = rAt(gen);
      lifePanel(ctx, big, r.cells(), R_VIEW, gen === SETTLED ? COLORS.accent : COLORS.live);
      const text = gen === SETTLED
        ? `R-pentomino · settled at generation ${n(SETTLED)} · ${n(r.population)} cells`
        : `R-pentomino · generation ${n(gen)} · ${n(r.population)} cells`;
      label(ctx, text, big.x + 6, big.y + 15, { size: 11, color: COLORS.text });
    },
  };
}

// ---- 5. The glider gun ----

function gun() {
  const RATE = 15, RUN = 360;
  const VIEW = { minX: -2, minY: -2, maxX: 70, maxY: 44 };
  const at = stepper(() => new Life(parseRle(PATTERNS.gosperGun)), (s) => {
    s.step();
    s.clip(-10, -10, VIEW.maxX + 6, VIEW.maxY + 6); // gliders that have flown off the picture
  });
  return {
    still: 200 / RATE,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const gen = Math.floor(t * RATE) % RUN;
      const life = at(gen);
      lifePanel(ctx, { x: 10, y: 10, w: w - 20, h: h - 20 }, life.cells(), VIEW);
      label(ctx, `Gosper’s glider gun · generation ${n(gen)} · gliders fired: ${Math.floor(gen / 30)}`, 16, 25,
        { size: 11, color: COLORS.text });
    },
  };
}

// ---- 6. From 8 neighbours to 26, then the lab's rule at work ----

function drawNeighbourhood(ctx, w, h, u) {
  const tilt = ease((u - 2) / 2);
  const rise = ease((u - 4.5) / 2);
  const yaw = 0.55 * tilt + Math.max(0, u - 6.5) * 0.35;
  const pitch = Math.PI / 2 - tilt * (Math.PI / 2 - 0.5);
  const cam = camera(yaw, pitch);
  const cubes = [];
  for (let y = -1; y <= 1; y++) {
    if (y && !rise) continue;
    for (let z = -1; z <= 1; z++) {
      for (let x = -1; x <= 1; x++) {
        const centre = !x && !y && !z;
        cubes.push({
          x, y: y * (1 + 1.2 * (1 - rise)), z,
          color: centre ? COLORS.accentRGB : COLORS.liveRGB,
          alpha: y ? rise : 1,
        });
      }
    }
  }
  const fit = fitBox({ min: [-1, -1, -1], max: [1, 1, 1] }, cam, w, h - 40, 0.62);
  drawCubes(ctx, cubes, cam, { ...fit, cy: fit.cy + 4, size: 0.8 });
  const count = 8 + Math.round(18 * rise);
  const text = u < 2 ? 'In 2D, a cell (orange) has 8 neighbours'
    : rise < 1 ? (u < 4.5 ? 'Turn the grid into space…' : `…and add a layer above and below: ${count} neighbours`)
      : 'In 3D, a cell has 26 neighbours';
  label(ctx, text, w / 2, h - 16, { align: 'center', color: COLORS.text, size: 13 });
}

/**
 * One of CASES_3D, as step 3 shows Conway's rule: the cell and its 26 neighbours spread apart,
 * so every layer shows, its live neighbours counted one by one, then the next generation.
 */
function drawRuleCase(ctx, w, h, which, u) {
  const REVEAL = 3.3;
  // Counted in at most 2.7 seconds, however many there are
  const COUNT = Math.min(0.3, 2.7 / which.live.length);
  const counted = Math.min(which.live.length, Math.floor(u / COUNT));
  const reveal = u >= REVEAL;
  const count = which.live.length;
  const next = which.alive ? LAB_RULE.survival.includes(count) : LAB_RULE.birth.includes(count);
  const cam = camera(0.7 + u * 0.12, 0.5);
  const GAP = 1.55;
  const isLive = (x, y, z) => which.live.some(([a, b, c]) => a === x && b === y && c === z);
  const half = w / 2;
  const blocks = [{ x: 0, now: true }, { x: half, now: false }];
  for (const block of blocks) {
    const fit = fitBox({ min: [-GAP - 0.5, -GAP - 0.5, -GAP - 0.5], max: [GAP + 0.5, GAP + 0.5, GAP + 0.5] }, cam, half, h - 66, 0.78);
    const at = { ...fit, cx: fit.cx + block.x, cy: fit.cy + 28 };
    const cubes = [];
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        for (let x = -1; x <= 1; x++) {
          const centre = !x && !y && !z;
          const pos = { x: x * GAP, y: y * GAP, z: z * GAP };
          if (centre) {
            const alive = block.now ? which.alive : reveal && next;
            cubes.push({ ...pos, color: COLORS.accentRGB, alpha: alive ? 1 : 0.16 });
          } else if (isLive(x, y, z)) {
            cubes.push({ ...pos, color: COLORS.liveRGB, alpha: block.now ? 1 : 0.3 });
          } else {
            cubes.push({ ...pos, color: COLORS.liveRGB, alpha: 0.06 });
          }
        }
      }
    }
    drawCubes(ctx, cubes, cam, { ...at, size: 0.82 });
    if (block.now) {
      // Each live neighbour, numbered as it is counted
      which.live.slice(0, counted).forEach(([x, y, z], k) => {
        const [px, py] = cam.project(x * GAP, y * GAP, z * GAP);
        label(ctx, String(k + 1), at.cx + px * at.scale, at.cy + py * at.scale + 5,
          { align: 'center', color: '#0b0e13', size: Math.max(11, Math.round(at.scale * 0.42)), weight: 700 });
      });
    } else if (!reveal) {
      const [px, py] = cam.project(0, 0, 0);
      label(ctx, '?', at.cx + px * at.scale, at.cy + py * at.scale + 7,
        { align: 'center', color: COLORS.accent, size: Math.max(14, Math.round(at.scale * 0.7)), weight: 700 });
    }
    label(ctx, block.now ? 'Now' : 'Next generation', block.x + half / 2, 18, { align: 'center', color: COLORS.text });
  }
  // The arrow from now to next
  ctx.strokeStyle = COLORS.dim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(half - 18, h / 2);
  ctx.lineTo(half + 18, h / 2);
  ctx.lineTo(half + 11, h / 2 - 6);
  ctx.moveTo(half + 18, h / 2);
  ctx.lineTo(half + 11, h / 2 + 6);
  ctx.stroke();
  const text = reveal ? `${which.text}${w < 520 ? '' : ' · B9,10/S5–15'}` : `Counting live neighbours: ${counted} of 26`;
  label(ctx, text, w / 2, h - 16, { align: 'center', color: reveal ? COLORS.text : COLORS.dim, size: 13 });
}

function neighbourhood3d() {
  // The neighbourhood grows for NEIGHBOURS seconds; then the lab's rule decides four cells, PER seconds each
  const NEIGHBOURS = 9, PER = 5;
  const RULES = PER * CASES_3D.length;
  return {
    still: 8,
    /** Its two parts, in its own time, so the video can show each while its words are on screen. */
    parts: [{ name: 'neighbours', start: 0, span: NEIGHBOURS }, { name: 'rule', start: NEIGHBOURS, span: RULES }],
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const u = t % (NEIGHBOURS + RULES);
      if (u < NEIGHBOURS) drawNeighbourhood(ctx, w, h, u);
      else drawRuleCase(ctx, w, h, CASES_3D[Math.floor((u - NEIGHBOURS) / PER)], (u - NEIGHBOURS) % PER);
    },
  };
}

// ---- 7. The lab's own rules, on the lab's own engine ----

function worldOf(preset) {
  const world = new World({ rules: preset.rules, slabBytes: 1 << 20 });
  const cells = [];
  for (let i = 0; i < preset.cells.length; i += 3) cells.push([preset.cells[i], preset.cells[i + 1], preset.cells[i + 2]]);
  world.setCells(cells);
  return world;
}

/** The cells a viewer can see: any with a face open to empty space. */
function surfaceCubes(world, color) {
  const flat = world.cells();
  const cubes = [];
  for (let i = 0; i < flat.length; i += 3) {
    const x = flat[i], y = flat[i + 1], z = flat[i + 2];
    if (world.has(x + 1, y, z) && world.has(x - 1, y, z) && world.has(x, y + 1, z) && world.has(x, y - 1, z)
      && world.has(x, y, z + 1) && world.has(x, y, z - 1)) continue;
    cubes.push({ x, y, z, color });
  }
  return cubes;
}

/** The layer the cross-section shows: y = 0, the middle of Cube10 and of the ship. */
const LAYER = 0;

/** Room kept clear at the stage's bottom right for its Pause button, in CSS pixels. */
const PAUSE = { w: 72, h: 30 };

/**
 * Splits a stage into the 3D view and the cross-section: side by side when it is wide, the
 * cross-section below when it is tall, or, with `strip`, always below, as a band `cols` ×
 * `stripRows` cells with a ruler under it. The cross-section stays clear of the Pause button.
 */
function splitStage(w, h, { strip = false, cols = 1, stripRows = 1 } = {}) {
  const area = h - 30;
  if (strip) {
    const width = w - 8 - PAUSE.w;
    const below = Math.round(Math.min(area * 0.4, 28 + ((width - 12) / cols) * stripRows) + 16);
    return { view: { x: 0, y: 0, w, h: area - below }, slice: { x: 8, y: area - below, w: width, h: below - 16 } };
  }
  if (w >= area * 1.25) {
    const side = Math.round(Math.min(w * 0.42, area + 28));
    return { view: { x: 0, y: 0, w: w - side, h: area }, slice: { x: w - side, y: 8, w: side - 12, h: area - 8 - PAUSE.h } };
  }
  const below = Math.round(area * 0.46);
  return { view: { x: 0, y: 0, w, h: area - below }, slice: { x: 8, y: area - below, w: w - 16 - PAUSE.w, h: below } };
}

/**
 * Draws a world's cells as cubes with the layer y = LAYER marked: the cells below it, then a
 * translucent plane under the layer, then the layer's cells (coloured `mark`) and those above.
 * Looking down, a horizontal plane hides what is below it and is hidden by what is above, so
 * painting in that order is right.
 */
function drawLayered(ctx, world, cam, fit, box, color, mark) {
  const cubes = surfaceCubes(world, color);
  const below = cubes.filter((c) => c.y < LAYER);
  const above = cubes.filter((c) => c.y >= LAYER).map((c) => (c.y === LAYER ? { ...c, color: mark } : c));
  drawCubes(ctx, below, cam, { ...fit, size: 0.9 });
  const y = LAYER - 0.5;
  const corners = [[box.min[0] - 1.5, box.min[2] - 1.5], [box.max[0] + 1.5, box.min[2] - 1.5],
    [box.max[0] + 1.5, box.max[2] + 1.5], [box.min[0] - 1.5, box.max[2] + 1.5]];
  ctx.beginPath();
  corners.forEach(([x, z], i) => {
    const [px, py] = cam.project(x, y, z);
    if (i) ctx.lineTo(fit.cx + px * fit.scale, fit.cy + py * fit.scale);
    else ctx.moveTo(fit.cx + px * fit.scale, fit.cy + py * fit.scale);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 162, 0, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 162, 0, 0.55)';
  ctx.lineWidth = 1;
  ctx.stroke();
  drawCubes(ctx, above, cam, { ...fit, size: 0.9 });
}

/**
 * The cross-section: the world's layer y = LAYER as a flat grid, x across and z down.
 * @returns the grid's layout, as gridLayout gives it
 */
function drawSlice(ctx, rect, world, view) {
  const flat = world.cellsInPlane(1, LAYER);
  const cells = [];
  for (let i = 0; i < flat.length; i += 3) cells.push([flat[i], flat[i + 2]]);
  lifePanel(ctx, rect, cells, view, COLORS.accent);
  const count = `${n(cells.length)} ${cells.length === 1 ? 'cell' : 'cells'}`;
  const title = rect.w < 220 ? `y = ${LAYER} · ${count}` : `Cross-section at y = ${LAYER} · ${count}`;
  label(ctx, title, rect.x + 8, rect.y + 15, { size: 11, color: COLORS.text });
  // As lifePanel lays it out
  const cols = view.maxX - view.minX + 1, rows = view.maxY - view.minY + 1;
  return gridLayout({ x: rect.x + 6, y: rect.y + 22, w: rect.w - 12, h: rect.h - 28 }, cols, rows);
}

function cubeScene({ last = 24, rate = 3, hold = 2.5, spin = 0.3 } = {}) {
  const preset = presetById('cube10');
  const at = stepper(() => worldOf(preset), (world) => worldStep(world));
  const end = at(last);
  const box = end.extent();
  return {
    span: last / rate + hold,
    /** With `slice`, the layer y = 0 is marked in the cubes and drawn flat beside them. */
    draw(ctx, w, h, t, { caption = true, slice = false } = {}) {
      const gen = Math.min(last, Math.floor(t * rate));
      const world = at(gen);
      const cam = camera(0.6 + t * spin, 0.55);
      if (!slice) {
        const fit = fitBox(box, cam, w, h - 30, 0.8);
        drawCubes(ctx, surfaceCubes(world, COLORS.liveRGB), cam, { ...fit, size: 0.9 });
      } else {
        const { view, slice: rect } = splitStage(w, h);
        const fit = fitBox(box, cam, view.w, view.h, 0.84);
        drawLayered(ctx, world, cam, { ...fit, cx: fit.cx + view.x, cy: fit.cy + view.y }, box,
          COLORS.liveRGB, COLORS.accentRGB);
        drawSlice(ctx, rect, world, { minX: box.min[0], maxX: box.max[0], minY: box.min[2], maxY: box.max[2] });
      }
      if (caption) {
        const text = w < 520
          ? `Cube10 · B9,10/S5–15 · gen ${gen} · ${n(world.liveCells)} cells`
          : `Cube10 · the lab’s default rules, B9,10/S5–15 · generation ${gen} · ${n(world.liveCells)} cells`;
        label(ctx, text, w / 2, h - 14, { align: 'center', color: COLORS.text });
      }
    },
  };
}

function lab3d() {
  const cube = cubeScene();
  const ship = presetById('ship-p1');
  const shipAt = stepper(() => worldOf(ship), (world) => worldStep(world));
  const LAST = 60, RATE = 6, HOLD = 2;
  const shipSpan = LAST / RATE + HOLD;
  // The ship's path, in cells: x from -2 to LAST + 2, z from -2 to 3
  const path = { min: [-2, -2, -2], max: [LAST + 2, 3, 3] };
  const cols = path.max[0] - path.min[0] + 1, rows = path.max[2] - path.min[2] + 1;
  return {
    still: 9,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const u = t % (cube.span + shipSpan);
      if (u < cube.span) {
        cube.draw(ctx, w, h, u, { slice: true });
        return;
      }
      const gen = Math.min(LAST, Math.floor((u - cube.span) * RATE));
      const world = shipAt(gen);
      const { view, slice: rect } = splitStage(w, h, { strip: true, cols, stripRows: rows });
      const cam = camera(-0.45, 0.5);
      const fit = fitBox(path, cam, view.w, view.h, 0.9);
      // A ruler along the ship's path, every 10 cells
      for (let x = 0; x <= LAST; x += 10) {
        const [px, py] = cam.project(x, -2.5, 0);
        label(ctx, String(x), fit.cx + px * fit.scale, fit.cy + py * fit.scale + 14, { align: 'center', size: 10 });
        ctx.fillStyle = COLORS.dim;
        ctx.fillRect(fit.cx + px * fit.scale - 1, fit.cy + py * fit.scale - 2, 2, 6);
      }
      drawLayered(ctx, world, cam, fit, path, COLORS.liveRGB, COLORS.accentRGB);
      const grid = drawSlice(ctx, rect, world, { minX: path.min[0], maxX: path.max[0], minY: path.min[2], maxY: path.max[2] });
      // The same ruler under the strip
      for (let x = 0; x <= LAST; x += 10) {
        const sx = grid.x0 + (x - path.min[0] + 0.5) * grid.size;
        label(ctx, String(x), sx, grid.y0 + rows * grid.size + 13, { align: 'center', size: 10 });
      }
      const where = world.extent();
      const front = where ? where.max[0] : '–';
      label(ctx, w < 520 ? `A ship · B4/S6 · gen ${gen} · front at x = ${front}`
        : `A ship · B4/S6 · generation ${gen} · its front at x = ${front}: one cell a generation, speed c`,
      w / 2, h - 14, { align: 'center', color: COLORS.text });
    },
  };
}

function finale() {
  const cube = cubeScene({ last: 24, rate: 2, hold: 4, spin: 0.18 });
  return {
    still: 14,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      cube.draw(ctx, w, h, t % cube.span);
    },
  };
}

// ---- 8. What automata have shown us: four at once ----

function scalesPanel() {
  const W = 20, H = 14, TICK = 0.4, RUN = 45;
  const at = stepper(() => {
    const random = seededRandom(11);
    const scales = new Uint8Array(W * H);
    for (let i = 0; i < scales.length; i++) scales[i] = random() < 0.5 ? 1 : 0;
    return { scales, random, generation: 0 };
  }, (sim) => {
    sim.scales = scalesStep(sim.scales, W, H, sim.random);
    sim.generation++;
  });
  return (ctx, rect, t) => {
    const { scales } = at(Math.floor(t / TICK) % RUN);
    const r = Math.min(rect.w / (W + 0.5) / Math.sqrt(3), rect.h / (H * 1.5 + 0.5));
    const hw = Math.sqrt(3) * r;
    const x0 = rect.x + (rect.w - hw * (W + 0.5)) / 2 + hw / 2, y0 = rect.y + (rect.h - r * (1.5 * H + 0.5)) / 2 + r;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cx = x0 + x * hw + (y & 1 ? hw / 2 : 0), cy = y0 + y * 1.5 * r;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = Math.PI / 6 + (k * Math.PI) / 3;
          const px = cx + r * 0.92 * Math.cos(a), py = cy + r * 0.92 * Math.sin(a);
          if (k) ctx.lineTo(px, py);
          else ctx.moveTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = scales[y * W + x] ? '#07090c' : '#3fae67';
        ctx.fill();
        ctx.strokeStyle = 'rgba(160, 180, 200, 0.28)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };
}

function gasPanel() {
  const W = 96, H = 60, RATE = 9, RUN = 110, BLOCK = 2;
  const at = stepper(() => {
    const random = seededRandom(5);
    const cells = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const dense = Math.abs(x - W / 2) < 9 && Math.abs(y - H / 2) < 9;
        for (const bit of [1, 2, 4, 8]) if (random() < (dense ? 0.9 : 0.05)) cells[y * W + x] |= bit;
      }
    }
    return { cells, generation: 0 };
  }, (sim) => {
    sim.cells = hppStep(sim.cells, W, H);
    sim.generation++;
  });
  return (ctx, rect, t) => {
    const { cells } = at(Math.floor(t * RATE) % RUN);
    const cols = W / BLOCK, rows = H / BLOCK;
    const layout = gridLayout(rect, cols, rows);
    for (let by = 0; by < rows; by++) {
      for (let bx = 0; bx < cols; bx++) {
        let count = 0;
        for (let y = 0; y < BLOCK; y++) {
          for (let x = 0; x < BLOCK; x++) count += particles(cells[(by * BLOCK + y) * W + bx * BLOCK + x]);
        }
        const d = Math.min(1, count / (BLOCK * BLOCK * 1.6));
        ctx.fillStyle = `rgba(77, 163, 255, ${0.04 + 0.96 * d})`;
        ctx.fillRect(layout.x0 + bx * layout.size, layout.y0 + by * layout.size, layout.size, layout.size);
      }
    }
  };
}

function trafficPanel() {
  const L = 120, CARS = 38, RATE = 12, OPTIONS = { vmax: 5, p: 0.25 };
  const history = [];
  let cars = null, random = null, step = -1;
  const advance = () => {
    cars = trafficStep(cars, L, { ...OPTIONS, random });
    step++;
    history.push(cars);
    if (history.length > 400) history.shift();
  };
  const reset = () => {
    random = seededRandom(3);
    cars = placeCars(CARS, L, random);
    step = 0;
    history.length = 0;
    history.push(cars);
  };
  return (ctx, rect, t) => {
    const target = Math.floor(t * RATE);
    if (!cars || target < step) reset();
    while (step < target) advance();
    const size = rect.w / L;
    const rows = Math.min(history.length, Math.floor(rect.h / size));
    for (let r = 0; r < rows; r++) {
      const row = history[history.length - rows + r];
      for (const car of row) {
        ctx.fillStyle = car.speed === 0 ? COLORS.accent : `rgba(77, 163, 255, ${0.35 + (0.65 * car.speed) / OPTIONS.vmax})`;
        ctx.fillRect(rect.x + car.position * size, rect.y + r * size, Math.max(1, size), Math.max(1, size));
      }
    }
  };
}

function sandPanel() {
  const S = 45, RATE = 320, RUN = 7000;
  const at = stepper(() => Object.assign(new Sandpile(S, S), { generation: 0 }), (pile) => {
    pile.drop(S >> 1, S >> 1);
    pile.generation++;
  });
  const PALETTE = ['#0f141c', '#24476b', '#4da3ff', '#ffa200'];
  return (ctx, rect, t) => {
    const pile = at(Math.floor(t * RATE) % RUN);
    const layout = gridLayout(rect, S, S);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        ctx.fillStyle = PALETTE[pile.grains[y * S + x]];
        ctx.fillRect(layout.x0 + x * layout.size, layout.y0 + y * layout.size, Math.ceil(layout.size), Math.ceil(layout.size));
      }
    }
    return pile.generation;
  };
}

function findings() {
  const panels = [
    { title: 'Lizard scales · an illustration', short: 'Scales (illustration)', draw: scalesPanel() },
    { title: 'Lattice gas · the HPP rule', short: 'Lattice gas', draw: gasPanel() },
    { title: 'Traffic · time runs down · orange is stopped', short: 'Traffic', draw: trafficPanel() },
    { title: 'Sandpile · grains dropped one at a time', short: 'Sandpile', draw: sandPanel() },
  ];
  return {
    still: 12,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const pad = 8;
      const pw = (w - 3 * pad) / 2, ph = (h - 3 * pad) / 2;
      panels.forEach((panel, i) => {
        const x = pad + (i % 2) * (pw + pad), y = pad + Math.floor(i / 2) * (ph + pad);
        ctx.fillStyle = COLORS.panel;
        ctx.fillRect(x, y, pw, ph);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, pw, ph);
        ctx.clip();
        panel.draw(ctx, { x: x + 6, y: y + 22, w: pw - 12, h: ph - 28 }, t);
        ctx.restore();
        label(ctx, pw < 300 ? panel.short : panel.title, x + 6, y + 15, { size: 11, color: COLORS.text });
      });
    },
  };
}

// ---- 9. Rule 110 beside Life's oscillators ----

/** Rule 110 from a random row, scrolling: time runs down. @returns the panel's drawer */
function rule110Panel() {
  const WIDTH = 48, RATE = 6, RUN = 600;
  const random = seededRandom(110);
  let row = new Uint8Array(WIDTH);
  for (let i = 0; i < WIDTH; i++) row[i] = random() < 0.5 ? 1 : 0;
  const rows = [row];
  for (let i = 1; i < RUN; i++) rows.push(row = elementaryStep(row, 110));
  return (ctx, rect, t) => {
    ctx.fillStyle = COLORS.panel;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    const grid = { x: rect.x + 6, y: rect.y + 22, w: rect.w - 12, h: rect.h - 28 };
    const size = grid.w / WIDTH;
    const visible = Math.max(1, Math.min(RUN, Math.floor(grid.h / size)));
    // Full from the first frame: the top row is the random one, and the rows scroll up from there
    const gen = visible - 1 + (Math.floor(t * RATE) % (RUN - visible + 1));
    const first = gen - visible + 1;
    const layout = { size, x0: grid.x, y0: grid.y };
    for (let y = first; y <= gen; y++) {
      const r = rows[y];
      for (let x = 0; x < WIDTH; x++) if (r[x]) drawCell(ctx, layout, x, y - first, COLORS.live, 0.08);
    }
    label(ctx, rect.w < 260 ? `Rule 110 · gen ${n(gen)}` : `Rule 110 · generation ${n(gen)} · time runs down`,
      rect.x + 6, rect.y + 15, { size: 11, color: COLORS.text });
  };
}

/**
 * Life's oscillators, one tile each with its name and period, all at one scale, running in place.
 * The tiles fill a grid of 2 to 4 columns, whichever shows the cells largest; seven never fill
 * it, so its bottom right corner, where the Pause button sits, stays empty.
 */
function oscillatorGallery() {
  const RATE = 3, GAP = 6, TOP = 20, BOTTOM = 18;
  const shows = OSCILLATORS.map((o) => {
    const life = new Life(parseRle(o.rle));
    const phases = [];
    for (let g = 0; g < o.period; g++) {
      phases.push(life.cells());
      life.step();
    }
    // Every phase in view: the union of their bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const cells of phases) {
      for (const [x, y] of cells) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
    return { ...o, phases, view: { minX, minY, cols: maxX - minX + 1, rows: maxY - minY + 1 } };
  });
  const widest = Math.max(...shows.map((s) => s.view.cols)), tallest = Math.max(...shows.map((s) => s.view.rows));
  const tiling = (rect, cols) => {
    const rows = Math.ceil(shows.length / cols);
    const w = (rect.w - (cols - 1) * GAP) / cols, h = (rect.h - (rows - 1) * GAP) / rows;
    return { cols, w, h, size: Math.min((w - 12) / widest, (h - TOP - BOTTOM) / tallest) };
  };
  return (ctx, rect, t) => {
    const gen = Math.floor(t * RATE);
    const tiles = [2, 3, 4].map((cols) => tiling(rect, cols)).reduce((a, b) => (b.size > a.size ? b : a));
    const size = Math.max(1, Math.floor(tiles.size * 2) / 2);
    shows.forEach((show, i) => {
      const x = rect.x + (i % tiles.cols) * (tiles.w + GAP), y = rect.y + Math.floor(i / tiles.cols) * (tiles.h + GAP);
      ctx.fillStyle = COLORS.panel;
      ctx.fillRect(x, y, tiles.w, tiles.h);
      const { view } = show;
      const layout = {
        size,
        x0: Math.round(x + (tiles.w - view.cols * size) / 2),
        y0: Math.round(y + TOP + (tiles.h - TOP - BOTTOM - view.rows * size) / 2),
      };
      drawGridLines(ctx, layout, view.cols, view.rows);
      for (const [cx, cy] of show.phases[gen % show.period]) drawCell(ctx, layout, cx - view.minX, cy - view.minY, COLORS.live);
      // A long name in a narrow tile, as on a phone, takes a smaller size
      let nameSize = 11;
      ctx.font = `400 ${nameSize}px ${FONT}`;
      while (nameSize > 8 && ctx.measureText(show.name).width > tiles.w - 10) ctx.font = `400 ${--nameSize}px ${FONT}`;
      label(ctx, show.name, x + 6, y + 14, { size: nameSize, color: COLORS.text });
      label(ctx, `period ${show.period}`, x + 6, y + tiles.h - 6, { size: 11, color: COLORS.accent });
    });
  };
}

function rule110() {
  const rule = rule110Panel();
  const gallery = oscillatorGallery();
  return {
    still: 0,
    draw(ctx, w, h, t) {
      clear(ctx, w, h);
      const pad = 8;
      // Side by side, Rule 110 a third of the stage; on a phone, Rule 110 above the gallery
      const stacked = w < 560;
      const left = stacked
        ? { x: pad, y: pad, w: w - 2 * pad, h: Math.round((h - 3 * pad) * 0.4) }
        : { x: pad, y: pad, w: Math.round((w - 3 * pad) / 3), h: h - 2 * pad };
      const right = stacked
        ? { x: pad, y: left.y + left.h + pad, w: w - 2 * pad, h: h - left.h - 3 * pad }
        : { x: left.x + left.w + pad, y: pad, w: w - left.w - 3 * pad, h: h - 2 * pad };
      rule(ctx, left, t);
      gallery(ctx, right, t);
    },
  };
}

/** Each step's animation, by the name steps.js gives it. */
export const SCENES = { intro, rule30, rules, zoo, gun, neighbourhood3d, lab3d, findings, rule110, finale };
