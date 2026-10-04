// Constants
import { TOKEN_HEADER } from './constants';

type Outcome = 'ready' | 'rejected' | 'limited' | 'failed';

/**
 * Ki.CL-back's session endpoint: the ExchangeToken mutation as a plain
 * request. Same origin through the dev server's proxy.
 */
const ENDPOINT = '/api/session';

/** The outcomes the API names with an error code. */
const CODES: Record<string, Outcome> = {
  CAPTCHA_REQUIRED: 'rejected',
  TOO_MANY_REQUESTS: 'limited',
};

/** The API sets `aud` (anon or user) beside the httpOnly session cookies. */
const hasSession = () =>
  /(?:^|;\s*)aud=(anon|user)(?:;|$)/.test(document.cookie);

/**
 * Starts an anonymous session, sending the Turnstile token when there is one.
 * Without one, a visitor with a refresh token still gets their session back.
 */
async function exchange(token: string | null): Promise<Outcome> {
  try {
    const response = await fetch(ENDPOINT, {
      credentials: 'include',
      headers: token ? { [TOKEN_HEADER]: token } : {},
      method: 'POST',
    });

    if (response.ok) {
      if (hasSession()) {
        return 'ready';
      }

      console.error('Session: anonymous session was not established');
      return 'failed';
    }

    const body = (await response.json().catch(() => null)) as {
      code?: string;
    } | null;
    const outcome = body?.code ? CODES[body.code] : undefined;

    if (outcome) {
      return outcome;
    }

    console.error('Session: bootstrap failed', response.status, body);
    return 'failed';
  } catch (error) {
    console.error('Session: bootstrap failed', error);
    return 'failed';
  }
}

export { exchange, hasSession };
export type { Outcome };
