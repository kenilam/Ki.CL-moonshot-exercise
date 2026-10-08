import { useEffect, useRef, useState } from 'react';

// Constants
import { SESSION_ENDED } from '@/constants';
import { MAX_REJECTIONS, SITE_KEY } from './constants';

// Session
import { exchange, hasSession, type Outcome } from './exchange';

// Hooks
import { useTurnstile } from './use-turnstile';

type Stage = 'probe' | 'challenge' | Outcome;

/**
 * Where the visit is. It tries without a token first, so a visitor whose
 * session lapsed gets it back from their refresh token without a check. Only
 * a `rejected` probe shows the widget.
 */
function useSession() {
  const [stage, setStage] = useState<Stage>(() =>
    hasSession() ? 'ready' : 'probe'
  );
  const [rejections, setRejections] = useState(0);

  /*
   * When the module's API refuses the session, start a new one; the module
   * remounts under it. Once only: a session the API still refuses straight
   * after (a revoked sign-in whose token hasn't expired) would loop.
   */
  const renewed = useRef(false);

  useEffect(() => {
    const ended = () => {
      setStage(renewed.current ? 'failed' : 'probe');
      renewed.current = true;
    };

    addEventListener(SESSION_ENDED, ended);

    return () => removeEventListener(SESSION_ENDED, ended);
  }, []);

  const turnstile = useTurnstile(stage === 'challenge' ? SITE_KEY : undefined);
  const { token, reset } = turnstile;

  useEffect(() => {
    if (stage !== 'probe') {
      return;
    }

    let cancelled = false;

    const probe = async () => {
      const outcome = await exchange(null);

      if (!cancelled) {
        setStage(outcome === 'rejected' ? 'challenge' : outcome);
      }
    };

    void probe();

    return () => {
      cancelled = true;
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'challenge' || !token) {
      return;
    }

    let cancelled = false;

    const challenge = async () => {
      const outcome = await exchange(token);

      if (cancelled) {
        return;
      }

      if (outcome === 'rejected' && rejections + 1 < MAX_REJECTIONS) {
        setRejections(rejections + 1);
        reset();
      } else {
        setStage(outcome);
      }
    };

    void challenge();

    return () => {
      cancelled = true;
    };
  }, [rejections, reset, stage, token]);

  // The API wants a check but there's no site key: a setup problem, not the visitor's.
  const unconfigured = stage === 'challenge' && !SITE_KEY;

  return {
    container: turnstile.container,
    interactive: turnstile.interactive,
    stage: unconfigured || turnstile.failed ? 'failed' : stage,
  };
}

export { useSession };
