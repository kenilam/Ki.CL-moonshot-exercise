import React from 'react';

// Components
import { ListItem } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Constants
import type { POINTS } from 'moonshot/introduction/design/constants';

type Props = { point: (typeof POINTS)[number] };

const Point: React.FunctionComponent<Props> = ({ point }) => {
  const { t } = useTranslation('moonshot');

  return (
    <ListItem>{t('introduction.design.point', { context: point })}</ListItem>
  );
};

export { Point };
