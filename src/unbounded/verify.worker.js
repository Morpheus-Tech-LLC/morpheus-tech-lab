// SPDX-License-Identifier: Apache-2.0
//
// The Web Worker that checks one result file for the page (Verify a result, #77): it runs
// verifyResult(), which replays the file from its seed, so the page stays responsive however long
// that takes. One file per Worker; the page terminates it once it has the answer, or to give up.
//
// Message in:  {text, maxMemory?}   the file's contents, untrusted
// Message out: {verdict, message, contest, generation, ending, score, rules, seedCells, departures}
//              all but the first two from the file as read (seedCells: its seed's cell count;
//              departures: a Classic Methuselah file's, without their cells), or null if it was
//              refused or has none
//              {verdict: 'error', message}   a fault in the verifier, not a judgement on the file

import { verifyResult } from './verify.js';

self.onmessage = async (event) => {
  const { text, maxMemory } = event.data ?? {};
  try {
    const answer = await verifyResult(text, maxMemory ? { maxMemory } : {});
    const result = answer.result;
    self.postMessage({
      verdict: answer.verdict,
      message: answer.message,
      contest: result?.run.contest ?? null,
      generation: result?.generation ?? null,
      ending: result?.ending ?? null,
      score: result?.score ?? null,
      rules: result?.run.rules ?? null,
      seedCells: result?.run.seed.length ?? null,
      departures: result?.departures?.map(({ generation, period, shift }) => ({ generation, period, shift })) ?? null,
    });
  } catch (err) {
    self.postMessage({ verdict: 'error', message: err?.message ?? String(err) });
  }
};
