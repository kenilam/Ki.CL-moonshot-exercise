import { SCRIPT_SRC } from './constants';

type RenderOptions = {
  sitekey: string;
  action: string;
  appearance: 'always' | 'execute' | 'interaction-only';
  callback: (token: string) => void;
  'error-callback': () => void;
  'expired-callback': () => void;
  'before-interactive-callback': () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: RenderOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let script: Promise<void> | null = null;

/** Loaded on first use, so a visitor with a session never fetches it. */
function loadScript(): Promise<void> {
  script ??= new Promise((resolve, reject) => {
    const element = document.createElement('script');
    element.src = SCRIPT_SRC;
    element.async = true;
    element.onload = () => resolve();
    element.onerror = () => {
      script = null;
      reject(new Error('Turnstile script failed to load'));
    };
    document.head.append(element);
  });

  return script;
}

export { loadScript };
