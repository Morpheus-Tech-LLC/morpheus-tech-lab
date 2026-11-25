// SPDX-License-Identifier: Apache-2.0
//
// The Atlas paper's inline markup (#186), parsed into a tree the page builds with the DOM, so
// formulas need neither innerHTML nor a math library. No DOM.
//
//   ^{…}            superscript, which may nest: 2^{2^{27}}
//   _{…}            subscript
//   *…*             italic, for the letters of a formula: *n*
//   [cite:a,b]      a citation of one or more sources: their short names, linked
//   [§id]           a link to a section of the paper, read as "section N"
//   [§id|words]     the same, with its own words

/**
 * @typedef {string
 *   | { type: 'sup' | 'sub' | 'em', children: Node[] }
 *   | { type: 'cite', keys: string[] }
 *   | { type: 'section', id: string, text?: string }} Node
 */

/**
 * @param {string} text
 * @returns {Node[]}
 */
export function parseInline(text) {
  let i = 0;

  const group = (closer) => {
    /** @type {Node[]} */
    const out = [];
    let plain = '';
    const flush = () => {
      if (plain) out.push(plain);
      plain = '';
    };
    while (i < text.length) {
      const c = text[i];
      if (closer && c === closer) {
        i++;
        flush();
        return out;
      }
      if ((c === '^' || c === '_') && text[i + 1] === '{') {
        flush();
        i += 2;
        out.push({ type: c === '^' ? 'sup' : 'sub', children: group('}') });
      } else if (c === '*' && closer !== '*') {
        flush();
        i++;
        out.push({ type: 'em', children: group('*') });
      } else if (c === '[' && (text.startsWith('[cite:', i) || text.startsWith('[§', i))) {
        flush();
        const end = text.indexOf(']', i);
        if (end < 0) throw new SyntaxError(`Unclosed "[" in: ${text}`);
        const inner = text.slice(i + 1, end);
        i = end + 1;
        if (inner.startsWith('cite:')) {
          out.push({ type: 'cite', keys: inner.slice(5).split(',').map((k) => k.trim()) });
        } else {
          const [id, words] = inner.slice(1).split('|');
          out.push(words ? { type: 'section', id, text: words } : { type: 'section', id });
        }
      } else {
        plain += c;
        i++;
      }
    }
    if (closer) throw new SyntaxError(`Unclosed "${closer === '}' ? '{' : closer}" in: ${text}`);
    flush();
    return out;
  };

  return group(null);
}

/**
 * The text a tree reads as, with superscripts as "^": for tests and for screen-reader labels.
 * @param {Node[]} nodes
 * @param {(id: string) => string} [sectionName]
 * @param {(key: string) => string} [citeName]
 */
export function plainText(nodes, sectionName = (id) => id, citeName = (key) => key) {
  return nodes.map((node) => {
    if (typeof node === 'string') return node;
    if (node.type === 'sup') return `^(${plainText(node.children, sectionName, citeName)})`;
    if (node.type === 'sub') return `_(${plainText(node.children, sectionName, citeName)})`;
    if (node.type === 'em') return plainText(node.children, sectionName, citeName);
    if (node.type === 'cite') return `(${node.keys.map(citeName).join('; ')})`;
    return node.text ?? sectionName(node.id);
  }).join('');
}

/**
 * Every node of a kind in a tree, for the tests' checks of citations and links.
 * @param {Node[]} nodes
 * @param {string} type
 * @returns {Node[]}
 */
export function nodesOfType(nodes, type) {
  return nodes.flatMap((node) => {
    if (typeof node === 'string') return [];
    const own = node.type === type ? [node] : [];
    return 'children' in node ? [...own, ...nodesOfType(node.children, type)] : own;
  });
}
