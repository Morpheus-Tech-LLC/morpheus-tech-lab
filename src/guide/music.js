// SPDX-License-Identifier: Apache-2.0
//
// Original music for the guide's video (#161), written for the lab: each track is composed here
// as notes, and drawn here as samples, with no recordings and no sample library, so the video
// needs no licence and credits no one but the lab. renderTrack() plays a track for as long as
// asked, through an intro, grooves and breaks, and ends on its home chord. The same code runs in
// Node (scripts/guide-video.mjs) and in a browser. No DOM.

const TAU = Math.PI * 2;
const mtof = (note) => 440 * 2 ** ((note - 69) / 12);

/** A seeded random number generator (mulberry32), so a track sounds the same every time. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A state-variable filter (the trapezoidal form): lowpass, bandpass and highpass at once. */
class Filter {
  constructor(sampleRate, cutoff = 1000, q = 0.7) {
    this.sampleRate = sampleRate;
    this.ic1 = 0;
    this.ic2 = 0;
    this.low = this.band = this.high = 0;
    this.set(cutoff, q);
  }

  set(cutoff, q = this.q) {
    this.q = q;
    const g = Math.tan((Math.PI * Math.min(Math.max(cutoff, 20), this.sampleRate * 0.45)) / this.sampleRate);
    this.k = 1 / q;
    this.a1 = 1 / (1 + g * (g + this.k));
    this.a2 = g * this.a1;
    this.a3 = g * this.a2;
  }

  process(x) {
    const v3 = x - this.ic2;
    const v1 = this.a1 * this.ic1 + this.a2 * v3;
    const v2 = this.ic2 + this.a2 * this.ic1 + this.a3 * v3;
    this.ic1 = 2 * v1 - this.ic1;
    this.ic2 = 2 * v2 - this.ic2;
    this.low = v2;
    this.band = v1;
    this.high = x - this.k * v1 - v2;
    return v2;
  }
}

/** Smooths an oscillator's jump, so saws and squares don't alias (polyBLEP). */
function blep(t, dt) {
  if (t < dt) {
    t /= dt;
    return t + t - t * t - 1;
  }
  if (t > 1 - dt) {
    t = (t - 1) / dt;
    return t * t + t + t + 1;
  }
  return 0;
}

const saw = (p, dt) => 2 * p - 1 - blep(p, dt);
const pulse = (p, dt, width = 0.5) => (p < width ? 1 : -1) + blep(p, dt) - blep((p + 1 - width) % 1, dt);
const triangle = (p) => 1 - 4 * Math.abs(p - 0.5);

// ---- Instruments ----
//
// Each makes a voice: { start, end, process(bus, i0, i1, s0) }, start and end in samples, which
// adds its samples i0 to i1 of the current block (whose first sample is s0) into the bus: dry
// (L, R), pumped (pL, pR: ducked under the kick), delay send (dL, dR) and reverb send (vL, vR).

function envelope(n, length, attack, release) {
  if (n < attack) return n / attack;
  if (n > length - release) return Math.max(0, (length - n) / release);
  return 1;
}

const INSTRUMENTS = {
  kick({ at, gain = 0.9, sampleRate: sr }) {
    let phase = 0;
    const length = Math.round(0.42 * sr);
    return {
      start: at, end: at + length,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const t = (s0 + i - at) / sr;
          phase += (44 + 120 * Math.exp(-t * 30)) / sr;
          const v = gain * (Math.sin(TAU * phase) * Math.exp(-t * 7) + 0.12 * Math.sin(TAU * phase * 3.1) * Math.exp(-t * 60));
          b.L[i] += v;
          b.R[i] += v;
        }
      },
    };
  },

  snare({ at, gain = 0.45, sampleRate: sr, random, verb = 0.3 }) {
    const filter = new Filter(sr, 1800, 0.8);
    const length = Math.round(0.3 * sr);
    return {
      start: at, end: at + length,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const t = (s0 + i - at) / sr;
          filter.process(random() * 2 - 1);
          const v = gain * (filter.high * Math.exp(-t * 15) + 0.45 * Math.sin(TAU * 190 * t) * Math.exp(-t * 25));
          b.L[i] += v;
          b.R[i] += v;
          b.vL[i] += v * verb;
          b.vR[i] += v * verb;
        }
      },
    };
  },

  clap({ at, gain = 0.4, sampleRate: sr, random, verb = 0.25 }) {
    const filter = new Filter(sr, 1400, 1.4);
    const length = Math.round(0.25 * sr);
    return {
      start: at, end: at + length,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const t = (s0 + i - at) / sr;
          let e = 0;
          for (let k = 0; k < 3; k++) if (t >= k * 0.011) e += Math.exp(-(t - k * 0.011) * 220);
          if (t >= 0.033) e += 0.8 * Math.exp(-(t - 0.033) * 18);
          filter.process(random() * 2 - 1);
          const v = gain * 2.2 * filter.band * e;
          b.L[i] += v * 0.95;
          b.R[i] += v;
          b.vL[i] += v * verb;
          b.vR[i] += v * verb;
        }
      },
    };
  },

  hat({ at, gain = 0.12, open = false, pan = 0.15, sampleRate: sr, random }) {
    const filter = new Filter(sr, 7500, 0.9);
    const decay = open ? 9 : 55;
    const length = Math.round((open ? 0.35 : 0.08) * sr);
    return {
      start: at, end: at + length,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const t = (s0 + i - at) / sr;
          filter.process(random() * 2 - 1);
          const v = gain * filter.high * Math.exp(-t * decay);
          b.L[i] += v * (1 - pan);
          b.R[i] += v * (1 + pan);
        }
      },
    };
  },

  bass({ at, note, length, gain = 0.32, wave = 'saw', bright = 1, sampleRate: sr }) {
    const freq = mtof(note), dt = freq / sr;
    const filter = new Filter(sr, 400, 1.1);
    const sub = 0.5;
    let p = 0, ps = 0;
    const len = Math.round(length * sr), attack = 0.004 * sr, release = Math.min(0.03 * sr, len / 3);
    return {
      start: at, end: at + len,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const n = s0 + i - at, t = n / sr;
          if ((n & 31) === 0) filter.set(120 + 1400 * bright * Math.exp(-t * 9), 1.1);
          p = (p + dt) % 1;
          ps = (ps + dt / 2) % 1;
          const osc = wave === 'triangle' ? triangle(p) : wave === 'square' ? pulse(p, dt) : saw(p, dt);
          const v = gain * envelope(n, len, attack, release) * (filter.process(osc) + sub * Math.sin(TAU * ps));
          b.pL[i] += v;
          b.pR[i] += v;
        }
      },
    };
  },

  pad({ at, notes, length, gain = 0.05, cutoff = 1500, verb = 0.35, sampleRate: sr }) {
    const voices = notes.flatMap((note, k) => [-7, 7].map((cents, j) => ({
      dt: mtof(note + cents / 100) / sr,
      p: ((k * 0.37 + j * 0.61) % 1),
      pan: (j ? 0.55 : -0.55) * (k % 2 ? 0.7 : 1),
    })));
    const filters = [new Filter(sr, cutoff, 0.6), new Filter(sr, cutoff, 0.6)];
    const len = Math.round(length * sr), attack = 0.35 * sr, release = 0.6 * sr;
    return {
      start: at, end: at + len,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const n = s0 + i - at;
          let l = 0, r = 0;
          for (const v of voices) {
            v.p = (v.p + v.dt) % 1;
            const s = saw(v.p, v.dt);
            l += s * (1 - v.pan);
            r += s * (1 + v.pan);
          }
          const e = gain * envelope(n, len, attack, release);
          const L = filters[0].process(l) * e, R = filters[1].process(r) * e;
          b.pL[i] += L;
          b.pR[i] += R;
          b.vL[i] += L * verb;
          b.vR[i] += R * verb;
        }
      },
    };
  },

  pluck({ at, note, length = 0.2, gain = 0.12, pan = 0, delay = 0.3, verb = 0.1, wave = 'saw', sampleRate: sr }) {
    const dt = mtof(note) / sr;
    const filter = new Filter(sr, 3000, 1.2);
    let p = 0;
    const len = Math.round((length + 0.25) * sr);
    return {
      start: at, end: at + len,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const n = s0 + i - at, t = n / sr;
          if ((n & 31) === 0) filter.set(300 + 4200 * Math.exp(-t * 14), 1.2);
          p = (p + dt) % 1;
          const osc = wave === 'pulse' ? pulse(p, dt, 0.25) : wave === 'bell'
            ? Math.sin(TAU * p) + 0.3 * Math.sin(TAU * ((p * 3.01) % 1)) : 0.6 * saw(p, dt) + 0.4 * pulse(p, dt);
          const v = gain * filter.process(osc) * Math.exp(-t * (wave === 'bell' ? 5 : 9)) * Math.min(1, n / (0.002 * sr));
          const L = v * (1 - pan), R = v * (1 + pan);
          b.L[i] += L;
          b.R[i] += R;
          b.dL[i] += L * delay;
          b.dR[i] += R * delay;
          b.vL[i] += L * verb;
          b.vR[i] += R * verb;
        }
      },
    };
  },

  lead({ at, note, length, gain = 0.14, wave = 'saw', delay = 0.3, verb = 0.2, sampleRate: sr }) {
    const freq = mtof(note);
    const filter = new Filter(sr, 2600, 0.9);
    let p = 0;
    const len = Math.round(length * sr), attack = 0.01 * sr, release = 0.08 * sr;
    return {
      start: at, end: at + len,
      process(b, i0, i1, s0) {
        for (let i = i0; i < i1; i++) {
          const n = s0 + i - at, t = n / sr;
          const vibrato = t > 0.18 ? 1 + 0.004 * Math.sin(TAU * 5.5 * t) : 1;
          const dt = (freq * vibrato) / sr;
          p = (p + dt) % 1;
          const osc = wave === 'pulse' ? pulse(p, dt, 0.25) : 0.7 * saw(p, dt) + 0.3 * pulse(p, dt, 0.4);
          const v = gain * filter.process(osc) * envelope(n, len, attack, release);
          b.L[i] += v;
          b.R[i] += v;
          b.dL[i] += v * delay;
          b.dR[i] += v * delay;
          b.vL[i] += v * verb;
          b.vR[i] += v * verb;
        }
      },
    };
  },
};

// ---- Harmony and form ----

const CHORDS = { min: [0, 3, 7], maj: [0, 4, 7], m7: [0, 3, 7, 10], dom7: [0, 4, 7, 10], maj7: [0, 4, 7, 11] };

/** A chord's tones, voiced from the root's note in octave 3 or 4 (52 to 63), plus the root an octave up. */
function voicing([root, kind]) {
  let base = root;
  while (base < 52) base += 12;
  while (base > 63) base -= 12;
  return [...CHORDS[kind].map((i) => base + i), base + 12];
}

/** The chord's root in the bass's octave (28 to 39). */
function bassRoot([root]) {
  let note = root;
  while (note < 28) note += 12;
  while (note > 39) note -= 12;
  return note;
}

/**
 * The song's form, bar by bar: an intro, a build, then grooves (A), grooves with the melody (B)
 * and breaks, repeated, an outro, and the home chord held to the end.
 */
function form(bars) {
  const plan = [];
  const push = (count, part) => { for (let i = 0; i < count && plan.length < bars; i++) plan.push({ part, i }); };
  const ending = 8 + 2;
  push(4, 'intro');
  push(4, 'build');
  const cycle = [['A', 16], ['B', 16], ['break', 8]];
  for (let k = 0; plan.length + cycle[k % 3][1] <= bars - ending; k++) push(cycle[k % 3][1], cycle[k % 3][0]);
  // Whatever doesn't fit a whole section grooves on before the outro
  while (plan.length < bars - ending) push(1, 'A');
  push(8, 'outro');
  while (plan.length < bars) push(1, 'final');
  return plan;
}

/** The melody's phrases: [16th, length in 16ths, chord tone (4 and up: the next octave)]. */
const PHRASES = [
  [[0, 2, 2], [2, 2, 3], [4, 4, 4], [8, 2, 3], [10, 2, 2], [12, 4, 1]],
  [[0, 4, 4], [4, 2, 3], [6, 2, 2], [8, 6, 1], [14, 2, 2]],
  [[0, 2, 1], [2, 2, 2], [4, 2, 3], [6, 2, 4], [8, 8, 5]],
  [[0, 6, 4], [6, 2, 3], [8, 4, 2], [12, 4, 0]],
];

const toneOf = (tones, degree) => tones[degree % 4] + 12 * Math.floor(degree / 4);

/** Rule 30's centre column, from one live cell: its melody's rhythm and notes. */
function rule30Column(length) {
  const width = 2 * length + 3;
  let row = new Uint8Array(width);
  row[length + 1] = 1;
  const column = new Uint8Array(length);
  for (let t = 0; t < length; t++) {
    column[t] = row[length + 1];
    const next = new Uint8Array(width);
    for (let i = 1; i < width - 1; i++) next[i] = (30 >> ((row[i - 1] << 2) | (row[i] << 1) | row[i + 1])) & 1;
    row = next;
  }
  return column;
}

// ---- The tracks ----

/**
 * Each track: its name, tempo, chords (one a bar, [root as a MIDI note, kind]), a line saying
 * what it is, and bar(), which adds a bar's notes: note(at, instrument, options), with `at` in
 * beats from the bar's start.
 */
export const TRACKS = {
  glider: {
    name: 'Glider',
    bpm: 124,
    about: 'Bright electro-pop: four-on-the-floor kick, rolling octave bass, a rippling arpeggio, and a melody in the B sections.',
    chords: [[57, 'min'], [53, 'maj'], [60, 'maj'], [55, 'maj']],
    pump: 0.45,
    bar(note, { part, i, chord, tones, bass, bar }) {
      const drums = part === 'A' || part === 'B' || (part === 'build' && i >= 2);
      if (drums) {
        for (let beat = 0; beat < 4; beat++) note(beat, 'kick');
        note(1, 'clap');
        note(3, 'clap');
        for (let beat = 0; beat < 4; beat++) note(beat + 0.5, 'hat', { open: true, gain: 0.07 });
        if (part === 'B') for (let s = 0; s < 16; s++) if (s % 2 === 1) note(s / 4, 'hat', { gain: 0.05, pan: -0.3 });
      } else if (part === 'build' || part === 'break') {
        for (let s = 0; s < 8; s++) note(s / 2, 'hat', { gain: 0.04 + 0.01 * (s % 2) });
      }
      if (part !== 'intro' && part !== 'final' && part !== 'outro') {
        const steps = [0, 0, 12, 0, 0, 12, 0, 12];
        steps.forEach((o, s) => note(s / 2, 'bass', { note: bass + o, length: 0.45 }));
      }
      if (part !== 'final') {
        const order = [0, 1, 2, 3, 4, 3, 2, 1];
        for (let s = 0; s < 16; s++) {
          const soft = part === 'intro' || part === 'outro';
          note(s / 4, 'pluck', { note: toneOf(tones, order[(s + bar) % 8]) + 12, gain: soft ? 0.06 : 0.085, pan: s % 2 ? 0.35 : -0.35 });
        }
      }
      if (i % 2 === 0 || part === 'final') note(0, 'pad', { notes: tones, length: part === 'final' ? 8 : 8, gain: 0.03 });
      if (part === 'B') {
        for (const [s, len, d] of PHRASES[[0, 1, 0, 2][i % 4]]) note(s / 4, 'lead', { note: toneOf(tones, d) + 12, length: len / 4 * 0.95 });
      }
    },
  },

  rule30: {
    name: 'Rule 30',
    bpm: 138,
    about: 'Fast chiptune: square-wave arpeggios, a triangle bass, a breakbeat, and a melody played by Rule 30 itself, one cell per sixteenth.',
    chords: [[50, 'min'], [58, 'maj'], [53, 'maj'], [60, 'maj']],
    pump: 0.2,
    bar(note, { part, i, tones, bass, bar, column }) {
      const drums = part === 'A' || part === 'B' || (part === 'build' && i >= 2);
      if (drums) {
        for (const beat of part === 'B' ? [0, 1.75, 2.5] : [0, 2.5]) note(beat, 'kick', { gain: 0.8 });
        note(1, 'snare');
        note(3, 'snare');
        for (let s = 0; s < 8; s++) note(s / 2, 'hat', { gain: s % 2 ? 0.05 : 0.08 });
      } else if (part === 'build') {
        for (let s = 0; s < 4; s++) note(s, 'hat', { gain: 0.05 });
      }
      if (part !== 'intro' && part !== 'final' && part !== 'outro' && part !== 'break') {
        [0, 0.75, 1.5, 2, 2.75, 3.5].forEach((beat, k) => note(beat, 'bass', { note: bass + (k === 3 ? 7 : 0) + 12, length: 0.3, wave: 'triangle', gain: 0.45 }));
      }
      if (part !== 'final') {
        for (let s = 0; s < 16; s++) {
          note(s / 4, 'pluck', { note: toneOf(tones, (s * 3 + bar) % 8) + 12, wave: 'pulse', length: 0.08, gain: part === 'intro' || part === 'outro' ? 0.04 : 0.055, pan: s % 2 ? 0.25 : -0.25, delay: 0.15 });
        }
      }
      if (i % 4 === 0 || part === 'final') note(0, 'pad', { notes: tones, length: 16, gain: 0.018, cutoff: 1100 });
      if (part === 'B' || part === 'break') {
        // Rule 30 plays: a live cell starts a note, the next three cells choose it
        const PENT = [0, 3, 5, 7, 10];
        const key = tones[0] + 12;
        for (let s = 0; s < 16; s++) {
          const t = (bar * 16 + s) % (column.length - 3);
          if (!column[t]) continue;
          const pick = (column[t + 1] << 2) | (column[t + 2] << 1) | column[t + 3];
          const pitch = s === 0 ? key : key + PENT[pick % 5] + 12 * Math.floor(pick / 5);
          note(s / 4, 'lead', { note: pitch, length: (column[t + 1] ? 0.5 : 0.25) * 0.9, wave: 'pulse', gain: part === 'break' ? 0.07 : 0.1, delay: 0.25 });
        }
      }
    },
  },

  lattice: {
    name: 'Lattice',
    bpm: 122,
    about: 'Warm house: seventh chords stabbed on the off-beats, a syncopated bass, shakers and claps, and a bell melody in the B sections.',
    chords: [[50, 'm7'], [55, 'dom7'], [60, 'maj7'], [57, 'm7']],
    pump: 0.35,
    bar(note, { part, i, tones, bass }) {
      const drums = part === 'A' || part === 'B' || (part === 'build' && i >= 2);
      if (drums) {
        for (let beat = 0; beat < 4; beat++) note(beat, 'kick', { gain: 0.85 });
        note(1, 'clap', { gain: 0.35 });
        note(3, 'clap', { gain: 0.35 });
        for (let s = 0; s < 16; s++) note(s / 4, 'hat', { gain: s % 4 === 2 ? 0.07 : 0.03, pan: 0.3 });
        if (part === 'B') for (let beat = 0; beat < 4; beat++) note(beat + 0.5, 'hat', { open: true, gain: 0.05 });
      } else if (part === 'build' || part === 'break') {
        for (let s = 0; s < 16; s++) note(s / 4, 'hat', { gain: s % 4 === 2 ? 0.05 : 0.02, pan: 0.3 });
      }
      if (part !== 'intro' && part !== 'final' && part !== 'outro') {
        [[0, 0], [0.75, 0], [1.5, 12], [2, 0], [2.75, 7], [3.5, 10]].forEach(([beat, o]) => note(beat, 'bass', { note: bass + o, length: 0.3, gain: 0.34, bright: 0.7 }));
      }
      if (part !== 'final') {
        for (const beat of [0.5, 1.5, 2.25, 3.5]) {
          for (const t of tones.slice(0, 4)) note(beat, 'pluck', { note: t, length: 0.15, gain: part === 'intro' ? 0.03 : 0.04, delay: 0.2, verb: 0.2 });
        }
      }
      if (part === 'intro' || part === 'break' || part === 'outro' || part === 'final') {
        if (i % 2 === 0 || part === 'final') note(0, 'pad', { notes: tones, length: 8, gain: 0.025, cutoff: 1200 });
      }
      if (part === 'B') {
        for (const [s, len, d] of PHRASES[[1, 0, 3, 2][i % 4]]) note(s / 4, 'pluck', { note: toneOf(tones, d) + 24, wave: 'bell', length: len / 4, gain: 0.07, delay: 0.35, verb: 0.3 });
      }
    },
  },

  lightspeed: {
    name: 'Lightspeed',
    bpm: 132,
    about: 'Driving synthwave: a pumping sixteenth-note bass, big reverb snares on two and four, wide pads, and a soaring lead in the B sections.',
    chords: [[52, 'min'], [60, 'maj'], [55, 'maj'], [62, 'maj']],
    pump: 0.5,
    bar(note, { part, i, tones, bass, bar }) {
      const drums = part === 'A' || part === 'B' || (part === 'build' && i >= 2);
      if (drums) {
        for (const beat of part === 'B' ? [0, 1, 2, 2.5, 3] : [0, 1, 2, 3]) note(beat, 'kick', { gain: 0.85 });
        note(1, 'snare', { gain: 0.5, verb: 0.55 });
        note(3, 'snare', { gain: 0.5, verb: 0.55 });
        for (let s = 0; s < 8; s++) note(s / 2, 'hat', { gain: s % 2 ? 0.07 : 0.04 });
      } else if (part === 'build') {
        for (let s = 0; s < 4 * (i + 1); s++) note(s / (i + 1), 'snare', { gain: 0.08 + 0.04 * i, verb: 0.3 });
      }
      if (part !== 'intro' && part !== 'final' && part !== 'outro') {
        for (let s = 0; s < 16; s++) note(s / 4, 'bass', { note: bass + (s % 2 ? 12 : 0), length: 0.2, gain: 0.28, bright: 0.8 });
      }
      if (part !== 'final' && part !== 'intro') {
        const order = [0, 2, 4, 2, 1, 3, 5, 3];
        for (let s = 0; s < 16; s++) note(s / 4, 'pluck', { note: toneOf(tones, order[(s + bar) % 8]) + 12, gain: 0.05, pan: s % 2 ? 0.4 : -0.4, delay: 0.35 });
      }
      if (i % 2 === 0 || part === 'final') note(0, 'pad', { notes: tones, length: 8, gain: 0.035, cutoff: 1800 });
      if (part === 'B') {
        for (const [s, len, d] of PHRASES[[2, 0, 1, 3][i % 4]]) note(s / 4, 'lead', { note: toneOf(tones, d) + 12, length: len / 4 * 0.95, gain: 0.13, delay: 0.4, verb: 0.35 });
      }
    },
  },
};

/** @returns {{at: number, instrument: string, options: object}[]} every note of a track, `at` in seconds */
export function compose(id, seconds) {
  const track = TRACKS[id];
  if (!track) throw new Error(`No track "${id}"`);
  const beat = 60 / track.bpm, barLength = 4 * beat;
  const bars = Math.max(12, Math.floor(seconds / barLength));
  const column = rule30Column(bars * 16 + 8);
  const notes = [];
  form(bars).forEach(({ part, i }, bar) => {
    const chord = part === 'final' ? track.chords[0] : track.chords[bar % track.chords.length];
    const tones = voicing(chord);
    const note = (at, instrument, options = {}) => {
      const o = { ...options };
      if (o.length !== undefined && instrument !== 'pad') o.length *= beat;
      if (instrument === 'pad') o.length = (o.length ?? 4) * beat;
      notes.push({ at: bar * barLength + at * beat, instrument, options: o });
    };
    track.bar(note, { part, i, chord, tones, bass: bassRoot(chord), bar, column });
  });
  // The last chord rings out to the end
  const last = notes.filter((n) => n.instrument === 'pad').at(-1);
  if (last) last.options.length = Math.max(last.options.length, seconds - last.at);
  return notes.filter((n) => n.at < seconds).sort((a, b) => a.at - b.at);
}

/**
 * Plays a track into stereo samples.
 * @param {string} id - a key of TRACKS
 * @param {object} options
 * @param {number} options.seconds - how long; the track's form fits itself to it
 * @param {number} [options.sampleRate]
 * @param {(done: number) => void} [options.progress] - called now and then with 0 to 1
 * @returns {{left: Float32Array, right: Float32Array, sampleRate: number}} peaking at 0.9
 */
export function renderTrack(id, { seconds, sampleRate = 48000, progress = () => {} }) {
  const track = TRACKS[id];
  const sr = sampleRate;
  const total = Math.round(seconds * sr);
  const left = new Float32Array(total), right = new Float32Array(total);
  const random = seeded(30);
  const pending = compose(id, seconds).map((n) => ({ ...n, start: Math.round(n.at * sr) }));
  const kicks = pending.filter((n) => n.instrument === 'kick').map((n) => n.start);
  const BLOCK = 512;
  const bus = Object.fromEntries(['L', 'R', 'pL', 'pR', 'dL', 'dR', 'vL', 'vR'].map((k) => [k, new Float32Array(BLOCK)]));

  // A ping-pong delay of a dotted eighth, darkening as it repeats
  const delayLength = Math.round((60 / track.bpm) * 0.75 * sr);
  const delay = [new Float32Array(delayLength), new Float32Array(delayLength)];
  let delayAt = 0, delayDampL = 0, delayDampR = 0;
  // A small room: four damped combs and two allpasses a side
  const scale = sr / 44100;
  const combs = [[1201, 1327, 1433, 1559], [1223, 1347, 1459, 1583]].map((side) => side.map((n) => ({
    buffer: new Float32Array(Math.round(n * scale)), at: 0, store: 0,
  })));
  const passes = [[223, 557], [241, 571]].map((side) => side.map((n) => ({ buffer: new Float32Array(Math.round(n * scale)), at: 0 })));
  const reverb = (side, x) => {
    let out = 0;
    for (const c of combs[side]) {
      const y = c.buffer[c.at];
      c.store = y * 0.75 + c.store * 0.25;
      c.buffer[c.at] = x + c.store * 0.8;
      c.at = (c.at + 1) % c.buffer.length;
      out += y;
    }
    out *= 0.25;
    for (const a of passes[side]) {
      const y = a.buffer[a.at];
      a.buffer[a.at] = out + y * 0.5;
      a.at = (a.at + 1) % a.buffer.length;
      out = y - out * 0.5;
    }
    return out;
  };

  let active = [], next = 0, kick = 0, lastKick = -1e9;
  for (let s0 = 0; s0 < total; s0 += BLOCK) {
    const n = Math.min(BLOCK, total - s0);
    for (const k in bus) bus[k].fill(0);
    while (next < pending.length && pending[next].start < s0 + n) {
      const p = pending[next++];
      active.push(INSTRUMENTS[p.instrument]({ ...p.options, at: p.start, sampleRate: sr, random }));
    }
    for (const voice of active) {
      const i0 = Math.max(0, voice.start - s0), i1 = Math.min(n, voice.end - s0);
      if (i1 > i0) voice.process(bus, i0, i1, s0);
    }
    active = active.filter((voice) => voice.end > s0 + n);
    for (let i = 0; i < n; i++) {
      const s = s0 + i;
      while (kick < kicks.length && kicks[kick] <= s) lastKick = kicks[kick++];
      const pump = 1 - track.pump * Math.exp(-((s - lastKick) / sr) * 9);
      const dl = delay[0][delayAt], dr = delay[1][delayAt];
      delayDampL += 0.35 * (dl - delayDampL);
      delayDampR += 0.35 * (dr - delayDampR);
      delay[0][delayAt] = bus.dL[i] + delayDampR * 0.42;
      delay[1][delayAt] = bus.dR[i] + delayDampL * 0.42;
      delayAt = (delayAt + 1) % delayLength;
      const L = bus.L[i] + bus.pL[i] * pump + dl * 0.8 + reverb(0, bus.vL[i]) * 0.9;
      const R = bus.R[i] + bus.pR[i] * pump + dr * 0.8 + reverb(1, bus.vR[i]) * 0.9;
      left[s] = Math.tanh(L * 0.9);
      right[s] = Math.tanh(R * 0.9);
    }
    if ((s0 / BLOCK) % 200 === 0) progress(s0 / total);
  }
  let peak = 0;
  for (let s = 0; s < total; s++) peak = Math.max(peak, Math.abs(left[s]), Math.abs(right[s]));
  const gain = peak > 0 ? 0.9 / peak : 1;
  for (let s = 0; s < total; s++) {
    left[s] *= gain;
    right[s] *= gain;
  }
  progress(1);
  return { left, right, sampleRate: sr };
}

/** @returns {Uint8Array} samples as a 16-bit stereo WAV file */
export function wav({ left, right, sampleRate }) {
  const frames = left.length;
  const out = new DataView(new ArrayBuffer(44 + frames * 4));
  const text = (at, s) => { for (let i = 0; i < s.length; i++) out.setUint8(at + i, s.charCodeAt(i)); };
  text(0, 'RIFF');
  out.setUint32(4, 36 + frames * 4, true);
  text(8, 'WAVEfmt ');
  out.setUint32(16, 16, true);
  out.setUint16(20, 1, true);
  out.setUint16(22, 2, true);
  out.setUint32(24, sampleRate, true);
  out.setUint32(28, sampleRate * 4, true);
  out.setUint16(32, 4, true);
  out.setUint16(34, 16, true);
  text(36, 'data');
  out.setUint32(40, frames * 4, true);
  for (let i = 0; i < frames; i++) {
    out.setInt16(44 + i * 4, Math.max(-1, Math.min(1, left[i])) * 32767, true);
    out.setInt16(46 + i * 4, Math.max(-1, Math.min(1, right[i])) * 32767, true);
  }
  return new Uint8Array(out.buffer);
}
