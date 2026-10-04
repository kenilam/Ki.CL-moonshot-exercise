import { createHash } from 'node:crypto';

import { GoogleAuth, type IdTokenClient } from 'google-auth-library';

/**
 * Asks Ki.CL's API who the visitor is, passing their session cookie along.
 *
 * The API signs its session tokens with a shared secret, so checking them here
 * would mean holding a key that can also issue them.
 *
 * Each lookup counts against the user's daily request limit on the API, which
 * the rest of Ki.CL shares, so a confirmed session is remembered for a while
 * rather than asked about on every request. Only for a minute: a session
 * signed out or revoked on the API stops working here soon after.
 */

const BACKEND_URL = process.env.KICL_BACKEND_URL || 'http://localhost:3100';

const QUERY = 'query kicl_Me { Me { UserGUID aud } }';

const TTL_MS = 60 * 1000;

type Me = { UserGUID: string; aud: string } | null;

/** The API could not answer, as opposed to answering "not signed in". */
class IdentityError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/** Keyed by a hash of the access token, so no token is kept in memory. */
const sessions = new Map<string, { userGUID: string; expiresAt: number }>();

let tokens: Promise<IdTokenClient> | null = null;

/**
 * On Cloud Run the API only accepts calls carrying a Google ID token. Off
 * Google there is no identity to get one from, and a local API does not ask.
 */
async function authorization(): Promise<Record<string, string>> {
  try {
    tokens ??= new GoogleAuth().getIdTokenClient(BACKEND_URL);

    const token = await (
      await tokens
    ).idTokenProvider.fetchIdToken(BACKEND_URL);

    return { Authorization: `Bearer ${token}` };
  } catch {
    tokens = null;

    return {};
  }
}

const accessToken = (cookie: string) =>
  cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('access_token='))
    ?.slice('access_token='.length);

/**
 * The visitor's GUID, from a signed-in or an anonymous session, or null with
 * no session. Moonshot has no sign-in of its own: the allowance and history
 * follow the session. Throws an IdentityError when the API refuses or fails.
 */
async function identify(cookie: string | undefined): Promise<string | null> {
  const token = cookie && accessToken(cookie);

  if (!token) {
    return null;
  }

  const key = createHash('sha256').update(token).digest('hex');
  const known = sessions.get(key);

  if (known && known.expiresAt > Date.now()) {
    return known.userGUID;
  }

  const response = await fetch(`${BACKEND_URL}/graphql`, {
    body: JSON.stringify({ operationName: 'kicl_Me', query: QUERY }),
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      ...(await authorization()),
    },
    method: 'POST',
  });

  if (response.status === 429) {
    throw new IdentityError(
      'Ki.CL has had too many requests from this account today. Try again later.',
      429
    );
  }

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new IdentityError("Couldn't reach Ki.CL to check your session.", 502);
  }

  const { data } = (await response.json()) as { data?: { Me: Me } };

  if (data?.Me?.aud !== 'user' && data?.Me?.aud !== 'anon') {
    return null;
  }

  sessions.set(key, {
    expiresAt: Date.now() + TTL_MS,
    userGUID: data.Me.UserGUID,
  });

  return data.Me.UserGUID;
}

export { identify, IdentityError };
