import React from 'react';

// Components
import { useFormContext } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Schema
import type { ComposeValues } from 'moonshot/compose/form/schema';

const Label: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { watch } = useFormContext<ComposeValues>();

  return t('label_text', { context: watch('kind') });
};

export { Label };
