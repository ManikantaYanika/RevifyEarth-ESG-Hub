# RevifyEarth

RevifyEarth is the official website for Revify Private Limited, presenting its ESG branding and sustainability communication services to enterprise organizations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/revifyearth/src/App.tsx` — one-page site structure, content, navigation, and interactions.
- `artifacts/revifyearth/src/index.css` — RevifyEarth visual tokens, typography, responsive styling, motion, and reduced-motion behavior.
- `artifacts/revifyearth/public/assets/revify/` — official mark, proposal imagery, and team portraits extracted from the supplied proposal PDF.
- `attached_assets/Sagility_Proposal_2026_(1)_1786013304086.pdf` — source proposal used for verified company/service/team/contact content.
- `attached_assets/Pasted-You-are-an-Elite-Product-Designer-Creative-Director-Bra_1786013313843.txt` — website brief and quality requirements.

## Architecture decisions

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

## Gotchas

- Use `pnpm --filter @workspace/revifyearth run typecheck` for the frontend check.
- Keep `PORT` and `BASE_PATH` workflow-provided; do not run the frontend directly without them.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
