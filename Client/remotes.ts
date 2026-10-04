import type { ProxyOptions } from 'vite';

/**
 * Where the design system and the API come from, for the dev proxy and for
 * the type download. Both go through a Ki.CL deployment by default, the same
 * paths Ki.CL serves them on, so the browser only ever talks to localhost.
 */

type Env = Record<string, string | undefined>;

/** Checked by Ki.CL's proxy. Without it the deployment asks for a password. */
const TOKEN_HEADER = 'x-kicl-client-token';

const getTargets = (env: Env) => {
  const host = env.KICL_HOST_URL || 'https://dev.ki-cl.com';

  return {
    backend: env.KICL_BACKEND_URL,
    design: env.KICL_DESIGN_URL || host,
    host,
    moonshot: env.KICL_MOONSHOT_URL || host,
  };
};

/**
 * Why requests to the Ki.CL deployment will be refused, or null. Without a
 * token they get its password page, which shows up in the browser as a
 * failed remote rather than as a missing token.
 */
const getTokenWarning = (env: Env) => {
  const { backend, design, host, moonshot } = getTargets(env);
  const usesHost = !backend || design === host || moonshot === host;

  return usesHost && !env.KICL_CLIENT_TOKEN
    ? `No KICL_CLIENT_TOKEN in .env, so ${host} will refuse the requests sent there. Add the token you were sent, or set KICL_BACKEND_URL, KICL_DESIGN_URL and KICL_MOONSHOT_URL to services on this machine.`
    : null;
};

const getHeaders = (env: Env): Record<string, string> =>
  env.KICL_CLIENT_TOKEN ? { [TOKEN_HEADER]: env.KICL_CLIENT_TOKEN } : {};

const getProxy = (env: Env): Record<string, ProxyOptions> => {
  const { backend, design, host, moonshot } = getTargets(env);
  const api = backend || host;
  const headers = getHeaders(env);

  const route = (target: string, extra?: ProxyOptions): ProxyOptions => ({
    changeOrigin: true,
    headers,
    secure: true,
    target,
    ...extra,
  });

  return {
    // This repo's own API. The model key stays on the deployed server.
    '/moonshot/api': route(moonshot),
    // Ki.CL-back's GraphQL, for the standalone shell's session.
    '/api': route(api),
    '/design': route(design),
  };
};

const getTypeUrls = (env: Env) => {
  const { design } = getTargets(env);

  return {
    design: {
      api: `${design}/design/types.d.ts`,
      zip: `${design}/design/types.zip`,
    },
  };
};

export { getHeaders, getProxy, getTokenWarning, getTypeUrls };
