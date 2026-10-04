import React, { useRef } from 'react';

import { useFormContext } from 'react-hook-form';

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
import { KIND_LABELS } from '@/constants';
import { EXAMPLES, type Example } from './examples/constants';

// API
import type { Kind } from '@/api';
import { KINDS } from '@server/review/constants';

// `Segmented` reports its value as a string.
const isKind = (value: string): value is Kind =>
  (KINDS as readonly string[]).includes(value);

const Kind: React.FunctionComponent = () => {
  const { control, getValues, setFocus, setValue } =
    useFormContext<ComposeValues>();

  /*
   * A click or tap on a kind moves on to the text. Arrow keys change the kind
   * too, one option per press, so those keep focus here or the next option
   * could never be reached.
   */
  const pointer = useRef(false);

  /*
   * An example nobody has touched follows the kind: the same example for the
   * new kind. Anything typed or edited, even by one character, is kept.
   */
  const swapExample = (previous: Kind, next: string) => {
    if (!isKind(next)) {
      return;
    }

    const text = getValues('text');
    const example = (Object.keys(EXAMPLES[previous]) as Example[]).find(
      (name) => EXAMPLES[previous][name] === text
    );

    if (example) {
      setValue('text', EXAMPLES[next][example], { shouldDirty: true });
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
            aria-label='Kind of text'
            name={field.name}
            onPointerDown={() => {
              pointer.current = true;
            }}
            onValueChange={(next) => {
              swapExample(field.value, next);
              field.onChange(next);

              if (pointer.current) {
                pointer.current = false;
                setFocus('text');
              }
            }}
            value={field.value}
          >
            {Object.entries(KIND_LABELS).map(([value, label]) => (
              <SegmentedItem key={value} value={value}>
                {label}
              </SegmentedItem>
            ))}
          </Segmented>
        </FormItem>
      )}
    />
  );
};

export { Kind };
