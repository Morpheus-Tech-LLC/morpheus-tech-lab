// state.js
import { perlinShape, cubeShape, tetrahedronShape, octahedronShape, worleyShape, rule30Shape } from './shapeGenerators.js';

/**
 * Calculate isolation and overcrowding rules from survival values
 * @param {number[]} survival - Array of survival neighbor counts
 * @param {number} maxNeighbors - Maximum number of neighbors (26 for interior, 7 for corner, 11 for edge, 17 for face)
 * @returns {Object} Object with isolation and overcrowding arrays
 */
function calculateDeathRules(survival, maxNeighbors) {
  if (!survival || survival.length === 0) {
    return {
      isolation: [],
      overcrowding: []
    };
  }
  
  const minSurvival = Math.min(...survival);
  const maxSurvival = Math.max(...survival);
  
  // Isolation: all values from 0 to (minSurvival - 1)
  const isolation = [];
  for (let i = 0; i < minSurvival; i++) {
    isolation.push(i);
  }
  
  // Overcrowding: all values from (maxSurvival + 1) to maxNeighbors
  const overcrowding = [];
  for (let i = maxSurvival + 1; i <= maxNeighbors; i++) {
    overcrowding.push(i);
  }
  
  return { isolation, overcrowding };
}

// Calculate initial rules from survival values
const initialSurvival = Array.from({ length: 11 }, (_, i) => i + 5); // 5-15
const initialDeathRules = calculateDeathRules(initialSurvival, 26);

const initialCornerSurvival = [2, 3, 4];
const cornerDeathRules = calculateDeathRules(initialCornerSurvival, 7);

const initialEdgeSurvival = [2, 3, 4, 5, 6];
const edgeDeathRules = calculateDeathRules(initialEdgeSurvival, 11);

const initialFaceSurvival = [3, 4, 5, 6, 7, 8, 9];
const faceDeathRules = calculateDeathRules(initialFaceSurvival, 17);

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
  shapeKey: "cube",
  simulationMode: "gameOfLife",
  useRule30: false,
  useRule30_2D: false,
  useSineWave: false,
  useSandpile: false,
  flipOrientation: false,
  // Compute Game of Life 3D and Rule 30 on the GPU when it's available (src/gpu/). The
  // control bar's toggle sets this, and remembers it per browser.
  gpuCompute: true,
  sandpileParams: {
    initialSand: 0, // Optional initial sand at center (0 = start empty, 1 grain added per generation)
    threshold: 4, // Threshold for toppling (fixed at 4, not user-adjustable)
  },
  // Store per-mode values for size and generations
  modeValues: {
    gameOfLife: { size: 50, generations: 100 },
    sineWave: { size: 50, generations: 100 },
    rule30: { size: null, generations: 100 }, // size is auto-calculated
    sandpile: { size: 50, generations: 1000 },
    monteCarlo: { size: 50, generations: 100 }
  },
  shapes: {
    perlin: perlinShape(10, 0.3, 30),
    cube: cubeShape(5, 1),
    tetrahedron: tetrahedronShape(13),
    octahedron: octahedronShape(8, 1),
    worley: worleyShape(8, 0.5, 20),
    rule30: rule30Shape()
  },
  // Simulation rules (neighbor counts)
  // Isolation and overcrowding are automatically calculated from survival
  rules: {
    birth: [9, 10],
    survival: initialSurvival, // 5-15
    isolation: initialDeathRules.isolation, // 0-4 (calculated from survival)
    overcrowding: initialDeathRules.overcrowding, // 16-26 (calculated from survival)
  },
  // Boundary rules for cells with fewer neighbors (proportional to interior rules)
  // Only applied when grid wrapping is OFF
  // Isolation and overcrowding are automatically calculated from survival
  boundaryRules: {
    // Corner cells: 7 neighbors (7/26 ≈ 0.269 of interior)
    // All 3 coordinates are on boundary (0 or size-1)
    corner: {
      birth: [2, 3],
      survival: initialCornerSurvival,
      isolation: cornerDeathRules.isolation, // Calculated from survival
      overcrowding: cornerDeathRules.overcrowding, // Calculated from survival
    },
    // Edge cells (two faces): 11 neighbors (11/26 ≈ 0.423 of interior)
    // Exactly 2 coordinates are on boundary
    edgeTwoFaces: {
      birth: [4],
      survival: initialEdgeSurvival,
      isolation: edgeDeathRules.isolation, // Calculated from survival
      overcrowding: edgeDeathRules.overcrowding, // Calculated from survival
    },
    // Face cells (one face): 17 neighbors (17/26 ≈ 0.654 of interior)
    // Exactly 1 coordinate is on boundary
    face: {
      birth: [6],
      survival: initialFaceSurvival,
      isolation: faceDeathRules.isolation, // Calculated from survival
      overcrowding: faceDeathRules.overcrowding, // Calculated from survival
    },
  },
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