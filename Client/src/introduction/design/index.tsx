import React, { useMemo } from 'react';

// Components
import { Card, Diagram, Heading, Layout, List, Text } from 'design/components';

// Diagrams
import { services } from './services';

// Hooks
import { useTranslation } from 'design/hooks';

// Partials
import { Point } from './point';

// Constants
import { POINTS } from './constants';

const Design: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const spec = useMemo(() => services(t), [t]);

  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-labelledby='introduction-design'>
        <Heading id='introduction-design' is='h2'>
          {t('title', { context: 'design' })}
        </Heading>
        <Text is='p'>{t('introduction.design.architecture')}</Text>
        <Card is='section'>
          <Diagram spec={spec} />
        </Card>
        <List gap='narrower'>
          {POINTS.map((point) => {
            return <Point key={point} point={point} />;
          })}
        </List>
      </section>
    </Layout>
  );
};

export { Design };
