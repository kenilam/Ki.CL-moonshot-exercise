import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Layout } from 'design/components';

// Partials
import { Edits } from '@/review/edits';
import { Result } from '@/review/result';
import { Marked } from '@/review/text';

// Libraries
import type { Decision, Decisions } from '@/review/apply';

// API
import type { Review } from '@/api';

type Props = {
  decisions: Decisions;
  onDecide: (id: string, decision: Decision) => void;
  review: Review;
};

/** Above tablet: the text and its result beside the edits, kept in view. */
const Default: React.FunctionComponent<Props> = ({
  decisions,
  onDecide,
  review,
}) => {
  return (
    <Layout alignItems='start' columns gap='normal'>
      <div className='kicl-padding-inline-wide'>
        <Layout span={5}>
          <div
            className={classNames(
              'kicl-position-sticky',
              'kicl-inset-block-start-header'
            )}
          >
            <Marked decisions={decisions} review={review} />
            <Result decisions={decisions} review={review} />
          </div>
        </Layout>
        <Layout span={7}>
          <Edits
            className={classNames(
              'kicl-position-sticky',
              'kicl-inset-block-start-header'
            )}
            decisions={decisions}
            edits={review.edits}
            onDecide={onDecide}
          />
        </Layout>
      </div>
    </Layout>
  );
};

export { Default };
export type { Props };
