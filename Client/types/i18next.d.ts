import 'i18next';

import type moonshot from '@/locales/en-US/moonshot.json';

/**
 * Keys are checked against the English file, which seeds the database. Kept
 * outside `src`, so it stays out of the types Ki.CL downloads: Ki.CL declares
 * its own namespaces, and two declarations of `resources` would collide.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'moonshot';
    resources: {
      moonshot: typeof moonshot;
    };
  }
}
