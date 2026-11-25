// SPDX-License-Identifier: Apache-2.0
//
// The Atlas's counts (#186): the neighbourhoods of section 2 and the sizes of the rule classes of
// section 3, computed, so that every number the paper prints comes from here and a test can
// check it. Counts are kept as exponents of 2, as BigInt, since most are far too large to write
// out. No DOM.

/**
 * @typedef {'vonNeumann' | 'moore'} Kind
 * @typedef {{ d: 2 | 3, kind: Kind, r: 1 | 2 }} Neighbourhood
 */

/** The eight neighbourhoods the paper counts, in the order of its tables. */
export const NEIGHBOURHOODS = /** @type {Neighbourhood[]} */ ([
  { d: 2, kind: 'vonNeumann', r: 1 },
  { d: 2, kind: 'moore', r: 1 },
  { d: 2, kind: 'vonNeumann', r: 2 },
  { d: 2, kind: 'moore', r: 2 },
  { d: 3, kind: 'vonNeumann', r: 1 },
  { d: 3, kind: 'moore', r: 1 },
  { d: 3, kind: 'vonNeumann', r: 2 },
  { d: 3, kind: 'moore', r: 2 },
]);

/**
 * The offsets of a neighbourhood, without the zero offset: von Neumann's have |v₁| + … + |v_d| ≤ r,
 * Moore's every |vᵢ| ≤ r.
 * @param {Neighbourhood} hood
 * @returns {number[][]}
 */
export function offsets({ d, kind, r }) {
  const out = [];
  const walk = (prefix) => {
    if (prefix.length === d) {
      const size = kind === 'moore' ? Math.max(...prefix.map(Math.abs)) : prefix.reduce((s, v) => s + Math.abs(v), 0);
      if (size > 0 && size <= r) out.push(prefix);
      return;
    }
    for (let v = -r; v <= r; v++) walk([...prefix, v]);
  };
  walk([]);
  return out;
}

function binomial(n, k) {
  if (k < 0 || k > n) return 0;
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
}

/**
 * The number of neighbours, by the paper's formulas: Moore (2r + 1)^d − 1, von Neumann
 * Σₖ 2ᵏ C(d, k) C(r, k) − 1 (which k coordinates are not zero, their signs, and k positive values
 * adding up to at most r).
 * @param {Neighbourhood} hood
 */
export function neighbourCount({ d, kind, r }) {
  if (kind === 'moore') return (2 * r + 1) ** d - 1;
  let n = 0;
  for (let k = 0; k <= d; k++) n += 2 ** k * binomial(d, k) * binomial(r, k);
  return n - 1;
}

/**
 * The symmetries of the square (d = 2, 8 of them) or the cube (d = 3, 48): every way to permute
 * the axes and flip their signs.
 * @param {number} d
 * @returns {((v: number[]) => number[])[]}
 */
export function symmetries(d) {
  const perms = [];
  const permute = (rest, done) => {
    if (!rest.length) perms.push(done);
    rest.forEach((axis, i) => permute([...rest.slice(0, i), ...rest.slice(i + 1)], [...done, axis]));
  };
  permute([...Array(d).keys()], []);
  const out = [];
  for (const perm of perms) {
    for (let signs = 0; signs < 2 ** d; signs++) {
      out.push((v) => perm.map((axis, i) => ((signs >> i) & 1 ? -1 : 1) * v[axis]));
    }
  }
  return out;
}

/**
 * The number of cycles a symmetry splits the neighbourhood's cells into.
 * @param {number[][]} cells
 * @param {(v: number[]) => number[]} g
 */
export function cycles(cells, g) {
  const index = new Map(cells.map((v, i) => [v.join(), i]));
  const seen = new Array(cells.length).fill(false);
  let count = 0;
  for (let i = 0; i < cells.length; i++) {
    if (seen[i]) continue;
    count++;
    for (let j = i; !seen[j]; j = index.get(g(cells[j]).join())) seen[j] = true;
  }
  return count;
}

/**
 * The number of arrangements of the neighbours up to rotation and reflection, by the
 * orbit-counting (Burnside's) lemma: the average over the symmetries g of 2^c(g).
 * @param {Neighbourhood} hood
 * @returns {bigint}
 */
export function isotropicClasses(hood) {
  const cells = offsets(hood);
  const group = symmetries(hood.d);
  const total = group.reduce((sum, g) => sum + 2n ** BigInt(cycles(cells, g)), 0n);
  if (total % BigInt(group.length) !== 0n) throw new Error('Burnside’s sum must divide evenly');
  return total / BigInt(group.length);
}

/**
 * The four classes of section 3, each as the exponent e of its count 2^e.
 * @param {Neighbourhood} hood
 */
export function ruleCounts(hood) {
  const n = neighbourCount(hood);
  const classes = isotropicClasses(hood);
  return {
    n,
    /** Every arrangement of the cell and its neighbours, 2^(n+1) inputs */
    inputs: 2n ** BigInt(n + 1),
    /** 2^(2^(n+1)) */
    general: 2n ** BigInt(n + 1),
    /** Arrangements of the neighbours up to symmetry, for each state of the cell */
    classes,
    /** 2^(2m) */
    isotropic: 2n * classes,
    /** 2^(2n+2) */
    outerTotalistic: BigInt(2 * n + 2),
    /** 2^(n+2) */
    totalistic: BigInt(n + 2),
  };
}

/**
 * log₁₀ 2 to 60 decimal places, as an integer scaled by 10⁶⁰, for the digits of 2^e when e is
 * too large for a float to get exactly.
 */
const LOG10_2 = 301029995663981195213738894724493026768189881462108541310427n;
const SCALE = 10n ** 60n;

/**
 * How many decimal digits 2^e has: ⌊e log₁₀ 2⌋ + 1. Exact while e has fewer than about 55
 * digits, which covers every count in the paper.
 * @param {bigint} e
 */
export function digitsOfPowerOfTwo(e) {
  return (e * LOG10_2) / SCALE + 1n;
}

/**
 * 2^e as m × 10^k, m rounded to the given significant digits.
 * @param {bigint} e - small enough for a float's logarithm (below about 10¹⁵)
 * @returns {{ mantissa: string, exponent: number }}
 */
export function scientific(e, digits = 3) {
  const log = Number(e) * Math.log10(2);
  let exponent = Math.floor(log);
  let mantissa = (10 ** (log - exponent)).toFixed(digits - 1);
  if (Number(mantissa) >= 10) {
    exponent += 1;
    mantissa = (Number(mantissa) / 10).toFixed(digits - 1);
  }
  return { mantissa, exponent };
}

/**
 * A whole number with thousands separated by commas, as the paper prints them.
 * @param {bigint | number} x
 */
export function grouped(x) {
  return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * The dual of an outer-totalistic rule, the rule with alive and dead swapped:
 * B′ = { n − k : k ∉ S }, S′ = { n − k : k ∉ B }.
 * @param {{ birth: number[], survival: number[] }} rule
 * @param {number} n - the number of neighbours
 */
export function dual({ birth, survival }, n) {
  const all = [...Array(n + 1).keys()];
  return {
    birth: all.filter((k) => !survival.includes(k)).map((k) => n - k).sort((a, b) => a - b),
    survival: all.filter((k) => !birth.includes(k)).map((k) => n - k).sort((a, b) => a - b),
  };
}

/**
 * Outer-totalistic rules up to duality, as (2^(2n+2) + 2^(n+1)) / 2: a rule is its own dual for
 * each of the 2^(n+1) birth sets.
 * @param {number} n
 * @returns {bigint}
 */
export function rulesUpToDuality(n) {
  return (2n ** BigInt(2 * n + 2) + 2n ** BigInt(n + 1)) / 2n;
}
