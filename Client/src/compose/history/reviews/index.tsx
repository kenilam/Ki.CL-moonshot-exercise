import React from 'react';

// Components
import { Card, Heading, List } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useSummariesContext } from 'moonshot/compose/history/context';

// Partials
import { Review } from './review';

/** The user's last reviews. Nothing shows until there is at least one. */
const Reviews: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const reviews = useSummariesContext();

  if (!reviews.length) {
    return null;
  }

  return (
    <Card
      aria-labelledby='history'
      header={
        <Heading dense id='history' is='h2'>
          {t('title', { context: 'history' })}
        </Heading>
      }
      is='section'
    >
      <List>
        {reviews.map(({ id }) => {
          return <Review id={id} key={id} />;
        })}
      </List>
    </Card>
  );
};

export { Reviews };
