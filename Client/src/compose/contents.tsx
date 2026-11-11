import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Heading, HyperLink, Layout } from 'design/components';

// Icons
import * as Tb from 'react-icons/tb';

// Hooks
import { useTranslation } from 'design/hooks';

// Partials
import { ComposeForm } from './form';
import { History } from './history';
import { Intro } from './intro';

// Constants
import { READING_PAGE_CLASS_NAMES } from 'moonshot/constants';

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
              <Tb.TbChevronLeft aria-hidden className='kicl-rtl-mirror' />
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
