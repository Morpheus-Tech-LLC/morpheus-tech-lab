// SPDX-License-Identifier: Apache-2.0
//
// The memory page's Worker (memory.html, dev only, #39): how much memory one tab's Worker can
// take in slabs, the way the engine takes it. It asks only through World.addSlab(), the engine's
// one place that asks for memory, and writes into every page of each slab so the browser has to
// provide it, as cells would. Nothing in the lab loads this.
//
// Messages to it:   {type: 'probe', capMB}  {type: 'stop'}  {type: 'release'}
// Messages from it: {type: 'slab', totalMB, ms}  (after each slab)
//                   {type: 'done', totalMB, outcome: 'refused' | 'cap' | 'stopped', message?}
//                   {type: 'released'}

import { World, StopSignal } from './world.js';

const PAGE = 4096;
let world = null;
let stopping = false;

self.onmessage = ({ data }) => {
  if (data.type === 'probe') probe(data.capMB);
  else if (data.type === 'stop') stopping = true;
  else if (data.type === 'release') {
    world = null; // the slabs go with it, once the browser collects them
    self.postMessage({ type: 'released' });
  }
};

function probe(capMB) {
  stopping = false;
  world = new World({ rules: { birth: [1], survival: [] }, limits: { memory: capMB * 2 ** 20 } });
  const mb = () => world.memoryBytes / 2 ** 20;
  const next = () => {
    if (stopping) return self.postMessage({ type: 'done', totalMB: mb(), outcome: 'stopped' });
    const started = performance.now();
    try {
      world.addSlab();
    } catch (err) {
      if (err instanceof StopSignal) {
        const outcome = err.reason === 'memory-limit' ? 'cap' : 'refused';
        return self.postMessage({ type: 'done', totalMB: mb(), outcome });
      }
      return self.postMessage({ type: 'done', totalMB: mb(), outcome: 'refused', message: String(err) });
    }
    const slab = world.slabs[world.slabs.length - 1];
    for (let i = 0; i < slab.length; i += PAGE) slab[i] = 1;
    self.postMessage({ type: 'slab', totalMB: mb(), ms: performance.now() - started });
    setTimeout(next, 0); // let a 'stop' through between slabs
  };
  next();
}
