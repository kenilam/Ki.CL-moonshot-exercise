import React from 'react';

import { useFormContext } from 'react-hook-form';

// Components
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Layout,
  Textarea,
} from 'design/components';

// Partials
import { Examples } from './examples';
import { Kind } from './kind';

// Styles
import './styles.css';

// Schema
import type { ComposeValues } from './schema';

import { MAX_LENGTH } from '@server/review/constants';

// Constants
import { KIND_FIELDS } from '@/constants';

const Text: React.FunctionComponent = () => {
  const { control, watch } = useFormContext<ComposeValues>();
  const kind = watch('kind');

  return (
    <FormField
      control={control}
      name='text'
      render={({ field }) => (
        <FormItem>
          <Layout
            alignItems='center'
            gap='narrow'
            justifyContent='space-between'
          >
            <div className='kicl--views--moonshot--compose--form__header'>
              <Kind />
              <FormLabel className='kicl-hidden-up-to-tablet'>
                {KIND_FIELDS[kind].label}
              </FormLabel>
              <Examples />
            </div>
          </Layout>
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
              placeholder={`Paste or type ${KIND_FIELDS[kind].noun}`}
              rows={14}
              spellCheck
            />
          </FormControl>
          <FormDescription>
            {field.value.length} / {MAX_LENGTH}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { Text };
