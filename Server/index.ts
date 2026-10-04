import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.resolve(root, '.env');

try {
  process.loadEnvFile(envFile);
} catch {
  // No .env on Cloud Run; the environment is set there.
}

const PORT = Number(process.env.PORT) || 3300;
const DIST = path.resolve(root, 'Client/dist');

/*
 * Serves the built remote for Ki.CL, which proxies `/moonshot` here like it
 * does `/design`. The AI endpoints will live under `/moonshot/api`.
 */

const app = express();

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

// Module Federation hosts look for @mf-types.zip by default.
app.get('/moonshot/@mf-types.zip', (_request, response) => {
  response.sendFile(`${DIST}/@mf-types.zip`);
});

app.use(
  '/moonshot',
  express.static(DIST, {
    setHeaders(response, file) {
      // The entry keeps its name across releases, so it has to be revalidated.
      // Everything else is content-hashed.
      response.setHeader(
        'Cache-Control',
        file.endsWith('remoteEntry.js')
          ? 'no-cache'
          : 'public, max-age=31536000, immutable'
      );
    },
  })
);

app.listen(PORT, () => {
  console.log(`Moonshot on http://localhost:${PORT}/moonshot/remoteEntry.js`);
});
