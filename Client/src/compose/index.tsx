import React, { Suspense } from 'react';

// Routes
import { Route } from 'design/router';

// Components
import { Spinner } from 'design/components';

// Constants
import { REVIEW_PATH } from '@/constants';

const Contents = React.lazy(() =>
  import('./contents').then(({ Contents }) => ({ default: Contents }))
);

const Lazy: React.FunctionComponent = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Contents />
    </Suspense>
  );
};

const Compose = <Route path={REVIEW_PATH} element={<Lazy />} />;

export { Compose };
