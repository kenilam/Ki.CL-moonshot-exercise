import React from 'react';

// Libraries
import { useFormContext } from 'react-hook-form';

// Components
import { Text } from 'design/components';

/** A form's submit error, set on its root by whoever submits it. */
const RootError: React.FunctionComponent = () => {
  const {
    formState: { errors },
  } = useFormContext();

  if (!errors.root?.message) {
    return null;
  }

  return (
    <Text level='error' className='kicl-font-size-smaller' is='p' role='alert'>
      {errors.root.message}
    </Text>
  );
};

export { RootError };
