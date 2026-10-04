/**
 * Renews an expired session through Ki.CL's API.
 *
 * The refresh runs from the browser against the API itself, so the refresh
 * token stays an httpOnly cookie between the two; this module's own server
 * never sees it. If the refresh token has lapsed too, the visitor gets a new
 * anonymous session instead - moonshot has no sign-in of its own. Inside
 * Ki.CL, the portfolio's own gate decides who gets this far.
 *
 * Each refresh rotates the token: the API issues a new one and drops the old.
 * Two refreshes at once would have the second present a token the first just
 * invalidated, so concurrent callers share one.
 */

let refreshing: Promise<boolean> | null = null;

const refresh = (): Promise<boolean> => {
  refreshing ??= import('api/provider')
    .then(
      async ({
        getKiclClient,
        Kicl_ExchangeTokenDocument,
        Kicl_RefreshTokenDocument,
      }) => {
        const client = getKiclClient();

        const renewed = await client
          .mutate({ mutation: Kicl_RefreshTokenDocument })
          .then(({ data }) => Boolean(data?.RefreshToken))
          .catch(() => false);

        if (renewed) {
          return true;
        }

        return client
          .mutate({ mutation: Kicl_ExchangeTokenDocument })
          .then(({ data }) => Boolean(data?.ExchangeToken))
          .catch(() => false);
      }
    )
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
};

export { refresh };
