// SPDX-License-Identifier: Apache-2.0
//
// The seed editor's model (#70), apart from the page and from Three.js, so the tests run it in
// Node: the seed box's 1,000 places, the cursor, the selection, switching and random fill, undo
// and redo, reading a seed in and writing it out, and which way each movement key goes given
// where the camera stands. editorView.js draws it and editor.js drives it.
//
// Every selection is a box of cells: a cell is a box one cell wide, a line one cell wide on two
// axes, a plane one cell wide on one, and All the whole seed box. So one test, a box, says which
// cells are selected, whatever the kind.

import { SEED_BOX, SeedError } from './seed.js';

/** The seed box's side, in cells. */
export const SIDE = SEED_BOX.max[0] - SEED_BOX.min[0] + 1;
/** The number of places in the seed box. */
export const PLACES = SIDE * SIDE * SIDE;
/** How many changes undo can step back through. */
export const HISTORY_STEPS = 100;
/** Random fill's density until the visitor sets another. */
export const DEFAULT_DENSITY = 0.3;
/** The selection's kinds, in the order of their keys, 1 to 5. */
export const KINDS = ['cell', 'line', 'plane', 'box', 'all'];
export const AXIS_NAMES = ['x', 'y', 'z'];

/**
 * The movement keys: each moves the cursor one cell along whichever axis is closest to its
 * direction on screen. Page Up goes away from the viewer, into the screen; Page Down toward.
 */
export const MOVE_KEYS = Object.freeze({
  ArrowRight: ['right', 1],
  ArrowLeft: ['right', -1],
  ArrowUp: ['up', 1],
  ArrowDown: ['up', -1],
  PageUp: ['forward', 1],
  PageDown: ['forward', -1],
});

const { min: LO, max: HI } = SEED_BOX;

/** The place of cell [x, y, z] in the box's bytes, or -1 outside the box. */
export function indexOf(x, y, z) {
  if (!inBox(x, y, z)) return -1;
  return (x - LO[0]) + SIDE * ((y - LO[1]) + SIDE * (z - LO[2]));
}

/** The cell at place `i`. @returns {number[]} [x, y, z] */
export function cellAt(i) {
  return [LO[0] + (i % SIDE), LO[1] + (Math.floor(i / SIDE) % SIDE), LO[2] + Math.floor(i / (SIDE * SIDE))];
}

export function inBox(x, y, z) {
  return x >= LO[0] && x <= HI[0] && y >= LO[1] && y <= HI[1] && z >= LO[2] && z <= HI[2];
}

/**
 * A seed's cells as the box's bytes, if every one lies in the box.
 * @param {ArrayLike<number>} cells - x, y, z triples
 * @returns {Uint8Array} PLACES bytes, 1 where a cell is alive
 * @throws {SeedError} saying how many cells lie outside the box
 */
export function designCells(cells) {
  const places = new Uint8Array(PLACES);
  let outside = 0;
  for (let i = 0; i < cells.length; i += 3) {
    const at = indexOf(cells[i], cells[i + 1], cells[i + 2]);
    if (at < 0) outside++;
    else places[at] = 1;
  }
  if (outside) {
    const n = outside.toLocaleString('en');
    throw new SeedError(outside === 1
      ? `1 cell of this seed lies outside the ${SIDE}³ box.`
      : `${n} cells of this seed lie outside the ${SIDE}³ box.`);
  }
  return places;
}

/** The live places as cells, x, y, z triples, in the box's order. */
export function cellsOf(places) {
  const out = [];
  for (let i = 0; i < places.length; i++) if (places[i]) out.push(...cellAt(i));
  return Int32Array.from(out);
}

export class DesignModel {
  /** @param {Uint8Array} [places] - from designCells(); an empty box without it */
  constructor(places = null) {
    this.places = places ? Uint8Array.from(places) : new Uint8Array(PLACES);
    // The cursor starts at the origin, one of the eight cells at the box's centre
    this.cursor = [0, 0, 0];
    this.kind = 'cell';
    this.axis = 0;
    this.anchor = null;
    this.past = [];
    this.future = [];
  }

  /** The number of live cells. */
  get count() {
    let n = 0;
    for (let i = 0; i < PLACES; i++) n += this.places[i];
    return n;
  }

  isAlive(x, y, z) {
    const at = indexOf(x, y, z);
    return at >= 0 && this.places[at] === 1;
  }

  toCells() {
    return cellsOf(this.places);
  }

  // ---- The cursor and the selection ----

  /** Moves the cursor to a cell, kept inside the box. */
  setCursor(cell) {
    this.cursor = cell.map((c, a) => Math.min(HI[a], Math.max(LO[a], Math.round(c))));
  }

  /** Moves the cursor `delta` cells along `axis`, stopping at the box's faces. */
  moveCursor(axis, delta) {
    const next = [...this.cursor];
    next[axis] += delta;
    this.setCursor(next);
  }

  /** Chooses the selection's kind. Box sets its anchor where the cursor is, every time. */
  setKind(kind) {
    if (!KINDS.includes(kind)) throw new Error(`No selection kind ${kind}`);
    this.kind = kind;
    this.anchor = kind === 'box' ? [...this.cursor] : null;
  }

  /** Chooses the axis a line runs along, or a plane lies across. */
  setAxis(axis) {
    if (![0, 1, 2].includes(axis)) throw new Error(`No axis ${axis}`);
    this.axis = axis;
  }

  /** Sets a box's anchor (Shift+click): the selection becomes a box from there to the cursor. */
  setAnchor(cell) {
    this.kind = 'box';
    this.anchor = cell.map((c, a) => Math.min(HI[a], Math.max(LO[a], Math.round(c))));
  }

  /** The selected cells, as a box. @returns {{min: number[], max: number[]}} */
  selection() {
    const c = this.cursor;
    const a = this.axis;
    switch (this.kind) {
      case 'line':
        return { min: c.map((v, i) => (i === a ? LO[i] : v)), max: c.map((v, i) => (i === a ? HI[i] : v)) };
      case 'plane':
        return { min: c.map((v, i) => (i === a ? v : LO[i])), max: c.map((v, i) => (i === a ? v : HI[i])) };
      case 'box': {
        const anchor = this.anchor ?? c;
        return { min: c.map((v, i) => Math.min(v, anchor[i])), max: c.map((v, i) => Math.max(v, anchor[i])) };
      }
      case 'all':
        return { min: [...LO], max: [...HI] };
      default:
        return { min: [...c], max: [...c] };
    }
  }

  /**
   * What Fade the rest keeps bright: the plane through the cursor across the axis, for a cell, a
   * line or a plane; the selection itself for a box or All.
   * @returns {{min: number[], max: number[]}}
   */
  focus() {
    if (this.kind === 'box' || this.kind === 'all') return this.selection();
    const c = this.cursor;
    const a = this.axis;
    return { min: c.map((v, i) => (i === a ? v : LO[i])), max: c.map((v, i) => (i === a ? v : HI[i])) };
  }

  /** Whether cell [x, y, z] is in the selection. */
  isSelected(x, y, z) {
    const { min, max } = this.selection();
    return x >= min[0] && x <= max[0] && y >= min[1] && y <= max[1] && z >= min[2] && z <= max[2];
  }

  /** The selection's places, in the box's order. */
  selectedPlaces() {
    const { min, max } = this.selection();
    const out = [];
    for (let z = min[2]; z <= max[2]; z++) {
      for (let y = min[1]; y <= max[1]; y++) {
        for (let x = min[0]; x <= max[0]; x++) out.push(indexOf(x, y, z));
      }
    }
    return out;
  }

  /** How many cells the selection covers, and how many of them are alive. */
  selectionCount() {
    const places = this.selectedPlaces();
    let alive = 0;
    for (const i of places) alive += this.places[i];
    return { cells: places.length, alive };
  }

  // ---- Changes, each one undo step ----

  /**
   * Space or Enter: clears the selection if every cell in it is alive, and fills it otherwise.
   * @returns {'filled' | 'cleared'}
   */
  switchSelection() {
    const places = this.selectedPlaces();
    const full = places.every((i) => this.places[i] === 1);
    this.change((next) => { for (const i of places) next[i] = full ? 0 : 1; });
    return full ? 'cleared' : 'filled';
  }

  /**
   * R: each selected cell comes alive with chance `density`, and is cleared otherwise.
   * @param {number} density - 0 to 1
   * @param {() => number} random - uniform in [0, 1), such as Math.random; a seeded one repeats
   */
  randomFill(density, random) {
    if (!(density >= 0 && density <= 1)) throw new SeedError('The density must be from 0 to 1.');
    const places = this.selectedPlaces();
    this.change((next) => { for (const i of places) next[i] = random() < density ? 1 : 0; });
  }

  /** Replaces every cell, as Load… does. @param {Uint8Array} places - from designCells() */
  replace(places) {
    this.change((next) => next.set(places));
  }

  // Applies one change to a copy; a change that changes nothing leaves no undo step
  change(edit) {
    const next = Uint8Array.from(this.places);
    edit(next);
    if (next.every((v, i) => v === this.places[i])) return false;
    this.past.push(this.places);
    if (this.past.length > HISTORY_STEPS) this.past.shift();
    this.future = [];
    this.places = next;
    return true;
  }

  get canUndo() {
    return this.past.length > 0;
  }

  get canRedo() {
    return this.future.length > 0;
  }

  /** @returns {boolean} whether there was a change to undo */
  undo() {
    if (!this.past.length) return false;
    this.future.push(this.places);
    this.places = this.past.pop();
    return true;
  }

  /** @returns {boolean} whether there was a change to redo */
  redo() {
    if (!this.future.length) return false;
    this.past.push(this.places);
    this.places = this.future.pop();
    return true;
  }
}

// ---- What the panel says ----

/** A coordinate as the panel shows it, with a true minus sign: "−1". */
export function coordinate(c) {
  return c < 0 ? `−${-c}` : `${c}`;
}

/** The cursor's coordinates: "x 2, y −1, z 4". */
export function cursorText(cell) {
  return cell.map((c, a) => `${AXIS_NAMES[a]} ${coordinate(c)}`).join(', ');
}

/** The selection, named: "Plane across z, at z 4: 100 cells, 37 alive." */
export function selectionText(model) {
  const { cells, alive } = model.selectionCount();
  const n = (x) => x.toLocaleString('en');
  const axis = AXIS_NAMES[model.axis];
  const c = model.cursor;
  const others = [0, 1, 2].filter((a) => a !== model.axis).map((a) => `${AXIS_NAMES[a]} ${coordinate(c[a])}`).join(', ');
  const tally = `${n(cells)} cells, ${n(alive)} alive.`;
  switch (model.kind) {
    case 'cell':
      return `Cell at ${cursorText(c)}: ${alive ? 'alive' : 'empty'}.`;
    case 'line':
      return `Line along ${axis}, at ${others}: ${tally}`;
    case 'plane':
      return `Plane across ${axis}, at ${axis} ${coordinate(c[model.axis])}: ${tally}`;
    case 'box': {
      const { min, max } = model.selection();
      const size = max.map((hi, a) => hi - min[a] + 1).join('×');
      return `Box ${size}, from ${cursorText(min)} to ${cursorText(max)}: ${tally}`;
    }
    default:
      return `All ${n(cells)} cells: ${n(alive)} alive.`;
  }
}

// ---- Which way the keys move ----

const PERMUTATIONS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

/**
 * Which axis, and which way along it, each screen direction moves the cursor, seen from where the
 * camera stands. Each direction takes the axis closest to it, and no two take the same one, so
 * the keys reach all three axes from any view.
 * @param {{right: number[], up: number[], forward: number[]}} view - the camera's right, up and
 *   viewing directions in the world, as unit vectors
 * @returns {{right: {axis: number, sign: number}, up: {axis: number, sign: number},
 *   forward: {axis: number, sign: number}}}
 */
export function screenAxes({ right, up, forward }) {
  const dirs = [right, up, forward];
  let best = PERMUTATIONS[0];
  let bestScore = -1;
  for (const p of PERMUTATIONS) {
    const score = Math.abs(dirs[0][p[0]]) + Math.abs(dirs[1][p[1]]) + Math.abs(dirs[2][p[2]]);
    if (score > bestScore + 1e-9) {
      best = p;
      bestScore = score;
    }
  }
  const pick = (dir, axis) => ({ axis, sign: dir[axis] < 0 ? -1 : 1 });
  return { right: pick(right, best[0]), up: pick(up, best[1]), forward: pick(forward, best[2]) };
}

/**
 * The move a movement key makes, seen from `view`.
 * @param {string} key - a KeyboardEvent key, one of MOVE_KEYS
 * @returns {{axis: number, delta: number} | null} null for a key that doesn't move the cursor
 */
export function moveFor(key, view) {
  const move = MOVE_KEYS[key];
  if (!move) return null;
  const [direction, way] = move;
  const { axis, sign } = screenAxes(view)[direction];
  return { axis, delta: sign * way };
}
