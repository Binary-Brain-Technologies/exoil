# Pre-launch plan — from client approval to exoil.pl

Status on 2026-09-19: the site is built and running as a preview on **https://exoil.vercel.app** (not indexed by search
engines). `exoil.pl` still shows the old host's "Strona Zawieszona" page; no DNS record has been changed.

This document lists everything that has to happen **after the client accepts the design**, in order. Items marked 🤖 are
checked automatically by `npm run launch-check` — the site is ready to launch only when that command passes.

Owner: **K** = client (EXOIL), **W** = web team, **D** = client's DNS / domain administrator.

---

## 0. How to present the preview

- The preview shows the complete site as designed, including everything recovered from the old site that the client
  still has to confirm (phones, opening hours, delivery terms, photos). Use section 2 below as the checklist while
  walking through it with the client. The preview is hidden from search engines.
- Forms on the preview show "Nie udało się wysłać wiadomości" until e-mail delivery is configured (section 5). This is
  intentional: the site never pretends a message was sent.
- Walk through: homepage journey (3D on desktop, simplified on phones), Hurt paliw, Dostawy, Stacje (7 stations),
  O firmie → Historia / Dokumenty, Kontakt, Zamów paliwo.

---

## 1. Decisions the client must make

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Is the **customer-tank offer** (zbiorniki) still current? | Yes → page `/zbiorniki/` goes live · No → stays off, old URL redirects to `/hurt-paliw/` | Ask; the old page was last edited in 2019 |
| D2 | Is **heating oil** sold as a separate offer, and is EXOIL still an **authorised ORLEN Ekoterm distributor**? | Page stays with generic copy · add authorised-distributor claim (needs written authorisation) | Keep the page; add the claim only with documents |
| D3 | **Suppliers**: may ORLEN / Aramco / BP / Unimot / TotalEnergies / Solumus be named? | Name none (current build) · name with approved wording (+ logos only with permission) | Name none unless each supplier agrees |
| D4 | **Prices** on the website? | None (current build) · retail station prices from one data source | None; B2B stays quote-based |
| D5 | **Analytics**? | None (current build) · cookieless Vercel Web Analytics · Google Analytics (needs consent banner) | None or cookieless |
| D6 | **CV upload** on /kariera/? | E-mail only (current build) · PDF upload attached to the HR e-mail | E-mail only until the privacy notice is ready |
| D7 | **News** section? | Off (current build) · client publishes posts | Only if someone will actually post |
| D8 | What to do with **exoil.co**? | Redirect to exoil.pl · let it lapse | Redirect while it is paid for |
| D9 | Wording about **1997** | "Historia EXOIL sięga 1997 roku" · omit | Use it only if the owners confirm |

---

## 2. Content to confirm (client) 🤖

Each item is a field in `src/data/*.ts`. Confirming it = changing its status to `VERIFIED_CURRENT` with the source
(e.g. `"Potwierdzone przez klienta, e-mail 2026-10-02"`). Everything else updates itself (pages, footer, sitemap, data
for Google).

**Contacts** — `src/data/company.ts`
- [ ] Order line (old site: 519 310 310) 🤖
- [ ] Sales phones (519 310 572, 725 045 045, 724 724 564, 519 303 199) and e-mail (biuro@exoil.pl) 🤖
- [ ] Logistics 577 871 787 · zakupy@exoil.pl 🤖
- [ ] Accounting 725 106 090 · finanse@exoil.pl 🤖
- [ ] HR 519 310 569 **plus a role e-mail address** (the old site used a named person's address — not published) 🤖
- [ ] Registry court: "Sąd Rejonowy Lublin-Wschód w Lublinie z siedzibą w Świdniku" 🤖
- [ ] Bank account — publish or not (recommendation: not on the website)

**Stations** — `src/data/stations.ts` (addresses are already confirmed from the URE registry)
- [ ] Are all 7 stations open under the EXOIL name? (Chełm Okszowska, Chełm Hutnicza, Siedliszcze, Wierzbica,
      Siennica Królewska Duża, Świdnik, Zamość)
- [ ] Hutnicza: house number **3 or 19**? (registry and old site disagree) 🤖
- [ ] Wierzbica: street name "ul. Chełmska 25"? 🤖
- [ ] Opening hours for each station (old site: 24 h except Zamość Mon–Sat 6–22, Sun 9–17) 🤖
- [ ] Phone and e-mail for each station 🤖
- [ ] Facilities per station: truck parking, shop, hot food, coffee, car wash, toilets, AdBlue, fleet cards
- [ ] Fuel grades per station (PB95/PB98/ON/LPG…)

**Offer and terms** — `src/data/terms.ts`, `src/data/fuels.ts`
- [ ] Minimum order (old: 500 l), free delivery threshold (old: from 500 l), delivery time (old: up to 24 h excl. weekends)
- [ ] Settlement at actual or reference temperature 15 °C
- [ ] Tanker capacity range (old "17–35 m³" conflicts with a 36 000 l trailer in the 2023 photos)
- [ ] Meters legalised by GUM; SENT power of attorney / e-mail confirmation
- [ ] Customer pickup at PERN (Emilianów, Małaszewicze) / ORLEN (Lublin, Sokółka) bases
- [ ] Diesel grades (with/without bio-component, arctic) and PB 95 / PB 98 in wholesale
- [ ] If D1 = yes: tank capacities, equipment, approvals (UDT, fire, environment), warranty, rental, online monitoring

**Company story and figures** — `src/data/history.ts`, `src/data/metrics.ts`, `src/data/careers.ts`
- [ ] 1997 origin and wording (D9) 🤖
- [ ] Current headcount (old site: 70 vs "over 100" — conflicting), number of business customers, fleet size,
      annual km / deliveries — only those the client wants to publish, with the date they refer to
- [ ] Teams listed on the careers page
- [ ] Awards (Forbes Diamonds, Gazele Biznesu, Perły Biznesu) — year + certificate, if to be shown
- [ ] Community work (Dom Dziecka w Dubience, Chełmianka) — only with the other party's consent

---

## 3. Materials the client must supply

- [ ] **Vector logo** (SVG/EPS/PDF/AI) + official colours (CMYK/Pantone/RAL) — replaces the recovered 512 px raster 🤖
- [ ] Negative/reversed logo version, if one officially exists
- [ ] **Confirmation of rights** to the four fleet photos and the archival Iveco photo used now (they fail
      launch-check until confirmed) 🤖
- [ ] Full-resolution photos (priority order): tankers (side, front ¾, rear), loading at a base, a delivery at a customer
      site, each of the 7 stations, customer tanks (if D1), people (with consent), headquarters, dated historical photos
- [ ] Fleet reference for the 3D tanker, if it should be refined: cab/trailer configurations, livery artwork files
- [ ] Hero 3D models (docs/hero-3d-models.md §2): confirm the Higgsfield licence terms for commercial use, and the
  client's consent to their fleet photos having been used as generation references
- [ ] **Documents**: current concession decision (PDF), current KRS extract, published tax-strategy information;
      optionally current ZUS/US no-arrears certificates (they expire quickly — decide who keeps them fresh)

---

## 4. Legal and privacy (client's legal adviser) 🤖

Nothing on the site is final legal text. Until these arrive, forms show only the controller's identity.

- [ ] **Privacy policy** → `content/legal/polityka-prywatnosci.md`, then set `privacyPolicyApproved` in `src/data/legal.ts` 🤖
- [ ] Information clause for the **order / quote form** (B2B contact persons) → `legal.orderFormNotice` 🤖
- [ ] Information clause for the **contact form** → `legal.contactFormNotice` 🤖
- [ ] **Recruitment notice** (the old clause cited the repealed 1997 Act and the struck-off sp.k. — not reused) →
      `legal.recruitmentNotice` 🤖
- [ ] Approve the order-form wording: "Formularz to zapytanie, a nie wiążące zamówienie. Cenę, ilość i termin dostawy
      potwierdza dział sprzedaży."
- [ ] Cookie/analytics decision (D5) reflected in the policy
- [ ] Check whether an accessibility statement is required for EXOIL

Details: [`legal-launch-requirements.md`](./legal-launch-requirements.md).

---

## 5. Technical setup (web team + domain admin)

**E-mail delivery for forms** 🤖
- [ ] W: create a Resend account (or the client's), add the sending domain (e.g. `formularze@exoil.pl`)
- [ ] D: add the SPF/DKIM DNS records Resend shows — **without touching the existing MX records** (mail runs via
      `mx.symbioza.net`)
- [ ] W: set in Vercel (Production): `RESEND_API_KEY`, `FORMS_FROM_EMAIL`, `ORDER_TO_EMAIL`, `CONTACT_TO_EMAIL`
      (+ `CONTACT_TO_EMAIL_SALES/LOGISTICS/ACCOUNTING/STATIONS` if departments want separate inboxes), `CAREERS_TO_EMAIL`,
      `RATE_LIMIT_SALT` — role addresses only, never personal ones
- [ ] W: send every form once from the deployment; check delivery, reply-to and subjects

**Content switch**
- [ ] W: apply all confirmations from sections 2–4 in `src/data/*.ts`, add documents to `public/documents/`, replace
      logo and photos
- [ ] W: anything the client does not confirm is removed from `src/data/*.ts` or reworded — never launched unconfirmed
- [ ] W+K: final walk-through of the build that will go live

**Checks before DNS** (on the Vercel deployment)
- [ ] `npm run typecheck && npm run lint && npm run test && npm run build`
- [ ] `npm run launch-check` — must pass completely 🤖
- [ ] `node scripts/check-redirects.mjs https://exoil.vercel.app` — every old WordPress URL answers 308/410, never 404

---

## 6. Launch day

1. W: in Vercel → Project → Domains add **`exoil.pl`** as the production domain and **`www.exoil.pl`** redirecting to
   it. Redeploy — the site now uses `https://exoil.pl` for canonicals and sitemap and becomes indexable automatically.
2. D: at the DNS provider change **only** the records Vercel shows (A for `exoil.pl`, CNAME for `www`). Keep MX,
   SPF/DKIM and the `portal.exoil.pl` record as they are.
3. D (optional, D8): point `exoil.co` to Vercel as a redirect domain.
4. W: after propagation run `node scripts/check-redirects.mjs https://exoil.pl`; open `https://exoil.pl/robots.txt`
   (must allow crawling and list the sitemap) and `https://exoil.pl/sitemap.xml`.
5. K/W: Google Search Console — verify the domain (DNS TXT), submit the sitemap; optionally Bing Webmaster Tools.
6. K: update the Google Business Profiles of the 7 stations so names, addresses, hours and phones match the site.
7. K: close or migrate the suspended cyberfolks hosting only after the new site is live (check nothing else — e.g.
   mailboxes — depends on it first).

Rollback: Vercel "Instant Rollback" to the previous deployment; DNS does not need to change for application issues.

---

## 7. First 30 days after launch

- [ ] W: check 404s daily in week 1 (Vercel logs, Search Console → Pages), then weekly; add a redirect for any
      meaningful old URL that appears
- [ ] W: check Core Web Vitals (field data) after ~28 days
- [ ] K: name an owner for keeping station hours/phones, documents and (if D7) news up to date
- [ ] K: when certificates or the tax strategy are renewed, send the new files — the site never shows expired
      documents as current

---

## Where the details live

| Topic | Document |
|---|---|
| What the old site said and where it came from | `historical-source-audit.md` |
| Status of every claim | `content-verification.md` |
| Stations | `stations-verification.md` |
| Figures | `business-metrics-verification.md` |
| Suppliers | `partners-verification.md` |
| Logo, photos, design tokens | `brand-assets.md` |
| Old → new URLs | `url-migration-map.md` |
| Legal | `legal-launch-requirements.md` |
| Vercel / environment | `vercel-deployment.md` |
| Full checklist | `migration-checklist.md` |
