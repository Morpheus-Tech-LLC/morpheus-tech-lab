// SPDX-License-Identifier: Apache-2.0
//
// The company panel's morpheustech.net link carries the Morpheus Tech mark, inline so it can be
// drawn without the pinned favicon's dark background. These checks keep that copy the pin's:
// the same paths, in the same gilt. When the brand is re-pinned with a new mark, this fails until
// index.html's copy is updated to match.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const pathsOf = (svg) => [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);

const favicon = read('public/favicon.svg');
const html = read('index.html');
const mark = html.match(/<svg class="company-modal-mark"[\s\S]*?<\/svg>/)?.[0];

test("the company panel's mark is the pinned favicon's, without its background", () => {
  assert.ok(mark, 'index.html has the company panel mark');
  assert.ok(pathsOf(favicon).length > 0);
  assert.deepEqual(pathsOf(mark), pathsOf(favicon));
  assert.doesNotMatch(mark, /<rect/);
});

test("the mark's gilt is the pinned favicon's", () => {
  const gilt = favicon.match(/<g fill="(#[0-9a-f]{6})"/i)?.[1];
  const token = read('src/color.css').match(/--color-brand-gilt:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(gilt && token);
  assert.equal(token.toLowerCase(), gilt.toLowerCase());
  assert.match(mark, /fill="var\(--color-brand-gilt\)"/);
});
