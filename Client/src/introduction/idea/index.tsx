import React from 'react';

// Components
import { Heading, Layout, Text } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

const Idea: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-labelledby='introduction-idea'>
        <Heading id='introduction-idea' is='h2'>
          {t('title', { context: 'idea' })}
        </Heading>
        <Text is='p'>{t('introduction.idea.habits')}</Text>
        <Text is='p'>{t('introduction.idea.edits')}</Text>
      </section>
    </Layout>
  );
};

export { Idea };
