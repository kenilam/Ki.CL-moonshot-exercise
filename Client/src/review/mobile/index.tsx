import React, { useEffect, useId, useRef, useState } from 'react';

// Libraries
import classNames from 'classnames';

// Components
import { Button, Layout, Sheet, SheetHeader } from 'design/components';

// Icons
import * as Ri from 'react-icons/ri';

// Partials
import { Edits } from '@/review/edits';
import { Result } from '@/review/result';
import { Marked } from '@/review/text';

// Types
import type { Props } from '@/review/default';

/**
 * Tablet and below: the result and the text open in a sheet over the edits,
 * the result first. Closing it shows the edits; the bar opens it again. A
 * decision opens it, so the change it made is in view.
 */
const Mobile: React.FunctionComponent<Props> = ({
  decisions,
  onDecide,
  review,
  rules,
}) => {
  const sheet = useRef<HTMLDialogElement>(null);

  // A new key each time the sheet closes, so "Copied" is back to "Copy".
  const [closings, setClosings] = useState(0);
  const id = `review-sheet-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  /*
   * The links between the text and the edits move between sheet and page: a
   * highlight closes the sheet to show its edit, and "Show in text" opens it
   * on the text.
   */
  useEffect(() => {
    const follow = () => {
      const element = sheet.current;

      if (!element) {
        return;
      }

      // Modal on small screens, it closes as a dialog; otherwise as a popover.
      if (location.hash.startsWith('#edit-')) {
        if (element.open) {
          element.close();
        } else {
          element.hidePopover();
        }
      }

      if (location.hash.startsWith('#text-')) {
        element.showPopover();
      }
    };

    addEventListener('hashchange', follow);

    return () => removeEventListener('hashchange', follow);
  }, []);

  return (
    <>
      <Layout autoFlow='row' justifyItems='end'>
        {/* Sticks under Ki.CL's global header; at the top when there is none. */}
        <div
          className={classNames(
            'kicl-backdrop',
            'kicl-inset-block-start-header',
            'kicl-padding-block',
            'kicl-padding-inline-wide',
            'kicl-position-sticky',
            'kicl-z-index-raised'
          )}
        >
          <Button
            before={<Ri.RiFileTextLine aria-hidden />}
            popoverTarget={id}
            popoverTargetAction='show'
            size='small'
            variant='ghost'
          >
            Your text and result
          </Button>
        </div>
      </Layout>
      {/* Padding, not margin: a card is its parent's full width, and a margin would overflow it. */}
      <Layout autoFlow='row'>
        <div className='kicl-padding-inline-wide'>
          <Edits
            decisions={decisions}
            edits={review.edits}
            onDecide={(edit, decision) => {
              onDecide(edit, decision);
              sheet.current?.showPopover();
            }}
            rules={rules}
          />
        </div>
      </Layout>
      <Sheet
        aria-label='Your text and result'
        id={id}
        onOpenChange={(open) => {
          if (!open) {
            setClosings((count) => count + 1);
          }
        }}
        ref={sheet}
      >
        <Layout justifyItems='end'>
          <SheetHeader>
            <Button
              aria-label='Close'
              popoverTarget={id}
              popoverTargetAction='hide'
              size='small'
              variant='ghost'
            >
              <Ri.RiCloseLine aria-hidden />
            </Button>
          </SheetHeader>
        </Layout>
        {/* One wrapper, so both cards share the sheet's content row. */}
        <Layout alignContent='start' autoFlow='row' gap='normal'>
          <div>
            <Result decisions={decisions} key={closings} review={review} />
            <Marked decisions={decisions} review={review} rules={rules} />
          </div>
        </Layout>
      </Sheet>
    </>
  );
};

export { Mobile };
