import React, { Suspense, lazy } from 'react';

// Libraries
import classNames from 'classnames';

// Routes
import { Navigate, Outlet, Route, Router } from 'design/router';

// Components
import { Layout, Spinner } from 'design/components';

// Widgets
import { ThemeToggle } from 'design/widgets';

// Hooks
import { useResponsive } from 'design/hooks';

// Session
import { Session } from './session';

// Views
import { Compose } from '@/compose';
import { Introduction } from '@/introduction';
import { Review } from '@/review';

// Constants
import { PATH } from '@/constants';

/*
 * Stands in for Ki.CL when this runs on its own: the API provider and the
 * router, with the module at the path Ki.CL gives it.
 */

const KiclProvider = lazy(() =>
  import('api/provider').then(({ KiclProvider }) => ({ default: KiclProvider }))
);

/** Ki.CL's `/portfolio` page. Pages centre themselves within it. */
const Portfolio: React.FunctionComponent = () => {
  return (
    <Layout justifyItems='stretch'>
      <div>
        <Outlet />
      </div>
    </Layout>
  );
};

const Standalone: React.FunctionComponent = () => {
  /*
   * Ki.CL's header applies the theme - the system's, or the one picked - by
   * calling this; without that header, the stand-in does it.
   */
  useResponsive();

  return (
    <Suspense fallback={<Spinner />}>
      {/*
       * Ki.CL's header has the theme toggle; the stand-in puts one at the top
       * right. Not fixed, so it scrolls away instead of covering the review's
       * sticky bar.
       */}
      <Layout justifyItems='end'>
        <header
          className={classNames(
            'kicl-padding-block',
            'kicl-padding-inline-wide'
          )}
        >
          <ThemeToggle variant='secondary' />
        </header>
      </Layout>
      {/* `Session` starts the anonymous session, after Turnstile if asked. */}
      <KiclProvider autoExchange={false}>
        <Session>
          <Router>
            <Route path='/'>
              <Route
                index
                element={<Navigate replace to={`portfolio/${PATH}`} />}
              />
              <Route path='portfolio' element={<Portfolio />}>
                {/* Assembled the way Ki.CL assembles the exposed parts. */}
                <Route path={PATH}>
                  {Introduction}
                  {Compose}
                  {Review}
                </Route>
              </Route>
            </Route>
          </Router>
        </Session>
      </KiclProvider>
    </Suspense>
  );
};

export { Standalone };
