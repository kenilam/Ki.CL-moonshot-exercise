import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { compression } from 'vite-plugin-compression2';

import { getProxy, getTokenWarning } from './remotes';

const root = path.dirname(fileURLToPath(import.meta.url));
const envDir = path.resolve(root, '..');

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, envDir, '');

  const warning = command === 'serve' ? getTokenWarning(env) : null;

  if (warning) {
    console.warn(`\n⚠ ${warning}\n`);
  }

  return {
    /*
     * Ki.CL proxies `/moonshot` to this remote, built or dev. In dev every
     * module, `@vite/client` and the HMR socket sit under it too, so they
     * don't collide with Ki.CL's own `/@id` and `/node_modules/.vite`.
     */
    base: '/moonshot/',
    envDir,
    // Only the Turnstile site key reaches the browser; the rest stays server-side.
    envPrefix: ['TURNSTILE_SITE_KEY'],
    plugins: [
      // A .gz and a .br beside each built file, which the server sends as they are.
      compression({ algorithms: ['gzip', 'brotliCompress'] }),
      react(),
      /*
       * The standalone page keeps the path it has inside Ki.CL. Vite only
       * serves under `base`, so it gets the request under it while the
       * browser and the router still see `/portfolio/...`.
       */
      {
        name: 'moonshot-standalone',
        configureServer(server) {
          server.middlewares.use((request, _response, next) => {
            if (request.url?.startsWith('/portfolio/')) {
              request.url = `/moonshot${request.url}`;
            }

            next();
          });
        },
      },
      federation({
        name: 'moonshot',
        moduleParseIdleTimeout: 60,
        filename: 'remoteEntry.js',
        // The views' CSS ships with the remote, so Ki.CL gets it too.
        bundleAllCSS: true,
        /*
         * The parts, not a finished route: Ki.CL builds
         * `<Routes>{Introduction}{Compose}{Review}</Routes>` under its portfolio,
         * with its own sign-in gate around it.
         */
        exposes: {
          './compose': './src/compose/index.tsx',
          './constants': './src/constants.ts',
          './introduction': './src/introduction/index.tsx',
          './review': './src/review/index.tsx',
        },
        // The same paths Ki.CL loads them from, so one build works in both.
        remotes: {
          design: {
            type: 'module',
            name: 'design',
            entry: '/design/remoteEntry.js',
          },
        },
        // The singletons Ki.CL shares that this module uses, at Ki.CL's versions.
        shared: {
          react: { singleton: true, requiredVersion: '^19.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
          'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
          'react-hook-form': { singleton: true, requiredVersion: '^7.0.0' },
        },
        dts: {
          // `scripts/types.ts` downloads them, with the client token.
          consumeTypes: false,
          generateTypes: { compileInChildProcess: true },
        },
        dev: {
          disableDynamicRemoteTypeHints: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
        // Constants and types the API shares with the client.
        '@server': path.resolve(root, '../Server'),
      },
    },
    server: {
      port: Number(env.PORT) || 3300,
      proxy: getProxy(env),
      strictPort: true,
    },
    build: {
      modulePreload: false,
      outDir: 'dist',
      sourcemap: true,
      target: 'esnext',
    },
  };
});
