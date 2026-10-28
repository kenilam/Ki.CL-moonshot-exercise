import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import {
  Button,
  Card,
  CardAction,
  CardTitle,
  List,
  Text,
} from 'design/components';

// Partials
import { Edit } from './edit';

// Libraries
import type { Edit as EditType } from '@/review/apply';

// Types
import type { Props as VersionProps } from '@/review/default';

/** `className` positions the card from the page, such as keeping it in view. */
type Props = Pick<React.ComponentProps<typeof Card>, 'className'> &
  Pick<VersionProps, 'decisions' | 'onDecide'> & {
    edits: EditType[];
  };

const Edits: React.FunctionComponent<Props> = ({
  className,
  decisions,
  edits,
  onDecide,
}) => {
  const { t } = useTranslation('moonshot');
  const pending = edits.filter(({ id }) => !decisions[id]);

  return (
    <Card
      className={className}
      header={
        <>
          <CardTitle is='h2'>
            {t('title', { context: 'edits', total: edits.length })}
          </CardTitle>
          {pending.length ? (
            <CardAction>
              <Button
                onClick={() =>
                  pending.forEach(({ id }) => onDecide(id, 'accepted'))
                }
                size='small'
                variant='secondary'
              >
                {t('action', { context: 'accept_all' })}
              </Button>
            </CardAction>
          ) : null}
        </>
      }
      is='section'
    >
      {edits.length ? (
        <List gap='normal'>
          {edits.map((edit) => (
            <Edit
              decision={decisions[edit.id]}
              edit={edit}
              key={edit.id}
              onDecide={(decision) => onDecide(edit.id, decision)}
            />
          ))}
        </List>
      ) : (
        <Text is='p'>{t('no_edits')}</Text>
      )}
    </Card>
  );
};

export { Edits };
