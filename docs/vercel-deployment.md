# Vercel deployment

**Nothing has been deployed, no Vercel project was created and no DNS record was changed.** This document is the
runbook for the person who will do it, when the client decides.

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

## 2. Environments

| Vercel environment | `CONTENT_MODE` | Indexing | Purpose |
|---|---|---|---|
| Preview (branch `review`) | `review` | noindex (automatic) | Client content review: every unverified fact is visible with a hatched marker |
| Preview (other branches) | `production` | noindex (automatic) | QA of what will actually go live |
| Production | `production` | index | Public site |

`CONTENT_MODE` is read **at build time**: after changing it, redeploy. The review deployment should be protected with
Vercel Deployment Protection (password or Vercel Authentication), because it shows unverified historical data.

## 3. Environment variables

All variables are documented in `.env.example`. Required in Production and Preview:

- `NEXT_PUBLIC_SITE_URL` = `https://exoil.pl`
- `RESEND_API_KEY`, `FORMS_FROM_EMAIL`
- `ORDER_TO_EMAIL`, `CONTACT_TO_EMAIL` (+ optional per-topic `CONTACT_TO_EMAIL_*`), `CAREERS_TO_EMAIL`
- `RATE_LIMIT_SALT`

Optional: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (shared rate limit across function instances — install
Upstash from the Vercel Marketplace), `RECRUITMENT_UPLOADS_ENABLED`.

Without the mail variables the forms do **not** pretend to succeed: the visitor sees "Nie udało się wysłać wiadomości"
and their input stays in the form.

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

1. In Vercel → Project → Domains add `exoil.pl` (primary) and `www.exoil.pl` (redirect to `exoil.pl`).
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
