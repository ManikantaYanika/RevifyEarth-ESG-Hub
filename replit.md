# RevifyEarth

RevifyEarth is the official website for Revify Private Limited, presenting its ESG branding and sustainability communication services to enterprise organizations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Assistant env: `OPENAI_API_KEY`, plus `OPENAI_BASE_URL` and `OPENAI_MODEL` when using a
  gateway rather than OpenAI — see `artifacts/api-server/.env.example`. Copy it to
  `artifacts/api-server/.env` (gitignored). Without the key the server still boots,
  `/api/assistant/status` reports `available: false`, and the site hides the chat launcher
  instead of offering a control that fails.
- `--env-file` does **not** override variables already in the environment. A stale
  `OPENAI_API_KEY` persisted at Windows User scope silently wins over `.env`; check with
  `[Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User')` if a new key appears to
  have no effect.
- The frontend must run alongside the API server: Vite proxies `/api` to
  `http://127.0.0.1:5000` (override with `API_PORT`).

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Assistant: Chat Completions (`openai` SDK) against OpenAI or any OpenAI-compatible
  gateway, streamed to the browser over SSE

## Where things live

- `artifacts/revifyearth/src/App.tsx` — providers, router and the persistent app shell. Pages are lazy-loaded; only Home ships in the initial chunk.
- `artifacts/revifyearth/src/data/` — all site content, extracted from the proposal PDF. `services.ts` holds the seven service deep-dives, `company.ts` the team/values/frameworks, `methodology.ts` the five phases and scope boundaries, `industries.ts` the six target sectors, `resources.ts` FAQs plus the placeholder registry, `media.ts` the image derivative registry, `seo.ts` per-route metadata.
- `artifacts/revifyearth/src/components/site/` — design-system primitives (buttons, eyebrows, hero, reveal, responsive image, modal).
- `artifacts/revifyearth/src/components/layout/` — header/mega-menu, mobile nav, footer, scroll chrome, metadata, assistant.
- `artifacts/revifyearth/src/hooks/use-body-scroll-lock.ts` — reference-counted, iOS-safe
  page scroll lock shared by the mobile nav and the assistant sheet.
- `artifacts/revifyearth/src/hooks/use-media-query.ts` — reactive breakpoint state for
  components whose *behaviour* (not just styling) changes across a breakpoint.
- `artifacts/revifyearth/src/lib/assistant-format.ts` — splits the assistant's suggested
  follow-ups off the end of a reply. Must stay in step with `FOLLOWUP_MARKER` in
  `artifacts/api-server/src/assistant/prompt.ts`.
- `artifacts/revifyearth/src/components/sections/` — composable page sections (service card, framework strip, ecosystem, methodology, FAQ, pending-trust panels).
- `artifacts/revifyearth/src/pages/` — one file per route.
- `artifacts/revifyearth/src/components/assistant/` — the chat panel, message bubbles and
  markdown renderer. Lazy-loaded from `components/layout/Assistant.tsx` so react-markdown
  stays out of the initial bundle (it is ~53 kB gzipped, fetched only when a visitor opens
  the chat).
- `artifacts/revifyearth/src/lib/assistant-client.ts` — SSE transport (fetch +
  ReadableStream; EventSource cannot POST a conversation body).
- `artifacts/revifyearth/src/hooks/use-assistant-chat.ts` — conversation state, streaming,
  stop/regenerate/clear, sessionStorage persistence.
- `artifacts/api-server/src/assistant/` — `knowledge.ts` (the RevifyEarth corpus and its
  keyword retrieval), `prompt.ts` (persona + grounding rules), `openai.ts` (streaming and
  error mapping), `schema.ts` (request validation).
- `artifacts/api-server/src/routes/assistant.ts` — `POST /api/assistant/chat` (SSE) and
  `GET /api/assistant/status` (capability probe).
- `artifacts/api-server/src/config/env.ts` — the single place environment variables are
  read and validated.
- `artifacts/revifyearth/src/index.css` — RevifyEarth visual tokens, typography, responsive styling, motion, and reduced-motion behavior.
- `artifacts/revifyearth/public/assets/revify/` — the official mark plus shipped WebP derivatives. Full-resolution originals are preserved unmodified in `attached_assets/source-imagery/` and are deliberately not in `public/` (they were 27 MB of the build).
- `attached_assets/Sagility_Proposal_2026_(1)_1786013304086.pdf` — source proposal used for verified company/service/team/contact content.
- `attached_assets/Pasted-You-are-an-Elite-Product-Designer-Creative-Director-Bra_1786013313843.txt` — website brief and quality requirements.

## Architecture decisions

- The assistant's knowledge corpus lives in `artifacts/api-server/src/assistant/knowledge.ts`,
  not in a shared package. The frontend's `src/data/` is shaped for rendering (image assets,
  route slugs) and lives under `artifacts/`, which server code must not import from.
  **Both are written from the same proposal PDF and must be kept in sync** — the site and the
  assistant must never state different facts.
- The assistant uses **Chat Completions, not the Responses API**. Responses is OpenAI-only;
  every OpenAI-compatible gateway (Tokligence, OpenRouter, LiteLLM, vLLM) serves
  `/v1/chat/completions` and 404s `/v1/responses`. Chat Completions runs on both, so the
  provider is an env change rather than a code change. Do not "upgrade" this back to
  Responses without checking what the deployment's `OPENAI_BASE_URL` actually serves.
- The persona and company knowledge go in a leading `system` message the server always
  writes itself. Request validation rejects the `system` role from clients, so a visitor
  cannot inject or overwrite one.
- Only `delta.content` is forwarded to the browser. Reasoning models served through these
  gateways (GLM, Kimi, DeepSeek) also stream `reasoning_content` — the model's scratchpad,
  which must never reach the transcript.
- The server holds no conversation state; the browser sends the full transcript each turn.
  This keeps the API horizontally scalable and means nothing a visitor types is persisted
  by this application. Retention beyond that is the provider's: Chat Completions is not
  stored by OpenAI unless `store: true` is passed, but a third-party gateway sits in the
  request path and its own retention policy applies. Check it before pointing
  `OPENAI_BASE_URL` at a new provider.
- Rate limiting is in-process (per-IP window plus a process-wide daily cap). Under autoscale
  each instance counts separately, so the effective limit is per-instance. A shared store
  would be needed for a hard global guarantee.
- **The mobile nav renders through a portal onto `document.body`, and must stay there.**
  The header carries `backdrop-blur-xl`, and a non-`none` `backdrop-filter` makes an element
  the containing block for its fixed-position descendants. Mounted inside the header, the
  sheet resolved `inset-y-0` against the 77px-tall header rather than the viewport and
  opened as a ~10px sliver. Any full-screen overlay added inside the header needs the same
  treatment.
- Page scroll is locked by pinning the body with `position: fixed` and a negative `top`,
  not `overflow: hidden`, which iOS Safari ignores for rubber-band scrolling. Locks are
  reference-counted because the nav and the assistant can both be mounted at once.
- Mobile is a distinct layout, not the desktop columns stacked: the footer's five nav
  groups are disclosures below `lg` and columns from `lg`, and the assistant launcher is a
  circular button below `sm` (the labelled pill covered body text down the whole page).
- Touch targets are met in layout, not with a transparent `::before`. Pseudo-element hit
  areas are not reliably hit-tested, and cannot be measured by `getBoundingClientRect`, so
  a target that "passes" that way cannot be verified.
- The public site is presentation-first and intentionally does not surface the Sagility proposal's commercial fee as a generic RevifyEarth price.
- The site uses a single anchored narrative so visitors can move from positioning to services, proof of expertise, team, and contact without losing context.
- Proposal photography and the extracted official RevifyEarth mark are reused directly rather than recreated or replaced.

## Product

- Premium ESG branding and sustainability communication company website.
- Service overview covering gap assessment, report design, print, board presentations, video reports, web development, and integrated ESG communication.
- Process, ESG expertise, team, and verified contact details with responsive navigation and a video-report approach modal.

## User preferences

- Use only verified source content from uploaded company material; mark unavailable information as a placeholder rather than inventing it.
- Preserve official company assets exactly as provided.
- The public site does not name the founding client. The proposal is a confidential techno-commercial document, so engagement references are de-identified ("a healthcare enterprise").
- Testimonials, awards, partners, client logos and performance metrics are not fabricated. Those sections are built and driven by `pendingContent` in `src/data/resources.ts`, which renders an explicit "awaiting verified content" state until real material is supplied.
- Industries are presented as target sectors with sector-level disclosure context, not as claimed client work.
- The same integrity rules bind the assistant. Its system prompt forbids inventing services,
  quoting any price, naming a client, or fabricating testimonials, awards, partners or
  metrics, and requires it to say when something is not published and refer to
  info@revifyearth.com instead.
- The assistant is scope-limited to RevifyEarth, ESG, sustainability, and sustainability
  reporting and communication. Anything else is declined in one sentence and redirected. It
  answers adjacent questions (the sustainability angle on supply chain, HR, finance, risk)
  through the disclosure lens rather than refusing — the guard is against general-assistant
  use, not against genuinely relevant questions.

## Gotchas

- Use `pnpm --filter @workspace/revifyearth run typecheck` for the frontend check.
- `PORT` and `BASE_PATH` are optional. Both Vite configs resolve the port inside the
  `defineConfig` factory and only for `command === 'serve'`, so **`vite build` never
  reads them** — requiring them at module scope broke every static host (Netlify,
  Vercel), which has no reason to define a port. Unset, dev falls back to 5173/5174
  without `strictPort`; when the workflow supplies `PORT` it is validated and bound
  strictly, because Replit needs that exact port. `BASE_PATH` defaults to '/' and
  remains the override for a sub-path mount.
- `ASSISTANT_ALLOWED_ORIGINS` must list any origin that serves the SPA from a different host
  to the API. Left empty, CORS permits same-origin only — correct when both are served from
  this host, and correct in development because Vite proxies `/api`.
- Never add `console.log` of request bodies in the assistant path; visitor prompts are not
  logged, only lengths and durations.
- `OPENAI_MODEL` has no portable default — a model id only means something to the gateway
  `OPENAI_BASE_URL` points at. Call `GET <base>/models` for the served list, and check
  regional availability (on Tokligence the Anthropic models exclude IN).
- On a reasoning model, thinking tokens come out of `max_tokens`. Left at the default
  effort, Gemini 3.5/3.6 Flash spent the whole budget thinking and the reply was cut off
  mid-sentence after a single chunk. `OPENAI_REASONING_EFFORT=low` fixes it. Symptom to
  recognise: one delta, then `finish_reason: length`.
- An upstream **400 is treated as an operator fault**, not a visitor fault. Visitor input
  is schema-validated before the provider is called, so a 400 from upstream means a bad
  key (Gemini answers 400, not 401), an unserved model id, or a rejected parameter.
  Mapping it to "try rephrasing your question" blames the visitor for a misconfiguration
  and offers a retry that cannot succeed.
- A stream that ends having produced no text throws rather than returning an empty reply —
  safety filters and reasoning overruns both cause it, and an empty bubble is not an answer.
- **Provider errors are diagnosed, not guessed at.** `assistant/upstream-error.ts` parses
  the provider payload and classifies it as quota / auth / model / endpoint / bad_request /
  timeout / network / server, then logs the verbatim provider status, message, quota id and
  retry hint. The visitor still sees only a generic message.
- Google returns errors as a JSON **array**, `[{ "error": {...} }]`, which the OpenAI SDK
  cannot parse — a real 429 carrying the exact quota name arrived in the log as
  "429 status code (no body)". `diagnosticFetch` unwraps it before the SDK sees it. Any new
  provider with a non-standard error envelope needs the same treatment.
- Retries live in `withRetries`, not the SDK (`maxRetries: 0` so they cannot compound).
  Exponential backoff with full jitter, capped at 8s, honouring the provider's own
  `RetryInfo.retryDelay` — which arrives in the *body*, where the SDK cannot see it.
  **Retryability is a property of the failure, not the status code**: a per-minute rate
  limit is retried, a per-day quota is not, because retrying the latter only consumes the
  remaining allowance faster.
- `OPENAI_MODEL_FALLBACKS` gives model-level failover for limits scoped to one model.
  Only quota and model faults fail over; an auth fault would fail identically on every
  candidate.
- Every reply ends with a `[[FOLLOWUPS]]` line the client strips and renders as chips. If
  you change the marker, change it in both `prompt.ts` and `lib/assistant-format.ts` — a
  mismatch leaks the marker into the visible transcript.
- `.eyebrow` and the `text-[10px]` label chips step up below `lg`, so tablet keeps a
  readable label size. Use `lg:` for these, not `sm:` — `sm:` reverts at 640px and leaves
  768px on the 10.88px desktop size.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
