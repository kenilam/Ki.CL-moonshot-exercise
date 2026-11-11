import React from 'react';

// Components
import { HyperLink } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit } from 'moonshot/review/apply';

type Props = Pick<Edit, 'id'>;

/** A rejected edit is plain text again, so there is nothing to show. */
const Show: React.FunctionComponent<Props> = ({ id }) => {
  const { t } = useTranslation('moonshot');
  const { decisions } = useReviewContext();

  if (decisions[id] === 'rejected') {
    return null;
  }

  return (
    <HyperLink className='kicl-font-size-smaller' to={`#text-${id}`}>
      {t('action', { context: 'show_in_text' })}
    </HyperLink>
  );
};

export { Show };
