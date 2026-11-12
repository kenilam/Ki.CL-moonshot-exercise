import React from 'react';

// Components
import { FormLabel, Layout } from 'design/components';

// Partials
import { Examples } from 'moonshot/compose/form/text/header/examples';
import { Kind } from 'moonshot/compose/form/text/header/kind';
import { Label } from 'moonshot/compose/form/text/header/label';

const Narrow: React.FunctionComponent = () => {
  return (
    <Layout
      alignItems='center'
      autoFlow='column'
      frames='1fr--max-content'
      gap='narrow'
    >
      <header>
        <Kind />
        {/* Hidden, it still names the field. */}
        <FormLabel className='kicl-hidden'>
          <Label />
        </FormLabel>
        <Examples />
      </header>
    </Layout>
  );
};

export { Narrow };
