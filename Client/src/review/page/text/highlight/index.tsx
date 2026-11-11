import React from 'react';

// Components
import { Popover } from 'design/components';

// Partials
import { Hint } from './hint';
import { Trigger } from './trigger';

// Libraries
import type { Edit } from 'moonshot/review/apply';

/**
 * One edit inside the text: a link to its card. Hovering or focusing it shows
 * the rule and the reason, opened by the browser through `interestfor`.
 */
const Highlight: React.FunctionComponent<Pick<Edit, 'id'>> = ({ id }) => {
  return (
    <Popover inline>
      <Trigger id={id} />
      <Hint id={id} />
    </Popover>
  );
};

export { Highlight };
