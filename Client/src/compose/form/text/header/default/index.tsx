import React from 'react';

// Components
import { FormLabel, Layout } from 'design/components';

// Partials
import { Examples } from 'moonshot/compose/form/text/header/examples';
import { Kind } from 'moonshot/compose/form/text/header/kind';
import { Label } from 'moonshot/compose/form/text/header/label';

const Default: React.FunctionComponent = () => {
  return (
    <Layout alignItems='center' display='flex' gap='narrow' wrap>
      <header>
        <Kind />
        <FormLabel className='kicl-flex-1'>
          <Label />
        </FormLabel>
        <Examples />
      </header>
    </Layout>
  );
};

export { Default };
