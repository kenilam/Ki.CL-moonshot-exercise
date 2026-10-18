import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import { Badge, Layout, List, ListItem, Text } from 'design/components';

const STEPS = ['pick', 'paste', 'decide'] as const;

const Intro: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-label={t('title', { context: 'how_it_works' })}>
        <Text is='p'>{t('intro')}</Text>
        <List gap='narrower' is='ol'>
          {STEPS.map((step, index) => (
            <ListItem
              alignItems='start'
              autoFlow='column'
              gap='narrow'
              justifyContent='start'
              key={step}
            >
              {/* The list numbers the steps for screen readers already. */}
              <Badge
                className='kicl-border-radius-lg kicl-text-align-center'
                size='small'
                aria-hidden
              >
                {index + 1}
              </Badge>
              {t('step', { context: step })}
            </ListItem>
          ))}
        </List>
      </section>
    </Layout>
  );
};

export { Intro };
