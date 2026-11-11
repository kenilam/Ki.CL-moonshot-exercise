import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Button, Menu } from 'design/components';

// Icons
import * as Tb from 'react-icons/tb';

// Hooks
import { useTranslation } from 'design/hooks';

// Constants
import { SHEET_ID } from 'moonshot/review/page/narrow/constants';

/** Sticks under Ki.CL's global header; at the top when there is none. */
const Bar: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Menu
      autoFlow='row'
      className={classNames(
        'kicl-backdrop',
        'kicl-inset-block-start-header',
        'kicl-padding-block',
        'kicl-padding-inline-wide',
        'kicl-position-sticky',
        'kicl-z-index-raised'
      )}
      justifyItems='end'
    >
      <Button
        before={<Tb.TbFileText aria-hidden />}
        popoverTarget={SHEET_ID}
        popoverTargetAction='show'
        size='small'
        variant='ghost'
      >
        {t('title', { context: 'text_and_result' })}
      </Button>
    </Menu>
  );
};

export { Bar };
