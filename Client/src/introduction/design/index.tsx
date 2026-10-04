import React from 'react';

// Components
import {
  Card,
  Diagram,
  Heading,
  Layout,
  List,
  ListItem,
  Text,
} from 'design/components';

// Diagrams
import { services } from './services';

const POINTS = [
  'One call to Claude Opus 5.5 per review. The style guide is the system prompt, cached across requests, and the output is structured: a quote, its replacement, the rule and the reason for each edit.',
  'The model quotes the text instead of giving positions. The server finds each quote and drops any that is missing, repeated, overlapping or changes nothing, so an edit never lands in the wrong place.',
  'Text that isn’t technical writing, or that tries to instruct the model, comes back with a one-line reason instead of edits.',
  'Reviews are kept in MongoDB, and each session gets 20 a day.',
];

const Design: React.FunctionComponent = () => {
  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-labelledby='introduction-design'>
        <Heading id='introduction-design' is='h2'>
          Technical design
        </Heading>
        <Text is='p'>
          It’s a Module Federation remote of Ki.CL, with a small Express server
          beside it for the reviews. Components, styles and routing come from
          the design system’s remote, and sessions and the GraphQL client from
          Ki.CL-back’s. The server asks Ki.CL-back whose session a request
          carries, so it never holds the secret that signs them.
        </Text>
        <Card>
          <Diagram spec={services} />
        </Card>
        <List gap='narrower'>
          {POINTS.map((point) => (
            <ListItem key={point}>
              <Text is='span'>{point}</Text>
            </ListItem>
          ))}
        </List>
      </section>
    </Layout>
  );
};

export { Design };
