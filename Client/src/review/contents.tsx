import React, { Suspense, useState } from 'react';

// Libraries
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// Routes
import { useParams } from 'design/router';

// Icons
import * as Ri from 'react-icons/ri';

// Components
import {
  Badge,
  Heading,
  HyperLink,
  Layout,
  Spinner,
  Text,
} from 'design/components';

// Hooks
import { useResponsive } from 'design/hooks';
import { useReview } from './use-review';

// Libraries
import type { Decision, Decisions } from './apply';

// API
import { explain } from '@/api';

// Constants
import {
  KIND_LEVELS,
  PAGE_CLASS_NAMES,
  READING_PAGE_CLASS_NAMES,
  REVIEW_PATH,
} from '@/constants';

/**
 * Two layouts, loaded when needed, as Ki.CL's navigation does: side by side
 * above tablet, and stacked with the text held at the foot at tablet and below.
 */
const Mobile = React.lazy(async () => {
  const { Mobile } = await import('./mobile');

  return { default: Mobile };
});

const Default = React.lazy(async () => {
  const { Default } = await import('./default');

  return { default: Default };
});

const Contents: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { isMobile } = useResponsive();
  const Version = isMobile ? Mobile : Default;
  const { reviewId } = useParams();
  const state = useReview(reviewId);
  const [decisions, setDecisions] = useState<Decisions>({});

  if (state.status === 'loading') {
    return <Spinner />;
  }

  if (state.status === 'error') {
    return (
      <Layout
        autoFlow='row'
        className={classNames(READING_PAGE_CLASS_NAMES)}
        gap='normal'
      >
        <section>
          <Text level='error' is='p' role='alert'>
            {explain(t, state.error)}
          </Text>
          <HyperLink to={`../${REVIEW_PATH}`}>
            {t('action', { context: 'start_review' })}
          </HyperLink>
        </section>
      </Layout>
    );
  }

  const { review } = state;
  const reviewedAs = review.reviewedAs ?? review.kind;

  const decide = (id: string, decision: Decision) =>
    setDecisions((current) => ({ ...current, [id]: decision }));

  return (
    <Layout
      autoFlow='row'
      // Each part keeps its own gutter, so the mobile sticky bar can run edge to edge.
      className={classNames(PAGE_CLASS_NAMES)}
      gap='wide'
      justifyItems='stretch'
    >
      <section>
        {/* The kind the text was reviewed as, which the note explains when it differs. */}
        <Layout autoFlow='row' gap='wide' justifyItems='start'>
          <header className='kicl-padding-inline-wide'>
            <HyperLink
              before={
                <Ri.RiArrowLeftSLine aria-hidden className='kicl-rtl-mirror' />
              }
              to={`../${REVIEW_PATH}`}
            >
              {t('action', { context: 'new_review' })}
            </HyperLink>
            <Layout autoFlow='row' gap='narrowest' justifyItems='start'>
              <Heading dense is='h1'>
                <Badge size='small' level={KIND_LEVELS[reviewedAs]}>
                  {t('kind', { context: reviewedAs })}
                </Badge>
                {t('title', { context: 'review' })}
              </Heading>
            </Layout>
            {reviewedAs !== review.kind ? (
              <Text is='p' variant='secondary'>
                {/* A kind is never reviewed as itself, so those pairs have no sentence. */}
                {t('reviewed_as', {
                  context: `${review.kind}_${reviewedAs}`,
                  defaultValue: '',
                })}
              </Text>
            ) : null}
          </header>
        </Layout>
        <Suspense fallback={<Spinner />}>
          <Version decisions={decisions} onDecide={decide} review={review} />
        </Suspense>
      </section>
    </Layout>
  );
};

export { Contents };
