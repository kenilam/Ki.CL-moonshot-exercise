import React from 'react';

// Components
import {
  Card,
  CardAction,
  CardTitle,
  CopyButton,
  Text,
} from 'design/components';

// Icons
import * as Tb from 'react-icons/tb';

// Libraries
import { apply } from 'moonshot/review/apply';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

/** The text with the accepted edits applied, ready to copy. */
const Result: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { decisions, review } = useReviewContext();
  const text = apply(review.text, review.edits, decisions);

  return (
    <Card
      header={
        <>
          <CardTitle is='h2'>{t('title', { context: 'result' })}</CardTitle>
          <CardAction>
            <CopyButton
              icon={<Tb.TbClipboard aria-hidden />}
              level='info'
              showLabel
              size='small'
              value={text}
              variant='secondary'
            />
          </CardAction>
        </>
      }
      is='section'
    >
      <Text is='p'>{text}</Text>
    </Card>
  );
};

export { Result };
