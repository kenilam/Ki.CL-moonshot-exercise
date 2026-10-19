import React, { useEffect, useState } from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Icons
import * as Ri from 'react-icons/ri';

// Components
import {
  Badge,
  Card,
  CardContent,
  Heading,
  HyperLink,
  List,
} from 'design/components';

// API
import { listReviews, type Summary } from '@/api';

// Constants
import { KIND_LEVELS } from '@/constants';

const date = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** The user's last reviews. Nothing shows until there is at least one. */
const History: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const [reviews, setReviews] = useState<Summary[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setReviews(await listReviews());
      } catch {
        // Stays hidden.
      }
    };

    void load();
  }, []);

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
        {reviews.map(({ createdAt, editCount, excerpt, id, kind }) => (
          <Card is='li' key={id}>
            <Badge level={KIND_LEVELS[kind]} size='small'>
              {t('kind', { context: kind })}
            </Badge>
            <CardContent className='kicl-margin-inline-narrower'>
              <HyperLink to={id} after={<Ri.RiArrowRightSLine aria-hidden />}>
                {excerpt}
              </HyperLink>
            </CardContent>
            <Badge size='small' variant='ghost'>
              {t('edit_count', { count: editCount })} ·{' '}
              <time dateTime={new Date(createdAt).toISOString()}>
                {date.format(new Date(createdAt))}
              </time>
            </Badge>
          </Card>
        ))}
      </List>
    </Card>
  );
};

export { History };
