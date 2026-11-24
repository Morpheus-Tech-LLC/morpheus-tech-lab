// SPDX-License-Identifier: Apache-2.0
//
// The page loads its fonts from the site itself, never from Google's font servers, which would
// receive every visitor's IP address. Roboto Mono comes from npm (@fontsource/roboto-mono),
// imported in main.js, and Vite serves its files with the site.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const GOOGLE_FONTS = /fonts\.(googleapis|gstatic)\.com/;

/** index.html and every .js, .css and .html file under src/. */
function shipped() {
  const files = ['index.html'];
  const walk = (dir) => {
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(js|css|html)$/.test(entry.name)) files.push(path);
    }
  };
  walk('src');
  return files;
}

test("no page or source file loads a font from Google's servers", () => {
  const found = shipped().filter((file) => GOOGLE_FONTS.test(readFileSync(join(root, file), 'utf8')));
  assert.deepEqual(found, []);
});

test('Roboto Mono, which the styles name, is imported from npm in main.js', () => {
  const main = readFileSync(join(root, 'src/main.js'), 'utf8');
  assert.match(main, /import '@fontsource\/roboto-mono\/400\.css';/);
  assert.match(main, /import '@fontsource\/roboto-mono\/600\.css';/);
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.ok(pkg.dependencies['@fontsource/roboto-mono']);
});
