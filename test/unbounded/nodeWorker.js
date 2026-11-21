// SPDX-License-Identifier: Apache-2.0
//
// run.worker.js for Node: the same run, served on a worker_threads port instead of a Web
// Worker's global scope. driver.test.js starts it. (`node --test` also loads every file under
// test/, on the main thread, where there is no port and this does nothing.)

import { parentPort } from 'node:worker_threads';
import { serve } from '../../src/unbounded/run.js';

if (parentPort) serve(parentPort);
