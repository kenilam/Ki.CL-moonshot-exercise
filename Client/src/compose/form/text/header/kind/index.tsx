import React from 'react';

// Components
import {
  FormField,
  Segmented,
  SegmentedItem,
  useFormContext,
} from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';
import { useSwapExample } from './use-swap-example';

// Schema
import type { ComposeValues } from 'moonshot/compose/form/schema';

// API
import { KINDS } from 'moonshot/shared/review';

const Kind: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { control, setFocus } = useFormContext<ComposeValues>();
  const swapExample = useSwapExample();

  return (
    <FormField
      control={control}
      name='kind'
      render={({ field }) => (
        <Segmented
          collapse='popover'
          aria-label={t('label', { context: 'kind' })}
          name={field.name}
          onValueChange={(next, { pointer }) => {
            swapExample(field.value, next);
            field.onChange(next);

            // A click or tap moves on to the text. Arrow keys keep focus
            // here, so the next option can still be reached.
            if (pointer) {
              setFocus('text');
            }
          }}
          value={field.value}
        >
          {KINDS.map((kind) => (
            <SegmentedItem key={kind} value={kind}>
              {t('kind', { context: kind })}
            </SegmentedItem>
          ))}
        </Segmented>
      )}
    />
  );
};

export { Kind };
