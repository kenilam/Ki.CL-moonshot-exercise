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

Node 24 and Yarn 4 (`corepack enable`). Use Chrome or Firefox: the API's session cookies are `Secure`, and Safari won't keep them on `http://localhost`.

The dev server proxies `/design`, `/api/session` and `/moonshot/api` somewhere, and `.env` decides where. Set it up before the first start.

### Against dev.ki-cl.com

This is the setup for reviewers. You don't need the design system, the API or an Anthropic key, only a client token. The token is personal and expires: [ask me for one](mailto:hello@ki-cl.com?subject=Moonshot%20client%20token), and don't commit it.

```bash
cp .env.template .env   # then set KICL_CLIENT_TOKEN
make start
```

`make start` installs, downloads the remotes' types and starts the dev server at `http://localhost:3300/portfolio/moonshot`. Without a token it warns in the terminal, and the page can't load.

### Against services on your machine

This is for working on the stack itself, and needs Ki.CL-back, which is private.

1. Start Ki.CL-back and the design system.
2. In `.env`, set `KICL_BACKEND_URL`, `KICL_DESIGN_URL` and `KICL_MOONSHOT_URL` (the template has the ports) and `ANTHROPIC_API_KEY`. Set `TURNSTILE_SITE_KEY` to your Ki.CL-back's key, or to Cloudflare's test key `1x00000000000000000000AA`. `KICL_CLIENT_TOKEN` stays empty, since nothing goes to dev.ki-cl.com.
3. Run `make run.server` and `make run` side by side.

Without `MONGODB_ATLAS_URI` the server keeps reviews in memory.

To see the module inside a local Ki.CL, keep `make run.server` running: Ki.CL proxies `/moonshot` to it on port 3301. It serves the last build, so run `make build` after changing the client.

| Command               | What it does                                                 |
| --------------------- | ------------------------------------------------------------ |
| `make start`          | Installs, then `make run`                                    |
| `make run`            | Downloads the types, then the dev server on `PORT`           |
| `make run.server`     | `Server/` on `MOONSHOT_SERVER_PORT`, serving the last build  |
| `make test`           | Unit tests                                                   |
| `make eval`           | Runs the example texts against the model (costs a call each) |
| `make types`          | Downloads the `design` types into `Client/@mf-types`         |
| `make build`          | Builds the remote into `Client/dist`                         |
| `make run.production` | Builds, then serves the remote and the API from `Server/`    |
| `make typecheck`      | `tsc` over both workspaces                                   |
| `make lint`           | oxlint                                                       |

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
- It consumes one remote, `design` (from [Ki.CL-design-system](https://github.com/kenilam/Ki.CL-design-system)), for the components, styles and router.
- Sessions belong to the host. The module only sends the session cookie, and if its API answers 401 it asks the visitor to reload. Inside Ki.CL, the portfolio's sign-in and Ki.CL's own session handle the rest. Standalone, `src/standalone` starts an anonymous session with one request to Ki.CL-back's `POST /api/session`, after Turnstile when the API asks for it. The allowance and history follow that session.
- `Server/` is Express. It serves the built remote at `/moonshot` and the review API at `/moonshot/api`:
  - `POST /reviews` with `{ kind, text }` returns the review with its located edits.
  - `GET /reviews`, `GET /reviews/:id` and `GET /reviews/allowance` back the history and the counter.
  - `GET /rules` returns the style guide, so the UI can name each rule.
- The server asks Ki.CL's API whose session it is by passing their session cookie to `kicl_Me`. It doesn't verify the cookie itself, because the API signs it with a shared secret, and holding that secret here would also let this server issue sessions.
- Each user gets 20 reviews a day, counted in Mongo so a second instance can't get around it. Text is capped at 8,000 characters.
- Reviews are stored in Ki.CL-back's own database (`test` locally, `production` in production), in a `moonshot-reviews` collection beside the API's.

The browser only ever talks to localhost. Module scripts loaded with `import()` can't carry a custom header or a cross-site cookie, so the token goes on the dev server's proxy rather than in the browser. `make types` exists for the same reason: the federation plugin can't send the token when it fetches types itself.

## Deploy

Ki.CL proxies `/moonshot` to a private Cloud Run service built from the `Dockerfile`, one for dev and one for production. Pushes to `develop` and `main` redeploy them. The infrastructure setup isn't in this repo.

## Tests

`make test` runs the unit tests: finding quotes in the text (`locate.test.ts`) and applying accepted edits (`apply.test.ts`). Both are deterministic.

`make eval` runs eight example texts against the real model. Each says which phrases a good review must flag and which it must leave alone (facts, numbers, code), and it reports how many edits were dropped because their quote didn't match. It isn't in CI, because every run is paid.

## Trade-offs, and what I'd do next

- **No streaming.** A review takes a few seconds and the button says so. Streaming the edits in as they arrive would feel faster, but structured output arrives as one JSON document, so it would need either partial JSON parsing or one tool call per edit.
- **Decisions aren't saved.** Reopening a review from the history starts with every edit pending again. Saving them is one more endpoint and a field on the review.
- **The rules are fixed.** A team would want to add its own, such as house terms or a changelog format. The rules are already data with ids, so this is mostly UI.
- **Eight eval cases is a start, not a measurement.** I'd grow it from real texts people paste, and track the drop rate per model before changing the prompt or the model.
- **The allowance is per session.** Every new anonymous session needs Turnstile, but someone who keeps passing it gets 20 more reviews each time. Ki.CL identifies visitors by session only, never by IP. Standalone, only client-token holders reach the deployment; inside Ki.CL the portfolio's sign-in covers it.
