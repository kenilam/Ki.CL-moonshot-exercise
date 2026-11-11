import React from 'react';

// Routes
import { Outlet } from 'design/router';

// Components
import { Layout } from 'design/components';

/** Ki.CL's `/portfolio` page. Pages centre themselves within it. */
const Portfolio: React.FunctionComponent = () => {
  return (
    <Layout justifyItems='stretch'>
      <main>
        <Outlet />
      </main>
    </Layout>
  );
};

export { Portfolio };
