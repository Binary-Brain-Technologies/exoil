# Business metrics verification

Audit date: 2026-09-19. Rule: **no metric enters production without verification** (brief §29, §67–68).

The canonical source is `src/data/metrics.ts`. Each metric has `value`, `status`, `source`, `asOf`. The homepage
"SCALE" chapter and any statistics block render only metrics whose status is `VERIFIED_CURRENT`. If none are verified the
chapter falls back to registry-derived facts (station count derived from the station registry, concession validity).

## 1. Metrics from the old site

All from `/o-firmie/exoil-w-liczbach/`, **last edited 2018-06-08**, unchanged through 2026-05.

| Metric (old wording) | Old value | Other evidence | Status | Notes / question |
|---|---|---|---|---|
| "całodobowych stacjach paliw" | 5 | 7 stations on stations page (2023→); 7 URE sites (2026); 5 of 7 labelled 24 h | CONFLICTING | Replaced by derived station count. Ask whether all 7 are 24 h. |
| "od ponad … lat dostarczamy paliwa" | 20 (in 2018) | origin 1997 (old site, press) | OUTDATED | If 1997 is confirmed, years are computed from the founding year at build time — never typed. |
| "rocznie pokonujemy około … kilometrów" | 2 000 000 | none | OUTDATED (2018) | Needs current fleet mileage. |
| "współpracuje z nami około … firm" | 4 000 | none | OUTDATED (2018) | Needs current count of active B2B customers + definition (e.g. invoiced in last 12 months). |
| "doświadczonych pracowników" | 70 | press 2024 & 2025: 70; careers page 2023: "ponad 100 osób" | CONFLICTING | Do not choose. Ask for current headcount (incl. or excl. station staff/contractors). |
| "transakcji sprzedaży rocznie" | 500 000 | none | OUTDATED (2018) | Needs current annual transactions (retail + B2B?). |
| "% polskiego kapitału" | 100 | KRS: two individual shareholders (names not reproduced) | CLIENT_CONFIRMATION_REQUIRED | Plausible; wording to approve. |
| "kubków kawy" | 10 000 | — | REMOVE | Joke metric; inconsistent with the new tone. |

## 2. Other operational figures

| Figure | Value | Source | Status |
|---|---|---|---|
| Tanker capacity range | 17–35 m³ | old delivery page 2023-10 | CONFLICTING — a 2023 photo shows a semi-trailer with compartments summing to 36 000 l |
| Largest photographed semi-trailer | 5 compartments: 10 000 / 4 000 / 9 000 / 5 000 / 8 000 l | 2023 fleet photo | HISTORICAL_ONLY (one vehicle, 2023). **Used only as illustrative geometry in the 3D model, never displayed as a number.** |
| Registered road tankers | 27 entries | URE transport registry 2026-09-19 | VERIFIED_CURRENT as a registry fact, but ambiguous (tractors and trailers may be listed separately) → **not published** until the client gives a fleet count |
| Subcontracted carriers | 3 | URE | Not published |
| Delivery time | ≤ 24 h excl. weekends | old delivery page | CLIENT_CONFIRMATION_REQUIRED |
| Free delivery threshold | 500 l | old pages | CLIENT_CONFIRMATION_REQUIRED |
| Minimum order | 500 l | old wholesale page | CLIENT_CONFIRMATION_REQUIRED |
| Tank capacities offered | 1 500 / 2 500 / 5 000 / 7 500 / 10 000 l | old tanks page 2019 | CLIENT_CONFIRMATION_REQUIRED |
| Tank pump rate / hose | ~56 l/min, 6 m | old tanks page 2019 | CLIENT_CONFIRMATION_REQUIRED |
| Tank tightness warranty | 10 years | old tanks page 2019 | CLIENT_CONFIRMATION_REQUIRED |
| Revenue / profit | various | aggregator snippets only | Not used |

## 3. Metrics that ARE publishable now (registry-derived)

| Metric | Value | Source | Where used |
|---|---|---|---|
| Stations in the URE registry under EXOIL's concession | derived: 7 | URE 2026-09-19 | Homepage network chapter, `/stacje/` |
| Fuel concession valid until | 31.12.2030 | URE | Trust chapter, `/o-firmie/dokumenty/` |
| Concession held since | 2013 (issued 06.06.2013) | URE | Trust chapter (as "koncesja od 2013 r.") |
| Share capital | 7 205 000,00 PLN | KRS | Footer / legal data only |

## 4. 3D and illustrative numbers

Loading counters and the tanker compartment readout in the 3D sequence are **illustrative UI**. They are labelled on
screen ("Wizualizacja — wartości poglądowe") and in the accessible description, and never use litre values that
could be read as company data. No kilometre counters, customer counters or delivery-time claims appear in the 3D scenes.

## 5. Questions for the client (metrics)

1. Current headcount (and whether to publish it).
2. Number of active B2B customers (definition + date).
3. Fleet: number of tankers (rigid / semi-trailer), capacity range, compartment counts.
4. Annual kilometres, deliveries or litres delivered — only if tracked and publishable.
5. Confirmation of 1997 as the business origin year and the preferred wording.
6. Delivery-time promise, minimum order, free-delivery threshold — current values and conditions.
