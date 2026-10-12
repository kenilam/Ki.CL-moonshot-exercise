import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import { Heading, Layout, Markdown, Text } from 'design/components';

// Constants
import { REPOSITORY, TOKEN_REQUEST } from '@/constants';

const COMMANDS = [
  `git clone ${REPOSITORY}.git`,
  'cd Ki.CL-moonshot-exercise',
  'cp .env.template .env   # then set KICL_CLIENT_TOKEN',
  'make start',
].join('\n');

const Setup: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Layout autoFlow='row' gap='normal'>
      <section aria-labelledby='introduction-setup'>
        <Heading id='introduction-setup' is='h2'>
          {t('title', { context: 'setup' })}
        </Heading>
        <Text is='p'>
          <Markdown>
            {t('introduction.setup.token', { token_request: TOKEN_REQUEST })}
          </Markdown>
        </Text>
        <Text is='pre'>
          <Text is='code'>{COMMANDS}</Text>
        </Text>
        <Text is='p'>
          <Markdown>{t('introduction.setup.open')}</Markdown>
        </Text>
        <Text is='p'>
          <Markdown>
            {t('introduction.setup.local', { readme: `${REPOSITORY}#readme` })}
          </Markdown>
        </Text>
      </section>
    </Layout>
  );
};

export { Setup };
