// Constants
import { TOKEN_HEADER } from './constants';

type Outcome = 'ready' | 'rejected' | 'limited' | 'failed';

/** Ki.CL-back's GraphQL endpoint, same origin through the dev server's proxy. */
const ENDPOINT = '/api';

const QUERY = 'mutation kicl_ExchangeToken { ExchangeToken }';

/** The outcomes the API names with an error code. */
const CODES: Record<string, Outcome> = {
  CAPTCHA_REQUIRED: 'rejected',
  TOO_MANY_REQUESTS: 'limited',
};

const readCookie = (name: string) =>
  document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1] ?? null;

/** The API sets `aud` (anon or user) beside the httpOnly session cookies. */
const hasSession = () => ['anon', 'user'].includes(readCookie('aud') ?? '');

type Body = {
  errors?: Array<{ extensions?: { code?: unknown } }>;
};

/**
 * Starts an anonymous session, sending the Turnstile token when there is one.
 * Without one, a visitor with a refresh token still gets their session back.
 * A plain request rather than the API's client: this is the only call the
 * standalone shell makes to the API.
 */
async function exchange(token: string | null): Promise<Outcome> {
  const apiKey = readCookie('x-api-key');

  try {
    const response = await fetch(ENDPOINT, {
      body: JSON.stringify({
        operationName: 'kicl_ExchangeToken',
        query: QUERY,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-api-key': decodeURIComponent(apiKey) } : {}),
        ...(token ? { [TOKEN_HEADER]: token } : {}),
      },
      method: 'POST',
    });

    const body = (await response.json().catch(() => null)) as Body | null;
    const code = body?.errors?.find(({ extensions }) => extensions?.code)
      ?.extensions?.code;
    const outcome = typeof code === 'string' ? CODES[code] : undefined;

    if (outcome) {
      return outcome;
    }

    if (response.ok && !body?.errors && hasSession()) {
      return 'ready';
    }

    console.error('Session: anonymous session was not established', body);
    return 'failed';
  } catch (error) {
    console.error('Session: bootstrap failed', error);
    return 'failed';
  }
}

export { exchange, hasSession };
export type { Outcome };
