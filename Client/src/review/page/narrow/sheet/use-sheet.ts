import { useEffect, useRef } from 'react';

// Context
import { useReviewContext } from 'moonshot/review/context';

/**
 * The links between the text and the edits move between sheet and page: a
 * highlight closes the sheet to show its edit, and "Show in text" opens it
 * on the text. A decision opens it, so the change it made is in view.
 */
const useSheet = () => {
  const { decisions } = useReviewContext();
  const sheet = useRef<HTMLDialogElement>(null);
  const decided = useRef(decisions);

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

    return () => {
      removeEventListener('hashchange', follow);
    };
  }, []);

  useEffect(() => {
    if (decisions === decided.current) {
      return;
    }

    sheet.current?.showPopover();
  }, [decisions]);

  return sheet;
};

export { useSheet };
