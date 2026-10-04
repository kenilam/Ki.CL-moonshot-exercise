import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { apply, segment, type Edit } from './apply';

const TEXT = 'We leverage a robust cache.';

const edits: Edit[] = [
  {
    end: 11,
    id: '3-11',
    quote: 'leverage',
    reason: 'Corporate.',
    replacement: 'use',
    rule: 'no-corporate',
    start: 3,
  },
  {
    end: 21,
    id: '14-21',
    quote: 'robust ',
    reason: 'Says nothing.',
    replacement: '',
    rule: 'no-empty-qualifiers',
    start: 14,
  },
];

describe('apply', () => {
  test('leaves the text alone with no decisions', () => {
    assert.equal(apply(TEXT, edits, {}), TEXT);
  });

  test('applies accepted edits only', () => {
    assert.equal(
      apply(TEXT, edits, { '3-11': 'accepted', '14-21': 'rejected' }),
      'We use a robust cache.'
    );
  });

  test('applies every accepted edit', () => {
    assert.equal(
      apply(TEXT, edits, { '3-11': 'accepted', '14-21': 'accepted' }),
      'We use a cache.'
    );
  });
});

describe('segment', () => {
  test('alternates plain runs and edits', () => {
    assert.deepEqual(
      segment(TEXT, edits).map((part) =>
        'text' in part ? part.text : part.edit.id
      ),
      ['We ', '3-11', ' a ', '14-21', 'cache.']
    );
  });
});
