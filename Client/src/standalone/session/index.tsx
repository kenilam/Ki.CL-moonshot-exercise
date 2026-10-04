import React from 'react';

// Components
import { Layout, Spinner } from 'design/components';

// Status
import { Status403, Status429, Status500 } from 'design/status';

// Constants
import { COPY } from './constants';

// Hooks
import { useSession } from './use-session';

/**
 * Starts an anonymous session before rendering its children, after a
 * Turnstile check when the API asks for one. Moonshot has no sign-in; the
 * allowance and history follow this session.
 */
const Session: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const { container, interactive, stage } = useSession();

  if (stage === 'rejected') {
    return <Status403 message={COPY.retry} title={COPY.rejected} />;
  }

  if (stage === 'limited') {
    return <Status429 message={COPY.later} title={COPY.limited} />;
  }

  if (stage === 'failed') {
    return <Status500 message={COPY.retry} title={COPY.failed} />;
  }

  if (stage === 'ready') {
    return children;
  }

  return (
    // One full-screen box, so the spinner and the widget centre on the page.
    <Layout
      alignContent='center'
      justifyContent='center'
      justifyItems='center'
      fullScreen
    >
      <div>
        {!interactive && <Spinner in />}
        <div ref={container} />
      </div>
    </Layout>
  );
};

export { Session };
