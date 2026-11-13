// SPDX-License-Identifier: Apache-2.0
//
// How each kind of contest looks on the page (#77): its colour and its logo, drawn here as SVG,
// stroke-only on a 24-unit grid, so it takes the colour it is given. Every contest of a kind
// shares its look: Speed a stopwatch, Methuselah an hourglass, Contained chaos a scribble held
// inside a box. Verify a result, which judges every contest's entries, has a pair of scales.

const SVG = 'http://www.w3.org/2000/svg';

/** Colours by kind, for the cards' borders and glow and the logos' strokes. */
export const LOOKS = Object.freeze({
  speed: Object.freeze({ color: '#f2c14e', name: 'Speed' }),
  methuselah: Object.freeze({ color: '#b39cff', name: 'Methuselah' }),
  'contained-chaos': Object.freeze({ color: '#4fd1c5', name: 'Contained chaos' }),
});

// Each logo as its shapes: [tag, attributes]
const SHAPES = {
  // A stopwatch, its hand past the top, with three speed lines behind it
  speed: [
    ['circle', { cx: 14, cy: 13.5, r: 7.5 }],
    ['path', { d: 'M14 13.5 L17.2 10.3' }],
    ['path', { d: 'M12 3.5 H16 M14 3.5 V6' }],
    ['path', { d: 'M19.6 6.4 L21 5' }],
    ['path', { d: 'M1.5 10.5 H4.5 M0.8 13.5 H4 M1.5 16.5 H4.5' }],
  ],
  // An hourglass with sand settled at the foot
  methuselah: [
    ['path', { d: 'M6 2.5 H18 M6 21.5 H18' }],
    ['path', { d: 'M7.5 2.5 C7.5 8 11 9.5 12 12 C13 9.5 16.5 8 16.5 2.5' }],
    ['path', { d: 'M7.5 21.5 C7.5 16 11 14.5 12 12 C13 14.5 16.5 16 16.5 21.5' }],
    ['path', { d: 'M9.3 20.3 C10 18.2 11.3 17.4 12 17.2 C12.7 17.4 14 18.2 14.7 20.3 Z', fill: 'currentColor', stroke: 'none' }],
  ],
  // A pair of scales on a post: Verify a result, the judge of every contest's entries
  verify: [
    ['circle', { cx: 12, cy: 3.6, r: 1.1 }],
    ['path', { d: 'M12 4.7 V20 M8 20.5 H16 M4.5 7 H19.5' }],
    ['path', { d: 'M4.5 7 L2.2 13.2 M4.5 7 L6.8 13.2 M19.5 7 L17.2 13.2 M19.5 7 L21.8 13.2' }],
    ['path', { d: 'M1.8 13.2 H7.2 C6.8 15.6 2.2 15.6 1.8 13.2 Z M16.8 13.2 H22.2 C21.8 15.6 17.2 15.6 16.8 13.2 Z' }],
  ],
  // A box holding a scribble that never settles
  'contained-chaos': [
    ['rect', { x: 2.5, y: 2.5, width: 19, height: 19, rx: 3 }],
    ['path', { d: 'M6 15 C7 8 10 17.5 11.5 10 C12.5 5.5 15.5 7.5 13.5 12 C11.8 15.8 16.5 18 18 9.5' }],
    ['circle', { cx: 7.5, cy: 7, r: 0.9, fill: 'currentColor', stroke: 'none' }],
    ['circle', { cx: 17.5, cy: 17.5, r: 0.9, fill: 'currentColor', stroke: 'none' }],
    ['circle', { cx: 9, cy: 18.5, r: 0.9, fill: 'currentColor', stroke: 'none' }],
  ],
};

/**
 * A contest kind's logo, as an SVG element in its colour.
 * @param {string} kind - 'speed', 'methuselah' or 'contained-chaos'
 * @param {number} [size] - in CSS pixels
 * @param {string} [className]
 */
export function logo(kind, size = 48, className = 'contests-logo') {
  return glyph(kind, size, className, LOOKS[kind]?.color);
}

/** Verify a result's scales, in the colour of the text beside them. */
export function verifyGlyph(size = 22, className = 'contests-verify-glyph') {
  return glyph('verify', size, className);
}

function glyph(kind, size, className, color) {
  const svg = document.createElementNS(SVG, 'svg');
  const attrs = {
    class: className, viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor',
    'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
  };
  for (const [name, value] of Object.entries(attrs)) svg.setAttribute(name, String(value));
  if (color) svg.style.color = color;
  for (const [tag, shape] of SHAPES[kind] ?? []) {
    const node = document.createElementNS(SVG, tag);
    for (const [name, value] of Object.entries(shape)) node.setAttribute(name, String(value));
    svg.append(node);
  }
  return svg;
}
