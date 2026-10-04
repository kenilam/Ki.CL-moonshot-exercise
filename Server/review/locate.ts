import type { Edit, Proposed } from './schema';

/**
 * Turns the model's quoted edits into offsets in the original text.
 *
 * The model never gives positions; it quotes the text it wants to change, and
 * this finds the quote. An edit is dropped when its quote is missing, appears
 * more than once, overlaps an edit already kept, or changes nothing. A dropped
 * edit costs one suggestion; a misplaced one would corrupt the user's text.
 */
function locate(text: string, proposed: Proposed[]): Edit[] {
  const kept: Edit[] = [];

  for (const edit of proposed) {
    if (!edit.quote || edit.quote === edit.replacement) {
      continue;
    }

    const start = text.indexOf(edit.quote);

    if (start === -1 || text.indexOf(edit.quote, start + 1) !== -1) {
      continue;
    }

    const end = start + edit.quote.length;
    const overlaps = kept.some(
      (other) => start < other.end && other.start < end
    );

    if (overlaps) {
      continue;
    }

    kept.push({ ...edit, end, id: `${start}-${end}`, start });
  }

  return kept.sort((a, b) => a.start - b.start);
}

export { locate };
