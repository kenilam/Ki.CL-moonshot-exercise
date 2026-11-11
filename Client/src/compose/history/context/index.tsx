import React, { PropsWithChildren, createContext, useContext } from 'react';

// Hooks
import { useSummaries } from './use-summaries';

const SummariesContext = createContext<ReturnType<typeof useSummaries> | null>(
  null
);

const Provider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const reviews = useSummaries();

  return (
    <SummariesContext.Provider value={reviews}>
      {children}
    </SummariesContext.Provider>
  );
};

const useSummariesContext = () => {
  const reviews = useContext(SummariesContext);

  if (!reviews) {
    throw new Error('useSummariesContext needs a SummariesContext above it.');
  }

  return reviews;
};

export { Provider, useSummariesContext };
