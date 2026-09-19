# Content data

Every business fact on the site lives here once, wrapped in `fact(value, status, source)` from `src/lib/verification.ts`.
Pages call the getters (`getStations()`, `getServices()`, …), never raw arrays, so a CMS can replace a module later by
keeping the same function signatures.

| File | What | Who updates |
|---|---|---|
| `company.ts` | Legal entity, registry data, contacts per department | Office / management |
| `stations.ts` | Station registry (address, fuels, hours, phone, facilities) | Station manager |
| `station-helpers.ts` | Formatting helpers (no data) | — |
| `services.ts` | Business lines, whether each is offered | Management |
| `fuels.ts` | Fuel categories and grades | Sales |
| `terms.ts` | Commercial / delivery terms, tank specifications | Sales |
| `documents.ts` | Documents (type, date, validity, file) | Office |
| `metrics.ts` | Operational figures | Management |
| `history.ts` | Business history and legal timeline (kept separate) | Management |
| `partners.ts` | Suppliers / partners (never shown without approved wording) | Management |
| `legal.ts` | Approved privacy clauses | Legal adviser |
| `tracking.ts` | Analytics switches (all off) | Management + legal |

## Confirming a fact

Change its status to `VERIFIED_CURRENT` and put the confirmation in `source`, e.g.
`fact("519 310 310", "VERIFIED_CURRENT", "Potwierdzone przez klienta, e-mail 2026-10-02")`. Nothing else is needed:
every page, the footer, the sitemap and the structured data pick it up. Run `npm run test` and `npm run launch-check`.

## Documents

Put the PDF in `public/documents/` (lower-case, no spaces, e.g. `koncesja-opc-2025.pdf`) and set `href`,
`fileSize`, `issuedOn` and `validity` in `documents.ts`. Never replace a current document with an older one.

## Prices

There is no price data. If the client wants retail prices online, add one module (e.g. `prices.ts`) fed from a single
source (price feed or one editable file) with a timestamp per station and fuel, and render it only from that module —
never type prices into pages. B2B prices stay quote-based.

## News

Add `content/news/<slug>.md` (see `content/news/_TEMPLATE.md`). `/aktualnosci/` and the footer link appear automatically
with the first post; until then `/aktualnosci/` redirects to `/o-firmie/`.
