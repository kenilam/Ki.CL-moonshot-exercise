import React from 'react';

// Components
import { Heading, HyperLink, Layout, Text } from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Constants
import { REPOSITORY, TOKEN_REQUEST } from '@/constants';

const COMMANDS = [
  `git clone ${REPOSITORY}.git`,
  'cd Ki.CL-moonshot-exercise',
  'make start',
].join('\n');

const Setup: React.FunctionComponent = () => {
  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-labelledby='introduction-setup'>
        <Heading id='introduction-setup' is='h2'>
          Run it locally
        </Heading>
        <Text is='p'>
          It runs on its own, without the design system, the API or an Anthropic
          key: the dev server forwards those to dev.ki-cl.com. That needs a
          client token, which is personal and expires, so it isn’t shared here:{' '}
          <HyperLink before={<Ri.RiMailLine aria-hidden />} to={TOKEN_REQUEST}>
            ask me for one
          </HyperLink>
          . It needs Node 24 and Yarn 4.
        </Text>
        <Text is='pre'>
          <Text is='code'>{COMMANDS}</Text>
        </Text>
        <Text is='p'>
          Put the token in <Text is='code'>.env</Text> as{' '}
          <Text is='code'>KICL_CLIENT_TOKEN</Text>, and open{' '}
          <Text is='code'>http://localhost:3300/portfolio/moonshot</Text> in
          Chrome or Firefox. Safari doesn’t keep the API’s secure cookies on
          localhost.
        </Text>
        <Text is='p'>
          With the API and the design system running locally, no token is
          needed: the dev server sends everything to them instead. The{' '}
          <HyperLink to={`${REPOSITORY}#readme`}>README</HyperLink> covers that
          setup, the tests and the eval.
        </Text>
      </section>
    </Layout>
  );
};

export { Setup };
