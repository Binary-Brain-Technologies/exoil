# Migration and launch checklist

Owner legend: **C** = client, **D** = development, **C+D** = both.
`npm run launch-check` automates the items marked 🤖 (it fails while any is open).

## 1. Content verification
- [ ] C — Answer the questions in `stations-verification.md` §6; update statuses in `src/data/stations.ts` 🤖
- [ ] C — Answer `business-metrics-verification.md` §5; update `src/data/metrics.ts` 🤖
- [ ] C — Answer `partners-verification.md` questions; supply approved wording + logos if any
- [ ] C — Confirm current contacts (order line, sales, logistics, accounting, HR role addresses) → `src/data/company.ts` 🤖
- [ ] C — Confirm services: heating oil (active? Ekoterm authorisation?), customer tanks (active? specs? telemetry?) → `src/data/services.ts` 🤖
- [ ] C — Confirm fuel grades → `src/data/fuels.ts`
- [ ] C — Confirm "history since 1997" and approve history wording/milestones → `src/data/history.ts` 🤖
- [ ] C — Confirm commercial terms to publish (minimum order, free delivery, lead time, temperature settlement)
- [ ] C — Supply current documents (concession decision PDF, KRS extract, tax-strategy information, optional ZUS/US certificates) → `public/documents/` + `src/data/documents.ts`
- [ ] D — Re-run the content review in `CONTENT_MODE=review` with the client, walk every "Do weryfikacji" marker

## 2. Brand and media
- [ ] C — Vector logo (SVG/EPS/PDF) + official colour references → replace `public/brand/*` (keep file names or update `src/components/brand/Logo.tsx`)
- [ ] C — Reversed/negative logo version, if one exists officially
- [ ] C — Confirm rights to the archived fleet photos (they render only after confirmation) 🤖
- [ ] C — Full-resolution photography per `brand-assets.md` §4, with usage rights
- [ ] C — Fleet reference: tractor/trailer configurations and livery artwork, if the 3D tanker should be refined
- [ ] D — Replace interim photos, re-run image QA (sizes, alt text)

## 3. Legal / privacy (`legal-launch-requirements.md`)
- [ ] C — L1 privacy policy 🤖
- [ ] C — L2/L3 form information clauses 🤖
- [ ] C — L4 recruitment notice 🤖
- [ ] C — L5 CV upload decision
- [ ] C — L6 analytics decision
- [ ] C — L7 registry court confirmation
- [ ] C — L8 order-request wording approval

## 4. Forms and e-mail
- [ ] C+D — Choose the sending domain (e.g. `formularze@exoil.pl`), verify it in Resend (SPF/DKIM DNS records — **client's DNS admin adds them**)
- [ ] D — Set `RESEND_API_KEY`, `FORMS_FROM_EMAIL`, recipients per form in Vercel (Production + Preview) 🤖 (checked at runtime)
- [ ] D — Submit each form on the preview deployment; confirm receipt, reply-to, subject lines
- [ ] D — Confirm rate limiting works on the deployment (Upstash/Vercel KV optional — see deployment doc)

## 5. URLs and SEO
- [ ] D — `npm run test` (redirect table test) green
- [ ] D — `node scripts/check-redirects.mjs https://<preview-url>` green (real HTTP codes)
- [ ] D — Every URL in `url-migration-map.md` returns 200 / 308 / 410 as documented, never 404
- [ ] D — `/sitemap.xml` lists only published, indexable routes; `/robots.txt` allows crawling in production and blocks previews
- [ ] D — Canonicals point to `https://exoil.pl/...` with trailing slash
- [ ] D — Rich Results Test on `/`, one station page, `/hurt-paliw/`
- [ ] C — Google Search Console: verify domain property (DNS TXT — client's DNS admin), submit sitemap after launch
- [ ] C — Bing Webmaster Tools (optional)
- [ ] C — Google Business Profiles of the 7 stations: align names/addresses/hours with the site after verification

## 6. Infrastructure (no action taken by development)
- [ ] C — Decide hosting account (Vercel team/project ownership)
- [ ] C — Add domains `exoil.pl`, `www.exoil.pl` in Vercel; **DNS change performed by the client's DNS admin**, at a planned time
- [ ] C — Keep MX records (mail at `mx.symbioza.net`) untouched when changing A/CNAME records
- [ ] C — Do **not** touch the `portal.exoil.pl` record
- [ ] C — Decide the fate of `exoil.co` (redirect to exoil.pl or let lapse)
- [ ] C — Close or migrate the suspended cyberfolks hosting account only after the new site is live

## 7. Post-launch (first 30 days)
- [ ] D — Watch 404s (Vercel logs / Search Console coverage) daily for week 1, then weekly; add redirects for any meaningful old URL found
- [ ] D — Re-check Core Web Vitals (field data) after 28 days
- [ ] C — Keep documents and station data fresh (owner named for each)
- [ ] C — Decide on news publishing cadence; `/aktualnosci/` appears automatically with the first post
