# CLAUDE.md

A federated module of Ki.CL (`/Users/kenilam/Development/Ki.CL`), served as the remote `moonshot` and mounted at `/portfolio/moonshot`. It also runs standalone. See README.md for commands.

Follow Ki.CL's CLAUDE.md for UI and structure: semantic markup, `design/components` over raw DOM, no custom CSS unless nothing else can do it, no extra wrappers, views as folders of small parts, named exports only, single quotes, lowercase-dash file names.

- Imports climb with an alias, never `../`; same-folder `./` is fine. The client imports itself as `moonshot/` (`Client/src`), the name Ki.CL loads it under, so the types Ki.CL downloads resolve there. The server imports itself as `server/` (`Server/`), and both import `Shared/` as `moonshot/shared/`. Each entry point runs tsx with the tsconfig that holds these paths (`--tsconfig Server/tsconfig.json`).
- The client and the server never import from each other. What both use (the error codes, the review limits and shapes, the rules) is in `Shared/` at the root: both import it as `moonshot/shared/`.
- More than one class goes through `classNames('a', 'b')`, never a space-separated string.
- No prop drilling, and one part per folder, as in "Structure" in Ki.CL's CLAUDE.md. With no Apollo here, a part reads the route, `useTranslation('moonshot')` or the context its owner provides.
- Routing comes from `design/router`, never `react-router-dom` directly. Forms (`useForm`, `useFormContext`, `useWatch`, `valibotResolver`) come from `design/components` and `useTranslation` from `design/hooks`, as in Ki.CL. Only `src/standalone/i18n.ts`, which creates the standalone i18next instance, imports `i18next` and `react-i18next` itself.
- No `api` remote and no Apollo. Sessions are the host's: the module only sends the cookie and shows a message on a 401. The standalone shell starts its session with one `fetch` to Ki.CL-back's `POST /api/session` (`src/standalone/session/exchange.ts`).
- `shared` in `Client/vite.config.ts` lists the singletons Ki.CL shares that this module uses, at Ki.CL's versions (`App/.client/index.ts`): `react`, `react-dom`, `react-router-dom`, `react-hook-form`, `i18next` and `react-i18next`.
- No user-facing string is written in a component or in `Server/`. The words are in `Client/src/locales/en-US/moonshot.json` and are read with `useTranslation('moonshot')`, following the rules in Ki.CL's CLAUDE.md ("Writing comes from the database, through i18next"). Inside Ki.CL the host's i18next loads the namespace from the database, so seed after changing a key: `make translations.seed DIR=../Ki.CL-moonshot-exercise/Client/src/locales` in Ki.CL-back. Standalone, `src/standalone/i18n.ts` starts i18next from the bundled file.
- This module can't read Ki.CL's `common` namespace, because standalone has none. Words `common` also has (Close, Remove, the session messages) are written again in `moonshot.json`.
- The server answers a failed request with a code from `Shared/errors.ts`, and the client shows `error_<code>`. A rule's name and guidance are `rule_<id>` and `rule_guidance_<id>`; the same text is in `Shared/rules.ts` for the prompt, and `Server/locales.test.ts` fails when the two differ.
- Keys are typed in `Client/types/i18next.d.ts`. It stays outside `src` so it isn't in the types Ki.CL downloads.
- `Client/@mf-types` is downloaded by `make types`. Don't edit it.
- Into `develop` = squash. The Release workflow fast-forwards `main` to `develop`. Never push to `develop` or `main` directly.
