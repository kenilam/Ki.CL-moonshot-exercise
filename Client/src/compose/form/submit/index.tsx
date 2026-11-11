import React from 'react';

// Components
import { Button, useFormContext } from 'design/components';

// Icons
import * as Tb from 'react-icons/tb';

// Hooks
import { useTranslation } from 'design/hooks';

const Submit: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      after={
        isSubmitting ? (
          <Tb.TbReload aria-hidden className='is-revolving' />
        ) : null
      }
      disabled={isSubmitting}
      level='confirm'
      size='small'
      type='submit'
    >
      {isSubmitting
        ? t('status', { context: 'reviewing' })
        : t('action', { context: 'review' })}
    </Button>
  );
};

export { Submit };
