import { randomUUID } from 'node:crypto';

import { Router, type Request, type Response } from 'express';
import type { z } from 'zod';

import { identify, IdentityError } from '../identity';
import { locate } from '../review/locate';
import { MODEL, propose, ReviewError } from '../review/model';
import { VERSION } from '../review/rules';
import { ReviewInput } from '../review/schema';
import type { Store } from '../store';

import type { ErrorCode, Failure } from './errors';

/** Reviews per user per UTC day. Each one is a paid model call. */
const DAILY_ALLOWANCE = Number(process.env.MOONSHOT_DAILY_ALLOWANCE) || 20;

const startOfDay = () => {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

const fail = (
  response: Response,
  status: number,
  code: ErrorCode,
  extra?: Omit<Failure, 'code'>
) => {
  response.status(status).json({ code, ...extra } satisfies Failure);
};

/** An empty text and one over the limit get their own code; the client has a sentence for each. */
const invalid = (issues: z.core.$ZodIssue[]): ErrorCode => {
  const [issue] = issues;

  if (issue?.path[0] === 'text' && issue.code === 'too_small') {
    return 'text_empty';
  }

  if (issue?.path[0] === 'text' && issue.code === 'too_big') {
    return 'text_too_long';
  }

  return 'invalid_review';
};

function reviews(store: Store): Router {
  const router = Router();

  // Every route needs a Ki.CL session, signed in or anonymous.
  router.use(async (request: Request, response: Response, next) => {
    let userGUID: string | null;

    try {
      userGUID = await identify(request.get('cookie'));
    } catch (error) {
      console.error('Identity check failed:', error);

      if (error instanceof IdentityError) {
        fail(response, error.status, error.code);
      } else {
        fail(response, 502, 'session_unchecked');
      }

      return;
    }

    if (!userGUID) {
      fail(response, 401, 'session_ended');

      return;
    }

    response.locals.userGUID = userGUID;
    next();
  });

  router.get('/allowance', async (_request, response) => {
    const used = await store.countSince(response.locals.userGUID, startOfDay());

    response.json({
      limit: DAILY_ALLOWANCE,
      remaining: Math.max(0, DAILY_ALLOWANCE - used),
    });
  });

  router.get('/', async (_request, response) => {
    response.json(await store.list(response.locals.userGUID, 20));
  });

  router.get('/:id', async (request, response) => {
    const review = await store.get(response.locals.userGUID, request.params.id);

    if (!review) {
      fail(response, 404, 'review_not_found');

      return;
    }

    response.json(review);
  });

  router.post('/', async (request, response) => {
    const input = ReviewInput.safeParse(request.body);

    if (!input.success) {
      fail(response, 400, invalid(input.error.issues));

      return;
    }

    const { userGUID } = response.locals;
    const used = await store.countSince(userGUID, startOfDay());

    if (used >= DAILY_ALLOWANCE) {
      fail(response, 429, 'allowance_used', {
        values: { limit: DAILY_ALLOWANCE },
      });

      return;
    }

    const { kind, text } = input.data;

    try {
      const { edits, rejection, reviewedAs } = await propose(kind, text);
      const review = {
        createdAt: new Date(),
        edits: rejection ? [] : locate(text, edits),
        id: randomUUID(),
        kind,
        model: MODEL,
        rejection,
        reviewedAs,
        rules: VERSION,
        text,
        userGUID,
      };

      await store.create(review);

      if (rejection) {
        fail(response, 422, 'rejected', { message: rejection });

        return;
      }

      response.status(201).json(review);
    } catch (error) {
      if (error instanceof ReviewError) {
        fail(response, error.status, error.code);

        return;
      }

      console.error('Review failed:', error);
      fail(response, 502, 'review_failed');
    }
  });

  return router;
}

export { reviews };
