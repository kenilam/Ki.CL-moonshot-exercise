import type { RuleId } from './rules';

const KINDS = ['commit', 'pr', 'readme', 'comment'] as const;

/** Longest text a review accepts, in characters. */
const MAX_LENGTH = 8000;

type Kind = (typeof KINDS)[number];

/** An edit the server has found in the text, with its character offsets. */
type Edit = {
  id: string;
  start: number;
  end: number;
  quote: string;
  replacement: string;
  rule: RuleId;
  reason: string;
};

type Review = {
  id: string;
  userGUID: string;
  kind: Kind;
  text: string;
  edits: Edit[];
  /** Why the text wasn't reviewed. Kept so it still counts against the allowance. */
  rejection: string | null;
  /**
   * The kind the text was reviewed as. Differs from `kind` when the text
   * clearly reads as another kind. Missing on reviews made before it existed.
   */
  reviewedAs?: Kind;
  model: string;
  rules: string;
  createdAt: Date;
};

type Summary = Pick<Review, 'id' | 'kind' | 'createdAt'> & {
  /** The start of the text, for the history list. */
  excerpt: string;
  editCount: number;
};

/** What `GET /allowance` answers, read by the client's allowance badge. */
type Allowance = { limit: number; remaining: number };

export { KINDS, MAX_LENGTH };
export type { Allowance, Edit, Kind, Review, Summary };
