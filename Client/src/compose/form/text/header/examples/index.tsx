import React from 'react';

// Components
import {
  Button,
  List,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'design/components';

// Icons
import * as Tb from 'react-icons/tb';

// Hooks
import { useTranslation } from 'design/hooks';

// Partials
import { Example } from './example';

// Constants
import { EXAMPLES } from 'moonshot/compose/form/text/header/constants';

const Examples: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          after={<Tb.TbChevronDown aria-hidden />}
          size='small'
          type='button'
          variant='tertiary'
        >
          {t('action', { context: 'try_example' })}
        </Button>
      </PopoverTrigger>
      <PopoverContent offset='narrowest' placement='block-end-end'>
        <List gap='narrower'>
          {EXAMPLES.map((example) => {
            return <Example example={example} key={example} />;
          })}
        </List>
      </PopoverContent>
    </Popover>
  );
};

export { Examples };
