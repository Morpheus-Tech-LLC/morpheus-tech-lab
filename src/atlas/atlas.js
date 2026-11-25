// SPDX-License-Identifier: Apache-2.0
//
// The Atlas (#185, #186): the lab's working paper on Game of Life 3D, opened by the Atlas button
// between Info and the Contests banner. It opens on its contents; each section is a page of its
// own, with Back and Next between them, and the last page lists every source the paper cites. The
// Lexicon joins it later (#108). Like the guide, it covers the lab, which waits behind it paused;
// the Atlas button stays above it, pressed, and closes it, as do Close and Esc. The words are
// paper.js's, built with the DOM from markup.js's tree: it sets only textContent.

import {
  SECTIONS, PARTS, READABLE, SOURCES, TITLE, SUBTITLE, REVISION, ABSTRACT, HOW_TO_CITE, SITE, REPO,
  sourcesInOrder, citation,
} from './paper.js';
import { parseInline } from './markup.js';

const CONTENTS = 'contents';
const SOURCES_PAGE = 'sources';
/** Back and Next walk the pages in this order */
const PAGES = [CONTENTS, ...READABLE.map((s) => s.id), SOURCES_PAGE];
/** Sources comes after the last section, as its own numbered section */
const SOURCES_NUMBER = SECTIONS.length + 1;

let els = null;
let hooks = null;
let page = CONTENTS;
let open = false;
let labWasPlaying = false;

/** @returns {boolean} whether the Atlas is open; the lab skips drawing behind it */
export function isAtlasOpen() {
  return open;
}

/**
 * Wires the Atlas button and the Atlas.
 * @param {object} options
 * @param {() => boolean} options.pauseLab - pauses a playing simulation; true if it was playing
 * @param {() => void} options.resumeLab - plays it again
 * @param {() => void} [options.beforeOpen] - closes whatever else covers the lab (the guide)
 */
export function initAtlas(options) {
  hooks = options;
  const $ = (id) => document.getElementById(id);
  els = {
    button: $('atlas-button'),
    atlas: $('atlas'),
    backdrop: $('atlas-backdrop'),
    count: $('atlas-count'),
    page: $('atlas-page'),
    back: $('atlas-back'),
    next: $('atlas-next'),
  };
  if (!els.button || !els.atlas) return;

  els.button.addEventListener('click', () => (open ? closeAtlas() : openAtlas()));
  $('atlas-close')?.addEventListener('click', () => closeAtlas());
  $('atlas-contents-button')?.addEventListener('click', () => go(CONTENTS));
  els.backdrop?.addEventListener('click', () => closeAtlas());
  els.back.addEventListener('click', () => go(PAGES[PAGES.indexOf(page) - 1]));
  els.next.addEventListener('click', () => go(PAGES[PAGES.indexOf(page) + 1]));
  // The other top-bar buttons stay clickable above the Atlas: Info and Contests close it first.
  // In the capture phase, so it has closed before their own handlers run
  for (const id of ['info-button', 'contests-banner']) {
    $(id)?.addEventListener('click', () => open && closeAtlas(() => {}), true);
  }
  // In the capture phase, so Esc closes the Atlas before anything behind it hears the key
  document.addEventListener('keydown', onKey, true);
}

/**
 * Opens the Atlas, on its contents or the page given.
 * @param {string} [at] - a section's id, 'contents' or 'sources'
 */
export function openAtlas(at = CONTENTS) {
  if (!els) return;
  if (open) {
    go(at);
    return;
  }
  hooks.beforeOpen?.();
  open = true;
  labWasPlaying = hooks.pauseLab();
  document.body.classList.add('atlas-open');
  els.button.setAttribute('aria-expanded', 'true');
  els.button.setAttribute('aria-pressed', 'true');
  // Everything else on the page is out of reach while the Atlas is open, but the top bar
  for (const child of document.body.children) {
    if (child !== els.atlas && child !== els.backdrop && !child.contains(els.button) && child.tagName !== 'SCRIPT') {
      child.inert = true;
      child.dataset.atlasInert = '';
    }
  }
  els.backdrop.hidden = false;
  els.atlas.hidden = false;
  go(at);
}

/**
 * Closes the Atlas, and plays the lab again if it was playing.
 * @param {() => void} [then] - what to do once it has closed, in place of focusing its button
 */
export function closeAtlas(then) {
  if (!open) return;
  open = false;
  els.atlas.hidden = true;
  els.backdrop.hidden = true;
  for (const child of document.querySelectorAll('[data-atlas-inert]')) {
    child.inert = false;
    delete child.dataset.atlasInert;
  }
  document.body.classList.remove('atlas-open');
  els.button.setAttribute('aria-expanded', 'false');
  els.button.setAttribute('aria-pressed', 'false');
  if (labWasPlaying) hooks.resumeLab();
  labWasPlaying = false;
  if (then) then();
  else els.button.focus();
}

function onKey(event) {
  if (!open || event.defaultPrevented) return;
  const plain = !event.altKey && !event.metaKey && !event.ctrlKey && !event.shiftKey;
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeAtlas();
  } else if (event.key === 'ArrowRight' && plain && !els.next.disabled) {
    event.preventDefault();
    els.next.click();
  } else if (event.key === 'ArrowLeft' && plain && !els.back.disabled) {
    event.preventDefault();
    els.back.click();
  }
}

/** @param {string} to - a page of PAGES */
function go(to) {
  if (!PAGES.includes(to)) to = CONTENTS;
  page = to;
  const i = PAGES.indexOf(page);
  const section = SECTIONS.find((s) => s.id === page);
  els.count.textContent = page === CONTENTS ? 'Contents'
    : `${section ? section.number : SOURCES_NUMBER} / ${SOURCES_NUMBER}`;
  els.back.disabled = i === 0;
  els.next.disabled = i === PAGES.length - 1;
  els.back.textContent = i === 1 ? 'Contents' : 'Back';
  els.next.textContent = i === 0 ? 'Start reading' : 'Next';
  els.atlas.dataset.page = page;
  els.page.replaceChildren(...(page === CONTENTS ? contentsPage() : page === SOURCES_PAGE ? sourcesPage() : sectionPage(section)));
  els.page.scrollTop = 0;
  // Keep focus inside: on Next, or Back on the last page
  const target = els.next.disabled ? els.back : els.next;
  if (!els.atlas.contains(document.activeElement) || document.activeElement.disabled) target.focus();
}

// ---- Building the pages ----

const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};

function externalLink(href, text, title) {
  const a = make('a', '', text);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  if (title) a.title = title;
  return a;
}

function pageLink(to, text, label) {
  const button = make('button', 'atlas-xref', text);
  button.type = 'button';
  if (label) button.setAttribute('aria-label', label);
  button.addEventListener('click', () => go(to));
  return button;
}

function sectionName(id) {
  const section = SECTIONS.find((s) => s.id === id);
  return section ? `section ${section.number}` : id;
}

/** The DOM for a line of the paper's markup. */
function inline(text) {
  const build = (nodes) => nodes.map((node) => {
    if (typeof node === 'string') return document.createTextNode(node);
    if (node.type === 'sup' || node.type === 'sub' || node.type === 'em') {
      const el = make(node.type);
      el.append(...build(node.children));
      return el;
    }
    if (node.type === 'cite') {
      const span = make('span', 'atlas-cite');
      span.append('(');
      node.keys.forEach((key, i) => {
        if (i) span.append('; ');
        const source = SOURCES[key];
        span.append(source.url ? externalLink(source.url, source.short, citation(source)) : source.short);
      });
      span.append(')');
      return span;
    }
    return pageLink(node.id, node.text ?? sectionName(node.id));
  });
  return build(parseInline(text));
}

function paragraph(text, className = '') {
  const p = make('p', className);
  p.append(...inline(text));
  return p;
}

function block(b) {
  switch (b.type) {
    case 'p': return paragraph(b.text);
    case 'math': return paragraph(b.text, 'atlas-math');
    case 'h': return make('h4', 'atlas-subhead', b.text);
    case 'note': {
      const p = paragraph(b.text, 'atlas-note');
      p.prepend(make('strong', '', 'Note. '));
      return p;
    }
    case 'proof': {
      const div = make('div', 'atlas-proof');
      b.text.forEach((text, i) => {
        const p = paragraph(text);
        if (i === 0) p.prepend(make('em', 'atlas-proof-label', 'Proof. '));
        if (i === b.text.length - 1) p.append(make('span', 'atlas-qed', ' ∎'));
        div.append(p);
      });
      return div;
    }
    case 'table': {
      const wrap = make('div', 'atlas-table-wrap');
      wrap.tabIndex = 0; // a wide table scrolls on its own, by keyboard too
      const table = make('table', 'atlas-table');
      const caption = make('caption');
      caption.append(...inline(b.caption));
      const head = make('tr');
      head.append(...b.head.map((text) => {
        const th = make('th');
        th.scope = 'col';
        th.append(...inline(text));
        return th;
      }));
      const thead = make('thead');
      thead.append(head);
      const tbody = make('tbody');
      for (const row of b.rows) {
        const tr = make('tr');
        row.forEach((text, i) => {
          const cell = make(i === 0 ? 'th' : 'td');
          if (i === 0) cell.scope = 'row';
          cell.append(...inline(text));
          tr.append(cell);
        });
        tbody.append(tr);
      }
      table.append(caption, thead, tbody);
      wrap.append(table);
      return wrap;
    }
    default: throw new Error(`Unknown block type: ${b.type}`);
  }
}

function contentsPage() {
  const out = [];
  const title = make('h3', 'atlas-title', TITLE);
  const sub = make('p', 'atlas-subtitle', SUBTITLE);
  const rev = make('p', 'atlas-revision', `Revision ${REVISION.number} · ${REVISION.date}`);
  out.push(title, sub, rev, ...ABSTRACT.map((text) => paragraph(text, 'atlas-abstract')));

  const numerals = ['I', 'II', 'III', 'IV', 'V'];
  Object.entries(PARTS).forEach(([part, name], i) => {
    out.push(make('h4', 'atlas-part', `Part ${numerals[i]} · ${name}`));
    const list = make('ol', 'atlas-toc');
    for (const section of SECTIONS.filter((s) => s.part === Number(part))) {
      const li = make('li', section.comingSoon ? 'atlas-toc-item atlas-toc-item--soon' : 'atlas-toc-item');
      li.dataset.section = section.id;
      if (section.comingSoon) {
        li.append(make('span', 'atlas-toc-name', `${section.number}. ${section.title}`), make('span', 'atlas-soon', section.comingSoon));
      } else {
        li.append(pageLink(section.id, `${section.number}. ${section.title}`));
      }
      li.append(make('span', 'atlas-toc-summary', section.summary));
      list.append(li);
    }
    // The Lexicon, after the section that will cite it
    if (Number(part) === 2) {
      const lexicon = make('li', 'atlas-toc-item atlas-toc-item--soon atlas-toc-item--lexicon');
      lexicon.append(make('span', 'atlas-toc-name', 'The Lexicon'), make('span', 'atlas-soon', 'Coming soon'),
        make('span', 'atlas-toc-summary', 'The creations found in the lab’s rules: who found each one and when, each ready to open in the simulator.'));
      list.append(lexicon);
    }
    // The sources close the last part
    if (i === Object.keys(PARTS).length - 1) {
      const sources = make('li', 'atlas-toc-item');
      sources.dataset.section = SOURCES_PAGE;
      sources.append(pageLink(SOURCES_PAGE, `${SOURCES_NUMBER}. Sources`), make('span', 'atlas-toc-summary', 'Every work the paper cites.'));
      list.append(sources);
    }
    out.push(list);
  });

  out.push(make('h4', 'atlas-part', 'How to cite this paper'));
  const cite = make('p', 'atlas-cite-as');
  cite.append(HOW_TO_CITE.replace(SITE, ''), externalLink(SITE, SITE.replace(/^https:\/\//, '')));
  out.push(cite);
  const invite = make('p', 'atlas-abstract');
  invite.append('To question this paper or improve it, start a Discussion or open a pull request on ',
    externalLink(REPO, 'GitHub'), '.');
  out.push(invite);
  return out;
}

function sectionPage(section) {
  return [make('h3', 'atlas-title', `${section.number}. ${section.title}`), ...section.blocks.map(block)];
}

function sourcesPage() {
  const out = [make('h3', 'atlas-title', `${SOURCES_NUMBER}. Sources`)];
  out.push(make('p', 'atlas-abstract', 'Every claim in this paper that isn’t worked out in it comes from the work below. The counts are proved in the paper, and the lab’s tests check each one by computation.'));
  const list = make('ol', 'atlas-sources-list');
  for (const key of sourcesInOrder()) {
    const source = SOURCES[key];
    const li = make('li');
    li.append(`${source.authors}${source.year ? ` (${source.year})` : ''}. `, make('cite', '', source.title), `. ${source.venue}.`);
    if (source.url) li.append(' ', externalLink(source.url, source.url.replace(/^https:\/\//, '')));
    const where = SECTIONS.filter((s) => sourcesInOrder([s]).includes(key));
    const cited = make('span', 'atlas-source-where', ` Cited in section${where.length > 1 ? 's' : ''} `);
    where.forEach((s, i) => {
      if (i) cited.append(', ');
      cited.append(pageLink(s.id, String(s.number), `Section ${s.number}, ${s.title}`));
    });
    cited.append('.');
    li.append(cited);
    list.append(li);
  }
  out.push(list);
  return out;
}
