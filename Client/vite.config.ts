import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

import { getProxy } from './remotes';

const root = path.dirname(fileURLToPath(import.meta.url));
const envDir = path.resolve(root, '..');

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, envDir, '');

  return {
    /*
     * Ki.CL proxies `/moonshot` to the built remote. The standalone page runs
     * at the root, so its routes match the paths they have inside Ki.CL.
     */
    base: command === 'build' ? '/moonshot/' : '/',
    envDir,
    plugins: [
      react(),
      federation({
        name: 'moonshot',
        moduleParseIdleTimeout: 60,
        filename: 'remoteEntry.js',
        exposes: {
          './routes': './src/index.tsx',
        },
        // The same paths Ki.CL loads them from, so one build works in both.
        remotes: {
          api: {
            type: 'module',
            name: 'api',
            entry: '/api/client/remoteEntry.js',
          },
          design: {
            type: 'module',
            name: 'design',
            entry: '/design/remoteEntry.js',
          },
        },
        // Kept in step with Ki.CL's host config.
        shared: {
          react: { singleton: true, requiredVersion: '^19.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
          '@apollo/client': { singleton: true, requiredVersion: '^4.0.0' },
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
      alias: { '@': path.resolve(root, 'src') },
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
