import React from 'react';

// Components
import { Card, CardTitle, List, Text } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Partials
import { AcceptAll } from './accept-all';
import { Edit } from './edit';

/** `className` positions the card from the page, such as keeping it in view. */
type Props = Pick<React.ComponentProps<typeof Card>, 'className'>;

const Edits: React.FunctionComponent<Props> = ({ className }) => {
  const { t } = useTranslation('moonshot');
  const {
    review: { edits },
  } = useReviewContext();

  return (
    <Card
      className={className}
      header={
        <>
          <CardTitle is='h2'>
            {t('title', { context: 'edits', total: edits.length })}
          </CardTitle>
          <AcceptAll />
        </>
      }
      is='section'
    >
      {edits.length ? (
        <List gap='normal'>
          {edits.map((edit) => {
            return <Edit id={edit.id} key={edit.id} />;
          })}
        </List>
      ) : (
        <Text is='p'>{t('no_edits')}</Text>
      )}
    </Card>
  );
};

export { Edits };
