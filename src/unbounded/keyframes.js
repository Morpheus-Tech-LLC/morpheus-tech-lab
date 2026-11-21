// SPDX-License-Identifier: Apache-2.0
//
// Keyframes: a run's cells every K generations, kept under a memory budget, so an earlier
// generation can be rebuilt without keeping every one. A replay (run.js) seeks with them; the
// settle detector (settle.js) rebuilds a candidate generation from them to confirm a repeat.
//
// The run's starting cells are always kept: generation 0's for a replay, or the generation a run
// was started from. On top of them, a keyframe is kept on every generation that is a multiple of
// K. When their bytes pass the budget, every other one goes and K doubles, until they fit. One
// keyframe larger than the whole budget goes too, once K passes it, and the start is left to
// rebuild from. forget() drops the ones no later rebuild can need.
//
// Nothing here imports `state` or touches the page.

import { World } from './world.js';

/** Keyframes, at most, in bytes of cells (12 per live cell), unless the run says otherwise. */
export const KEYFRAME_BYTES = 128 * 1024 * 1024;
/** A keyframe every this many generations at first; it doubles as they thin. */
export const KEYFRAME_EVERY = 8;

export class Keyframes {
  /**
   * @param {object} options
   * @param {{generation: number, cells: Int32Array}} options.start - the run's starting cells, as
   *   x, y, z triples; always kept
   * @param {number} [options.budget] - bytes
   * @param {number} [options.every] - K at first: 1, 2, 4, 8, …
   */
  constructor({ start, budget = KEYFRAME_BYTES, every = KEYFRAME_EVERY }) {
    this.start = start;
    this.budget = budget;
    this.every = every;
    this.frames = new Map(); // generation -> cells as x, y, z triples
    this.bytes = 0;
  }

  /** Keeps the world's current generation as a keyframe, if it falls on one, within the budget. */
  keep(world) {
    const g = world.generation;
    if (g % this.every !== 0 || g <= this.start.generation || this.frames.has(g)) return;
    const cells = world.cells();
    this.frames.set(g, cells);
    this.bytes += cells.byteLength;
    while (this.bytes > this.budget) {
      this.every *= 2;
      for (const [k, kept] of this.frames) {
        if (k % this.every !== 0) this.drop(k, kept);
      }
    }
  }

  /** The generation of the nearest keyframe at or before `target`, the start included. */
  nearest(target) {
    let from = this.start.generation;
    for (const k of this.frames.keys()) if (k <= target && k > from) from = k;
    return from;
  }

  /**
   * Drops every keyframe before the nearest one at or before `generation`: no rebuild of
   * `generation` or later needs them. The start stays.
   */
  forget(generation) {
    const from = this.nearest(generation);
    for (const [k, kept] of this.frames) {
      if (k < from) this.drop(k, kept);
    }
  }

  /** @returns {Int32Array | undefined} a keyframe's cells; not the start's */
  get(generation) {
    return this.frames.get(generation);
  }

  /**
   * A fresh World at the nearest keyframe at or before `target`, with the given options. Its
   * generation count is the keyframe's; the caller steps it on to `target`.
   * @throws {import('./world.js').WorldError} if its cells don't fit in memory
   */
  restore(options, target) {
    const from = this.nearest(target);
    const world = new World(options);
    world.setCells(triples(from === this.start.generation ? this.start.cells : this.frames.get(from)));
    world.generation = from;
    return world;
  }

  /** Which generations are kept, every how many, and their bytes; the start isn't counted. For tests. */
  list() {
    return {
      generations: [...this.frames.keys()].sort((a, b) => a - b),
      every: this.every,
      bytes: this.bytes,
      budget: this.budget,
    };
  }

  drop(generation, cells) {
    this.frames.delete(generation);
    this.bytes -= cells.byteLength;
  }
}

export function* triples(flat) {
  for (let i = 0; i < flat.length; i += 3) yield [flat[i], flat[i + 1], flat[i + 2]];
}
