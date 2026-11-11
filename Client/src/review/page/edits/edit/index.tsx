import React from 'react';

// Components
import { Card, Layout } from 'design/components';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Libraries
import type { Edit as EditType } from 'moonshot/review/apply';

// Partials
import { Change } from './change';
import { Decision } from './decision';
import { Reason } from './reason';
import { Rule } from './rule';
import { Show } from './show';

type Props = Pick<EditType, 'id'>;

/** The card's edge shows the decision, so a long list can be scanned. */
const LEVELS = {
  accepted: 'confirm',
  rejected: 'error',
} as const;

const Edit: React.FunctionComponent<Props> = ({ id }) => {
  const decision = useReviewContext().decisions[id];

  return (
    <Card
      gap='narrower'
      id={`edit-${id}`}
      is='li'
      level={decision ? LEVELS[decision] : undefined}
    >
      <Layout
        alignItems='center'
        autoFlow='column'
        justifyContent='space-between'
      >
        <header className='kicl-justify-self-start'>
          <Rule id={id} />
          <Show id={id} />
        </header>
      </Layout>
      <Change id={id} />
      <Reason id={id} />
      <Decision id={id} />
    </Card>
  );
};

export { Edit };
