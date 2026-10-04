import React, { Suspense } from 'react';

// Routes
import { Route } from 'design/router';

// Components
import { Spinner } from 'design/components';

// Views
import { Home } from './home';

// Constants
import { PATH } from './constants';

const Contents = React.lazy(() =>
  import('./contents').then(({ Contents }) => ({ default: Contents }))
);

const Gate: React.FunctionComponent = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Contents />
    </Suspense>
  );
};

/** Exposed as `moonshot/routes`; Ki.CL places it under `/portfolio`. */
const Moonshot = (
  <Route path={PATH} element={<Gate />}>
    {Home}
  </Route>
);

export { Moonshot, PATH };
