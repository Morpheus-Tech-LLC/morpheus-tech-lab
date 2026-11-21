// SPDX-License-Identifier: Apache-2.0
//
// Telling the browser's name and version, from navigator.userAgentData or the user-agent string.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectBrowser, browserOf, browserOfBrands } from '../src/browser.js';

const UA = {
  chrome: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36 Edg/152.0.1.2',
  opera: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 OPR/136.0.0.0',
  firefox: 'Mozilla/5.0 (X11; Linux x86_64; rv:155.0) Gecko/20100101 Firefox/155.0',
  firefoxIos: 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/155.0 Mobile/15E148 Safari/605.1.15',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
  safariIos: 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  samsung: 'Mozilla/5.0 (Linux; Android 15; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/140.0.0.0 Mobile Safari/537.36',
};

/** A Chromium navigator: brands with major versions, and the full list on request. */
function chromium(userAgent, list, { refuse = false } = {}) {
  return {
    userAgent,
    userAgentData: {
      brands: list.map(({ brand, version }) => ({ brand, version: version.split('.')[0] })),
      getHighEntropyValues: async (hints) => {
        if (refuse) throw new Error('NotAllowedError');
        return hints.includes('fullVersionList') ? { fullVersionList: list } : {};
      },
    },
  };
}

test('the browser is named from its user-agent string', () => {
  assert.deepEqual(browserOf(UA.chrome), { name: 'Chrome', version: '152.0.0.0' });
  assert.deepEqual(browserOf(UA.edge), { name: 'Edge', version: '152.0.1.2' });
  assert.deepEqual(browserOf(UA.opera), { name: 'Opera', version: '136.0.0.0' });
  assert.deepEqual(browserOf(UA.firefox), { name: 'Firefox', version: '155.0' });
  assert.deepEqual(browserOf(UA.firefoxIos), { name: 'Firefox', version: '155.0' });
  assert.deepEqual(browserOf(UA.safari), { name: 'Safari', version: '26.0' });
  assert.deepEqual(browserOf(UA.safariIos), { name: 'Safari', version: '26.0' });
  assert.deepEqual(browserOf(UA.samsung), { name: 'Samsung Internet', version: '29.0' });
  assert.equal(browserOf('curl/8.0'), null);
  assert.equal(browserOf(undefined), null);
});

test('Chromium browsers are told apart by their brands, with the full version', async () => {
  const grease = { brand: 'Not_A Brand', version: '24.0.0.0' };
  const chromiumBrand = { brand: 'Chromium', version: '152.0.7444.59' };
  const cases = [
    [UA.chrome, [grease, chromiumBrand, { brand: 'Google Chrome', version: '152.0.7444.59' }], 'Chrome', '152.0.7444.59'],
    [UA.edge, [chromiumBrand, grease, { brand: 'Microsoft Edge', version: '152.0.3485.66' }], 'Edge', '152.0.3485.66'],
    [UA.opera, [{ brand: 'Opera', version: '136.0.6000.10' }, grease, chromiumBrand], 'Opera', '136.0.6000.10'],
    // Brave's user agent says Chrome; only its brand tells it apart
    [UA.chrome, [{ brand: 'Brave', version: '152.0.0.0' }, chromiumBrand, grease], 'Brave', '152.0.0.0'],
    // A Chromium build with no brand of its own
    [UA.chrome, [grease, chromiumBrand], 'Chromium', '152.0.7444.59'],
  ];
  for (const [userAgent, list, name, version] of cases) {
    assert.deepEqual(await detectBrowser(chromium(userAgent, list)), { name, version }, name);
  }
});

test('if the full version is refused, the brands\' major version is used', async () => {
  const nav = chromium(UA.edge, [{ brand: 'Microsoft Edge', version: '152.0.3485.66' }, { brand: 'Chromium', version: '152.0.0.0' }], { refuse: true });
  assert.deepEqual(await detectBrowser(nav), { name: 'Edge', version: '152' });
});

test('without userAgentData, or with no known brand, the user-agent string is read', async () => {
  assert.deepEqual(await detectBrowser({ userAgent: UA.firefox }), { name: 'Firefox', version: '155.0' });
  assert.deepEqual(await detectBrowser({ userAgent: UA.safari }), { name: 'Safari', version: '26.0' });
  const unknown = { userAgent: UA.chrome, userAgentData: { brands: [{ brand: 'Not_A Brand', version: '24' }] } };
  assert.deepEqual(await detectBrowser(unknown), { name: 'Chrome', version: '152.0.0.0' });
  assert.equal(await detectBrowser(null), null);
  assert.equal(browserOfBrands('not a list'), null);
});

test('a browser name or version is cut to 100 characters', () => {
  const long = '1.'.repeat(80);
  assert.equal(browserOfBrands([{ brand: 'Google Chrome', version: long }]).version.length, 100);
});
