import * as v from 'valibot';

import { KINDS, MAX_LENGTH } from '@server/review/constants';

export const ComposeSchema = v.object({
  kind: v.picklist(KINDS),
  text: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Paste the text to review.'),
    v.maxLength(MAX_LENGTH, `Keep it under ${MAX_LENGTH} characters.`)
  ),
});

export type ComposeValues = v.InferOutput<typeof ComposeSchema>;
