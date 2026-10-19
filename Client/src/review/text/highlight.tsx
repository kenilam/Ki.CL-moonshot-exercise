import React from 'react';

// Libraries
import { useTranslation } from 'react-i18next';

// Components
import {
  Badge,
  HyperLink,
  Layout,
  Popover,
  PopoverHint,
  PopoverTrigger,
  Text,
} from 'design/components';

// Libraries
import type { Decision, Edit } from '@/review/apply';

type Props = {
  decision: Decision | undefined;
  edit: Edit;
};

/**
 * One edit inside the text: a link to its card. Hovering or focusing it shows
 * the rule and the reason, opened by the browser through `interestfor`.
 */
const Highlight: React.FunctionComponent<Props> = ({ decision, edit }) => {
  const { t } = useTranslation('moonshot');

  return (
    <Popover inline>
      <PopoverTrigger asChild>
        <HyperLink id={`text-${edit.id}`} to={`#edit-${edit.id}`}>
          {decision === 'accepted' ? (
            <>
              <Text is='del'>{edit.quote}</Text>{' '}
              <Text is='ins'>{edit.replacement}</Text>
            </>
          ) : (
            <mark>{edit.quote}</mark>
          )}
        </HyperLink>
      </PopoverTrigger>
      {/* The cap goes on the panel: it's the panel that has to stay narrow. */}
      <PopoverHint className='kicl-max-inline-size-columns-4'>
        <Layout autoFlow='row' gap='narrower' justifyItems='start'>
          <div className='kicl-padding-narrow'>
            <Badge size='small' variant='ghost'>
              {/* A rule the guide no longer has shows as its id. */}
              {t('rule', { context: edit.rule, defaultValue: edit.rule })}
            </Badge>
            <Text className='kicl-font-size-small' is='p' variant='secondary'>
              {edit.reason}
            </Text>
          </div>
        </Layout>
      </PopoverHint>
    </Popover>
  );
};

export { Highlight };
