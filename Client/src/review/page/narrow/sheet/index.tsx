import React from 'react';

// Components
import { Sheet as Origin } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';
import { useSheet } from './use-sheet';

// Partials
import { Result } from 'moonshot/review/page/result';
import { Marked } from 'moonshot/review/page/text';

// Constants
import { SHEET_ID } from 'moonshot/review/page/narrow/constants';

const Sheet: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const sheet = useSheet();

  return (
    <Origin
      aria-label={t('title', { context: 'text_and_result' })}
      id={SHEET_ID}
      ref={sheet}
    >
      <Result />
      <Marked />
    </Origin>
  );
};

export { Sheet };
