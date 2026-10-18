import React, { useEffect, useState } from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import { Badge } from 'design/components';

// API
import { getAllowance } from '@/api';

type Level = React.ComponentProps<typeof Badge>['level'];
type Remaining = Awaited<ReturnType<typeof getAllowance>>;

/** None left is an error; the last quarter is a warning. */
const levelFor = ({ limit, remaining }: Remaining): Level => {
  if (remaining === 0) {
    return 'error';
  }

  return remaining <= limit / 4 ? 'warning' : 'confirm';
};

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

  return (
    <Badge size='small' level={levelFor(allowance)} variant='outline'>
      {t('allowance', { count: allowance.remaining, limit: allowance.limit })}
    </Badge>
  );
};

export { Allowance };
