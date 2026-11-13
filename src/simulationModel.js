import * as THREE from 'three';
import { generateSimulation } from './matrixFunctions';
import { state } from "./state.js";
import { initControls } from './controls.js';
import { initSpace } from './space.js';

// Each rebuild gets a number. A GPU run awaits the GPU, so another rebuild can start while one
// is computing; only the latest one may write its result.
let latestRun = 0;

export async function initSimulation() {
  const run = ++latestRun;
  // Show loading overlay
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('hidden');

  try {
    // Yield to the browser so the overlay can paint before heavy work
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => setTimeout(resolve, 0));

    state.reset();
    // Initialize subsystems
    initControls();
    initSpace();

    // Getters (from state)
    const scene = state.scene;
    const simSize = state.sim_size
    const simGenerations = state.sim_generations
    const simSeed = state.shapeFn

    // Setters (to state) - Initial View Settings
    state.viewMode = 'full';
    state.sliceAxis = 'x';
    state.sliceIndex = Math.floor((simSize - 1) / 2); // Ensure valid index (0 to simSize - 1)
    // Generate Simulation Data - History (Game of Life, Rule 30, Sine Wave, or Sandpile)
    console.log(`initSimulation: About to call generateSimulation with useRule30=${state.useRule30}, useRule30_2D=${state.useRule30_2D}, useSineWave=${state.useSineWave}, useSandpile=${state.useSandpile}`);
    const simulationData = await generateSimulation(
      simSize,
      simGenerations,
      simSeed,
      state.useRule30,
      state.useRule30_2D,
      state.useSineWave,
      state.useSandpile,
      state.useSandpile ? state.sandpileParams : null
    );
    console.log(`initSimulation: generateSimulation completed, history length: ${simulationData.length}`);
    if (run !== latestRun) return; // a newer rebuild started; its result wins
    state.simulationData = simulationData;

    const depth = state.useRule30 ? 1 : simSize;
    state.simulationModel =  await buildSimulationModel(simSize, depth);  // Simulation Model
    
    // Model Data to build scene
    const geometry = state.simulationModel.geometry;
    const material = state.simulationModel.material;
    const points = new THREE.Points(geometry, material);
    state.simulationModel.points = points; // Store points for easy access

    // Create wireframe grid helper to show simulation bounds
    // Remove existing wireframe grid if it exists
    if (state.simulationModel.wireframeGridHelper) {
      scene.remove(state.simulationModel.wireframeGridHelper);
      // Dispose of geometries and materials
      state.simulationModel.wireframeGridHelper.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }
    const wireframeGridHelper = createWireframeGrid(simSize, depth);
    state.simulationModel.wireframeGridHelper = wireframeGridHelper;
    wireframeGridHelper.visible = state.showWireframeGrid ?? false;
    scene.add(wireframeGridHelper);

    // Create wireframe cells group for cell wireframe display
    // Remove existing wireframe cells group if it exists
    if (state.simulationModel.wireframeCellsGroup) {
      scene.remove(state.simulationModel.wireframeCellsGroup);
      // Dispose of geometries and materials
      state.simulationModel.wireframeCellsGroup.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }
    const wireframeCellsGroup = new THREE.Group();
    state.simulationModel.wireframeCellsGroup = wireframeCellsGroup;
    wireframeCellsGroup.visible = state.showCellWireframe ?? false;
    scene.add(wireframeCellsGroup);

    // Set initial visibility of points based on cell wireframe state
    points.visible = !state.showCellWireframe;

    updatePoints();
    // drawClock();
    scene.add(points);

    // Start auto-rotation for first load only
    if (!state.userHasInteracted && !state.autoRotateActive) {
      state.autoRotateActive = true;
      state.autoRotateStartTime = performance.now();
    }

    // Hide overlay on next frame to ensure DOM/styles applied
    const overlayNode = document.getElementById('loading-overlay');
    if (overlayNode) {
      requestAnimationFrame(() => overlayNode.classList.add('hidden'));
    }
  } catch (err) {
    console.error('Failed to initialize simulation:', err);
  } finally {
    if (overlay && run === latestRun) overlay.classList.add('hidden');
  }
}


// Point Cloud
async function buildSimulationModel(simSize, depth) {

    const matrixSize = simSize;
    const matrixDepth = depth;
    const cellSize = state.cellSize ?? 1.2; // Use state cell size or default
    const geometry = new THREE.BufferGeometry();
    const maxParticles = matrixSize * matrixSize * matrixDepth;
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, 0);

    // Size attribute not needed for shader material (using uniform instead)

    const material = new THREE.PointsMaterial({
      size: cellSize,
      vertexColors: true,
      sizeAttenuation: true
    });

    return {
        geometry: geometry,
        material: material,
        positions: positions,
        colors: colors,
        matrixSize: matrixSize,
        matrixDepth: matrixDepth
    }
}

export function updatePoints() {

  console.log("Update Points")

  if (!state.simulationModel || !state.simulationModel.geometry) {
    return; // Simulation model not yet initialized
  }

  const baseColor = new THREE.Color("rgba(0, 180, 200, 1)");
  const targetColor = new THREE.Color("rgb(200,20,0)");
  const geometry = state.simulationModel.geometry;
  const matrixSize = state.simulationModel.matrixSize;
  const matrixDepth = state.simulationModel.matrixDepth ?? matrixSize;

  const simulationData = state.simulationData;
  const gen = state.currentGen;
  const grid = simulationData[gen];
  
  console.log(`updatePoints: gen=${gen}, grid.active.length=${grid.active.length}`);
  
  if (grid.active.length > 0) {
    console.log(`updatePoints: First few cells:`, grid.active.slice(0, 5));
  }
  
  let i = 0;
  const activeCells = [];
  const halfSpanXY = (matrixSize - 1) / 2;
  const spanZ = matrixDepth > 1 ? matrixDepth - 1 : 0;
  const halfSpanZ = spanZ / 2;

  // Special handling for sandpile mode (2D simulation, 3D visualization)
  const isSandpile = state.useSandpile;
  
  for (const [x, y, z] of grid.active) {
    let worldX, worldY, worldZ;
    let normX, normZ;
    let color;
    
    if (isSandpile) {
      // For sandpile: z is the grain height (0, 1, 2, 3, ...)
      // Each grain is visualized at its actual height, creating a 3D stack
      const grainHeight = z; // z is the vertical position of this grain (0 = bottom, 1 = second, etc.)
      const heightScale = 1.0; // Each grain is 1 unit tall
      
      // Slice filtering for 2D view mode
      if (
        state.viewMode === "slice" &&
        ((state.sliceAxis === "x" && x !== state.sliceIndex) ||
         (state.sliceAxis === "y" && y !== state.sliceIndex) ||
         (state.sliceAxis === "z" && grainHeight !== state.sliceIndex))
      ) {
        continue;
      }
      
      worldX = x - halfSpanXY;
      worldY = state.flipOrientation
        ? halfSpanXY - y  // Inverted
        : y - halfSpanXY; // Normal
      worldZ = grainHeight * heightScale; // Each grain is stacked 1 unit above the previous
      
      normX = x / (matrixSize - 1);
      
      // Coherent color scheme for first 4 layers (heights 0-3)
      // These are the most common since threshold is 4
      color = new THREE.Color();
      
      if (grainHeight === 0) {
        // Height 0: Deep blue - the foundation
        color.setHex(0x1a237e); // Deep indigo blue
      } else if (grainHeight === 1) {
        // Height 1: Green
        color.setHex(0x4caf50); // Green
      } else if (grainHeight === 2) {
        // Height 2: Purple
        color.setHex(0x9c27b0); // Purple
      } else if (grainHeight === 3) {
        // Height 3: Gold
        color.setHex(0xffd700); // Gold
      } else if (grainHeight === 4) {
        // Height 4: White
        color.setHex(0xffffff); // White
      } else {
        // Heights 5+: Gradient from white to light gray
        const extraHeight = grainHeight - 4;
        const maxExtra = 10;
        const t = Math.min(1, extraHeight / maxExtra);
        color.lerpColors(new THREE.Color(0xffffff), new THREE.Color(0xe0e0e0), t);
      }
    } else {
      // Standard 3D grid visualization
      // Slice filtering
      if (
        state.viewMode === "slice" &&
        ((state.sliceAxis === "x" && x !== state.sliceIndex) ||
         (state.sliceAxis === "y" && y !== state.sliceIndex) ||
         (state.sliceAxis === "z" && z !== state.sliceIndex))
      ) {
        continue;
      }

      // World position of this cell
      worldX = x - halfSpanXY;
      // Flip Y-axis if toggle is enabled (applies to all simulations)
      worldY = state.flipOrientation
        ? halfSpanXY - y  // Inverted
        : y - halfSpanXY; // Normal
      if (matrixDepth <= 1) {
        worldZ = 0;
      } else {
        const normalizedZ = z / (matrixSize - 1);
        worldZ = normalizedZ * spanZ - halfSpanZ;
      }
      
      normX = x / (matrixSize - 1);
      normZ = z / (matrixSize - 1);
      
      // Standard color calculation for non-sandpile modes
      color = baseColor.clone().lerp(targetColor, normX);
      color.offsetHSL(0, 0, normZ * 0.5);
    }
    
    const worldPos = new THREE.Vector3(worldX, worldY, worldZ);

    activeCells.push([x, y, z]);

    state.simulationModel.positions[3 * i]     = worldX;
    state.simulationModel.positions[3 * i + 1] = worldY;
    state.simulationModel.positions[3 * i + 2] = worldZ;

    state.simulationModel.colors[3 * i]     = color.r;
    state.simulationModel.colors[3 * i + 1] = color.g;
    state.simulationModel.colors[3 * i + 2] = color.b;

    i++;

    // drawClock();
  }

  geometry.setDrawRange(0, i);
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;

  // Update wireframe cells if enabled
  updateWireframeCells(activeCells, matrixSize, matrixDepth);

  // Display generation number (if stored in grid) or frame number
  const genDisplay = grid.generation !== undefined ? grid.generation : gen;
  // Update bottom display
  const bottomGen = document.getElementById('bottom-gen');
  if (bottomGen) {
    const maxGen = state.simulationData && state.simulationData.length > 0 ? state.simulationData.length - 1 : 0;
    bottomGen.textContent = `${genDisplay} / ${maxGen}`;
  }
}

function updateWireframeCells(activeCells, matrixSize, matrixDepth) {
  const wireframeCellsGroup = state.simulationModel.wireframeCellsGroup;
  if (!wireframeCellsGroup) return;

  // Clear existing wireframe cell objects
  while (wireframeCellsGroup.children.length > 0) {
    const child = wireframeCellsGroup.children[0];
    child.geometry.dispose();
    child.material.dispose();
    wireframeCellsGroup.remove(child);
  }

  if (!state.showCellWireframe) return;

  const cellSize = state.cellSize ?? 1.0; // Use state cell size or default
  const baseColor = new THREE.Color("rgba(0, 180, 200, 1)");
  const targetColor = new THREE.Color("rgb(200,20,0)");
  const halfSpanXY = (matrixSize - 1) / 2;
  const spanZ = matrixDepth > 1 ? matrixDepth - 1 : 0;
  const halfSpanZ = spanZ / 2;
  
  const isSandpile = state.useSandpile;
  
  // Create wireframe boxes for each active cell
  for (const [x, y, z] of activeCells) {
    let worldX, worldY, worldZ;
    let normX, normZ;
    let color;
    
    if (isSandpile) {
      // For sandpile: z is the grain height (0, 1, 2, 3, ...)
      // Each grain is visualized at its actual height, creating a 3D stack
      const grainHeight = z; // z is the vertical position of this grain (0 = bottom, 1 = second, etc.)
      const heightScale = 1.0; // Each grain is 1 unit tall
      
      worldX = x - halfSpanXY;
      worldY = state.flipOrientation
        ? halfSpanXY - y  // Inverted
        : y - halfSpanXY; // Normal
      worldZ = grainHeight * heightScale; // Each grain is stacked 1 unit above the previous
      
      normX = x / (matrixSize - 1);
      
      // Coherent color scheme for first 4 layers (heights 0-3) for wireframe
      // These are the most common since threshold is 4
      color = new THREE.Color();
      
      if (grainHeight === 0) {
        // Height 0: Deep blue - the foundation
        color.setHex(0x1a237e); // Deep indigo blue
      } else if (grainHeight === 1) {
        // Height 1: Green
        color.setHex(0x4caf50); // Green
      } else if (grainHeight === 2) {
        // Height 2: Purple
        color.setHex(0x9c27b0); // Purple
      } else if (grainHeight === 3) {
        // Height 3: Gold
        color.setHex(0xffd700); // Gold
      } else if (grainHeight === 4) {
        // Height 4: White
        color.setHex(0xffffff); // White
      } else {
        // Heights 5+: Gradient from white to light gray
        const extraHeight = grainHeight - 4;
        const maxExtra = 10;
        const t = Math.min(1, extraHeight / maxExtra);
        color.lerpColors(new THREE.Color(0xffffff), new THREE.Color(0xe0e0e0), t);
      }
    } else {
      // Standard 3D grid visualization
      worldX = x - halfSpanXY;
      worldY = state.flipOrientation
        ? halfSpanXY - y  // Inverted
        : y - halfSpanXY; // Normal
      if (matrixDepth <= 1) {
        worldZ = 0;
      } else {
        const normalizedZ = z / (matrixSize - 1);
        worldZ = normalizedZ * spanZ - halfSpanZ;
      }
      
      normX = x / (matrixSize - 1);
      normZ = z / (matrixSize - 1);
      
      // Standard color calculation for non-sandpile modes
      color = baseColor.clone().lerp(targetColor, normX);
      color.offsetHSL(0, 0, normZ * 0.5);
    }
    
    // Create a new box geometry for each cell (EdgesGeometry needs its own geometry)
    const boxGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
    const edges = new THREE.EdgesGeometry(boxGeometry);
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.LineSegments(edges, lineMaterial);
    
    line.position.set(worldX, worldY, worldZ);
    
    wireframeCellsGroup.add(line);
    
    // Dispose of boxGeometry (EdgesGeometry keeps its own reference)
    boxGeometry.dispose();
  }
}

function createWireframeGrid(cellCount, depth) {
  const group = new THREE.Group();
  const spanXY = Math.max(cellCount, 1);
  const spanZ = depth > 1 ? Math.max(depth - 1, 1) : 1;
  const color = new THREE.Color(0xffffff);
  const opacity = 0.3;
  
  // Create a wireframe box representing the simulation bounds
  const boxGeometry = new THREE.BoxGeometry(spanXY, spanXY, spanZ);
  const edges = new THREE.EdgesGeometry(boxGeometry);
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: opacity
  });
  const wireframeBox = new THREE.LineSegments(edges, lineMaterial);
  wireframeBox.position.set(0, 0, 0); // Centered at origin
  
  group.add(wireframeBox);
  
  // Add grid lines to show the grid structure (optional - can be removed if too cluttered)
  const divisions = Math.max(cellCount, 1);
  const gridHelperXY = new THREE.GridHelper(spanXY, divisions, color, color);
  gridHelperXY.position.z = 0;
  gridHelperXY.material.transparent = true;
  gridHelperXY.material.opacity = opacity * 0.5;
  
  const gridHelperXZ = new THREE.GridHelper(spanXY, divisions, color, color);
  gridHelperXZ.rotation.x = Math.PI / 2;
  gridHelperXZ.position.y = 0;
  gridHelperXZ.material.transparent = true;
  gridHelperXZ.material.opacity = opacity * 0.5;
  
  const gridHelperYZ = new THREE.GridHelper(spanZ, Math.max(depth, 1), color, color);
  gridHelperYZ.rotation.z = Math.PI / 2;
  gridHelperYZ.position.x = 0;
  gridHelperYZ.material.transparent = true;
  gridHelperYZ.material.opacity = opacity * 0.5;
  
  group.add(gridHelperXY);
  group.add(gridHelperXZ);
  group.add(gridHelperYZ);
  
  // Dispose of box geometry
  boxGeometry.dispose();
  
  return group;
}

// function drawClock() {
//   const ctx = document.getElementById("clockCanvas").getContext("2d");
//   const frame = state.clockData[state.currentGen % state.clockData.length];
//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//   ctx.drawImage(frame, 0, 0, ctx.canvas.width, ctx.canvas.height);
// }
