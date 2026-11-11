import React from 'react';

// Components
import { FormLabel, Layout, useFormContext } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Partials
import { Examples } from './examples';
import { Kind } from './kind';

// Styles
import './styles.css';

// Schema
import type { ComposeValues } from 'moonshot/compose/form/schema';

const Header: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { watch } = useFormContext<ComposeValues>();
  const kind = watch('kind');

  return (
    <Layout alignItems='center' gap='narrow' justifyContent='space-between'>
      <header className='kicl--views--moonshot--compose--form__header'>
        <Kind />
        <FormLabel className='kicl-hidden-up-to-narrow'>
          {t('label_text', { context: kind })}
        </FormLabel>
        <Examples />
      </header>
    </Layout>
  );
};

export { Header };
