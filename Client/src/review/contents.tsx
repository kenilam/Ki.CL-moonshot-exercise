import React from 'react';

// Partials
import { Page } from './page';
import { Provider } from './context';

const Contents: React.FunctionComponent = () => {
  return (
    <Provider>
      <Page />
    </Provider>
  );
};

export { Contents };
