import React from 'react';

// Components
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
  useFormContext,
} from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Partials
import { Header } from './header';

// Schema
import type { ComposeValues } from 'moonshot/compose/form/schema';

import { MAX_LENGTH } from 'moonshot/shared/review';

const Text: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { control, watch } = useFormContext<ComposeValues>();
  const kind = watch('kind');

  return (
    <FormField
      control={control}
      name='text'
      render={({ field }) => (
        <FormItem>
          <Header />
          <FormControl>
            {/*
             * The page has one job, pasting text, so the field starts with
             * focus. Mind that it skips the heading for screen readers and
             * opens the keyboard on phones.
             */}
            <Textarea
              {...field}
              // oxlint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              maxLength={MAX_LENGTH}
              placeholder={t('placeholder', { context: kind })}
              rows={14}
              spellCheck
            />
          </FormControl>
          <FormDescription>
            {t('text_length', {
              length: field.value.length,
              max: MAX_LENGTH,
            })}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { Text };
