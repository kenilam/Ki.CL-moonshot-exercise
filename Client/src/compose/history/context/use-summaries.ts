import { useEffect, useState } from 'react';

// API
import { listReviews, type Summary } from 'moonshot/api';

const useSummaries = () => {
  const [reviews, setReviews] = useState<Summary[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setReviews(await listReviews());
      } catch {
        // Stays hidden.
      }
    };

    void load();
  }, []);

  return reviews;
};

export { useSummaries };
