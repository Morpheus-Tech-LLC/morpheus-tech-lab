// state.js
import { rule30Shape } from './shapeGenerators.js';
import { initialSetup } from './explore/setup.js';

// Mutable state
export const state = {
  sim_size: 50,
  sim_generations: 100,
  viewMode: null,
  sliceAxis: null,
  sliceIndex: null,
  currentGen: 0,
  isPlaying: false,
  isReversing: false,
  // Rule 30 and the sandpile wrap at the grid's edges; nothing turns it off since the old
  // Game of Life 3D mode, whose setting it was, retired (#116). compare.js checks both ways.
  gridWrapping: true,
  showWireframeGrid: false,
  showCellWireframe: false,
  showHUD: true, // HUD displays are visible by default
  cellSize: 1.2, // Size of cells (points and wireframe cubes)
  scene: null,
  renderer: null,
  camera: null,
  controls: null,
  autoRotateActive: false,
  userHasInteracted: false,
  autoRotateStartTime: null,
  autoRotateInitialPosition: null,
  autoRotateInitialRadius: null,
  autoRotateInitialAngle: null,
  simulationData: null,
  simulationModel: null,
  clockData: null,
  controlsInitialized: false,
  shapeKey: "rule30", // Rule 30's seed (state.shapes); the other precomputed modes have none
  simulationMode: "explore", // the lab opens in Explore (src/explore/)
  useRule30: false,
  useRule30_2D: false,
  useSineWave: false,
  useSandpile: false,
  flipOrientation: false,
  // Compute Rule 30 on the GPU when it's available (src/gpu/). The control bar's toggle sets
  // this, and remembers it per browser.
  gpuCompute: true,
  // Explore (src/explore/): its settings, as one value (src/explore/setup.js): the seed, the
  // rules, the arena and the memory limit, which the HUD's boxes show and change. Set below,
  // from the cube's shape settings.
  explore: null,
  sandpileParams: {
    initialSand: 0, // Optional initial sand at center (0 = start empty, 1 grain added per generation)
    threshold: 4, // Threshold for toppling (fixed at 4, not user-adjustable)
  },
  // Store per-mode values for size and generations
  modeValues: {
    sineWave: { size: 50, generations: 100 },
    rule30: { size: null, generations: 100 }, // size is auto-calculated
    sandpile: { size: 50, generations: 1000 },
    monteCarlo: { size: 50, generations: 100 }
  },
  shapes: {
    rule30: rule30Shape()
  },
  // Game of Life 3D's shape settings (src/explore/): the last size, density and region used for
  // each shape, which the Seed popover starts from
  shapeParams: {
    perlin: { size: 10, density: 0.3, regionSize: 25 },
    cube: { size: 10, density: 1 },
    tetrahedron: { size: 13, density: 1 },
    octahedron: { size: 8, density: 1 },
    worley: { size: 8, density: 0.3, regionSize: 25 }
  },
  get shapeFn() {
    return this.shapes[this.shapeKey];
  },
  reset() {
    this.viewMode = null;
    this.sliceAxis = null;
    this.sliceIndex = null;
    this.currentGen = 0;
    this.isPlaying = false;
    this.isReversing = false;
    this.clockData = null;
    // Don't reset this - set up
    // this.scene = null;
    // this.renderer = null;
    // this.camera = null;
    this.simulationData = null;
    this.simulationModel = null;
    // this.shapeKey = "cube";
    // Don't reset useRule30 - it persists until explicitly changed
  }
};

// Game of Life 3D opens on the cube in the shape settings above, under the default rules
state.explore = initialSetup(state.shapeParams.cube);
