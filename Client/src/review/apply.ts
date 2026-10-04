import type { Review } from '@/api';

type Edit = Review['edits'][number];
type Decision = 'accepted' | 'rejected';
type Decisions = Record<string, Decision>;

/** The text cut into plain runs and edits, in order, for rendering. */
type Segment = { text: string } | { edit: Edit };

/** Edits come back sorted and non-overlapping; the server guarantees both. */
function segment(text: string, edits: Edit[]): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const edit of edits) {
    if (edit.start > cursor) {
      segments.push({ text: text.slice(cursor, edit.start) });
    }

    segments.push({ edit });
    cursor = edit.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments;
}

/** The text with the accepted edits applied. Pending ones are left as they were. */
const apply = (text: string, edits: Edit[], decisions: Decisions) =>
  segment(text, edits)
    .map((part) =>
      'text' in part
        ? part.text
        : decisions[part.edit.id] === 'accepted'
          ? part.edit.replacement
          : part.edit.quote
    )
    .join('');

export { apply, segment };
export type { Decision, Decisions, Edit, Segment };
