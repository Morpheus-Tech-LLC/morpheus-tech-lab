// SPDX-License-Identifier: Apache-2.0
//
// The Info guide as a video for YouTube (#161), as data: the timeline (a title card, the ten
// steps, the credits roll and an end card, each a whole number of frames), the words on screen
// a sentence or two at a time, the captions (.srt) and the YouTube description, all made from
// steps.js, so the video says what the guide says. guide-render.html draws the frames and
// scripts/guide-video.mjs renders them. No DOM.

import { STEPS, SOURCES, sourcesInOrder } from './steps.js';

export const LAB_URL = 'https://lab.morpheustech.net';
export const REPO_URL = 'https://github.com/Morpheus-Tech-LLC/morpheus-tech-lab';
export const VIDEO_TITLE = 'Cellular automata, a short guide';

export const VIDEO = { width: 1920, height: 1080, fps: 60 };

/** YouTube's limit on a description, which its API counts in UTF-8 bytes. */
export const DESCRIPTION_LIMIT = 5000;
/** Room the description keeps for the music's credit, in bytes: a Creative Commons line fits. */
export const MUSIC_CREDIT_ROOM = 350;

/**
 * Where things go on the 1920 × 1080 frame, in pixels. Everything is set in Roboto Mono, whose
 * characters are all 0.6 em wide, so a line's length in characters says how wide it is.
 */
export const LAYOUT = {
  margin: 60,
  charEm: 0.6,
  count: { y: 66, size: 26 },
  title: { y: 128, size: 52 },
  /** The step's animation, drawn at `scale` times its CSS size, so its labels stay legible. */
  stage: { x: 60, y: 168, w: 1800, h: 630, scale: 1.8 },
  words: { centre: 902, size: 40, lineHeight: 56, maxLines: 3 },
  sources: { bottom: 1046, size: 20, lineHeight: 28 },
  /**
   * The credits roll scrolls up above `band`; below it, the lab's address stays pinned for the
   * whole roll.
   */
  credits: { size: 30, lineHeight: 42, headingSize: 46, gap: 24, speed: 130, band: 860 },
};

/**
 * Which part of a step's animation plays while which words are on screen, for a scene made of
 * parts (scenes.js's `parts`): each part starts with the chunk of words that begins with `at`, and
 * loops until the next. Steps not named here play their animation straight through.
 */
export const SCENE_CUES = {
  lab: [{ part: 'cube', at: 'The lab opens' }, { part: 'ship', at: 'Game of Life 3D (unbounded)' }],
};

/** How long things stay on screen, in seconds. */
export const PACE = {
  /** Reading pace for the words on screen, in characters a second. */
  cps: 14,
  /** A chunk of words stays at least this long… */
  minChunk: 2.5,
  /** …and this long beyond its reading time, for a look at the animation. */
  chunkPad: 0.6,
  /** The step's title and animation alone, before its first words. */
  lead: 1.5,
  /** After its last words. */
  tail: 1.5,
  /** With narration: before it starts, and after it ends. */
  narrationLead: 0.8,
  narrationTail: 1.5,
  title: 6,
  end: 12,
  /** Each segment fades in from black and out to it; each chunk of words fades in and out. */
  fade: 0.5,
  wordsFade: 0.25,
};

/** @returns {number} how many characters of a font size fit across a width */
export function charsFor(width, size) {
  return Math.floor(width / (size * LAYOUT.charEm));
}

/** Breaks text into lines of at most maxChars characters, between words. */
export function wrap(text, maxChars) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= maxChars) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Lays a list out in lines of at most maxChars characters, breaking only between its items. */
export function wrapList(items, maxChars, separator = ' · ') {
  const lines = [];
  for (const item of items) {
    const last = lines.at(-1);
    if (last !== undefined && last.length + separator.length + item.length <= maxChars) lines[lines.length - 1] = last + separator + item;
    else lines.push(item);
  }
  return lines;
}

/** @returns {string[]} the line or two naming a step's sources, at the frame's bottom */
export function sourceLines(step) {
  const names = step.sources.map((key) => SOURCES[key].short);
  names[0] = `${names.length > 1 ? 'Sources' : 'Source'}: ${names[0]}`;
  return wrapList(names, charsFor(LAYOUT.stage.w, LAYOUT.sources.size));
}

/** Splits a paragraph into its sentences. */
export function sentences(paragraph) {
  return paragraph.split(/(?<=[.!?][”’)]?)\s+(?=[A-Z0-9“‘($])/).filter(Boolean);
}

/**
 * Splits a sentence too long for the screen at the clause break (comma, colon, semicolon)
 * nearest its middle, or failing that at the space nearest it, and so on until every piece fits.
 */
function splitToFit(text, maxChars, maxLines) {
  if (wrap(text, maxChars).length <= maxLines) return [text];
  const breaks = [...text.matchAll(/[,:;] /g)].map((m) => m.index + 1);
  const spaces = [...text.matchAll(/ /g)].map((m) => m.index);
  const nearest = (list) => list.reduce((best, i) => (best === null || Math.abs(i - text.length / 2) < Math.abs(best - text.length / 2) ? i : best), null);
  const at = nearest(breaks.filter((i) => i > 20 && i < text.length - 20)) ?? nearest(spaces);
  return [text.slice(0, at).trim(), text.slice(at).trim()].flatMap((part) => splitToFit(part, maxChars, maxLines));
}

/**
 * A step's words as the screen shows them: sentence by sentence, short neighbours in a
 * paragraph sharing the screen (up to two lines), long ones split at a clause.
 * @returns {string[]}
 */
export function chunksOf(step) {
  const { size, maxLines } = LAYOUT.words;
  const maxChars = charsFor(LAYOUT.stage.w, size);
  const chunks = [];
  for (const paragraph of step.body) {
    let current = '';
    for (const piece of sentences(paragraph).flatMap((s) => splitToFit(s, maxChars, maxLines))) {
      const joined = current ? `${current} ${piece}` : piece;
      if (current && wrap(joined, maxChars).length > 2) {
        chunks.push(current);
        current = piece;
      } else current = joined;
    }
    if (current) chunks.push(current);
  }
  return chunks;
}

/** @returns {number} seconds, rounded to a whole frame */
const frames = (seconds) => Math.round(seconds * VIDEO.fps);

/**
 * The credits roll: every source in the order the guide first cites it, in full, then the
 * music's credit. Each line has its offset from the roll's top, in pixels.
 * @returns {{lines: {text: string, y: number, size: number, weight: number, tone: string}[], height: number}}
 */
export function creditsRoll({ musicCredit = '' } = {}) {
  const { size, lineHeight, headingSize, gap } = LAYOUT.credits;
  const maxChars = charsFor(LAYOUT.stage.w, size);
  const lines = [];
  let y = 0;
  const heading = (text) => {
    y += headingSize;
    lines.push({ text, y, size: headingSize, weight: 600, tone: 'text' });
    y += gap;
  };
  const para = (text, tone = 'text', weight = 400) => {
    for (const line of wrap(text, maxChars)) {
      y += lineHeight;
      lines.push({ text: line, y, size, weight, tone });
    }
  };
  heading('Sources and credits');
  para('Every finding in this guide comes from the work below; the people named here made the discoveries.', 'dim');
  for (const key of sourcesInOrder()) {
    const s = SOURCES[key];
    y += gap;
    para(`${s.authors}${s.year ? ` (${s.year})` : ''}`, 'text', 600);
    para(s.title);
    para(s.venue, 'dim');
  }
  y += 2 * gap;
  para('The animations were written for the lab and run the rules they show. The lizard’s scales are an illustration, not the model Manukyan et al. fitted.', 'dim');
  if (musicCredit) {
    y += 2 * gap;
    heading('Music');
    para(musicCredit);
  }
  return { lines, height: y + gap };
}

/**
 * The whole video, segment by segment, each a whole number of frames.
 * @param {object} [options]
 * @param {Record<string, number>|null} [options.narration] - each step's recording's length in
 *   seconds, by step id; without it, each step lasts as long as its words take to read
 * @param {string} [options.musicCredit] - for the credits roll
 */
export function timeline({ narration = null, musicCredit = '' } = {}) {
  if (narration) {
    const missing = STEPS.filter((s) => !(narration[s.id] > 0)).map((s) => s.id);
    if (missing.length) throw new Error(`No narration for ${missing.join(', ')}`);
  }
  const segments = [];
  let at = 0;
  const add = (segment, seconds) => {
    const count = frames(seconds);
    segments.push({ ...segment, startFrame: at, frames: count, start: at / VIDEO.fps, duration: count / VIDEO.fps });
    at += count;
  };

  add({ kind: 'title' }, PACE.title);
  STEPS.forEach((step, index) => {
    const texts = chunksOf(step);
    const chunks = [];
    let length;
    if (narration) {
      const spoken = narration[step.id];
      const total = texts.reduce((sum, text) => sum + text.length, 0);
      let t = PACE.narrationLead;
      for (const text of texts) {
        const d = (spoken * text.length) / total;
        chunks.push({ text, from: t, to: t + d });
        t += d;
      }
      length = PACE.narrationLead + spoken + PACE.narrationTail;
    } else {
      let t = PACE.lead;
      for (const text of texts) {
        const d = Math.max(PACE.minChunk, text.length / PACE.cps + PACE.chunkPad);
        chunks.push({ text, from: t, to: t + d });
        t += d;
      }
      length = t + PACE.tail;
    }
    const cues = (SCENE_CUES[step.id] ?? []).map(({ part, at }) => {
      const chunk = chunks.find((c) => c.text.startsWith(at));
      if (!chunk) throw new Error(`${step.id}: no words begin “${at}”`);
      return { part, from: chunk === chunks[0] ? 0 : chunk.from };
    });
    add({
      kind: 'step', index, id: step.id, title: step.title, scene: step.scene, cues,
      count: `${index + 1} / ${STEPS.length}`,
      sources: sourceLines(step),
      narrationAt: narration ? PACE.narrationLead : null,
      chunks: chunks.map((c) => ({ ...c, lines: wrap(c.text, charsFor(LAYOUT.stage.w, LAYOUT.words.size)) })),
    }, length);
  });
  const roll = creditsRoll({ musicCredit });
  // The roll starts just below the band and runs until its last line has gone off the top
  add({ kind: 'credits', ...roll }, (LAYOUT.credits.band + roll.height) / LAYOUT.credits.speed);
  add({ kind: 'end' }, PACE.end);
  return { ...VIDEO, segments, frames: at, duration: at / VIDEO.fps };
}

/** @returns {string} seconds as YouTube writes a chapter's time: m:ss, or h:mm:ss */
export function chapterTime(seconds) {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  const pad = (v) => String(v).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
}

/**
 * YouTube's chapters: one per step, the first at 0:00 (the title card belongs to it), then the
 * credits, which the end card belongs to.
 * @returns {{time: number, title: string}[]}
 */
export function chapters(tl) {
  const list = [];
  for (const segment of tl.segments) {
    if (segment.kind === 'step') list.push({ time: list.length ? segment.start : 0, title: segment.title });
    if (segment.kind === 'credits') list.push({ time: segment.start, title: 'Sources and credits' });
  }
  return list;
}

/** @returns {string} seconds as an .srt time, HH:MM:SS,mmm */
export function srtTime(seconds) {
  const ms = Math.round(seconds * 1000);
  const pad = (v, n = 2) => String(v).padStart(n, '0');
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
}

/** @returns {string} the captions: each chunk of words, while it is on screen */
export function srt(tl) {
  const cues = [];
  for (const segment of tl.segments) {
    if (segment.kind !== 'step') continue;
    for (const chunk of segment.chunks) {
      cues.push(`${cues.length + 1}\n${srtTime(segment.start + chunk.from)} --> ${srtTime(segment.start + chunk.to)}\n${chunk.text}\n`);
    }
  }
  return cues.join('\n');
}

/**
 * A source as one line of the description: its authors, year, title and link. The venue is
 * left out where there is a link, to stay inside YouTube's limit; the credits roll has it.
 */
export function descriptionCitation(source) {
  const year = source.year ? ` (${source.year})` : '';
  return `${source.authors}${year}. ${source.title}. ${source.url ?? `${source.venue}.`}`;
}

/** @returns {string} the YouTube description, to paste as it is */
export function description(tl, { musicCredit = '' } = {}) {
  const parts = [
    'A short tour of cellular automata, from Rule 30 to Game of Life 3D. Every finding comes from published work, credited below.',
    `Try them yourself, in your browser: ${LAB_URL}\nMorpheus Tech Lab is open source (Apache-2.0): ${REPO_URL}`,
    ['Chapters', ...chapters(tl).map((c) => `${chapterTime(c.time)} ${c.title}`)].join('\n'),
    ['Sources', ...sourcesInOrder().map((key) => descriptionCitation(SOURCES[key]))].join('\n'),
  ];
  if (musicCredit) parts.push(`Music: ${musicCredit}`);
  return `${parts.join('\n\n')}\n`;
}

