// SPDX-License-Identifier: Apache-2.0
//
// The GPU compute toggle in the control bar. Its badge always says where the next run computes,
// GPU or CPU. When the GPU can't be used the toggle is disabled (aria-disabled, so it stays
// focusable), and hovering, focusing or tapping it opens a popover saying why.

import { state } from '../state.js';
import { getGpuDevice, gpuStatus, onGpuStatusChange } from './device.js';
import { gpuModeOf } from './engine.js';

const STORAGE_KEY = 'morpheus-tech-lab.gpuCompute';

const REASONS = {
  'no-webgpu': "This browser doesn't have WebGPU, so simulations run on the CPU. "
    + 'Recent Chrome, Edge, Safari and Firefox have it, on a secure page (HTTPS or localhost).',
  'no-adapter': 'No GPU adapter was found, so simulations run on the CPU. '
    + 'The browser may have blocklisted the GPU, or hardware acceleration may be turned off.',
  'device-failed': 'The GPU failed to start, so simulations run on the CPU. Reloading the page may help.',
};

const CPU_ONLY_MODES = { sineWave: 'Sine Wave', sandpile: 'Abelian Sandpile' };

let elements = null;

/** Wires up the toggle once, and starts looking for a GPU. */
export function initComputeControl() {
  if (elements) return;
  const button = document.getElementById('gpuComputeToggle');
  if (!button) return;
  elements = {
    root: document.getElementById('gpu-compute-control'),
    button,
    icon: document.getElementById('gpuComputeIcon'),
    badge: document.getElementById('gpu-compute-badge'),
    status: document.getElementById('gpu-compute-status'),
    popover: document.getElementById('gpu-compute-popover'),
  };
  state.gpuCompute = readPreference();

  button.addEventListener('click', () => {
    if (unavailableReason()) {
      showPopover(); // a tap on a touch screen shows why
      return;
    }
    state.gpuCompute = !state.gpuCompute;
    savePreference(state.gpuCompute);
    updateComputeControl();
  });
  button.addEventListener('mouseenter', showPopover);
  button.addEventListener('mouseleave', hidePopover);
  button.addEventListener('focus', showPopover);
  button.addEventListener('blur', hidePopover);
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hidePopover();
  });
  document.addEventListener('pointerdown', (e) => {
    if (!elements.root.contains(e.target)) hidePopover();
  });

  onGpuStatusChange(updateComputeControl);
  getGpuDevice();
  updateComputeControl();
}

/** Redraws the toggle for the current GPU status, mode and choice. */
export function updateComputeControl() {
  if (!elements) return;
  const { root, button, icon, badge, status, popover } = elements;
  const checking = gpuStatus() === 'checking';
  const reason = unavailableReason();
  const onGpu = !checking && !reason && state.gpuCompute;

  button.setAttribute('aria-pressed', String(!reason && state.gpuCompute));
  button.setAttribute('aria-disabled', String(Boolean(reason)));
  root.classList.toggle('is-unavailable', Boolean(reason));
  if (icon) icon.style.stroke = onGpu ? '#4da3ff' : 'currentColor';
  badge.textContent = checking ? '…' : onGpu ? 'GPU' : 'CPU';
  status.textContent = checking
    ? 'Checking for a GPU.'
    : `The next run computes on the ${onGpu ? 'GPU' : 'CPU'}.`;
  popover.textContent = reason ?? '';
  if (!reason) hidePopover();
}

// Why the next run can't use the GPU, in one or two sentences; null if it can
function unavailableReason() {
  if (state.simulationMode === 'contests') {
    return 'The contest runs on the CPU, in a background thread (a Web Worker), so every entrant runs the same engine. '
      + 'GPU compute covers Game of Life 3D and Rule 30.';
  }
  if (state.simulationMode === 'explore') {
    return 'Explore runs on the CPU, in a background thread (a Web Worker), so the page stays responsive however hard it works. '
      + 'GPU compute covers Game of Life 3D and Rule 30.';
  }
  const hardware = REASONS[gpuStatus()];
  if (hardware) return hardware;
  if (!gpuModeOf(state)) {
    const mode = CPU_ONLY_MODES[state.simulationMode] ?? 'This mode';
    return `${mode} runs on the CPU only. GPU compute covers Game of Life 3D and Rule 30.`;
  }
  return null;
}

function showPopover() {
  if (elements && unavailableReason()) elements.root.classList.add('is-open');
}

function hidePopover() {
  if (elements) elements.root.classList.remove('is-open');
}

// The choice is remembered per browser. Storage can throw (private browsing, blocked
// site data); then it defaults to on, and a change lasts until the page is closed.
function readPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function savePreference(on) {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Not saved; the choice still applies for this visit
  }
}
