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

export { ACTION, MAX_REJECTIONS, SCRIPT_SRC, SITE_KEY, TOKEN_HEADER };
