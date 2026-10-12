import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Core
import 'design/core';

// App
import { Standalone } from './app';

// Translations
import { ready } from './i18n';

/*
 * Only mounts. Kept free of components so a hot update never re-runs it:
 * running it again would call createRoot on the same element twice.
 */
const mount = async () => {
  const appRoot = document.querySelector('app-root');

  // The shell's own pages read their words too, so nothing renders before them.
  await ready;

  if (appRoot) {
    ReactDOM.createRoot(appRoot).render(
      <StrictMode>
        <Standalone />
      </StrictMode>
    );
  }
};

void mount();
