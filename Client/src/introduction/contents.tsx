import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Layout } from 'design/components';

// Partials
import { Design } from './design';
import { Hero } from './hero';
import { Idea } from './idea';
import { Setup } from './setup';

// Constants
import { READING_PAGE_CLASS_NAMES } from '@/constants';

/** What the exercise is, how it's built and how to run it, before the editor. */
const Contents: React.FunctionComponent = () => {
  return (
    <Layout
      autoFlow='row'
      className={classNames(READING_PAGE_CLASS_NAMES)}
      gap='widest'
      justifyItems='stretch'
    >
      <article>
        <Hero />
        <Idea />
        <Design />
        <Setup />
      </article>
    </Layout>
  );
};

export { Contents };
