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

/** Where a client token is asked for. */
const TOKEN_REQUEST = `mailto:hello@ki-cl.com?subject=${encodeURIComponent('Moonshot client token')}`;

// In the order the options show.
const KIND_LABELS: Record<Kind, string> = {
  commit: 'Commit',
  pr: 'Pull request',
  readme: 'README',
  comment: 'Code comment',
};

// How each kind is named in the text box's label, its placeholder and notes.
const KIND_FIELDS: Record<Kind, { label: string; noun: string }> = {
  commit: { label: 'Commit message', noun: 'a commit message' },
  pr: { label: 'Pull request description', noun: 'a pull request description' },
  readme: { label: 'README', noun: 'a README' },
  comment: { label: 'Code comment', noun: 'a code comment' },
};

// One colour per kind, so a kind looks the same wherever its badge shows.
const KIND_LEVELS: Record<Kind, React.ComponentProps<typeof Badge>['level']> = {
  commit: 'error',
  pr: 'warning',
  readme: undefined,
  comment: 'info',
};

export {
  KIND_FIELDS,
  KIND_LABELS,
  KIND_LEVELS,
  PATH,
  REPOSITORY,
  REVIEW_PATH,
  SESSION_ENDED,
  TOKEN_REQUEST,
};
