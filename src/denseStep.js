// SPDX-License-Identifier: Apache-2.0
//
// The dense Game of Life 3D step, convolve3D(), for the existing modes. It reads no `state`: the
// lab's wrapper in matrixFunctions.js passes the settings in, and Node (the tests, the bench) can
// call it directly.

import { Grid3D } from './grid3D.js';

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

/**
 * One Game of Life 3D generation on a dense grid: the CPU reference for the GPU's shader, quirks
 * included (a dead cell with no live neighbour is never born; with wrapping off, neighbours clamp
 * to the grid, and the wall cells follow the boundary rules).
 * @param {Grid3D} grid
 * @param {object} [settings]
 * @param {boolean} [settings.wrapping] - wrap at the walls (default) or clamp
 * @param {{birth?: number[], survival?: number[]}} [settings.rules] - the interior rules; an
 *   empty or missing survival list means 5-15, and a missing birth list 9-10
 * @param {object} [settings.boundaryRules] - {corner, edgeTwoFaces, face}, each {birth, survival}:
 *   the rules on the walls, when wrapping is off
 * @returns {Grid3D} the next generation
 */
export function convolve3D(grid, { wrapping = true, rules = null, boundaryRules = {} } = {}) {
  const size = grid.size;
  const newGrid = new Grid3D(size, 0);

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
  const birthSet = new Set(rules?.birth ?? [9, 10]);
  const survivalSet = new Set(rules?.survival ?? []);

  // Prepare boundary rule sets
  boundaryRules = boundaryRules ?? {};
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
