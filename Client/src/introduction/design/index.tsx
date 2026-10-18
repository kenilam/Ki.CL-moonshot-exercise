import React, { useMemo } from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import {
  Card,
  Diagram,
  Heading,
  Layout,
  List,
  ListItem,
  Text,
} from 'design/components';

// Diagrams
import { services } from './services';

const POINTS = ['call', 'quote', 'rejection', 'store'] as const;

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
        <Card>
          <Diagram spec={spec} />
        </Card>
        <List gap='narrower'>
          {POINTS.map((point) => (
            <ListItem key={point}>
              {t('introduction.design.point', { context: point })}
            </ListItem>
          ))}
        </List>
      </section>
    </Layout>
  );
};

export { Design };
