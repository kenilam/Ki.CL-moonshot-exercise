import { useEffect, useState } from 'react';

// API
import { getReview, getRules, type Review, type Rule } from '@/api';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; review: Review; rules: Map<string, Rule> };

type Loaded = Exclude<State, { status: 'loading' }> & { id: string };

/** The review and the rules its edits refer to, loaded together. */
const useReview = (id: string | undefined): State => {
  const [loaded, setLoaded] = useState<Loaded>();

  useEffect(() => {
    if (!id) {
      return;
    }

    let current = true;

    Promise.all([getReview(id), getRules()])
      .then(([review, rules]) => {
        if (current) {
          setLoaded({
            id,
            review,
            rules: new Map(rules.map((rule) => [rule.id, rule])),
            status: 'ready',
          });
        }
      })
      .catch((error: Error) => {
        if (current) {
          setLoaded({ id, message: error.message, status: 'error' });
        }
      });

    return () => {
      current = false;
    };
  }, [id]);

  // Whatever is loaded belongs to the previous review until this one arrives.
  return loaded?.id === id && loaded ? loaded : { status: 'loading' };
};

export { useReview };
