// SPDX-License-Identifier: Apache-2.0
//
// A small orthographic camera for the guide's 3D animations (#159), drawn as shaded cubes on a
// 2D canvas, so the guide never touches the lab's WebGL renderer. y is up. The camera turns by
// `yaw` around the vertical axis and looks down by `pitch` (π/2 is straight down). Every cube
// faces the camera the same way, so which faces show, and where a cube's corners fall, is worked
// out once per frame; each cube then needs only its centre projected. No DOM.

/** The cube's six faces: the outward normal, its four corners (±0.5), and how brightly it is lit. */
const FACES = [
  { normal: [0, 1, 0], light: 1, corners: [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]] },
  { normal: [0, -1, 0], light: 0.45, corners: [[-1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, -1, -1]] },
  { normal: [1, 0, 0], light: 0.78, corners: [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]] },
  { normal: [-1, 0, 0], light: 0.62, corners: [[-1, -1, -1], [-1, 1, -1], [-1, 1, 1], [-1, -1, 1]] },
  { normal: [0, 0, 1], light: 0.7, corners: [[-1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, 1]] },
  { normal: [0, 0, -1], light: 0.55, corners: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]] },
];

/**
 * @param {number} yaw - radians around the vertical axis
 * @param {number} pitch - radians looking down, 0 level to π/2 straight down
 */
export function camera(yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  // Towards the viewer, in world coordinates
  const view = [sy * cp, sp, cy * cp];
  /** @returns {[number, number]} screen x (right) and y (down), one unit per cell */
  const project = (x, y, z) => {
    const rx = x * cy - z * sy;
    const rz = x * sy + z * cy;
    return [rx, -(y * cp - rz * sp)];
  };
  /** @returns {number} larger is nearer the viewer */
  const depth = (x, y, z) => x * view[0] + y * view[1] + z * view[2];
  return { yaw, pitch, view, project, depth };
}

/** @returns {typeof FACES} the faces turned towards the camera, at most three */
export function visibleFaces(cam) {
  return FACES.filter(({ normal }) => normal[0] * cam.view[0] + normal[1] * cam.view[1] + normal[2] * cam.view[2] > 1e-6);
}

/**
 * Draws cubes, far ones first.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x: number, y: number, z: number, color: number[], alpha?: number}[]} cubes - color as [r, g, b]
 * @param {ReturnType<typeof camera>} cam
 * @param {{scale: number, cx: number, cy: number, size?: number, outline?: string}} view - pixels per
 *   cell, the screen point the origin falls on, and the cube's size in cells (0.86 leaves a gap)
 */
export function drawCubes(ctx, cubes, cam, { scale, cx, cy, size = 0.86, outline = null }) {
  const faces = visibleFaces(cam).map((face) => ({
    light: face.light,
    corners: face.corners.map(([x, y, z]) => cam.project(x * size / 2, y * size / 2, z * size / 2)),
  }));
  const order = cubes
    .map((cube) => ({ cube, d: cam.depth(cube.x, cube.y, cube.z) }))
    .sort((a, b) => a.d - b.d);
  for (const { cube } of order) {
    const [px, py] = cam.project(cube.x, cube.y, cube.z);
    const sx = cx + px * scale, sy = cy + py * scale;
    ctx.globalAlpha = cube.alpha ?? 1;
    for (const face of faces) {
      const [r, g, b] = cube.color;
      ctx.fillStyle = `rgb(${Math.round(r * face.light)},${Math.round(g * face.light)},${Math.round(b * face.light)})`;
      ctx.beginPath();
      face.corners.forEach(([fx, fy], i) => {
        const X = sx + fx * scale, Y = sy + fy * scale;
        if (i) ctx.lineTo(X, Y);
        else ctx.moveTo(X, Y);
      });
      ctx.closePath();
      ctx.fill();
      if (outline) {
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

/**
 * The scale and centre that fit a box of cells into a w × h area, seen by the camera.
 * @param {{min: number[], max: number[]}} box - inclusive, in cells
 * @returns {{scale: number, cx: number, cy: number}}
 */
export function fitBox(box, cam, w, h, margin = 0.82) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const x of [box.min[0] - 0.5, box.max[0] + 0.5]) {
    for (const y of [box.min[1] - 0.5, box.max[1] + 0.5]) {
      for (const z of [box.min[2] - 0.5, box.max[2] + 0.5]) {
        const [px, py] = cam.project(x, y, z);
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }
  }
  const scale = Math.min((w * margin) / (maxX - minX || 1), (h * margin) / (maxY - minY || 1));
  return { scale, cx: w / 2 - ((minX + maxX) / 2) * scale, cy: h / 2 - ((minY + maxY) / 2) * scale };
}
