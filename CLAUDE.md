# CLAUDE.md

A federated module of Ki.CL (`/Users/kenilam/Development/Ki.CL`), served as the remote `moonshot` and mounted at `/portfolio/moonshot`. It also runs standalone. See README.md for commands.

Follow Ki.CL's CLAUDE.md for UI and structure: semantic markup, `design/components` over raw DOM, no custom CSS unless nothing else can do it, no extra wrappers, views as folders of small parts, named exports only, single quotes, lowercase-dash file names.

- Imports climb with the `@/` alias (`Client/src`), never `../`; same-folder `./` is fine. Server code shared with the client comes through `@server/`.
- More than one class goes through `classNames('a', 'b')`, never a space-separated string.
- Routing comes from `design/router`, never `react-router-dom` directly.
- No `api` remote and no Apollo. Sessions are the host's: the module only sends the cookie and shows a message on a 401. The standalone shell starts its session with one `fetch` to Ki.CL-back's `POST /api/session` (`src/standalone/session/exchange.ts`).
- `shared` in `Client/vite.config.ts` lists the singletons Ki.CL shares that this module uses, at Ki.CL's versions (`App/.client/index.ts`): `react`, `react-dom`, `react-router-dom`, `react-hook-form`, `i18next` and `react-i18next`.
- No user-facing string is written in a component or in `Server/`. The words are in `Client/src/locales/en/moonshot.json` and are read with `useTranslation('moonshot')`, following the rules in Ki.CL's CLAUDE.md ("Writing comes from the database, through i18next"). Inside Ki.CL the host's i18next loads the namespace from the database, so seed after changing a key: `make translations.seed DIR=../Ki.CL-moonshot-exercise/Client/src/locales` in Ki.CL-back. Standalone, `src/standalone/i18n.ts` starts i18next from the bundled file.
- This module can't read Ki.CL's `common` namespace, because standalone has none. Words `common` also has (Close, Remove, the session messages) are written again in `moonshot.json`.
- The server answers a failed request with a code from `Server/api/errors.ts`, and the client shows `error_<code>`. A rule's name and guidance are `rule_<id>` and `rule_guidance_<id>`; the same text is in `Server/review/rules.ts` for the prompt, and `Server/locales.test.ts` fails when the two differ.
- Keys are typed in `Client/types/i18next.d.ts`. It stays outside `src` so it isn't in the types Ki.CL downloads.
- `Client/@mf-types` is downloaded by `make types`. Don't edit it.
- Into `develop` = squash. The Release workflow fast-forwards `main` to `develop`. Never push to `develop` or `main` directly.
