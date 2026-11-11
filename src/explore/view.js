// SPDX-License-Identifier: Apache-2.0
//
// Explore's 3D view: draws snapshots from the engine's Worker. Unlike the other modes'
// fixed size³ point cloud, its buffer grows with the pattern, and the camera follows the
// pattern's extent. Past the render budget, the Worker sends the occupied chunks instead of
// the cells, and they are drawn as boxes.

import * as THREE from 'three';
import { frameBox, ease } from './framing.js';

/** The most cells drawn one by one; past it, chunks are drawn as boxes. #39 may revise it. */
export const RENDER_BUDGET = 300_000;

// The other modes' colours: cyan to red along x, lighter along z
const FROM = [0, 180 / 255, 200 / 255];
const TO = [200 / 255, 20 / 255, 0];

export class ExploreView {
  constructor(scene) {
    this.group = new THREE.Group(); // flipped as a whole by the orientation toggle
    scene.add(this.group);

    this.material = new THREE.PointsMaterial({ size: 1.2, vertexColors: true, sizeAttenuation: true });
    this.points = new THREE.Points(new THREE.BufferGeometry(), this.material);
    this.points.frustumCulled = false; // the bounding sphere would go stale as the buffer is rewritten
    this.capacity = 0;
    this.grow(0); // a buffer from the start, so an empty snapshot draws nothing rather than failing
    this.group.add(this.points);

    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.boxMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.45, depthWrite: false });
    this.boxes = null;

    this.arena = null;
    this.grid = null;
    this.gridKey = null; // the snapped box the grid was built for
    this.box = null; // the bounding box of what is drawn, in cells
    this.drawing = 'cells';
  }

  /** Draws a snapshot from the Worker: cells, or chunks past the render budget. */
  show(snapshot) {
    if (snapshot.cells) this.drawCells(snapshot.cells);
    else this.drawChunks(snapshot.chunks, snapshot.chunkSize);
  }

  drawCells(cells) {
    const count = cells.length / 3;
    this.drawing = 'cells';
    this.box = boundsOf(cells, 3, 0);
    if (count > this.capacity) this.grow(count);
    const geometry = this.points.geometry;
    const positions = geometry.attributes.position.array;
    const colours = geometry.attributes.color.array;
    const { min, max } = this.box ?? { min: [0, 0, 0], max: [0, 0, 0] };
    const spanX = Math.max(1, max[0] - min[0]);
    const spanZ = Math.max(1, max[2] - min[2]);
    for (let i = 0; i < cells.length; i += 3) {
      const x = cells[i], y = cells[i + 1], z = cells[i + 2];
      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
      const t = (x - min[0]) / spanX;
      const light = 0.45 * ((z - min[2]) / spanZ);
      for (let c = 0; c < 3; c++) {
        const base = FROM[c] + (TO[c] - FROM[c]) * t;
        colours[i + c] = base + (1 - base) * light;
      }
    }
    geometry.setDrawRange(0, count);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    this.points.visible = true;
    if (this.boxes) this.boxes.visible = false;
  }

  drawChunks(chunks, n) {
    const count = chunks.length / 4;
    this.drawing = 'chunks';
    const corners = boundsOf(chunks, 4, 0);
    this.box = corners && { min: corners.min, max: corners.max.map((c) => c + n - 1) };
    if (!this.boxes || this.boxes.instanceMatrix.count < count) this.growBoxes(count);
    const matrix = new THREE.Matrix4();
    const colour = new THREE.Color();
    const volume = n * n * n;
    const { min, max } = this.box ?? { min: [0, 0, 0], max: [0, 0, 0] };
    const spanX = Math.max(1, max[0] - min[0]);
    for (let i = 0, k = 0; i < chunks.length; i += 4, k++) {
      const x = chunks[i], y = chunks[i + 1], z = chunks[i + 2];
      // A chunk covers cells x .. x + n - 1, each drawn centred on its coordinate
      matrix.makeScale(n, n, n).setPosition(x + (n - 1) / 2, y + (n - 1) / 2, z + (n - 1) / 2);
      this.boxes.setMatrixAt(k, matrix);
      // Colour along x like the cells; brighter where the chunk is fuller
      const t = (x - min[0]) / spanX;
      const fill = Math.min(1, chunks[i + 3] / volume);
      const shade = 0.35 + 0.65 * Math.sqrt(fill);
      colour.setRGB(
        (FROM[0] + (TO[0] - FROM[0]) * t) * shade,
        (FROM[1] + (TO[1] - FROM[1]) * t) * shade,
        (FROM[2] + (TO[2] - FROM[2]) * t) * shade,
      );
      this.boxes.setColorAt(k, colour);
    }
    this.boxes.count = count;
    this.boxes.instanceMatrix.needsUpdate = true;
    if (this.boxes.instanceColor) this.boxes.instanceColor.needsUpdate = true;
    this.boxes.visible = true;
    this.points.visible = false;
  }

  /** Outlines the arena, a box in cells, or removes the outline for null. */
  showArena(arena) {
    if (this.arena) {
      this.group.remove(this.arena);
      this.arena.geometry.dispose();
      this.arena.material.dispose();
      this.arena = null;
    }
    if (!arena) return;
    const size = [0, 1, 2].map((a) => arena.max[a] - arena.min[a] + 1);
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(...size));
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
    this.arena = new THREE.LineSegments(edges, material);
    this.arena.position.set(...[0, 1, 2].map((a) => (arena.min[a] + arena.max[a]) / 2));
    this.group.add(this.arena);
  }

  /**
   * The grid toggle in Explore: the pattern's bounding box, widened to the engine's chunk
   * boundaries, with a floor grid one chunk apart, so the chunks that hold the pattern show.
   * Rebuilt only when the snapped box changes.
   * @param {boolean} on
   * @param {{min: number[], max: number[]} | null} extent - the live cells' bounding box
   * @param {number} n - the chunk size
   */
  showGrid(on, extent, n) {
    // Cells are drawn centred on their coordinates, so a chunk's faces are half a cell out
    const lo = extent && extent.min.map((c) => Math.floor(c / n) * n - 0.5);
    const hi = extent && extent.max.map((c) => (Math.floor(c / n) + 1) * n - 0.5);
    const key = on && extent ? `${lo},${hi}` : null;
    if (key === this.gridKey) return;
    this.gridKey = key;
    if (this.grid) {
      this.group.remove(this.grid);
      this.grid.geometry.dispose();
      this.grid.material.dispose();
      this.grid = null;
    }
    if (!key) return;

    const lines = [];
    const segment = (a, b) => lines.push(...a, ...b);
    // The box's twelve edges
    for (const y of [lo[1], hi[1]]) {
      for (const z of [lo[2], hi[2]]) segment([lo[0], y, z], [hi[0], y, z]);
      for (const x of [lo[0], hi[0]]) segment([x, y, lo[2]], [x, y, hi[2]]);
    }
    for (const x of [lo[0], hi[0]]) for (const z of [lo[2], hi[2]]) segment([x, lo[1], z], [x, hi[1], z]);
    // The floor grid, a chunk apart, or a multiple of that if the floor is very wide
    let spacing = n;
    while ((hi[0] - lo[0]) / spacing > 200 || (hi[2] - lo[2]) / spacing > 200) spacing *= 2;
    for (let x = lo[0] + spacing; x < hi[0]; x += spacing) segment([x, lo[1], lo[2]], [x, lo[1], hi[2]]);
    for (let z = lo[2] + spacing; z < hi[2]; z += spacing) segment([lo[0], lo[1], z], [hi[0], lo[1], z]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
    this.grid = new THREE.LineSegments(geometry, material);
    this.grid.frustumCulled = false;
    this.group.add(this.grid);
  }

  /**
   * Called every frame: applies the cell size and orientation, and, when `follow` is on, eases
   * the camera to keep the pattern in view, keeping the direction the visitor chose.
   */
  frame({ camera, controls, elapsedMs, follow, cellSize, flip }) {
    this.material.size = cellSize;
    this.group.scale.y = flip ? -1 : 1;
    if (!follow || !camera || !controls) return;

    const { centre, radius, distance } = frameBox(this.box, camera.fov, camera.aspect);
    if (flip) centre[1] = -centre[1];
    const target = controls.target;
    const offset = camera.position.clone().sub(target);
    const current = offset.length() || 1;
    target.set(
      ease(target.x, centre[0], elapsedMs),
      ease(target.y, centre[1], elapsedMs),
      ease(target.z, centre[2], elapsedMs),
    );
    const next = ease(current, distance, elapsedMs);
    camera.position.copy(target).add(offset.multiplyScalar(next / current));
    camera.lookAt(target);

    // Keep the whole pattern inside the far plane as it grows
    const far = Math.max(1000, 4 * (next + radius));
    if (Math.abs(camera.far - far) > 0.1 * far) {
      camera.far = far;
      camera.updateProjectionMatrix();
    }
  }

  dispose() {
    this.points.geometry.dispose();
    this.material.dispose();
    this.boxGeometry.dispose();
    this.boxMaterial.dispose();
    this.boxes?.dispose();
    this.showArena(null);
    this.showGrid(false, null, 1);
    this.group.removeFromParent();
  }

  // ---- Buffers ----

  grow(count) {
    this.capacity = Math.max(count, 2 * this.capacity, 4096);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * this.capacity), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(3 * this.capacity), 3));
    this.points.geometry.dispose();
    this.points.geometry = geometry;
  }

  growBoxes(count) {
    const capacity = Math.max(count, 2 * (this.boxes?.instanceMatrix.count ?? 0), 256);
    if (this.boxes) {
      this.group.remove(this.boxes);
      this.boxes.dispose();
    }
    this.boxes = new THREE.InstancedMesh(this.boxGeometry, this.boxMaterial, capacity);
    this.boxes.frustumCulled = false;
    this.group.add(this.boxes);
  }
}

/** The bounding box of the first three numbers of each `stride`; null if there are none. */
function boundsOf(array, stride) {
  if (!array.length) return null;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < array.length; i += stride) {
    for (let a = 0; a < 3; a++) {
      const c = array[i + a];
      if (c < min[a]) min[a] = c;
      if (c > max[a]) max[a] = c;
    }
  }
  return { min, max };
}
