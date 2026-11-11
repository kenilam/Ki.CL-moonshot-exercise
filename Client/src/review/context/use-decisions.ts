import { useState } from 'react';

// Libraries
import type { Decision, Decisions } from 'moonshot/review/apply';

const useDecisions = () => {
  const [decisions, setDecisions] = useState<Decisions>({});

  const decide = (id: string, decision: Decision) => {
    setDecisions((current) => {
      return { ...current, [id]: decision };
    });
  };

  return { decide, decisions };
};

export { useDecisions };
