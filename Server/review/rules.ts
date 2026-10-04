/**
 * The style guide the model edits against. Each edit names one of these ids,
 * so the UI can show which rule it applies.
 *
 * Bump VERSION when a rule changes, so a stored review can be traced back to
 * the guide that produced it.
 */
const VERSION = '1';

const RULES = [
  {
    id: 'lead-with-point',
    name: 'Lead with the point',
    guidance:
      'The first sentence says the outcome or the decision. Background, build-up and context come after it, if at all.',
  },
  {
    id: 'cut-mechanism',
    name: 'Cut detail the reader does not need',
    guidance:
      'Describe what happens from the reader’s side. Remove step-by-step mechanism, edge cases and justifications for choices nobody would question.',
  },
  {
    id: 'no-repetition',
    name: 'Say it once',
    guidance:
      'Remove sentences that restate the previous one, summaries of what was just said, and closing lines that repeat the opening.',
  },
  {
    id: 'no-filler-transitions',
    name: 'No filler transitions',
    guidance:
      'Remove phrases like “It is worth noting”, “The key thing is”, “Ultimately”, “As a result”, “In order to” when the sentences already connect.',
  },
  {
    id: 'no-empty-qualifiers',
    name: 'No empty qualifiers',
    guidance:
      'Remove words that carry no information: essentially, fundamentally, robust, seamless, powerful, elegant, significantly, highly, quite.',
  },
  {
    id: 'no-corporate',
    name: 'No corporate language',
    guidance:
      'Replace “leverage”, “utilize”, “unlock value”, “drive alignment”, “holistic”, “best-in-class” with the plain word or the concrete thing.',
  },
  {
    id: 'no-generated-rhythm',
    name: 'No generated rhythm',
    guidance:
      'Rewrite triplets used for effect, “not X, but Y”, a colon followed by a punchline, and em dashes used as a dramatic pause.',
  },
  {
    id: 'no-manufactured-lesson',
    name: 'No manufactured lessons',
    guidance:
      'Remove sentences that turn a detail into a lesson: “This taught me”, “This highlights the importance of”, “The takeaway is”.',
  },
  {
    id: 'concrete-names',
    name: 'Use the real names',
    guidance:
      'Replace vague abstractions (“the solution”, “the orchestration layer”, “the underlying infrastructure”) with the actual component, file or system the text already names elsewhere.',
  },
  {
    id: 'honest-failure',
    name: 'Say what went wrong',
    guidance:
      'Replace sanitised failure language (“encountered reliability challenges”) with what actually broke, when the text gives enough to say it.',
  },
  {
    id: 'format',
    name: 'Format convention',
    guidance:
      'Follow the convention for the kind of text. Commit message: first line says what changed in the imperative, under 72 characters; the body says why; no “This commit”. PR description: what changed and why first, then how it was tested. README: what it is and how to run it come first. Code comment: says why, not what the code already shows.',
  },
] as const;

type RuleId = (typeof RULES)[number]['id'];

const RULE_IDS = RULES.map(({ id }) => id) as [RuleId, ...RuleId[]];

export { RULE_IDS, RULES, VERSION };
export type { RuleId };
