// SPDX-License-Identifier: Apache-2.0
//
// The reasons an unbounded run can end, in a module of their own so that run.js (the run loop)
// and canonical.js (result files) can both import them without importing each other in a cycle.

import { STOP_REASONS } from './world.js';

/** The reasons a run can end: the engine's limits, plus the run's own. */
export const END_REASONS = [
  ...STOP_REASONS,
  'stopped', // stopped by hand
  'deadline', // a timed run reached its deadline
  'generation-limit', // the run completed the generations it was given
  'died', // a settling run: no live cells remain
  'repeat', // a settling run: the cells repeat, in place, an earlier generation's
  'error', // a fault in the engine; the message says what
];
