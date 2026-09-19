# Legal and privacy launch requirements

Status: **launch blocked until every item in §1 is supplied or approved by the client (and their legal adviser).**
Nothing in this repository is final legal language. Draft structures below are checklists, not advice.

## 1. Documents the client must supply / approve

| # | Item | Why | Where it plugs in | Status |
|---|---|---|---|---|
| L1 | Privacy policy (GDPR art. 13) covering: controller identity (Exoil Paliwa Sp. z o.o., KRS 0001016528), contact for data matters / DPO if appointed, purposes and legal bases for each form, recipients (hosting: Vercel Inc.; e-mail delivery provider), transfers outside the EEA and safeguards, retention periods, data-subject rights, right to complain to PUODO, cookies/local storage | Forms collect personal data | `content/legal/polityka-prywatnosci.md` → `/polityka-prywatnosci/` | Missing — page shows a "document in preparation" state and `launch-check` fails |
| L2 | Short information clause for the fuel order/quote form (B2B contact persons) | Art. 13 at collection time | `src/data/legal.ts` → `orderFormNotice` | Missing |
| L3 | Short information clause for the general contact form | Art. 13 | `src/data/legal.ts` → `contactFormNotice` | Missing |
| L4 | Recruitment privacy notice: controller, purpose (current recruitment; optionally future recruitments with separate consent), legal basis (art. 22¹ Labour Code for statutory data; consent for additional data), retention, rights | The old clause cited the repealed 1997 Act and the struck-off sp.k. — must not be reused | `src/data/legal.ts` → `recruitmentNotice` + optional consent text | Missing |
| L5 | Decision: accept CV uploads on the website or by e-mail only | Storage, retention and security obligations | `RECRUITMENT_UPLOADS_ENABLED` | Default **off** (see §3) |
| L6 | Cookie / analytics decision (see §4) | ePrivacy (Prawo telekomunikacyjne / PKE) | `src/data/tracking.ts` | Default: no analytics, no cookies |
| L7 | Legal notice data check: registry court name, share capital, KRS, NIP, REGON | Kodeks spółek handlowych art. 206 requires these on the company's website | `src/data/company.ts` | NIP/REGON/KRS/capital verified from KRS; court name to confirm |
| L8 | Wording for the order form's non-binding nature | Avoid creating an offer/contract online by accident | `/zamow-paliwo/` | Draft wording in code: "Zapytanie nie jest zamówieniem wiążącym. Cenę i termin potwierdza dział sprzedaży." — to approve |
| L9 | Accessibility statement (if EXOIL is subject to the Polish Accessibility Act / EAA for any consumer-facing e-service) | Legal check by client | — | Client/legal to decide |

## 2. Forms built — data minimisation

| Form | Fields (required*) | Sent to | Stored? |
|---|---|---|---|
| Order request `/zamow-paliwo/` | company*, NIP (optional, checksum-validated), contact person*, phone*, e-mail*, fuel*, quantity (l)*, delivery postcode + town*, delivery address, preferred date, message | `ORDER_TO_EMAIL` via Resend | No database. E-mail only. |
| Contact `/kontakt/` | topic* (sales / logistics / invoices / other), name*, e-mail*, phone, message* | per-topic env recipient | No |
| Careers `/kariera/` | name*, e-mail*, phone, role of interest, message*; CV only if L5 = yes | `CAREERS_TO_EMAIL` | No (see §3) |

All forms: server-side Zod validation, honeypot (bots get a fake success), a minimum-fill-time check for JavaScript clients
(answered with a neutral "send again", never a fake success; forms work without JavaScript), per-visitor rate limit
(5 per 10 minutes, failed deliveries do not count), no third-party scripts, no personal data in logs.

Until L2–L4 are supplied, forms show only the controller's identity (a registry fact) — not an information clause.

## 3. CV uploads (disabled by default)

If the client enables uploads (`RECRUITMENT_UPLOADS_ENABLED=true`):

- Accepted: PDF only (magic bytes `%PDF` checked server-side, not just the extension/MIME), ≤ 5 MB, one file.
- The file is **not** written to any public location. Default transport: attached to the e-mail to `CAREERS_TO_EMAIL`
  (so it lands in the HR mailbox, which is already the system of record). No bucket is created.
- If the client wants storage instead of e-mail: a **private** Vercel Blob store (access: private) with retention job —
  documented in `docs/vercel-deployment.md`, not enabled.
- Retention period and deletion process: client to define in L4 (the site does not keep the file).

## 4. Tracking plan (decision required)

| Option | What it needs | Default |
|---|---|---|
| None | Nothing | **Current build** |
| Privacy-friendly, cookieless aggregate analytics (e.g. Vercel Web Analytics) | Mention in privacy policy; generally no consent banner if truly cookieless — legal to confirm | Off |
| Google Analytics / Ads, Meta Pixel, session recording | Consent management platform, consent mode, privacy policy update, DPA | **Not installed** (brief §60) |

Old site: no analytics tags were found in the 2026 capture; Facebook "like box" iframe was present (sets third-party
cookies) — **not migrated**. The Facebook page is linked as a plain link only, and only after the client confirms it.

## 5. Other checks

- Imagery: written confirmation that EXOIL owns or licences all photographs used (the archived fleet photos included).
- Trademarks: no third-party logos until permissions (see partners doc).
- Vehicle registration plates visible in fleet photos: acceptable (vehicle data, company-owned), but client may prefer to blur.
- Named employees: no personal names or personal e-mail addresses are published; role addresses only.
- Maps: the site does not embed Google Maps (no third-party requests); station pages link out to a map search.
