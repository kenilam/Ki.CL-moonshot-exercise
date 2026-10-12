import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  List,
  Text,
} from 'design/components';

// Partials
import { Edit } from './edit';

// Libraries
import type { Decision, Decisions, Edit as EditType } from '@/review/apply';

/** `className` comes from the page's `Layout span`. */
type Props = Pick<React.ComponentProps<typeof Card>, 'className'> & {
  decisions: Decisions;
  edits: EditType[];
  onDecide: (id: string, decision: Decision) => void;
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
    <Card className={className} is='section'>
      <CardHeader>
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
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export { Edits };
