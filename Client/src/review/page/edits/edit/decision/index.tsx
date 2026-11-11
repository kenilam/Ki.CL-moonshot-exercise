import React from 'react';

// Components
import { Button, Layout } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit } from 'moonshot/review/apply';

type Props = Pick<Edit, 'id'>;

const Decision: React.FunctionComponent<Props> = ({ id }) => {
  const { t } = useTranslation('moonshot');
  const { decide, decisions } = useReviewContext();
  const decision = decisions[id];

  return (
    <Layout autoFlow='column' gap='narrower' justifyContent='start'>
      <fieldset
        aria-label={t('label', { context: 'decision' })}
        className='kicl-justify-self-start'
      >
        <Button
          aria-pressed={decision === 'accepted'}
          disabled={decision === 'accepted'}
          level='confirm'
          onClick={() => {
            decide(id, 'accepted');
          }}
          size='small'
          variant='ghost'
        >
          {t('action', { context: 'accept' })}
        </Button>
        <Button
          aria-pressed={decision === 'rejected'}
          disabled={decision !== 'accepted'}
          level='error'
          onClick={() => {
            decide(id, 'rejected');
          }}
          size='small'
          variant='tertiary'
        >
          {t('action', { context: 'reject' })}
        </Button>
      </fieldset>
    </Layout>
  );
};

export { Decision };
