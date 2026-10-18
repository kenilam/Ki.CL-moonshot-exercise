import React, { useState } from 'react';

// Libraries
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Components
import {
  Button,
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Schema
import type { ComposeValues } from '@/compose/form/schema';

// Constants
import { EXAMPLES, type Example } from './constants';

/** Fills the text with an example of the chosen kind, then closes. */
const Examples: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const [open, setOpen] = useState(false);
  const { clearErrors, setValue, watch } = useFormContext<ComposeValues>();
  const kind = watch('kind');

  const fill = (example: Example) => {
    clearErrors('root');
    setValue('text', t(`examples.${kind}.${example}`), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          after={<Ri.RiArrowDownSLine aria-hidden />}
          size='small'
          type='button'
          variant='tertiary'
        >
          {t('action', { context: 'try_example' })}
        </Button>
      </PopoverTrigger>
      <PopoverContent offset='narrowest' placement='block-end-end'>
        <List gap='narrower'>
          {EXAMPLES.map((example) => (
            <ListItem key={example} gap='narrowest'>
              <Button
                after={<Ri.RiArrowRightSLine aria-hidden />}
                onClick={() => fill(example)}
                size='small'
                type='button'
                variant='tertiary'
              >
                {t('example', { context: example })}
              </Button>
            </ListItem>
          ))}
        </List>
      </PopoverContent>
    </Popover>
  );
};

export { Examples };
