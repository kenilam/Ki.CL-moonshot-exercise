/*
 * Ki.CL's `App/session`, trimmed to what a standalone visit needs. Inside
 * Ki.CL the host's own session does this.
 */

/** Must match `TURNSTILE_ACTION` in the API's ExchangeToken resolver. */
const ACTION = 'exchange-token';

/** The header the API reads the Turnstile token from. */
const TOKEN_HEADER = 'x-turnstile-token';

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** A fresh token is tried once more after a rejection, then it gives up. */
const MAX_REJECTIONS = 2;

/** Set in `.env`, exposed by `envPrefix` in `vite.config.ts`. */
const SITE_KEY = import.meta.env.TURNSTILE_SITE_KEY as string | undefined;

const COPY = {
  rejected: 'Could not confirm you are human',
  failed: 'Could not start a session',
  retry: 'Reload to try again.',
  // Vague like the API's own message: naming the limit says how to get round it.
  limited: 'Could not start a session right now',
  later: 'Try again later.',
};

export { ACTION, COPY, MAX_REJECTIONS, SCRIPT_SRC, SITE_KEY, TOKEN_HEADER };
