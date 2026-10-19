import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import {
  Badge,
  Button,
  Card,
  CardContent,
  HyperLink,
  Layout,
  Text,
} from 'design/components';

// Libraries
import type { Decision, Edit as EditType } from '@/review/apply';

type Props = {
  decision: Decision | undefined;
  edit: EditType;
  onDecide: (decision: Decision) => void;
};

/** The card's edge shows the decision, so a long list can be scanned. */
const LEVELS = {
  accepted: 'confirm',
  rejected: 'error',
} as const;

const Edit: React.FunctionComponent<Props> = ({ decision, edit, onDecide }) => {
  const { t } = useTranslation('moonshot');

  return (
    <Card id={`edit-${edit.id}`} is='li' level={decision && LEVELS[decision]}>
      <Layout autoFlow='row' gap='narrower' justifyItems='start'>
        <CardContent>
          <Layout
            alignItems='center'
            autoFlow='column'
            justifyContent='space-between'
          >
            <header>
              {/* A rule the guide no longer has shows as its id, with no guidance. */}
              <Badge
                size='small'
                title={t('rule_guidance', {
                  context: edit.rule,
                  defaultValue: '',
                })}
                variant='ghost'
              >
                {t('rule', { context: edit.rule, defaultValue: edit.rule })}
              </Badge>
              {/* A rejected edit is plain text again, so there is nothing to show. */}
              {decision === 'rejected' ? null : (
                <HyperLink
                  className='kicl-font-size-smaller'
                  to={`#text-${edit.id}`}
                >
                  {t('action', { context: 'show_in_text' })}
                </HyperLink>
              )}
            </header>
          </Layout>
          <Text is='p'>
            <Text is='del'>{edit.quote}</Text>{' '}
            {edit.replacement ? (
              <Text is='ins'>{edit.replacement}</Text>
            ) : (
              <Badge size='small' level='error' variant='ghost'>
                {t('label', { context: 'remove' })}
              </Badge>
            )}
          </Text>
          <Text is='p' variant='secondary'>
            {edit.reason}
          </Text>
          <Layout autoFlow='column' gap='narrower' justifyContent='start'>
            <div role='group' aria-label={t('label', { context: 'decision' })}>
              <Button
                aria-pressed={decision === 'accepted'}
                disabled={decision === 'accepted'}
                level='confirm'
                onClick={() => onDecide('accepted')}
                size='small'
                variant='ghost'
              >
                {t('action', { context: 'accept' })}
              </Button>
              <Button
                aria-pressed={decision === 'rejected'}
                disabled={decision !== 'accepted'}
                level='error'
                onClick={() => onDecide('rejected')}
                size='small'
                variant='tertiary'
              >
                {t('action', { context: 'reject' })}
              </Button>
            </div>
          </Layout>
        </CardContent>
      </Layout>
    </Card>
  );
};

export { Edit };
