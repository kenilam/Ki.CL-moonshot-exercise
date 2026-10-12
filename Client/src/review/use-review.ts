import { useEffect, useState } from 'react';

// API
import { getReview, type Review } from '@/api';

type State =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'ready'; review: Review };

type Loaded = Exclude<State, { status: 'loading' }> & { id: string };

/** The review, or why it could not be loaded. */
const useReview = (id: string | undefined): State => {
  const [loaded, setLoaded] = useState<Loaded>();

  useEffect(() => {
    if (!id) {
      return;
    }

    let current = true;

    const load = async () => {
      try {
        const review = await getReview(id);

        if (current) {
          setLoaded({ id, review, status: 'ready' });
        }
      } catch (error) {
        if (current) {
          setLoaded({ error, id, status: 'error' });
        }
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, [id]);

  // Whatever is loaded belongs to the previous review until this one arrives.
  return loaded?.id === id && loaded ? loaded : { status: 'loading' };
};

export { useReview };
