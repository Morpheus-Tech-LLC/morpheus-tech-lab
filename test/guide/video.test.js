// SPDX-License-Identifier: Apache-2.0
//
// The guide as a video (#161): the timeline, the words on screen, the captions and the YouTube
// description, as video.js makes them from steps.js. The frames themselves are drawn by
// guide-render.html, in a browser.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STEPS, SOURCES, sourcesInOrder } from '../../src/guide/steps.js';
import {
  VIDEO, LAYOUT, PACE, DESCRIPTION_LIMIT, MUSIC_CREDIT_ROOM, LAB_URL, SCENE_CUES, MUSIC_BUILD,
  charsFor, wrap, wrapList, sentences, chunksOf, sourceLines, creditsRoll, timeline, chapters, chapterTime,
  srt, srtTime, description, descriptionCitation, musicBuild,
} from '../../src/guide/video.js';
import { SCENES } from '../../src/guide/scenes.js';

const words = (text) => text.split(/\s+/).filter(Boolean);
const bytes = (text) => Buffer.byteLength(text, 'utf8');

test('wrap() breaks between words, never past the width', () => {
  assert.deepEqual(wrap('one two three four', 9), ['one two', 'three', 'four']);
  assert.deepEqual(wrap('  spaced   out  ', 20), ['spaced out']);
  assert.deepEqual(wrap('unbreakable', 4), ['unbreakable'], 'a word longer than the width keeps a line to itself');
  assert.deepEqual(wrapList(['a b', 'c d', 'e'], 9), ['a b · c d', 'e']);
  assert.equal(charsFor(1800, 40), 75, 'Roboto Mono at 40 px: 24 px a character');
});

test('sentences() splits at full stops, question marks and exclamation marks only', () => {
  assert.deepEqual(sentences('One. Two? Three! In 1970 four. “Five.” $50 six.'), ['One.', 'Two?', 'Three!', 'In 1970 four.', '“Five.”', '$50 six.']);
  assert.deepEqual(sentences('B3/S23: born with 3, survives with 2 or 3.'), ['B3/S23: born with 3, survives with 2 or 3.']);
});

test('the words on screen are every step’s words, in order, each chunk fitting the screen', () => {
  const maxChars = charsFor(LAYOUT.stage.w, LAYOUT.words.size);
  for (const step of STEPS) {
    const chunks = chunksOf(step);
    assert.deepEqual(words(chunks.join(' ')), words(step.body.join(' ')), `${step.id}: nothing lost, added or reordered`);
    for (const chunk of chunks) {
      assert.ok(wrap(chunk, maxChars).length <= LAYOUT.words.maxLines, `${step.id}: “${chunk}” fits in ${LAYOUT.words.maxLines} lines`);
    }
    // A chunk never runs across two paragraphs
    for (const paragraph of step.body) {
      const start = chunks.findIndex((c) => paragraph.startsWith(c));
      assert.ok(start >= 0, `${step.id}: a paragraph starts a chunk`);
    }
  }
});

test('each step names its sources at the bottom, every one, in a line or two that fits', () => {
  const maxChars = charsFor(LAYOUT.stage.w, LAYOUT.sources.size);
  for (const step of STEPS) {
    const lines = sourceLines(step);
    assert.ok(lines.length >= 1 && lines.length <= 2, step.id);
    assert.ok(lines.every((l) => l.length <= maxChars), `${step.id} fits`);
    const text = lines.join(' · ');
    for (const key of step.sources) assert.ok(text.includes(SOURCES[key].short), `${step.id} names ${key}`);
    assert.ok(text.startsWith(step.sources.length > 1 ? 'Sources: ' : 'Source: '), step.id);
  }
});

test('the timeline: a title card, the ten steps in order, the credits roll and an end card, frame by frame', () => {
  const tl = timeline();
  assert.equal(tl.width, 1920);
  assert.equal(tl.height, 1080);
  assert.equal(tl.fps, 60);
  assert.deepEqual(tl.segments.map((s) => s.kind), ['title', ...STEPS.map(() => 'step'), 'credits', 'end']);
  assert.deepEqual(tl.segments.filter((s) => s.kind === 'step').map((s) => s.id), STEPS.map((s) => s.id));
  let at = 0;
  for (const segment of tl.segments) {
    assert.ok(Number.isInteger(segment.frames) && segment.frames > 0, 'a whole number of frames');
    assert.equal(segment.startFrame, at, 'each segment starts where the last ended');
    assert.equal(segment.start, at / VIDEO.fps);
    assert.equal(segment.duration, segment.frames / VIDEO.fps);
    at += segment.frames;
  }
  assert.equal(tl.frames, at);
  assert.equal(tl.duration, at / VIDEO.fps);
  assert.ok(tl.duration > 5 * 60 && tl.duration < 9 * 60, `about seven minutes (${chapterTime(tl.duration)})`);
  assert.equal(tl.segments[0].duration, PACE.title);
  assert.equal(tl.segments.at(-1).duration, PACE.end);
});

test('without narration, each chunk of words stays long enough to read, one after another', () => {
  for (const segment of timeline().segments.filter((s) => s.kind === 'step')) {
    assert.ok(segment.chunks.length >= 2, segment.id);
    assert.equal(segment.chunks[0].from, PACE.lead, 'the title and animation come first');
    segment.chunks.forEach((chunk, i) => {
      assert.ok(chunk.to - chunk.from >= Math.max(PACE.minChunk, chunk.text.length / PACE.cps), `${segment.id}: “${chunk.text}” has time to be read`);
      if (i) assert.equal(chunk.from, segment.chunks[i - 1].to, 'no gap, no overlap');
      assert.deepEqual(chunk.lines, wrap(chunk.text, charsFor(LAYOUT.stage.w, LAYOUT.words.size)));
    });
    assert.ok(segment.chunks.at(-1).to + PACE.tail <= segment.duration + 1 / VIDEO.fps, `${segment.id}: the last words end before the step does`);
    assert.equal(segment.narrationAt, null);
  }
});

test('with narration, each step lasts as long as its recording, and the words follow it', () => {
  const narration = Object.fromEntries(STEPS.map((s, i) => [s.id, 20 + i * 1.37]));
  const tl = timeline({ narration });
  for (const segment of tl.segments.filter((s) => s.kind === 'step')) {
    const spoken = narration[segment.id];
    assert.ok(Math.abs(segment.duration - (PACE.narrationLead + spoken + PACE.narrationTail)) <= 0.5 / VIDEO.fps, segment.id);
    assert.equal(segment.narrationAt, PACE.narrationLead);
    assert.equal(segment.chunks[0].from, PACE.narrationLead);
    assert.ok(Math.abs(segment.chunks.at(-1).to - (PACE.narrationLead + spoken)) < 1e-9, 'the words end with the recording');
    // Each chunk's share of the recording is its share of the words
    const total = segment.chunks.reduce((sum, c) => sum + c.text.length, 0);
    for (const chunk of segment.chunks) {
      assert.ok(Math.abs((chunk.to - chunk.from) - (spoken * chunk.text.length) / total) < 1e-9);
    }
  }
  assert.throws(() => timeline({ narration: { what: 10 } }), /No narration for rule30/, 'every step needs its recording');
});

test('the credits roll names every source in full, in the guide’s order, and the music', () => {
  const plain = creditsRoll();
  const text = plain.lines.map((l) => l.text).join(' ');
  for (const key of sourcesInOrder()) {
    const s = SOURCES[key];
    for (const part of [s.authors, s.title, s.venue]) assert.ok(text.includes(words(part).join(' ')), `${key}: ${part}`);
    if (s.year) assert.ok(text.includes(`(${s.year})`), key);
  }
  const positions = sourcesInOrder().map((key) => text.indexOf(SOURCES[key].title));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), 'in the order the guide cites them');
  assert.ok(!text.includes('Music'), 'no music, no music credit');
  const maxChars = charsFor(LAYOUT.stage.w, LAYOUT.credits.size);
  assert.ok(plain.lines.every((l) => l.text.length <= charsFor(LAYOUT.stage.w, l.size) || !l.text.includes(' ')), 'every line fits');
  assert.ok(maxChars > 60);
  for (let i = 1; i < plain.lines.length; i++) assert.ok(plain.lines[i].y > plain.lines[i - 1].y, 'lines run down the roll');
  assert.ok(plain.height > plain.lines.at(-1).y);

  const credited = creditsRoll({ musicCredit: '“Example” by Someone, YouTube Audio Library' });
  assert.ok(credited.lines.some((l) => l.text === 'Music'));
  assert.ok(credited.lines.map((l) => l.text).join(' ').includes('“Example” by Someone, YouTube Audio Library'));
  // The roll runs from the band, where the lab's address is pinned, until its last line has gone off the top
  const tl = timeline({ musicCredit: 'x' });
  const roll = tl.segments.find((s) => s.kind === 'credits');
  assert.ok(LAYOUT.credits.band < VIDEO.height - 200, 'the band leaves room for the address');
  assert.ok(Math.abs(roll.duration - (LAYOUT.credits.band + roll.height) / LAYOUT.credits.speed) <= 0.5 / VIDEO.fps);
});

test('chapters: one per step from 0:00, then the credits, each at least 10 seconds, as YouTube requires', () => {
  const tl = timeline();
  const list = chapters(tl);
  assert.deepEqual(list.map((c) => c.title), [...STEPS.map((s) => s.title), 'Sources and credits']);
  assert.equal(list[0].time, 0, 'the first chapter starts at 0:00, with the title card');
  const ends = [...list.slice(1).map((c) => c.time), tl.duration];
  list.forEach((c, i) => assert.ok(ends[i] - c.time >= 10, `${c.title} lasts at least 10 seconds`));
  assert.equal(chapterTime(0), '0:00');
  assert.equal(chapterTime(65.9), '1:05');
  assert.equal(chapterTime(3725), '1:02:05');
});

test('the captions: every chunk of words, timed to the video', () => {
  const tl = timeline();
  const text = srt(tl);
  const cues = text.trim().split(/\n\n/);
  const chunks = tl.segments.filter((s) => s.kind === 'step').flatMap((s) => s.chunks.map((c) => ({ ...c, start: s.start })));
  assert.equal(cues.length, chunks.length);
  cues.forEach((cue, i) => {
    const [n, times, ...lines] = cue.split('\n');
    assert.equal(n, String(i + 1));
    assert.equal(times, `${srtTime(chunks[i].start + chunks[i].from)} --> ${srtTime(chunks[i].start + chunks[i].to)}`);
    assert.equal(lines.join(' '), chunks[i].text);
  });
  assert.equal(srtTime(0), '00:00:00,000');
  assert.equal(srtTime(3723.4567), '01:02:03,457');
  assert.equal(srtTime(59.9996), '00:01:00,000');
});

test('the description: the lab, the chapters and every source with its link, inside YouTube’s limit', () => {
  const tl = timeline();
  const text = description(tl);
  assert.ok(bytes(text) <= DESCRIPTION_LIMIT - MUSIC_CREDIT_ROOM,
    `${bytes(text)} bytes leaves ${MUSIC_CREDIT_ROOM} for the music's credit`);
  assert.ok(!/[<>]/.test(text), 'YouTube refuses angle brackets');
  assert.ok(text.includes(LAB_URL));
  for (const c of chapters(tl)) assert.ok(text.includes(`\n${chapterTime(c.time)} ${c.title}\n`), c.title);
  for (const key of sourcesInOrder()) {
    const s = SOURCES[key];
    assert.ok(text.includes(descriptionCitation(s)), key);
    assert.ok(text.includes(s.authors) && text.includes(s.title), `${key} credits its authors`);
    if (s.url) assert.ok(text.includes(s.url), `${key} links to it`);
    else assert.ok(text.includes(s.venue), `${key}, with no link, names where it appeared`);
  }
  const credit = 'x'.repeat(MUSIC_CREDIT_ROOM - 10);
  const withMusic = description(timeline({ musicCredit: credit }), { musicCredit: credit });
  assert.ok(withMusic.includes(`Music: ${credit}`));
  assert.ok(bytes(withMusic) <= DESCRIPTION_LIMIT, 'a credit that fits the room keeps it inside the limit');
});

test('a step made of parts shows each while its words are on screen: the lab’s cube, then its ship', () => {
  for (const [id, cues] of Object.entries(SCENE_CUES)) {
    const step = STEPS.find((s) => s.id === id);
    assert.ok(step, id);
    const parts = SCENES[step.scene]().parts;
    for (const cue of cues) assert.ok(parts.some((p) => p.name === cue.part), `${id}'s animation has a part ${cue.part}`);
  }
  const lab = timeline().segments.find((s) => s.id === 'lab');
  assert.deepEqual(lab.cues.map((c) => c.part), ['cube', 'ship']);
  assert.equal(lab.cues[0].from, 0);
  const ship = lab.chunks.find((c) => c.text.startsWith('Game of Life 3D (unbounded)'));
  assert.equal(lab.cues[1].from, ship.from, 'the ship flies from the words about it');
  assert.ok(lab.chunks.filter((c) => c.from >= ship.from).every((c) => /unbounded|ship|edges/.test(c.text)), 'and they are about it');
  assert.ok(lab.chunks.filter((c) => c.from < ship.from).every((c) => !/ship/.test(c.text)), 'the cube’s words are not');
  for (const segment of timeline().segments.filter((s) => s.kind === 'step' && s.id !== 'lab')) assert.deepEqual(segment.cues, []);
});

test('the music plays as it is through the first step, then builds with each step to the last, and holds', () => {
  const tl = timeline();
  const steps = tl.segments.filter((s) => s.kind === 'step');
  const build = musicBuild(tl);
  assert.equal(build.tempoAt(0), 1, 'the title card');
  assert.equal(build.tempoAt(steps[1].start - 0.01), 1, 'the whole first step');
  assert.equal(build.gainAt(steps[0].start + 5), 0);
  let previous = 1;
  steps.forEach((step, k) => {
    const settled = build.tempoAt(step.start + MUSIC_BUILD.glide + 0.01);
    assert.ok(Math.abs(settled - (1 + ((MUSIC_BUILD.tempo - 1) * k) / (steps.length - 1))) < 1e-9, `${step.id} settles at its level`);
    assert.ok(k === 0 || settled > previous, `${step.id} is faster than the step before`);
    assert.ok(build.tempoAt(step.start + 0.5) <= settled, 'gliding up, not jumping');
    previous = settled;
  });
  const last = tl.segments.find((s) => s.kind === 'end');
  assert.equal(build.tempoAt(last.start + 5), MUSIC_BUILD.tempo, 'it holds through the credits and the end card');
  assert.equal(build.gainAt(last.start + 5), MUSIC_BUILD.lift);

  // Each tempo change is placed at its time in the track: the integral of the tempo so far
  assert.ok(build.commands.length > 20);
  for (let i = 1; i < build.commands.length; i++) assert.ok(build.commands[i].input > build.commands[i - 1].input);
  assert.equal(build.commands.at(-1).tempo, MUSIC_BUILD.tempo);
  const first = build.commands[0];
  assert.ok(Math.abs(first.input - steps[1].start) < 0.25, 'the first change comes as the second step starts, the track not yet sped up');
  assert.ok(build.commands.at(-1).input > steps.at(-1).start, 'by the last step, the track has run ahead of the video');
  assert.ok(build.gains.every((g, i) => i === 0 || (g.at > build.gains[i - 1].at && g.gain > build.gains[i - 1].gain)));
  assert.equal(build.gains.at(-1).gain, MUSIC_BUILD.lift);

  const none = musicBuild(tl, { tempo: 1, lift: 0 });
  assert.deepEqual([none.commands, none.gains], [[], []], 'no build: no changes');
});
