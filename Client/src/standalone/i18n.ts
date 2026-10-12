import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import moonshot from '@/locales/en/moonshot.json';

/**
 * Inside Ki.CL the host creates i18next and reads the `moonshot` namespace
 * from the database. On its own there is no host, so the shell starts the
 * same shared instance from the bundled English file.
 */
const ready = i18next.use(initReactI18next).init({
  defaultNS: 'moonshot',
  // React escapes what it renders.
  interpolation: { escapeValue: false },
  lng: 'en',
  ns: ['moonshot'],
  resources: { en: { moonshot } },
});

export { ready };
