import React from 'react';

// Libraries
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Components
import {
  FormField,
  FormItem,
  Segmented,
  SegmentedItem,
} from 'design/components';

// Schema
import type { ComposeValues } from './schema';

// Constants
import { EXAMPLES } from './examples/constants';

// API
import type { Kind } from '@/api';
import { KINDS } from '@server/review/constants';

// `Segmented` reports its value as a string.
const isKind = (value: string): value is Kind =>
  (KINDS as readonly string[]).includes(value);

const Kind: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { control, getValues, setFocus, setValue } =
    useFormContext<ComposeValues>();

  /*
   * An example nobody has touched follows the kind: the same example for the
   * new kind. Anything typed or edited, even by one character, is kept.
   */
  const swapExample = (previous: Kind, next: string) => {
    if (!isKind(next)) {
      return;
    }

    const text = getValues('text');
    const example = EXAMPLES.find(
      (name) => t(`examples.${previous}.${name}`) === text
    );

    if (example) {
      setValue('text', t(`examples.${next}.${example}`), {
        shouldDirty: true,
      });
    }
  };

  return (
    <FormField
      control={control}
      name='kind'
      render={({ field }) => (
        <FormItem>
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
        </FormItem>
      )}
    />
  );
};

export { Kind };
