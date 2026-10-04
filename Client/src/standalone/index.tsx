import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Core
import 'design/core';

// App
import { Standalone } from './app';

/*
 * Only mounts. Kept free of components so a hot update never re-runs it:
 * running it again would call createRoot on the same element twice.
 */
const appRoot = document.querySelector('app-root');

if (appRoot) {
  ReactDOM.createRoot(appRoot).render(
    <StrictMode>
      <Standalone />
    </StrictMode>
  );
}
