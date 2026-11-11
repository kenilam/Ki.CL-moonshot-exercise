import React from 'react';

// Components
import { Button, CardAction } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

const AcceptAll: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { decide, decisions, review } = useReviewContext();
  const pending = review.edits.filter(({ id }) => {
    return !decisions[id];
  });

  if (!pending.length) {
    return null;
  }

  return (
    <CardAction>
      <Button
        onClick={() => {
          pending.forEach(({ id }) => {
            decide(id, 'accepted');
          });
        }}
        size='small'
        variant='secondary'
      >
        {t('action', { context: 'accept_all' })}
      </Button>
    </CardAction>
  );
};

export { AcceptAll };
