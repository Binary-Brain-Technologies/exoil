# Stations verification

Audit date: 2026-09-19.

Sources:
- **URE** = URE fuel-station infrastructure registry, `https://api.ure.gov.pl/api/InfrastructureFuelStation`, filtered to concession DKN 22487 / NIP 5632423329, read 2026-09-19 (cached `.cache/ure-stations.json`). Authoritative, current.
- **OLD** = archived `/oferta/stacje-paliw/` (last edited 2024-06-13; captures 2023-11-30 → 2026-04-19).
- **PRESS** = kronikatygodnia.pl 11.08.2024 and 22.08.2025; lublin112.pl 01.02.2026.

The canonical registry is `src/data/stations.ts`. Every page that mentions a station (index, detail, homepage network,
footer, structured data, sitemap) reads from it. The station **count is never typed anywhere** — it is derived.

## 1. Network size

| Source | Date | Count | Notes |
|---|---|---|---|
| OLD "Exoil w liczbach" | edited 2018-06-08 | "5 całodobowych stacji" | 2018 figure. Also consistent with 2024–2026 if read literally: exactly five stations were labelled "Czynne całą dobę" (open 24 h) on the stations page. |
| OLD stations page | 2023-11 → 2026-04 | 7 station cards | Świdnik and Zamość present already on 2023-11-30 |
| PRESS kronikatygodnia | 2024-08-11 | 6 towns: Chełm, Wierzbica, Siedliszcze, **Lublin**, Siennica Królewska Duża, Zamość | "Lublin" matches no registry address — probably the Świdnik site near Lublin (unverified) |
| PRESS kronikatygodnia | 2025-08-22 | 7 towns (adds Świdnik) | |
| **URE registry** | 2026-09-19 | **7 sites** | Authoritative |

**Decision:** the network is rendered from the 7 URE-registered sites. No station count is stated in copy; the number
shown on the homepage is `stations.length` of published stations.

## 2. Per-station matrix

Legend: ✅ VERIFIED_CURRENT · ❓ CLIENT_CONFIRMATION_REQUIRED · ⚠️ CONFLICTING · ✖ OUTDATED

### 2.1 Chełm — ul. Okszowska 27 (`chelm-okszowska`)
| Field | Value | Source | Status |
|---|---|---|---|
| Address | ul. Okszowska 27, 22-100 Chełm | URE, OLD | ✅ |
| Fuels | petrol, diesel, LPG | URE flags | ✅ (categories). Grades ❓ |
| Tanks registered | 5 tanks, 100.7 m³ | URE | ✅ (internal only, not published) |
| Phone | 519 310 573 | OLD 2023–2026 | ❓ |
| E-mail | okszowska@exoil.pl (2023: okszowska@exoil.co) | OLD | ❓ |
| Hours | "Czynne całą dobę" | OLD 2024-12 → 2026-04 | ❓ |
| Facilities | icon codes 13,14,16,04,12,15,07,11,06,01,24h (meaning unrecoverable) | OLD | ❓ |
| Coordinates | 51.145203, 23.481168 | OLD map plugin | ❓ (used only for the schematic network diagram, never in schema.org) |
| Old photo | `2018/06/okrzowska.jpg` | not archived | — |

### 2.2 Chełm — ul. Hutnicza (`chelm-hutnicza`)
| Field | Value | Source | Status |
|---|---|---|---|
| Address | **ul. Hutnicza 19** (URE) vs **ul. Hutnicza 3** (OLD, concession PDF 2025) | URE vs OLD | ⚠️ — published as "ul. Hutnicza, 22-100 Chełm" without a number until the client confirms |
| Fuels | petrol, diesel | URE | ✅ |
| Phone / e-mail | 519 303 195 · hutnicza@exoil.pl | OLD | ❓ |
| Hours | "Czynne całą dobę" | OLD | ❓ |
| Facilities | icons 13,14,04,11,06,01,24h | OLD | ❓ |
| Coordinates | 51.1464108, 23.495686 | OLD | ❓ |

### 2.3 Siedliszcze — ul. Chełmska 2 (`siedliszcze`)
| Field | Value | Source | Status |
|---|---|---|---|
| Address | ul. Chełmska 2, 22-130 Siedliszcze | URE, OLD | ✅ |
| Fuels | petrol, diesel (bottled LPG per concession PDF) | URE / research | ✅ petrol+diesel; ❓ bottled LPG |
| Phone / e-mail | 519 310 577 · siedliszcze@exoil.pl | OLD | ❓ |
| Hours | "Czynne całą dobę" | OLD | ❓ |
| Facilities | icons 13,14,04,12,15,03,07,11,05,06,01,02,24h | OLD | ❓ |
| Coordinates | 51.1763048, 23.1783423 | OLD | ❓ |

### 2.4 Wierzbica — ul. Chełmska 25 (`wierzbica`)
| Field | Value | Source | Status |
|---|---|---|---|
| Address | ul. Chełmska 25, 22-150 Wierzbica (URE has no street name, only "25") | URE, OLD | ✅ (street name from OLD; ❓ confirm) |
| Fuels | petrol, diesel, LPG | URE | ✅ |
| Phone | 575 660 076 (2024→) ; 500 163 000 (2023) | OLD | ❓ / ✖ |
| E-mail | wierzbica@exoil.pl | OLD | ❓ |
| Hours | "Czynne całą dobę" | OLD | ❓ |
| Facilities | icons 13,14,16,12,07,10,09,08,11,06,24h | OLD | ❓ |
| Coordinates | 51.2577536, 23.31137 | OLD | ❓ |

### 2.5 Siennica Królewska Duża 130 (`siennica-krolewska-duza`)
| Field | Value | Source | Status |
|---|---|---|---|
| Address | Siennica Królewska Duża 130, 22-304 Siennica Różana | URE, OLD | ✅ |
| Fuels | petrol, diesel, LPG | URE | ✅ |
| Phone | 723 403 407 (2024→) ; 724 724 254 (2023) | OLD | ❓ / ✖ |
| E-mail | siennica@exoil.pl | OLD | ❓ |
| Hours | "Czynne całą dobę" | OLD | ❓ |
| Facilities | icons 13,14,16,12,15,11,06,24h | OLD | ❓ |
| Coordinates | 50.9940028, 23.259864 | OLD | ❓ |

### 2.6 Świdnik — ul. Piasecka 20 (`swidnik-piasecka`)
| Field | Value | Source | Status |
|---|---|---|---|
| Address | ul. Piasecka 20, 21-040 Świdnik | URE, OLD, PRESS 2026 | ✅ |
| Fuels | petrol, diesel (1 tank, 50 m³ — likely a multi-chamber tank or container station) | URE | ✅ categories |
| Phone / e-mail | none on OLD | — | ❓ |
| Hours | none stated on OLD (24h icon present) | OLD | ❓ |
| Facilities | icons 13,14,09,11,01,24h | OLD | ❓ |
| Coordinates | 51.2116337, 22.6463495 | OLD | ❓ |
| Other | Passed 2025 fuel-quality inspection | PRESS lublin112 2026-02-01 | MEDIUM — not published |

### 2.7 Zamość — ul. Zagłoby 10 (`zamosc-zagloby`)
| Field | Value | Source | Status |
|---|---|---|---|
| Address | ul. Zagłoby 10, 22-400 Zamość | URE, OLD, PRESS 2026 | ✅ |
| Fuels | petrol, diesel (bottled LPG per concession PDF) | URE | ✅ petrol+diesel |
| Phone | 575 733 883 | OLD | ❓ |
| Hours | Mon–Sat 06:00–22:00, Sun 09:00–17:00 | OLD 2024-12 → 2026-04 | ❓ (never publish without confirmation — this is the only station with specific hours, so staleness is most likely) |
| Facilities | icons 13,14,04,12,15 | OLD | ❓ |
| Coordinates | 50.7299129, 23.2714769 | OLD | ❓ |

## 3. Facilities (station services)

OLD described the network as offering "parkingi dla samochodów ciężarowych, dobrze zaopatrzone sklepy z szerokim
asortymentem spożywczym, przekąski na ciepło oraz aromatyczną kawę" (status ❓), and each station carried a set of
icons `ikonki-01 … ikonki-16` + `ikonki-24h`. The icon images were never archived and have no alt text, so **the meaning
of each code cannot be recovered**. The data model has typed facility flags (`truckParking`, `shop`, `hotFood`,
`coffee`, `carWash`, `toilets`, `adBlue`, `lpg`, `cards`, `fleetCards`, `open24h`), all empty until the client fills them.

**Client question:** please send the legend of the old icon set, or tick facilities per station in the attached form.

## 4. Prices

No archived capture ever displayed prices (the `[arkusz id=N]` price-sheet shortcode was not rendering). There is no price
data to migrate. If the client wants retail prices online, see `src/data/README.md` → *Prices*: a single price feed
per station with a timestamp, never typed into pages.

## 5. Coordinates

The archived map coordinates are unconfirmed. The code only ever uses `townPosition()` (rounded to 0.01°, ~1 km) for the
schematic network map and for ordering stations by distance; precise values are never rendered, sent to the browser or
emitted in structured data.

## 6. Structured data rules

`GasStation` JSON-LD is emitted per station **only** for fields with status ✅. `geo`, `openingHoursSpecification`,
`telephone` and `amenityFeature` are omitted until confirmed. No `aggregateRating`, no `priceRange`.

## 7. Questions for the client (stations)

1. Are all seven sites currently open to the public under the EXOIL name? Any closures, openings or rebrands?
2. Hutnicza: house number 3 or 19?
3. "Lublin" in the 2024 press article: which site was meant?
4. Opening hours per station (24 h or specific).
5. Station phone numbers and e-mail addresses to publish.
6. Facilities per station (legend for the old icons).
7. Fuel grades per station (e.g. PB95/PB98/ON/ON premium/LPG/AdBlue).
8. Exact coordinates of each forecourt entrance (for maps and schema).
9. Current photographs of each station (exterior, forecourt, shop).
10. Fleet/fuel-card acceptance per station.
