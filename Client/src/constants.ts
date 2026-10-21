import type React from 'react';

import type { Badge } from 'design/components';

import type { Kind } from './api';

/** Route segment, under Ki.CL's `/portfolio`. */
const PATH = 'moonshot';

/** The editor's segment under `PATH`; the introduction is `PATH` itself. */
const REVIEW_PATH = 'writing-review';

/**
 * Fired on `window` when moonshot's API answers 401. The host listens: Ki.CL's
 * portfolio gate shows its sign-in, and the standalone shell starts a new
 * session. Ki.CL's `views/portfolio/gate/constants.ts` has the same name.
 */
const SESSION_ENDED = 'kicl:session-ended';

const REPOSITORY = 'https://github.com/kenilam/Ki.CL-moonshot-exercise';

/** Where a client token is asked for: the mail button there opens the contact form. */
const TOKEN_REQUEST = 'https://ki-cl.com';

/** A page's own box: full width, and clear of Ki.CL's global header when there is one. */
const PAGE_CLASS_NAMES = [
  'kicl-inline-size-full',
  'kicl-padding-block-end-wide',
  'kicl-padding-block-start-header',
];

/** A page of reading: eight columns, centred, with its gutter. */
const READING_PAGE_CLASS_NAMES = [
  ...PAGE_CLASS_NAMES,
  'kicl-margin-inline-auto',
  'kicl-max-inline-size-columns-8',
  'kicl-padding-inline-wide',
];

// One colour per kind, so a kind looks the same wherever its badge shows.
const KIND_LEVELS: Record<Kind, React.ComponentProps<typeof Badge>['level']> = {
  commit: 'error',
  pr: 'warning',
  readme: 'neutral',
  comment: 'info',
};

export {
  KIND_LEVELS,
  PAGE_CLASS_NAMES,
  PATH,
  READING_PAGE_CLASS_NAMES,
  REPOSITORY,
  REVIEW_PATH,
  SESSION_ENDED,
  TOKEN_REQUEST,
};
