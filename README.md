# Ki.CL moonshot exercise

A small full-stack AI app, built as a federated module of [Ki.CL](https://ki-cl.com). Inside Ki.CL it lives at `/portfolio/moonshot`. On its own it runs at `http://localhost:3300` with the same route.

The feature itself isn't built yet. This is the setup: the module, the standalone host, sign-in and the server.

## Run it

Node 24 and Yarn 4 (`corepack enable`).

```bash
make start
```

That copies `.env.template` to `.env`, installs, downloads the remotes' types and opens the dev server on port 3300.

You don't need the design system or the API checked out. The dev server proxies `/design` and `/api` to `https://dev.ki-cl.com`, which needs a client token: put the one you were given in `.env` as `KICL_CLIENT_TOKEN`. Use Chrome or Firefox. The API's session cookies are `Secure`, and Safari won't keep them on `http://localhost`.

To use services running on your own machine instead, set `KICL_BACKEND_URL` (Ki.CL-back, usually `http://localhost:3100`) and `KICL_DESIGN_URL` (Ki.CL-design-system, usually `http://localhost:3200`).

| Command               | What it does                                                   |
| --------------------- | -------------------------------------------------------------- |
| `make run`            | Dev server on `PORT`                                           |
| `make types`          | Downloads the `api` and `design` types into `Client/@mf-types` |
| `make build`          | Builds the remote into `Client/dist`                           |
| `make run.production` | Builds, then serves the remote at `/moonshot` from `Server/`   |
| `make typecheck`      | `tsc` over the client                                          |
| `make lint`           | oxlint                                                         |

## How it fits together

- `Client/` is a Vite app and a Module Federation remote called `moonshot`. It exposes `./routes`, a `<Route>` that Ki.CL places under `/portfolio`. `src/standalone` stands in for Ki.CL when it runs alone: it provides the API client and the router.
- It consumes two remotes, the same way Ki.CL does. `design` (from [Ki.CL-design-system](https://github.com/kenilam/Ki.CL-design-system)) supplies the components, styles and router. `api` (from Ki.CL-back, the private API) supplies the GraphQL client, the generated documents and the session helpers.
- `react`, `react-dom`, `@apollo/client`, `react-router-dom` and `react-hook-form` are shared singletons, matching Ki.CL's host config. A second copy of React or the router would break hooks and routing across the module boundary.
- Sign-in uses Ki.CL's own flow, the same gate as Pika: `Kicl_SignInDocument` sets the session cookies and `isAuthenticated()` reads them.
- `Server/` is Express. It serves the built remote at `/moonshot` for Ki.CL to proxy, and will host the AI endpoints under `/moonshot/api`.

The browser only ever talks to localhost. Module scripts loaded with `import()` can't carry a custom header or a cross-site cookie, so the token goes on the dev server's proxy rather than in the browser.

`make types` exists because the federation plugin can't send the token when it fetches types itself, so its `consumeTypes` is off.
