// SPDX-License-Identifier: Apache-2.0
//
// The unbounded engine's Web Worker: one run per Worker, served by run.js. The page talks to it
// through driver.js, never directly.

import { serve } from './run.js';

serve(self);
