import { useCallback, useEffect, useRef, useState } from 'react';

import { ACTION } from './constants';
import { loadScript } from './load-turnstile';

/**
 * Renders a Turnstile widget into `container` and returns its token. It stays
 * hidden unless Cloudflare needs the visitor to click, which `interactive`
 * reports. No `siteKey` renders nothing.
 */
function useTurnstile(siteKey: string | undefined) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [interactive, setInteractive] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = container.current;

    if (!siteKey || !element) {
      return;
    }

    let cancelled = false;

    const render = async () => {
      try {
        await loadScript();

        if (cancelled || !window.turnstile) {
          return;
        }

        widget.current = window.turnstile.render(element, {
          sitekey: siteKey,
          action: ACTION,
          appearance: 'interaction-only',
          callback: setToken,
          'error-callback': () => setFailed(true),
          'expired-callback': () => setToken(null),
          'before-interactive-callback': () => setInteractive(true),
        });
      } catch (error) {
        console.error('Session: Turnstile unavailable', error);
        if (!cancelled) {
          setFailed(true);
        }
      }
    };

    void render();

    return () => {
      cancelled = true;
      if (widget.current) {
        window.turnstile?.remove(widget.current);
        widget.current = null;
      }
    };
  }, [siteKey]);

  /** Tokens are single-use, so a rejected one needs a new challenge. */
  const reset = useCallback(() => {
    setToken(null);
    if (widget.current) {
      window.turnstile?.reset(widget.current);
    }
  }, []);

  return { container, token, interactive, failed, reset };
}

export { useTurnstile };
