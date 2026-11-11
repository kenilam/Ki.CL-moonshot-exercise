import React from 'react';

// Components
import { Badge, Text } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit } from 'moonshot/review/apply';

type Props = Pick<Edit, 'id'>;

const Change: React.FunctionComponent<Props> = ({ id }) => {
  const { t } = useTranslation('moonshot');
  const edit = useReviewContext().review.edits.find((each) => {
    return each.id === id;
  });

  if (!edit) {
    return null;
  }

  return (
    <Text is='p'>
      <Text is='del'>{edit.quote}</Text>{' '}
      {edit.replacement ? (
        <Text is='ins'>{edit.replacement}</Text>
      ) : (
        <Badge size='small' level='error' variant='ghost'>
          {t('label', { context: 'remove' })}
        </Badge>
      )}
    </Text>
  );
};

export { Change };
