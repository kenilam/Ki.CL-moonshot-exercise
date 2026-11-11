import React from 'react';

// Partials
import { Reviews } from './reviews';

// Context
import { Provider } from './context';

const History: React.FunctionComponent = () => {
  return (
    <Provider>
      <Reviews />
    </Provider>
  );
};

export { History };
