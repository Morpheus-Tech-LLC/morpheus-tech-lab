// SPDX-License-Identifier: Apache-2.0
//
// The Atlas's working paper (#185, #186), as data: its sections, each a list of blocks whose text
// uses markup.js's inline markup, and the works it cites. Every count it prints is computed by
// counts.js as the module loads, so the words and the numbers can't drift apart; a test checks
// counts.js against computations of its own. Sources shared with the Info guide come from its
// SOURCES, not copies. No DOM.

import { SOURCES as GUIDE_SOURCES, citation } from '../guide/steps.js';
import {
  NEIGHBOURHOODS, ruleCounts, neighbourCount, digitsOfPowerOfTwo, scientific, grouped, dual, rulesUpToDuality,
} from './counts.js';

export { citation };

/** Works the paper cites that the guide doesn't. Same shape as the guide's sources. */
export const ATLAS_SOURCES = {
  packardWolfram1985: {
    authors: 'Norman H. Packard and Stephen Wolfram',
    year: 1985,
    title: 'Two-dimensional cellular automata',
    venue: 'Journal of Statistical Physics 38 (5–6), 901–946',
    url: 'https://doi.org/10.1007/BF01010423',
    short: 'Packard, Wolfram 1985',
  },
};

/** Every work the paper may cite, by key. */
export const SOURCES = { ...GUIDE_SOURCES, ...ATLAS_SOURCES };

export const TITLE = 'An atlas of Life in 3D';
export const SUBTITLE = 'A working paper on Game of Life 3D: its rules, what lives in them, and what is still unknown';
export const REVISION = { number: 1, date: 'November 2026' };
export const SITE = 'https://lab.morpheustech.net';
export const REPO = 'https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab';

/** How to cite the paper, as its index gives it. */
export const HOW_TO_CITE =
  `Morpheus Tech Lab and contributors. ${TITLE}. ${SUBTITLE}. Revision ${REVISION.number}, ${REVISION.date}. ${SITE}`;

export const ABSTRACT = [
  'Conway’s Game of Life is one rule on a flat grid, and decades of exploring it have found still lifes, oscillators of every period and ships of many speeds. Game of Life 3D moves the game into space, where each cell has 26 neighbours and rules of the same kind number about 18 quadrillion, far more than anyone could run one by one. This atlas maps that space and records what has been found in it.',
  'It begins with the map: what a rule is, the neighbourhoods a cell can see, how many rules each class holds and how constraints narrow them, with every count proved. It goes on to what lives there, citing the Lexicon, the lab’s record of creations and who found them, and to why the lab exists: to explore this space in the open, with anyone who wants to.',
  'It is a working paper: it is revised as the lab and its community find more, and anyone can question or improve it. The Lexicon joins it in a later revision.',
];

// ---- The numbers, computed ----

const byName = (d, kind, r) => NEIGHBOURHOODS.find((h) => h.d === d && h.kind === kind && h.r === r);
const MOORE_2D = ruleCounts(byName(2, 'moore', 1));
const MOORE_3D = ruleCounts(byName(3, 'moore', 1));
const pow = (e) => `2^{${grouped(e)}}`;
const exact = (e) => `${pow(e)} = ${grouped(2n ** BigInt(e))}`;
const approx = (e) => {
  const { mantissa, exponent } = scientific(BigInt(e));
  return `${mantissa} × 10^{${exponent}}`;
};

/**
 * A count 2^e as a table cell: written out while short, then as a power with its size, then as a
 * power whose exponent is itself rounded.
 * @param {bigint} e
 */
export function countCell(e) {
  if (e <= 30n) return exact(e);
  if (e <= 1000n) return `${pow(e)} ≈ ${approx(e)}`;
  if (e < 10n ** 15n) return pow(e);
  const digits = String(e).length;
  const lead = `${String(e)[0]}.${String(e).slice(1, 3)}`;
  return `2^{≈ ${lead} × 10^{${digits - 1}}}`;
}

const hoodName = ({ kind, r }) => `${kind === 'moore' ? 'Moore' : 'von Neumann'}, *r* = ${r}`;
const CONWAY = { birth: [3], survival: [2, 3] };
const CONWAY_DUAL = dual(CONWAY, 8);
const bs = ({ birth, survival }) => `B${birth.join('')}/S${survival.join('')}`;
const QUIESCENT_3D = MOORE_3D.outerTotalistic - 1n;
// A thousand rules a second, for a Julian year of 365.25 days
const YEARS = Number(2n ** QUIESCENT_3D / 1000n) / (365.25 * 24 * 3600);
const YEARS_ROUNDED = Math.round(YEARS / 5000) * 5000;

/** Numbers the tests check against the paper's words. */
export const NUMBERS = {
  moore2d: MOORE_2D,
  moore3d: MOORE_3D,
  generalDigits3d: digitsOfPowerOfTwo(MOORE_3D.general),
  dual2d: rulesUpToDuality(8),
  dual3d: rulesUpToDuality(26),
  conwayDual: CONWAY_DUAL,
  years: YEARS,
  yearsRounded: YEARS_ROUNDED,
};

// ---- The sections ----

/**
 * @typedef {{ type: 'p' | 'math' | 'h' | 'note', text: string }
 *   | { type: 'proof', text: string[] }
 *   | { type: 'table', caption: string, head: string[], rows: string[][] }} Block
 * @typedef {object} Section
 * @property {string} id
 * @property {number} number
 * @property {number} part - which part of the contents it is in, a key of PARTS
 * @property {string} title
 * @property {string} summary - its line in the index
 * @property {Block[]} blocks
 * @property {string} [comingSoon] - not written yet: what it waits for, shown in the index
 */

const p = (text) => ({ type: 'p', text });
const math = (text) => ({ type: 'math', text });
const h = (text) => ({ type: 'h', text });
const note = (text) => ({ type: 'note', text });
const proof = (...text) => ({ type: 'proof', text });

/**
 * The contents' parts, as the paper's opening describes it: the map, what lives there, and why
 * explore it. The Lexicon is listed in part 2, after its section; the sources come last.
 */
export const PARTS = { 1: 'The map', 2: 'What lives there', 3: 'Why explore it' };

/** @type {Section[]} */
export const SECTIONS = [
  {
    id: 'rule',
    number: 1,
    part: 1,
    title: 'What a rule is',
    summary: 'Cells, neighbourhoods, and a rule as a function.',
    blocks: [
      p('Life is played on a grid of cells, each alive or dead. In the plane the grid is ℤ^{2}, the points with whole-number coordinates; in space it is ℤ^{3}. Time moves in steps called generations. At each step every cell looks at the same pattern of nearby cells, its *neighbourhood*, and every cell changes state by the same rule, all at once.'),
      p('Write the neighbourhood as a set *N* of *n* offsets, none of them zero, so that the neighbours of the cell at *x* are the cells at *x* + *v* for each *v* in *N*. A rule is then a function'),
      math('*f* : {0, 1}^{*n*+1} → {0, 1}'),
      p('that takes the cell’s own state and the states of its *n* neighbours, and gives the cell’s state in the next generation. Everything the grid will ever do follows from *f* and the cells alive at the start.'),
      p('Conway’s Life uses the eight cells around a cell, and a rule that only counts them: a dead cell with exactly 3 live neighbours comes to life, a live cell with 2 or 3 stays alive, and every other cell dies or stays dead [cite:gardner1970]. In the lab’s shorthand that is B3/S23. Packard and Wolfram call such a rule outer totalistic [cite:packardWolfram1985]; [§counting] says what that means, and how many such rules there are.'),
    ],
  },
  {
    id: 'neighbourhoods',
    number: 2,
    part: 1,
    title: 'Neighbourhoods',
    summary: 'Von Neumann and Moore, at range 1 and 2, in the plane and in space.',
    blocks: [
      p('Two families of neighbourhoods are in common use, each with a range *r*, how far a cell can see. The *von Neumann* neighbourhood of range *r* holds the offsets whose coordinates add up, ignoring signs, to at most *r*:'),
      math('|*v*_{1}| + … + |*v*_{*d*}| ≤ *r*'),
      p('The *Moore* neighbourhood of range *r* holds the offsets whose coordinates are each at most *r*:'),
      math('max(|*v*_{1}|, …, |*v*_{*d*}|) ≤ *r*'),
      p('Both leave out the zero offset, the cell itself. At range 1 in the plane they are the 4 cells that share an edge with a cell and the 8 cells around it, the neighbourhoods Packard and Wolfram call five-neighbour and nine-neighbour square, counting the cell [cite:packardWolfram1985]. In space they are the 6 cells that share a face and the 26 cells of the surrounding 3 × 3 × 3 cube. At range 2 the neighbourhood is called extended.'),
      p('The Moore neighbourhood is a cube of side 2*r* + 1 without its centre, so in *d* dimensions it has (2*r* + 1)^{*d*} − 1 cells. The von Neumann neighbourhood is a diamond in the plane and an octahedron in space. To count its points, choose which *k* coordinates are not zero, in C(*d*, *k*) ways, their signs, in 2^{*k*} ways, and their sizes, *k* whole numbers from 1 up that add up to at most *r*, in C(*r*, *k*) ways:'),
      math('*n* = Σ_{*k*} 2^{*k*} C(*d*, *k*) C(*r*, *k*) − 1'),
      {
        type: 'table',
        caption: 'Neighbours of a cell',
        head: ['', 'von Neumann, *r* = 1', 'Moore, *r* = 1', 'von Neumann, *r* = 2', 'Moore, *r* = 2'],
        rows: [2, 3].map((d) => [
          d === 2 ? 'Plane' : 'Space',
          ...[['vonNeumann', 1], ['moore', 1], ['vonNeumann', 2], ['moore', 2]]
            .map(([kind, r]) => String(neighbourCount({ d, kind, r }))),
        ]),
      },
      p(`The lab’s Game of Life 3D uses the Moore neighbourhood of range 1 in space: ${MOORE_3D.n} neighbours.`),
    ],
  },
  {
    id: 'counting',
    number: 3,
    part: 1,
    title: 'Counting rules',
    summary: 'General, isotropic, outer-totalistic and totalistic rules, each counted and proved.',
    blocks: [
      p('A cell and its *n* neighbours can be in 2^{*n*+1} arrangements. A class of rules restricts what *f* may do with them, and each class below can be counted exactly.'),
      h('General rules'),
      p('With no restriction, *f* may give 0 or 1 for each of the 2^{*n*+1} arrangements, each chosen on its own, so there are'),
      math('2^{2^{*n*+1}}'),
      p(`general rules. In the plane with eight neighbours that is 2^{512}, about ${approx(512)}, as Packard and Wolfram’s table gives [cite:packardWolfram1985]. In space with ${MOORE_3D.n} neighbours it is 2^{2^{27}}, a number with ${grouped(NUMBERS.generalDigits3d)} digits.`),
      h('Isotropic rules'),
      p('A grid looks the same after it is turned or mirrored, and most rules worth studying respect that: they treat two arrangements of neighbours alike when a rotation or a reflection carries one onto the other. Such rules are isotropic; Packard and Wolfram call them completely symmetric [cite:packardWolfram1985]. The square has 8 such symmetries, and the cube 48.'),
      p('An isotropic rule chooses one output for each class of arrangements that the symmetries carry into each other, an orbit. The orbit-counting lemma, often called Burnside’s lemma, counts them: the number of orbits is the average, over the symmetries *g* in the group *G*, of the number of arrangements fix(*g*) that *g* leaves unchanged.'),
      proof(
        'Count the pairs (*g*, *a*) in which the symmetry *g* leaves the arrangement *a* unchanged. Taken arrangement by arrangement, the symmetries that fix *a* number |*G*| divided by the size of *a*’s orbit, so each orbit contributes exactly |*G*| pairs, and there are |*G*| times as many pairs as orbits. Taken symmetry by symmetry, there are fix(*g*) pairs for each *g*. Equate the two and divide by |*G*|.',
      ),
      p('A symmetry permutes the neighbourhood’s cells in cycles, and leaves an arrangement unchanged exactly when the arrangement is the same along each cycle, so fix(*g*) = 2^{*c*(*g*)}, where *c*(*g*) is the number of cycles. The cell itself never moves, so a live cell and a dead one each have the same number of orbits, *m*, and'),
      math('2^{2*m*} isotropic rules, where *m* = (1 / |*G*|) Σ_{*g*} 2^{*c*(*g*)}'),
      p(`In the plane with eight neighbours *m* = ${MOORE_2D.classes}, so there are ${pow(MOORE_2D.isotropic)} isotropic rules, as Packard and Wolfram’s table gives. In space with ${MOORE_3D.n} neighbours *m* = ${grouped(MOORE_3D.classes)}, and there are ${pow(MOORE_3D.isotropic)}.`),
      h('Outer-totalistic rules'),
      p('An outer-totalistic rule looks only at the cell’s own state and at how many of its neighbours are alive, from 0 to *n* [cite:packardWolfram1985]. It is a birth set *B*, the counts at which a dead cell comes to life, and a survival set *S*, the counts at which a live cell stays alive. Each is any subset of the *n* + 1 counts, so there are'),
      math('2^{*n*+1} × 2^{*n*+1} = 2^{2*n*+2}'),
      p(`outer-totalistic rules: ${exact(MOORE_2D.outerTotalistic)} in the plane, as in Packard and Wolfram’s table, and ${exact(MOORE_3D.outerTotalistic)} in space, the 18 quadrillion of the Info guide’s step 6. Conway’s B3/S23 is one of the first; the lab’s default, B9,10/S5–15, is one of the second.`),
      h('Totalistic rules'),
      p('A totalistic rule looks only at how many cells of the neighbourhood are alive, the cell itself included, from 0 to *n* + 1, and so forgets whether the cell was alive [cite:packardWolfram1985]. Each of the *n* + 2 totals can give 0 or 1, and every total occurs, so each choice is a different rule:'),
      math('2^{*n*+2}'),
      p(`totalistic rules: ${grouped(2n ** MOORE_2D.totalistic)} in the plane and ${grouped(2n ** MOORE_3D.totalistic)} in space.`),
      note('Packard and Wolfram’s table lists 2^{9} = 512 totalistic rules for the nine-cell square neighbourhood, half the count above, and it gives one power of 2 fewer for each of its neighbourhoods; it doesn’t say why. Counting every function of the total gives 2^{10}, and the lab’s tests check that count. This is a working paper: if you know the reason, tell us.'),
      h('Classes inside classes'),
      p('Every totalistic rule is outer-totalistic, since the total is the cell’s state plus its neighbour count. Every outer-totalistic rule is isotropic, since turning the neighbourhood doesn’t change a count. And every isotropic rule is a rule. So'),
      math('totalistic ⊂ outer-totalistic ⊂ isotropic ⊂ general'),
      {
        type: 'table',
        caption: 'Rules of each class, for each neighbourhood',
        head: ['', 'Neighbours', 'Totalistic', 'Outer-totalistic', 'Isotropic', 'General'],
        rows: NEIGHBOURHOODS.map((hood) => {
          const c = ruleCounts(hood);
          return [
            `${hood.d === 2 ? 'Plane' : 'Space'}, ${hoodName(hood)}`,
            String(c.n),
            countCell(c.totalistic),
            countCell(c.outerTotalistic),
            countCell(c.isotropic),
            `2^{2^{${c.n + 1}}}`,
          ];
        }),
      },
    ],
  },
  {
    id: 'constraints',
    number: 4,
    part: 1,
    title: 'Making the space smaller',
    summary: 'Quiescence, duality, behaviour, walls, and why the rest is still too big to search.',
    blocks: [
      p('The classes above come from symmetry. Other constraints come from what a rule should do, and some of them cut the space by an amount that can be counted.'),
      h('Quiescence'),
      p(`A rule is quiescent when an empty world stays empty: a dead cell with no live neighbours stays dead, so 0 is not in *B*. Packard and Wolfram note that this halves each count [cite:packardWolfram1985]. Among outer-totalistic rules it leaves ${exact(MOORE_2D.outerTotalistic - 1n)} in the plane and ${exact(QUIESCENT_3D)} in space. A rule with B0 would bring every empty cell of an unbounded world to life at once, so the lab’s Game of Life 3D (unbounded) doesn’t allow it.`),
      h('Duality'),
      p('Swap alive and dead everywhere, run a rule for one generation, and swap back: the result is another rule, the dual, which does to dead cells what the first does to live ones. A cell with *k* live neighbours has *n* − *k* dead ones, so the dual of an outer-totalistic rule *B*/*S* is'),
      math('*B*′ = { *n* − *k* : *k* ∉ *S* },  *S*′ = { *n* − *k* : *k* ∉ *B* }'),
      p(`Conway’s B3/S23 has the dual ${bs(CONWAY_DUAL)}, which behaves exactly as Life does with the colours swapped. Taking the dual twice gives back the rule, so rules come in pairs that behave alike, except for rules that are their own dual. A rule is its own dual when *S* is determined by *B*: *n* − *k* is in *S* exactly when *k* isn’t in *B*. Any *B* will do, so 2^{*n*+1} rules are their own dual, and the outer-totalistic rules that behave differently number`),
      math('(2^{2*n*+2} + 2^{*n*+1}) / 2'),
      p(`${grouped(NUMBERS.dual2d)} in the plane, and 2^{53} + 2^{26} = ${grouped(NUMBERS.dual3d)} in space.`),
      h('Behaviour'),
      p('Carter Bays asked which rules in space deserve Life’s name, and set two conditions: gliders must arise on their own from random soup, and no random soup may grow without end. Of the rules he tried, only two passed, B5/S4,5 and B6/S5–7 [cite:bays1987]. Conditions on behaviour can’t be counted as symmetries can: each rule has to be run to be judged.'),
      h('Walls'),
      p('In a box, a cell on a face has 17 neighbours, a cell on an edge 11, and a cell at a corner 7. A rule written for 26 neighbours doesn’t fit them, so the lab’s Game of Life 3D (bounded) gives faces, edges and corners rules of their own, and a rule for the box is four rules at once.'),
      h('Scale'),
      p(`Even after these cuts, the space is too large to search one rule at a time. Suppose a computer could judge a thousand rules a second, each run long enough to see what it does. The ${pow(QUIESCENT_3D)} quiescent outer-totalistic rules in space would take it about ${grouped(YEARS_ROUNDED)} years. The space can only be sampled, steered through by theory, and explored by many people at once.`),
    ],
  },
  {
    id: 'lives',
    number: 5,
    part: 2,
    title: 'What lives in the space',
    summary: 'Still lifes, oscillators, ships and methuselahs, citing the Lexicon.',
    comingSoon: 'Coming with the Lexicon',
    blocks: [],
  },
  {
    id: 'why',
    number: 6,
    part: 3,
    title: 'Why this lab',
    summary: 'An instrument for exploring the space, open to everyone.',
    blocks: [
      p('The lab is an instrument for exploring this space. Pick a rule, seed it, and watch what lives in it; then measure it: how it grows, what it leaves behind, how long it lasts.'),
      p(`Most of what is known about Life-like rules comes from the plane. Conway’s rule alone has yielded still lifes, oscillators of every period and ships of many speeds [cite:gardner1970,brown2023,gemini,sirRobin]. Yet it is one of ${grouped(2n ** MOORE_2D.outerTotalistic)} outer-totalistic rules in the plane, and those are a small corner beside the ${pow(MOORE_3D.outerTotalistic)} in space, of which little has been mapped.`),
      p('Cellular automata have explained real things: the scales of a lizard, the flow of fluids, traffic jams, the avalanches of a sandpile (the Info guide’s step 8). The next finding may come from a rule no one has run yet. The lab exists, in part, to find such rules and record what lives in them, so that what is found here can add to science.'),
      p('That is also why the lab is open source, under the Apache License 2.0. Anyone can read how it works and check its results, improve the software, add new simulations, and share what they find: in Discussions, through the contests and the Hall of Fame, and, once it arrives, in this atlas’s Lexicon.'),
    ],
  },
];

/** The sections a visitor can open, in order: those written. */
export const READABLE = SECTIONS.filter((s) => !s.comingSoon);

/** The paper's cited sources, in order of first citation. */
export function sourcesInOrder(sections = SECTIONS) {
  const keys = [];
  for (const key of citedKeys(sections)) if (!keys.includes(key)) keys.push(key);
  return keys;
}

/** Every [cite:key] in the given sections, in order, repeats included. */
export function citedKeys(sections = SECTIONS) {
  return blockTexts(sections).flatMap(({ text }) => [...text.matchAll(/\[cite:([^\]]+)\]/g)].flatMap((m) => m[1].split(',').map((k) => k.trim())));
}

/** Every [§id] in the given sections. */
export function sectionLinks(sections = SECTIONS) {
  return blockTexts(sections).flatMap(({ text }) => [...text.matchAll(/\[§([^\]|]+)/g)].map((m) => m[1]));
}

/** Every piece of marked-up text, with the section it is in. */
export function blockTexts(sections = SECTIONS) {
  return sections.flatMap((section) => section.blocks.flatMap((block) => {
    const texts = block.type === 'table' ? [block.caption, ...block.head, ...block.rows.flat()]
      : block.type === 'proof' ? block.text : [block.text];
    return texts.map((text) => ({ section, text }));
  }));
}
