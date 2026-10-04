import React from 'react';

// Components
import { Badge, Layout, List, ListItem, Text } from 'design/components';

const STEPS = [
  'Pick a commit, a pull request, a README or a code comment.',
  'Paste the text and select Review.',
  'Accept or reject each edit, then copy the result.',
];

const Intro: React.FunctionComponent = () => {
  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-label='How it works'>
        <Text is='p'>
          Paste something you wrote for other engineers. You get back suggested
          edits, each with the rule it applies and why. Keep the ones you agree
          with.
        </Text>
        <List gap='narrower' is='ol'>
          {STEPS.map((step, index) => (
            <ListItem
              alignItems='start'
              autoFlow='column'
              gap='narrow'
              justifyContent='start'
              key={step}
            >
              {/* The list numbers the steps for screen readers already. */}
              <Badge
                className='kicl-text-align-center'
                aria-hidden
                rounded
                size='small'
              >
                {index + 1}
              </Badge>
              {step}
            </ListItem>
          ))}
        </List>
      </section>
    </Layout>
  );
};

export { Intro };
