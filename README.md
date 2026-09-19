# EXOIL — exoil.pl

Website of Exoil Paliwa Sp. z o.o. (Chełm): wholesale fuel, deliveries by the company's own road tankers, EXOIL fuel
stations. Next.js 16 (App Router, TypeScript), prepared for Vercel.

## Start here

| Read | Why |
|---|---|
| `docs/EXOIL_REBUILD_BRIEF.md` | The brief |
| `docs/historical-source-audit.md` | What the old site said, where it came from |
| `docs/content-verification.md` | Status of every business claim and how the code enforces it |
| `docs/migration-checklist.md` | Everything that must happen before launch |
| `docs/vercel-deployment.md` | Deployment runbook (nothing is deployed) |

Other docs: `stations-verification.md`, `business-metrics-verification.md`, `partners-verification.md`,
`brand-assets.md`, `url-migration-map.md`, `legal-launch-requirements.md`, `information-architecture.md`.

## Commands

```bash
npm install
npm run dev                          # http://localhost:3000 (production content mode)
CONTENT_MODE=review npm run dev      # shows unverified facts with a "Do weryfikacji" marker
npm run build && npm run start       # production build
npm run typecheck
npm run lint
npm run test                         # unit tests: redirects, verification gate, forms, NIP
npm run launch-check                 # launch gate — fails until the client has confirmed the open items
node scripts/check-redirects.mjs http://localhost:3000   # real HTTP checks of legacy URLs
```

## How the site is put together

- **Content** — `src/data/*.ts`, one fact in one place, each with a verification status and source
  (`src/data/README.md`). Unverified facts never render in production.
- **Homepage journey** — `src/components/home/` (chapters, route rail, network map, SVG diagrams) and
  `src/components/three/` (the WebGL tanker scene, plain Three.js, loaded only on capable desktops via `next/dynamic`).
  Mobile gets an SVG route strip; `prefers-reduced-motion` gets static diagrams.
- **Forms** — Server Actions in `src/app/actions/forms.ts`: Zod validation, honeypot + timing check, per-visitor rate
  limit, plain-text e-mail through Resend. No database.
- **Legacy URLs** — `src/lib/redirects.ts` (308 redirects) and `src/proxy.ts` (410 for WordPress system paths).
- **Brand** — `public/brand/`: the recovered logo files, unmodified (see `docs/brand-assets.md`). Replace with the
  client's vector original when supplied.
