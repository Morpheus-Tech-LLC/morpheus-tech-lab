// SPDX-License-Identifier: Apache-2.0
//
// The unbounded Game of Life 3D world: its chunk store and its limits. step.js advances it one
// generation at a time.
//
// Space is divided into chunks of chunkSize³ cells. A chunk exists only while it holds live
// cells, or for the length of one step while a live neighbour might bring cells to life in it.
// Each chunk is a slot in a large slab (an ArrayBuffer, 64 MB by default), not a typed array of
// its own, so the cells' memory lives outside the JavaScript heap. The `chunks` Map holds only
// chunk key -> slot. A new slab is the only point where the engine asks the browser for memory,
// so a refusal is one catchable error in one place.
//
// A slot holds two copies of its chunk's cells, one byte per cell (0 or 1): the current
// generation and the next. The world's `parity` says which copy is current, and it flips for
// every chunk at once when a step completes. Every chunk is always at the same generation.
//
// Nothing here imports `state` or touches the page, so it runs in Node, in a Web Worker and in
// the browser.

import { validateRules, ruleTable } from './rules.js';

/** Live cells lie in [-COORDINATE_LIMIT, COORDINATE_LIMIT - 1] on every axis. */
export const COORDINATE_LIMIT = 2 ** 19;
export const CHUNK_SIZES = [8, 16, 32];
export const DEFAULT_SLAB_BYTES = 64 * 1024 * 1024;

/** The reasons a run can end, besides being stopped by hand. */
export const STOP_REASONS = [
  'cell-limit', // more live cells than limits.cells
  'extent-limit', // a side of the bounding box longer than limits.extent cells
  'coordinate-limit', // a cell outside the representable space (COORDINATE_LIMIT)
  'memory-limit', // another slab would take the engine past limits.memory bytes
  'out-of-memory', // the browser refused a new slab
  'arena-edge', // a cell would come to life outside the arena
];

// Chunk keys. A chunk coordinate is a cell coordinate divided by the chunk size, rounded down.
// The key range covers the representable space plus one guard chunk on each side, so a step
// that would bring a cell to life just past the limit can be computed, and then refused.
const KEY_OFFSET = COORDINATE_LIMIT / Math.min(...CHUNK_SIZES) + 1;
const KEY_SPAN = 2 * KEY_OFFSET + 1;

function inKeyRange(c) {
  return c >= -KEY_OFFSET && c <= KEY_OFFSET;
}

export function chunkKey(cx, cy, cz) {
  return ((cx + KEY_OFFSET) * KEY_SPAN + (cy + KEY_OFFSET)) * KEY_SPAN + (cz + KEY_OFFSET);
}

/** Thrown inside the engine when a limit ends the run; step() turns it into a stop reason. */
export class StopSignal extends Error {
  constructor(reason) {
    super(reason);
    this.reason = reason;
  }
}

/** A world that can't be built or seeded as asked. */
export class WorldError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WorldError';
  }
}

export class World {
  /**
   * @param {object} options
   * @param {{birth: number[], survival: number[]}} options.rules - B0 is refused
   * @param {number} [options.chunkSize] - 8, 16 or 32 cells
   * @param {number} [options.slabBytes] - bytes per slab; at least one chunk's slot
   * @param {{cells?: number, extent?: number, memory?: number}} [options.limits] - all
   *   unlimited by default; memory is in bytes of slabs
   * @param {{min: number[], max: number[]}} [options.arena] - an optional box, inclusive: a
   *   step that would bring a cell to life outside it ends the run
   * @param {(bytes: number) => ArrayBuffer} [options.allocate] - how a slab is obtained. A
   *   RangeError from it means the browser refused the memory. Tests replace it.
   */
  constructor({
    rules, chunkSize = 16, slabBytes = DEFAULT_SLAB_BYTES, limits = {}, arena = null,
    allocate = (bytes) => new ArrayBuffer(bytes),
  } = {}) {
    if (!CHUNK_SIZES.includes(chunkSize)) {
      throw new WorldError(`The chunk size must be one of ${CHUNK_SIZES.join(', ')}.`);
    }
    this.rules = validateRules(rules);
    this.table = ruleTable(this.rules);

    const n = chunkSize;
    this.n = n;
    this.shift = Math.log2(n);
    this.mask = n - 1;
    this.volume = n * n * n;
    this.slotBytes = 2 * this.volume;
    this.slotsPerSlab = Math.floor(slabBytes / this.slotBytes);
    if (this.slotsPerSlab < 1) {
      throw new WorldError(`A slab must hold at least one chunk (${this.slotBytes} bytes).`);
    }
    this.slabBytes = this.slotsPerSlab * this.slotBytes;

    this.limits = {
      cells: limits.cells ?? Infinity,
      extent: limits.extent ?? Infinity,
      memory: limits.memory ?? Infinity,
    };
    this.arena = arena && checkArena(arena);
    this.allocate = allocate;

    this.slabs = []; // Uint8Array views, one per slab
    this.free = []; // free slots, the lowest last
    this.chunks = new Map(); // chunk key -> slot
    this.chunksCreated = 0; // chunks ever allocated, including a step's empty neighbours
    this.chunksPeak = 0; // the most chunks allocated at once
    this.parity = 0; // which copy in each slot is the current generation
    this.generation = 0;
    this.stopReason = null;

    // Per-slot facts about the current generation, and the step's candidate for the next one.
    // They grow with the slabs. `touch` has bit (dz+1)*9 + (dy+1)*3 + (dx+1) set when a live
    // cell on the chunk's border touches the neighbouring chunk at (dx, dy, dz).
    this.meta = newMeta(0);
    this.next = newMeta(0);

    // Scratch for one chunk's step: its cells with a one-cell border, and partial sums
    const m = n + 2;
    this.padded = new Uint8Array(m * m * m);
    this.sumX = new Uint8Array(n * m * m);
    this.sumXY = new Uint8Array(n * n * m);
  }

  get liveCells() {
    let total = 0;
    for (const slot of this.chunks.values()) total += this.meta.live[slot];
    return total;
  }

  get chunkCount() {
    return this.chunks.size;
  }

  /** Bytes of cell memory the engine holds: its slabs. */
  get memoryBytes() {
    return this.slabs.length * this.slabBytes;
  }

  /** @returns {{min: number[], max: number[]} | null} the live cells' bounding box */
  extent() {
    return boxOf(this.meta, this.chunks.values(), this.n);
  }

  /**
   * Brings cells to life before the first step. Throws a WorldError for a cell outside the
   * representable space or the arena, or for a seed past a limit; the world is then unusable.
   * @param {Iterable<number[]>} cells - [x, y, z] each
   */
  setCells(cells) {
    if (this.generation !== 0) throw new WorldError('Cells can only be set before the first step.');
    const touched = new Set();
    try {
      for (const [x, y, z] of cells) {
        for (const c of [x, y, z]) {
          if (!Number.isInteger(c) || c < -COORDINATE_LIMIT || c >= COORDINATE_LIMIT) {
            throw new WorldError(`[${x}, ${y}, ${z}] is outside the representable space.`);
          }
        }
        if (this.arena && !inBox(this.arena, x, y, z)) {
          throw new WorldError(`[${x}, ${y}, ${z}] is outside the arena.`);
        }
        const slot = this.slotFor(x >> this.shift, y >> this.shift, z >> this.shift);
        touched.add(slot);
        const [slab, base] = this.current(slot);
        slab[base + this.localIndex(x, y, z)] = 1;
      }
    } catch (err) {
      if (err instanceof StopSignal) {
        throw new WorldError(`The seed doesn't fit in memory (${err.reason}).`);
      }
      throw err;
    }
    for (const slot of touched) this.scan(slot);

    const box = this.extent();
    if (this.liveCells > this.limits.cells) throw new WorldError('The seed has more cells than the cell limit.');
    if (box && longestSide(box) > this.limits.extent) throw new WorldError('The seed is wider than the extent limit.');
  }

  /** @returns {boolean} whether the cell is alive in the current generation */
  has(x, y, z) {
    const slot = this.findSlot(x >> this.shift, y >> this.shift, z >> this.shift);
    if (slot === undefined) return false;
    const [slab, base] = this.current(slot);
    return slab[base + this.localIndex(x, y, z)] === 1;
  }

  /** @returns {Int32Array} the live cells as x, y, z triples, in no particular order */
  cells() {
    const out = new Int32Array(3 * this.liveCells);
    const { n } = this;
    let k = 0;
    for (const slot of this.chunks.values()) {
      const [slab, base] = this.current(slot);
      const ox = this.meta.cx[slot] * n, oy = this.meta.cy[slot] * n, oz = this.meta.cz[slot] * n;
      for (let i = 0; i < this.volume; i++) {
        if (slab[base + i]) {
          out[k++] = ox + (i & this.mask);
          out[k++] = oy + ((i >> this.shift) & this.mask);
          out[k++] = oz + (i >> (2 * this.shift));
        }
      }
    }
    return out;
  }

  // ---- Internals, shared with step.js ----

  localIndex(x, y, z) {
    const { mask, shift } = this;
    return (x & mask) + ((y & mask) << shift) + ((z & mask) << (2 * shift));
  }

  /** @returns {[Uint8Array, number]} a slot's slab and the offset of its current copy */
  current(slot) {
    return this.copy(slot, this.parity);
  }

  copy(slot, which) {
    const slab = this.slabs[Math.floor(slot / this.slotsPerSlab)];
    return [slab, (slot % this.slotsPerSlab) * this.slotBytes + which * this.volume];
  }

  /** The slot of the chunk at (cx, cy, cz), or undefined if it has none. */
  findSlot(cx, cy, cz) {
    if (!inKeyRange(cx) || !inKeyRange(cy) || !inKeyRange(cz)) return undefined;
    return this.chunks.get(chunkKey(cx, cy, cz));
  }

  /** The slot of the chunk at (cx, cy, cz), allocating an empty one if there is none. */
  slotFor(cx, cy, cz) {
    const key = chunkKey(cx, cy, cz);
    let slot = this.chunks.get(key);
    if (slot === undefined) {
      slot = this.allocateSlot();
      this.meta.cx[slot] = cx;
      this.meta.cy[slot] = cy;
      this.meta.cz[slot] = cz;
      this.meta.live[slot] = 0;
      this.meta.touch[slot] = 0;
      this.chunks.set(key, slot);
      this.chunksCreated++;
      if (this.chunks.size > this.chunksPeak) this.chunksPeak = this.chunks.size;
    }
    return slot;
  }

  allocateSlot() {
    if (this.free.length === 0) this.addSlab();
    const slot = this.free.pop();
    const [slab, base] = this.copy(slot, 0);
    slab.fill(0, base, base + this.slotBytes);
    return slot;
  }

  addSlab() {
    if (this.memoryBytes + this.slabBytes > this.limits.memory) throw new StopSignal('memory-limit');
    let buffer;
    try {
      buffer = this.allocate(this.slabBytes);
    } catch (err) {
      if (err instanceof RangeError) throw new StopSignal('out-of-memory');
      throw err;
    }
    const first = this.slabs.length * this.slotsPerSlab;
    this.slabs.push(new Uint8Array(buffer, 0, this.slabBytes));
    const slots = this.slabs.length * this.slotsPerSlab;
    this.meta = growMeta(this.meta, slots);
    this.next = growMeta(this.next, slots);
    for (let s = slots - 1; s >= first; s--) this.free.push(s);
  }

  release(slot) {
    const { cx, cy, cz } = this.meta;
    this.chunks.delete(chunkKey(cx[slot], cy[slot], cz[slot]));
    this.free.push(slot);
  }

  /** Recounts a slot's live cells, border contacts and bounding box from its current copy. */
  scan(slot) {
    const { n, shift, mask } = this;
    const [slab, base] = this.current(slot);
    const box = [n, n, n, -1, -1, -1];
    let live = 0;
    let classes = 0;
    for (let i = 0; i < this.volume; i++) {
      if (!slab[base + i]) continue;
      const x = i & mask, y = (i >> shift) & mask, z = i >> (2 * shift);
      live++;
      classes |= 1 << (borderClass(x, n) + 3 * borderClass(y, n) + 9 * borderClass(z, n));
      if (x < box[0]) box[0] = x;
      if (y < box[1]) box[1] = y;
      if (z < box[2]) box[2] = z;
      if (x > box[3]) box[3] = x;
      if (y > box[4]) box[4] = y;
      if (z > box[5]) box[5] = z;
    }
    setFacts(this.meta, slot, live, classes, box, n);
  }

  stop(reason) {
    this.stopReason = reason;
    return reason;
  }
}

// ---- Per-slot facts ----

function newMeta(slots) {
  const meta = { live: null, touch: null, cx: null, cy: null, cz: null, box: null };
  return growMeta(meta, slots);
}

function growMeta(meta, slots) {
  const grow = (old, length) => {
    const next = new Int32Array(length);
    if (old) next.set(old);
    return next;
  };
  return {
    live: grow(meta.live, slots),
    touch: grow(meta.touch, slots),
    cx: grow(meta.cx, slots),
    cy: grow(meta.cy, slots),
    cz: grow(meta.cz, slots),
    box: grow(meta.box, 6 * slots), // min x, y, z, max x, y, z, local to the chunk
  };
}

/**
 * Where a coordinate sits in its chunk along one axis: 0 on the low face, 2 on the high face,
 * 1 in between.
 */
export function borderClass(local, n) {
  return local === 0 ? 0 : local === n - 1 ? 2 : 1;
}

// For each border class: the mask of neighbouring chunks a live cell of that class touches
const TOUCH_OF_CLASS = (() => {
  const reach = [[-1, 0], [0], [0, 1]];
  const table = new Int32Array(27);
  for (let c = 0; c < 27; c++) {
    const [ax, ay, az] = [c % 3, Math.floor(c / 3) % 3, Math.floor(c / 9)];
    for (const dz of reach[az]) {
      for (const dy of reach[ay]) {
        for (const dx of reach[ax]) {
          if (dx || dy || dz) table[c] |= 1 << ((dz + 1) * 9 + (dy + 1) * 3 + (dx + 1));
        }
      }
    }
  }
  return table;
})();

/** Turns a mask of the border classes present into a mask of the neighbours touched. */
export function touchOf(classes) {
  let touch = 0;
  for (let c = 0; c < 27; c++) if (classes & (1 << c)) touch |= TOUCH_OF_CLASS[c];
  return touch;
}

export function setFacts(meta, slot, live, classes, box, n) {
  meta.live[slot] = live;
  meta.touch[slot] = touchOf(classes);
  meta.box.set(live ? box : [0, 0, 0, n - 1, n - 1, n - 1], 6 * slot);
}

/** The bounding box, in cells, of the given slots' live cells; null if there are none. */
export function boxOf(meta, slots, n) {
  let box = null;
  for (const slot of slots) {
    if (!meta.live[slot]) continue;
    const b = 6 * slot;
    const origin = [meta.cx[slot] * n, meta.cy[slot] * n, meta.cz[slot] * n];
    if (!box) box = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
    for (let a = 0; a < 3; a++) {
      box.min[a] = Math.min(box.min[a], origin[a] + meta.box[b + a]);
      box.max[a] = Math.max(box.max[a], origin[a] + meta.box[b + 3 + a]);
    }
  }
  return box;
}

export function longestSide(box) {
  return Math.max(...box.max.map((hi, a) => hi - box.min[a] + 1));
}

export function inBox(box, x, y, z) {
  return x >= box.min[0] && x <= box.max[0] && y >= box.min[1] && y <= box.max[1]
    && z >= box.min[2] && z <= box.max[2];
}

function checkArena(arena) {
  const ok = Array.isArray(arena.min) && Array.isArray(arena.max)
    && arena.min.length === 3 && arena.max.length === 3
    && [...arena.min, ...arena.max].every((c) => Number.isInteger(c)
      && c >= -COORDINATE_LIMIT && c < COORDINATE_LIMIT)
    && arena.min.every((lo, a) => lo <= arena.max[a]);
  if (!ok) throw new WorldError('The arena must be {min: [x, y, z], max: [x, y, z]}, inside the representable space.');
  return { min: [...arena.min], max: [...arena.max] };
}
