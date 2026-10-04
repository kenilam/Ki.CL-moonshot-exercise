import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getHeaders, getTypeUrls } from '../remotes';

/*
 * Downloads the remotes' types into `@mf-types`. The federation plugin can
 * consume them itself, but it cannot send the client token, so it is turned
 * off in `vite.config.ts` and this runs before the dev server instead.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.resolve(root, '../.env');

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const headers = getHeaders(process.env);
const folder = path.resolve(root, '@mf-types');

for (const [alias, urls] of Object.entries(getTypeUrls(process.env))) {
  const [zip, api] = await Promise.all(
    [urls.zip, urls.api].map((url) => fetch(url, { headers }))
  );

  if (!zip.ok) {
    console.warn(`Types for ${alias}: ${zip.status} from ${urls.zip}`);
    process.exitCode = 1;

    continue;
  }

  const archive = path.join(tmpdir(), `kicl-moonshot-${alias}.zip`);
  const target = path.join(folder, alias);

  writeFileSync(archive, Buffer.from(await zip.arrayBuffer()));
  rmSync(target, { force: true, recursive: true });
  mkdirSync(target, { recursive: true });
  execFileSync('unzip', ['-q', '-o', archive, '-d', target]);

  if (api.ok) {
    writeFileSync(path.join(folder, `${alias}/apis.d.ts`), await api.text());
  }

  console.log(`Types for ${alias} from ${urls.zip}`);
}
