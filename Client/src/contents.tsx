import React, { useCallback, useState } from 'react';

import { isAuthenticated } from 'api/provider';

// Routes
import { Outlet } from 'design/router';

// Partials
import { SignIn } from './sign-in';

/** Uses Ki.CL's sign-in and session cookies, the same gate as Pika. */
const Contents: React.FunctionComponent = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);

  const onSignedIn = useCallback(() => {
    setAuthenticated(true);
  }, []);

  if (!authenticated) {
    return <SignIn onSignedIn={onSignedIn} />;
  }

  return <Outlet />;
};

export { Contents };
