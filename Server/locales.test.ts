import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { ERROR_CODES } from './api/errors';
import { RULES } from './review/rules';

/*
 * The client shows rules and errors in its own words, from its `moonshot`
 * namespace. These fail when the server gains a rule or a code it has no
 * words for, or when a rule's text changes in one place only.
 */
const copy: Record<string, unknown> = JSON.parse(
  readFileSync(
    new URL('../Client/src/locales/en-US/moonshot.json', import.meta.url),
    'utf8'
  )
);

test('every rule reads the same in the client as in the prompt', () => {
  for (const { guidance, id, name } of RULES) {
    assert.equal(copy[`rule_${id}`], name);
    assert.equal(copy[`rule_guidance_${id}`], guidance);
  }
});

test('the client has a sentence for every code', () => {
  // A rejection carries the model's own sentence instead.
  for (const code of ERROR_CODES.filter((code) => code !== 'rejected')) {
    assert.equal(typeof copy[`error_${code}`], 'string', code);
  }
});
