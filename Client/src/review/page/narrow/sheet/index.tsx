import React, { useState } from 'react';

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

  // A new key each time the sheet closes, so "Copied" is back to "Copy".
  const [closings, setClosings] = useState(0);

  return (
    <Origin
      aria-label={t('title', { context: 'text_and_result' })}
      id={SHEET_ID}
      onOpenChange={(open) => {
        if (!open) {
          setClosings((count) => {
            return count + 1;
          });
        }
      }}
      ref={sheet}
    >
      <Result key={closings} />
      <Marked />
    </Origin>
  );
};

export { Sheet };
