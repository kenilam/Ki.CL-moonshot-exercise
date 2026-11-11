import React from 'react';

// Routes
import { Navigate, Route, Router } from 'design/router';

// Hooks
import { useResponsive } from 'design/hooks';

// Session
import { Session } from './session';

// Partials
import { Header } from './header';
import { Portfolio } from './portfolio';

// Views
import { Compose } from 'moonshot/compose';
import { Introduction } from 'moonshot/introduction';
import { Review } from 'moonshot/review';

// Constants
import { PATH } from 'moonshot/constants';

/*
 * Stands in for Ki.CL when this runs on its own: the session and the router,
 * with the module at the path Ki.CL gives it.
 */
const Standalone: React.FunctionComponent = () => {
  /*
   * Ki.CL's header applies the theme - the system's, or the one picked - by
   * calling this; without that header, the stand-in does it.
   */
  useResponsive();

  return (
    <>
      <Header />
      {/* `Session` starts the anonymous session, after Turnstile if asked. */}
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
    </>
  );
};

export { Standalone };
