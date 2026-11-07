import type { Review, Summary } from '../../Shared/review';

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
export type { Store };
