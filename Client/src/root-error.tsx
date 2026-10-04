import React from 'react';

// Libraries
import classNames from 'classnames';
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
    <Text
      className={classNames('kicl-font-size-smaller', 'kicl-color-error')}
      is='p'
      role='alert'
    >
      {errors.root.message}
    </Text>
  );
};

export { RootError };
