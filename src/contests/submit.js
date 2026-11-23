// SPDX-License-Identifier: Apache-2.0
//
// Submitting a result by email (#79): the address, the subject and the filled-in text, and the
// mailto: link that opens them in the visitor's mail app. A static site can't send email, and a
// form service would be a backend in all but name, so the visitor's own email does the sending.
// A mailto: link can't attach files: the results card has the visitor save the result file
// first, and says to attach it by hand; the email's text opens by saying so too (#140).
//
// What the text says is the lab's promise to an entrant: the picture's conditions, that the repo
// is public, how their email address is used, and, for Speed, that the timing is self-reported.
// CONTRIBUTING.md's "Contest entries" is the maintainers' side of the same promise.
//
// No DOM: the tests run it in Node.

import { scoreText } from './format.js';

/** Where entries go, for every contest. */
export const SUBMIT_ADDRESS = 'lab@morpheustech.net';

/** The line an entrant keeps to appear in the Hall of Fame. Without it, an entry isn't listed. */
export const HALL_OF_FAME_LINE = 'Hall of Fame: yes, show my name, picture, score, browser and date.';

/**
 * The email's first line: the entry is the file, so it can't be left off (#140).
 * @param {string} fileName - the result file
 */
export function attachLine(fileName) {
  return `BEFORE SENDING: attach your result file, ${fileName}. Without it, this entry can't be verified.`;
}

/**
 * The subject: the contest and the score, `[Speed] 412 generations`, `[Methuselah] settled at
 * generation 1,234: period 2`.
 * @param {string} [ending] - the result's, which says more about a Methuselah score
 */
export function emailSubject(contest, score, ending) {
  return `[${contest.title}] ${scoreText(contest, score, ending)}`;
}

/**
 * The line between what the entrant fills in and the small print. Dashes, not a box-drawing rule:
 * a mailto: body is plain text, and every character beyond ASCII costs nine in the link. Never
 * "-- ", which mail apps take for the start of a signature.
 */
export const RULE = '-'.repeat(40);

/**
 * The email's text, for the visitor to finish (#140): what to attach and fill in first (the
 * operating system, optional, for every contest; hardware for Speed alone), and,
 * under a rule, what the lab promises. The score, rules, seed, ships and hash are in the result
 * file, and the score is in the subject, so the text doesn't repeat them. A mailto: body is plain
 * text, so the small print can't be set in italics.
 * @param {object} entry
 * @param {import('../unbounded/contests.js').Contest} entry.contest
 * @param {{name: string, version: string} | null} entry.browser - as detected: the result file
 *   carries it, so the text asks for it only when it wasn't
 * @param {string} entry.fileName - the result file the visitor attaches
 */
export function emailBody({ contest, browser, fileName }) {
  const lines = [
    attachLine(fileName),
    '',
    'Name to show: ',
    'Picture (optional): attach a square PNG or JPEG, at most 1 MB.',
  ];
  if (!browser) lines.push('Browser and version: ');
  lines.push('Operating system (optional): ');
  if (contest.kind === 'speed') lines.push('Hardware (optional): ');
  lines.push(
    '',
    'Delete the next line to opt out of the Hall of Fame (the entry is still verified, but not listed):',
    HALL_OF_FAME_LINE,
    '',
    RULE,
    '',
    `An entry for ${contest.title} (${contest.id}). The result file holds its score${contest.kind === 'methuselah' ? ', rules and seed' : ''}, the browser and the hash; the lab verifies it by replaying the run.`,
  );
  if (contest.kind === 'methuselah') {
    lines.push('', `${contest.title}'s Hall of Fame also shows the entry's rules and its seed's cell count, from the result file.`);
  }
  lines.push(
    '',
    'The picture must be yours to use, show no other people, and break nothing in the code of conduct. The lab resizes it to 128 x 128 and strips its metadata, and may decline a picture or a name.',
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
