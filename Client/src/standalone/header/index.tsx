import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Layout } from 'design/components';

// Widgets
import { ThemeToggle } from 'design/widgets';

/**
 * Ki.CL's header has the theme toggle; the stand-in puts one at the top
 * right. Not fixed, so it scrolls away instead of covering the review's
 * sticky bar.
 */
const Header: React.FunctionComponent = () => {
  return (
    <Layout justifyItems='end'>
      <header
        className={classNames('kicl-padding-block', 'kicl-padding-inline-wide')}
      >
        <ThemeToggle variant='secondary' />
      </header>
    </Layout>
  );
};

export { Header };
