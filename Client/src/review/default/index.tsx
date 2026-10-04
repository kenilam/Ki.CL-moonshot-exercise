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
import type { Review, Rule } from '@/api';

type Props = {
  decisions: Decisions;
  onDecide: (id: string, decision: Decision) => void;
  review: Review;
  rules: Map<string, Rule>;
};

/** Above tablet: the text and its result beside the edits, kept in view. */
const Default: React.FunctionComponent<Props> = ({
  decisions,
  onDecide,
  review,
  rules,
}) => {
  return (
    <Layout alignItems='start' columns gap='normal'>
      <div>
        <Layout span={5}>
          <div
            className={classNames(
              'kicl-position-sticky',
              'kicl-inset-block-start'
            )}
          >
            <Marked decisions={decisions} review={review} rules={rules} />
            <Result decisions={decisions} review={review} />
          </div>
        </Layout>
        <Layout span={7}>
          <div
            className={classNames(
              'kicl-position-sticky',
              'kicl-inset-block-start'
            )}
          >
            <Edits
              decisions={decisions}
              edits={review.edits}
              onDecide={onDecide}
              rules={rules}
            />
          </div>
        </Layout>
      </div>
    </Layout>
  );
};

export { Default };
export type { Props };
