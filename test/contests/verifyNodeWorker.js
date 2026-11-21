// SPDX-License-Identifier: Apache-2.0
//
// verify.worker.js for Node: the same module, on a worker_threads port standing in for a Web
// Worker's global scope. speed.test.js starts it. (`node --test` also loads every file under
// test/, on the main thread, where there is no port and this does nothing.)

import { parentPort } from 'node:worker_threads';

if (parentPort) {
  globalThis.self = {
    postMessage: (message) => parentPort.postMessage(message),
    set onmessage(fn) { parentPort.on('message', (data) => fn({ data })); },
  };
  await import('../../src/unbounded/verify.worker.js');
}
