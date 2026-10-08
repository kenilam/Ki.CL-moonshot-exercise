import React, { Suspense } from 'react';

// Routes
import { Route } from 'design/router';

// Components
import { Spinner } from 'design/components';

const Contents = React.lazy(async () => {
  const { Contents } = await import('./contents');

  return { default: Contents };
});

const Lazy: React.FunctionComponent = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Contents />
    </Suspense>
  );
};

const Introduction = <Route index element={<Lazy />} />;

export { Introduction };
