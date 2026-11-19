import { state } from "./state.js";
import { initSimulation, updatePoints } from "./simulationModel.js";
import * as THREE from 'three';
import { initComputeControl, updateComputeControl } from "./gpu/computeControl.js";
import { isExplore, stopExplore, togglePlay, stepOnce, restart, exploreViewChanged, toggleSave, confirmSave, closeSave } from "./explore/explore.js";
import { initHud, startFromSetup, settingsNote, openSeedEditor } from "./explore/hud.js";
import { contestArena } from "./explore/setup.js";
import { isContests, startContests, stopContests, isWatching, closeWatch, watchTogglePlay, watchStep, watchViewChanged } from "./contests/contests.js";
import { CONTESTS } from "./unbounded/contests.js";
import { closingText } from "./contests/format.js";

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

// The Mode section, first in the HUD's Simulation panel: which simulation runs, and a line about it
const MODE_NAMES = {
  rule30: ['Rule 30', "Wolfram's elementary automaton"],
  sineWave: ['Sine Wave', 'A continuous wave field'],
  sandpile: ['Sandpile', 'The Abelian sandpile'],
  explore: ['Game of Life 3D', 'Without walls, or in an arena'],
  contests: ['Contest', 'One contest, three branches'],
};

function updateSimulationModeTitle() {
  const [name, about] = MODE_NAMES[state.simulationMode] ?? MODE_NAMES.explore;
  const nameEl = document.getElementById('hud-mode-name');
  if (nameEl) nameEl.textContent = name;
  const aboutEl = document.getElementById('hud-mode-about');
  if (aboutEl) aboutEl.textContent = about;
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
  
  // The Mode section's name, on first load
  updateSimulationModeTitle();
  // The Contests banner by the company logo opens the mode in one click, and says when entries
  // close; in Contests, a click on it or Esc goes back to the mode before
  const contestsBanner = document.getElementById('contests-banner');
  if (contestsBanner) contestsBanner.onclick = () => (isContests() ? leaveContests() : enterContests());
  const contestsCloses = document.getElementById('contests-banner-closes');
  if (contestsCloses) contestsCloses.textContent = closingText(CONTESTS, { short: true });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || event.defaultPrevented || !isContests()) return;
    if (!document.getElementById('shapeModal')?.classList.contains('hidden')) return; // the dialog's own
    if (!document.getElementById('company-modal')?.classList.contains('hidden')) return; // closes that first
    if (isWatching()) {
      closeWatch(); // back to the panel first
      return;
    }
    leaveContests();
  });
  // GPU compute toggle and indicator
  initComputeControl();
  // Initialize Simulation info displays on first load
  const simSizeOut = document.getElementById('sim-size-value');
  const simGensOut = document.getElementById('sim-generations-value');
  if (simSizeOut) simSizeOut.textContent = String(state.sim_size);
  if (simGensOut) simGensOut.textContent = String(state.sim_generations);

  // Seed config button opens modal directly
  const seedBtn = document.getElementById('seedConfigButton');
  if (seedBtn) {
    seedBtn.addEventListener('click', () => openShapeModal());
  }
  // The gear in the Mode section's title opens the same dialog: the mode, and the other modes'
  // settings
  const changeModeBtn = document.getElementById('hud-change-mode');
  if (changeModeBtn) {
    changeModeBtn.onclick = () => openShapeModal();
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
    if (isWatching()) watchViewChanged(); // a replay draws with Explore's view
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
    if (isWatching()) watchViewChanged(); // a replay draws with Explore's view
  });

  // --- Slice Index Slider ---
  const sliceIndexSlider = document.getElementById('slice-index');
  sliceIndexSlider.addEventListener('input', () => {
    const index = parseInt(sliceIndexSlider.value);
    state.sliceIndex = index;
    updateViewControlsDisplay();
    if (state.viewMode === 'slice') updatePoints();
    if (isExplore()) exploreViewChanged();
    if (isWatching()) watchViewChanged(); // a replay draws with Explore's view
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
    if (isExplore() || isContests()) return; // a stream only runs forward; a contest only runs
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
    if (isContests()) {
      watchTogglePlay(); // a contest's run starts and stops from its panel; Watch plays here
      return;
    }
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
    if (isContests()) {
      watchStep();
      return;
    }
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
  // click elsewhere closes it (src/explore/popover.js)
  const saveGenerationButton = document.getElementById("explore-save-generation");
  if (saveGenerationButton) saveGenerationButton.onclick = () => toggleSave("generation");
  const saveSeedButton = document.getElementById("explore-save-seed");
  if (saveSeedButton) saveSeedButton.onclick = () => toggleSave("seed");
  const saveConfirm = document.getElementById("explore-save-confirm");
  if (saveConfirm) saveConfirm.onclick = confirmSave;
  const saveCancel = document.getElementById("explore-save-cancel");
  if (saveCancel) saveCancel.onclick = closeSave;
  // Explore only: the gears in the HUD boxes' titles and their popovers, whose Apply restarts the run
  initHud({ restart: restartExplore, useInContest: (contestId, entry) => enterContests({ entry: { contestId, ...entry } }) });

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
  
  // Functions to hide/show UI when company modal opens/closes. The top logo stays, lit, above
  // the panel, which opens under it at the top right; a click on it again, or Esc, closes it
  function hideUIForCompanyModal() {
    const glassDisplayContainer = document.getElementById('glass-display-container');
    const bottomControlsDisplay = document.getElementById('bottom-controls-display');
    const additionalControlsDisplay = document.getElementById('additional-controls-display');
    const controlsWrapper = document.getElementById('controls-wrapper');
    const footerIcons = document.getElementById('footer-icons');

    document.body.classList.add('company-modal-open');
    document.getElementById('company-logo-button-top')?.setAttribute('aria-expanded', 'true');
    if (footerIcons) footerIcons.style.display = 'none';
    if (glassDisplayContainer) glassDisplayContainer.style.display = 'none';
    if (bottomControlsDisplay) bottomControlsDisplay.style.display = 'none';
    if (additionalControlsDisplay) additionalControlsDisplay.style.display = 'none';
    if (controlsWrapper) controlsWrapper.style.display = 'none';
  }
  
  function showUIAfterCompanyModal() {
    const glassDisplayContainer = document.getElementById('glass-display-container');
    const bottomControlsDisplay = document.getElementById('bottom-controls-display');
    const additionalControlsDisplay = document.getElementById('additional-controls-display');
    const controlsWrapper = document.getElementById('controls-wrapper');
    const footerIcons = document.getElementById('footer-icons');

    document.body.classList.remove('company-modal-open');
    document.getElementById('company-logo-button-top')?.setAttribute('aria-expanded', 'false');
    if (footerIcons) footerIcons.style.display = '';
    if (glassDisplayContainer && state.showHUD) glassDisplayContainer.style.display = 'flex';
    if (bottomControlsDisplay && state.showHUD) bottomControlsDisplay.style.display = 'grid';
    if (additionalControlsDisplay && state.showHUD) additionalControlsDisplay.style.display = 'grid';
    if (controlsWrapper) controlsWrapper.style.display = '';
  }
  
  const companyModalOpen = () => Boolean(companyModal && !companyModal.classList.contains('hidden'));
  function closeCompanyModal() {
    if (!companyModalOpen()) return;
    companyModal.classList.add('hidden');
    showUIAfterCompanyModal();
    // Closed with Esc, the browser would ring the logo, which still has focus from its click
    const focused = document.activeElement;
    if (focused && (focused.closest('#company-brand') || companyModal.contains(focused))) focused.blur();
  }
  companyLogoButtons.forEach(button => {
    if (button && companyModal) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // The top logo stays on screen while the panel is open: a second click closes it
        if (companyModalOpen()) {
          closeCompanyModal();
          return;
        }
        companyModal.classList.remove('hidden');
        hideUIForCompanyModal();
      });
    }
  });
  
  if (companyModalClose && companyModal) {
    companyModalClose.addEventListener('click', closeCompanyModal);
    
    // Close modal when clicking outside
    companyModal.addEventListener('click', (e) => {
      if (e.target === companyModal) closeCompanyModal();
    });
    // and with Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && companyModalOpen()) {
        e.preventDefault();
        closeCompanyModal();
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

  // The Mode section's name
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

// The settings dialog: the mode, and the precomputed modes' settings (size, generations, Rule 30's
// 3D toggle, the sandpile's initial sand). Game of Life 3D's settings are in its HUD boxes
// (src/explore/hud.js), and Contests has none.
function openShapeModal() {
  const modal = document.getElementById('shapeModal');
  const confirmBtn = document.getElementById('shapeConfirm');
  const cancelBtn = document.getElementById('shapeCancel');
  const simSizeLabel = document.getElementById('sim-size-label');
  const simSizeInput = document.getElementById('sim-size');
  const simGenerationsInput = document.getElementById('sim-generations');

  if (!modal || !confirmBtn || !cancelBtn) return;

  // Initialize simulation inputs from state - use mode-specific values if available
  let currentMode = state.simulationMode || 'explore';
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
    simGenerationsInput.value = `${gens}`;
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
      const selectedMode = activeCard ? activeCard.dataset.mode : 'explore';
      if (selectedMode === 'rule30' && simGenerationsInput && simSizeInput) {
        const generations = Math.max(1, parseInt(simGenerationsInput.value) || state.sim_generations);
        const is2D = rule302DCheckbox.checked;
        const calculatedSize = calculateRule30Size(generations, is2D ? 'rule30_2D' : 'rule30');
        simSizeInput.value = calculatedSize;
      }
    });
  }
  
  function updateModeUI(mode) {
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

    // Explore's settings are in its HUD boxes (src/explore/hud.js): the dialog shows only the
    // mode choice, and a line saying where they are
    // The Contests mode has no settings at all: each contest fixes its own
    const simParamsSection = document.getElementById('sim-params-section');
    const exploreNote = document.getElementById('explore-settings-note');
    const streams = mode === 'explore' || mode === 'contests';
    if (exploreNote) {
      exploreNote.hidden = !streams;
      exploreNote.textContent = mode === 'explore' ? settingsNote()
        : mode === 'contests' ? 'Each branch of the contest fixes its own seed, rules and limits, so there is nothing to set here. Choose a branch from the panel in the middle of the screen.'
        : '';
    }
    if (simParamsSection) simParamsSection.style.display = streams ? 'none' : '';
    if (streams) {
      if (sandpileSection) sandpileSection.style.display = 'none';
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
      return;
    }
    
    if (mode === 'sineWave') {
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
      // Hide 2D toggle for Sine Wave mode
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
      // Hide sandpile section for Sine Wave mode
      if (sandpileSection) sandpileSection.style.display = 'none';
    } else if (mode === 'rule30') {
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
      // Hide 2D toggle for Sandpile mode
      if (rule302DToggleRow) rule302DToggleRow.style.display = 'none';
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
      const selectedMode = activeCard ? activeCard.dataset.mode : 'explore';
      
      // Enforce max of 100 for Rule 30 and Sine Wave
      if (selectedMode === 'rule30' || selectedMode === 'sineWave') {
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
    rule30: 'A one-dimensional cellular automaton that generates complex, seemingly random patterns from simple rules. Each cell\'s state depends on its left, center, and right neighbors, producing fractal-like structures.',
    sineWave: 'A continuous mathematical function visualized in discrete 3D space. Represents periodic oscillations and wave patterns, demonstrating how continuous phenomena can be sampled and displayed on a grid.',
    sandpile: 'The Abelian Sandpile Model, a self-organized criticality system. Sand grains accumulate and topple when reaching a threshold, creating cascading avalanches that exhibit power-law distributions and fractal patterns.',
    contests: 'One contest on the unbounded Game of Life 3D engine, in three branches. Speed times how many generations your browser computes in 6 seconds, from the same seed under the same rules for everyone. Methuselah asks for the longest-lived pattern that settles inside an arena, from your own seed and rules; Classic Methuselah is the same, but lets ships leave the arena. Results can be exported and checked by anyone, by replaying them.',
    explore: "Conway's Game of Life in three dimensions, where each cell has 26 neighbours, in a world without walls: the pattern grows as far as it likes, for as long as you let it run, with no score and no clock. Pause, step and restart it, try other rules, a preset, a seed file or a seed of your own design, and set a memory limit, or an arena that ends the run, lets ships leave, wraps around or has walls."
  };
  
  // Function to update mode description
  const modeDescriptionEl = document.getElementById('mode-description');
  function updateModeDescription(mode) {
    if (modeDescriptionEl) {
      modeDescriptionEl.innerHTML = `<p>${modeDescriptions[mode] || modeDescriptions.explore}</p>`;
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
  
  modal.classList.remove('hidden');

  const onCancel = () => {
    modal.classList.add('hidden');
    cleanup();
  };

  const onConfirm = async () => {
    // Get selected simulation mode from active card. Contests has no card (its banner beside the
    // HUD opens it), so opened from Contests with no card chosen, Apply stays in Contests
    const activeCard = document.querySelector('.mode-card.active');
    const selectedMode = activeCard ? activeCard.dataset.mode
      : state.simulationMode === 'contests' ? 'contests' : 'explore';

    // Game of Life 3D streams from a Worker instead of precomputing (src/explore/), with the
    // settings its HUD boxes hold
    if (selectedMode === 'contests') {
      modal.classList.add('hidden');
      cleanup();
      enterContests();
      return;
    }
    if (selectedMode === 'explore') {
      state.simulationMode = 'explore';
      state.useRule30 = false;
      state.useRule30_2D = false;
      state.useSineWave = false;
      state.useSandpile = false;
      modal.classList.add('hidden');
      cleanup();
      restartExplore();
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
    const newSimGenerations = simGenerationsInput ? Math.max(1, parseInt(simGenerationsInput.value)) : state.sim_generations;
    if (newSimSize !== state.sim_size) {
      state.sim_size = newSimSize;
    }
    if (newSimGenerations !== state.sim_generations) {
      state.sim_generations = newSimGenerations;
    }

    state.reset();
    
    resetControlsUI();

    modal.classList.add('hidden');
    cleanup();
    stopExplore(); // if Game of Life 3D was running, its Worker and view go
    stopContests(); // and the Contests panel, with any run
    await initSimulation();

    // Update displays: the Seed box's one line in the precomputed modes
    const shapeOut = document.getElementById('shape-name-value');
    if (shapeOut) {
      const is2D = rule302DCheckbox ? rule302DCheckbox.checked : false;
      shapeOut.textContent = { rule30: is2D ? 'rule30 (2D)' : 'rule30', sineWave: 'sine wave', sandpile: 'one grain at the centre' }[selectedMode] ?? '';
    }
    // Update simulation display
    const simSizeOut = document.getElementById('sim-size-value');
    const simGensOut = document.getElementById('sim-generations-value');
    if (simSizeOut) simSizeOut.textContent = `${state.sim_size}`;
    if (simGensOut) simGensOut.textContent = `${state.sim_generations}`;
  };

  function cleanup() {
    confirmBtn.removeEventListener('click', onConfirm);
    cancelBtn.removeEventListener('click', onCancel);
    // Mode cards don't need cleanup as they're recreated each time
  }

  confirmBtn.addEventListener('click', onConfirm);
  cancelBtn.addEventListener('click', onCancel);
}

// The mode the Contests banner was clicked in, and its flags, to go back to
let beforeContests = null;
const MODE_FLAGS = ['useRule30', 'useRule30_2D', 'useSineWave', 'useSandpile'];

/**
 * Opens the Contests mode (src/contests/): from its banner by the company logo, or Apply in the
 * dialog when opened from Contests. It has nothing to set. Explore's Use in a contest (#95) opens it
 * on a contest's page with an entry.
 * @param {object} [options]
 * @param {{contestId: string, rules: object, cells: Int32Array, source: string, note: string | null}} [options.entry]
 */
function enterContests({ entry } = {}) {
  if (state.simulationMode !== 'contests') {
    beforeContests = { mode: state.simulationMode, flags: Object.fromEntries(MODE_FLAGS.map((f) => [f, state[f]])) };
  }
  state.simulationMode = 'contests';
  state.useRule30 = false;
  state.useRule30_2D = false;
  state.useSineWave = false;
  state.useSandpile = false;
  stopExplore(); // its Worker and view go
  resetControlsUI();
  initControls(); // the title and the GPU toggle follow the mode
  startContests({ designInExplore, entry });
}

/**
 * From a Discovery contest's page (#94): Explore, with the contest's arena (and, for Classic
 * Methuselah, ships leaving at its edge, #103) and the seed editor open on its seed, to design an
 * entry. The banner then brings the visitor back to Contests, and the panel to the contest's page.
 * @param {{note: string, arena: number, title: string, ships?: boolean}} contest - the editor's
 *   note, and the contest's arena side, title and whether ships leave at its edge
 */
function designInExplore({ note, arena, title, ships = false }) {
  beforeContests = null;
  const fitted = contestArena(state.explore, arena, title, ships);
  state.explore = fitted.setup;
  state.simulationMode = 'explore';
  restartExplore();
  openSeedEditor({ note: `${note} ${fitted.note}` });
}

/**
 * Leaves Contests for the mode its banner was clicked in (Explore, the landing page, if none):
 * from the pressed banner, or Esc. Any run in progress ends.
 */
async function leaveContests() {
  if (!isContests()) return;
  const before = beforeContests ?? { mode: 'explore', flags: {} };
  beforeContests = null;
  if (before.mode === 'explore') {
    state.simulationMode = 'explore';
    restartExplore();
    return;
  }
  stopContests();
  state.simulationMode = before.mode;
  Object.assign(state, before.flags);
  resetControlsUI();
  initControls(); // the title and the GPU toggle follow the mode
  await initSimulation();
}

/**
 * Starts Explore again with the settings its HUD boxes hold: from the dialog's Apply, and from
 * the Apply of a box's popover (src/explore/hud.js).
 */
function restartExplore() {
  stopContests();
  resetControlsUI();
  initControls(); // the title and the GPU toggle follow the mode
  startFromSetup();
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