// SPDX-License-Identifier: Apache-2.0
//
// Submitting a result by email (#79): the subject, the filled-in text and what it promises, and
// the mailto: link.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contestById } from '../../src/unbounded/contests.js';
import {
  SUBMIT_ADDRESS, HALL_OF_FAME_LINE, RULE, attachLine, emailSubject, emailBody, mailtoLink,
} from '../../src/contests/submit.js';

const SPEED = contestById('speed-1');
const HASH = 'a'.repeat(64);
const entry = (over = {}) => ({
  contest: SPEED,
  score: { generations: 412, ms: null },
  browser: { name: 'Chrome', version: '142.0.7444.59' },
  hash: HASH,
  fileName: 'speed-1-412.json',
  ...over,
});

test('the subject names the contest and the score', () => {
  assert.equal(emailSubject(SPEED, { generations: 412, ms: null }), '[Speed] 412 generations');
  assert.equal(emailSubject(SPEED, { generations: 1000, ms: 4210 }), '[Speed] 1,000 generations in 4.210 s');
  assert.equal(emailSubject(SPEED, { generations: 1000, ms: 3871 }), '[Speed] 1,000 generations in 3.871 s');
});

test('the text opens by saying to attach the result file, by name (#140)', () => {
  const lines = emailBody(entry()).split('\n');
  assert.equal(lines[0], attachLine('speed-1-412.json'));
  assert.equal(lines[0], "BEFORE SENDING: attach your result file, speed-1-412.json. Without it, this entry can't be verified.");
  assert.equal(lines[1], '');
});

/** The text above the rule, and below it. */
const halves = (body) => {
  const lines = body.split('\n');
  const at = lines.indexOf(RULE);
  assert.ok(at > 0, 'the text has its rule');
  assert.equal(lines.filter((line) => line === RULE).length, 1);
  return { top: lines.slice(0, at), bottom: lines.slice(at + 1).join('\n') };
};

test('above the rule: only what the entrant attaches and fills in (#140)', () => {
  const { top } = halves(emailBody(entry()));
  assert.deepEqual(top, [
    attachLine('speed-1-412.json'),
    '',
    'Name to show: ',
    'Picture (optional): attach a square PNG or JPEG, at most 1 MB.',
    'Operating system (optional): ',
    'Hardware (optional): ',
    '',
    'Delete the next line to opt out of the Hall of Fame (the entry is still verified, but not listed):',
    HALL_OF_FAME_LINE,
    '',
  ]);
  // The Hall of Fame line stands alone, so deleting it is deleting one line
  assert.ok(top.includes(HALL_OF_FAME_LINE));
  // The browser is in the result file: the text asks for it only when it wasn't detected
  assert.ok(!top.some((line) => line.startsWith('Browser')));
  assert.ok(halves(emailBody(entry({ browser: null }))).top.includes('Browser and version: '));
});

test("the text doesn't repeat what the result file holds: score, hash, file name past the first line", () => {
  const body = emailBody(entry());
  assert.doesNotMatch(body, /Score:|Hash:|Result file:/);
  assert.ok(!body.includes(HASH));
  assert.doesNotMatch(body, /Chrome 142/);
});

test('below the rule: the picture conditions, that the repo is public, how the address is used, and that Speed is self-reported', () => {
  const { bottom } = halves(emailBody(entry()));
  assert.match(bottom, /An entry for Speed \(speed-1\)\. The result file holds its score, the browser and the hash/);
  // The picture's conditions
  assert.match(bottom, /picture must be yours to use, show no other people, and break nothing in the code of conduct/);
  assert.match(bottom, /resizes it to 128 x 128 and strips its metadata/);
  assert.match(bottom, /may decline a picture or a name/);
  // The repo is public, and what removal can and can't do
  assert.match(bottom, /The lab's repo is public: once committed, your name and picture are in its history and in every copy of it\./);
  assert.match(bottom, /Removal on request .* can't erase every copy\./);
  // The email address
  assert.match(bottom, /Your email address is used only to reply about this entry\. It is never published, committed or put in a result file\./);
  // Speed's timing
  assert.match(bottom, /Speed's timing is self-reported: a replay proves the generation, not how long it took\./);
  assert.match(bottom, /screen recording of a run on lab\.morpheustech\.net/);
});

test("the rule is plain dashes, and never a signature's \"-- \"", () => {
  assert.match(RULE, /^-{20,}$/);
  assert.notEqual(RULE, '-- ');
});

test('the mailto: link opens the email, addressed, with the subject and text', () => {
  const subject = emailSubject(SPEED, { generations: 1000, ms: 4210 });
  const body = emailBody(entry({ score: { generations: 1000, ms: 4210 }, fileName: 'speed-1-1000-4210ms.json' }));
  const link = mailtoLink(subject, body);
  assert.equal(SUBMIT_ADDRESS, 'lab@morpheustech.net');
  assert.ok(link.startsWith('mailto:lab@morpheustech.net?subject='));
  const url = new URL(link);
  assert.equal(url.pathname, 'lab@morpheustech.net');
  assert.equal(url.searchParams.get('subject'), subject);
  assert.equal(url.searchParams.get('body'), body);
  // Spaces as %20, never +, which some mail apps keep as a plus
  assert.ok(!link.includes('+'));
  // Short enough for the mail apps with the tightest limits on a link's length
  assert.ok(link.length <= 2000, `${link.length} characters`);
});

// ---- Methuselah (#94) ----

const METHUSELAH = contestById('methuselah-1');
const RULES = { birth: [5, 7, 8], survival: [1, 4] };
const lasting = (over = {}) => entry({
  contest: METHUSELAH,
  score: { generations: 1234, period: 2 },
  ending: 'repeat',
  run: { rules: RULES, seed: [[0, 0, 0], [1, 0, 0], [2, 0, 0]] },
  fileName: 'methuselah-1-1234.json',
  ...over,
});

test("a Methuselah entry's subject states its score as it settled; the result file has its rules and seed", () => {
  assert.equal(emailSubject(METHUSELAH, { generations: 1234, period: 2 }, 'repeat'), '[Methuselah] settled at generation 1,234: period 2');
  assert.equal(emailSubject(METHUSELAH, { generations: 1234, period: 1 }, 'repeat'), '[Methuselah] settled at generation 1,234: a still life');
  assert.equal(emailSubject(METHUSELAH, { generations: 1234, period: 1 }, 'died'), '[Methuselah] died at generation 1,234');
  const { top, bottom } = halves(emailBody(lasting()));
  assert.equal(top[0], attachLine('methuselah-1-1234.json'));
  assert.ok(top.includes('Name to show: ') && top.includes(HALL_OF_FAME_LINE));
  // Nothing about hardware or timing: the score depends on the seed and rules alone. The
  // operating system is asked for, optionally, as for every contest
  assert.ok(!top.includes('Hardware (optional): '));
  assert.ok(top.includes('Operating system (optional): '));
  assert.doesNotMatch(bottom, /self-reported/);
  assert.match(bottom, /An entry for Methuselah \(methuselah-1\)\. The result file holds its score, rules and seed, the browser and the hash/);
  assert.match(bottom, /Methuselah's Hall of Fame also shows the entry's rules and its seed's cell count/);
  assert.doesNotMatch(emailBody(lasting()), /Rules:|Seed:/);
  // The promises are the same as for Speed
  assert.match(bottom, /Your email address is used only to reply about this entry\./);
  assert.match(bottom, /The lab's repo is public/);
  const body = emailBody(lasting());
  assert.ok(mailtoLink(emailSubject(METHUSELAH, lasting().score, 'repeat'), body).length <= 2000);
});

// ---- Classic Methuselah (#102) ----

test("a Classic Methuselah entry's email is Methuselah's, under its own name", () => {
  const CLASSIC = contestById('classic-methuselah-1');
  const { top, bottom } = halves(emailBody(lasting({ contest: CLASSIC, fileName: 'classic-methuselah-1-1234.json' })));
  assert.equal(top[0], attachLine('classic-methuselah-1-1234.json'));
  assert.match(bottom, /An entry for Classic Methuselah \(classic-methuselah-1\)/);
  assert.match(bottom, /Classic Methuselah's Hall of Fame also shows the entry's rules and its seed's cell count/);
  assert.equal(emailSubject(CLASSIC, { generations: 1234, period: 2 }, 'repeat'), '[Classic Methuselah] settled at generation 1,234: period 2');
});
