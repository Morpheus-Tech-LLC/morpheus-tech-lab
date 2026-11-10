// SPDX-License-Identifier: Apache-2.0
//
// Whether WebGPU compute can run in this browser, and the one GPUDevice the lab uses.
//
// The status is one of:
//   'checking'       the adapter and device are being requested
//   'ready'          a device is ready
//   'no-webgpu'      the browser has no WebGPU (or the page isn't a secure context)
//   'no-adapter'     WebGPU exists, but no GPU adapter was found
//   'device-failed'  an adapter was found, but its device failed to start
//
// If the device is lost, a new one is requested for the next run, up to MAX_RESTARTS times.

const MAX_RESTARTS = 3;

let status = 'checking';
let device = null;
let pending = null;
let restarts = 0;
const listeners = new Set();

/** The current status (see above). */
export function gpuStatus() {
  return status;
}

/** Calls `listener(status)` whenever the status changes. */
export function onGpuStatusChange(listener) {
  listeners.add(listener);
}

/** Resolves to a ready GPUDevice, or to null if the GPU can't be used. Never rejects. */
export function getGpuDevice() {
  if (device) return Promise.resolve(device);
  if (!pending) {
    pending = requestGpuDevice().finally(() => {
      pending = null;
    });
  }
  return pending;
}

function setStatus(next) {
  if (next === status) return;
  status = next;
  for (const listener of listeners) listener(status);
}

async function requestGpuDevice() {
  setStatus('checking');
  const gpu = globalThis.navigator?.gpu;
  if (!gpu) {
    setStatus('no-webgpu');
    return null;
  }

  let adapter = null;
  try {
    adapter = await gpu.requestAdapter();
  } catch {
    adapter = null;
  }
  // A software fallback adapter would be slower than the CPU path, so it doesn't count
  if (!adapter || adapter.info?.isFallbackAdapter || adapter.isFallbackAdapter) {
    setStatus('no-adapter');
    return null;
  }

  let candidate = null;
  try {
    candidate = await adapter.requestDevice();
  } catch {
    candidate = null;
  }
  if (!candidate) {
    setStatus('device-failed');
    return null;
  }

  candidate.lost.then(() => {
    if (device !== candidate) return;
    device = null;
    if (restarts < MAX_RESTARTS) {
      restarts += 1;
      getGpuDevice();
    } else {
      setStatus('device-failed');
    }
  });
  device = candidate;
  setStatus('ready');
  return device;
}
