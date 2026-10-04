import { randomUUID } from 'node:crypto';

import { Router, type Request, type Response } from 'express';

import { identify, IdentityError } from '../identity';
import { locate } from '../review/locate';
import { MODEL, propose, ReviewError } from '../review/model';
import { VERSION } from '../review/rules';
import { ReviewInput } from '../review/schema';
import type { Store } from '../store';

/** Reviews per user per UTC day. Each one is a paid model call. */
const DAILY_ALLOWANCE = Number(process.env.MOONSHOT_DAILY_ALLOWANCE) || 20;

const startOfDay = () => {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

const fail = (response: Response, status: number, message: string) => {
  response.status(status).json({ error: message });
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
        fail(response, error.status, error.message);
      } else {
        fail(response, 502, "Couldn't check your session. Try again.");
      }

      return;
    }

    if (!userGUID) {
      fail(response, 401, 'Your session has ended. Reload the page.');

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
      fail(response, 404, 'No such review.');

      return;
    }

    response.json(review);
  });

  router.post('/', async (request, response) => {
    const input = ReviewInput.safeParse(request.body);

    if (!input.success) {
      fail(response, 400, input.error.issues[0]?.message ?? 'Invalid review.');

      return;
    }

    const { userGUID } = response.locals;
    const used = await store.countSince(userGUID, startOfDay());

    if (used >= DAILY_ALLOWANCE) {
      fail(
        response,
        429,
        `That's all ${DAILY_ALLOWANCE} reviews for today. More tomorrow.`
      );

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
        fail(response, 422, rejection);

        return;
      }

      response.status(201).json(review);
    } catch (error) {
      if (error instanceof ReviewError) {
        fail(response, error.status, error.message);

        return;
      }

      console.error('Review failed:', error);
      fail(response, 502, 'The review failed. Try again.');
    }
  });

  return router;
}

export { reviews };
