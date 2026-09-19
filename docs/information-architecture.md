# Information architecture

## Routes

```
/                         Homepage — one continuous route: SOURCE → LOAD → ROUTE → DELIVER → STORE → POWER → NETWORK → TRUST → HISTORY → ORDER
├── hurt-paliw/           Flagship B2B: fuels, how ordering works, terms, documents, CTA
├── dostawy/              Logistics in practice: order → scheduling → loading → route → delivery → metering → paperwork (SENT)
├── stacje/               Station index: list + schematic network map + search by town, from src/data/stations.ts
│   └── [slug]/           7 station pages (address, fuels, hours, phone, map link, nearby stations)
├── olej-opalowy/         Heating oil (incl. Ekoterm distributor claim — to be confirmed before launch)
├── zbiorniki/            Customer tanks (offer to be confirmed before launch; can be switched off in services.ts)
├── o-firmie/             Company: what EXOIL is, legal data, links to history/documents
│   ├── historia/         Business history vs legal-entity timeline (separated)
│   └── dokumenty/        Current documents only (concession from URE registry; PDFs when supplied)
├── aktualnosci/          Appears only when content/news has at least one post
│   └── [slug]/
├── kariera/              Working at EXOIL + application form (no CV upload by default)
├── kontakt/              Routed contact: sales / logistics / invoices / stations / careers
├── zamow-paliwo/         B2B order request / quote form (not a binding order)
└── polityka-prywatnosci/ Client-supplied privacy policy (launch blocker)
```

Segment pages (`/dla-firm/[segment]/`) are **not** created: no evidence of segment specialisation (brief §26).

## Navigation

Header: **Hurt paliw · Dostawy · Stacje · O firmie · Kontakt** + primary CTA **Zamów paliwo**.
"Zbiorniki" and "Olej opałowy" join the header or the "Oferta" group automatically when their service status allows
(the nav is generated from `services.ts`). Utility: "Znajdź stację" inside the Stacje entry on mobile.

Footer groups: Oferta (derived from services) · Stacje (derived from stations) · Firma (O firmie, Historia, Dokumenty,
Kariera, Kontakt) · Legal block (company name, address, KRS, NIP, REGON, capital — from company.ts) · Polityka prywatności.

## Content model (single source of truth)

| File | Holds |
|---|---|
| `src/lib/verification.ts` | `fact()`, statuses, `publishable()` |
| `src/data/company.ts` | Legal entity, registry data, contacts by department |
| `src/data/stations.ts` | Station registry (URE-backed) |
| `src/data/fuels.ts` | Fuel categories and grades |
| `src/data/services.ts` | Business lines, enabled state, routes, nav labels |
| `src/data/documents.ts` | Documents with type, date, validity, file |
| `src/data/metrics.ts` | Metrics with status |
| `src/data/history.ts` | Business-history and legal-timeline entries |
| `src/data/partners.ts` | Suppliers/partners (render nothing until approved) |
| `src/data/legal.ts` | Form notices, privacy status |
| `content/news/*.md` | News posts (front-matter + Markdown) |

A headless CMS can replace any of these modules later by keeping the exported function signatures
(`getStations()`, `getServices()`, …) — pages never import raw arrays.

## Homepage chapters and the one route

| # | Chapter | Content (semantic HTML) | Visual (desktop / mobile / reduced motion) |
|---|---|---|---|
| 00 | SOURCE | H1 + what EXOIL does in one sentence + CTAs | 3D: night road, tanker lights approach / SVG tanker profile / static |
| 01 | LOAD | Fuel is loaded at a fuel base into compartments | 3D: loading gantry, compartments fill (illustrative, labelled) |
| 02 | ROUTE | Own tankers, dispatch, documentation in transit (SENT) | 3D: road, side-track camera, route trace |
| 03 | DELIVER | Delivery to the customer site, metered | 3D: arrival, hose connection, flow along the hose |
| 04 | STORE | Fuel goes into the customer's tank | 3D: tank cut-away (outer wall / inner tank) — generic, no telemetry |
| 05 | POWER | Fleets, machines, heating — what the fuel powers | Trace splits into three short branches (SVG) |
| 06 | NETWORK | The route expands into the station network | SVG schematic map; nodes = published stations |
| 07 | TRUST | Concession (URE), registry data, documents | Document "plates" |
| 08 | HISTORY | Business history (when approved) + legal timeline | Timeline along the route line |
| 09 | ORDER | Order request CTA + contact paths | Route ends at a destination pin |

The route line is a single SVG path running down the page from chapter 00 to 09 (the "signature").
The 3D canvas lives only inside the homepage's opening sequence (chapters 00–04) and is dynamically imported; no other
route loads Three.js.
