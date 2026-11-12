import { state } from "./state.js";
import { initSimulation, updatePoints } from "./simulationModel.js";
import * as THREE from 'three';
import { initComputeControl, updateComputeControl } from "./gpu/computeControl.js";
import { isExplore, startExplore, stopExplore, togglePlay, stepOnce, restart, exploreViewChanged, toggleSave, confirmSave, closeSave } from "./explore/explore.js";
import { shapeSeed, parseRules, arenaBox, MAX_SHAPE_SIZE } from "./explore/seed.js";
import { readSeedOrSave } from "./explore/save.js";
import { MAX_RESULT_BYTES } from "./unbounded/canonical.js";
import { PRESETS, presetById } from "./explore/presets.js";
import { perlinShape, worleyShape, cubeOfSide, tetrahedronShape, octahedronShape } from "./shapeGenerators.js";

let pendingShapeKey = null;
let shapeDropdownPrevValue = null;
let shapeDropdownOpened = false;
// A seed file loaded in the dialog for Explore, until Apply: {name, rules, cells}
let pendingExploreSeed = null;
// The largest seed file the dialog reads, in bytes
// Load… takes a seed file or a saved generation, which holds a seed and a generation
const MAX_SEED_FILE_BYTES = MAX_RESULT_BYTES;

// Helper functions for updating displays (must be outside initControls to be accessible from resetControlsUI)
function updateDirectionDisplay() {
  const directionValue = document.getElementById('bottom-direction-value');
  if (directionValue) {
    directionValue.textContent = state.isReversing ? 'rev' : 'fwd';
  }
}

function updateStateDisplay() {
  const stateValue = document.getElementById('bottom-state-value');
  if (stateValue) {
    stateValue.textContent = state.isPlaying ? 'play' : 'pause';
  }
}

function updateSimulationModeTitle() {
  const titleEl = document.getElementById('simulation-mode-title');
  if (titleEl) {
    const modeNames = {
      gameOfLife: 'Game of Life',
      rule30: 'Rule 30',
      sineWave: 'Sine Wave',
      sandpile: 'Sandpile',
      explore: 'Explore'
    };
    let modeName = modeNames[state.simulationMode] || 'Game of Life';
    titleEl.textContent = modeName;
  }
}

// controls.js
export function initControls() {

  // If already initialized, just refresh dynamic values and exit to avoid duplicate listeners
  if (state.controlsInitialized) {
    const sliceIndexSliderExisting = document.getElementById('slice-index');
    if (sliceIndexSliderExisting) {
      sliceIndexSliderExisting.max = state.sim_size - 1;
    }
    // Always refresh simulation info displays
    const simSizeEl = document.getElementById('sim-size-value');
    const simGensEl = document.getElementById('sim-generations-value');
    if (simSizeEl) simSizeEl.textContent = String(state.sim_size);
    if (simGensEl) simGensEl.textContent = String(state.sim_generations);
    // Always update title when controls are refreshed
    updateSimulationModeTitle();
    // The mode may have changed, and with it whether the next run can use the GPU
    updateComputeControl();
    return;
  }
  
  // Initialize simulation mode title on first load
  updateSimulationModeTitle();
  // GPU compute toggle and indicator
  initComputeControl();
  // Initialize Simulation info displays on first load
  const simSizeOut = document.getElementById('sim-size-value');
  const simGensOut = document.getElementById('sim-generations-value');
  if (simSizeOut) simSizeOut.textContent = String(state.sim_size);
  if (simGensOut) simGensOut.textContent = String(state.sim_generations);

  const shapeSelect = document.getElementById("shape-select");
  if (shapeSelect) {
    // Reflect current state on first load
    shapeSelect.value = state.shapeKey;
    // Initialize displays from state
    const initParams = state.shapeParams?.[state.shapeKey];
    if (initParams) {
      const sizeOut = document.getElementById('shape-size-value');
      const densityOut = document.getElementById('shape-density-value');
      const shapeOut = document.getElementById('shape-name-value');
      const simSizeOut = document.getElementById('sim-size-value');
      const simGensOut = document.getElementById('sim-generations-value');
      if (sizeOut) sizeOut.textContent = `${Math.min(state.sim_size, Math.max(1, parseInt(initParams.size)))}`;
      if (densityOut) densityOut.textContent = `${Math.min(1, Math.max(0, parseFloat(initParams.density))).toFixed(2)}`;
      if (shapeOut) shapeOut.textContent = state.shapeKey;
      if (simSizeOut) simSizeOut.textContent = `${state.sim_size}`;
      if (simGensOut) simGensOut.textContent = `${state.sim_generations}`;
    }
    // Timed detection: if no change occurs shortly after opening, treat as re-config
    let sameSelectTimer = null;
    const armSameSelectTimer = () => {
      const current = shapeSelect.value;
      clearTimeout(sameSelectTimer);
      sameSelectTimer = setTimeout(() => {
        if (shapeSelect.value === current && current === state.shapeKey) {
          pendingShapeKey = state.shapeKey;
          openShapeModal();
        }
      }, 3);
    };
    shapeSelect.addEventListener('mousedown', armSameSelectTimer);
    shapeSelect.addEventListener('touchstart', armSameSelectTimer, { passive: true });
    shapeSelect.addEventListener('blur', () => { clearTimeout(sameSelectTimer); });
  }

  // Seed config button opens modal directly
  const seedBtn = document.getElementById('seedConfigButton');
  if (seedBtn) {
    seedBtn.addEventListener('click', () => {
      pendingShapeKey = state.shapeKey;
      openShapeModal();
    });
  }

  if (shapeSelect) {
    shapeSelect.addEventListener("change", (e) => {
      // User selected a different shape; cancel same-select timer and open modal
      try { clearTimeout(sameSelectTimer); } catch {}
      pendingShapeKey = e.target.value;
      openShapeModal();
    });
  }


  // --- Slice Tri-State Button ---
  const sliceToggleButton = document.getElementById('triStateButton');
  sliceToggleButton.addEventListener('click', () => {
    // Get all child state sections
    const sections = Array.from(sliceToggleButton.querySelectorAll('.state-section'));

    // Find the active section based on class
    const activeIndex = sections.findIndex(sec => sec.classList.contains('active'));

    sections[activeIndex].classList.remove('active');
    sliceToggleButton.classList.remove(`state-active-${sections[activeIndex].dataset.value}`)
    // Pick next section (wrap around using modulo)
    const nextIndex = (activeIndex + 1) % sections.length;
    const nextSection = sections[nextIndex];
    sliceToggleButton.classList.add(`state-active-${nextSection.dataset.value}`)
    nextSection.classList.add('active');
    const newAxis = nextSection.dataset.value;
    state.sliceAxis = newAxis;
    updateViewControlsDisplay();
    updatePoints();
    if (isExplore()) exploreViewChanged();
  });
  
  // Initialize view controls display
  updateViewControlsDisplay();

  // Function to update view controls display
  function updateViewControlsDisplay() {
    const displayText = document.getElementById('view-controls-display-text');
    const sliceSlider = document.getElementById('slice-index');
    
    if (displayText) {
      if (state.viewMode === 'slice') {
        const index = state.sliceIndex !== null ? state.sliceIndex : 0;
        const maxIndex = sliceSlider ? (parseInt(sliceSlider.max) || state.sim_size - 1) : (state.sim_size - 1);
        displayText.textContent = `${index} / ${maxIndex}`;
      } else {
        displayText.textContent = '-';
      }
    }
  }
  
  // --- Dual-State for Dimension View Button ---
  const dimensionToggleButton = document.getElementById('dualStateButton');
  dimensionToggleButton.addEventListener('click', () => {
    // Get all child state sections
    const sections = Array.from(dimensionToggleButton.querySelectorAll('.state-section'));

    // Find the active section based on class
    const activeIndex = sections.findIndex(sec => sec.classList.contains('active'));

    sections[activeIndex].classList.remove('active');
    dimensionToggleButton.classList.remove(`state-active-${sections[activeIndex].dataset.id}`)
    // Pick next section (wrap around using modulo)
    const nextIndex = (activeIndex + 1) % sections.length;
    const nextSection = sections[nextIndex];
    dimensionToggleButton.classList.add(`state-active-${nextSection.dataset.id}`)
    nextSection.classList.add('active');

    const newViewMode = nextSection.dataset.value;
    console.log("View Mode Change");
    console.log(newViewMode);
    state.viewMode = newViewMode;
    updateViewControlsDisplay();
    updatePoints();
    updateTriStateVisibility();
    if (isExplore()) exploreViewChanged();
  });

  // --- Slice Index Slider ---
  const sliceIndexSlider = document.getElementById('slice-index');
  sliceIndexSlider.addEventListener('input', () => {
    const index = parseInt(sliceIndexSlider.value);
    state.sliceIndex = index;
    updateViewControlsDisplay();
    if (state.viewMode === 'slice') updatePoints();
    if (isExplore()) exploreViewChanged();
  });

  if (sliceIndexSlider) {
    const sliceMax = state.sim_size - 1; // Grid indices are 0 to sim_size - 1
    sliceIndexSlider.max = sliceMax;
    // Ensure current value is within valid range
    if (parseInt(sliceIndexSlider.value) > sliceMax) {
      sliceIndexSlider.value = sliceMax;
      state.sliceIndex = sliceMax;
    }
  }


  const reverseBtn = document.getElementById("reverseButton");
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");
  rightArrow.classList.add("active");
  let isReversing = false; // variable changes based on button

  // Initialize step circles
  const leftStepCircle = document.getElementById("leftStepCircle");
  const rightStepCircle = document.getElementById("rightStepCircle");
  if (rightStepCircle) rightStepCircle.classList.add("active");
  
  reverseBtn.addEventListener("click", () => {
    if (isExplore()) return; // a stream only runs forward
    // isReversing = getPlaybackDirection
    isReversing = !isReversing; // toggle on/off

    console.log("Reverse mode:", isReversing);
    // setPlaybackDirection(isReversing);
    state.isReversing = isReversing;
    updateArrows();
    
  });
  
  function updateArrows() {
    if (isReversing) {
      leftArrow.classList.add("active");
      rightArrow.classList.remove("active");
    } else {
      leftArrow.classList.remove("active");
      rightArrow.classList.add("active");
    }
    updateStepCircles();
    updateDirectionDisplay();
    // updateDirectionIcon();
  }

  function updateStepCircles() {
    const leftStepCircle = document.getElementById("leftStepCircle");
    const rightStepCircle = document.getElementById("rightStepCircle");
    if (leftStepCircle && rightStepCircle) {
      if (state.isReversing) {
        leftStepCircle.classList.add("active");
        rightStepCircle.classList.remove("active");
      } else {
        leftStepCircle.classList.remove("active");
        rightStepCircle.classList.add("active");
      }
    }
  }

  // Buttons
  const playPauseButton = document.getElementById("playPauseButton");
  const playPauseIcon = document.getElementById("playPauseIcon");
  playPauseButton.onclick = () => {
    if (isExplore()) {
      togglePlay(); // the run answers, and explore.js updates the button
      return;
    }
    const next = !state.isPlaying;
    state.isPlaying = next;
    playPauseIcon.className = next ? "pause" : "play";
    console.log("Playback Direction:", next);
    updateStepButtonVisibility();
    updateStateDisplay();
  }

  // const reverseButton = document.getElementById("reverseButton");
  const stepButton = document.getElementById("stepButton");
  stepButton.addEventListener("click", () => {
    if (isExplore()) {
      stepOnce();
      return;
    }
    if (state.isReversing) {
      state.currentGen = (state.currentGen - 1 + state.simulationData.length) % state.simulationData.length;
    } else {
      state.currentGen = (state.currentGen + 1) % state.simulationData.length;
    }

    // update bottom display
    const bottomGen = document.getElementById('bottom-gen');
    if (bottomGen) {
      const maxGen = state.simulationData && state.simulationData.length > 0 ? state.simulationData.length - 1 : 0;
      bottomGen.textContent = `${state.currentGen} / ${maxGen}`;
    }
  });

  // Explore only: start again from the same seed and rules. initControls() runs again on every
  // Apply, so these are set as properties, never added: a second listener would run twice
  const restartButton = document.getElementById("restartButton");
  if (restartButton) restartButton.onclick = restart;
  // Explore only: the save popover, opened by Save this generation or Save seed. Escape or a
  // click elsewhere closes it
  const savePopover = document.getElementById("explore-save-popover");
  const saveGenerationButton = document.getElementById("explore-save-generation");
  if (saveGenerationButton) saveGenerationButton.onclick = () => toggleSave("generation");
  const saveSeedButton = document.getElementById("explore-save-seed");
  if (saveSeedButton) saveSeedButton.onclick = () => toggleSave("seed");
  const saveConfirm = document.getElementById("explore-save-confirm");
  if (saveConfirm) saveConfirm.onclick = confirmSave;
  const saveCancel = document.getElementById("explore-save-cancel");
  if (saveCancel) saveCancel.onclick = closeSave;
  if (savePopover && !savePopover.dataset.wired) {
    savePopover.dataset.wired = "yes";
    const isOpen = () => savePopover.classList.contains("is-open");
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) closeSave();
    });
    document.addEventListener("pointerdown", (e) => {
      // The buttons toggle the popover themselves
      if (isOpen() && !savePopover.contains(e.target) && !e.target.closest?.("#explore-save-generation, #explore-save-seed")) closeSave();
    });
  }

  updateStepButtonVisibility();

  const directionButton = document.getElementById("directionButton");
  
  // const directionIcon = document.getElementById("directionIcon");
  // updateDirectionIcon();

  // document.getElementById("reverseButton").addEventListener("click", () => {
  //   state.isReversing = !state.isReversing;
  //   updateDirectionIcon();
  // });

  // Ensure slice/controls visibility reflects current mode on load
  updateTriStateVisibility();
  
  // Initialize additional controls display
  updateAdditionalControlsDisplay();
  
  // Initialize direction and state displays
  updateDirectionDisplay();
  updateStateDisplay();

  // Function to update additional controls display
  function updateAdditionalControlsDisplay() {
    const gridStatus = document.getElementById('additional-grid-status');
    const orientationStatus = document.getElementById('additional-orientation-status');
    const cellSizeValue = document.getElementById('additional-cell-size-value');
    
    if (gridStatus) {
      gridStatus.textContent = state.showWireframeGrid ? 'on' : 'off';
    }
    if (orientationStatus) {
      orientationStatus.textContent = state.flipOrientation ? 'down' : 'up';
    }
    if (cellSizeValue) {
      cellSizeValue.textContent = (state.cellSize ?? 1.2).toFixed(2);
    }
  }

  // Wireframe grid toggle
  const wireframeGridToggle = document.getElementById('wireframeGridToggle');
  const wireframeGridIcon = document.getElementById('wireframeGridIcon');
  if (wireframeGridToggle) {
    wireframeGridToggle.addEventListener('click', () => {
      state.showWireframeGrid = !state.showWireframeGrid;
      // Update icon color - blue when active, white/gray when inactive
      if (wireframeGridIcon) {
        wireframeGridIcon.style.fill = state.showWireframeGrid ? '#4da3ff' : 'currentColor';
      }
      // Toggle visibility of wireframe grid
      if (state.simulationModel && state.simulationModel.wireframeGridHelper) {
        state.simulationModel.wireframeGridHelper.visible = state.showWireframeGrid;
      }
      updateAdditionalControlsDisplay();
    });
    // Initialize icon state
    if (wireframeGridIcon) {
      wireframeGridIcon.style.fill = state.showWireframeGrid ? '#4da3ff' : 'currentColor';
    }
  }

  // Wireframe cells toggle
  const wireframeCellsToggle = document.getElementById('wireframeCellsToggle');
  const wireframeCellsIcon = document.getElementById('wireframeCellsIcon');
  if (wireframeCellsToggle) {
    wireframeCellsToggle.addEventListener('click', () => {
      state.showCellWireframe = !state.showCellWireframe;
      // Update icon color - blue when active, white/gray when inactive
      if (wireframeCellsIcon) {
        wireframeCellsIcon.style.fill = state.showCellWireframe ? '#4da3ff' : 'currentColor';
      }
      // Toggle visibility of wireframe cells and points
      if (state.simulationModel) {
        const points = state.simulationModel.points;
        const wireframeCellsGroup = state.simulationModel.wireframeCellsGroup;
        if (points) {
          points.visible = !state.showCellWireframe;
        }
        if (wireframeCellsGroup) {
          wireframeCellsGroup.visible = state.showCellWireframe;
        }
        // Always update wireframe cells when toggling (to ensure they're generated/updated)
        if (state.simulationData) {
          updatePoints();
        }
      }
    });
    // Initialize icon state
    if (wireframeCellsIcon) {
      wireframeCellsIcon.style.fill = state.showCellWireframe ? '#4da3ff' : 'currentColor';
    }
  }

  // Flip orientation toggle
  const flipOrientationToggle = document.getElementById('flipOrientationToggle');
  const flipOrientationUp = document.getElementById('flipOrientationUp');
  const flipOrientationDown = document.getElementById('flipOrientationDown');
  if (flipOrientationToggle) {
    flipOrientationToggle.addEventListener('click', () => {
      state.flipOrientation = !state.flipOrientation;
      updateFlipOrientationDisplay();
      updateAdditionalControlsDisplay();
      // Update rendering to reflect the flip
      if (state.simulationData) {
        updatePoints();
      }
    });
    // Initialize icon state
    updateFlipOrientationDisplay();
  }

  function updateFlipOrientationDisplay() {
    if (flipOrientationUp && flipOrientationDown) {
      // When flipOrientation is false (up), highlight the up arrow
      // When flipOrientation is true (down), highlight the down arrow
      if (state.flipOrientation) {
        flipOrientationUp.classList.remove('active');
        flipOrientationDown.classList.add('active');
      } else {
        flipOrientationUp.classList.add('active');
        flipOrientationDown.classList.remove('active');
      }
    }
  }

  // Cell size slider
  const cellSizeSlider = document.getElementById('cellSizeSlider');
  if (cellSizeSlider) {
    // Initialize slider value from state
    cellSizeSlider.value = state.cellSize ?? 1.2;
    
    cellSizeSlider.addEventListener('input', () => {
      const newSize = parseFloat(cellSizeSlider.value);
      state.cellSize = newSize;
      
      // Update points material size
      if (state.simulationModel && state.simulationModel.material) {
        const material = state.simulationModel.material;
        if (material instanceof THREE.PointsMaterial) {
          material.size = newSize;
          material.needsUpdate = true;
        } else if (material.uniforms && material.uniforms.uPointSize) {
          // Shader material (dithering enabled)
          material.uniforms.uPointSize.value = newSize;
        }
      }
      
      // Update wireframe cells if visible
      if (state.simulationData && state.showCellWireframe) {
        updatePoints();
      }
      updateAdditionalControlsDisplay();
    });
  }

  // Company logo buttons - open company modal (set up globally)
  const companyModal = document.getElementById('company-modal');
  const companyModalClose = document.getElementById('company-modal-close');
  
  // Handle all company logo buttons: each opens the company modal, which links to morpheustech.net
  const companyLogoButtons = [
    document.getElementById('company-logo-button'),
    document.getElementById('company-logo-button-size'),
    document.getElementById('company-logo-button-sand'),
    document.getElementById('company-logo-button-top')
  ];
  
  // Functions to hide/show UI when company modal opens/closes
  function hideUIForCompanyModal() {
    const glassDisplayContainer = document.getElementById('glass-display-container');
    const bottomControlsDisplay = document.getElementById('bottom-controls-display');
    const additionalControlsDisplay = document.getElementById('additional-controls-display');
    const simulationModeTitle = document.getElementById('simulation-mode-title');
    const controlsWrapper = document.getElementById('controls-wrapper');
    const footerIcons = document.getElementById('footer-icons');
    const companyBrand = document.getElementById('company-brand');

    if (footerIcons) footerIcons.style.display = 'none';
    if (companyBrand) companyBrand.style.display = 'none';
    if (glassDisplayContainer) glassDisplayContainer.style.display = 'none';
    if (bottomControlsDisplay) bottomControlsDisplay.style.display = 'none';
    if (additionalControlsDisplay) additionalControlsDisplay.style.display = 'none';
    if (simulationModeTitle) simulationModeTitle.style.display = 'none';
    if (controlsWrapper) controlsWrapper.style.display = 'none';
  }
  
  function showUIAfterCompanyModal() {
    const glassDisplayContainer = document.getElementById('glass-display-container');
    const bottomControlsDisplay = document.getElementById('bottom-controls-display');
    const additionalControlsDisplay = document.getElementById('additional-controls-display');
    const simulationModeTitle = document.getElementById('simulation-mode-title');
    const controlsWrapper = document.getElementById('controls-wrapper');
    const footerIcons = document.getElementById('footer-icons');
    const companyBrand = document.getElementById('company-brand');

    if (footerIcons) footerIcons.style.display = '';
    if (companyBrand) companyBrand.style.display = '';
    if (glassDisplayContainer && state.showHUD) glassDisplayContainer.style.display = 'flex';
    if (bottomControlsDisplay && state.showHUD) bottomControlsDisplay.style.display = 'grid';
    if (additionalControlsDisplay && state.showHUD) additionalControlsDisplay.style.display = 'grid';
    if (simulationModeTitle && state.showHUD) simulationModeTitle.style.display = 'block';
    if (controlsWrapper) controlsWrapper.style.display = '';
  }
  
  companyLogoButtons.forEach(button => {
    if (button && companyModal) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        companyModal.classList.remove('hidden');
        hideUIForCompanyModal();
      });
    }
  });
  
  if (companyModalClose && companyModal) {
    companyModalClose.addEventListener('click', () => {
      companyModal.classList.add('hidden');
      showUIAfterCompanyModal();
    });
    
    // Close modal when clicking outside
    companyModal.addEventListener('click', (e) => {
      if (e.target === companyModal) {
        companyModal.classList.add('hidden');
        showUIAfterCompanyModal();
      }
    });
  }

  // Flip orientation toggle (applies to all simulations)
  // Flip orientation toggle - handled below with updateFlipOrientationDisplay

  // Mark controls as initialized to prevent duplicate bindings on re-init
  // HUD toggle button
  const hudToggleButton = document.getElementById('hudToggleButton');
  const glassDisplayContainer = document.getElementById('glass-display-container');
  const bottomControlsDisplay = document.getElementById('bottom-controls-display');
  const additionalControlsDisplay = document.getElementById('additional-controls-display');
  const simulationModeTitle = document.getElementById('simulation-mode-title');
  
  if (hudToggleButton && glassDisplayContainer) {
    hudToggleButton.addEventListener('click', () => {
      state.showHUD = !state.showHUD;
      
      // Toggle glass displays
      glassDisplayContainer.style.display = state.showHUD ? 'flex' : 'none';
      
      // Toggle control panel info displays
      if (bottomControlsDisplay) {
        bottomControlsDisplay.style.display = state.showHUD ? 'grid' : 'none';
      }
      if (additionalControlsDisplay) {
        additionalControlsDisplay.style.display = state.showHUD ? 'grid' : 'none';
      }
      
      // Toggle title
      if (simulationModeTitle) {
        simulationModeTitle.style.display = state.showHUD ? 'block' : 'none';
      }
      
      // Update icon color - blue when visible, white/gray when hidden
      const hudIcon = document.getElementById('hudToggleIcon');
      if (hudIcon) {
        hudIcon.style.stroke = state.showHUD ? '#4da3ff' : 'currentColor';
      }
    });
    
    // Initialize icon state (HUD is visible by default)
    const hudIcon = document.getElementById('hudToggleIcon');
    if (hudIcon) {
      hudIcon.style.stroke = '#4da3ff'; // Blue when visible
    }
    
    // Initialize display state to match CSS (grid layout)
    if (bottomControlsDisplay) {
      bottomControlsDisplay.style.display = state.showHUD ? 'grid' : 'none';
    }
    if (additionalControlsDisplay) {
      additionalControlsDisplay.style.display = state.showHUD ? 'grid' : 'none';
    }
  }

  // Initialize simulation mode title
  updateSimulationModeTitle();

  state.controlsInitialized = true;
}

function updateStepButtonVisibility() {
  const btn = document.getElementById('stepButton');
  if (!btn) return;
  if (state.isPlaying) {
    btn.classList.add('disabled')
  } else {
    btn.classList.remove('disabled')
  }
}

  // function updateDirectionIcon() {
  //   if (state.isReversing) {
  //     directionIcon.textContent = "⏪"; // backwards
  //   } else {
  //     directionIcon.textContent = "⏩"; // forwards
  //   }
  // }

function updateTriStateVisibility() {
  const dual = document.getElementById('dualStateButton');
  const activeSection = dual?.querySelector('.state-section.active');
  const tri = document.getElementById('triStateButton');
  const sliceSlider = document.getElementById('slider');
  const sliceViewer = document.getElementById('sliceViewer');
  const isSlice = activeSection && activeSection.dataset.value === 'slice';
  if (tri) tri.style.display = isSlice ? 'block' : 'none';
  if (sliceSlider) sliceSlider.style.display = isSlice ? 'block' : 'none';
  // Use flex so label/value align like other rows
  if (sliceViewer) sliceViewer.style.display = isSlice ? 'flex' : 'none';
}

function openShapeModal() {
  const modal = document.getElementById('shapeModal');
  const sizeInput = document.getElementById('shape-size');
  const sizeLabel = document.getElementById('shape-size-label');
  const densityInput = document.getElementById('shape-density');
  const regionSizeInput = document.getElementById('shape-region-size');
  const regionSizeLabel = document.getElementById('shape-region-size-label');
  const regionSizeRow = document.getElementById('shape-region-size-row');
  const modalShapeSelect = document.getElementById('modal-shape-select');
  const confirmBtn = document.getElementById('shapeConfirm');
  const cancelBtn = document.getElementById('shapeCancel');
  const rulesSection = document.getElementById('rules-section');
  const seedSection = document.getElementById('seed-section');
  const simSizeLabel = document.getElementById('sim-size-label');
  const gridWrappingLabel = document.getElementById('grid-wrapping-label');
  const ruleBirth = document.getElementById('rule-birth');
  const ruleSurvival = document.getElementById('rule-survival');
  const ruleIsolation = document.getElementById('rule-isolation');
  const ruleOvercrowd = document.getElementById('rule-overcrowd');
  const simSizeInput = document.getElementById('sim-size');
  const simGenerationsInput = document.getElementById('sim-generations');
  const gridWrappingCheckbox = document.getElementById('grid-wrapping-checkbox');

  if (!modal || !sizeInput || !densityInput || !confirmBtn || !cancelBtn) return;

  /** The rule fields show Explore's own rules (or its loaded seed file's) in Explore. */
  function fillRuleInputs(mode) {
    const rules = mode === 'explore' ? (pendingExploreSeed?.rules ?? state.explore.rules) : state.rules;
    if (ruleBirth) ruleBirth.value = stringifyRule(rules?.birth ?? [9, 10]);
    if (ruleSurvival) ruleSurvival.value = stringifyRule(rules?.survival ?? []);
  }

  /**
   * Shows which seed Explore will run: Custom (a shape, or a seed file) or a Preset, whose rules
   * the rule fields show but can't change. It looks its elements up itself, because updateModeUI()
   * calls it before Explore's settings below are set up.
   */
  function syncExploreSeedKind() {
    const preset = Boolean(seedSection?.classList.contains('explore-seed') && pendingExploreSeed?.preset);
    seedSection?.classList.toggle('preset-active', preset);
    const customRadio = document.getElementById('explore-seed-custom');
    const presetRadio = document.getElementById('explore-seed-preset');
    customRadio?.setAttribute('aria-pressed', String(!preset));
    presetRadio?.setAttribute('aria-pressed', String(preset));
    // A saved generation carries on under its own rules, so they can't change either
    const saved = Boolean(seedSection?.classList.contains('explore-seed') && pendingExploreSeed?.from !== undefined);
    for (const input of [ruleBirth, ruleSurvival]) {
      if (!input) continue;
      input.readOnly = preset || saved;
      input.title = preset ? 'A preset brings its own rules. Choose Custom to set your own.'
        : saved ? 'A saved generation carries on under its own rules. Use the shape, or load a seed file, to set your own.' : '';
    }
    const select = document.getElementById('explore-preset');
    if (select && preset) select.value = pendingExploreSeed.preset;
    const description = document.getElementById('explore-preset-description');
    if (description) description.textContent = presetById(select?.value)?.description ?? '';
  }

  function showExploreError(message) {
    const el = document.getElementById('explore-error');
    if (!el) return;
    el.hidden = !message;
    el.textContent = message ?? '';
  }

  // Initialize simulation inputs from state - use mode-specific values if available
  let currentMode = state.simulationMode || 'gameOfLife';
  // If current mode is rule30_2D, convert to rule30 (we now use toggle instead)
  if (currentMode === 'rule30_2D') {
    currentMode = 'rule30';
    state.simulationMode = 'rule30';
  }
  const modeSize = state.modeValues[currentMode]?.size;
  const modeGens = state.modeValues[currentMode]?.generations;
  
  if (simSizeInput) {
    simSizeInput.value = `${modeSize !== undefined ? modeSize : state.sim_size}`;
  }
  if (simGenerationsInput) {
    const gens = modeGens !== undefined ? modeGens : state.sim_generations;
    const maxGens = currentMode === 'gameOfLife' ? Math.min(100, gens) : gens;
    simGenerationsInput.value = `${maxGens}`;
  }
  if (gridWrappingCheckbox) {
    gridWrappingCheckbox.checked = state.gridWrapping ?? true;
  }

  // Initialize simulation mode cards
  const modeCards = document.querySelectorAll('.mode-card');
  modeCards.forEach(card => {
    if (card.dataset.mode === currentMode) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  const key = pendingShapeKey || state.shapeKey;

  // Function to calculate required size for Rule 30 based on generations
  function calculateRule30Size(generations, mode) {
    if (mode === 'rule30') {
      // Rule 30 (1D): grows in a triangular pattern
      // Maximum width = 2 * generations + 1 (with padding for asymmetric growth)
      // Height = generations + 1 (initial layer + all generations)
      // Depth = 1 (only one z slice)
      // Use the maximum of width and height, with some padding
      const maxWidth = 2 * generations + 1;
      const padding = Math.ceil(generations * 0.1); // 10% padding for safety
      return Math.max(maxWidth + padding, generations + 1 + padding);
    } else if (mode === 'rule30_2D') {
      // Rule 30 (3D): grows in 2D, spreading in both x and z directions
      // Similar calculation but needs to account for 2D spread
      const maxWidth = 2 * generations + 1;
      const padding = Math.ceil(generations * 0.15); // 15% padding for 2D spread
      return Math.max(maxWidth + padding, generations + 1 + padding);
    }
    return 50; // Default fallback
  }

  // Function to update UI based on selected mode
  const boundaryRulesSection = document.getElementById('boundary-rules-section');
  const rule302DToggleRow = document.getElementById('rule30-2d-toggle-row');
  const rule302DCheckbox = document.getElementById('rule30-2d-checkbox');
  const sandpileSection = document.getElementById('sandpile-section');
  
  // Initialize checkbox
  if (rule302DCheckbox) {
    // Set initial state
    rule302DCheckbox.checked = state.useRule30_2D || false;
    rule302DCheckbox.addEventListener('change', () => {
      // Only update size calculation when Rule 30 mode is active
      const activeCard = document.querySelector('.mode-card.active');
      const selectedMode = activeCard ? activeCard.dataset.mode : 'gameOfLife';
      if (selectedMode === 'rule30' && simGenerationsInput && simSizeInput) {
        const generations = Math.max(1, parseInt(simGenerationsInput.value) || state.sim_generations);
        const is2D = rule302DCheckbox.checked;
        const calculatedSize = calculateRule30Size(generations, is2D ? 'rule30_2D' : 'rule30');
        simSizeInput.value = calculatedSize;
      }
    });
  }
  
  if (gridWrappingCheckbox) {
    // Set initial state
    gridWrappingCheckbox.checked = state.gridWrapping ?? true;
  }
  
  function updateModeUI(mode) {
    seedSection?.classList.toggle('explore-seed', mode === 'explore');
    syncExploreSeedKind();
    // Store current values before switching modes
    if (simSizeInput && simSizeInput.style.display !== 'none') {
      const currentSize = parseInt(simSizeInput.value);
      if (!isNaN(currentSize) && currentSize > 0) {
        if (!state.modeValues[state.simulationMode]) {
          state.modeValues[state.simulationMode] = {};
        }
        state.modeValues[state.simulationMode].size = currentSize;
      }
    }
    if (simGenerationsInput && simGenerationsInput.style.display !== 'none') {
      const currentGens = parseInt(simGenerationsInput.value);
      if (!isNaN(currentGens) && currentGens > 0) {
        if (!state.modeValues[state.simulationMode]) {
          state.modeValues[state.simulationMode] = {};
        }
        state.modeValues[state.simulationMode].generations = currentGens;
      }
    }

    // Explore has its own section instead of the size, generations and boundary settings
    const exploreSection = document.getElementById('explore-section');
    const simParamsSection = document.getElementById('sim-params-section');
    if (exploreSection) exploreSection.style.display = mode === 'explore' ? '' : 'none';
    if (simParamsSection) simParamsSection.style.display = mode === 'explore' ? 'none' : '';
    if (mode === 'explore') {
      if (rulesSection) rulesSection.style.display = '';
      if (seedSection) seedSection.style.display = '';
      if (boundaryRulesSection) boundaryRulesSection.style.display = 'none';
      if (sandpileSection) sandpileSection.style.display = 'none';
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
      if (modalShapeSelect) {
        Array.from(modalShapeSelect.options).forEach(opt => {
          opt.style.display = '';
        });
      }
      return;
    }
    
    if (mode === 'gameOfLife') {
      // Show rules section
      if (rulesSection) rulesSection.style.display = '';
      // Show boundary rules section
      if (boundaryRulesSection) boundaryRulesSection.style.display = '';
      // Show seed section
      if (seedSection) seedSection.style.display = '';
      // Show size controls
      const simSizeRow = document.getElementById('sim-size-row');
      if (simSizeRow) simSizeRow.style.display = '';
      if (simSizeLabel) simSizeLabel.style.display = '';
      if (simSizeInput) {
        simSizeInput.style.display = '';
        // Restore saved value or use default
        const savedSize = state.modeValues.gameOfLife?.size;
        simSizeInput.value = savedSize || '50';
      }
      // Restore saved generations or use default
      if (simGenerationsInput) {
        const savedGens = state.modeValues.gameOfLife?.generations;
        const gens = savedGens || 100;
        // Cap at 100 for Game of Life
        simGenerationsInput.value = Math.min(100, Math.max(1, gens));
        simGenerationsInput.max = '100';
      }
      // Update generations range hint for Game of Life mode
      const simGenerationsRangeText = document.getElementById('sim-generations-range-text');
      if (simGenerationsRangeText) simGenerationsRangeText.textContent = '1 - 100';
      // Show size range hint for Game of Life mode
      const simSizeRange = document.getElementById('sim-size-range');
      if (simSizeRange) simSizeRange.style.display = 'flex';
      // Show grid wrapping controls for Game of Life mode
      if (gridWrappingLabel) gridWrappingLabel.style.display = '';
      if (gridWrappingCheckbox) gridWrappingCheckbox.style.display = '';
      // Hide 2D toggle for Game of Life mode
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
      // Hide sandpile section for Game of Life mode
      if (sandpileSection) sandpileSection.style.display = 'none';
      // Show all shape options
      if (modalShapeSelect) {
        Array.from(modalShapeSelect.options).forEach(opt => {
          opt.style.display = '';
        });
        // Set default shape to cube for Game of Life if not already set
        const currentShape = pendingShapeKey || state.shapeKey;
        if (!currentShape || currentShape === 'rule30') {
          modalShapeSelect.value = 'cube';
          pendingShapeKey = 'cube';
          // Trigger change handler to update labels and inputs
          if (modalShapeSelect.onchange) {
            const event = new Event('change', { bubbles: true });
            Object.defineProperty(event, 'target', { value: modalShapeSelect, enumerable: true });
            modalShapeSelect.onchange(event);
          }
        } else {
          // Restore the current shape selection
          modalShapeSelect.value = currentShape;
        }
      }
    } else if (mode === 'sineWave') {
      // Hide rules section for Sine Wave mode
      if (rulesSection) rulesSection.style.display = 'none';
      // Hide boundary rules section for Sine Wave mode
      if (boundaryRulesSection) boundaryRulesSection.style.display = 'none';
      // Hide seed section for Sine Wave mode
      if (seedSection) seedSection.style.display = 'none';
      // Show size controls for Sine Wave (size affects wave resolution)
      const simSizeRow = document.getElementById('sim-size-row');
      if (simSizeRow) simSizeRow.style.display = '';
      if (simSizeLabel) simSizeLabel.style.display = '';
      if (simSizeInput) {
        simSizeInput.style.display = '';
        // Restore saved value or use default
        const savedSize = state.modeValues.sineWave?.size;
        simSizeInput.value = savedSize || '50';
      }
      // Restore saved generations or use default
      if (simGenerationsInput) {
        const savedGens = state.modeValues.sineWave?.generations;
        const gens = savedGens || 100;
        // Cap at 100 for Sine Wave
        simGenerationsInput.value = Math.min(100, Math.max(1, gens));
        simGenerationsInput.max = '100';
      }
      // Update generations range hint for Sine Wave mode
      const simGenerationsRangeText = document.getElementById('sim-generations-range-text');
      if (simGenerationsRangeText) simGenerationsRangeText.textContent = '1 - 100';
      // Show size range hint for Sine Wave mode
      const simSizeRange = document.getElementById('sim-size-range');
      if (simSizeRange) simSizeRange.style.display = 'flex';
      // Hide grid wrapping controls for Sine Wave mode
      if (gridWrappingLabel) gridWrappingLabel.style.display = 'none';
      if (gridWrappingCheckbox) gridWrappingCheckbox.style.display = 'none';
      // Hide 2D toggle for Sine Wave mode
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
      // Hide sandpile section for Sine Wave mode
      if (sandpileSection) sandpileSection.style.display = 'none';
      // Hide shape select for Sine Wave mode
      if (modalShapeSelect) {
        Array.from(modalShapeSelect.options).forEach(opt => {
          opt.style.display = 'none';
        });
      }
    } else if (mode === 'rule30') {
      // Hide rules section for Rule 30 mode
      if (rulesSection) rulesSection.style.display = 'none';
      // Hide boundary rules section for Rule 30 mode
      if (boundaryRulesSection) boundaryRulesSection.style.display = 'none';
      // Hide seed section for Rule 30 mode
      if (seedSection) seedSection.style.display = 'none';
      // Restore saved generations or use default
      if (simGenerationsInput) {
        const savedGens = state.modeValues.rule30?.generations;
        const gens = savedGens || 100;
        // Cap at 100 for Rule 30
        simGenerationsInput.value = Math.min(100, Math.max(1, gens));
        simGenerationsInput.max = '100';
      }
      // Update generations range hint for Rule 30 mode
      const simGenerationsRangeText = document.getElementById('sim-generations-range-text');
      if (simGenerationsRangeText) simGenerationsRangeText.textContent = '1 - 100';
      // Hide size controls for Rule 30 mode (auto-calculated)
      const simSizeRow = document.getElementById('sim-size-row');
      if (simSizeRow) simSizeRow.style.display = 'none';
      if (simSizeLabel) simSizeLabel.style.display = 'none';
      if (simSizeInput) simSizeInput.style.display = 'none';
      // Hide size range hint for Rule 30 mode
      const simSizeRange = document.getElementById('sim-size-range');
      if (simSizeRange) simSizeRange.style.display = 'none';
      // Hide grid wrapping controls for Rule 30 mode
      if (gridWrappingLabel) gridWrappingLabel.style.display = 'none';
      if (gridWrappingCheckbox) gridWrappingCheckbox.style.display = 'none';
      // Show 2D checkbox for Rule 30
      if (rule302DToggleRow) rule302DToggleRow.style.display = '';
      // Initialize checkbox based on current state
      if (rule302DCheckbox) {
        rule302DCheckbox.checked = state.useRule30_2D || false;
        // Update size calculation when checkbox is initialized
        if (simGenerationsInput && simSizeInput) {
          const generations = Math.max(1, parseInt(simGenerationsInput.value) || 100);
          const calculatedSize = calculateRule30Size(generations, state.useRule30_2D ? 'rule30_2D' : 'rule30');
          simSizeInput.value = calculatedSize;
        }
      }
      // Only show rule30 shape option (though seed section is hidden anyway)
      if (modalShapeSelect) {
        Array.from(modalShapeSelect.options).forEach(opt => {
          if (opt.value === 'rule30') {
            opt.style.display = '';
          } else {
            opt.style.display = 'none';
          }
        });
        // Force selection to rule30
        if (modalShapeSelect.value !== 'rule30') {
          modalShapeSelect.value = 'rule30';
          pendingShapeKey = 'rule30';
        }
      }
      
      // Auto-calculate and update size based on generations and 2D checkbox
      if (simGenerationsInput && simSizeInput && rule302DCheckbox) {
        const updateSize = () => {
          const generations = Math.max(1, parseInt(simGenerationsInput.value) || state.sim_generations);
          const is2D = rule302DCheckbox.checked;
          const calculatedSize = calculateRule30Size(generations, is2D ? 'rule30_2D' : 'rule30');
          simSizeInput.value = calculatedSize;
        };
        updateSize();
        // Update size when checkbox changes (already handled in change listener above)
      }
      // Hide sandpile section for Rule 30 mode
      if (sandpileSection) sandpileSection.style.display = 'none';
    } else if (mode === 'sandpile') {
      // Hide rules section for Sandpile mode
      if (rulesSection) rulesSection.style.display = 'none';
      // Hide boundary rules section for Sandpile mode
      if (boundaryRulesSection) boundaryRulesSection.style.display = 'none';
      // Hide seed section for Sandpile mode
      if (seedSection) seedSection.style.display = 'none';
      // Show size controls for Sandpile mode
      const simSizeRow = document.getElementById('sim-size-row');
      if (simSizeRow) simSizeRow.style.display = '';
      if (simSizeLabel) simSizeLabel.style.display = '';
      if (simSizeInput) {
        simSizeInput.style.display = '';
        // Restore saved value or use default
        const savedSize = state.modeValues.sandpile?.size;
        simSizeInput.value = savedSize || '50';
      }
      // Restore saved generations or use default
      if (simGenerationsInput) {
        const savedGens = state.modeValues.sandpile?.generations;
        simGenerationsInput.value = savedGens || '1000';
        // Remove max limit for sandpile (can go above 100)
        simGenerationsInput.removeAttribute('max');
      }
      // Update generations range hint for Sandpile mode
      const simGenerationsRangeText = document.getElementById('sim-generations-range-text');
      if (simGenerationsRangeText) simGenerationsRangeText.textContent = '1 - 1000';
      // Show size range hint for Sandpile mode
      const simSizeRange = document.getElementById('sim-size-range');
      if (simSizeRange) simSizeRange.style.display = 'flex';
      // Show sandpile parameters section (only for sandpile mode)
      if (sandpileSection) sandpileSection.style.display = '';
      // Initialize sandpile parameter inputs from state
      const initialSandInput = document.getElementById('sandpile-initial-sand');
      if (initialSandInput && !initialSandInput.value) {
        initialSandInput.value = state.sandpileParams?.initialSand || 0;
      }
      // Threshold is fixed at 4, not user-adjustable
      // Hide grid wrapping controls for Sandpile mode (wrapping is handled in evolution)
      if (gridWrappingLabel) gridWrappingLabel.style.display = 'none';
      if (gridWrappingCheckbox) {
        gridWrappingCheckbox.style.display = 'none';
      }
      // Hide 2D toggle for Sandpile mode
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
      // Hide shape select for Sandpile mode
      if (modalShapeSelect) {
        Array.from(modalShapeSelect.options).forEach(opt => {
          opt.style.display = 'none';
        });
      }
    } else {
      // Hide 2D toggle for non-Rule 30 modes
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
      // Hide sandpile section for other modes
      if (sandpileSection) sandpileSection.style.display = 'none';
    }
  }
  
  // Listen for generations input changes
  if (simGenerationsInput) {
    const generationsChangeHandler = () => {
      const activeCard = document.querySelector('.mode-card.active');
      const selectedMode = activeCard ? activeCard.dataset.mode : 'gameOfLife';
      
      // Enforce max of 100 for Game of Life, Rule 30, and Sine Wave
      if (selectedMode === 'gameOfLife' || selectedMode === 'rule30' || selectedMode === 'sineWave') {
        const currentValue = parseInt(simGenerationsInput.value);
        if (!isNaN(currentValue) && currentValue > 100) {
          simGenerationsInput.value = '100';
        }
      }
      
      if (selectedMode === 'rule30' && rule302DCheckbox) {
        const generations = Math.max(1, Math.min(100, parseInt(simGenerationsInput.value) || state.sim_generations));
        const is2D = rule302DCheckbox.checked;
        const calculatedSize = calculateRule30Size(generations, is2D ? 'rule30_2D' : 'rule30');
        if (simSizeInput) {
          simSizeInput.value = calculatedSize;
        }
      } else if (selectedMode === 'sandpile') {
        const generations = Math.max(1, parseInt(simGenerationsInput.value) || state.sim_generations);
        // Auto-calculate size based on generations (sand spreads roughly as sqrt(generations))
        const calculatedSize = Math.max(20, Math.min(200, Math.ceil(Math.sqrt(generations) * 2.5)));
        if (simSizeInput) {
          simSizeInput.value = calculatedSize;
        }
      }
    };
    simGenerationsInput.addEventListener('input', generationsChangeHandler);
    simGenerationsInput.addEventListener('change', generationsChangeHandler);
    // Toggle change is handled in the click listener above
  }

  // Set initial UI state
  let modeChangeHandler = null;
  updateModeUI(currentMode);
  
  // Mode descriptions
  const modeDescriptions = {
    gameOfLife: 'A classic cellular automaton extended to three dimensions. Cells evolve based on the number of living neighbors, creating complex patterns of growth, stability, and decay in 3D space.',
    rule30: 'A one-dimensional cellular automaton that generates complex, seemingly random patterns from simple rules. Each cell\'s state depends on its left, center, and right neighbors, producing fractal-like structures.',
    sineWave: 'A continuous mathematical function visualized in discrete 3D space. Represents periodic oscillations and wave patterns, demonstrating how continuous phenomena can be sampled and displayed on a grid.',
    sandpile: 'The Abelian Sandpile Model, a self-organized criticality system. Sand grains accumulate and topple when reaching a threshold, creating cascading avalanches that exhibit power-law distributions and fractal patterns.',
    explore: 'Game of Life 3D in a world without walls. The pattern grows as far as it likes, for as long as you let it run, with no score and no clock. Pause, step and restart it, try other rules, or load a seed file, and set a memory limit or an arena.'
  };
  
  // Function to update mode description
  const modeDescriptionEl = document.getElementById('mode-description');
  function updateModeDescription(mode) {
    if (modeDescriptionEl) {
      modeDescriptionEl.innerHTML = `<p>${modeDescriptions[mode] || modeDescriptions.gameOfLife}</p>`;
    }
  }
  
  // Handle mode card clicks
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedMode = card.dataset.mode;
      
      // Update active state
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      // Update description
      updateModeDescription(selectedMode);
      // Explore keeps its own rules
      fillRuleInputs(selectedMode);
      showExploreError(null);
      
      // Update UI based on selected mode
      updateModeUI(selectedMode);
    });
  });
  
  // Set initial description
  updateModeDescription(currentMode);
  
  // Store mode change handler for cleanup (for compatibility)
  modeChangeHandler = () => {
    const activeCard = document.querySelector('.mode-card.active');
    if (activeCard) {
      updateModeUI(activeCard.dataset.mode);
    }
  };
  
  // Function to update labels based on selected shape
  function updateShapeLabels(shapeKey) {
    const densityLabel = document.getElementById('shape-density-label');
    const densityLabelText = document.getElementById('shape-density-label-text');
    const sizeLabelText = document.getElementById('shape-size-label-text');
    const regionSizeLabelText = document.getElementById('shape-region-size-label-text');
    const sizeInfoIcon = sizeLabel?.querySelector('.info-icon');
    const densityInfoIcon = densityLabel?.querySelector('.info-icon');
    const regionSizeInfoIcon = regionSizeLabel?.querySelector('.info-icon');
    const maxSim = simSizeInput ? Math.max(1, parseInt(simSizeInput.value) || state.sim_size) : state.sim_size;
    
    if (shapeKey === 'perlin') {
      // Perlin noise labels
      if (sizeLabelText) {
        sizeLabelText.textContent = `Noise Detail`;
      }
      if (sizeInfoIcon) {
        sizeInfoIcon.setAttribute('data-tooltip', 'Controls noise frequency detail. Lower values (1-10) create smoother, larger patterns. Medium values (10-30) create moderate detail. Higher values (30-100) create fine-grained, detailed patterns.');
      }
      // Update range hint
      const shapeSizeRangeHint = document.getElementById('shape-size-range');
      if (shapeSizeRangeHint) {
        shapeSizeRangeHint.textContent = `1 - 100`;
      }
      if (densityLabelText) {
        densityLabelText.textContent = `Fill Amount`;
      }
      if (densityInfoIcon) {
        densityInfoIcon.setAttribute('data-tooltip', 'Controls how many cells are alive. 0 = few cells, 1 = many cells. Higher values create denser patterns.');
      }
      // Show region size input for Perlin
      if (regionSizeRow) {
        regionSizeRow.classList.remove('hidden');
        regionSizeRow.style.display = '';
      }
      if (regionSizeLabelText) {
        regionSizeLabelText.textContent = `Region Size (max ${maxSim})`;
      }
      if (regionSizeInfoIcon) {
        regionSizeInfoIcon.setAttribute('data-tooltip', 'Size of the centered region where noise is generated. Smaller values create patterns in the center only.');
      }
      if (regionSizeInput) {
        regionSizeInput.max = `${maxSim}`;
      }
    } else if (shapeKey === 'worley') {
      // Worley noise labels
      if (sizeLabelText) {
        sizeLabelText.textContent = `Feature Points`;
      }
      if (sizeInfoIcon) {
        sizeInfoIcon.setAttribute('data-tooltip', 'Approximate number of feature points (cell centers) that generate the pattern. Uses cube root, so values like 8 or 27 work best. More points create more complex cellular structures.');
      }
      // Update range hint
      const shapeSizeRangeHint = document.getElementById('shape-size-range');
      if (shapeSizeRangeHint) {
        shapeSizeRangeHint.textContent = `1 - 50`;
      }
      if (densityLabelText) {
        densityLabelText.textContent = `Activation Distance`;
      }
      if (densityInfoIcon) {
        densityInfoIcon.setAttribute('data-tooltip', 'How far from feature points cells become alive. Lower values = cells only near feature points. Higher values = cells fill more space.');
      }
      // Show region size input for Worley
      if (regionSizeRow) {
        regionSizeRow.classList.remove('hidden');
        regionSizeRow.style.display = '';
      }
      if (regionSizeLabelText) {
        regionSizeLabelText.textContent = `Region Size (max ${maxSim})`;
      }
      if (regionSizeInfoIcon) {
        regionSizeInfoIcon.setAttribute('data-tooltip', 'Size of the centered region where noise is generated. Smaller values create patterns in the center only.');
      }
      if (regionSizeInput) {
        regionSizeInput.max = `${maxSim}`;
      }
    } else {
      // Standard shape labels (cube, tetrahedron, octahedron)
      if (sizeLabelText) {
        sizeLabelText.textContent = `Size`;
      }
      if (sizeInfoIcon) {
        sizeInfoIcon.setAttribute('data-tooltip', 'Size of the shape in grid cells.');
      }
      // Update range hint - will be updated by updateShapeSizeMax
      const shapeSizeRangeHint = document.getElementById('shape-size-range');
      if (shapeSizeRangeHint) {
        shapeSizeRangeHint.textContent = `1 - ${maxSim}`;
      }
      if (densityLabelText) {
        densityLabelText.textContent = 'Density';
      }
      if (densityInfoIcon) {
        densityInfoIcon.setAttribute('data-tooltip', 'Probability that each cell in the shape is alive. 1 = all cells filled, 0 = no cells.');
      }
      // Hide region size input
      if (regionSizeRow) {
        regionSizeRow.classList.add('hidden');
        regionSizeRow.style.display = 'none';
      }
    }
  }

  // Keep shape size max synced to modal Simulation Size
  function updateShapeSizeMax() {
    const maxSim = simSizeInput ? Math.max(1, parseInt(simSizeInput.value) || state.sim_size) : state.sim_size;
    const currKey = pendingShapeKey || state.shapeKey;
    
    // Perlin noise detail has a fixed max of 100 (maps to noiseScale 0.5)
    // Worley feature points has a fixed max of 50 (creates 3-4 cells per dimension)
    // Other shapes use maxSim
    let maxVal;
    if (currKey === 'perlin') {
      sizeInput.max = '100';
      maxVal = 100;
    } else if (currKey === 'worley') {
      sizeInput.max = '50';
      maxVal = 50;
    } else {
      sizeInput.max = `${maxSim}`;
      maxVal = maxSim;
    }
    
    // Update range hint for shape size
    const shapeSizeRangeHint = document.getElementById('shape-size-range');
    if (shapeSizeRangeHint) {
      shapeSizeRangeHint.textContent = `1 - ${maxVal}`;
    }
    
    if (regionSizeInput) {
      regionSizeInput.max = `${maxSim}`;
      const currRegionSize = Math.max(1, parseInt(regionSizeInput.value || '1'));
      if (currRegionSize > maxSim) regionSizeInput.value = `${maxSim}`;
      
      // Update range hint for region size
      const regionSizeRangeHint = document.getElementById('shape-region-size-range');
      if (regionSizeRangeHint) {
        regionSizeRangeHint.textContent = `1 - ${maxSim}`;
      }
    }
    
    // Update labels with current max
    updateShapeLabels(currKey);
    const curr = Math.max(1, parseInt(sizeInput.value || '1'));
    if (curr > maxVal) sizeInput.value = `${maxVal}`;
  }
  updateShapeSizeMax();
  
  // Initialize rules inputs (a seed file loaded for Explore brings its own rules)
  pendingExploreSeed = state.explore.seedFile;
  fillRuleInputs(currentMode);

  // ---- Explore's section ----
  const exploreMemory = document.getElementById('explore-memory');
  const exploreArenaCheckbox = document.getElementById('explore-arena-checkbox');
  const exploreArenaRow = document.getElementById('explore-arena-row');
  const exploreArenaSize = document.getElementById('explore-arena-size');
  const exploreLoadSeed = document.getElementById('explore-load-seed');
  const exploreClearSeed = document.getElementById('explore-clear-seed');
  const exploreSeedFile = document.getElementById('explore-seed-file');
  const exploreSeedStatus = document.getElementById('explore-seed-status');
  const explorePreset = document.getElementById('explore-preset');

  if (exploreMemory) exploreMemory.value = `${state.explore.memoryMB}`;
  if (exploreArenaCheckbox) {
    exploreArenaCheckbox.checked = state.explore.arena !== null;
    exploreArenaCheckbox.onchange = () => {
      if (exploreArenaRow) exploreArenaRow.style.display = exploreArenaCheckbox.checked ? '' : 'none';
    };
    exploreArenaCheckbox.onchange();
  }
  if (exploreArenaSize) exploreArenaSize.value = `${state.explore.arena ?? state.explore.arenaSize}`;
  if (explorePreset) {
    if (!explorePreset.options.length) {
      for (const preset of PRESETS) {
        const option = document.createElement('option');
        option.value = preset.id;
        option.textContent = preset.name;
        explorePreset.append(option);
      }
    }
    explorePreset.onchange = () => choosePreset(explorePreset.value);
  }
  const exploreSeedCustom = document.getElementById('explore-seed-custom');
  const exploreSeedPreset = document.getElementById('explore-seed-preset');
  if (exploreSeedCustom) {
    exploreSeedCustom.onclick = () => {
      if (pendingExploreSeed?.preset) {
        pendingExploreSeed = null;
        fillRuleInputs('explore');
      }
      showExploreError(null);
      showExploreSeedStatus();
    };
  }
  if (exploreSeedPreset) {
    exploreSeedPreset.onclick = () => {
      if (!pendingExploreSeed?.preset) choosePreset(explorePreset?.value || PRESETS[0].id);
    };
  }
  /** A preset works like a seed file: its cells and rules replace the shape and rules. */
  function choosePreset(id) {
    const preset = presetById(id);
    if (!preset) return;
    pendingExploreSeed = { name: preset.name, rules: preset.rules, cells: preset.cells, preset: preset.id };
    if (ruleBirth) ruleBirth.value = stringifyRule(preset.rules.birth);
    if (ruleSurvival) ruleSurvival.value = stringifyRule(preset.rules.survival);
    showExploreError(null);
    showExploreSeedStatus();
  }
  showExploreSeedStatus();
  showExploreError(null);

  if (exploreLoadSeed && exploreSeedFile) {
    exploreLoadSeed.onclick = () => exploreSeedFile.click();
    exploreSeedFile.onchange = async () => {
      const file = exploreSeedFile.files?.[0];
      exploreSeedFile.value = ''; // so loading the same file again still fires
      if (!file) return;
      try {
        if (file.size > MAX_SEED_FILE_BYTES) throw new Error(`it is larger than ${MAX_SEED_FILE_BYTES / 2 ** 20} MB.`);
        const loaded = await readSeedOrSave(await file.text());
        const { rules, cells } = loaded;
        // Replaces a preset. A saved generation brings its first seed and generation too
        pendingExploreSeed = loaded.kind === 'generation'
          ? { name: file.name, rules, cells, seed: loaded.seed, from: loaded.from, arena: loaded.arena }
          : { name: file.name, rules, cells };
        if (ruleBirth) ruleBirth.value = stringifyRule(rules.birth);
        if (ruleSurvival) ruleSurvival.value = stringifyRule(rules.survival);
        showExploreError(null);
      } catch (err) {
        showExploreError(`${file.name} can't be used: ${err.message}`);
      }
      showExploreSeedStatus();
    };
  }
  if (exploreClearSeed) {
    exploreClearSeed.onclick = () => {
      pendingExploreSeed = null;
      fillRuleInputs('explore');
      showExploreSeedStatus();
    };
  }
  function showExploreSeedStatus() {
    if (exploreSeedStatus) {
      const cells = pendingExploreSeed && `${(pendingExploreSeed.cells.length / 3).toLocaleString('en')} cells`;
      exploreSeedStatus.textContent = !pendingExploreSeed ? 'Using the shape.'
        : pendingExploreSeed.preset ? `Using the preset ${pendingExploreSeed.name}: ${cells}.`
          : pendingExploreSeed.from !== undefined
            ? `Using ${pendingExploreSeed.name}: generation ${pendingExploreSeed.from.toLocaleString('en')} of a saved run, ${cells}, with its own rules and ${pendingExploreSeed.arena ? `${pendingExploreSeed.arena}³ arena` : 'no arena'}. The run carries on from generation ${pendingExploreSeed.from.toLocaleString('en')}.`
            : `Using ${pendingExploreSeed.name}: ${cells}.`;
    }
    // A saved generation carries on under its own arena, which the arena fields show but can't change
    const saved = pendingExploreSeed?.from !== undefined;
    if (exploreArenaCheckbox) {
      exploreArenaCheckbox.disabled = saved;
      if (saved) {
        exploreArenaCheckbox.checked = pendingExploreSeed.arena !== null;
        if (pendingExploreSeed.arena && exploreArenaSize) exploreArenaSize.value = `${pendingExploreSeed.arena}`;
        exploreArenaCheckbox.onchange?.();
      }
    }
    if (exploreArenaSize) exploreArenaSize.disabled = saved;
    if (exploreClearSeed) exploreClearSeed.hidden = !pendingExploreSeed || Boolean(pendingExploreSeed.preset);
    syncExploreSeedKind();
  }

  /** Explore's settings from the dialog. Throws an Error saying what's wrong. */
  function buildExploreConfig() {
    const saved = pendingExploreSeed?.from !== undefined ? pendingExploreSeed : null;
    const rules = saved ? saved.rules : parseRules(ruleBirth?.value, ruleSurvival?.value);
    const memoryMB = Number(exploreMemory?.value);
    if (!Number.isInteger(memoryMB) || memoryMB < 64 || memoryMB > 16384) {
      throw new Error('The memory limit must be a whole number of MB, from 64 to 16384.');
    }
    let arena = null;
    if (saved) {
      arena = saved.arena;
    } else if (exploreArenaCheckbox?.checked) {
      arena = Number(exploreArenaSize?.value);
      if (!Number.isInteger(arena) || arena < 8 || arena > 1024) {
        throw new Error('The arena size must be a whole number of cells, from 8 to 1024.');
      }
    }
    let cells;
    let label;
    let shape = null; // the shape settings to remember, when the seed is a shape
    if (pendingExploreSeed) {
      ({ cells } = pendingExploreSeed);
      label = pendingExploreSeed.name;
    } else {
      const key = modalShapeSelect?.value || state.shapeKey;
      const size = Number(sizeInput.value);
      const density = Number(densityInput.value);
      const noise = key === 'perlin' || key === 'worley';
      const regionSize = noise ? Number(regionSizeInput?.value) || 0 : 0;
      if (!Number.isInteger(size) || size < 1 || size > MAX_SHAPE_SIZE) {
        throw new Error(`In Explore, the seed's size must be a whole number from 1 to ${MAX_SHAPE_SIZE}.`);
      }
      if (!(density >= 0 && density <= 1)) throw new Error("The seed's density must be from 0 to 1.");
      if (!Number.isInteger(regionSize) || regionSize < 0 || regionSize > 2 * MAX_SHAPE_SIZE) {
        throw new Error(`In Explore, the region size must be a whole number up to ${2 * MAX_SHAPE_SIZE}.`);
      }
      const shapes = {
        perlin: () => perlinShape(size, density, regionSize || null),
        worley: () => worleyShape(size, density, regionSize || null),
        cube: () => cubeOfSide(size, density),
        tetrahedron: () => tetrahedronShape(size, density),
        octahedron: () => octahedronShape(size, density),
      };
      if (!shapes[key]) throw new Error('Pick a shape for the seed.');
      cells = shapeSeed(shapes[key](), size, regionSize);
      label = key;
      shape = { key, params: noise ? { size, density, regionSize } : { size, density } };
    }
    if (!cells.length) {
      throw new Error(saved ? 'This saved generation has no live cells, so there is nothing to carry on.' : 'The seed has no live cells: raise its density or its size.');
    }
    const box = arenaBox(arena);
    if (box) {
      for (let i = 0; i < cells.length; i++) {
        const a = i % 3;
        if (cells[i] < box.min[a] || cells[i] > box.max[a]) {
          throw new Error(`The seed doesn't fit inside a ${arena}³ arena: make the arena bigger or the seed smaller.`);
        }
      }
    }
    // A saved generation: `cells` is generation `from`, and `seed` the run's first seed
    if (saved) return { rules, cells, memoryMB, arena, label, shape, seed: saved.seed, from: saved.from };
    return { rules, cells, memoryMB, arena, label, shape };
  }
  
  // Initialize boundary rules inputs
  const boundaryCornerBirth = document.getElementById('boundary-corner-birth');
  const boundaryCornerSurvival = document.getElementById('boundary-corner-survival');
  const boundaryEdgeBirth = document.getElementById('boundary-edge-birth');
  const boundaryEdgeSurvival = document.getElementById('boundary-edge-survival');
  const boundaryFaceBirth = document.getElementById('boundary-face-birth');
  const boundaryFaceSurvival = document.getElementById('boundary-face-survival');
  
  if (boundaryCornerBirth) {
    boundaryCornerBirth.value = stringifyRule(state.boundaryRules?.corner?.birth ?? [2, 3]);
  }
  if (boundaryCornerSurvival) {
    boundaryCornerSurvival.value = stringifyRule(state.boundaryRules?.corner?.survival ?? [2, 3, 4]);
  }
  if (boundaryEdgeBirth) {
    boundaryEdgeBirth.value = stringifyRule(state.boundaryRules?.edgeTwoFaces?.birth ?? [4]);
  }
  if (boundaryEdgeSurvival) {
    boundaryEdgeSurvival.value = stringifyRule(state.boundaryRules?.edgeTwoFaces?.survival ?? [2, 3, 4, 5, 6]);
  }
  if (boundaryFaceBirth) {
    boundaryFaceBirth.value = stringifyRule(state.boundaryRules?.face?.birth ?? [6]);
  }
  if (boundaryFaceSurvival) {
    boundaryFaceSurvival.value = stringifyRule(state.boundaryRules?.face?.survival ?? [3, 4, 5, 6, 7, 8, 9]);
  }
  
  // Add handler for grid wrapping checkbox to show/hide boundary rules
  const boundaryRulesInputs = document.getElementById('boundary-rules-inputs');
  
  function updateBoundaryRulesVisibility() {
    if (boundaryRulesInputs && gridWrappingCheckbox) {
      // Show boundary rules when wrapping is OFF (checkbox unchecked)
      const shouldShow = !gridWrappingCheckbox.checked;
      boundaryRulesInputs.style.display = shouldShow ? 'block' : 'none';
      // Don't hide the entire section - it should always be visible in Game of Life mode
      // The section visibility is controlled by updateModeUI
    }
  }
  
  if (gridWrappingCheckbox) {
    // Initialize visibility based on current state
    updateBoundaryRulesVisibility();
    // Update visibility when checkbox changes
    gridWrappingCheckbox.addEventListener('change', updateBoundaryRulesVisibility);
  }
  
  // Prefer params from state; fall back to current displays if present; else final default
  const sizeDisplayEl = document.getElementById('shape-size-value');
  const densityDisplayEl = document.getElementById('shape-density-value');
  const displaySize = sizeDisplayEl ? parseInt(sizeDisplayEl.textContent) : NaN;
  const displayDensity = densityDisplayEl ? parseFloat(densityDisplayEl.textContent) : NaN;
  
  // For Perlin and Worley, ignore display density (always use 0.3 in modal)
  // For other shapes, use display density if available
  const params = state.shapeParams?.[key]
    || (
      (key !== 'perlin' && key !== 'worley') && Number.isFinite(displaySize) && Number.isFinite(displayDensity)
        ? { size: displaySize, density: displayDensity }
        : { size: Math.floor(state.sim_size / 2), density: 0.3 }
    );
  const initMaxSim = simSizeInput ? Math.max(1, parseInt(simSizeInput.value) || state.sim_size) : state.sim_size;
  // Perlin noise detail has a max of 100, Worley feature points has max of 50, other shapes use maxSim
  let maxForShape;
  if (key === 'perlin') {
    maxForShape = 100;
  } else if (key === 'worley') {
    maxForShape = 50;
  } else {
    maxForShape = initMaxSim;
  }
  const initSize = Math.min(maxForShape, Math.max(1, parseInt(params.size)));
  
  // Set density - use saved value if available, otherwise default to 0.3
  let initDensity;
  if (key === 'perlin' || key === 'worley') {
    // For Perlin and Worley, use saved value from state.shapeParams if it exists, otherwise default to 0.3
    if (params && params.density !== undefined && params.density !== null) {
      const parsedDensity = parseFloat(params.density);
      if (!isNaN(parsedDensity) && parsedDensity >= 0 && parsedDensity <= 1) {
        initDensity = parsedDensity;
      } else {
        initDensity = 0.3;
      }
    } else {
      initDensity = 0.3;
    }
  } else {
    // For other shapes, use saved value or default to 0.3
    initDensity = Math.min(1, Math.max(0, parseFloat(params.density || 0.3)));
  }
  
  sizeInput.value = `${initSize}`;
  densityInput.value = `${initDensity.toFixed(2)}`;
  
  // Update labels first to ensure inputs are visible
  if (modalShapeSelect) {
    modalShapeSelect.value = key;
    updateShapeLabels(key);
    modalShapeSelect.onchange = (e) => {
      pendingShapeKey = e.target.value;
      const newShapeKey = e.target.value;
      updateShapeLabels(newShapeKey);
      
      // Hide region size if not Perlin or Worley
      if (newShapeKey !== 'perlin' && newShapeKey !== 'worley' && regionSizeRow) {
        regionSizeRow.classList.add('hidden');
        regionSizeRow.style.display = 'none';
      }
      // Update density when switching shapes - use saved value or default to 0.3
      if (densityInput) {
        const newKey = e.target.value;
        const newParams = state.shapeParams?.[newKey] || {};
        let newDensity;
        if (newKey === 'perlin' || newKey === 'worley') {
          // For Perlin and Worley, use saved value or default to 0.3
          if (newParams.density !== undefined && newParams.density !== null) {
            const parsedDensity = parseFloat(newParams.density);
            if (!isNaN(parsedDensity) && parsedDensity >= 0 && parsedDensity <= 1) {
              newDensity = parsedDensity;
            } else {
              newDensity = 0.3;
            }
          } else {
            newDensity = 0.3;
          }
        } else {
          // For other shapes, use saved value or default to 0.3
          newDensity = Math.min(1, Math.max(0, parseFloat(newParams.density || 0.3)));
        }
        densityInput.value = `${newDensity.toFixed(2)}`;
      }
      // Also update region size when switching shapes
      if ((e.target.value === 'perlin' || e.target.value === 'worley') && regionSizeInput) {
        const maxSim = simSizeInput ? Math.max(1, parseInt(simSizeInput.value) || state.sim_size) : state.sim_size;
        const newParams = state.shapeParams?.[e.target.value] || {};
        let initRegionSize = 25; // Default to 25
        if (newParams.regionSize !== undefined && newParams.regionSize !== null) {
          const parsedRegionSize = parseInt(newParams.regionSize);
          if (!isNaN(parsedRegionSize) && parsedRegionSize > 0) {
            initRegionSize = Math.min(maxSim, Math.max(1, parsedRegionSize));
          }
        }
        initRegionSize = Math.min(maxSim, Math.max(1, initRegionSize));
        regionSizeInput.value = `${initRegionSize}`;
      }
    };
  } else {
    updateShapeLabels(key);
  }
  
  // Initialize region size input for Perlin and Worley
  // This must happen after updateShapeLabels to ensure the input is visible
  // Only show and initialize if the current shape is Perlin or Worley
  if (key === 'perlin' || key === 'worley') {
    if (regionSizeRow) {
      regionSizeRow.classList.remove('hidden');
      regionSizeRow.style.display = '';
    }
    if (regionSizeInput) {
      // Use params.regionSize if it exists and is valid, otherwise default to 25
      let initRegionSize = 25; // Default to 25
      if (params && params.regionSize !== undefined && params.regionSize !== null) {
        const parsedRegionSize = parseInt(params.regionSize);
        if (!isNaN(parsedRegionSize) && parsedRegionSize > 0) {
          initRegionSize = Math.min(initMaxSim, Math.max(1, parsedRegionSize));
        }
      }
      // Ensure it doesn't exceed max and is at least 1
      initRegionSize = Math.min(initMaxSim, Math.max(1, initRegionSize));
      // Set the value - this should work now that labels are updated and input is visible
      regionSizeInput.value = `${initRegionSize}`;
    }
  } else {
    // Hide region size for non-Perlin/Worley shapes
    if (regionSizeRow) {
      regionSizeRow.classList.add('hidden');
      regionSizeRow.style.display = 'none';
    }
  }

  if (simSizeInput) simSizeInput.addEventListener('input', updateShapeSizeMax);

  modal.classList.remove('hidden');

  const onCancel = () => {
    modal.classList.add('hidden');
    cleanup();
    // Revert select to current active shape
    const shapeSelect = document.getElementById('shape-select');
    if (shapeSelect) shapeSelect.value = state.shapeKey;
    pendingShapeKey = null;
  };

  const onConfirm = async () => {
    // Get selected simulation mode from active card
    const activeCard = document.querySelector('.mode-card.active');
    const selectedMode = activeCard ? activeCard.dataset.mode : 'gameOfLife';

    // Explore streams from a Worker instead of precomputing (src/explore/)
    if (selectedMode === 'explore') {
      let config;
      try {
        config = buildExploreConfig();
      } catch (err) {
        showExploreError(err.message); // the dialog stays open
        return;
      }
      state.simulationMode = 'explore';
      state.useRule30 = false;
      state.useRule30_2D = false;
      state.useSineWave = false;
      state.useSandpile = false;
      state.explore = {
        rules: config.rules,
        memoryMB: config.memoryMB,
        arena: config.arena,
        arenaSize: Number(exploreArenaSize?.value) || state.explore.arenaSize,
        seedFile: pendingExploreSeed,
      };
      // The seed's shape settings, so the dialog opens with them next time
      if (config.shape) {
        state.shapeKey = config.shape.key;
        state.shapeParams[config.shape.key] = config.shape.params;
      }
      modal.classList.add('hidden');
      cleanup();
      pendingShapeKey = null;
      resetControlsUI();
      initControls(); // the title and the GPU toggle follow the mode
      startExplore(config);
      return;
    }

    state.simulationMode = selectedMode;
    updateSimulationModeTitle();

    // Set Rule 30 and Sine Wave flags based on mode
    if (selectedMode === 'rule30') {
      // Read 2D checkbox value
      const is2D = rule302DCheckbox ? rule302DCheckbox.checked : false;
      state.useRule30 = !is2D;
      state.useRule30_2D = is2D;
      state.useSineWave = false;
      state.useSandpile = false;
      state.shapeKey = 'rule30';
      // Auto-calculate size for Rule 30 based on generations and 2D mode
      const generations = simGenerationsInput ? Math.max(1, parseInt(simGenerationsInput.value)) : state.sim_generations;
      const calculatedSize = calculateRule30Size(generations, is2D ? 'rule30_2D' : 'rule30');
      if (simSizeInput) {
        simSizeInput.value = calculatedSize;
      }
    } else if (selectedMode === 'sineWave') {
      state.useRule30 = false;
      state.useRule30_2D = false;
      state.useSineWave = true;
      state.useSandpile = false;
    } else if (selectedMode === 'sandpile') {
      state.useRule30 = false;
      state.useRule30_2D = false;
      state.useSineWave = false;
      state.useSandpile = true;
      // Read sandpile parameters
      const initialSandInput = document.getElementById('sandpile-initial-sand');
      
      if (initialSandInput) {
        state.sandpileParams.initialSand = Math.max(0, Math.min(255, parseInt(initialSandInput.value) || 0));
      }
      // Threshold is fixed at 4, not user-adjustable
      state.sandpileParams.threshold = 4;
    } else {
      state.useRule30 = false;
      state.useRule30_2D = false;
      state.useSineWave = false;
      state.useSandpile = false;
    }
    
    // For Game of Life, ensure defaults are set
    if (selectedMode === 'gameOfLife') {
      // Set default shape to cube if not set
      if (modalShapeSelect && (!modalShapeSelect.value || modalShapeSelect.value === 'rule30')) {
        modalShapeSelect.value = 'cube';
        pendingShapeKey = 'cube';
      }
    }
    
    // Store values for current mode before updating
    if (simSizeInput && simSizeInput.style.display !== 'none') {
      const currentSize = parseInt(simSizeInput.value);
      if (!isNaN(currentSize) && currentSize > 0) {
        if (!state.modeValues[selectedMode]) {
          state.modeValues[selectedMode] = {};
        }
        state.modeValues[selectedMode].size = currentSize;
      }
    }
    if (simGenerationsInput) {
      const currentGens = parseInt(simGenerationsInput.value);
      if (!isNaN(currentGens) && currentGens > 0) {
        if (!state.modeValues[selectedMode]) {
          state.modeValues[selectedMode] = {};
        }
        state.modeValues[selectedMode].generations = currentGens;
      }
    }
    
    // Compute proposed sim size/gens first so clamping uses new size
    const newSimSize = simSizeInput ? Math.max(1, Math.min(200, parseInt(simSizeInput.value))) : state.sim_size;
    // Cap generations at 100 for Game of Life mode
    let newSimGenerations = simGenerationsInput ? Math.max(1, parseInt(simGenerationsInput.value)) : state.sim_generations;
    if (selectedMode === 'gameOfLife') {
      newSimGenerations = Math.min(100, Math.max(1, newSimGenerations));
    }
    const newGridWrapping = gridWrappingCheckbox ? gridWrappingCheckbox.checked : state.gridWrapping ?? true;
    const size = Math.min(newSimSize, Math.max(1, parseInt(sizeInput.value)));
    const density = Math.min(1, Math.max(0, parseFloat(densityInput.value)));
    if (newSimSize !== state.sim_size) {
      state.sim_size = newSimSize;
    }
    if (newSimGenerations !== state.sim_generations) {
      state.sim_generations = newSimGenerations;
    }
    if (newGridWrapping !== state.gridWrapping) {
      state.gridWrapping = newGridWrapping;
    }

    // Update shape functions with chosen params (only for Game of Life mode)
    if (selectedMode === 'gameOfLife') {
      if (pendingShapeKey === 'perlin') {
        const regionSize = regionSizeInput ? Math.min(newSimSize, Math.max(1, parseInt(regionSizeInput.value))) : null;
        state.shapes.perlin = (await import('./shapeGenerators.js')).perlinShape(size, density, regionSize);
      } else if (pendingShapeKey === 'worley') {
        const regionSize = regionSizeInput ? Math.min(newSimSize, Math.max(1, parseInt(regionSizeInput.value))) : null;
        state.shapes.worley = (await import('./shapeGenerators.js')).worleyShape(size, density, regionSize);
      } else if (pendingShapeKey === 'cube') {
        const half = Math.max(1, Math.floor(size / 2));
        state.shapes.cube = (await import('./shapeGenerators.js')).cubeShape(half, density);
      } else if (pendingShapeKey === 'tetrahedron') {
        state.shapes.tetrahedron = (await import('./shapeGenerators.js')).tetrahedronShape(size, density);
      } else if (pendingShapeKey === 'octahedron') {
        state.shapes.octahedron = (await import('./shapeGenerators.js')).octahedronShape(size, density);
      }
      state.shapeKey = pendingShapeKey || state.shapeKey;
    }

    state.reset();
    
    // Persist chosen params (only for Game of Life)
    if (selectedMode === 'gameOfLife') {
      if (!state.shapeParams) state.shapeParams = {};
      if ((pendingShapeKey === 'perlin' || pendingShapeKey === 'worley') && regionSizeInput) {
        const regionSize = Math.min(newSimSize, Math.max(1, parseInt(regionSizeInput.value)));
        state.shapeParams[state.shapeKey] = { size, density, regionSize };
      } else {
        state.shapeParams[state.shapeKey] = { size, density };
      }
    }
    
    // Parse and persist rules (only for Game of Life mode)
    if (selectedMode === 'gameOfLife') {
      const birth = parseRule(ruleBirth?.value);
      const survival = parseRule(ruleSurvival?.value);
      
      // Calculate isolation and overcrowding automatically from survival
      const finalSurvival = survival.length ? survival : (state.rules?.survival ?? []);
      const { isolation, overcrowding } = calculateDeathRules(finalSurvival, 26);
      
      state.rules = {
        birth: birth.length ? birth : state.rules.birth,
        survival: finalSurvival,
        isolation: isolation,
        overcrowding: overcrowding,
      };
      
      // Parse and persist boundary rules
      const boundaryCornerBirth = document.getElementById('boundary-corner-birth');
      const boundaryCornerSurvival = document.getElementById('boundary-corner-survival');
      const boundaryEdgeBirth = document.getElementById('boundary-edge-birth');
      const boundaryEdgeSurvival = document.getElementById('boundary-edge-survival');
      const boundaryFaceBirth = document.getElementById('boundary-face-birth');
      const boundaryFaceSurvival = document.getElementById('boundary-face-survival');
      
      const cornerBirth = parseRule(boundaryCornerBirth?.value);
      const cornerSurvival = parseRule(boundaryCornerSurvival?.value);
      const edgeBirth = parseRule(boundaryEdgeBirth?.value);
      const edgeSurvival = parseRule(boundaryEdgeSurvival?.value);
      const faceBirth = parseRule(boundaryFaceBirth?.value);
      const faceSurvival = parseRule(boundaryFaceSurvival?.value);
      
      // Calculate boundary death rules automatically
      const finalCornerSurvival = cornerSurvival.length ? cornerSurvival : (state.boundaryRules?.corner?.survival ?? [2, 3, 4]);
      const finalEdgeSurvival = edgeSurvival.length ? edgeSurvival : (state.boundaryRules?.edgeTwoFaces?.survival ?? [2, 3, 4, 5, 6]);
      const finalFaceSurvival = faceSurvival.length ? faceSurvival : (state.boundaryRules?.face?.survival ?? [3, 4, 5, 6, 7, 8, 9]);
      
      const cornerDeath = calculateDeathRules(finalCornerSurvival, 7);
      const edgeDeath = calculateDeathRules(finalEdgeSurvival, 11);
      const faceDeath = calculateDeathRules(finalFaceSurvival, 17);
      
      if (!state.boundaryRules) state.boundaryRules = {};
      state.boundaryRules.corner = {
        birth: cornerBirth.length ? cornerBirth : state.boundaryRules.corner?.birth ?? [2, 3],
        survival: finalCornerSurvival,
        isolation: cornerDeath.isolation,
        overcrowding: cornerDeath.overcrowding,
      };
      state.boundaryRules.edgeTwoFaces = {
        birth: edgeBirth.length ? edgeBirth : state.boundaryRules.edgeTwoFaces?.birth ?? [4],
        survival: finalEdgeSurvival,
        isolation: edgeDeath.isolation,
        overcrowding: edgeDeath.overcrowding,
      };
      state.boundaryRules.face = {
        birth: faceBirth.length ? faceBirth : state.boundaryRules.face?.birth ?? [6],
        survival: finalFaceSurvival,
        isolation: faceDeath.isolation,
        overcrowding: faceDeath.overcrowding,
      };
    }
    
    resetControlsUI();

    modal.classList.add('hidden');
    cleanup();
    pendingShapeKey = null;
    stopExplore(); // if Explore was running, its Worker and view go
    await initSimulation();

    // Update displays
    const sizeOut = document.getElementById('shape-size-value');
    const densityOut = document.getElementById('shape-density-value');
    const shapeOut = document.getElementById('shape-name-value');
    if (sizeOut && selectedMode === 'gameOfLife') sizeOut.textContent = `${size}`;
    if (densityOut && selectedMode === 'gameOfLife') densityOut.textContent = `${density.toFixed(2)}`;
    if (shapeOut) {
      if (selectedMode === 'rule30') {
        const is2D = rule302DCheckbox ? rule302DCheckbox.checked : false;
        shapeOut.textContent = is2D ? 'rule30 (2D)' : 'rule30';
      } else if (selectedMode === 'sineWave') {
        shapeOut.textContent = 'sine wave';
      } else {
        shapeOut.textContent = state.shapeKey;
      }
    }
    // Update simulation display
    const simSizeOut = document.getElementById('sim-size-value');
    const simGensOut = document.getElementById('sim-generations-value');
    if (simSizeOut) simSizeOut.textContent = `${state.sim_size}`;
    if (simGensOut) simGensOut.textContent = `${state.sim_generations}`;
    // Update rules display (only for Game of Life)
    if (selectedMode === 'gameOfLife') {
      const rb = document.getElementById('rules-birth');
      const rs = document.getElementById('rules-survival');
      const ri = document.getElementById('rules-isolation');
      const ro = document.getElementById('rules-overcrowd');
      if (rb) rb.textContent = stringifyRule(state.rules.birth);
      if (rs) rs.textContent = stringifyRule(state.rules.survival);
      if (ri) ri.textContent = stringifyRule(state.rules.isolation);
      if (ro) ro.textContent = stringifyRule(state.rules.overcrowding);
    }
  };

  function cleanup() {
    confirmBtn.removeEventListener('click', onConfirm);
    cancelBtn.removeEventListener('click', onCancel);
    // Mode cards don't need cleanup as they're recreated each time
  }

  confirmBtn.addEventListener('click', onConfirm);
  cancelBtn.addEventListener('click', onCancel);
}

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

function parseRule(str) {
  if (!str) return [];
  const s = String(str).trim();
  if (!s) return [];
  const parts = s.split(',').map(p => p.trim()).filter(Boolean);
  const values = new Set();
  for (const p of parts) {
    if (/^\d+\s*-\s*\d+$/.test(p)) {
      const [a,b] = p.split('-').map(n => parseInt(n.trim(),10));
      const start = Math.min(a,b);
      const end = Math.max(a,b);
      for (let i=start;i<=end;i++) values.add(i);
    } else if (/^\d+$/.test(p)) {
      values.add(parseInt(p,10));
    }
  }
  return Array.from(values).sort((a,b)=>a-b);
}

function stringifyRule(arr) {
  if (!arr || !arr.length) return '';
  const a = Array.from(arr).sort((x,y)=>x-y);
  const ranges = [];
  let start = a[0], prev = a[0];
  for (let i=1;i<a.length;i++) {
    if (a[i] === prev + 1) {
      prev = a[i];
    } else {
      if (start === prev) ranges.push(String(start)); else ranges.push(`${start}-${prev}`);
      start = prev = a[i];
    }
  }
  if (start !== undefined) {
    if (start === prev) ranges.push(String(start)); else ranges.push(`${start}-${prev}`);
  }
  return ranges.join(',');
}

function resetControlsUI() {
  // Reset state variables to initial values
  state.viewMode = 'full';
  state.sliceAxis = 'x';
  state.sliceIndex = Math.floor((state.sim_size - 1) / 2);
  state.currentGen = 0;
  state.isPlaying = false;
  state.isReversing = false;

  // 3D/2D button → set to 3D (full)
  const dual = document.getElementById('dualStateButton');
  if (dual) {
    const sections = Array.from(dual.querySelectorAll('.state-section'));
    sections.forEach(sec => sec.classList.remove('active'));
    dual.classList.remove('state-active-y');
    dual.classList.add('state-active-x');
    const first = sections[0]; // assumes first is 3D
    if (first) first.classList.add('active');
  }

  // Tri-state axis → set to X
  const tri = document.getElementById('triStateButton');
  if (tri) {
    const sections = Array.from(tri.querySelectorAll('.state-section'));
    sections.forEach(sec => sec.classList.remove('active'));
    tri.classList.remove('state-active-y', 'state-active-z');
    tri.classList.add('state-active-x');
    const xSec = sections.find(s => s.dataset.value === 'x') || sections[0];
    if (xSec) xSec.classList.add('active');
  }

  // Hide slice-related UI by default
  const sliceSlider = document.getElementById('slider');
  const sliceViewer = document.getElementById('sliceViewer');
  if (sliceSlider) sliceSlider.style.display = 'none';
  if (sliceViewer) sliceViewer.style.display = 'none';

  // Reset slice index to mid and label
  const slider = document.getElementById('slice-index');
  if (slider) {
    slider.max = state.sim_size - 1;
    const mid = Math.floor((state.sim_size - 1) / 2);
    slider.value = `${mid}`;
  }

  // Reset play/pause to paused and enable step
  const playPauseIcon = document.getElementById('playPauseIcon');
  if (playPauseIcon) playPauseIcon.className = 'play';
  updateStepButtonVisibility();
  updateStateDisplay();

  // Reset reverse (right arrow active only)
  const leftArrow = document.getElementById('leftArrow');
  const rightArrow = document.getElementById('rightArrow');
  if (leftArrow) leftArrow.classList.remove('active');
  if (rightArrow) rightArrow.classList.add('active');
  updateDirectionDisplay();

  // Reset step circles (right circle active only)
  const leftStepCircle = document.getElementById('leftStepCircle');
  const rightStepCircle = document.getElementById('rightStepCircle');
  if (leftStepCircle) leftStepCircle.classList.remove('active');
  if (rightStepCircle) rightStepCircle.classList.add('active');

  // Reset generation display
  const bottomGen = document.getElementById('bottom-gen');
  if (bottomGen) {
    const maxGen = state.simulationData && state.simulationData.length > 0 ? state.simulationData.length - 1 : 0;
    bottomGen.textContent = `0 / ${maxGen}`;
  }

  // Update tristate button visibility based on view mode
  updateTriStateVisibility();
}