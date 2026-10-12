import type { TFunction } from 'i18next';
import * as v from 'valibot';

import { KINDS, MAX_LENGTH } from '@server/review/constants';

const composeSchema = (t: TFunction<'moonshot'>) =>
  v.object({
    kind: v.picklist(KINDS),
    text: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, t('error', { context: 'text_empty' })),
      v.maxLength(
        MAX_LENGTH,
        t('error', { context: 'text_too_long', max: MAX_LENGTH })
      )
    ),
  });

type ComposeValues = v.InferOutput<ReturnType<typeof composeSchema>>;

export { composeSchema };
export type { ComposeValues };
