import React, { useState } from 'react';

import { useFormContext } from 'react-hook-form';

// Components
import {
  getButtonClassNames,
  Button,
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Schema
import type { ComposeValues } from '@/compose/form/schema';

// Constants
import { EXAMPLE_LABELS, EXAMPLES, type Example } from './constants';

/** Fills the text with an example of the chosen kind, then closes. */
const Examples: React.FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const { clearErrors, setValue, watch } = useFormContext<ComposeValues>();
  const kind = watch('kind');

  const fill = (example: Example) => {
    clearErrors('root');
    setValue('text', EXAMPLES[kind][example], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className={getButtonClassNames({ size: 'small', variant: 'tertiary' })}
      >
        <Text is='span'>Try an example</Text>
        <Ri.RiArrowDownSLine aria-hidden />
      </PopoverTrigger>
      <PopoverContent offset='narrowest' placement='block-end-end'>
        <List gap='narrower'>
          {(Object.keys(EXAMPLE_LABELS) as Example[]).map((example) => (
            <ListItem key={example} gap='narrowest'>
              <Button
                onClick={() => fill(example)}
                size='small'
                type='button'
                variant='tertiary'
              >
                {EXAMPLE_LABELS[example].label}
                <Ri.RiArrowRightSLine aria-hidden />
              </Button>
            </ListItem>
          ))}
        </List>
      </PopoverContent>
    </Popover>
  );
};

export { Examples };
