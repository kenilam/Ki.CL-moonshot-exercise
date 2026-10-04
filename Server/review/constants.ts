/** Shared with the client, so this file imports nothing. */

const KINDS = ['commit', 'pr', 'readme', 'comment'] as const;

/** Longest text a review accepts, in characters. */
const MAX_LENGTH = 8000;

type Kind = (typeof KINDS)[number];

export { KINDS, MAX_LENGTH };
export type { Kind };
