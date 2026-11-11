import React from 'react';

// Components
import { Text } from 'design/components';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit } from 'moonshot/review/apply';

type Props = Pick<Edit, 'id'>;

const Reason: React.FunctionComponent<Props> = ({ id }) => {
  const edit = useReviewContext().review.edits.find((each) => {
    return each.id === id;
  });

  if (!edit) {
    return null;
  }

  return (
    <Text is='p' variant='secondary'>
      {edit.reason}
    </Text>
  );
};

export { Reason };
