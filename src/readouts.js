// SPDX-License-Identifier: Apache-2.0
//
// The readouts above the control bar (#175) hold their width while their values change. The font
// is monospaced, so a value's slot is as many character widths (`ch`) as the longest text it will
// show: the State, Rate, Direction, Grid, Orientation and Cell size slots are fixed in the
// stylesheet; Generation's and Slice's depend on the run, so whoever writes them sets the slot
// too, from the last generation or slice they can reach. A value longer than its slot still shows
// whole: the line grows, never wraps.
//
// No DOM lookups: the tests run it in Node.

/**
 * Makes `element`'s slot as wide as `longest`, in characters.
 * @param {{style: {minWidth: string}} | null} element - a readout value; nothing happens without one
 * @param {string} longest - the longest text the value will show while this run lasts
 */
export function holdWidth(element, longest) {
  if (element) element.style.minWidth = `${[...String(longest)].length}ch`;
}

/** The longest text `current / last` will show while counting up to `last`. */
export function countWidth(last) {
  return `${last} / ${last}`;
}
