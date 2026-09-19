# Vercel deployment

Current setup: the site is deployed to a Vercel project for **client presentation on `exoil.vercel.app`**. No DNS
record for `exoil.pl` has been changed. Launch steps are in [`pre-launch-plan.md`](./pre-launch-plan.md).

## 1. Project settings

| Setting | Value |
|---|---|
| Framework preset | Next.js (16.3.x, App Router) |
| Node.js | 20.9+ (24.x tested locally) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output | default (`.next`) |
| Root directory | repository root |

Recommended CI gates before promoting a deployment: `npm run typecheck`, `npm run lint`, `npm run test`.
Before the public launch additionally: `npm run launch-check` (must be green — see `docs/migration-checklist.md`).

## 2. Environments and how the site knows its own address

The site URL and indexing are resolved automatically (`src/lib/site-url.ts`, covered by `tests/site-url.test.ts`):

| Situation | Site URL used (canonicals, sitemap, OG) | Indexable? |
|---|---|---|
| Vercel production, project domain `exoil.vercel.app` (client preview) | `https://exoil.vercel.app` | **No** — robots.txt `Disallow: /`, pages `noindex` |
| Vercel preview deployments (branches/PRs) | the deployment's own `*.vercel.app` URL | No |
| Vercel production after `exoil.pl` is attached as the production domain | `https://exoil.pl` | **Yes** (unless `SITE_INDEXABLE=false`) |
| Local / non-Vercel | `https://exoil.pl` (or `NEXT_PUBLIC_SITE_URL`) | Only with `SITE_INDEXABLE=true` |

Indexing depends on the domain attached to the Vercel project, never on `NEXT_PUBLIC_SITE_URL`, so the preview cannot be
indexed by mistake. Leave `NEXT_PUBLIC_SITE_URL` **unset** on Vercel (an empty value is ignored).

The site always shows the complete content as designed. `exoil.vercel.app` is publicly reachable (only hidden from
search engines) and shows historical data the client has not yet confirmed — share the link with the client only, or
add Vercel Deployment Protection if the plan allows.

## 3. Environment variables

All variables are documented in `.env.example`.

Preview for the client (`exoil.vercel.app`):
- No variables are required for the build.
- Forms: without the mail variables below, sending a form shows "Nie udało się wysłać wiadomości" (nothing is lost or
  faked). To demo working forms, configure Resend with a verified sender and your own recipient addresses.

Production (`exoil.pl`):
- `RESEND_API_KEY`, `FORMS_FROM_EMAIL` (address on a Resend-verified domain, e.g. `formularze@exoil.pl`)
- `ORDER_TO_EMAIL`, `CONTACT_TO_EMAIL` (+ optional per-topic `CONTACT_TO_EMAIL_*`), `CAREERS_TO_EMAIL`
- `RATE_LIMIT_SALT`
- `NEXT_PUBLIC_SITE_URL` unset (resolved from the attached domain)

Optional: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (shared rate limit across function instances — install
Upstash from the Vercel Marketplace), `RECRUITMENT_UPLOADS_ENABLED`.

## 4. Runtime characteristics

- No runtime filesystem writes. News and legal Markdown are read at build time; station/company data is compiled in.
- Server Actions (forms) run as Vercel Functions (Node.js runtime). Body limit raised to 6 MB for the optional PDF CV.
- `src/proxy.ts` (Next 16 "proxy", formerly middleware) only matches legacy WordPress paths and answers 410.
- Legacy redirects (308) come from `src/lib/redirects.ts` via `next.config.ts` → evaluated at the edge, no function.
- Images: `next/image` with AVIF/WebP, qualities 75/90; all images are local static imports (no remote patterns needed).
- Fonts: `next/font/google` (Archivo, IBM Plex Sans, IBM Plex Mono) — self-hosted at build, no runtime request to Google.
- Security headers set in `next.config.ts` (HSTS, nosniff, frame DENY, referrer policy, permissions policy).
- No analytics or third-party scripts are loaded (see tracking plan in `docs/legal-launch-requirements.md` §4).

## 5. Domains (client's DNS admin performs these steps at launch time)

1. In Vercel → Project → Domains add `exoil.pl` (primary production domain) and `www.exoil.pl` (redirect to
   `exoil.pl`). This is what switches indexing on and makes `exoil.pl` the canonical URL — redeploy afterwards.
2. Vercel shows the required records (A record for the apex, CNAME for `www`).
3. At the DNS provider change **only** those records. Keep MX (mail currently at `mx.symbioza.net`), SPF/DKIM TXT, and
   the `portal.exoil.pl` record untouched.
4. Add the Resend SPF/DKIM records for the form sender domain.
5. Optionally point `exoil.co` at the same project as a redirect domain (decision in `docs/migration-checklist.md`).
6. After propagation: run `node scripts/check-redirects.mjs https://exoil.pl`, submit `https://exoil.pl/sitemap.xml`
   in Google Search Console.

Current state of `exoil.pl` (2026-09-19): the hosting account at cyberfolks is suspended ("Strona Zawieszona", HTTP 200),
so switching DNS to Vercel also ends the soft-200 suspension page.

## 6. Rollback

Vercel keeps every deployment; "Instant Rollback" to the previous production deployment. DNS rollback is not needed for
application issues.
