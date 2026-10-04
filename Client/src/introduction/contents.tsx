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

/** What the exercise is, how it's built and how to run it, before the editor. */
const Contents: React.FunctionComponent = () => {
  return (
    <Layout
      autoFlow='row'
      className={classNames(
        'kicl-inline-size-full',
        'kicl-margin-inline-auto',
        'kicl-max-inline-size-columns-8',
        'kicl-padding-block-end-wide',
        // Clears Ki.CL's global header; nothing to clear when there is none.
        'kicl-padding-block-start-header',
        'kicl-padding-inline-wide'
      )}
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
