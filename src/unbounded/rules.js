// SPDX-License-Identifier: Apache-2.0
//
// Rules for the unbounded Game of Life 3D: which neighbour counts bring a dead cell to life
// (birth) and which keep a live one alive (survival). A cell has 26 neighbours (faces, edges
// and corners), so every count is a whole number from 0 to 26.
//
// B0 rules, where a dead cell with no live neighbour is born, are refused. In a world without
// edges, B0 would bring all of empty space to life at once. Refusing B0 is also what lets the
// engine skip empty space exactly: a dead cell with no live neighbour stays dead.

export const MAX_NEIGHBOURS = 26;

export class RuleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RuleError';
  }
}

/**
 * Checks a rule and returns it in normal form: each list sorted, without duplicates.
 * @param {{birth: number[], survival: number[]}} rules
 * @returns {{birth: number[], survival: number[]}}
 * @throws {RuleError} if the rule isn't valid, or is a B0 rule
 */
export function validateRules(rules) {
  if (!rules || typeof rules !== 'object') {
    throw new RuleError('Rules must be an object with birth and survival lists.');
  }
  const birth = countList(rules.birth, 'birth');
  const survival = countList(rules.survival, 'survival');
  if (birth.includes(0)) {
    throw new RuleError(
      'Birth with 0 live neighbours (B0) is not allowed: every empty cell of an unbounded world ' +
      'would come to life at once. Remove 0 from the birth counts.'
    );
  }
  return { birth, survival };
}

function countList(list, name) {
  if (!Array.isArray(list)) {
    throw new RuleError(`The ${name} counts must be a list of numbers.`);
  }
  for (const n of list) {
    if (!Number.isInteger(n) || n < 0 || n > MAX_NEIGHBOURS) {
      throw new RuleError(
        `The ${name} counts must be whole numbers from 0 to ${MAX_NEIGHBOURS}; ${JSON.stringify(n)} is not.`
      );
    }
  }
  return [...new Set(list)].sort((a, b) => a - b);
}

/**
 * The rule as a lookup table: entry `alive * 27 + count` is 1 if a cell in that state, with
 * that many live neighbours, is alive in the next generation.
 * @param {{birth: number[], survival: number[]}} rules - already validated
 * @returns {Uint8Array}
 */
export function ruleTable(rules) {
  const table = new Uint8Array(2 * (MAX_NEIGHBOURS + 1));
  for (const n of rules.birth) table[n] = 1;
  for (const n of rules.survival) table[MAX_NEIGHBOURS + 1 + n] = 1;
  return table;
}
