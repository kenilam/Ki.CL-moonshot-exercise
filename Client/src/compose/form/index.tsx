import React, { useCallback } from 'react';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';

// Routes
import { useNavigate } from 'design/router';

// Components
import { Button, Card, Form, Layout } from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// API
import { createReview } from '@/api';

// Partials
import { RootError } from '@/root-error';
import { Allowance } from './allowance';
import { Text } from './text';

// Schema
import { ComposeSchema, type ComposeValues } from './schema';

const ComposeForm: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const form = useForm<ComposeValues>({
    defaultValues: { kind: 'commit', text: '' },
    resolver: valibotResolver(ComposeSchema),
  });

  const onSubmit = useCallback(
    async ({ kind, text }: ComposeValues) => {
      try {
        const review = await createReview(kind, text);

        navigate(review.id);
      } catch (error) {
        form.setError('root', {
          message: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [form, navigate]
  );

  const { isSubmitting } = form.formState;

  return (
    <Card is='section' variant='ghost'>
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <Layout gap='narrow'>
          <section>
            <Text />
            <RootError />
          </section>
        </Layout>
        <Layout
          alignItems='center'
          autoFlow='column'
          gap='narrow'
          justifyContent='space-between'
        >
          <footer>
            <Button
              disabled={isSubmitting}
              level='confirm'
              size='small'
              type='submit'
            >
              {isSubmitting ? 'Reviewing' : 'Review'}
              {isSubmitting ? (
                <Ri.RiLoader4Line aria-hidden className='is-revolving' />
              ) : null}
            </Button>
            <Allowance />
          </footer>
        </Layout>
      </Form>
    </Card>
  );
};

export { ComposeForm };
