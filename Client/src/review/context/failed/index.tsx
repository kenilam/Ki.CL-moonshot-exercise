import React from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { HyperLink, Layout, Text } from 'design/components';

// API
import { explain } from 'moonshot/api';

// Hooks
import { useTranslation } from 'design/hooks';
import type { useReview } from 'moonshot/review/context/use-review';

// Constants
import { READING_PAGE_CLASS_NAMES, REVIEW_PATH } from 'moonshot/constants';

type Props = Pick<
  Extract<ReturnType<typeof useReview>, { status: 'error' }>,
  'error'
>;

const Failed: React.FunctionComponent<Props> = ({ error }) => {
  const { t } = useTranslation('moonshot');

  return (
    <Layout
      autoFlow='row'
      className={classNames(READING_PAGE_CLASS_NAMES)}
      gap='normal'
    >
      <section>
        <Text level='error' is='p' role='alert'>
          {explain(t, error)}
        </Text>
        <HyperLink to={`../${REVIEW_PATH}`}>
          {t('action', { context: 'start_review' })}
        </HyperLink>
      </section>
    </Layout>
  );
};

export { Failed };
