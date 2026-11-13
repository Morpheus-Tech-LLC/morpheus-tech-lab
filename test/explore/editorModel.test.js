// SPDX-License-Identifier: Apache-2.0
//
// The seed editor's model (src/explore/editorModel.js): each kind of selection covers exactly its
// cells, at the box's edges and corners too; switching, random fill and the count; undo and redo;
// reading a seed in and writing it out; and which way each movement key goes from each view.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DesignModel, designCells, cellsOf, indexOf, cellAt, screenAxes, moveFor, selectionText, cursorText,
  SIDE, PLACES, HISTORY_STEPS, KINDS,
} from '../../src/explore/editorModel.js';
import { SEED_BOX, SeedError, toSeedFile, parseSeedFile } from '../../src/explore/seed.js';
import { presetById } from '../../src/explore/presets.js';

/** A small seeded random generator (a 32-bit linear congruential one), so a fill repeats. */
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

/** The selected cells as "x,y,z" strings, worked out the slow way: every place, tested. */
function selected(model) {
  const out = new Set();
  for (let i = 0; i < PLACES; i++) {
    const [x, y, z] = cellAt(i);
    if (model.isSelected(x, y, z)) out.add(`${x},${y},${z}`);
  }
  return out;
}

const key = (cells) => {
  const out = new Set();
  for (let i = 0; i < cells.length; i += 3) out.add(`${cells[i]},${cells[i + 1]},${cells[i + 2]}`);
  return out;
};

test('the box is the seed box: 10 cells a side, -5 to 4, and places map to cells and back', () => {
  assert.equal(SIDE, 10);
  assert.equal(PLACES, 1000);
  assert.deepEqual([...SEED_BOX.min], [-5, -5, -5]);
  assert.deepEqual([...SEED_BOX.max], [4, 4, 4]);
  for (let i = 0; i < PLACES; i++) assert.equal(indexOf(...cellAt(i)), i);
  assert.equal(indexOf(5, 0, 0), -1);
  assert.equal(indexOf(0, -6, 0), -1);
});

test('a cell selects the cursor only, at the centre and in a corner', () => {
  const m = new DesignModel();
  assert.deepEqual(m.cursor, [0, 0, 0]);
  assert.deepEqual(selected(m), new Set(['0,0,0']));
  m.setCursor([-5, 4, -5]);
  assert.deepEqual(selected(m), new Set(['-5,4,-5']));
  assert.deepEqual(m.selectionCount(), { cells: 1, alive: 0 });
});

test('the cursor stays inside the box', () => {
  const m = new DesignModel();
  m.setCursor([4, 4, 4]);
  m.moveCursor(0, 1);
  m.moveCursor(1, 3);
  assert.deepEqual(m.cursor, [4, 4, 4]);
  m.setCursor([-9, 0, 99]);
  assert.deepEqual(m.cursor, [-5, 0, 4]);
});

test('a line covers the 10 cells through the cursor along its axis, at the edges too', () => {
  const m = new DesignModel();
  m.setKind('line');
  for (const axis of [0, 1, 2]) {
    m.setAxis(axis);
    for (const cursor of [[0, 0, 0], [-5, -5, -5], [4, -5, 4]]) {
      m.setCursor(cursor);
      const want = new Set();
      for (let v = -5; v <= 4; v++) {
        const cell = [...cursor];
        cell[axis] = v;
        want.add(cell.join(','));
      }
      assert.deepEqual(selected(m), want, `axis ${axis}, cursor ${cursor}`);
      assert.equal(m.selectedPlaces().length, 10);
    }
  }
});

test('a plane covers the 100 cells through the cursor across its axis', () => {
  const m = new DesignModel();
  m.setKind('plane');
  for (const axis of [0, 1, 2]) {
    m.setAxis(axis);
    m.setCursor([4, -5, 2]);
    const got = selected(m);
    assert.equal(got.size, 100);
    for (const cell of got) assert.equal(Number(cell.split(',')[axis]), m.cursor[axis]);
  }
});

test('a box stretches from its anchor to the cursor, either way', () => {
  const m = new DesignModel();
  m.setCursor([1, 1, 1]);
  m.setKind('box');
  assert.deepEqual(m.anchor, [1, 1, 1]);
  m.setCursor([3, 2, 1]);
  assert.equal(selected(m).size, 3 * 2 * 1);
  assert.deepEqual(m.selection(), { min: [1, 1, 1], max: [3, 2, 1] });
  m.setCursor([-5, -5, -5]);
  assert.deepEqual(m.selection(), { min: [-5, -5, -5], max: [1, 1, 1] });
  assert.equal(selected(m).size, 7 * 7 * 7);
  // Pressing 4 again sets the anchor afresh, where the cursor is now
  m.setKind('box');
  assert.equal(selected(m).size, 1);
  // Shift+click sets the anchor
  m.setAnchor([4, 4, 4]);
  assert.deepEqual(m.selection(), { min: [-5, -5, -5], max: [4, 4, 4] });
});

test('All covers the whole box', () => {
  const m = new DesignModel();
  m.setKind('all');
  assert.equal(selected(m).size, 1000);
  assert.deepEqual(m.selectionCount(), { cells: 1000, alive: 0 });
});

test('switching fills a partly alive selection, clears a fully alive one, one undo step each', () => {
  const m = new DesignModel();
  m.setKind('line');
  m.setAxis(0);
  assert.equal(m.switchSelection(), 'filled');
  assert.equal(m.count, 10);
  // Partly alive: one cell of the plane is cleared by hand
  m.setKind('cell');
  m.switchSelection();
  assert.equal(m.count, 9);
  m.setKind('plane');
  m.setAxis(2);
  assert.equal(m.switchSelection(), 'filled');
  assert.equal(m.count, 100);
  assert.equal(m.switchSelection(), 'cleared');
  assert.equal(m.count, 0);
  m.undo();
  assert.equal(m.count, 100);
  m.undo();
  assert.equal(m.count, 9);
});

test('a seeded random fill repeats, lands near its density, and touches only the selection', () => {
  const a = new DesignModel();
  const b = new DesignModel();
  a.setKind('all');
  b.setKind('all');
  a.randomFill(0.3, seeded(7));
  b.randomFill(0.3, seeded(7));
  assert.deepEqual(a.places, b.places);
  assert.ok(a.count > 250 && a.count < 350, `${a.count} cells at 0.3`);

  const m = new DesignModel();
  m.setKind('plane');
  m.setAxis(1);
  m.setCursor([0, 2, 0]);
  m.randomFill(1, seeded(1));
  assert.equal(m.count, 100);
  for (const cell of key(m.toCells())) assert.equal(cell.split(',')[1], '2');
  m.randomFill(0, seeded(1));
  assert.equal(m.count, 0);
  assert.throws(() => m.randomFill(1.5, seeded(1)), SeedError);
});

test('the count is the number of live cells', () => {
  const m = new DesignModel(designCells(presetById('spreading-noise').cells));
  assert.equal(m.count, 224);
  m.setKind('all');
  m.switchSelection();
  assert.equal(m.count, 1000);
});

test('a seed outside the box is refused with the number of cells outside', () => {
  assert.throws(() => designCells(Int32Array.from([0, 0, 0, 5, 0, 0])), { message: '1 cell of this seed lies outside the 10³ box.' });
  assert.throws(
    () => designCells(Int32Array.from([0, 0, 0, 5, 0, 0, -6, 0, 0, 0, 0, 1200])),
    { name: 'SeedError', message: '3 cells of this seed lie outside the 10³ box.' },
  );
  assert.equal(new DesignModel(designCells(presetById('cube10').cells)).count, 1000);
});

test('a design written out and read back is unchanged, also through a seed file', () => {
  const m = new DesignModel();
  m.setKind('all');
  m.randomFill(0.4, seeded(42));
  const cells = m.toCells();
  assert.deepEqual(cellsOf(designCells(cells)), cells);
  const rules = { birth: [9, 10], survival: [5, 6, 7] };
  const back = parseSeedFile(toSeedFile({ rules, cells }));
  assert.deepEqual(new DesignModel(designCells(back.cells)).places, m.places);
  assert.deepEqual(back.rules, rules);
  // A preset's cells, in their own order, come back as the same set
  const noise = presetById('spreading-noise').cells;
  assert.deepEqual(key(cellsOf(designCells(noise))), key(noise));
});

test('undo and redo stop at their ends, and at 100 steps', () => {
  const m = new DesignModel();
  assert.equal(m.undo(), false);
  assert.equal(m.redo(), false);
  for (let i = 0; i < HISTORY_STEPS + 20; i++) {
    m.setCursor(cellAt(i));
    m.switchSelection();
  }
  assert.equal(m.count, 120);
  let undone = 0;
  while (m.undo()) undone++;
  assert.equal(undone, HISTORY_STEPS);
  assert.equal(m.count, 20);
  let redone = 0;
  while (m.redo()) redone++;
  assert.equal(redone, HISTORY_STEPS);
  assert.equal(m.count, 120);
  // A new change after an undo drops what could be redone
  m.undo();
  m.setCursor([4, 4, 4]);
  m.switchSelection();
  assert.equal(m.canRedo, false);
});

test('a change that changes nothing leaves no undo step', () => {
  const m = new DesignModel();
  m.randomFill(0, seeded(3));
  assert.equal(m.canUndo, false);
  m.replace(new Uint8Array(PLACES));
  assert.equal(m.canUndo, false);
});

test('Load replaces every cell, in one undo step', () => {
  const m = new DesignModel();
  m.switchSelection();
  m.replace(designCells(presetById('cube10').cells));
  assert.equal(m.count, 1000);
  m.undo();
  assert.equal(m.count, 1);
});

test('the panel names the cursor and the selection', () => {
  const m = new DesignModel();
  m.setCursor([2, -1, 4]);
  assert.equal(cursorText(m.cursor), 'x 2, y −1, z 4');
  assert.equal(selectionText(m), 'Cell at x 2, y −1, z 4: empty.');
  m.setKind('plane');
  m.setAxis(2);
  assert.equal(selectionText(m), 'Plane across z, at z 4: 100 cells, 0 alive.');
  m.setKind('line');
  m.setAxis(0);
  assert.equal(selectionText(m), 'Line along x, at y −1, z 4: 10 cells, 0 alive.');
  m.setKind('all');
  assert.equal(selectionText(m), 'All 1,000 cells: 0 alive.');
  assert.deepEqual(KINDS, ['cell', 'line', 'plane', 'box', 'all']);
});

// ---- The movement keys, from each view ----

const sub = (a, b) => a.map((v, i) => v - b[i]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (v) => { const l = Math.hypot(...v); return v.map((c) => c / l); };

/** The camera's right, up and viewing directions, for a camera at `position` looking at the origin. */
function lookingFrom(position, worldUp = [0, 1, 0]) {
  const forward = unit(sub([0, 0, 0], position));
  const right = unit(cross(forward, worldUp));
  const up = cross(right, forward);
  return { right, up, forward };
}

/** Where each key takes the cursor from the origin, as "axis sign": "x+", "z-". */
function moves(view) {
  const out = {};
  for (const k of ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown']) {
    const { axis, delta } = moveFor(k, view);
    out[k] = `${'xyz'[axis]}${delta > 0 ? '+' : '-'}`;
  }
  return out;
}

test('from the front, right is +x, up is +y, and Page Up goes away, to -z', () => {
  assert.deepEqual(moves(lookingFrom([0, 0, 30])), {
    ArrowRight: 'x+', ArrowLeft: 'x-', ArrowUp: 'y+', ArrowDown: 'y-', PageUp: 'z-', PageDown: 'z+',
  });
});

test('from behind, right is -x, and Page Up goes away, to +z', () => {
  assert.deepEqual(moves(lookingFrom([0, 0, -30])), {
    ArrowRight: 'x-', ArrowLeft: 'x+', ArrowUp: 'y+', ArrowDown: 'y-', PageUp: 'z+', PageDown: 'z-',
  });
});

test('from the top, up on screen is -z, and Page Up goes down, to -y', () => {
  // Looking straight down, with -z at the top of the screen, as the editor's Top view has it
  const view = { right: [1, 0, 0], up: [0, 0, -1], forward: [0, -1, 0] };
  assert.deepEqual(moves(view), {
    ArrowRight: 'x+', ArrowLeft: 'x-', ArrowUp: 'z-', ArrowDown: 'z+', PageUp: 'y-', PageDown: 'y+',
  });
});

test('from the side (+x), right is -z, and Page Up goes to -x', () => {
  assert.deepEqual(moves(lookingFrom([30, 0, 0])), {
    ArrowRight: 'z-', ArrowLeft: 'z+', ArrowUp: 'y+', ArrowDown: 'y-', PageUp: 'x-', PageDown: 'x+',
  });
});

test('from an angled view, each key takes the axis closest to its direction, all three reached', () => {
  // Front and a little right, a little above: right is mostly +x, up mostly +y, away mostly -z
  const view = lookingFrom([12, 10, 30]);
  assert.deepEqual(moves(view), {
    ArrowRight: 'x+', ArrowLeft: 'x-', ArrowUp: 'y+', ArrowDown: 'y-', PageUp: 'z-', PageDown: 'z+',
  });
  // Seen from high above and to the side, up on screen is mostly toward -x
  const high = lookingFrom([30, 40, 5]);
  const axes = screenAxes(high);
  assert.deepEqual(new Set([axes.right.axis, axes.up.axis, axes.forward.axis]), new Set([0, 1, 2]));
  assert.equal(moves(high).ArrowUp, 'x-');
  assert.equal(moves(high).PageUp, 'y-');
});

test('keys that are not movement keys move nothing', () => {
  assert.equal(moveFor('a', lookingFrom([0, 0, 30])), null);
});
