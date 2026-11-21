// SPDX-License-Identifier: Apache-2.0
//
// The settle detector (#41, #44's shared decisions): it watches a run, one generation at a time,
// and says when the pattern has settled: died out, or repeated, in place, an earlier generation's
// cells. run.js uses it for a settling run (Explore's, and a Discovery contest's); verify.js uses
// it to replay one, so both find the same ending at the same generation.
//
// Write C(t) for the cells at generation t. The run settles at the first of:
//   died     the least h with C(h) empty. The empty world is a still life, so a death is the
//            cycle C(h) = C(h + 1): period 1, and it closes at h + 1
//   repeat   the least g with C(g) = C(h), cell for cell and in place, for some h < g. Since g is
//            the first repeat, h is unique: the cycle begins at h, with period g − h
// A run with a budget B settles only by a cycle that closes within it, at h + period ≤ B: a
// repeat found at B itself counts, a death at B doesn't (its cycle would close at B + 1).
//
// Where ships leave at the edge (departures.js, #100), a repeat whose cycle had a departure, at
// some t with h ≤ t < g, is no settling: it will send off ships for ever. It ends the run all the
// same, as 'emits', at h with its period. Rebuilds step through the departure rule, so they meet
// the same departures as the run.
//
// A repeat is proposed, then confirmed. The world's 64-bit fingerprint of every generation in the
// window proposes candidates, and each candidate h is rebuilt from the nearest keyframe at or
// before it (keyframes.js) and compared with C(g), cell for cell. The fingerprint is a sum of
// per-cell hashes, so different cells can be made to share one on purpose; the comparison is what
// keeps an ending right. A false match costs one comparison, and the run carries on. Every
// generation that had a fingerprint is kept, not just the latest, so a false match can never
// hide the true h.
//
// The window is how far back a repeat is looked for, the longest period found: the run's budget
// when it has one, so every generation from the start is still there to match at the budget's
// last, or REPEAT_WINDOW for an open-ended run.
//
// Nothing here imports `state` or touches the page.

import { StopSignal, WorldError } from './world.js';
import { stepWithDepartures } from './departures.js';
import { Keyframes } from './keyframes.js';

/** How far back an open-ended run, one with no budget, looks for a repeat: its longest period. */
export const REPEAT_WINDOW = 10_000;

/** Endings a confirmation can meet that come from the machine: it needs memory for a rebuild. */
const MEMORY = ['memory-limit', 'out-of-memory'];

/**
 * @typedef {object} Settled
 * @property {'died' | 'repeat' | 'emits'} ending
 * @property {number} from - h: the generation the final state or cycle began
 * @property {number} period - 1 for a death
 */

export class Settler {
  /**
   * Starts watching a world at its current generation, the run's start.
   * @param {import('./world.js').World} world - made with the `fingerprint` option
   * @param {object} options
   * @param {object} options.world - the world's options, to rebuild a generation with
   * @param {number} [options.budget] - the run's generation budget, counted from 0; none by default
   * @param {number} [options.window] - how many generations back to look; the budget, or
   *   REPEAT_WINDOW without one
   * @param {number} [options.keyframeBytes]
   * @param {number} [options.keyframeEvery]
   * @param {(world: object) => string} [options.fingerprint] - the tests force false matches with it
   * @param {typeof stepWithDepartures} [options.step] - how a rebuild steps: the run's own step,
   *   departures included
   */
  constructor(world, {
    world: options, budget = Infinity, window, keyframeBytes, keyframeEvery, fingerprint, step = stepWithDepartures,
  }) {
    if (!fingerprint && !world.fingerprinting) throw new Error('A settling world needs the fingerprint option.');
    this.options = { ...options, fingerprint: false };
    this.budget = budget;
    this.window = window ?? (budget === Infinity ? REPEAT_WINDOW : budget);
    this.fingerprint = fingerprint ?? ((w) => w.fingerprint());
    this.stepWorld = step;
    this.keyframes = new Keyframes({
      start: { generation: world.generation, cells: world.cells() },
      budget: keyframeBytes,
      every: keyframeEvery,
    });
    this.seen = new Map(); // fingerprint -> the generations in the window that had it, oldest first
    this.queue = []; // each generation's fingerprint, from `oldest` on
    this.oldest = world.generation;
    this.head = 0;
    this.proposed = 0; // candidates compared, and how many of them weren't a repeat: for tests
    this.rejected = 0;
    this.remember(world.generation, this.fingerprint(world));
  }

  /**
   * Looks at the generation the world has just reached.
   * @returns {Settled | {ending: 'memory-limit' | 'out-of-memory'} | null} how the run settled;
   *   a memory ending if a confirmation couldn't rebuild a generation; null to carry on
   */
  check(world) {
    const g = world.generation;
    if (world.liveCells === 0) {
      // Within a budget, a death scores only if its cycle, C(g) = C(g + 1), closes by then
      return g + 1 <= this.budget ? { ending: 'died', from: g, period: 1 } : null;
    }
    const key = this.fingerprint(world);
    const candidates = this.seen.get(key);
    if (candidates) {
      let h;
      try {
        h = this.confirm(world, candidates);
      } catch (err) {
        if (err instanceof StopSignal && MEMORY.includes(err.reason)) return { ending: err.reason };
        if (err instanceof WorldError && MEMORY.includes(err.reason)) return { ending: err.reason };
        throw err;
      }
      if (h !== null) {
        // The departures so far are all before g: one at h or later was in the cycle
        const emits = world.departed.some((d) => d.generation >= h);
        return { ending: emits ? 'emits' : 'repeat', from: h, period: g - h };
      }
    }
    this.remember(g, key);
    this.keyframes.keep(world);
    // From the next generation on, nothing before g + 1 − window can match, so no rebuild needs
    // the keyframes before it. Checked once per K generations: that is when one can be added
    if (g % this.keyframes.every === 0) this.keyframes.forget(g + 1 - this.window);
    return null;
  }

  /**
   * Rebuilds each candidate generation, oldest first, and compares it with the world's cells.
   * One rebuilt world steps from candidate to candidate, unless a keyframe is nearer.
   * @returns {number | null} the candidate whose cells are the world's
   */
  confirm(world, candidates) {
    let replica = null;
    for (const h of candidates) {
      const from = this.keyframes.nearest(h);
      if (!replica || replica.generation > h || replica.generation < from) replica = this.keyframes.restore(this.options, h);
      while (replica.generation < h) {
        const reason = this.stepWorld(replica);
        if (reason) throw MEMORY.includes(reason) ? new StopSignal(reason) : new Error(`A generation could not be rebuilt (${reason}).`);
      }
      this.proposed++;
      if (sameCells(replica, world)) return h;
      this.rejected++;
    }
    return null;
  }

  remember(generation, key) {
    const list = this.seen.get(key);
    if (list) list.push(generation);
    else this.seen.set(key, [generation]);
    this.queue.push(key);
    // Forget what the next generation can't match: anything before generation + 1 − window
    while (this.oldest < generation + 1 - this.window) {
      const old = this.queue[this.head++];
      const generations = this.seen.get(old);
      generations.shift();
      if (!generations.length) this.seen.delete(old);
      this.oldest++;
    }
    if (this.head > 4096 && this.head * 2 > this.queue.length) {
      this.queue = this.queue.slice(this.head);
      this.head = 0;
    }
  }
}

/** Whether two worlds hold the same live cells, in place. */
export function sameCells(a, b) {
  if (a.liveCells !== b.liveCells) return false;
  const cells = a.cells();
  for (let i = 0; i < cells.length; i += 3) {
    if (!b.has(cells[i], cells[i + 1], cells[i + 2])) return false;
  }
  return true;
}
