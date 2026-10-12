import type { TFunction } from 'i18next';

import type { Failure } from '@server/api/errors';
import type { Review, Summary } from '@server/store';
import { MAX_LENGTH, type Kind } from '@server/review/constants';

import { SESSION_ENDED } from '@/constants';

/** Same origin: Ki.CL, or the standalone dev server, proxies it to `Server/`. */
const BASE = '/moonshot/api';

/** A request the server refused, with what it answered: null when that wasn't JSON. */
class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly failure: Partial<Failure> | null
  ) {
    super(failure?.code);
  }
}

/** The response's body, or null when it isn't JSON. */
async function readJson(response: Response): ReturnType<Response['json']> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request<Result>(
  path: string,
  init?: RequestInit
): Promise<Result> {
  const response = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  const body = await readJson(response);

  /*
   * The session is the host's: Ki.CL, or the standalone shell, starts and
   * renews it. A 401 means it ended or was revoked, so the host is told and
   * takes over: a sign-in in Ki.CL, a new session standalone.
   */
  if (response.status === 401) {
    dispatchEvent(new Event(SESSION_ENDED));

    throw new ApiError(response.status, { code: 'session_ended' });
  }

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body as Result;
}

/**
 * The sentence for a failed request: the model's own when it turned the text
 * away, otherwise the one for the server's code. A code with no sentence, and
 * a request that never got an answer, read as the general one.
 */
const explain = (t: TFunction<'moonshot'>, error: unknown) => {
  if (!(error instanceof ApiError) || !error.failure) {
    return t('error');
  }

  const { code, message, values } = error.failure;

  return message ?? t('error', { context: code, max: MAX_LENGTH, ...values });
};

const createReview = (kind: Kind, text: string) =>
  request<Review>('/reviews', {
    body: JSON.stringify({ kind, text }),
    method: 'POST',
  });

const getReview = (id: string) => request<Review>(`/reviews/${id}`);

const listReviews = () => request<Summary[]>('/reviews');

const getAllowance = () =>
  request<{ limit: number; remaining: number }>('/reviews/allowance');

export { createReview, explain, getAllowance, getReview, listReviews };
export type { Kind, Review, Summary };
