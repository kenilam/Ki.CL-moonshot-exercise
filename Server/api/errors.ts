/** Shared with the client, so this file imports nothing. */

/**
 * Why a request failed. The client has the sentence for each one, as
 * `error_<code>` in its `moonshot` namespace, so none is written here.
 */
const ERROR_CODES = [
  'account_limited',
  'allowance_used',
  'invalid_review',
  'model_declined',
  'rejected',
  'review_failed',
  'review_incomplete',
  'review_not_found',
  'session_ended',
  'session_unchecked',
  'session_unreachable',
  'text_empty',
  'text_too_long',
] as const;

type ErrorCode = (typeof ERROR_CODES)[number];

/** The body of every failed request. */
type Failure = {
  code: ErrorCode;
  /** The model's own sentence, when it turned the text away. */
  message?: string;
  /** Numbers the client's sentence needs, such as the daily limit. */
  values?: Record<string, number>;
};

export { ERROR_CODES };
export type { ErrorCode, Failure };
