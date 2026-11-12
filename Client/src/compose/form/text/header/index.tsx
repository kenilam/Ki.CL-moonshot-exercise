import React, { Suspense } from 'react';

// Components
import { Spinner } from 'design/components';

// Hooks
import { useResponsive } from 'design/hooks';

const VERSIONS = {
  true: React.lazy(async () => {
    const { Narrow } = await import('./narrow');

    return { default: Narrow };
  }),
  false: React.lazy(async () => {
    const { Default } = await import('./default');

    return { default: Default };
  }),
};

const Header: React.FunctionComponent = () => {
  const { isNarrow } = useResponsive();

  const Version = VERSIONS[`${isNarrow}` as const];

  return (
    <Suspense fallback={<Spinner position='inline' />}>
      <Version />
    </Suspense>
  );
};

export { Header };
