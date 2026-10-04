import { z } from 'zod';

import { KINDS, MAX_LENGTH, type Kind } from './constants';
import { RULE_IDS } from './rules';

const ReviewInput = z.object({
  kind: z.enum(KINDS),
  text: z.string().trim().min(1).max(MAX_LENGTH),
});

/**
 * What the model returns. Positions are worked out on the server, not here.
 * `rejection` is set, with no edits, when the text isn't something to review.
 * `reviewedAs` is the kind the text actually is, which can differ from the
 * kind it was submitted as.
 */
const ProposedEdits = z.object({
  rejection: z.string().nullable(),
  reviewedAs: z.enum(KINDS),
  edits: z.array(
    z.object({
      quote: z.string(),
      replacement: z.string(),
      rule: z.enum(RULE_IDS),
      reason: z.string(),
    })
  ),
});

type Proposal = z.infer<typeof ProposedEdits>;
type Proposed = Proposal['edits'][number];

/** An edit the server has found in the text, with its character offsets. */
type Edit = Proposed & {
  id: string;
  start: number;
  end: number;
};

export { KINDS, MAX_LENGTH, ProposedEdits, ReviewInput };
export type { Edit, Kind, Proposal, Proposed };
