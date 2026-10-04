import React from 'react';

// Components
import { Heading, Layout, Text } from 'design/components';

const Idea: React.FunctionComponent = () => {
  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-labelledby='introduction-idea'>
        <Heading id='introduction-idea' is='h2'>
          The idea
        </Heading>
        <Text is='p'>
          Engineering writing drifts into the same habits: build-up before the
          point, filler transitions, words like “robust” and “seamless”, a
          lesson tacked onto the end. Asking a chat model to improve it rewrites
          the whole thing in the model’s voice, which is the problem it was
          meant to fix.
        </Text>
        <Text is='p'>
          I wanted small edits the author can see, judge and take or leave. Each
          one quotes the text it changes, names the rule it applies and says why
          in one line. The author’s facts, code and voice stay as they are.
        </Text>
      </section>
    </Layout>
  );
};

export { Idea };
