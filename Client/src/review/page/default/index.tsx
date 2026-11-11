import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Layout } from 'design/components';

// Partials
import { Edits } from 'moonshot/review/page/edits';
import { Result } from 'moonshot/review/page/result';
import { Marked } from 'moonshot/review/page/text';

/** Above `narrow`: the text and its result beside the edits, kept in view. */
const Default: React.FunctionComponent = () => {
  return (
    <Layout alignItems='start' columns gap='normal'>
      <div className='kicl-padding-inline-wide'>
        <Layout span={5}>
          <aside
            className={classNames(
              'kicl-position-sticky',
              'kicl-inset-block-start-header'
            )}
          >
            <Marked />
            <Result />
          </aside>
        </Layout>
        <Layout span={7}>
          <Edits
            className={classNames(
              'kicl-position-sticky',
              'kicl-inset-block-start-header'
            )}
          />
        </Layout>
      </div>
    </Layout>
  );
};

export { Default };
