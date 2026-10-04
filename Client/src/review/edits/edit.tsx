import React from 'react';

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

// API
import type { Rule } from '@/api';

type Props = {
  decision: Decision | undefined;
  edit: EditType;
  onDecide: (decision: Decision) => void;
  rule: Rule | undefined;
};

/** The card's edge shows the decision, so a long list can be scanned. */
const LEVELS = {
  accepted: 'confirm',
  rejected: 'error',
} as const;

const Edit: React.FunctionComponent<Props> = ({
  decision,
  edit,
  onDecide,
  rule,
}) => {
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
              <Badge size='small' title={rule?.guidance} variant='outline'>
                {rule?.name ?? edit.rule}
              </Badge>
              {/* A rejected edit is plain text again, so there is nothing to show. */}
              {decision === 'rejected' ? null : (
                <HyperLink
                  className='kicl-font-size-smaller'
                  to={`#text-${edit.id}`}
                >
                  Show in text
                </HyperLink>
              )}
            </header>
          </Layout>
          <Text is='p'>
            <Text is='del'>{edit.quote}</Text>{' '}
            {edit.replacement ? (
              <Text is='ins'>{edit.replacement}</Text>
            ) : (
              <Badge level='error' size='small' variant='outline'>
                Remove
              </Badge>
            )}
          </Text>
          <Text is='p' variant='secondary'>
            {edit.reason}
          </Text>
          <Layout autoFlow='column' gap='narrower' justifyContent='start'>
            <div role='group' aria-label='Decision'>
              <Button
                aria-pressed={decision === 'accepted'}
                disabled={decision === 'accepted'}
                level='confirm'
                onClick={() => onDecide('accepted')}
                size='small'
                variant='ghost'
              >
                Accept
              </Button>
              <Button
                aria-pressed={decision === 'rejected'}
                disabled={decision !== 'accepted'}
                level='error'
                onClick={() => onDecide('rejected')}
                size='small'
                variant='tertiary'
              >
                Reject
              </Button>
            </div>
          </Layout>
        </CardContent>
      </Layout>
    </Card>
  );
};

export { Edit };
