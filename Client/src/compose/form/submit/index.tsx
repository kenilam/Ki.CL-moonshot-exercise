import React from 'react';

// Components
import { Button, useFormContext } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

const Submit: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button busy={isSubmitting} level='confirm' size='small' type='submit'>
      {isSubmitting
        ? t('status', { context: 'reviewing' })
        : t('action', { context: 'review' })}
    </Button>
  );
};

export { Submit };
