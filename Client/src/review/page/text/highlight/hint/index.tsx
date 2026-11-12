import React from 'react';

// Components
import { Badge, Layout, PopoverHint, Text } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit } from 'moonshot/review/apply';

const Hint: React.FunctionComponent<Pick<Edit, 'id'>> = ({ id }) => {
  const { t } = useTranslation('moonshot');
  const { review } = useReviewContext();
  const edit = review.edits.find((each) => {
    return each.id === id;
  });

  if (!edit) {
    return null;
  }

  return (
    <Layout autoFlow='row' gap='narrower' justifyItems='start'>
      {/* The cap goes on the panel: it's the panel that has to stay narrow. */}
      <PopoverHint className='kicl-max-inline-size-columns-4'>
        <Badge size='small' variant='ghost'>
          {/* A rule the guide no longer has shows as its id. */}
          {t('rule', { context: edit.rule, defaultValue: edit.rule })}
        </Badge>
        <Text className='kicl-font-size-small' is='p' variant='secondary'>
          {edit.reason}
        </Text>
      </PopoverHint>
    </Layout>
  );
};

export { Hint };
