import React from 'react';

// Components
import { Button, ListItem } from 'design/components';

// Icons
import * as Tb from 'react-icons/tb';

// Hooks
import { useTranslation } from 'design/hooks';
import { useFill } from './use-fill';

// Constants
import type { EXAMPLES } from 'moonshot/compose/form/text/header/constants';

type Props = { example: (typeof EXAMPLES)[number] };

const Example: React.FunctionComponent<Props> = ({ example }) => {
  const { t } = useTranslation('moonshot');
  const fill = useFill(example);

  return (
    <ListItem gap='narrowest'>
      <Button
        after={<Tb.TbChevronRight aria-hidden className='kicl-rtl-mirror' />}
        onClick={fill}
        size='small'
        type='button'
        variant='tertiary'
      >
        {t('example', { context: example })}
      </Button>
    </ListItem>
  );
};

export { Example };
