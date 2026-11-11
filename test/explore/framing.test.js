// SPDX-License-Identifier: Apache-2.0
//
// Explore's camera framing (src/explore/framing.js).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frameBox, ease, MARGIN, MIN_DISTANCE } from '../../src/explore/framing.js';

const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);

test('with nothing to show, the camera looks at the origin from its closest distance', () => {
  assert.deepEqual(frameBox(null, 75, 1.5), { centre: [0, 0, 0], radius: 0, distance: MIN_DISTANCE });
});

test('a small pattern is seen from the closest distance, not filled edge to edge', () => {
  const { distance } = frameBox({ min: [0, 0, 0], max: [2, 2, 2] }, 75, 1.5);
  assert.equal(distance, MIN_DISTANCE);
});

test('a big pattern fits the narrower of the two fields of view, with a margin', () => {
  const box = { min: [-100, -40, 10], max: [99, 39, 209] };
  const wide = frameBox(box, 60, 2);
  assert.deepEqual(wide.centre, [-0.5, -0.5, 109.5]);
  close(wide.radius, Math.hypot(100, 40, 100), 'radius');
  // Wider than tall: the vertical field of view is the narrower
  close(wide.distance, (MARGIN * wide.radius) / Math.sin(Math.PI / 6), 'distance on a wide screen');
  // Taller than wide (a phone): the horizontal one is, and the camera stands further back
  const tall = frameBox(box, 60, 0.5);
  const horizontal = Math.atan(Math.tan(Math.PI / 6) * 0.5);
  close(tall.distance, (MARGIN * tall.radius) / Math.sin(horizontal), 'distance on a tall screen');
  assert.ok(tall.distance > wide.distance);
});

test('easing closes half the gap every half-life, whatever the frame rate', () => {
  close(ease(0, 100, 250, 250), 50, 'one half-life');
  close(ease(0, 100, 500, 250), 75, 'two half-lives');
  close(ease(0, 100, 0, 250), 0, 'no time');
  // Ten frames of 25 ms land where one of 250 ms does
  let value = 0;
  for (let i = 0; i < 10; i++) value = ease(value, 100, 25, 250);
  close(value, 50, 'ten short frames');
});
