import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import { Heading, HyperLink, Layout, Text } from 'design/components';

// Icons
import * as Bs from 'react-icons/bs';

// Constants
import { REPOSITORY, REVIEW_PATH } from '@/constants';

const Hero: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');

  return (
    <Layout autoFlow='row' gap='normal' justifyItems='start'>
      <header>
        <Heading is='h1'>{t('title', { context: 'writing_review' })}</Heading>
        <Text is='p'>{t('introduction.hero.summary')}</Text>
        <Layout autoFlow='column' gap='normal'>
          <nav aria-label={t('title', { context: 'writing_review' })}>
            <HyperLink
              after={
                <Bs.BsArrowRight aria-hidden className='kicl-rtl-mirror' />
              }
              lookLikeButton
              to={REVIEW_PATH}
            >
              {t('action', { context: 'try' })}
            </HyperLink>
            <HyperLink
              before={<Bs.BsGithub aria-hidden />}
              lookLikeButton
              to={REPOSITORY}
              variant='secondary'
            >
              {t('action', { context: 'source' })}
            </HyperLink>
          </nav>
        </Layout>
      </header>
    </Layout>
  );
};

export { Hero };
