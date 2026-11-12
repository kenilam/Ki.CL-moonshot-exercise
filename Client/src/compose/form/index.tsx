import React from 'react';

// Components
import { Card, Form, FormMessage, Layout } from 'design/components';

// Hooks
import { useCompose } from './use-compose';

// Partials
import { Allowance } from './allowance';
import { Submit } from './submit';
import { Text } from './text';

const ComposeForm: React.FunctionComponent = () => {
  const { form, onSubmit } = useCompose();

  return (
    <Card is='section' variant='secondary'>
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <Layout gap='narrow'>
          <section>
            <Text />
            <FormMessage name='root' />
          </section>
        </Layout>
        <Layout
          alignItems='center'
          autoFlow='column'
          gap='narrow'
          justifyContent='space-between'
        >
          <footer>
            <Submit />
            <Allowance />
          </footer>
        </Layout>
      </Form>
    </Card>
  );
};

export { ComposeForm };
