# Ki.CL moonshot exercise

A writing reviewer for engineers. Paste a commit message, PR description, README or code comment, and it comes back with specific edits: each one quotes the text it changes, names the rule it applies and says why. You accept or reject each edit and copy the result.

It's built as a federated module of [Ki.CL](https://ki-cl.com) and lives at `/portfolio/moonshot`, an introduction page with the editor at `/portfolio/moonshot/writing-review`. It also runs on its own at `http://localhost:3300/portfolio/moonshot`.

## Using it

1. Pick what you're reviewing: commit, pull request, README or code comment. The rules for commit messages differ from the rules for a README, so the review needs to know.
2. Paste the text, up to 8,000 characters, and select **Review**. It takes a few seconds.
3. Your text comes back with each suggested edit highlighted. Next to it, each edit shows the rule it applies and a one-line reason.
4. Accept or reject each edit, or **Accept all**. The result below updates as you go. **Copy** puts it on your clipboard.

Each kind has three examples to try: one that already reads well, one with plenty to edit, and one the review turns away. Earlier reviews are listed under the form. Each visitor's session gets 20 reviews a day.

## Why this

Engineers' writing drifts into the same habits: build-up before the point, filler transitions, "robust" and "seamless", a lesson tacked onto the end. Asking a chat model to "make this better" rewrites the whole thing in its own voice, which is the problem it was meant to fix. I wanted the opposite: small edits the author can see, judge and take or leave, with the author's facts and voice left alone.

## Run it

Node 24 and Yarn 4 (`corepack enable`).

```bash
make start
```

That copies `.env.template` to `.env`, installs, downloads the remotes' types and starts the dev server on port 3300.

The dev server proxies `/design`, `/api` and `/moonshot/api` somewhere. Where depends on `.env`, and there are two ways to set it up:

- **Against dev.ki-cl.com (reviewers).** Leave `KICL_BACKEND_URL`, `KICL_DESIGN_URL` and `KICL_MOONSHOT_URL` unset, and put the client token you were sent in `.env` as `KICL_CLIENT_TOKEN`. You don't need the design system, the API or an Anthropic key. The token is personal and expires; [ask me for one](mailto:hello@ki-cl.com?subject=Moonshot%20client%20token), and don't commit it.
- **Against services on your machine.** Set those three URLs (the template has the ports) and leave `KICL_CLIENT_TOKEN` empty: nothing goes to dev.ki-cl.com, so there's nothing to get past. This needs Ki.CL-back, which is private, so it's for working on the stack itself. See the end of this section.

Use Chrome or Firefox. The API's session cookies are `Secure`, and Safari won't keep them on `http://localhost`.

| Command               | What it does                                                   |
| --------------------- | -------------------------------------------------------------- |
| `make run`            | Dev server on `PORT`                                           |
| `make run.server`     | `Server/` on `MOONSHOT_SERVER_PORT`, for working on the API    |
| `make test`           | Unit tests                                                     |
| `make eval`           | Runs the example texts against the model (costs a call each)   |
| `make types`          | Downloads the `api` and `design` types into `Client/@mf-types` |
| `make build`          | Builds the remote into `Client/dist`                           |
| `make run.production` | Builds, then serves the remote and the API from `Server/`      |
| `make typecheck`      | `tsc` over both workspaces                                     |
| `make lint`           | oxlint                                                         |

To run everything on your own machine, start Ki.CL-back and the design system, set `KICL_BACKEND_URL`, `KICL_DESIGN_URL` and `KICL_MOONSHOT_URL` in `.env` (the template has the usual ports), add `ANTHROPIC_API_KEY`, and start `make run.server` next to `make run`. `KICL_CLIENT_TOKEN` stays empty. Without `MONGODB_ATLAS_URI` the server keeps reviews in memory.

## How the AI is used

One call per review, to Claude Opus 5.5 through the Anthropic SDK (`Server/review/model.ts`).

- **The style guide is the system prompt.** `Server/review/rules.ts` holds eleven rules with ids, from "lead with the point" to commit-message format. The prompt is the same on every request so it can be cached; only the text and its kind change.
- **The output is structured.** The model returns `{ quote, replacement, rule, reason }` for each edit, validated against a zod schema through structured outputs. `rule` has to be one of the ids, so every edit can show which rule it applies.
- **The model never gives positions.** It quotes the text it wants to change, and `Server/review/locate.ts` finds the quote. A quote that isn't in the text, appears more than once, overlaps another edit or changes nothing is dropped. Dropping a suggestion is cheap; applying one in the wrong place would corrupt the user's text.
- **It can turn text away.** If the text isn't technical writing at all, or tries to give the model instructions ("ignore the rules above"), the model sets `rejection` instead of returning edits, and the UI shows that sentence. Everything inside the submitted text is treated as text to review, never as instructions. A rejected attempt still counts against the daily allowance, because it still costs a model call, but it stays out of the history.
- **It reviews what the text is.** The model also returns `reviewedAs`. A commit message submitted as a README is reviewed as a commit message, with that kind's conventions, and the review page says so instead of rejecting it.
- **Declines fall back.** The request opts into server-side fallbacks, so a refusal is retried on Anthropic's recommended model instead of failing. A refusal that survives that shows as a plain error.

Why Opus 5.5: the task is judgement, not volume. It has to tell a filler sentence from one that carries information, keep the author's facts and code untouched, and quote text exactly. A review is one request a user waits for once, so the latency and price of the larger model are fine. `MOONSHOT_MODEL` switches it, and `make eval` is how I'd check a cheaper model holds up.

## How it fits together

- `Client/` is a Vite app and a Module Federation remote called `moonshot`. It exposes its parts rather than a finished route: `./introduction`, `./compose` and `./review` (the three routes) and `./constants` (`PATH`). Ki.CL renders them in a `<Routes>` under its own `/portfolio/moonshot/*` route, loaded on first visit and behind its sign-in, so the rest of Ki.CL still works if this remote is down. The standalone host assembles them under `PATH`. `src/standalone` stands in for Ki.CL when it runs alone: it provides the API client and the router.
- It consumes two remotes, the same way Ki.CL does. `design` (from [Ki.CL-design-system](https://github.com/kenilam/Ki.CL-design-system)) supplies the components, styles and router. `api` (from Ki.CL-back, the private API) supplies the GraphQL client and the session helpers.
- There's no sign-in. `KiclProvider` starts an anonymous Ki.CL session on the first visit, and the allowance and history follow that session. When Ki.CL shows the module in its portfolio, the portfolio puts its own sign-in in front of it.
- `Server/` is Express. It serves the built remote at `/moonshot` and the review API at `/moonshot/api`:
  - `POST /reviews` with `{ kind, text }` returns the review with its located edits.
  - `GET /reviews`, `GET /reviews/:id` and `GET /reviews/allowance` back the history and the counter.
  - `GET /rules` returns the style guide, so the UI can name each rule.
- The server asks Ki.CL's API whose session it is by passing their session cookie to `kicl_Me`. It doesn't verify the cookie itself, because the API signs it with a shared secret, and holding that secret here would also let this server issue sessions.
- Each user gets 20 reviews a day, counted in Mongo so a second instance can't get around it. Text is capped at 8,000 characters.
- Reviews are stored in Ki.CL-back's own database (`test` locally, `production` in production), in a `moonshot-reviews` collection beside the API's.

The browser only ever talks to localhost. Module scripts loaded with `import()` can't carry a custom header or a cross-site cookie, so the token goes on the dev server's proxy rather than in the browser. `make types` exists for the same reason: the federation plugin can't send the token when it fetches types itself.

## Deploy

Two Cloud Run services, `ki-cl-moonshot-dev` and `ki-cl-moonshot`, in Ki.CL's project and network. They are internal and private: only Ki.CL's server calls them, with an ID token, at `/moonshot`. Pushes to `develop` and `main` redeploy them. `scripts/gcp.sh` sets this up, one step at a time: `secrets`, `deploy dev|prod`, `triggers`, `wire dev|prod` (sets `KICL_MOONSHOT_URL` on Ki.CL), and `localhost` (lets a standalone run on localhost use dev, given the client token public key).

## Tests

`make test` runs the unit tests: finding quotes in the text (`locate.test.ts`) and applying accepted edits (`apply.test.ts`). Both are deterministic.

`make eval` runs eight example texts against the real model. Each says which phrases a good review must flag and which it must leave alone (facts, numbers, code), and it reports how many edits were dropped because their quote didn't match. It isn't in CI, because every run is paid.

## Trade-offs, and what I'd do next

- **No streaming.** A review takes a few seconds and the button says so. Streaming the edits in as they arrive would feel faster, but structured output arrives as one JSON document, so it would need either partial JSON parsing or one tool call per edit.
- **Decisions aren't saved.** Reopening a review from the history starts with every edit pending again. Saving them is one more endpoint and a field on the review.
- **The rules are fixed.** A team would want to add its own, such as house terms or a changelog format. The rules are already data with ids, so this is mostly UI.
- **Eight eval cases is a start, not a measurement.** I'd grow it from real texts people paste, and track the drop rate per model before changing the prompt or the model.
- **Anonymous sessions aren't checked for being human.** Ki.CL-back hands them out without Turnstile when the page has no widget, so a script could start new sessions to get more reviews. Standalone, only client-token holders can reach the deployment; inside Ki.CL the portfolio's sign-in covers it. A public standalone deployment would need the Turnstile check.
