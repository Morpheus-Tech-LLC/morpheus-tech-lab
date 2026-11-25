// SPDX-License-Identifier: Apache-2.0
//
// The Atlas's counts (#186), checked three ways: by brute force where the space is small enough
// to enumerate, against Packard and Wolfram's published table (J. Stat. Phys. 38, 1985, p. 903),
// and, for the 3D counts too large to enumerate, against an independent computation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  NEIGHBOURHOODS, offsets, neighbourCount, symmetries, isotropicClasses, ruleCounts, digitsOfPowerOfTwo,
  scientific, grouped, dual, rulesUpToDuality,
} from '../../src/atlas/counts.js';

const hood = (d, kind, r) => ({ d, kind, r });
const VN2 = hood(2, 'vonNeumann', 1);
const MOORE2 = hood(2, 'moore', 1);
const VN3 = hood(3, 'vonNeumann', 1);
const MOORE3 = hood(3, 'moore', 1);

test('each neighbourhood has the cells its formula says: 4, 8, 12, 24 in the plane; 6, 26, 24, 124 in space', () => {
  assert.deepEqual(NEIGHBOURHOODS.map((h) => offsets(h).length), [4, 8, 12, 24, 6, 26, 24, 124]);
  for (const h of NEIGHBOURHOODS) {
    assert.equal(neighbourCount(h), offsets(h).length, `${JSON.stringify(h)}: the formula agrees with the cells`);
    assert.ok(offsets(h).every((v) => v.some((x) => x !== 0)), 'never the cell itself');
    assert.equal(new Set(offsets(h).map((v) => v.join())).size, offsets(h).length, 'each cell once');
  }
});

test('the square has 8 symmetries and the cube 48, each carrying every neighbourhood onto itself', () => {
  for (const [d, size] of [[2, 8], [3, 48]]) {
    const group = symmetries(d);
    assert.equal(group.length, size);
    const probe = d === 2 ? [1, 2] : [1, 2, 3];
    assert.equal(new Set(group.map((g) => g(probe).join())).size, size, 'all different');
    for (const h of NEIGHBOURHOODS.filter((n) => n.d === d)) {
      const cells = new Set(offsets(h).map((v) => v.join()));
      for (const g of group) assert.ok(offsets(h).every((v) => cells.has(g(v).join())));
    }
  }
});

/** Orbits of the neighbours' arrangements, by listing every arrangement and its smallest image */
function orbitsByBruteForce(h) {
  const cells = offsets(h);
  const index = new Map(cells.map((v, i) => [v.join(), i]));
  const maps = symmetries(h.d).map((g) => cells.map((v) => index.get(g(v).join())));
  const seen = new Set();
  for (let a = 0; a < 2 ** cells.length; a++) {
    let least = a;
    for (const map of maps) {
      let b = 0;
      for (let i = 0; i < cells.length; i++) if ((a >> i) & 1) b |= 1 << map[i];
      if (b < least) least = b;
    }
    seen.add(least);
  }
  return BigInt(seen.size);
}

test('Burnside’s count of isotropic classes matches listing every arrangement', () => {
  for (const h of [VN2, MOORE2, VN3, hood(2, 'vonNeumann', 2)]) {
    assert.equal(isotropicClasses(h), orbitsByBruteForce(h), JSON.stringify(h));
  }
  assert.equal(isotropicClasses(MOORE2), 51n);
});

test('the plane’s counts are Packard and Wolfram’s Table 1 (general, completely symmetric, outer totalistic)', () => {
  const five = ruleCounts(VN2), nine = ruleCounts(MOORE2);
  assert.equal(five.general, 32n);
  assert.equal(nine.general, 512n);
  assert.equal(five.isotropic, 12n);
  assert.equal(nine.isotropic, 102n);
  assert.equal(five.outerTotalistic, 10n);
  assert.equal(nine.outerTotalistic, 18n);
});

test('space’s counts match an independent computation (Python, Burnside over the cube’s 48 symmetries, 2026-11-25)', () => {
  const c = ruleCounts(MOORE3);
  assert.equal(c.n, 26);
  assert.equal(c.general, 2n ** 27n);
  assert.equal(c.classes, 1426144n);
  assert.equal(c.isotropic, 2852288n);
  assert.equal(c.outerTotalistic, 54n);
  assert.equal(c.totalistic, 28n);
  assert.equal(isotropicClasses(VN3), 10n);
  assert.equal(isotropicClasses(hood(3, 'vonNeumann', 2)), 372264n);
  assert.equal(isotropicClasses(hood(2, 'moore', 2)), 2105872n);
  assert.equal(ruleCounts(hood(3, 'moore', 2)).isotropic, 886151997189951005928617492495728640n);
});

/** Each rule of a class as its full truth table, over every arrangement of the cell and its n neighbours */
function truthTables(n, rule) {
  const tables = new Set();
  return { tables, add: (choice) => {
    let table = 0n;
    for (let a = 0; a < 2 ** (n + 1); a++) {
      const alive = a & 1;
      let count = 0;
      for (let i = 1; i <= n; i++) count += (a >> i) & 1;
      if (rule(choice, alive, count)) table |= 1n << BigInt(a);
    }
    tables.add(table);
  } };
}

test('totalistic and outer-totalistic counts, by listing every rule’s truth table (four neighbours)', () => {
  const n = 4;
  const total = truthTables(n, (g, alive, count) => (g >> (alive + count)) & 1);
  for (let g = 0; g < 2 ** (n + 2); g++) total.add(g);
  assert.equal(BigInt(total.tables.size), 2n ** ruleCounts(VN2).totalistic, '2^(n+2) different rules');
  const outer = truthTables(n, (bs, alive, count) => (bs >> (alive * (n + 1) + count)) & 1);
  for (let bs = 0; bs < 2 ** (2 * n + 2); bs++) outer.add(bs);
  assert.equal(BigInt(outer.tables.size), 2n ** ruleCounts(VN2).outerTotalistic, '2^(2n+2) different rules');
  for (const t of total.tables) assert.ok(outer.tables.has(t), 'every totalistic rule is outer-totalistic');
});

test('digits of 2^e, exactly', () => {
  for (const e of [0n, 1n, 9n, 10n, 54n, 512n, 1000n, 2999n]) {
    assert.equal(digitsOfPowerOfTwo(e), BigInt(String(2n ** e).length), `2^${e}`);
  }
  // From Python's decimal module at 90 digits, 2026-11-25
  assert.equal(digitsOfPowerOfTwo(2n ** 27n), 40403563n);
  assert.equal(digitsOfPowerOfTwo(2n ** 125n), 12804399929842420468751513656262904088n);
});

test('scientific and grouped numbers', () => {
  assert.deepEqual(scientific(512n), { mantissa: '1.34', exponent: 154 });
  assert.deepEqual(scientific(54n), { mantissa: '1.80', exponent: 16 });
  assert.deepEqual(scientific(10n), { mantissa: '1.02', exponent: 3 });
  assert.equal(grouped(2n ** 54n), '18,014,398,509,481,984');
  assert.equal(grouped(51), '51');
});

test('the dual swaps alive and dead: Conway’s B3/S23 becomes B0123478/S01234678, cell by cell', () => {
  const conway = { birth: [3], survival: [2, 3] };
  const d = dual(conway, 8);
  assert.deepEqual(d, { birth: [0, 1, 2, 3, 4, 7, 8], survival: [0, 1, 2, 3, 4, 6, 7, 8] });
  const next = ({ birth, survival }, alive, count) => (alive ? survival : birth).includes(count);
  for (let alive = 0; alive <= 1; alive++) {
    for (let count = 0; count <= 8; count++) {
      assert.equal(next(d, alive, count), !next(conway, 1 - alive, 8 - count), 'f′(x) = not f(not x)');
    }
  }
  assert.deepEqual(dual(d, 8), conway, 'twice gives the rule back');
});

test('rules up to duality, by pairing every outer-totalistic rule with its dual', () => {
  for (const n of [4, 8]) {
    const mask = (list) => list.reduce((m, k) => m | (1 << k), 0);
    const counts = [...Array(n + 1).keys()];
    let selfDual = 0;
    for (let b = 0; b < 2 ** (n + 1); b++) {
      for (let s = 0; s < 2 ** (n + 1); s++) {
        const rule = { birth: counts.filter((k) => (b >> k) & 1), survival: counts.filter((k) => (s >> k) & 1) };
        const d = dual(rule, n);
        if (mask(d.birth) === b && mask(d.survival) === s) selfDual++;
      }
    }
    assert.equal(selfDual, 2 ** (n + 1), `${2 ** (n + 1)} rules are their own dual (n = ${n})`);
    assert.equal(rulesUpToDuality(n), BigInt((2 ** (2 * n + 2) + selfDual) / 2));
  }
  assert.equal(rulesUpToDuality(8), 131328n);
  assert.equal(rulesUpToDuality(26), 2n ** 53n + 2n ** 26n);
});
