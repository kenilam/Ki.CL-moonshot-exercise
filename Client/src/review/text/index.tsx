import React from 'react';

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
import { segment, type Decisions } from '@/review/apply';

// API
import type { Review, Rule } from '@/api';

/** `className` comes from the page's `Layout span`. */
type Props = Pick<React.ComponentProps<typeof Card>, 'className'> & {
  decisions: Decisions;
  review: Review;
  rules: Map<string, Rule>;
};

/**
 * The original text with each edit in place: marked while pending, shown as a
 * deletion and an insertion once accepted, and plain again once rejected.
 * Every edit still in play links to its card, and shows its reason on hover.
 */
const Marked: React.FunctionComponent<Props> = ({
  className,
  decisions,
  review,
  rules,
}) => {
  return (
    <Card className={className} is='section'>
      <CardHeader>
        <CardTitle is='h2'>Your text</CardTitle>
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

            return (
              <Highlight
                decision={decision}
                edit={edit}
                key={edit.id}
                rule={rules.get(edit.rule)}
              />
            );
          })}
        </Text>
      </CardContent>
    </Card>
  );
};

export { Marked };
