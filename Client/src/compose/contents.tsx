import React from 'react';

// Libraries
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// Components
import { Heading, HyperLink, Layout } from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Partials
import { ComposeForm } from './form';
import { History } from './history';
import { Intro } from './intro';

const Contents: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

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
      gap='wide'
      justifyItems='stretch'
    >
      <section>
        <header>
          <HyperLink before={<Ri.RiArrowLeftSLine aria-hidden />} to='..'>
            {t('action', { context: 'about' })}
          </HyperLink>
          <Heading is='h1'>{t('title', { context: 'writing_review' })}</Heading>
          <Intro />
        </header>
        <ComposeForm />
        <History />
      </section>
    </Layout>
  );
};

export { Contents };
