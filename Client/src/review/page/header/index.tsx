import React from 'react';

// Icons
import * as Tb from 'react-icons/tb';

// Components
import { Badge, Heading, HyperLink, Layout, Text } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Context
import { useReviewContext } from 'moonshot/review/context';

// Constants
import { KIND_LEVELS, REVIEW_PATH } from 'moonshot/constants';

/** The kind the text was reviewed as, which the note explains when it differs. */
const Header: React.FunctionComponent = () => {
  const { t } = useTranslation('moonshot');
  const { review } = useReviewContext();
  const reviewedAs = review.reviewedAs ?? review.kind;

  return (
    <Layout autoFlow='row' gap='wide' justifyItems='start'>
      <header className='kicl-padding-inline-wide'>
        <HyperLink
          before={<Tb.TbChevronLeft aria-hidden className='kicl-rtl-mirror' />}
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
  );
};

export { Header };
