import React, { useCallback, useMemo } from 'react';

// Libraries
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Routes
import { useNavigate } from 'design/router';

// Components
import { Button, Card, Form, Layout } from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// API
import { createReview, explain } from '@/api';

// Partials
import { RootError } from '@/root-error';
import { Allowance } from './allowance';
import { Text } from './text';

// Schema
import { composeSchema, type ComposeValues } from './schema';

const ComposeForm: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const navigate = useNavigate();
  const schema = useMemo(() => composeSchema(t), [t]);

  const form = useForm<ComposeValues>({
    defaultValues: { kind: 'commit', text: '' },
    resolver: valibotResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ kind, text }: ComposeValues) => {
      try {
        const review = await createReview(kind, text);

        navigate(review.id);
      } catch (error) {
        form.setError('root', { message: explain(t, error) });
      }
    },
    [form, navigate, t]
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
              after={
                isSubmitting && (
                  <Ri.RiLoader4Line aria-hidden className='is-revolving' />
                )
              }
              disabled={isSubmitting}
              level='confirm'
              size='small'
              type='submit'
            >
              {isSubmitting
                ? t('status', { context: 'reviewing' })
                : t('action', { context: 'review' })}
            </Button>
            <Allowance />
          </footer>
        </Layout>
      </Form>
    </Card>
  );
};

export { ComposeForm };
