// SPDX-License-Identifier: Apache-2.0
//
// The Atlas's paper (#186): its sections are well formed, every citation and cross-reference
// leads somewhere, every source of its own is cited, and the numbers it prints are the computed
// ones, the guide's step 6 included.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SECTIONS, PARTS, READABLE, SOURCES, TITLE, SUBTITLE, ABSTRACT, ATLAS_SOURCES, NUMBERS, HOW_TO_CITE, REVISION, sourcesInOrder, citedKeys,
  sectionLinks, blockTexts, countCell,
} from '../../src/atlas/paper.js';
import { parseInline, plainText, nodesOfType } from '../../src/atlas/markup.js';
import { STEPS } from '../../src/guide/steps.js';

const words = (sections = SECTIONS) => blockTexts(sections).map(({ text }) => plainText(parseInline(text))).join('\n');
const section = (id) => SECTIONS.find((s) => s.id === id);

test('the markup: superscripts nest, italics, citations of several sources, section links', () => {
  assert.deepEqual(parseInline('2^{2^{*n*+1}}'), [
    '2', { type: 'sup', children: ['2', { type: 'sup', children: [{ type: 'em', children: ['n'] }, '+1'] }] },
  ]);
  assert.deepEqual(parseInline('*v*_{1}'), [{ type: 'em', children: ['v'] }, { type: 'sub', children: ['1'] }]);
  assert.deepEqual(parseInline('as [cite:a, b] says'), ['as ', { type: 'cite', keys: ['a', 'b'] }, ' says']);
  assert.deepEqual(parseInline('[§counting] and [§why|why]'), [
    { type: 'section', id: 'counting' }, ' and ', { type: 'section', id: 'why', text: 'why' },
  ]);
  assert.deepEqual(parseInline('B0123478 [0, 1] x^2'), ['B0123478 [0, 1] x^2'], 'anything else is plain text');
  assert.throws(() => parseInline('2^{3'), /Unclosed/);
  assert.throws(() => parseInline('*n'), /Unclosed/);
  assert.equal(plainText(parseInline('2^{*n*+1} [cite:a]'), undefined, (k) => k.toUpperCase()), '2^(n+1) (A)');
});

test('six numbered sections, section 5 waiting for the Lexicon', () => {
  assert.deepEqual(SECTIONS.map((s) => s.number), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(SECTIONS.map((s) => s.id), ['rule', 'neighbourhoods', 'counting', 'constraints', 'lives', 'why']);
  assert.deepEqual(SECTIONS.filter((s) => s.comingSoon).map((s) => s.id), ['lives']);
  assert.deepEqual(READABLE.map((s) => s.number), [1, 2, 3, 4, 6]);
  for (const s of SECTIONS) {
    assert.ok(s.title && s.summary, `${s.id} has a title and a summary`);
    assert.equal(s.blocks.length === 0, !!s.comingSoon, `${s.id}: written, or waiting`);
  }
});

test('the contents in three parts, as the opening tells it: the map, what lives there, why explore it', () => {
  assert.deepEqual(Object.values(PARTS), ['The map', 'What lives there', 'Why explore it']);
  const ids = (part) => SECTIONS.filter((s) => s.part === part).map((s) => s.id);
  assert.deepEqual(ids(1), ['rule', 'neighbourhoods', 'counting', 'constraints']);
  assert.deepEqual(ids(2), ['lives']);
  assert.deepEqual(ids(3), ['why']);
});

test('the title and opening are about exploring Game of Life 3D, not only counting', () => {
  assert.equal(TITLE, 'An atlas of Life in 3D');
  assert.match(SUBTITLE, /^A working paper on Game of Life 3D/);
  const opening = ABSTRACT.join(' ');
  for (const words of ['still lifes, oscillators of every period and ships of many speeds', 'about 18 quadrillion',
    'maps that space and records what has been found in it', 'It begins with the map', 'citing the Lexicon', 'working paper']) {
    assert.ok(opening.includes(words), words);
  }
});

test('every block parses, and every block is a kind the page can build', () => {
  const kinds = new Set(['p', 'math', 'h', 'note', 'proof', 'table']);
  for (const s of SECTIONS) for (const b of s.blocks) assert.ok(kinds.has(b.type), `${s.id}: ${b.type}`);
  for (const { section: s, text } of blockTexts()) assert.doesNotThrow(() => parseInline(text), `${s.id}: ${text}`);
  for (const s of SECTIONS) {
    for (const b of s.blocks.filter((x) => x.type === 'table')) {
      for (const row of b.rows) assert.equal(row.length, b.head.length, `${s.id}: ${b.caption}, each row as wide as its head`);
    }
  }
});

test('every source cited exists, every source of the paper’s own is cited, and section links lead to written sections', () => {
  const cited = new Set(citedKeys());
  for (const key of cited) assert.ok(SOURCES[key], `${key} is a source`);
  for (const key of Object.keys(ATLAS_SOURCES)) assert.ok(cited.has(key), `${key} is cited`);
  assert.deepEqual(new Set(sourcesInOrder()), cited);
  for (const [key, source] of Object.entries(ATLAS_SOURCES)) {
    for (const field of ['authors', 'title', 'venue', 'short', 'url']) assert.ok(source[field], `${key}.${field}`);
    assert.match(source.url, /^https:\/\//);
  }
  const links = sectionLinks();
  assert.ok(links.length > 0);
  for (const id of links) assert.ok(READABLE.some((s) => s.id === id), `[§${id}] leads to a written section`);
  for (const { text } of blockTexts()) {
    for (const node of nodesOfType(parseInline(text), 'cite')) assert.ok(node.keys.length > 0);
  }
});

test('each written section cites the works it draws on', () => {
  for (const s of READABLE) assert.ok(citedKeys([s]).length > 0, `${s.id} cites its sources`);
});

test('the counts the paper prints are the computed ones', () => {
  const text = words();
  for (const printed of [
    '2^(512)', '1.34 × 10^(154)', '2^(2^(27))', '40,403,563', // general
    'm = 51', '2^(102)', '1,426,144', '2^(2,852,288)', // isotropic
    '2^(18) = 262,144', '2^(54) = 18,014,398,509,481,984', // outer-totalistic
    '1,024 in the plane and 268,435,456 in space', // totalistic
    '2^(17) = 131,072', '2^(53) = 9,007,199,254,740,992', // quiescent
    'B0123478/S01234678', '131,328', '2^(53) + 2^(26) = 9,007,199,321,849,856', // duality
    'about 285,000 years', 'Moore neighbourhood of range 1 in space: 26 neighbours',
  ]) {
    assert.ok(text.includes(printed), `the paper prints ${printed}`);
  }
  assert.equal(NUMBERS.moore2d.classes, 51n);
  assert.equal(NUMBERS.generalDigits3d, 40403563n);
  assert.ok(Math.abs(NUMBERS.years - 285421) < 1, `2^53 rules at 1,000 a second: ${NUMBERS.years} years`);
  assert.equal(NUMBERS.yearsRounded, 285000);
});

test('the tables: the neighbours of each neighbourhood, and four classes for eight neighbourhoods', () => {
  const tables = section('neighbourhoods').blocks.filter((b) => b.type === 'table');
  assert.deepEqual(tables[0].rows, [['Plane', '4', '8', '12', '24'], ['Space', '6', '26', '24', '124']]);
  const counts = section('counting').blocks.find((b) => b.type === 'table');
  assert.equal(counts.rows.length, 8);
  const moore3d = counts.rows[5].map((cell) => plainText(parseInline(cell)));
  assert.deepEqual(moore3d, ['Space, Moore, r = 1', '26', '2^(28) = 268,435,456', '2^(54) ≈ 1.80 × 10^(16)', '2^(2,852,288)', '2^(2^(27))']);
  assert.equal(plainText(parseInline(countCell(886151997189951005928617492495728640n))), '2^(≈ 8.86 × 10^(35))');
});

test('the guide’s step 6 and the paper agree, and step 6 links to the counting', () => {
  const step6 = STEPS.find((s) => s.id === 'three');
  assert.ok(step6.body[0].includes('262,144') && step6.body[0].includes('about 18 quadrillion'));
  assert.equal(Number(2n ** 54n / 10n ** 15n), 18, '2^54 is about 18 quadrillion');
  assert.deepEqual(step6.atlas, { text: 'How these numbers are counted', section: 'counting' });
  assert.ok(READABLE.some((s) => s.id === step6.atlas.section));
  assert.deepEqual(STEPS.filter((s) => s.atlas).map((s) => s.id), ['three'], 'only step 6 links to the Atlas, for now');
});

test('how to cite it names its revision', () => {
  assert.ok(HOW_TO_CITE.includes(`Revision ${REVISION.number}, ${REVISION.date}`));
  assert.ok(HOW_TO_CITE.endsWith('https://lab.morpheustech.net'));
});
