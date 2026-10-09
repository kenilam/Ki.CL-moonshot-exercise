import React, { useState } from 'react';

// Components
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Layout,
  Text,
} from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Libraries
import { apply, type Decisions } from '@/review/apply';

// API
import type { Review } from '@/api';

/** `className` sizes the card from the page, such as a height cap. */
type Props = Pick<React.ComponentProps<typeof Card>, 'className'> & {
  decisions: Decisions;
  review: Review;
};

/** The text with the accepted edits applied, ready to copy. */
const Result: React.FunctionComponent<Props> = ({
  className,
  decisions,
  review,
}) => {
  const [copied, setCopied] = useState(false);
  const text = apply(review.text, review.edits, decisions);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Card className={className} is='section'>
      <Layout
        autoFlow='column'
        alignItems='center'
        justifyContent='space-between'
      >
        <CardHeader>
          <CardTitle is='h2'>Result</CardTitle>
          <Button
            before={
              copied ? (
                <Ri.RiCheckLine aria-hidden />
              ) : (
                <Ri.RiClipboardLine aria-hidden />
              )
            }
            onClick={copy}
            level={copied ? 'confirm' : 'info'}
            size='small'
            variant='secondary'
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </CardHeader>
      </Layout>
      <CardContent>
        <Text is='span'>{text}</Text>
      </CardContent>
    </Card>
  );
};

export { Result };
