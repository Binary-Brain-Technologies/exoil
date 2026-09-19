# Content verification matrix

Audit date: 2026-09-19. Evidence: [`historical-source-audit.md`](./historical-source-audit.md).

## Statuses

| Status | Meaning | Rendered in production? |
|---|---|---|
| `VERIFIED_CURRENT` | Confirmed by an authoritative **current** source (official registry read on 2026-09-19) or by the client in writing. Source recorded. | Yes |
| `CLIENT_CONFIRMATION_REQUIRED` | Plausible and possibly still true, but only historical/secondary evidence exists. | **No** (visible only in review mode, marked) |
| `HISTORICAL_ONLY` | True for the past; may be told as history with its date, never as a present-tense claim. | Only as dated history, after client approval |
| `CONFLICTING` | Sources disagree. Nothing is chosen on the client's behalf. | **No** |
| `OUTDATED` | Known to be superseded. | No |
| `REMOVE` | Must not be migrated (legal risk, stock imagery, obsolete entities, personal data, jokes that date badly). | No |
| `SAFE_GENERAL_COPY` | Generic, non-factual description of a process or category that makes no measurable claim. | Yes |

### How this is enforced in code

Every business fact in `src/data/*.ts` is wrapped as `fact(value, status, source)` (`src/lib/verification.ts`).
Components never read raw values; they call `publishable(fact)` which returns the value only when the status is
`VERIFIED_CURRENT` **or** when the site runs in review mode (`CONTENT_MODE=review`), in which case the value renders
with a visible "Do weryfikacji" marker and the whole site is `noindex`. Production default (`CONTENT_MODE` unset or
`production`) renders only verified facts. Client sign-off = change the status and record the source (e.g.
`"Klient, e-mail 2026-10-02"`). There is no second copy of any fact anywhere in the codebase.

---

## A. Company and legal entity

| # | Claim | Evidence | Status | Decision |
|---|---|---|---|---|
| A1 | Legal name "Exoil Paliwa spółka z ograniczoną odpowiedzialnością" (display: Exoil Paliwa Sp. z o.o.) | KRS 0001016528, state 2026-07-10 | VERIFIED_CURRENT | Publish (footer, contact, Organization schema) |
| A2 | Seat/address ul. Okszowska 27, 22-100 Chełm | KRS | VERIFIED_CURRENT | Publish |
| A3 | NIP 563-242-33-29 | KRS | VERIFIED_CURRENT | Publish |
| A4 | REGON 061545019 | KRS | VERIFIED_CURRENT | Publish |
| A5 | KRS 0001016528 | KRS | VERIFIED_CURRENT | Publish |
| A6 | Share capital 7 205 000,00 PLN | KRS | VERIFIED_CURRENT | Publish (legally required on business correspondence incl. website) |
| A7 | Registry court "Sąd Rejonowy Lublin-Wschód w Lublinie z siedzibą w Świdniku" | Old site footer 2026-06 (field not present in the KRS API extract read on 2026-09-19) | CLIENT_CONFIRMATION_REQUIRED | Confirm with client / KRS extract before launch |
| A8 | Company registered in KRS 30.01.2023 by transformation of Exoil Paliwa Sp. z o.o. Sp.K. (KRS 0000458124, registered 11.04.2013) | KRS (both entities) | VERIFIED_CURRENT | May be used on the history page (legal timeline) |
| A9 | "Działamy … od 1997 roku" / business origin in 1997 | Old site (2018), kronikatygodnia 2024/2025 (sponsored), KRS 0000009048 shows the s.c. "EXOIL – Stacja Paliw" existed before 15.03.2001 | CLIENT_CONFIRMATION_REQUIRED | Only as "Historia EXOIL sięga 1997 roku" after client approval. Never "Exoil Paliwa Sp. z o.o. działa od 1997". |
| A10 | Continuity s.c. (≤2001) → sp.j. (2001–2017) → sp.k. (2013–2023) → sp. z o.o. (2023–) | KRS: sp.j. was a **different legal entity with a different NIP**, dissolved 2016; sp.k. was registered separately in 2013 | HISTORICAL_ONLY | History page may describe *business* continuity only in client-approved wording; no claim of legal succession between sp.j. and sp.k. |
| A11 | "24 godziny na dobę … nieprzerwanie od 1997" | Old site 2018 | CLIENT_CONFIRMATION_REQUIRED | Do not publish as-is |
| A12 | "dużym, pewnym i stabilnym dostawcą paliw" | Old site 2018 | REMOVE | Self-praise, unmeasurable |
| A13 | 100 % Polish capital | Old site 2018 (numbers page) | CLIENT_CONFIRMATION_REQUIRED | Shareholders in KRS are two natural persons (not reproduced) — plausible, but wording needs client approval |
| A14 | Bank account 14 1930 1725 2520 0573 6786 0001 (Bank Polskiej Spółdzielczości) | Old contact page 2024 | CLIENT_CONFIRMATION_REQUIRED | Do not publish until confirmed (payment-fraud risk if stale). Consider publishing only on invoices. |
| A15 | Social support: "Wspieramy Dom Dziecka w Dubience…" | Old history page 2018 | CLIENT_CONFIRMATION_REQUIRED | Needs current confirmation and consent from the institution |
| A16 | Football club partnership (Chełmianka Chełm) | Facebook posts, undated | CLIENT_CONFIRMATION_REQUIRED | Not published |
| A17 | Awards: Forbes Diamonds, Gazele Biznesu, "Perły Biznesu" | kronikatygodnia 2024/2025 | CLIENT_CONFIRMATION_REQUIRED | Publish only with year + certificate from client |
| A18 | Facebook page name "Exoil Paliwa Sp z oo – Sp K" | Facebook | OUTDATED | Link to profile only after client renames/approves |
| A19 | Board / proxies / shareholders (names) | KRS | — | Intentionally **not** published on the site (not required, personal data) |

## B. Services / business lines

| # | Claim | Evidence | Status | Decision |
|---|---|---|---|---|
| B1 | EXOIL sells fuel wholesale | URE concession (OPC, valid to 2030-12-31, amended 2025-01-17: trade incl. brokerage and own road tankers); PKD 46.81.Z; old site | VERIFIED_CURRENT | `/hurt-paliw/` published |
| B2 | EXOIL delivers fuel with its own road tankers | URE concession scope + URE transport registry (27 tanker entries) + 2023 fleet photos | VERIFIED_CURRENT | `/dostawy/` published |
| B3 | EXOIL operates retail fuel stations | URE station registry (7 sites), PKD 47.30.Z main activity, 2026 fuel-quality inspection report | VERIFIED_CURRENT | `/stacje/` published |
| B4 | Heating oil sale and delivery | Concession scope includes light heating oil (2025); Ekoterm distributor listing exists (undated) | VERIFIED_CURRENT (product licensed) / CLIENT_CONFIRMATION_REQUIRED (active retail offer, terms) | `/olej-opalowy/` published with licence-level copy only |
| B5 | "Autoryzowany dystrybutor Oleju Grzewczego Ekoterm (ORLEN) na terenie województwa lubelskiego" | Old site 2023-10; ekoterm.pl listing (not fetchable) | CLIENT_CONFIRMATION_REQUIRED | Not published; needs current ORLEN authorisation + permission to use the Ekoterm mark |
| B6 | Sale of double-wall customer tanks | Old page last edited **2019-02-13** | CLIENT_CONFIRMATION_REQUIRED | `/zbiorniki/` built but **disabled** until confirmed; old URL redirects to `/hurt-paliw/` while disabled |
| B7 | Tank rental for regular customers | Old page 2019 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| B8 | Tank online monitoring, per-driver/per-vehicle fuel accounting, auto-replenishment by EXOIL, "installed by our partners" | Old page 2019 | CLIENT_CONFIRMATION_REQUIRED | Hidden. Not visualised. The double-wall tank concept (labels, inner wall in 3D) appears only when the tanks service is enabled; otherwise the journey shows a plain customer tank. |
| B9 | Customer pickup from PERN bases (Emilianów, Małaszewicze) and ORLEN bases (Lublin, Sokółka) | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| B10 | Retail sales to "klientów indywidualnych, instytucji państwowych oraz firm" | Old site 2024 | CLIENT_CONFIRMATION_REQUIRED | Public-sector segment not mentioned until confirmed |
| B11 | Sales into Mazowieckie and Podkarpackie | kronikatygodnia 2024 | CLIENT_CONFIRMATION_REQUIRED | Delivery area not stated until confirmed |
| B12 | Segment pages (transport / agriculture / construction / industry) | No evidence of specialisation (only "sprzęty wolnobieżne" on tanks page) | — | **Not created** (brief §26: no thin pages) |

## C. Products

| # | Claim | Evidence | Status | Decision |
|---|---|---|---|---|
| C1 | Petrol (benzyny silnikowe) | URE concession scope 2025 | VERIFIED_CURRENT | Publish as category |
| C2 | Diesel (olej napędowy) | URE concession scope 2025; ADR 30/1202 plates in 2023 photos | VERIFIED_CURRENT | Publish as category |
| C3 | LPG (at stations) | URE concession scope + station registry | VERIFIED_CURRENT | Publish as station-retail category |
| C4 | Light heating oil | URE concession scope | VERIFIED_CURRENT | Publish as category |
| C5 | Diesel with bio-component / without bio-component | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| C6 | Arctic diesel (seasonal) | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| C7 | PB 95 and PB 98 as wholesale grades | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| C8 | "Olej opałowy Ekoterm ORLEN" as the heating-oil product | Old site | CLIENT_CONFIRMATION_REQUIRED | Hidden (trademark) |
| C9 | "świetnej jakości paliwo" | Old site | REMOVE | Replace with factual quality statements only when documented (e.g. inspection results) |

## D. Commercial terms

| # | Claim | Evidence | Status | Decision |
|---|---|---|---|---|
| D1 | Minimum wholesale order 500 l | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden; quantity field in the form has no minimum |
| D2 | Free delivery from 500 l (single order) | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| D3 | Delivery within max. 24 h excluding weekends | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| D4 | Settlement at actual temperature or reference 15 °C | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| D5 | Payment form and price agreed individually | Old site | SAFE_GENERAL_COPY (as "warunki ustalamy indywidualnie") — still confirm | Published as general copy |
| D6 | Every delivery reported to SENT; power of attorney for closing SENT notifications; e-mail receipt | Old site 2023-10; SENT reporting is a legal obligation for this product group | CLIENT_CONFIRMATION_REQUIRED (process detail) / SAFE_GENERAL_COPY ("dokumentujemy przewóz zgodnie z wymogami systemu SENT") | Only the general sentence is used on the site |
| D7 | Tanker meters legalised by GUM | Old site 2023-10 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| D8 | Tanker capacities 17–35 m³ | Old site 2023-10; one 2023 photo shows 36 000 l compartment markings (10+4+9+5+8 m³) | CONFLICTING | Not published |
| D9 | Retail discounts for loyal / corporate customers | kronikatygodnia 2025 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| D10 | Prices (retail/B2B) | Price shortcodes never rendered in any capture; no price data exists | — | No prices on the site. `/nasze-ceny/` never existed. Pricing stays quote-based. |

## E. Contacts

| # | Claim | Evidence | Status | Decision |
|---|---|---|---|---|
| E1 | Order line 519 310 310 | Old footer 2026-06, tanker livery 2023 | CLIENT_CONFIRMATION_REQUIRED | Hidden until confirmed (strong candidate) |
| E2 | Sales 519 310 572, 725 045 045, 724 724 564, 519 303 199 | Old contact 2024-05 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| E3 | biuro@exoil.pl | Old contact 2024-05 | CLIENT_CONFIRMATION_REQUIRED | Hidden; form recipients live in env vars |
| E4 | Logistics 577 871 787, zakupy@exoil.pl | Old contact 2024-05 | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| E5 | Accounting 725 106 090, finanse@exoil.pl | Old contact 2024-08 → | CLIENT_CONFIRMATION_REQUIRED | Hidden |
| E6 | Accounting landline 82 564 06 44 + personal e-mail | Old contact 2023-11 | OUTDATED | Remove |
| E7 | HR 519 310 569 + a named employee's e-mail | Old contact 2024-05 | CLIENT_CONFIRMATION_REQUIRED (phone) / REMOVE (personal e-mail; use a role address) | Hidden |
| E8 | praca@exoil.co, exoil@exoil.pl, *@exoil.co station e-mails | Old consent clause / 2016 site / 2023 station cards | OUTDATED | Remove |
| E9 | Station phones and e-mails | See stations doc | CLIENT_CONFIRMATION_REQUIRED | Hidden |

## F. Stations

Station **existence and street address** are VERIFIED_CURRENT from the URE station registry (2026-09-19), except the
Hutnicza house number (CONFLICTING: 3 vs 19). Opening hours, phones, e-mails, facilities, fuels per station and exact
coordinates are CLIENT_CONFIRMATION_REQUIRED. Full detail: [`stations-verification.md`](./stations-verification.md).

## G. Metrics

All eight counters of the old "Exoil w liczbach" page were last edited on 2018-06-08 → none may be published.
Full detail: [`business-metrics-verification.md`](./business-metrics-verification.md).

## H. Suppliers / partners

All supplier names and logos are CLIENT_CONFIRMATION_REQUIRED; no logo is used. Detail:
[`partners-verification.md`](./partners-verification.md).

## I. Documents

| # | Item | Evidence | Status | Decision |
|---|---|---|---|---|
| I1 | Fuel concession OPC/12090/22487/W/OLB/2013/AGo, valid to 2030-12-31, amended 2025-01-17 | URE registry | VERIFIED_CURRENT (registry data) | Publish number, validity, scope and a link to the public URE registry. The PDF itself is published only when the client supplies the current decision. |
| I2 | Archived "Koncesja" PDF (2018) | Old site | OUTDATED | Not migrated |
| I3 | KRS extract PDF (2023-09) | Old site | OUTDATED | Replace by a link to the official KRS search + client-supplied current extract |
| I4 | NIP / REGON PDFs (2018) | Old site; issued before the 2023 transformation | OUTDATED | Not migrated (numbers published as text from KRS) |
| I5 | ZUS / US no-arrears certificates (2018) | Old site | OUTDATED | Not migrated; such certificates are valid for a short period — client decides whether to publish current ones and how to keep them fresh |
| I6 | Tax strategy 2022 / 2023 | Old site | OUTDATED (2023) | Client to supply the current published tax-strategy information |

## J. Careers

| # | Claim | Evidence | Status | Decision |
|---|---|---|---|---|
| J1 | "zatrudnia ponad 100 osób" | Old careers page 2023-09 | CONFLICTING (vs 70) | Not published |
| J2 | Roles: administration, sales representatives, tanker drivers, mechanics, station staff | Old careers page 2023-09 | CLIENT_CONFIRMATION_REQUIRED (as current roles) / SAFE_GENERAL_COPY (as "types of work at EXOIL") | Shown as generic "gdzie pracujemy" only after confirmation |
| J3 | Recruitment consent clause (1997 act, sp.k. administrator, praca@exoil.co, 5 years) | Old careers page | REMOVE | Replaced by a placeholder that blocks launch until the client supplies a GDPR notice |
| J4 | Open vacancies | None found anywhere current | — | No `JobPosting` structured data; page says open applications only |

## K. Brand / media

| # | Item | Status | Decision |
|---|---|---|---|
| K1 | Current EXOIL logo (black "EX" + red "oil" with drop) | VERIFIED_CURRENT (in use on 2023 fleet livery and 2026 site) | Used unmodified — see brand doc |
| K2 | Tiger logo (2001), blue "EXOIL" wordmark (2013) | OUTDATED | Never used |
| K3 | Fleet photos 2023 (4 × 1903×500) | CLIENT_CONFIRMATION_REQUIRED (rights, still-current fleet) | Wired in via `src/data/media.ts`; rendered only in review mode until the client confirms rights (launch-check item). Full-resolution originals requested |
| K4 | Stock images (documents phone, fireplace/socks) | REMOVE | Not migrated |
| K5 | Tank product photos, partner logos | CLIENT_CONFIRMATION_REQUIRED (third-party rights) | Not used |
| K6 | "10 000 kubków kawy" counter | REMOVE | Not migrated |

## L. Copy written for the new site

All new copy is `SAFE_GENERAL_COPY` — it describes *how* fuel logistics works (order → loading → route → delivery →
documentation) without quantities, times, capacities or superlatives. Any sentence containing a number, a time promise,
a certification or a partner name must come from a `fact()` with its own status.
