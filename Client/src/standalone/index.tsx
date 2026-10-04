import React, { StrictMode, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';

// Core
import 'design/core';

// Routes
import { Navigate, Route, Router } from 'design/router';

// Components
import { Spinner } from 'design/components';

// Views
import { Moonshot, PATH } from '@/index';

/*
 * Stands in for Ki.CL when this runs on its own: the API provider and the
 * router, with the module at the path Ki.CL gives it.
 */

const KiclProvider = lazy(() =>
  import('api/provider').then(({ KiclProvider }) => ({ default: KiclProvider }))
);

const Standalone: React.FunctionComponent = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <KiclProvider autoExchange={false}>
        <Router>
          <Route path='/'>
            <Route
              index
              element={<Navigate replace to={`portfolio/${PATH}`} />}
            />
            <Route path='portfolio'>{Moonshot}</Route>
          </Route>
        </Router>
      </KiclProvider>
    </Suspense>
  );
};

const appRoot = document.querySelector('app-root');

if (appRoot) {
  ReactDOM.createRoot(appRoot).render(
    <StrictMode>
      <Standalone />
    </StrictMode>
  );
}
