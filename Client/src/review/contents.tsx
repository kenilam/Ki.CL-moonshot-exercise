import React, { Suspense, useState } from 'react';

// Libraries
import classNames from 'classnames';

// Routes
import { Link, useParams } from 'design/router';

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

// Constants
import {
  KIND_FIELDS,
  KIND_LABELS,
  KIND_LEVELS,
  REVIEW_PATH,
} from '@/constants';

/**
 * Two layouts, loaded when needed, as Ki.CL's navigation does: side by side
 * above tablet, and stacked with the text held at the foot at tablet and below.
 */
const VERSIONS = {
  true: React.lazy(() =>
    import('./mobile').then(({ Mobile }) => ({ default: Mobile }))
  ),
  false: React.lazy(() =>
    import('./default').then(({ Default }) => ({ default: Default }))
  ),
};

const Contents: React.FunctionComponent = () => {
  const { isMobile } = useResponsive();
  const Version = VERSIONS[String(isMobile) as 'true' | 'false'];
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
        className={classNames(
          'kicl-inline-size-full',
          'kicl-padding-block-end-wide',
          // Clears Ki.CL's global header; nothing to clear when there is none.
          'kicl-padding-block-start-header',
          'kicl-padding-inline-wide'
        )}
        gap='normal'
      >
        <section>
          <Text accent='error' is='p' role='alert'>
            {state.message}
          </Text>
          <Link to={`../${REVIEW_PATH}`}>Start a new review</Link>
        </section>
      </Layout>
    );
  }

  const { review, rules } = state;
  const reviewedAs = review.reviewedAs ?? review.kind;

  const decide = (id: string, decision: Decision) =>
    setDecisions((current) => ({ ...current, [id]: decision }));

  return (
    <Layout
      autoFlow='row'
      className={classNames(
        'kicl-inline-size-full',
        'kicl-padding-block-end-wide',
        // Clears Ki.CL's global header; nothing to clear when there is none.
        'kicl-padding-block-start-header',
        // On mobile the parts keep their own gutter, so the sticky bar can run edge to edge.
        { 'kicl-padding-inline-wide': !isMobile }
      )}
      gap='wide'
      justifyItems='stretch'
    >
      <section>
        {/* The kind the text was reviewed as, which the note explains when it differs. */}
        <Layout autoFlow='row' gap='wide' justifyItems='start'>
          <header
            className={classNames({ 'kicl-padding-inline-wide': isMobile })}
          >
            <HyperLink
              before={<Ri.RiArrowLeftSLine aria-hidden />}
              to={`../${REVIEW_PATH}`}
            >
              New review
            </HyperLink>
            <Layout autoFlow='row' gap='narrowest' justifyItems='start'>
              <Heading dense is='h1'>
                <Badge level={KIND_LEVELS[reviewedAs]} size='small'>
                  {KIND_LABELS[reviewedAs]}
                </Badge>
                Review
              </Heading>
            </Layout>
            {reviewedAs !== review.kind ? (
              <Text is='p' variant='secondary'>
                {`Submitted as ${KIND_FIELDS[review.kind].noun}; reviewed as ${KIND_FIELDS[reviewedAs].noun}.`}
              </Text>
            ) : null}
          </header>
        </Layout>
        <Suspense fallback={<Spinner />}>
          <Version
            decisions={decisions}
            onDecide={decide}
            review={review}
            rules={rules}
          />
        </Suspense>
      </section>
    </Layout>
  );
};

export { Contents };
