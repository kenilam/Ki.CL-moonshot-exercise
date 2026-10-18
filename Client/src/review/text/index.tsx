import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Text,
} from 'design/components';

// Partials
import { Highlight } from './highlight';

// Libraries
import { segment } from '@/review/apply';

// Types
import type { Props as VersionProps } from '@/review/default';

type Props = Pick<VersionProps, 'decisions' | 'review'>;

/**
 * The original text with each edit in place: marked while pending, shown as a
 * deletion and an insertion once accepted, and plain again once rejected.
 * Every edit still in play links to its card, and shows its reason on hover.
 */
const Marked: React.FunctionComponent<Props> = ({ decisions, review }) => {
  const { t } = useTranslation('moonshot');

  return (
    <Card is='section'>
      <CardHeader>
        <CardTitle is='h2'>{t('title', { context: 'text' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text is='span'>
          {segment(review.text, review.edits).map((part) => {
            if ('text' in part) {
              return part.text;
            }

            const { edit } = part;
            const decision = decisions[edit.id];

            // Rejected is plain text again: nothing left to open.
            if (decision === 'rejected') {
              return edit.quote;
            }

            return <Highlight decision={decision} edit={edit} key={edit.id} />;
          })}
        </Text>
      </CardContent>
    </Card>
  );
};

export { Marked };
