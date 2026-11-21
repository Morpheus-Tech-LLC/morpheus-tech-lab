// SPDX-License-Identifier: Apache-2.0
//
// A bit-packed version of the engine's one-chunk step, for the bench only: is packing cells as
// bits, instead of one byte each, worth an engine change? The engine doesn't use this.
//
// A chunk is n² words (n = 8, 16 or 32), one per row of cells along x: word y + z·n holds the
// row's cells in bits 0 to n-1. A step works a whole row at a time, with the cells' neighbour
// counts kept as bit slices (bit k of every cell's count in one word), in three passes like the
// engine's: three cells along x, then three rows along y, then three planes along z. The rule is
// then a test of those slices against each count in it. Like the engine's step, it also records
// the chunk's live cells, bounding box and border contacts.

import { touchOf, borderClass } from '../../src/unbounded/world.js';
import { computeChunk } from '../../src/unbounded/step.js';

/** Packs one copy of a slot (bytes, one per cell) into rows of bits. */
export function pack(bytes, base, n) {
  const rows = new Uint32Array(n * n);
  for (let r = 0; r < n * n; r++) {
    let word = 0;
    for (let x = 0; x < n; x++) if (bytes[base + r * n + x]) word |= 1 << x;
    rows[r] = word;
  }
  return rows;
}

export class BitStepper {
  /**
   * @param {number} n - the chunk size
   * @param {{birth: number[], survival: number[]}} rules - already validated
   */
  constructor(n, rules) {
    this.n = n;
    this.mask = n === 32 ? 0xffffffff : (1 << n) - 1;
    this.middle = this.mask & ~1 & ~(1 << (n - 1));
    const m = n + 2;
    // Per source row (padded y, padded z): the 2-bit sum of three cells along x
    this.h0 = new Int32Array(m * m);
    this.h1 = new Int32Array(m * m);
    // Per (y, padded z): the 4-bit sum of three rows along y
    this.v0 = new Int32Array(n * m);
    this.v1 = new Int32Array(n * m);
    this.v2 = new Int32Array(n * m);
    this.v3 = new Int32Array(n * m);
    // The block counts (self included) that bring a dead cell to life, or keep a live one
    this.birthCounts = Int32Array.from(rules.birth);
    this.keepCounts = Int32Array.from(rules.survival.map((s) => s + 1));
    this.out = new Uint32Array(n * n);
  }

  /**
   * One step of the middle chunk.
   * @param {(Uint32Array | null)[]} around - the 27 chunks around it and itself, index
   *   (dz+1)·9 + (dy+1)·3 + (dx+1); null where there is none
   * @returns {{live: number, touch: number, box: number[]}} the facts the engine records
   */
  step(around) {
    const { n, mask, h0, h1, v0, v1, v2, v3, out } = this;
    const m = n + 2;
    const top = n - 1;

    // 1. Three cells along x, for every row of the padded block
    for (let pz = 0; pz < m; pz++) {
      const dz = pz === 0 ? -1 : pz === m - 1 ? 1 : 0;
      const lz = pz === 0 ? top : pz === m - 1 ? 0 : pz - 1;
      for (let py = 0; py < m; py++) {
        const dy = py === 0 ? -1 : py === m - 1 ? 1 : 0;
        const ly = py === 0 ? top : py === m - 1 ? 0 : py - 1;
        const k = (dz + 1) * 9 + (dy + 1) * 3;
        const r = ly + lz * n;
        const mid = around[k + 1];
        const c = mid ? mid[r] : 0;
        const leftChunk = around[k];
        const rightChunk = around[k + 2];
        const inLeft = leftChunk ? (leftChunk[r] >>> top) & 1 : 0;
        const inRight = rightChunk ? rightChunk[r] & 1 : 0;
        const left = ((c << 1) | inLeft) & mask; // bit x holds cell x - 1
        const right = (c >>> 1) | (inRight << top); // bit x holds cell x + 1
        const i = py + pz * m;
        const t = left ^ c;
        h0[i] = t ^ right;
        h1[i] = (left & c) | (right & t);
      }
    }

    // 2. Three rows along y: 2-bit + 2-bit + 2-bit, up to 9, in four bits
    for (let pz = 0; pz < m; pz++) {
      for (let y = 0; y < n; y++) {
        const i = y + pz * m;
        const a0 = h0[i], a1 = h1[i], b0 = h0[i + 1], b1 = h1[i + 1], c0 = h0[i + 2], c1 = h1[i + 2];
        const t0 = a0 ^ b0;
        const carry0 = (a0 & b0) | (c0 & t0);
        const t1 = a1 ^ b1;
        const k1 = (a1 & b1) | (c1 & t1);
        const s1 = t1 ^ c1;
        const k2 = s1 & carry0;
        const j = y + pz * n;
        v0[j] = t0 ^ c0;
        v1[j] = s1 ^ carry0;
        v2[j] = k1 ^ k2;
        v3[j] = k1 & k2;
      }
    }

    // 3. Three planes along z: 4-bit + 4-bit + 4-bit, up to 27, in five bits; then the rule
    const { birthCounts, keepCounts } = this;
    const self = around[13];
    let live = 0;
    let classes = 0;
    let minX = n, minY = n, minZ = n, maxX = -1, maxY = -1, maxZ = -1;
    for (let z = 0; z < n; z++) {
      const zClass = 9 * borderClass(z, n);
      for (let y = 0; y < n; y++) {
        const a = y + z * n, b = a + n, c = b + n;
        // a + b
        let x0 = v0[a], x1 = v1[a], x2 = v2[a], x3 = v3[a];
        let y0 = v0[b], y1 = v1[b], y2 = v2[b], y3 = v3[b];
        let s0 = x0 ^ y0, carry = x0 & y0;
        let s1 = x1 ^ y1 ^ carry; carry = (x1 & y1) | (carry & (x1 ^ y1));
        let s2 = x2 ^ y2 ^ carry; carry = (x2 & y2) | (carry & (x2 ^ y2));
        let s3 = x3 ^ y3 ^ carry; carry = (x3 & y3) | (carry & (x3 ^ y3));
        let s4 = carry;
        // + c
        y0 = v0[c]; y1 = v1[c]; y2 = v2[c]; y3 = v3[c];
        x0 = s0 ^ y0; carry = s0 & y0;
        x1 = s1 ^ y1 ^ carry; carry = (s1 & y1) | (carry & (s1 ^ y1));
        x2 = s2 ^ y2 ^ carry; carry = (s2 & y2) | (carry & (s2 ^ y2));
        x3 = s3 ^ y3 ^ carry; carry = (s3 & y3) | (carry & (s3 ^ y3));
        const x4 = s4 ^ carry;

        const row = y + z * n;
        const alive = self ? self[row] : 0;
        let born = 0;
        for (let k = 0; k < birthCounts.length; k++) born |= equals(birthCounts[k], x0, x1, x2, x3, x4);
        let kept = 0;
        for (let k = 0; k < keepCounts.length; k++) kept |= equals(keepCounts[k], x0, x1, x2, x3, x4);
        const next = ((born & ~alive) | (kept & alive)) & mask;
        out[row] = next;

        if (next) {
          live += popcount(next);
          const rowClass = zClass + 3 * borderClass(y, n);
          if (next & 1) classes |= 1 << rowClass;
          if (next & this.middle) classes |= 1 << (rowClass + 1);
          if ((next >>> top) & 1) classes |= 1 << (rowClass + 2);
          const lo = 31 - Math.clz32(next & -next);
          const hi = 31 - Math.clz32(next);
          if (lo < minX) minX = lo;
          if (hi > maxX) maxX = hi;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        }
      }
    }
    return { live, touch: touchOf(classes), box: [minX, minY, minZ, maxX, maxY, maxZ] };
  }
}

// The lanes whose 5-bit count is k
function equals(k, b0, b1, b2, b3, b4) {
  return (k & 1 ? b0 : ~b0) & (k & 2 ? b1 : ~b1) & (k & 4 ? b2 : ~b2) & (k & 8 ? b3 : ~b3) & (k & 16 ? b4 : ~b4);
}

function popcount(v) {
  v -= (v >>> 1) & 0x55555555;
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return (Math.imul((v + (v >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24);
}

/**
 * Sets up the comparison for one chunk size and density: a world whose 27 chunks around the
 * origin's chunk are filled at random, the engine's byte step for the middle chunk, and the
 * bit-packed step for the same cells.
 * @returns {{byteStep: () => void, bitStep: () => object, check: () => string | null}}
 */
export function kernelPair(World, { n, rules, density, random }) {
  const world = new World({ rules, chunkSize: n, slabBytes: 1 << 20 });
  const cells = [];
  for (let z = -n; z < 2 * n; z++) {
    for (let y = -n; y < 2 * n; y++) {
      for (let x = -n; x < 2 * n; x++) if (random() < density) cells.push([x, y, z]);
    }
  }
  world.setCells(cells);
  const around = [];
  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const slot = world.findSlot(dx, dy, dz);
        if (slot === undefined) around.push(null);
        else {
          const [bytes, base] = world.current(slot);
          around.push(pack(bytes, base, n));
        }
      }
    }
  }
  const slot = world.findSlot(0, 0, 0);
  const stepper = new BitStepper(n, world.rules);
  return {
    byteStep: () => computeChunk(world, slot),
    bitStep: () => stepper.step(around),
    /** null if both give the same cells and facts, or what differs */
    check: () => {
      computeChunk(world, slot);
      const facts = stepper.step(around);
      const [bytes, base] = world.copy(slot, world.parity ^ 1);
      const expected = pack(bytes, base, n);
      for (let r = 0; r < n * n; r++) {
        if (expected[r] !== stepper.out[r]) return `row ${r} differs`;
      }
      if (facts.live !== world.next.live[slot]) return `live ${facts.live}, not ${world.next.live[slot]}`;
      if (facts.touch !== world.next.touch[slot]) return 'the border contacts differ';
      if (facts.live) {
        const box = Array.from(world.next.box.subarray(6 * slot, 6 * slot + 6));
        if (box.join() !== facts.box.join()) return `box ${facts.box}, not ${box}`;
      }
      return null;
    },
  };
}
