import React, { useEffect, useState } from 'react';

// Icons
import * as Ri from 'react-icons/ri';

// Components
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Heading,
  HyperLink,
  List,
  ListItem,
} from 'design/components';

// API
import { listReviews, type Summary } from '@/api';

// Constants
import { KIND_LABELS, KIND_LEVELS } from '@/constants';

const date = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** The user's last reviews. Nothing shows until there is at least one. */
const History: React.FunctionComponent = () => {
  const [reviews, setReviews] = useState<Summary[]>([]);

  useEffect(() => {
    listReviews()
      .then(setReviews)
      .catch(() => undefined);
  }, []);

  if (!reviews.length) {
    return null;
  }

  return (
    <Card aria-labelledby='history' is='section'>
      <CardHeader>
        <Heading dense id='history' is='h2'>
          Earlier reviews
        </Heading>
      </CardHeader>
      <List>
        {reviews.map(({ createdAt, editCount, excerpt, id, kind }) => (
          <ListItem key={id}>
            <div>
              <Card>
                <Badge level={KIND_LEVELS[kind]} size='small'>
                  {KIND_LABELS[kind]}
                </Badge>
                <CardContent className='kicl-margin-inline-narrower'>
                  <HyperLink
                    to={id}
                    after={<Ri.RiArrowRightSLine aria-hidden />}
                  >
                    {excerpt}
                  </HyperLink>
                </CardContent>
                <Badge size='small' variant='outline'>
                  {editCount} edits ·{' '}
                  <time>{date.format(new Date(createdAt))}</time>
                </Badge>
              </Card>
            </div>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export { History };
