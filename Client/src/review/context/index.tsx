import React, { PropsWithChildren, useContext } from 'react';

// Components
import { Spinner } from 'design/components';

// API
import type { Review } from 'moonshot/api';

// Hooks
import { useDecisions } from './use-decisions';
import { useReview } from './use-review';

// Partials
import { Failed } from './failed';

type Value = ReturnType<typeof useDecisions> & { review: Review };

const ReviewContext = React.createContext<Value | null>(null);

const Provider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const state = useReview();
  const { decide, decisions } = useDecisions();

  if (state.status === 'loading') {
    return <Spinner />;
  }

  if (state.status === 'error') {
    return <Failed error={state.error} />;
  }

  return (
    <ReviewContext.Provider value={{ decide, decisions, review: state.review }}>
      {children}
    </ReviewContext.Provider>
  );
};

const useReviewContext = (): Value => {
  const value = useContext(ReviewContext);

  if (!value) {
    throw new Error('useReviewContext needs a ReviewContext above it.');
  }

  return value;
};

export { Provider, useReviewContext };
