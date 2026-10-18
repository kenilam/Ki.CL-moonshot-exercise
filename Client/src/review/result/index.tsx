import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import {
  Card,
  CardAction,
  CardContent,
  CardTitle,
  CopyButton,
  Text,
} from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Libraries
import { apply } from '@/review/apply';

// Types
import type { Props as VersionProps } from '@/review/default';

type Props = Pick<VersionProps, 'decisions' | 'review'>;

/** The text with the accepted edits applied, ready to copy. */
const Result: React.FunctionComponent<Props> = ({ decisions, review }) => {
  const { t } = useTranslation('moonshot');
  const text = apply(review.text, review.edits, decisions);

  return (
    <Card
      header={
        <>
          <CardTitle is='h2'>{t('title', { context: 'result' })}</CardTitle>
          <CardAction>
            <CopyButton
              copiedLabel={t('status', { context: 'copied' })}
              icon={<Ri.RiClipboardLine aria-hidden />}
              label={t('action', { context: 'copy' })}
              level='info'
              showLabel
              size='small'
              value={text}
              variant='secondary'
            />
          </CardAction>
        </>
      }
      is='section'
    >
      <CardContent>
        <Text is='span'>{text}</Text>
      </CardContent>
    </Card>
  );
};

export { Result };
