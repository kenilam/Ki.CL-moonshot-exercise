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
  };
};

const getHeaders = (env: Env): Record<string, string> =>
  env.KICL_CLIENT_TOKEN ? { [TOKEN_HEADER]: env.KICL_CLIENT_TOKEN } : {};

/**
 * A local Ki.CL-back serves its remote at `/client`; a Ki.CL deployment
 * serves the same thing at `/api/client`.
 */
const getProxy = (env: Env): Record<string, ProxyOptions> => {
  const { backend, design, host } = getTargets(env);
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
    '/api/client': route(
      api,
      backend ? { rewrite: (path) => path.replace(/^\/api/, '') } : undefined
    ),
    '/api': route(api, { ws: true }),
    '/assets/taxon-visual/': route(api),
    '/assets/static/': route(api),
    '/design': route(design),
  };
};

const getTypeUrls = (env: Env) => {
  const { backend, design, host } = getTargets(env);
  const api = backend ? `${backend}/client` : `${host}/api/client`;

  return {
    api: { api: `${api}/types.d.ts`, zip: `${api}/types.zip` },
    design: {
      api: `${design}/design/types.d.ts`,
      zip: `${design}/design/types.zip`,
    },
  };
};

export { getHeaders, getProxy, getTypeUrls };
