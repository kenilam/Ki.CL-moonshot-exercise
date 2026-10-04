import React from 'react';

// Components
import { Heading, HyperLink, Layout, Text } from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Constants
import { REPOSITORY, REVIEW_PATH } from '@/constants';

const Hero: React.FunctionComponent = () => {
  return (
    <Layout autoFlow='row' gap='normal' justifyItems='start'>
      <header>
        <Heading is='h1'>Writing review</Heading>
        <Text is='p'>
          A reviewer for what engineers write for each other: commit messages,
          pull request descriptions, READMEs and code comments. It suggests
          small edits, each tied to a style rule, and the person keeps the ones
          they agree with.
        </Text>
        <Layout autoFlow='column' gap='normal'>
          <nav aria-label='Writing review'>
            <HyperLink
              after={<Ri.RiArrowRightLine aria-hidden />}
              lookLikeButton
              to={REVIEW_PATH}
            >
              Try it
            </HyperLink>
            <HyperLink
              before={<Ri.RiGithubLine aria-hidden />}
              lookLikeButton
              to={REPOSITORY}
              variant='secondary'
            >
              Source on GitHub
            </HyperLink>
          </nav>
        </Layout>
      </header>
    </Layout>
  );
};

export { Hero };
