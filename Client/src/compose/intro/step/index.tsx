import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Badge, ListItem } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Constants
import { STEPS } from 'moonshot/compose/intro/constants';

type Props = { step: (typeof STEPS)[number] };

const Step: React.FunctionComponent<Props> = ({ step }) => {
  const { t } = useTranslation('moonshot');

  return (
    <ListItem
      alignItems='start'
      autoFlow='column'
      gap='narrow'
      justifyContent='start'
    >
      {/* The list numbers the steps for screen readers already. */}
      <Badge
        className={classNames(
          'kicl-border-radius-lg',
          'kicl-text-align-center'
        )}
        size='small'
        aria-hidden
      >
        {STEPS.indexOf(step) + 1}
      </Badge>
      {t('step', { context: step })}
    </ListItem>
  );
};

export { Step };
