import type { Edit, Kind } from '../review/schema';

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

interface Store {
  create(review: Review): Promise<void>;
  get(userGUID: string, id: string): Promise<Review | null>;
  list(userGUID: string, limit: number): Promise<Summary[]>;
  countSince(userGUID: string, since: Date): Promise<number>;
  /** Whether the store can still answer, for the health check. */
  healthy(): Promise<boolean>;
}

const summarise = ({ id, kind, createdAt, text, edits }: Review): Summary => ({
  createdAt,
  editCount: edits.length,
  excerpt: text.slice(0, 120),
  id,
  kind,
});

export { summarise };
export type { Review, Store, Summary };
