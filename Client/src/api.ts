import type { Review, Summary } from '@server/store';
import type { Kind } from '@server/review/constants';
import type { RULES } from '@server/review/rules';

/** Same origin: Ki.CL, or the standalone dev server, proxies it to `Server/`. */
const BASE = '/moonshot/api';

type Rule = (typeof RULES)[number];

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/*
 * The session is the host's: Ki.CL, or the standalone shell, starts and
 * renews it on load. A 401 means it ended while the page was open.
 */
const SESSION_ENDED = 'Your session has ended. Reload the page to continue.';

async function request<Result>(
  path: string,
  init?: RequestInit
): Promise<Result> {
  const response = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  const body = await response.json().catch(() => null);

  if (response.status === 401) {
    throw new ApiError(SESSION_ENDED, response.status);
  }

  if (!response.ok) {
    throw new ApiError(
      body?.error ?? 'Something went wrong. Try again.',
      response.status
    );
  }

  return body as Result;
}

const createReview = (kind: Kind, text: string) =>
  request<Review>('/reviews', {
    body: JSON.stringify({ kind, text }),
    method: 'POST',
  });

const getReview = (id: string) => request<Review>(`/reviews/${id}`);

const listReviews = () => request<Summary[]>('/reviews');

const getAllowance = () =>
  request<{ limit: number; remaining: number }>('/reviews/allowance');

const getRules = () => request<Rule[]>('/rules');

export {
  ApiError,
  createReview,
  getAllowance,
  getReview,
  getRules,
  listReviews,
};
export type { Kind, Review, Rule, Summary };
