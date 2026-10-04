import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

import { reviews } from './api/reviews';
import { RULES } from './review/rules';
import { MAX_LENGTH } from './review/schema';
import { createStore } from './store';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
  process.loadEnvFile(path.resolve(root, '.env'));
} catch {
  // No .env on Cloud Run; the environment is set there.
}

// `PORT` in .env belongs to the Vite dev server, so a local server takes its own.
const PORT =
  Number(process.env.MOONSHOT_SERVER_PORT || process.env.PORT) || 3301;
const DIST = path.resolve(root, 'Client/dist');

/*
 * Serves the built remote and the editor's API. Ki.CL proxies `/moonshot` here
 * like it does `/design`.
 */

const app = express();

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.get('/moonshot/api/rules', (_request, response) => {
  response.json(RULES);
});

app.use(
  '/moonshot/api/reviews',
  // JSON escapes stretch the text, so the body limit leaves room above it.
  express.json({ limit: MAX_LENGTH * 4 }),
  reviews(createStore())
);

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
