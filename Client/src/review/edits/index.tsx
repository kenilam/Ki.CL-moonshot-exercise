import React from 'react';

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

// API
import type { Rule } from '@/api';

/** `className` comes from the page's `Layout span`. */
type Props = Pick<React.ComponentProps<typeof Card>, 'className'> & {
  decisions: Decisions;
  edits: EditType[];
  onDecide: (id: string, decision: Decision) => void;
  rules: Map<string, Rule>;
};

const Edits: React.FunctionComponent<Props> = ({
  className,
  decisions,
  edits,
  onDecide,
  rules,
}) => {
  const pending = edits.filter(({ id }) => !decisions[id]);

  return (
    <Card className={className} is='section'>
      <CardHeader>
        <CardTitle is='h2'>Edits ({edits.length})</CardTitle>
        {pending.length ? (
          <CardAction>
            <Button
              onClick={() =>
                pending.forEach(({ id }) => onDecide(id, 'accepted'))
              }
              size='small'
              variant='secondary'
            >
              Accept all
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
                rule={rules.get(edit.rule)}
              />
            ))}
          </List>
        ) : (
          <Text is='p'>No edits. It reads well.</Text>
        )}
      </CardContent>
    </Card>
  );
};

export { Edits };
