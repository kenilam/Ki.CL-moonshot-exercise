import React from 'react';

// Libraries
import classNames from 'classnames';

// Partials
import { Bar } from './bar';
import { Sheet } from './sheet';
import { Edits } from 'moonshot/review/page/edits';

/**
 * Tablet and below: the result and the text open in a sheet over the edits,
 * the result first. Closing it shows the edits; the bar opens it again.
 */
const Narrow: React.FunctionComponent = () => {
  return (
    <>
      <Bar />
      <Edits
        className={classNames(
          'kicl-inline-size-auto',
          'kicl-margin-inline-wide'
        )}
      />
      <Sheet />
    </>
  );
};

export { Narrow };
