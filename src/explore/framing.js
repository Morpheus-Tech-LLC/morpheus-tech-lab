// SPDX-License-Identifier: Apache-2.0
//
// Where Explore's camera looks, and how far back it stands, to keep a growing pattern in view.
// Plain arithmetic, apart from Three.js, so the tests run it in Node.

/** How much room to leave around the pattern: 1 fits its bounding sphere exactly. */
export const MARGIN = 1.25;
/** The closest the camera comes, in cells, so a tiny pattern isn't filled edge to edge. */
export const MIN_DISTANCE = 30;

/**
 * @param {{min: number[], max: number[]} | null} box - the live cells' bounding box, in cells
 * @param {number} fov - the camera's vertical field of view, in degrees
 * @param {number} aspect - width / height
 * @returns {{centre: number[], radius: number, distance: number}} what to look at, the radius
 *   of a sphere around the pattern, and the camera's distance from the centre that fits it
 */
export function frameBox(box, fov, aspect) {
  if (!box) return { centre: [0, 0, 0], radius: 0, distance: MIN_DISTANCE };
  const centre = [0, 1, 2].map((a) => (box.min[a] + box.max[a]) / 2);
  // Half the diagonal, plus half a cell: cells are drawn at their coordinates, one cell wide
  const half = [0, 1, 2].map((a) => (box.max[a] - box.min[a]) / 2 + 0.5);
  const radius = Math.hypot(...half);
  const vertical = (fov * Math.PI) / 360;
  const horizontal = Math.atan(Math.tan(vertical) * aspect);
  const narrowest = Math.min(vertical, horizontal);
  const distance = Math.max(MIN_DISTANCE, (MARGIN * radius) / Math.sin(narrowest));
  return { centre, radius, distance };
}

/**
 * Moves a value part of the way toward a target, so the camera eases instead of jumping:
 * half of the gap closes every `halfLife` milliseconds, whatever the frame rate.
 */
export function ease(value, target, elapsedMs, halfLife = 250) {
  return target + (value - target) * 0.5 ** (elapsedMs / halfLife);
}
