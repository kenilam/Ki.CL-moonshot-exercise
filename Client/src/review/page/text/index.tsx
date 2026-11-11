import React from 'react';

// Components
import { Card, CardTitle, Text } from 'design/components';

// Partials
import { Highlight } from './highlight';

// Libraries
import { segment } from 'moonshot/review/apply';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

/**
 * The original text with each edit in place: marked while pending, shown as a
 * deletion and an insertion once accepted, and plain again once rejected.
 * Every edit still in play links to its card, and shows its reason on hover.
 */
const Marked: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { decisions, review } = useReviewContext();

  return (
    <Card
      header={<CardTitle is='h2'>{t('title', { context: 'text' })}</CardTitle>}
      is='section'
    >
      <Text is='p'>
        {segment(review.text, review.edits).map((part) => {
          if ('text' in part) {
            return part.text;
          }

          const { edit } = part;

          // Rejected is plain text again: nothing left to open.
          if (decisions[edit.id] === 'rejected') {
            return edit.quote;
          }

          return <Highlight id={edit.id} key={edit.id} />;
        })}
      </Text>
    </Card>
  );
};

export { Marked };
