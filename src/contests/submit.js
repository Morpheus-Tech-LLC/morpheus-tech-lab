// SPDX-License-Identifier: Apache-2.0
//
// Submitting a result by email (#79): the address, the subject and the filled-in text, and the
// mailto: link that opens them in the visitor's mail app. A static site can't send email, and a
// form service would be a backend in all but name, so the visitor's own email does the sending.
// A mailto: link can't attach files: the results card says so, and downloads the result file
// for the visitor to attach by hand.
//
// What the text says is the lab's promise to an entrant: the picture's conditions, that the repo
// is public, how their email address is used, and, for Speed, that the timing is self-reported.
// CONTRIBUTING.md's "Contest entries" is the maintainers' side of the same promise.
//
// No DOM: the tests run it in Node.

import { scoreText, rulesText, departuresText, n } from './format.js';

/** Where entries go, for every contest. */
export const SUBMIT_ADDRESS = 'lab@morpheustech.net';

/** The line an entrant keeps to appear in the Hall of Fame. Without it, an entry isn't listed. */
export const HALL_OF_FAME_LINE = 'Hall of Fame: yes, show my name, picture, score, browser and date.';

/**
 * The subject: the contest and the score, `[Speed] 412 generations`, `[Methuselah] settled at
 * generation 1,234: period 2`.
 * @param {string} [ending] - the result's, which says more about a Methuselah score
 */
export function emailSubject(contest, score, ending) {
  return `[${contest.title}] ${scoreText(contest, score, ending)}`;
}

/**
 * The email's text, for the visitor to finish: the result, the fields to fill in, the Hall of
 * Fame line to keep or delete, and the conditions.
 * @param {object} entry
 * @param {import('../unbounded/contests.js').Contest} entry.contest
 * @param {object} entry.score - the result's score
 * @param {{name: string, version: string} | null} entry.browser - as detected, or null
 * @param {string} entry.hash - the result's hash
 * @param {string} entry.fileName - the result file the visitor attaches
 * @param {string} [entry.ending] - the result's ending
 * @param {{rules: object, seed: number[][]}} [entry.run] - the result's run: a Methuselah entry's
 *   rules and seed are stated too
 * @param {{generation: number}[]} [entry.departures] - a Classic Methuselah result's ships
 */
export function emailBody({ contest, score, browser, hash, fileName, ending, run, departures }) {
  const lines = [
    `My entry for ${contest.title} (${contest.id}).`,
    '',
    `Score: ${scoreText(contest, score, ending)}${contest.kind === 'speed' && score.ms !== null ? ' (the ceiling, so the time ranks it)' : ''}`,
  ];
  if (contest.kind === 'methuselah' && run) {
    lines.push(`Rules: ${rulesText(run.rules)}`, `Seed: ${n(run.seed.length)} cell${run.seed.length === 1 ? '' : 's'}`);
  }
  if (contest.departures && departures) lines.push(`Ships: ${departuresText(departures)}`);
  lines.push(
    `Result file: ${fileName} (attached)`,
    `Hash: ${hash}`,
    '',
    'Name to show: ',
    `Browser and version: ${browser ? `${browser.name} ${browser.version}` : ''}`,
  );
  if (contest.kind === 'speed') lines.push('Hardware (optional): ');
  lines.push(
    '',
    'Keep the next line to appear in the Hall of Fame, or delete it to opt out: the entry is still verified, but not listed.',
    HALL_OF_FAME_LINE,
  );
  if (contest.kind === 'methuselah') {
    lines.push(`${contest.title}'s Hall of Fame also shows the entry's rules and its seed's cell count, from the result file.`);
  }
  lines.push(
    '',
    'Picture (optional): attach a PNG or JPEG, square, at most 1 MB. It must be yours to use, show no other people, and break nothing in the code of conduct. The lab resizes it to 128 x 128 and strips its metadata, and may decline a picture or a name.',
    '',
    "The lab's repo is public: once committed, your name and picture are in its history and in every copy of it. Removal on request takes them off the site and out of the current files, but can't erase every copy.",
    '',
    'Your email address is used only to reply about this entry. It is never published, committed or put in a result file.',
  );
  if (contest.kind === 'speed') {
    lines.push(
      '',
      "Speed's timing is self-reported: a replay proves the generation, not how long it took. Top entries may be asked for a screen recording of a run on lab.morpheustech.net.",
    );
  }
  return `${lines.join('\n')}\n`;
}

/** The mailto: link that opens the email, addressed, with its subject and text. */
export function mailtoLink(subject, body) {
  return `mailto:${SUBMIT_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
