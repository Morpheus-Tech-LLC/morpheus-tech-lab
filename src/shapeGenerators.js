// Simple 3D Perlin Noise implementation
class PerlinNoise3D {
  constructor(seed = 0) {
    this.seed = seed;
    // Permutation table for gradient selection
    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(Math.random() * 256);
    }
    // Duplicate permutation table to avoid wrapping
    for (let i = 0; i < 256; i++) {
      this.p[256 + i] = this.p[i];
    }
  }

  // Fade function for smooth interpolation
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  // Linear interpolation
  lerp(a, b, t) {
    return a + t * (b - a);
  }

  // Gradient function - returns a value from -1 to 1
  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  // 3D Perlin noise function
  noise(x, y, z) {
    // Grid cell coordinates
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    // Relative coordinates within grid cell
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    // Fade curves
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    // Hash coordinates of 8 cube corners
    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;

    // Trilinear interpolation
    return this.lerp(
      this.lerp(
        this.lerp(
          this.grad(this.p[AA], x, y, z),
          this.grad(this.p[BA], x - 1, y, z),
          u
        ),
        this.lerp(
          this.grad(this.p[AB], x, y - 1, z),
          this.grad(this.p[BB], x - 1, y - 1, z),
          u
        ),
        v
      ),
      this.lerp(
        this.lerp(
          this.grad(this.p[AA + 1], x, y, z - 1),
          this.grad(this.p[BA + 1], x - 1, y, z - 1),
          u
        ),
        this.lerp(
          this.grad(this.p[AB + 1], x, y - 1, z - 1),
          this.grad(this.p[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }
}

export function perlinShape(scale, threshold = 0.3, regionSize = null) {
  return (grid, size) => {
    const center = Math.floor(size / 2);
    
    // Use regionSize if provided, otherwise use full simulation size
    const actualRegionSize = regionSize || size;
    const half = Math.floor(actualRegionSize / 2);
    
    // Calculate bounds for central region
    const minX = Math.max(0, center - half);
    const maxX = Math.min(size - 1, center + half);
    const minY = Math.max(0, center - half);
    const maxY = Math.min(size - 1, center + half);
    const minZ = Math.max(0, center - half);
    const maxZ = Math.min(size - 1, center + half);

    // Create Perlin noise instance with seed based on current time
    const noise = new PerlinNoise3D(Date.now() % 10000);
    
    // Use scale to control noise frequency (0.01-0.5 is typical range)
    // Smaller scale = higher frequency (more variation)
    // Larger scale = lower frequency (coarser noise)
    const noiseScale = Math.max(0.01, Math.min(0.5, scale / 100));
    
    // Use threshold - noise values above threshold become alive
    // Perlin noise returns -1 to 1, so to get threshold% density:
    // If threshold = t, then (1 - t) / 2 = density, so t = 1 - 2*density
    // Higher threshold value = lower threshold = more cells alive
    const noiseThreshold = 1 - 2 * threshold;

    // Generate Perlin noise only within the specified region
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          // Sample Perlin noise at this position
          // Scale coordinates by noiseScale to control frequency
          // Use relative position from region center for consistent noise
          const noiseValue = noise.noise(
            (x - center) * noiseScale,
            (y - center) * noiseScale,
            (z - center) * noiseScale
          );
          
          // If noise value is above threshold, cell becomes alive
          if (noiseValue > noiseThreshold) {
            grid.set(x, y, z, 1);
          }
        }
      }
    }
  };
}

export function cubeShape(halfSize = 5, prob = 1) {
  return (grid, size) => {
    const center = Math.floor(size / 2);
    for (let x = center - halfSize; x <= center + halfSize -1; x++) {
      for (let y = center - halfSize; y <= center + halfSize -1; y++) {
        for (let z = center - halfSize; z <= center + halfSize -1; z++) {
          if (Math.random() < prob) grid.set(x, y, z, 1);
        }
      }
    }
  };
}

/**
 * A cube `side` cells wide, centred like the other shapes. cubeShape() takes half a side and
 * fills twice that, so it can't make an odd side; Explore uses this one.
 */
export function cubeOfSide(side, prob = 1) {
  return (grid, size) => {
    const start = Math.floor(size / 2) - Math.floor(side / 2);
    for (let x = start; x < start + side; x++) {
      for (let y = start; y < start + side; y++) {
        for (let z = start; z < start + side; z++) {
          if (Math.random() < prob) grid.set(x, y, z, 1);
        }
      }
    }
  };
}

export function tetrahedronShape(height = 7, prob = 1.0) {
  return (grid, size) => {
    const center = Math.floor(size / 2);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x <= y; x++) {
        for (let z = 0; z <= y - x; z++) {
          const px = center - Math.floor(height / 2) + x;
          const py = center - Math.floor(height / 2) + y;
          const pz = center - Math.floor(height / 2) + z;
          if (Math.random() < prob) grid.set(px, py, pz, 1);
        }
      }
    }
  };
}

export function octahedronShape(radius = 8, prob = 1.0) {
  return (grid, size) => {
    const center = Math.floor(size / 2);
    for (let x = center - radius; x <= center + radius; x++) {
      for (let y = center - radius; y <= center + radius; y++) {
        for (let z = center - radius; z <= center + radius; z++) {
          // Octahedron condition: |x-cx| + |y-cy| + |z-cz| <= radius
          const dx = Math.abs(x - center);
          const dy = Math.abs(y - center);
          const dz = Math.abs(z - center);
          if (dx + dy + dz <= radius) {
            // Check bounds
            if (x >= 0 && x < size && y >= 0 && y < size && z >= 0 && z < size) {
              if (Math.random() < prob) grid.set(x, y, z, 1);
            }
          }
        }
      }
    }
  };
}

// Worley (Cellular) Noise implementation
export function worleyShape(cellCount = 8, threshold = 0.5, regionSize = null) {
  return (grid, size) => {
    // Calculate center of simulation space (use exact center for proper centering)
    const center = (size - 1) / 2;
    
    // Use regionSize if provided, otherwise use full simulation size
    const actualRegionSize = regionSize || size;
    const half = actualRegionSize / 2;
    
    // Calculate bounds for central region (centered at exact center)
    const minX = Math.max(0, Math.floor(center - half));
    const maxX = Math.min(size - 1, Math.floor(center + half));
    const minY = Math.max(0, Math.floor(center - half));
    const maxY = Math.min(size - 1, Math.floor(center + half));
    const minZ = Math.max(0, Math.floor(center - half));
    const maxZ = Math.min(size - 1, Math.floor(center + half));
    
    // Generate random feature points (cell centers)
    const seed = Date.now() % 10000;
    const rng = (x, y, z) => {
      const n = ((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) + seed;
      return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 2147483648.0;
    };
    
    // Number of cells in each dimension (creates a grid of cells)
    const cellsPerDim = Math.max(2, Math.floor(Math.cbrt(cellCount)));
    const cellSize = actualRegionSize / cellsPerDim;
    
    // Calculate the region start position (centered in simulation space)
    // Use exact center minus half to properly center the region
    const regionStartX = center - half;
    const regionStartY = center - half;
    const regionStartZ = center - half;
    
    // Generate feature points for each cell (relative to region center)
    const featurePoints = [];
    for (let cx = 0; cx < cellsPerDim; cx++) {
      for (let cy = 0; cy < cellsPerDim; cy++) {
        for (let cz = 0; cz < cellsPerDim; cz++) {
          // Generate random point within this cell (0 to cellSize range)
          const offsetX = rng(cx, cy, cz) * cellSize;
          const offsetY = rng(cx + 1, cy, cz) * cellSize;
          const offsetZ = rng(cx, cy + 1, cz) * cellSize;
          // Position feature point relative to region start (centered in simulation)
          featurePoints.push({
            x: regionStartX + cx * cellSize + offsetX,
            y: regionStartY + cy * cellSize + offsetY,
            z: regionStartZ + cz * cellSize + offsetZ
          });
        }
      }
    }
    
    // For each grid position within the region, find distance to nearest feature point
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          let minDist = Infinity;
          
          // Find closest feature point (check all feature points for simplicity)
          for (const fp of featurePoints) {
            const dist = Math.sqrt(
              (x - fp.x) ** 2 + 
              (y - fp.y) ** 2 + 
              (z - fp.z) ** 2
            );
            minDist = Math.min(minDist, dist);
          }
          
          // Normalize distance (0 to ~maxDist, typically cellSize)
          const normalizedDist = Math.min(1, minDist / cellSize);
          
          // Use threshold: if normalized distance is below threshold, cell is alive
          // Lower threshold = cells closer to feature points = more cells alive
          if (normalizedDist < threshold) {
            grid.set(x, y, z, 1);
          }
        }
      }
    }
  };
}

// Rule 30 initial condition: single cell at center of top layer
export function rule30Shape() {
  return (grid, size) => {
    const centerX = Math.floor(size / 2)-1;
    const centerZ = Math.floor(size / 2)-1;
    const topY = 0; // Top layer
    
    // Set a single cell at the center of the top layer
    grid.set(centerX, topY, centerZ, 1);
  };
}

// shapes.js
export function voxelShape(voxelData, scale = 1) {
  return (x, y, z, size) => {
    const cx = Math.floor(size / 2);
    const cy = Math.floor(size / 2);
    const cz = Math.floor(size / 2);

    // Map world coords into voxelData space
    const vx = Math.floor((x - cx) / scale + voxelData.length / 2);
    const vy = Math.floor((y - cy) / scale + voxelData[0].length / 2);
    const vz = Math.floor((z - cz) / scale + voxelData[0][0].length / 2);

    return voxelData?.[vx]?.[vy]?.[vz] === 1 ? 1 : 0;
  };
}
