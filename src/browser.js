// SPDX-License-Identifier: Apache-2.0
//
// The browser's name and version, for a result file's details, the contests' results card and
// the email a contest entry is sent with. It is context for comparing results, never proof: a
// visitor can change it, and verification never reads it.
//
// Chromium browsers say who they are in navigator.userAgentData, which tells Edge, Opera, Brave
// and Chrome apart; the full version needs getHighEntropyValues(). Other browsers have only the
// user-agent string. Nothing else about the device is read: no operating system, no hardware.
//
// The page passes its navigator; the tests pass stand-ins, so nothing here touches the page.

/** A browser's name and version are text of at most this many characters (canonical.js checks it). */
export const MAX_BROWSER_TEXT = 100;

/**
 * Brand names in navigator.userAgentData, in the order they are preferred: every Chromium
 * browser also lists "Chromium", and Edge and Opera may list "Google Chrome" too.
 */
const BRANDS = [
  ['Microsoft Edge', 'Edge'],
  ['Opera GX', 'Opera GX'],
  ['Opera', 'Opera'],
  ['Brave', 'Brave'],
  ['Samsung Internet', 'Samsung Internet'],
  ['Google Chrome', 'Chrome'],
  ['Chromium', 'Chromium'],
];

/**
 * The browser's name and version.
 * @param {Navigator | object} [nav] - the page's navigator, or a stand-in
 * @returns {Promise<{name: string, version: string} | null>} null if it can't be told
 */
export async function detectBrowser(nav = globalThis.navigator) {
  if (!nav) return null;
  const data = nav.userAgentData;
  if (data && Array.isArray(data.brands)) {
    let list = data.brands;
    try {
      const high = await data.getHighEntropyValues?.(['fullVersionList']);
      if (Array.isArray(high?.fullVersionList) && high.fullVersionList.length) list = high.fullVersionList;
    } catch {
      // The browser may refuse; the brands' major versions will do
    }
    const found = browserOfBrands(list);
    if (found) return found;
  }
  return browserOf(nav.userAgent);
}

/**
 * The browser from navigator.userAgentData's brands or fullVersionList, or null. Brands it
 * doesn't know, such as the made-up "Not A;Brand" every list includes, are skipped.
 * @param {{brand: string, version: string}[]} list
 */
export function browserOfBrands(list) {
  if (!Array.isArray(list)) return null;
  for (const [brand, name] of BRANDS) {
    const entry = list.find((item) => item?.brand === brand);
    if (entry && typeof entry.version === 'string' && entry.version) {
      return { name, version: entry.version.slice(0, MAX_BROWSER_TEXT) };
    }
  }
  return null;
}

/**
 * The browser's name and version from its user-agent string, or null.
 * Order matters: Edge and Opera also say Chrome, and Chrome also says Safari.
 */
export function browserOf(userAgent) {
  const patterns = [
    ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ['Opera', /OPR\/([\d.]+)/],
    ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
    ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari\//],
  ];
  for (const [name, pattern] of patterns) {
    const match = pattern.exec(String(userAgent ?? ''));
    if (match) return { name, version: match[1].slice(0, MAX_BROWSER_TEXT) };
  }
  return null;
}
