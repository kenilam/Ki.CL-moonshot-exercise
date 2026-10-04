import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { locate } from './locate';
import type { Proposed } from './schema';

const edit = (quote: string, replacement = ''): Proposed => ({
  quote,
  reason: 'test',
  replacement,
  rule: 'no-empty-qualifiers',
});

describe('locate', () => {
  test('finds a quote and returns its offsets', () => {
    const [found] = locate('It is essentially done.', [edit('essentially ')]);

    assert.equal(found.start, 6);
    assert.equal(found.end, 18);
  });

  test('drops a quote that is not in the text', () => {
    assert.deepEqual(locate('It is done.', [edit('robust')]), []);
  });

  test('drops a quote that appears more than once', () => {
    assert.deepEqual(locate('very very good', [edit('very')]), []);
  });

  test('drops a quote that overlaps itself', () => {
    assert.deepEqual(locate('aaa', [edit('aa')]), []);
  });

  test('keeps the first of two overlapping edits', () => {
    const found = locate('a robust and seamless API', [
      edit('robust and seamless ', ''),
      edit('seamless ', ''),
    ]);

    assert.equal(found.length, 1);
    assert.equal(found[0].quote, 'robust and seamless ');
  });

  test('drops an edit that changes nothing', () => {
    assert.deepEqual(locate('It works.', [edit('works', 'works')]), []);
  });

  test('returns edits in text order', () => {
    const found = locate('one two three', [edit('three'), edit('one')]);

    assert.deepEqual(
      found.map(({ quote }) => quote),
      ['one', 'three']
    );
  });
});
