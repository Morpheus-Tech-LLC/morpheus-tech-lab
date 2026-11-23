import { state } from "./state.js";
import { initSimulation, updatePoints, memoryNote } from "./simulationModel.js";
import * as THREE from 'three';
import { initComputeControl, updateComputeControl } from "./gpu/computeControl.js";
import { isExplore, stopExplore, togglePlay, stepOnce, restart, exploreViewChanged, toggleSave, confirmSave, closeSave } from "./explore/explore.js";
import { initHud, startFromSetup, openSeedEditor } from "./explore/hud.js";
import { initSettingsHud, openModePopover, MODES } from "./hudSettings.js";
import { contestArena, entrySetup } from "./explore/setup.js";
import { SeedError } from "./explore/seed.js";
import { isContests, startContests, stopContests, isWatching, closeWatch, watchTogglePlay, watchStep, watchViewChanged } from "./contests/contests.js";
import { CONTESTS, SEASON } from "./unbounded/contests.js";
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

// The HUD panel's title: the mode's name, and its kind under it (#130), as the Mode popover lists
// them; the popover says what each mode is
const MODE_TITLES = {
  ...Object.fromEntries(MODES.map(({ id, name, kind }) => [id, [name, kind]])),
  contests: ['Contests', SEASON],
};

function updateSimulationModeTitle() {
  // Which boxes, lines and gears the HUD shows follows the mode (#130)
  document.body.dataset.mode = state.simulationMode;
  const [name, kind] = MODE_TITLES[state.simulationMode] ?? MODE_TITLES.gameOfLife;
  const nameEl = document.getElementById('hud-mode-name');
  if (nameEl) nameEl.textContent = name;
  const kindEl = document.getElementById('hud-mode-kind');
  if (kindEl) kindEl.textContent = kind;
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
    if (document.querySelector('.explore-popover.is-open')) return; // the popover's own
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

  // Every mode's settings are in the HUD (src/hudSettings.js, #130): the Mode box's gear picks
  // the mode, and the control bar's gear opens it too, showing the HUD first if it is hidden
  initSettingsHud({
    beforeRun: () => {
      stopExplore(); // if Explore was running, its Worker and view go
      stopContests(); // and the Contests panel, with any run
      beforeContests = null;
      resetControlsUI();
    },
    afterRun: () => initControls(),
    enterExplore: () => {
      state.simulationMode = 'explore';
      for (const flag of MODE_FLAGS) state[flag] = false;
      beforeContests = null;
      restartExplore();
    },
    showMode: updateSimulationModeTitle,
  });
  const seedBtn = document.getElementById('seedConfigButton');
  if (seedBtn) {
    seedBtn.addEventListener('click', () => {
      if (state.showHUD === false) document.getElementById('hudToggleButton')?.click();
      openModePopover();
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
    if (!state.simulationData?.length) return; // a refused run left none (#123)
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
  // Explore only: the save popover, opened by Save this generation, Save simulation or Save seed.
  // Escape or a click elsewhere closes it (src/explore/popover.js)
  const saveGenerationButton = document.getElementById("explore-save-generation");
  if (saveGenerationButton) saveGenerationButton.onclick = () => toggleSave("generation");
  const saveSeedButton = document.getElementById("explore-save-seed");
  if (saveSeedButton) saveSeedButton.onclick = () => toggleSave("seed");
  const saveSimulationButton = document.getElementById("explore-save-simulation");
  if (saveSimulationButton) saveSimulationButton.onclick = () => toggleSave("simulation");
  const saveConfirm = document.getElementById("explore-save-confirm");
  if (saveConfirm) saveConfirm.onclick = confirmSave;
  const saveCancel = document.getElementById("explore-save-cancel");
  if (saveCancel) saveCancel.onclick = closeSave;
  // Explore only: the gears in the HUD boxes' titles and their popovers, whose Apply restarts the run
  initHud({ restart: restartExplore });

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
  
  // The company logo at the top opens the company modal, which links to morpheustech.net (the
  // logos beside the dialog's range hints went in #123: the hints open their advice instead)
  const companyLogoButtons = [
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

// The mode the Contests banner was clicked in, and its flags, to go back to
let beforeContests = null;
const MODE_FLAGS = ['useRule30', 'useRule30_2D', 'useSineWave', 'useSandpile'];

/**
 * Opens the Contests mode (src/contests/): from its banner by the company logo. It has nothing to
 * set.
 */
function enterContests() {
  if (state.simulationMode !== 'contests') {
    beforeContests = { mode: state.simulationMode, flags: Object.fromEntries(MODE_FLAGS.map((f) => [f, state[f]])) };
  }
  state.simulationMode = 'contests';
  state.useRule30 = false;
  state.useRule30_2D = false;
  state.useSineWave = false;
  state.useSandpile = false;
  memoryNote(null); // a refused run's note stays with its mode (#123)
  stopExplore(); // its Worker and view go
  resetControlsUI();
  initControls(); // the title and the GPU toggle follow the mode
  startContests({ designInExplore });
}

/**
 * From a Discovery contest's page (#94): Explore, with the contest's arena (and, for Classic
 * Methuselah, ships leaving at its edge, #103) and the seed editor open on its seed, to design an
 * entry. From a Hall of Fame entry's Open seed (#146), the same, on the entry's seed and rules.
 * The banner then brings the visitor back to Contests, and the panel to the contest's page.
 * @param {{note: string, arena: number, title: string, ships?: boolean,
 *   entry?: {name: string, cells: Int32Array, rules: object}}} contest - the editor's note, the
 *   contest's arena side, title and whether ships leave at its edge, and the entry to open, if any
 * @returns {string | null} why the entry can't open, or null once Explore has started
 */
function designInExplore({ note, arena, title, ships = false, entry = null }) {
  let fitted;
  if (entry) {
    try {
      fitted = entrySetup(state.explore, entry, arena, title, ships);
    } catch (err) {
      if (err instanceof SeedError) return err.message;
      throw err;
    }
  } else {
    fitted = contestArena(state.explore, arena, title, ships);
  }
  beforeContests = null;
  state.explore = fitted.setup;
  state.simulationMode = 'explore';
  restartExplore();
  openSeedEditor({ note: `${note} ${fitted.note}` });
  return null;
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
 * Starts Explore again with the settings its HUD boxes hold: from the Mode popover's Apply
 * (src/hudSettings.js), and from the Apply of a box's popover (src/explore/hud.js).
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