import React, { Suspense } from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Layout, Spinner } from 'design/components';

// Hooks
import { useResponsive } from 'design/hooks';

// Partials
import { Header } from './header';

// Constants
import { PAGE_CLASS_NAMES } from 'moonshot/constants';

/**
 * Two layouts, loaded when needed, as Ki.CL's navigation does: side by side
 * above the `narrow` breakpoint, and stacked with the text held at the foot at
 * `narrow` and below.
 */
const Narrow = React.lazy(async () => {
  const { Narrow } = await import('./narrow');

  return { default: Narrow };
});

const Default = React.lazy(async () => {
  const { Default } = await import('./default');

  return { default: Default };
});

const Page: React.FunctionComponent = () => {
  const { isNarrow } = useResponsive();
  const Version = isNarrow ? Narrow : Default;

  return (
    <Layout
      autoFlow='row'
      // Each part keeps its own gutter, so the narrow version's sticky bar can run edge to edge.
      className={classNames(PAGE_CLASS_NAMES)}
      gap='wide'
      justifyItems='stretch'
    >
      <section>
        <Header />
        <Suspense fallback={<Spinner />}>
          <Version />
        </Suspense>
      </section>
    </Layout>
  );
};

export { Page };
