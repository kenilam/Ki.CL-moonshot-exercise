import React from 'react';

// Icons
import * as Tb from 'react-icons/tb';

// Components
import { Badge, Card, HyperLink } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useSummariesContext } from 'moonshot/compose/history/context';

// API
import type { Summary } from 'moonshot/api';

// Constants
import { KIND_LEVELS } from 'moonshot/constants';

type Props = Pick<Summary, 'id'>;

const Review: React.FunctionComponent<Props> = ({ id }) => {
  const { i18n, t } = useTranslation('moonshot');
  const review = useSummariesContext().find((each) => {
    return each.id === id;
  });

  if (!review) {
    return null;
  }

  const { createdAt, editCount, excerpt, kind } = review;
  const date = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Card is='li'>
      <Badge level={KIND_LEVELS[kind]} size='small'>
        {t('kind', { context: kind })}
      </Badge>
      <HyperLink
        after={<Tb.TbChevronRight aria-hidden className='kicl-rtl-mirror' />}
        className='kicl-margin-inline-narrower'
        to={id}
      >
        {excerpt}
      </HyperLink>
      <Badge size='small' variant='ghost'>
        {t('edit_count', { count: editCount })} ·{' '}
        <time dateTime={new Date(createdAt).toISOString()}>
          {date.format(new Date(createdAt))}
        </time>
      </Badge>
    </Card>
  );
};

export { Review };
