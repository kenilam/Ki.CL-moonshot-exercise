import React from 'react';

// Components
import { HyperLink, PopoverTrigger, Text } from 'design/components';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit } from 'moonshot/review/apply';

const Trigger: React.FunctionComponent<Pick<Edit, 'id'>> = ({ id }) => {
  const { decisions, review } = useReviewContext();
  const edit = review.edits.find((each) => {
    return each.id === id;
  });

  if (!edit) {
    return null;
  }

  return (
    <PopoverTrigger asChild>
      <HyperLink id={`text-${id}`} to={`#edit-${id}`}>
        {decisions[id] === 'accepted' ? (
          <>
            <Text is='del'>{edit.quote}</Text>{' '}
            <Text is='ins'>{edit.replacement}</Text>
          </>
        ) : (
          <mark>{edit.quote}</mark>
        )}
      </HyperLink>
    </PopoverTrigger>
  );
};

export { Trigger };
