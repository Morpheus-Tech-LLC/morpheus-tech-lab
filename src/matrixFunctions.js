import { Grid3D } from './grid3D.js';
import { generateClockHistory } from './time.js';
import { state } from './state.js';
import { getGpuDevice } from './gpu/device.js';
import { evolveOnGpu, gpuModeOf, isPlainGrid } from './gpu/engine.js';

// ---------------------------
// Matrix evolution
// ---------------------------

export async function generateSimulation(size, generations, shapeFn, useRule30 = false, useRule30_2D = false, useSineWave = false, useSandpile = false, sandpileParams = null) {
  console.log(`generateSimulation: size=${size}, generations=${generations}, useRule30=${useRule30}, useRule30_2D=${useRule30_2D}, useSineWave=${useSineWave}, useSandpile=${useSandpile}`);
  const history = [];
  
  if (useSineWave) {
    // Generate sine wave simulation
    for (let gen = 0; gen <= generations; gen++) {
      const grid = generateSineWaveGrid(size, gen, generations);
      history.push(grid);
      console.log(`Sine Wave Generation ${gen}: ${grid.active.length} active cells`);
    }
  } else if (useSandpile) {
    // Generate sandpile simulation
    // Threshold is fixed at 4 (not user-adjustable)
    const params = sandpileParams ? { ...sandpileParams, threshold: 4 } : { initialSand: 0, threshold: 4 };
    // Start with empty grid (or minimal initial sand)
    let grid = initSandpile(size, params);
    
    console.log(`Initial sandpile: ${countActiveSandpileCells(grid)} active cells`);
    history.push(grid);
    
    const center = Math.floor(size / 2);
    
    for (let i = 0; i < generations; i++) {
      const generationNumber = i + 1; // Track generation number (1-indexed)
      
      // Add 1 grain of sand at the center each generation
      const currentSand = grid.get(center, center, 0);
      grid.data[grid._idx(center, center, 0)] = Math.min(255, currentSand + 1);
      
      // Update active array after adding sand
      updateSandpileActive(grid);
      
      // Save state right after adding grain (before toppling) so we can see height 4
      // Create a deep copy of the grid to save
      const gridAfterDrop = new Grid3D(size, 0);
      gridAfterDrop.data.set(grid.data);
      updateSandpileActive(gridAfterDrop);
      gridAfterDrop.generation = generationNumber; // Store generation number
      history.push(gridAfterDrop);
      
      // Topple until stable
      // Strategy: Allow cells to reach threshold, save that state once per generation, then topple them
      let toppled = true;
      let iterations = 0;
      // Increase max iterations for lower thresholds (they need more toppling iterations)
      const maxIterations = size * size * 20; // Safety limit (increased for threshold 3)
      let savedThresholdState = false; // Track if we've saved a threshold state this generation
      
      while (toppled && iterations < maxIterations) {
        // Check if any cells are at threshold - these should be visible before toppling
        let hasThreshold = false;
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            if (grid.get(x, y, 0) === params.threshold) {
              hasThreshold = true;
              break;
            }
          }
          if (hasThreshold) break;
        }
        
        // Save state ONCE per generation if we have cells at threshold (before they topple)
        // Only save if we haven't already saved a threshold state in this generation
        if (hasThreshold && !savedThresholdState) {
          const gridAtThreshold = new Grid3D(size, 0);
          gridAtThreshold.data.set(grid.data);
          updateSandpileActive(gridAtThreshold);
          gridAtThreshold.generation = generationNumber; // Store generation number
          history.push(gridAtThreshold);
          savedThresholdState = true; // Mark that we've saved this state for this generation
        }
        
        // Topple cells that are at or above threshold
        const newGrid = evolveSandpileWithThreshold(grid, params.threshold);
        
        // Check if any toppling occurred
        toppled = false;
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            if (newGrid.get(x, y, 0) !== grid.get(x, y, 0)) {
              toppled = true;
              break;
            }
          }
          if (toppled) break;
        }
        
        grid = newGrid;
        iterations++;
      }
      
      if (iterations >= maxIterations) {
        console.warn(`Sandpile generation ${i + 1} hit max iterations limit`);
      }
      
      // Save final stable state after toppling
      grid.generation = generationNumber; // Store generation number
      history.push(grid);
      const activeCount = countActiveSandpileCells(grid);
      console.log(`Sandpile Generation ${generationNumber}: ${activeCount} active cells, center sand: ${grid.get(center, center, 0)}`);
    }
  } else {
    let grid = initMatrix(size, shapeFn);
    
    console.log(`Initial grid active cells: ${grid.active.length}`);
    history.push(grid);

    // Compute on the GPU where it can. It gives the same grids as the CPU, so if it stops
    // part way (the device is lost, say), the CPU loop below carries on from its last grid.
    const gpuMode = state.gpuCompute ? gpuModeOf({ useRule30, useRule30_2D, useSineWave, useSandpile }) : null;
    if (gpuMode && generations > 0) {
      const device = await getGpuDevice();
      if (device && isPlainGrid(grid)) {
        const started = performance.now();
        try {
          const run = {
            mode: gpuMode,
            seed: grid,
            generations,
            wrapping: state.gridWrapping ?? true,
            rules: state.rules,
            boundaryRules: state.boundaryRules,
          };
          for await (const next of evolveOnGpu(device, run)) {
            history.push(next);
          }
        } catch (err) {
          console.warn(`GPU compute stopped after ${history.length - 1} generations; continuing on the CPU.`, err);
        }
        console.log(`GPU: ${history.length - 1} of ${generations} generations in ${Math.round(performance.now() - started)} ms`);
        grid = history[history.length - 1];
      }
    }

    for (let i = history.length - 1; i < generations; i++) {
      if (useRule30_2D) {
        grid = evolveRule30_2D(grid);
      } else if (useRule30) {
        grid = evolveRule30(grid);
      } else {
        grid = convolve3D(grid);
      }
      history.push(grid);
      console.log(`Generation ${i + 1}: ${grid.active.length} active cells`);
    }
  }

  const timeHistory = await generateClockHistory(128, generations);
  console.log("Generated frames:", timeHistory.length);

  console.log(history)
  console.log(timeHistory)

  return [history, timeHistory];
}

// ---------------------------
// Initialize starting matrix
// ---------------------------

/**
 * Initialize a 3D simulation grid.
 * @param {number} size - Size of the grid (NxNxN)
 * @param {function(Grid3D, number):void} shapeFn - Function that sets alive cells in the grid
 */
export function initMatrix(size, shapeFn) {
  const grid = new Grid3D(size, 0);

  if (typeof shapeFn === 'function') {
    shapeFn(grid, size);
  }

  return grid;
}

// ---------------------------
// Game of Life logic
// ---------------------------

/**
 * Determine the boundary type of a cell when wrapping is off
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @param {number} size - Grid size
 * @returns {string|null} - Boundary type: 'corner', 'edgeTwoFaces', 'edgeOneFace', 'face', or null for interior
 */
function getBoundaryType(x, y, z, size) {
  const onBoundary = (coord) => coord === 0 || coord === size - 1;
  const xBound = onBoundary(x);
  const yBound = onBoundary(y);
  const zBound = onBoundary(z);
  
  const boundaryCount = (xBound ? 1 : 0) + (yBound ? 1 : 0) + (zBound ? 1 : 0);
  
  if (boundaryCount === 0) return null; // Interior
  if (boundaryCount === 3) return 'corner'; // Corner (all 3 on boundary)
  if (boundaryCount === 2) return 'edgeTwoFaces'; // Edge (2 faces on boundary)
  if (boundaryCount === 1) return 'face'; // Face (1 face on boundary)
  return null;
}

export function convolve3D(grid) {
  const size = grid.size;
  const newGrid = new Grid3D(size, 0);
  const wrapping = state.gridWrapping ?? true;

  // Helper function to get neighbor coordinates (wrap or clamp)
  const getNeighborCoord = (coord, delta) => {
    const newCoord = coord + delta;
    if (wrapping) {
      return grid._wrap(newCoord);
    } else {
      // Clamp to bounds when wrapping is off
      return Math.max(0, Math.min(size - 1, newCoord));
    }
  };

  // Use a map to avoid duplicate neighbor checks
  const candidates = new Map();

  // Collect candidates: alive cells + neighbors
  for (const [x, y, z] of grid.active) {
    const key = `${x},${y},${z}`;
    candidates.set(key, [x, y, z]);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const nx = getNeighborCoord(x, dx);
          const ny = getNeighborCoord(y, dy);
          const nz = getNeighborCoord(z, dz);
          candidates.set(`${nx},${ny},${nz}`, [nx, ny, nz]);
        }
      }
    }
  }

  // Prepare rule sets for quick lookup (interior rules)
  const birthSet = new Set(state.rules?.birth ?? [9, 10]);
  const survivalSet = new Set(state.rules?.survival ?? []);

  // Prepare boundary rule sets
  const boundaryRules = state.boundaryRules ?? {};
  const boundaryRuleSets = {};
  if (boundaryRules.corner) {
    boundaryRuleSets.corner = {
      birth: new Set(boundaryRules.corner.birth),
      survival: new Set(boundaryRules.corner.survival),
    };
  }
  if (boundaryRules.edgeTwoFaces) {
    boundaryRuleSets.edgeTwoFaces = {
      birth: new Set(boundaryRules.edgeTwoFaces.birth),
      survival: new Set(boundaryRules.edgeTwoFaces.survival),
    };
  }
  if (boundaryRules.face) {
    boundaryRuleSets.face = {
      birth: new Set(boundaryRules.face.birth),
      survival: new Set(boundaryRules.face.survival),
    };
  }

  // Apply rules only on candidates
  for (const [x, y, z] of candidates.values()) {
    let neighbors = 0;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (dx === 0 && dy === 0 && dz === 0) continue;
          const nx = getNeighborCoord(x, dx);
          const ny = getNeighborCoord(y, dy);
          const nz = getNeighborCoord(z, dz);
          neighbors += grid.get(nx, ny, nz);
        }
      }
    }

    const alive = grid.get(x, y, z) === 1;
    let newVal;
    
    // Determine which rules to use
    let useBoundaryRules = false;
    let boundaryType = null;
    if (!wrapping) {
      boundaryType = getBoundaryType(x, y, z, size);
      useBoundaryRules = boundaryType !== null && boundaryRuleSets[boundaryType];
    }
    
    if (useBoundaryRules) {
      // Use boundary rules
      const ruleSet = boundaryRuleSets[boundaryType];
      if (alive) {
        newVal = ruleSet.survival.has(neighbors) ? 1 : 0;
      } else {
        newVal = ruleSet.birth.has(neighbors) ? 1 : 0;
      }
    } else {
      // Use interior rules
      if (alive) {
        newVal = survivalSet.size > 0 ? (survivalSet.has(neighbors) ? 1 : 0) : (neighbors >= 5 && neighbors <= 15 ? 1 : 0);
      } else {
        newVal = birthSet.has(neighbors) ? 1 : 0;
      }
    }

    if (newVal === 1) {
      newGrid.set(x, y, z, 1);
    }
  }

  return newGrid;
}

// ---------------------------
// Rule 30 evolution (1D CA in 3D space)
// ---------------------------

/**
 * Rule 30: A 1D cellular automaton that evolves downward in 3D space.
 * Each layer (y-level) is computed from the layer above it using Rule 30.
 * Rule 30 pattern: 111→0, 110→0, 101→0, 100→1, 011→1, 010→1, 001→1, 000→0
 */
export function evolveRule30(grid) {
  const size = grid.size;
  const newGrid = new Grid3D(size, 0);
  const wrapping = state.gridWrapping ?? true;

  // Rule 30 lookup table
  const rule30 = {
    '111': 0,
    '110': 0,
    '101': 0,
    '100': 1,
    '011': 1,
    '010': 1,
    '001': 1,
    '000': 0
  };

  // Find the bottommost layer that has any cells using the active array
  let bottomLayer = -1;
  for (const [x, y, z] of grid.active) {
    bottomLayer = Math.max(bottomLayer, y);
  }

  // Debug: log initial state
  console.log(`Rule 30 evolve: grid.active.length=${grid.active.length}, bottomLayer=${bottomLayer}`);

  // If no cells found, return empty grid
  if (bottomLayer === -1) {
    console.log('Rule 30: No cells found in grid');
    return newGrid;
  }

  // Copy all existing cells to the new grid
  for (const [x, y, z] of grid.active) {
    newGrid.set(x, y, z, 1);
  }

  // If we've reached the bottom of the space, can't evolve further
  if (bottomLayer >= size - 1) {
    console.log(`Rule 30: Reached bottom of space at y=${bottomLayer}`);
    return newGrid;
  }

  // Evolve one new layer below the bottommost layer
  const newLayerY = bottomLayer + 1;
  const sourceLayerY = bottomLayer; // Evolve from the bottommost layer

  // Helper to get neighbor value with wrapping
  const getNeighbor = (x, y, z, dx) => {
    const nx = x + dx;
    if (wrapping) {
      return grid.get(grid._wrap(nx), y, z);
    } else {
      const clampedX = Math.max(0, Math.min(size - 1, nx));
      return grid.get(clampedX, y, z);
    }
  };

  // For each z slice, evolve the new layer based on the source layer
  let newCellsCount = 0;
  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      // Get the three neighbors from the source layer (left, center, right)
      const left = getNeighbor(x, sourceLayerY, z, -1);
      const center = grid.get(x, sourceLayerY, z);
      const right = getNeighbor(x, sourceLayerY, z, 1);
      
      // Create pattern string - ensure values are 0 or 1
      const pattern = `${left}${center}${right}`;
      
      // Apply Rule 30
      const newValue = rule30[pattern] !== undefined ? rule30[pattern] : 0;
      
      // Set the cell in the new layer below
      if (newValue === 1) {
        newGrid.set(x, newLayerY, z, 1);
        newCellsCount++;
      }
    }
  }
  
  // Debug: log some info about the evolution
  console.log(`Rule 30: Evolved from ${grid.active.length} to ${newGrid.active.length} cells, bottomLayer: ${bottomLayer}, newLayerY: ${newLayerY}, newCellsCount: ${newCellsCount}`);

  return newGrid;
}

// ---------------------------
// Rule 30 2D evolution (2D CA in 3D space)
// ---------------------------

/**
 * Rule 30 2D: A 2D cellular automaton that evolves downward in 3D space.
 * Each layer (y-level) is computed from the layer above it using Rule 30 adapted for 2D.
 * Uses the full 3x3 neighborhood (9 cells, including the center) from the previous generation.
 * The classic 1D Rule 30 behaviour is preserved when activity is confined to a single row.
 */
export function evolveRule30_2D(grid) {
  const size = grid.size;
  const newGrid = new Grid3D(size, 0);
  const wrapping = state.gridWrapping ?? true;

  // Rule 30 lookup table (same as 1D version)
  const rule30 = {
    '111': 0,
    '110': 0,
    '101': 0,
    '100': 1,
    '011': 1,
    '010': 1,
    '001': 1,
    '000': 0
  };

  // Find the bottommost layer that has any cells using the active array
  let bottomLayer = -1;
  for (const [x, y, z] of grid.active) {
    bottomLayer = Math.max(bottomLayer, y);
  }

  // Debug: log initial state
  console.log(`Rule 30 2D evolve: grid.active.length=${grid.active.length}, bottomLayer=${bottomLayer}`);

  // If no cells found, return empty grid
  if (bottomLayer === -1) {
    console.log('Rule 30 2D: No cells found in grid');
    return newGrid;
  }

  // Copy all existing cells to the new grid
  for (const [x, y, z] of grid.active) {
    newGrid.set(x, y, z, 1);
  }

  // If we've reached the bottom of the space, can't evolve further
  if (bottomLayer >= size - 1) {
    console.log(`Rule 30 2D: Reached bottom of space at y=${bottomLayer}`);
    return newGrid;
  }

  // Evolve one new layer below the bottommost layer
  const newLayerY = bottomLayer + 1;
  const sourceLayerY = bottomLayer; // Evolve from the bottommost layer

  // Helper to get neighbor value with wrapping
  const getNeighbor = (x, y, z, dx, dz) => {
    const nx = x + dx;
    const nz = z + dz;
    if (wrapping) {
      return grid.get(grid._wrap(nx), y, grid._wrap(nz));
    } else {
      const clampedX = Math.max(0, Math.min(size - 1, nx));
      const clampedZ = Math.max(0, Math.min(size - 1, nz));
      return grid.get(clampedX, y, clampedZ);
    }
  };

  // For each cell in the new layer, evolve based on the full 3x3 neighborhood from source layer
  for (let z = 0; z < size; z++) {
    for (let x = 0; x < size; x++) {
      const topLeft = getNeighbor(x, sourceLayerY, z, -1, -1);
      const top = getNeighbor(x, sourceLayerY, z, 0, -1);
      const topRight = getNeighbor(x, sourceLayerY, z, 1, -1);
      const left = getNeighbor(x, sourceLayerY, z, -1, 0);
      const center = grid.get(x, sourceLayerY, z);
      const right = getNeighbor(x, sourceLayerY, z, 1, 0);
      const bottomLeft = getNeighbor(x, sourceLayerY, z, -1, 1);
      const bottom = getNeighbor(x, sourceLayerY, z, 0, 1);
      const bottomRight = getNeighbor(x, sourceLayerY, z, 1, 1);

      // Evaluate Rule 30 along each row of the 3x3 neighborhood
      const topPattern = `${topLeft}${top}${topRight}`;
      const midPattern = `${left}${center}${right}`;
      const bottomPattern = `${bottomLeft}${bottom}${bottomRight}`;

      const topResult = rule30[topPattern] ?? 0;
      const midResult = rule30[midPattern] ?? 0;
      const bottomResult = rule30[bottomPattern] ?? 0;

      // Combine row results: preserve classic Rule 30 when only the middle row is active,
      // but allow the other neighbors to toggle the outcome based on their own Rule 30 evaluations.
      const parity = (topResult + bottomResult) % 2;
      const newValue = parity === 0 ? midResult : (midResult ^ 1);

      // Set the cell in the new layer below
      if (newValue === 1) {
        newGrid.set(x, newLayerY, z, 1);
      }
    }
  }
  
  // Debug: log some info about the evolution
  console.log(`Rule 30 2D: Evolved from ${grid.active.length} to ${newGrid.active.length} cells, bottomLayer: ${bottomLayer}, newLayerY: ${newLayerY}`);

  return newGrid;
}

// ---------------------------
// Sine Wave generation
// ---------------------------

/**
 * Generate a sine wave grid for a specific generation/time step.
 * Maps sin(x) to y coordinates, with the wave animating over time.
 * @param {number} size - Size of the grid (NxNxN)
 * @param {number} generation - Current generation (0 to generations)
 * @param {number} totalGenerations - Total number of generations
 * @returns {Grid3D} - Grid with sine wave pattern
 */
export function generateSineWaveGrid(size, generation, totalGenerations) {
  const grid = new Grid3D(size, 0);
  
  // Parameters for the sine wave
  const frequency = 2 * Math.PI / size; // Number of cycles across the grid
  const amplitude = (size - 1) / 2; // Half the grid size (for scaling)
  const center = (size - 1) / 2; // Center of the grid
  
  // Phase shift over time - makes the wave move/animate
  const phaseShift = (generation / totalGenerations) * 2 * Math.PI;
  
  // For each x position, calculate the y position from sin(x)
  for (let x = 0; x < size; x++) {
    // Calculate sin value at this x position with phase shift
    const sinValue = Math.sin(frequency * x + phaseShift);
    
    // Map sin value (-1 to 1) to y coordinate (0 to size-1)
    // sinValue ranges from -1 to 1
    // We want y to range from 0 to size-1
    const y = Math.round(center + sinValue * amplitude);
    
    // Clamp y to valid range
    const clampedY = Math.max(0, Math.min(size - 1, y));
    
    // Set cells along the z-axis to create a 3D wave surface
    // This creates a wave that extends in the z direction
    for (let z = 0; z < size; z++) {
      grid.set(x, clampedY, z, 1);
    }
  }
  
  return grid;
}

// ---------------------------
// Abelian Sandpile Model (2D simulation, 3D visualization)
// ---------------------------

/**
 * Initialize a 2D sandpile grid by placing initial sand at the center.
 * Sand is stored at z=0, and will be visualized in 3D using Z-axis as height.
 * @param {number} size - Size of the grid (NxNxN, but only uses 2D plane at z=0)
 * @param {Object} params - Sandpile parameters
 * @param {number} params.initialSand - Total amount of sand to place initially
 * @param {number} params.threshold - Threshold for toppling (typically 4 for 2D)
 * @returns {Grid3D} - Grid with initial sand distribution (stored at z=0)
 */
export function initSandpile(size, params) {
  const grid = new Grid3D(size, 0);
  const { initialSand } = params;
  
  // Place initial sand at the center (if any)
  const center = Math.floor(size / 2);
  const initialAmount = Math.min(255, Math.max(0, initialSand || 0));
  if (initialAmount > 0) {
    grid.data[grid._idx(center, center, 0)] = initialAmount;
  }
  
  // Update active array for visualization (cells with sand > 0, visualized at height = sand amount)
  updateSandpileActive(grid);
  
  return grid;
}

/**
 * Evolve the 2D sandpile by toppling cells that exceed the threshold (but not at threshold).
 * Uses 4 neighbors in 2D (up, down, left, right).
 * This allows cells at exactly threshold (height 4) to remain visible before toppling.
 * @param {Grid3D} grid - Current sandpile grid (sand stored at z=0)
 * @param {Object} params - Sandpile parameters
 * @param {number} params.threshold - Threshold for toppling (typically 4 for 2D)
 * @returns {Grid3D} - New grid after one evolution step
 */
export function evolveSandpile(grid, params) {
  const size = grid.size;
  const { threshold } = params;
  const newGrid = new Grid3D(size, 0);
  
  // Copy current sand amounts (only from z=0 plane)
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const sand = grid.get(x, y, 0);
      newGrid.data[newGrid._idx(x, y, 0)] = sand;
    }
  }
  
  // Find all cells that need to topple (only check z=0 plane)
  // Only topple cells that EXCEED threshold (not equal to), so height 4 stays visible
  const toppleQueue = [];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const sand = newGrid.get(x, y, 0);
      if (sand > threshold) {
        toppleQueue.push([x, y]);
      }
    }
  }
  
  // Process toppling
  const wrapping = state.gridWrapping ?? true;
  
  // Helper to get neighbor coordinates in 2D
  const getNeighborCoord = (coord, delta) => {
    const newCoord = coord + delta;
    if (wrapping) {
      return grid._wrap(newCoord);
    } else {
      return Math.max(0, Math.min(size - 1, newCoord));
    }
  };
  
  // 2D neighbors: up, down, left, right (4 neighbors)
  const neighborOffsets = [
    [0, -1],  // up (decrease y)
    [0, 1],   // down (increase y)
    [-1, 0],  // left (decrease x)
    [1, 0]    // right (increase x)
  ];
  
  // Topple all cells in the queue
  for (const [x, y] of toppleQueue) {
    const sand = newGrid.get(x, y, 0);
    if (sand < threshold) continue; // Already toppled by a previous cell (shouldn't happen, but safety check)
    
    // Calculate how many times this cell topples (could be multiple if sand >> threshold)
    const topples = Math.floor(sand / threshold);
    const remainder = sand % threshold;
    
    // Set remainder
    newGrid.data[newGrid._idx(x, y, 0)] = remainder;
    
    // Distribute sand to 2D neighbors (1 grain per neighbor per topple)
    for (const [dx, dy] of neighborOffsets) {
      const nx = getNeighborCoord(x, dx);
      const ny = getNeighborCoord(y, dy);
      
      const idx = newGrid._idx(nx, ny, 0);
      const newSand = Math.min(255, newGrid.data[idx] + topples);
      newGrid.data[idx] = newSand;
    }
  }
  
  // Update active array for visualization
  updateSandpileActive(newGrid);
  
  return newGrid;
}

/**
 * Evolve the 2D sandpile by toppling cells that are at or above the threshold.
 * Uses 4 neighbors in 2D (up, down, left, right).
 * @param {Grid3D} grid - Current sandpile grid (sand stored at z=0)
 * @param {number} threshold - Threshold for toppling (cells >= threshold will topple)
 * @returns {Grid3D} - New grid after one evolution step
 */
function evolveSandpileWithThreshold(grid, threshold) {
  const size = grid.size;
  const newGrid = new Grid3D(size, 0);
  
  // Copy current sand amounts (only from z=0 plane)
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const sand = grid.get(x, y, 0);
      newGrid.data[newGrid._idx(x, y, 0)] = sand;
    }
  }
  
  // Find all cells that need to topple (only check z=0 plane)
  // Topple cells that are at or above threshold
  const toppleQueue = [];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const sand = newGrid.get(x, y, 0);
      if (sand >= threshold) {
        toppleQueue.push([x, y]);
      }
    }
  }
  
  // Process toppling
  const wrapping = state.gridWrapping ?? true;
  
  // Helper to get neighbor coordinates in 2D
  const getNeighborCoord = (coord, delta) => {
    const newCoord = coord + delta;
    if (wrapping) {
      return grid._wrap(newCoord);
    } else {
      return Math.max(0, Math.min(size - 1, newCoord));
    }
  };
  
  // 2D neighbors: up, down, left, right (4 neighbors)
  const neighborOffsets = [
    [0, -1],  // up (decrease y)
    [0, 1],   // down (increase y)
    [-1, 0],  // left (decrease x)
    [1, 0]    // right (increase x)
  ];
  
  // Topple all cells in the queue
  for (const [x, y] of toppleQueue) {
    const sand = newGrid.get(x, y, 0);
    if (sand < threshold) continue; // Already toppled by a previous cell
    
    // Calculate how many times this cell topples (could be multiple if sand >> threshold)
    const topples = Math.floor(sand / threshold);
    const remainder = sand % threshold;
    
    // Set remainder
    newGrid.data[newGrid._idx(x, y, 0)] = remainder;
    
    // Distribute sand to 2D neighbors (1 grain per neighbor per topple)
    for (const [dx, dy] of neighborOffsets) {
      const nx = getNeighborCoord(x, dx);
      const ny = getNeighborCoord(y, dy);
      
      const idx = newGrid._idx(nx, ny, 0);
      const newSand = Math.min(255, newGrid.data[idx] + topples);
      newGrid.data[idx] = newSand;
    }
  }
  
  // Update active array for visualization
  updateSandpileActive(newGrid);
  
  return newGrid;
}

/**
 * Update the active array for sandpile visualization.
 * For 2D sandpile: create one point per grain of sand, stacked vertically.
 * If a cell has 3 grains, we create 3 points at heights 0, 1, 2 (stacked).
 * @param {Grid3D} grid - Grid to update
 */
function updateSandpileActive(grid) {
  grid.active = [];
  const size = grid.size;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const sand = grid.get(x, y, 0);
      // Create one point for each grain of sand, stacked vertically
      // Each grain is at a different Z height (0, 1, 2, 3, ...)
      for (let grain = 0; grain < sand; grain++) {
        // Store [x, y, grainHeight] where grainHeight is the vertical position of this grain
        grid.active.push([x, y, grain]);
      }
    }
  }
}

/**
 * Count active cells in a sandpile grid (cells with sand > 0).
 * @param {Grid3D} grid - Grid to count
 * @returns {number} - Number of active cells
 */
function countActiveSandpileCells(grid) {
  return grid.active.length;
}