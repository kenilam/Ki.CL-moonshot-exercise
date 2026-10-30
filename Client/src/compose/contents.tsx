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

// Constants
import { READING_PAGE_CLASS_NAMES } from '@/constants';

const Contents: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Layout
      autoFlow='row'
      className={classNames(READING_PAGE_CLASS_NAMES)}
      gap='wide'
      justifyItems='stretch'
    >
      <section>
        <header>
          <HyperLink
            before={
              <Ri.RiArrowLeftSLine aria-hidden className='kicl-rtl-mirror' />
            }
            to='..'
          >
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
