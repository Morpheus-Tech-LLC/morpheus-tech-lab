// SPDX-License-Identifier: Apache-2.0
//
// The guide video's original music (#161): every track composes and plays, fits the length it is
// asked for, and ends on its home chord.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS, compose, renderTrack, wav } from '../../src/guide/music.js';

test('every track composes notes inside its length, ending on its home chord', () => {
  for (const [id, track] of Object.entries(TRACKS)) {
    assert.ok(track.name && track.bpm >= 110 && track.about, id);
    const notes = compose(id, 120);
    assert.ok(notes.length > 500, `${id} has notes`);
    assert.ok(notes.every((n, i) => n.at >= 0 && n.at < 120 && (i === 0 || n.at >= notes[i - 1].at)), `${id}: in order, inside the length`);
    const last = notes.filter((n) => n.instrument === 'pad').at(-1);
    assert.ok(last.at + last.options.length >= 120 - 1e-9, `${id}: its last chord rings to the end`);
  }
});

test('every track plays to finite samples, peaking at 0.9, the same every time', () => {
  for (const id of Object.keys(TRACKS)) {
    const a = renderTrack(id, { seconds: 12, sampleRate: 8000 });
    assert.equal(a.left.length, 12 * 8000);
    let peak = 0;
    for (let i = 0; i < a.left.length; i++) {
      assert.ok(Number.isFinite(a.left[i]) && Number.isFinite(a.right[i]), `${id}: sample ${i}`);
      peak = Math.max(peak, Math.abs(a.left[i]), Math.abs(a.right[i]));
    }
    assert.ok(Math.abs(peak - 0.9) < 1e-6, `${id} peaks at 0.9 (${peak})`);
    const b = renderTrack(id, { seconds: 12, sampleRate: 8000 });
    assert.deepEqual(b.left.slice(0, 4000), a.left.slice(0, 4000), `${id} sounds the same every time`);
  }
});

test('wav() writes a 16-bit stereo WAV file', () => {
  const file = wav({ left: new Float32Array([0, 1, -1]), right: new Float32Array([0.5, 0, 0]), sampleRate: 8000 });
  const view = new DataView(file.buffer);
  assert.equal(String.fromCharCode(...file.slice(0, 4)), 'RIFF');
  assert.equal(view.getUint16(22, true), 2, 'stereo');
  assert.equal(view.getUint32(24, true), 8000);
  assert.equal(view.getUint32(40, true), 12, 'three frames of 4 bytes');
  assert.equal(view.getInt16(48, true), 32767);
  assert.equal(view.getInt16(52, true), -32767);
});
