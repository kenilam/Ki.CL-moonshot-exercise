import React from 'react';

// Components
import { Badge } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit } from 'moonshot/review/apply';

type Props = Pick<Edit, 'id'>;

/** A rule the guide no longer has shows as its id, with no guidance. */
const Rule: React.FunctionComponent<Props> = ({ id }) => {
  const { t } = useTranslation('moonshot');
  const edit = useReviewContext().review.edits.find((each) => {
    return each.id === id;
  });

  if (!edit) {
    return null;
  }

  return (
    <Badge
      size='small'
      title={t('rule_guidance', {
        context: edit.rule,
        defaultValue: '',
      })}
      variant='ghost'
    >
      {t('rule', { context: edit.rule, defaultValue: edit.rule })}
    </Badge>
  );
};

export { Rule };
