import React, { useEffect, useState } from 'react';

// Components
import { Badge } from 'design/components';

// API
import { getAllowance } from 'moonshot/api';

// Hooks
import { useTranslation } from 'design/hooks';

type Remaining = Awaited<ReturnType<typeof getAllowance>>;

/** How many reviews are left today. Hidden until it loads, and on error. */
const Allowance: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const [allowance, setAllowance] = useState<Remaining>();

  useEffect(() => {
    const load = async () => {
      try {
        setAllowance(await getAllowance());
      } catch {
        // Stays hidden.
      }
    };

    void load();
  }, []);

  if (!allowance) {
    return null;
  }

  const { limit, remaining } = allowance;

  return (
    <Badge limit={limit} remaining={remaining} size='small' variant='ghost'>
      {t('allowance', { count: remaining, limit })}
    </Badge>
  );
};

export { Allowance };
