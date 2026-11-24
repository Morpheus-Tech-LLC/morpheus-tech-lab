// SPDX-License-Identifier: Apache-2.0
//
// The readouts above the control bar hold their width while their values change (#175).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { holdWidth, countWidth } from '../src/readouts.js';
import { watchGenerationText } from '../src/contests/format.js';

const value = () => ({ style: { minWidth: '' } });

test("a value's slot is as many characters wide as the longest text it will show", () => {
  const el = value();
  holdWidth(el, countWidth(500));
  assert.equal(el.style.minWidth, '9ch'); // "500 / 500"
  holdWidth(el, '9,999,999');
  assert.equal(el.style.minWidth, '9ch');
  holdWidth(el, '-');
  assert.equal(el.style.minWidth, '1ch');
});

test('a count never outgrows its slot on the way up', () => {
  for (const last of [0, 9, 10, 99, 100, 1000, 12345]) {
    const slot = countWidth(last).length;
    for (const current of [0, 1, Math.floor(last / 2), last]) assert.ok(`${current} / ${last}`.length <= slot);
  }
});

test("Watch's generation never outgrows the slot set from its last generation", () => {
  for (const last of [0, 7, 449, 1000, 9999]) {
    const slot = watchGenerationText(last, last).length;
    for (const current of [0, 1, Math.floor(last / 2), last]) assert.ok(watchGenerationText(current, last).length <= slot, `${current} of ${last}`);
  }
});

test('without an element, nothing happens', () => {
  assert.doesNotThrow(() => holdWidth(null, '123'));
});
