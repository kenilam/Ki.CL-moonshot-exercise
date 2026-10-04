# CLAUDE.md

A federated module of Ki.CL (`/Users/kenilam/Development/Ki.CL`), served as the remote `moonshot` and mounted at `/portfolio/moonshot`. It also runs standalone. See README.md for commands.

Follow Ki.CL's CLAUDE.md for UI and structure: semantic markup, `design/components` over raw DOM, no custom CSS unless nothing else can do it, no extra wrappers, views as folders of small parts, named exports only, single quotes, lowercase-dash file names.

- Imports climb with the `@/` alias (`Client/src`), never `../`; same-folder `./` is fine. Server code shared with the client comes through `@server/`.
- More than one class goes through `classNames('a', 'b')`, never a space-separated string.
- Routing comes from `design/router`, never `react-router-dom` directly.
- Import `useQuery`, `useMutation`, `useSubscription` and `skipToken` from `api/provider`. Custom GraphQL operations must be named `kicl_*`.
- Keep `shared` in `Client/vite.config.ts` in step with Ki.CL's `App/.client/index.ts`.
- `Client/@mf-types` is downloaded by `make types`. Don't edit it.
- Into `develop` = squash; `develop` → `main` = merge commit. Never push to `develop` directly.
