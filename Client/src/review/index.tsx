import React, { Suspense } from 'react';

// Routes
import { Route } from 'design/router';

// Components
import { Spinner } from 'design/components';

// Constants
import { REVIEW_PATH } from '@/constants';

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

const Review = <Route path={`${REVIEW_PATH}/:reviewId`} element={<Lazy />} />;

export { Review };
