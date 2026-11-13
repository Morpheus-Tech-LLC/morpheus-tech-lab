// SPDX-License-Identifier: Apache-2.0
//
// The seed editor's 3D view (#70): the seed box drawn into the lab's own renderer, so there is
// never a second WebGL context, with its own scene, camera and orbit controls while the editor is
// open. Every live cell is a solid cube and every empty place a faint dot, so the whole 10³
// lattice shows; the selection is a translucent box with a bright outline, its live cells tinted
// and its empty places bright; the cursor is a wireframe cube with guide lines along the three
// axes. It draws only when something changes: the model, the camera or the window's size.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SEED_BOX } from './seed.js';
import { PLACES, cellAt, indexOf } from './editorModel.js';

// The seed box's centre: cells are drawn centred on their coordinates, so -5 to 4 spans -5.5 to 4.5
const CENTRE = new THREE.Vector3(...SEED_BOX.min.map((lo, a) => (lo + SEED_BOX.max[a]) / 2));
const HALF = (SEED_BOX.max[0] - SEED_BOX.min[0] + 1) / 2;
const DISTANCE = 26;

/** The views the panel's buttons give: where the camera stands, from the box's centre. */
const VIEWS = {
  front: [0, 0, 1],
  top: [0, 1, 0.0001], // straight down, with -z at the top of the screen
  side: [1, 0, 0],
  angled: [0.55, 0.45, 0.7],
};

// The other modes' colours, cyan to red along x
const FROM = [0, 180 / 255, 200 / 255];
const TO = [200 / 255, 20 / 255, 0];
const SELECTED_TINT = new THREE.Color(1, 0.92, 0.45);
const DOT_EMPTY = new THREE.Color(0.32, 0.36, 0.42);
const DOT_FADED = new THREE.Color(0.14, 0.15, 0.17);
const DOT_SELECTED = new THREE.Color(0.65, 0.92, 1);
const AXIS_COLOURS = [0xff5a5a, 0x5aff7a, 0x5a9cff]; // x red, y green, z blue

export class EditorView {
  /**
   * @param {THREE.WebGLRenderer} renderer - the lab's renderer, borrowed while the editor is open
   * @param {{flip?: boolean}} [options] - flip: draw y downward, as the lab's orientation toggle does
   */
  constructor(renderer, { flip = false } = {}) {
    this.renderer = renderer;
    this.dirty = true;
    this.inset = { right: 0, bottom: 0 };

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x141414);
    const light = new THREE.DirectionalLight(0xffffff, 1.6);
    light.position.set(1, 2, 3);
    this.scene.add(light, new THREE.AmbientLight(0xffffff, 0.9));

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.target.copy(CENTRE);
    this.controls.enableDamping = false; // damping would need a frame after every move
    this.controls.minDistance = 4;
    this.controls.maxDistance = 120;
    this.onChange = () => { this.dirty = true; };
    this.controls.addEventListener('change', this.onChange);

    this.group = new THREE.Group();
    this.group.scale.y = flip ? -1 : 1;
    this.scene.add(this.group);

    const cube = new THREE.BoxGeometry(0.84, 0.84, 0.84);
    this.cubeGeometry = cube;
    this.solidMaterial = new THREE.MeshLambertMaterial();
    this.fadedMaterial = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.1, depthWrite: false });
    this.solid = this.instanced(this.solidMaterial);
    this.faded = this.instanced(this.fadedMaterial);
    this.solidPlaces = new Int32Array(PLACES); // the place each solid instance draws, for picking

    // Every place's dot; a live cell's cube hides its own
    const dotGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(3 * PLACES);
    for (let i = 0; i < PLACES; i++) positions.set(cellAt(i), 3 * i);
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dotGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(3 * PLACES), 3));
    this.dotMaterial = new THREE.PointsMaterial({ size: 0.16, vertexColors: true, sizeAttenuation: true });
    this.dots = new THREE.Points(dotGeometry, this.dotMaterial);
    this.group.add(this.dots);

    // The box's outline
    const side = 2 * HALF;
    this.outline = this.edges(new THREE.BoxGeometry(side, side, side), 0xffffff, 0.3);
    this.outline.position.copy(CENTRE);

    // The selection: a translucent box with a bright outline
    const unit = new THREE.BoxGeometry(1, 1, 1);
    this.selectionFill = new THREE.Mesh(unit, new THREE.MeshBasicMaterial({
      color: 0xffe066, transparent: true, opacity: 0.1, depthWrite: false,
    }));
    this.group.add(this.selectionFill);
    this.selectionEdges = this.edges(unit, 0xffe066, 0.95);

    // The cursor: a wireframe cube a little larger than a cell, and its guides to the box's faces
    this.cursor = this.edges(new THREE.BoxGeometry(1.12, 1.12, 1.12), 0xffffff, 1);
    this.guides = AXIS_COLOURS.map((colour) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: 0.85 }));
      line.frustumCulled = false;
      this.group.add(line);
      return line;
    });

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.4; // a click within 0.4 cells of a dot picks it
    this.fitScale = 1;
    this.resize();
    this.setView('angled');
  }

  /** Redraws from the model. @param {import('./editorModel.js').DesignModel} model */
  update(model, { fade = false } = {}) {
    const sel = model.selection();
    const focus = model.focus();
    const within = (box, [x, y, z]) => x >= box.min[0] && x <= box.max[0] && y >= box.min[1] && y <= box.max[1]
      && z >= box.min[2] && z <= box.max[2];
    const matrix = new THREE.Matrix4();
    const colour = new THREE.Color();
    const dotColours = this.dots.geometry.attributes.color.array;
    let solid = 0;
    let faded = 0;
    for (let i = 0; i < PLACES; i++) {
      const cell = cellAt(i);
      const selected = within(sel, cell);
      const dim = fade && !within(focus, cell);
      if (model.places[i]) {
        const t = (cell[0] - SEED_BOX.min[0]) / (SEED_BOX.max[0] - SEED_BOX.min[0]);
        colour.setRGB(...FROM.map((f, c) => f + (TO[c] - f) * t));
        if (selected) colour.lerp(SELECTED_TINT, 0.55);
        matrix.makeTranslation(...cell);
        const mesh = dim ? this.faded : this.solid;
        const k = dim ? faded++ : solid++;
        mesh.setMatrixAt(k, matrix);
        mesh.setColorAt(k, colour);
        if (!dim) this.solidPlaces[k] = i;
        dotColours.set([0, 0, 0], 3 * i);
      } else {
        const dot = selected ? DOT_SELECTED : dim ? DOT_FADED : DOT_EMPTY;
        dotColours.set([dot.r, dot.g, dot.b], 3 * i);
      }
    }
    for (const [mesh, count] of [[this.solid, solid], [this.faded, faded]]) {
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    this.dots.geometry.attributes.color.needsUpdate = true;
    this.fading = fade;
    this.focusBox = focus;

    // The selection's box, half a cell out from its cells' centres
    const size = sel.max.map((hi, a) => hi - sel.min[a] + 1);
    const middle = sel.min.map((lo, a) => (lo + sel.max[a]) / 2);
    for (const mesh of [this.selectionFill, this.selectionEdges]) {
      mesh.scale.set(size[0] + 0.06, size[1] + 0.06, size[2] + 0.06);
      mesh.position.set(...middle);
    }

    const c = model.cursor;
    this.cursor.position.set(...c);
    this.guides.forEach((line, a) => {
      const from = [...c];
      const to = [...c];
      from[a] = SEED_BOX.min[a] - 0.5;
      to[a] = SEED_BOX.max[a] + 0.5;
      line.geometry.attributes.position.array.set([...from, ...to]);
      line.geometry.attributes.position.needsUpdate = true;
    });
    this.dirty = true;
  }

  /** Puts the camera at one of the panel's views: 'front', 'top', 'side' or 'angled'. */
  setView(name) {
    const dir = new THREE.Vector3(...VIEWS[name]).normalize();
    this.camera.up.set(0, 1, 0);
    this.camera.position.copy(CENTRE).addScaledVector(dir, DISTANCE * this.fitScale);
    this.controls.target.copy(CENTRE);
    this.camera.lookAt(CENTRE);
    this.controls.update();
    this.dirty = true;
  }

  /**
   * The camera's right, up and viewing directions in the box's coordinates, for moveFor().
   * @returns {{right: number[], up: number[], forward: number[]}}
   */
  screenView() {
    this.camera.updateMatrixWorld();
    const e = this.camera.matrixWorld.elements;
    const flip = this.group.scale.y; // 1, or -1 when y is drawn downward
    const vector = (x, y, z) => [x, flip * y, z];
    return {
      right: vector(e[0], e[1], e[2]),
      up: vector(e[4], e[5], e[6]),
      forward: vector(-e[8], -e[9], -e[10]),
    };
  }

  /**
   * The cell under a point of the canvas: a live cube first, then the nearest place's dot. While
   * the rest is faded, only cells in the bright part can be picked.
   * @returns {number[] | null} [x, y, z]
   */
  pick(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.scene.updateMatrixWorld(); // the model may have changed since the last draw
    this.raycaster.setFromCamera(ndc, this.camera);
    const cube = this.raycaster.intersectObject(this.solid, false)[0];
    if (cube && cube.instanceId !== undefined) return cellAt(this.solidPlaces[cube.instanceId]);
    for (const hit of this.raycaster.intersectObject(this.dots, false)) {
      const cell = cellAt(hit.index);
      if (!this.fading || inside(this.focusBox, cell)) return cell;
    }
    return null;
  }

  /**
   * Keeps the box centred in the part of the window the panel leaves free.
   * @param {{right?: number, bottom?: number}} inset - the panel's width at the right, or its
   *   height at the foot, in CSS pixels
   */
  setInset({ right = 0, bottom = 0 } = {}) {
    this.inset = { right, bottom };
    this.resize();
  }

  /** Fits the camera to the canvas's size. */
  resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    const { right, bottom } = this.inset;
    this.camera.setViewOffset(width, height, right / 2, bottom / 2, width, height);
    // The views stand far enough back that the box fits the free part of a narrow window, or of
    // one that is taller than it is wide
    const freeWidth = (width - right) / height;
    const freeHeight = (height - bottom) / height;
    this.fitScale = Math.max(1, 1 / Math.max(0.3, Math.min(freeWidth, freeHeight)));
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  /** Draws, if anything changed since the last draw. @returns {boolean} whether it drew */
  render() {
    if (!this.dirty) return false;
    this.dirty = false;
    this.renderer.render(this.scene, this.camera);
    return true;
  }

  dispose() {
    this.controls.removeEventListener('change', this.onChange);
    this.controls.dispose();
    this.scene.traverse((object) => {
      if (object === this.solid || object === this.faded) object.dispose();
      object.geometry?.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) material?.dispose();
    });
    this.cubeGeometry.dispose();
  }

  // ---- Parts ----

  instanced(material) {
    const mesh = new THREE.InstancedMesh(this.cubeGeometry, material, PLACES);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.setColorAt(0, new THREE.Color()); // makes the colour buffer before the first draw
    this.group.add(mesh);
    return mesh;
  }

  edges(geometry, colour, opacity) {
    const lines = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: colour, transparent: opacity < 1, opacity }),
    );
    this.group.add(lines);
    return lines;
  }
}

function inside(box, [x, y, z]) {
  return indexOf(x, y, z) >= 0 && x >= box.min[0] && x <= box.max[0] && y >= box.min[1] && y <= box.max[1]
    && z >= box.min[2] && z <= box.max[2];
}
