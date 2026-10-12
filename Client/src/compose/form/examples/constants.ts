/**
 * Three texts per kind: one that already reads well, one with plenty to edit,
 * and one the review turns away because it isn't that kind of writing or tries
 * to instruct the model. The texts are `examples.<kind>.<example>` in the
 * `moonshot` namespace.
 */
const EXAMPLES = ['clean', 'edits', 'rejected'] as const;

type Example = (typeof EXAMPLES)[number];

export { EXAMPLES };
export type { Example };
