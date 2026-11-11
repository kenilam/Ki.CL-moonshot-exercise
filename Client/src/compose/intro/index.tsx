import React from 'react';

// Components
import { Layout, List, Text } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Partials
import { Step } from './step';

// Constants
import { STEPS } from './constants';

const Intro: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-label={t('title', { context: 'how_it_works' })}>
        <Text is='p'>{t('intro')}</Text>
        <List gap='narrower' is='ol'>
          {STEPS.map((step) => {
            return <Step key={step} step={step} />;
          })}
        </List>
      </section>
    </Layout>
  );
};

export { Intro };
