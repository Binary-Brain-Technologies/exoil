# Historical source audit — exoil.pl

Audit date: 2026-09-19
Scope: every archived route of `exoil.pl` (and related hosts) recoverable from the Internet Archive, plus current public registries used to cross-check historical claims.

> Archived content is **historical evidence**, not current business truth. Classification of each claim lives in
> [`content-verification.md`](./content-verification.md). This file records *what the old site said* and *where it came from*.

---

## 1. Method

| Step | What was done |
|---|---|
| Route discovery | Wayback CDX API: `url=exoil.pl/*` (collapse by URL key) and `matchType=domain` (all subdomains). 272 rows, of which ~45 are real content routes; the rest are WordPress internals, feeds, bot probes (`/.well-known/*`, `ads.txt`, `atom.xml`…) and theme assets. |
| Capture history | One CDX request per content route (status 200 only) to list every capture. |
| Download | Up to 8 evenly spaced captures per route (always first + last), fetched with the `id_` modifier (original bytes, no Wayback toolbar). Minimum 3 s between requests, back-off on 5xx/refused. Every response cached once under `.cache/wayback/raw/` (git-ignored) and never re-requested. |
| Change detection | Main content extracted to text per capture (`.cache/wayback/text/`) and diffed capture-to-capture. |
| Metadata | WordPress sitemaps (`wp-sitemap-*.xml`) give each page's **last-modified date** — the single most useful signal for how stale a claim is. `wp-json/wp/v2/pages/{id}` gives creation dates. |
| Media | Every image referenced by the recovered pages was requested once. Only images that the Archive actually captured could be recovered (see §5). |
| Live check | One `GET https://exoil.pl/` on 2026-09-19. |
| Cross-check | Official registries (KRS API of the Ministry of Justice, URE concession + infrastructure registries) and press, gathered 2026-09-19. Sources are listed in §7. |

Archive requests logged: 182 page/asset downloads + 45 CDX index queries + ~40 media requests (crawl finished 2026-09-19).

### Live site status (2026-09-19 15:44 UTC)

`https://exoil.pl/` answers **HTTP 200** from a LiteSpeed server, but the body is the hosting provider's
**"Strona Zawieszona"** page (cyberfolks: *"Konto na serwerze zostało zablokowane"*, account suspended). The old site is therefore not operational; search engines are currently seeing a soft-200 suspension page, which erodes the old URLs' ranking. `exoil.co` served identical content (mirror / old staging domain referenced in many image URLs). `portal.exoil.pl` is a separate remote-desktop login portal (TSplus-style), TLS certificate expired 2025-11-05 — not public website content.

---

## 2. Site generations found

| Period | Evidence | Summary |
|---|---|---|
| 2001–2003 | `http://www.exoil.pl/` captures 2001-04-17, 2003-10-17 | Placeholder "Strona w przygotowaniu", logo `gfx/logo.jpg` (tiger + "EXoil" wordmark), built by NET-LINE. **Obsolete logo.** |
| ~2013–2016 | capture 2016-01-12, `images/ex.jpg` (2013) | "Witamy na exoil.pl", e-mail `exoil@exoil.pl`. Banner with blue "EXOIL" wordmark and a nav for "informacje / giełda paliw / opinie o stacjach / forum / dostawcy / kontakt" — this looks like an unrelated fuel-portal template. **Obsolete branding; not the current logo.** |
| 2018-05 → 2026-06 | WordPress 6.5.x, Customizr theme, built by "Kwant Studio" (per news post 2018-05-04). Captures of most pages start 2023-11-30 and end 2026-06-15. | The site this rebuild replaces. Current logo in use. |

---

## 3. Route inventory (WordPress generation)

`Last modified` = WordPress sitemap `lastmod` (captured 2025-01-17). `Captures` = distinct 200-status captures in the CDX index.

| Old URL | Title / H1 | Created | Last modified | Captures (first → last) | Content type |
|---|---|---|---|---|---|
| `/` | "Exoil Paliwa – Detaliczna oraz hurtowa sprzedaż paliw" | 2018-05-04 | 2023-10-09 | 66 (2001 → 2026-06-15) | Slider (4 fleet photos) + excerpt grid |
| `/o-firmie/` | O firmie | — | 2018-06-08 | 8 (2023-11-30 → 2026-04-19) | Child-page grid, paginated `/o-firmie/page/2/` |
| `/o-firmie/historia/` | Historia | — | 2018-06-12 | 2 (2023-11) | 4 sentences |
| `/o-firmie/exoil-w-liczbach/` | Exoil w liczbach | — | **2018-06-08** | 8 (2023-11 → 2026-05-16) | 8 counters (see §4.3) |
| `/o-firmie/dokumenty/` | Dokumenty | — | 2024-01-08 | 8 (2023-11 → 2026-03-14) | WordPress Download Manager list |
| `/aktualnosci/` | Aktualności | 2018-05-21 | 2018-05-21 | 1 (2023-11-30) | 1 post |
| `/nasze-ceny/` | — | — | — | **0 — never existed** | Menu item "Nasze ceny" linked to `/oferta/stacje-paliw/` |
| `/oferta/` | Oferta | — | 2018-05-21 | 2 (2023-11) | Child-page grid, paginated `/oferta/page/2/` |
| `/oferta/hurt-paliw/` | Hurt paliw | — | 2023-10-30 | 9 (2023-11 → 2026-05-16) | Products, terms, suppliers, pickup bases, 6 supplier logos |
| `/oferta/stacje-paliw/` | Stacje paliw | — | 2024-06-13 | 9 (2023-11 → 2026-04-19) | Map (WP Google Map plugin) + 7 station cards |
| `/oferta/olej-opalowy/` | Olej opałowy | — | 2023-10-09 | 1 (2023-11-30) | Ekoterm distributor claim |
| `/oferta/zbiorniki/` | Zbiorniki | — | **2019-02-13** | 10 (2023-11 → 2026-04-19) | Double-wall tank specs |
| `/oferta/dostawy/` | Dostawy | — | 2023-10-30 | 9 (2023-11 → 2026-06-06) | Delivery terms |
| `/kariera/` | Kariera | — | 2023-09-13 | 10 (2023-11 → 2026-04-19) | Recruitment form + consent clause |
| `/kontakt/` | Kontakt | 2018-03-28 | 2024-05-27 | 12 (2023-11 → 2026-06-06) | Company data, departments, map |
| `/witamy-w-nowej-odslonie-naszej-strony-internetowej/` | Witamy w nowej odsłonie… | 2018-05-04 | 2018-05-07 | 8 | Only news post |
| `/download-category/dokumenty/` | Dokumenty (archive) | — | — | 6 | Download Manager taxonomy |
| `/download/koncesja-na-obrot-paliwami/` | Koncesja na obrót paliwami | 2018-05-08 | 2018-05-08 | 6 | 573.93 KB PDF, 230 downloads |
| `/download/krajowy-rejestr-sadowy-krs/` | Krajowy Rejestr Sądowy (KRS) | 2018-05-08 | 2023-09-13 | 6 | 62.60 KB PDF |
| `/download/numer-nip/` | Numer NIP | 2018-05-08 | 2018-05-08 | 6 | 426.33 KB PDF |
| `/download/numer-regon/` | Numer REGON | 2018-05-08 | 2018-05-08 | 7 | 569.13 KB PDF |
| `/download/zaswiadczenie-o-niezaleganiu-us/` | Zaświadczenie o niezaleganiu US | 2018-05-08 | 2018-05-08 | 6 | 631.09 KB PDF |
| `/download/zaswiadczenie-o-niezaleganiu-zus/` | Zaświadczenie o niezaleganiu ZUS | 2018-05-08 | 2018-05-08 | 4 | 175.21 KB PDF |
| `/download/strategia-podatkowa-2022/` | Strategia podatkowa 2022 | 2024-01-08 | 2024-01-08 | 2 (last 2024-12) | 159.47 KB; replaced by 2023 |
| `/download/strategia-podatkowa-2023/` | Strategia podatkowa 2023 | 2024-01-08 | 2024-12-31 | 6 | 159.47 KB DOCX |
| `/category/aktualnosci/`, `/category/glowna/`, `/tag/oferta/`, `/tag/o-firmie/`, `/2018/`, `/2018/05/`, `/2018/05/04/`, `/author/kwant/`, `/author/piotrb/`, `/page/2/`, `/page/3/`, `/3/` | WordPress archives | — | — | 1–10 each | Auto-generated listings, no unique content |
| `/feed/`, `/comments/feed/`, `wp-sitemap*.xml`, `wp-json/*`, `xmlrpc.php`, `wp-login.php`, `wp-admin/*` | System | — | — | — | No content value |

**Not captured / not recoverable:** the document PDF/DOCX files themselves (Download Manager served them via query-string download links that the Archive never stored); station photographs; delivery photographs `DSC_1075_1`, `DSC_1861_1`, `DSC_1883_1`; wholesale inline photos; tank product photos; the station service-icon set (`ikonki-01…16, 24h`); partner-logo files.

---

## 4. Content per page (latest capture, verbatim where material)

### 4.1 Global elements (all pages)

- Tagline: **"Detaliczna oraz hurtowa sprzedaż paliw"**.
- Main nav: O firmie (Historia, Exoil w liczbach, Dokumenty) · Aktualności · Nasze ceny → `/oferta/stacje-paliw/` · Oferta (Hurt paliw, Stacje paliw, Olej opałowy, Zbiorniki, Dostawy) · Kariera · Kontakt.
- Footer (2026-06-15 capture):
  > Exoil Paliwa Sp. z o.o. · ul. Okszowska 27, 22-100 Chełm · NIP 563 24 23 329 · REGON 061545019 · KRS 0001016528 · Sąd Rejonowy Lublin-Wschód w Lublinie z siedzibą w Świdniku · Kapitał zakładowy 7.205.000 PLN · **Zamówienia paliw 519 310 310** · biuro@exoil.pl
- Facebook "like box" iframe for page *Exoil-Paliwa-Sp-z-oo-Sp-K-1583514548609769* (old legal form in the page name).
- Tracking: no Google Analytics / GTM / Meta Pixel IDs found in the markup of the 2026-06 capture.
- Meta: `robots: max-image-preview:large`; no meta description; generator WordPress 6.5.8; favicon = square crop of the current logo.

### 4.2 Home `/`
Slider: four 1903×500 fleet photographs (see §5). Excerpt grid linking Dokumenty, Exoil w liczbach, Historia, Dostawy, Olej opałowy, Zbiorniki. Key excerpts:
- "Firma Exoil Paliwa jest dużym, pewnym i stabilnym dostawcą paliw. Działamy na rynku nieprzerwanie 24 godziny na dobę od 1997"
- "Proponujemy również darmowy transport paliw we wskazane miejsce (jednorazowe zamówienie nie mniej niż 500 litrów)."
- "Jesteśmy autoryzowanym dystrybutorem na terenie województwa lubelskiego Oleju Grzewczego Ekoterm w ramach sieci dystrybutorów firmy ORLEN"

### 4.3 EXOIL w liczbach `/o-firmie/exoil-w-liczbach/` (unchanged 2023-11 → 2026-05; last edited 2018-06-08)
| Value | Label (verbatim) |
|---|---|
| 5 | "jesteśmy dla Ciebie na … całodobowych stacjach paliw" |
| 20 | "codziennie od ponad … lat dostarczamy paliwa" |
| 2 000 000 | "rocznie pokonujemy około … kilometrów dowożąc paliwa" |
| 4 000 | "współpracuje z nami około … zadowolonych firm" |
| 70 | "nad ofertą firmy pracuje … doświadczonych pracowników" |
| 500 000 | "dokonujemy co roku ponad … transakcji sprzedaży" |
| 100 | "Akcjonariat firmy składa się w … procentach z polskiego kapitału" |
| 10 000 | "podczas negocjacji wypiliśmy ponad … kubków kawy" |

### 4.4 Historia `/o-firmie/historia/` (last edited 2018-06-12)
> Firma Exoil Paliwa jest dużym, pewnym i stabilnym dostawcą paliw. Działamy na rynku nieprzerwanie 24 godziny na dobę od 1997 roku.
> Od początku działalności zajmujemy się detaliczną oraz hurtową sprzedażą paliw. Co roku rozbudowujemy naszą ofertę w obydwu kanałach dystrybucji.
> Pomimo dużej skali działalności oferujemy rozwiązania wypracowane indywidualnie z każdym klientem oraz gwarantujemy konkurencyjność naszej oferty.
> Wspieramy Dom Dziecka w Dubience oraz wiele innych lokalnych akcji i zbiórek społecznych.

No dated milestones exist on the old site.

### 4.5 Dokumenty `/o-firmie/dokumenty/`
ZUS certificate (2018-05-08) · US certificate (2018-05-08) · KRS extract (created 2018-05-08, file replaced 2023-09-13) · REGON (2018-05-08) · NIP (2018-05-08) · Koncesja na obrót paliwami (2018-05-08) · Strategia podatkowa 2022 (2024-01-08, removed by 2025-02) → Strategia podatkowa 2023 (file updated 2024-12-31). Files not recoverable.

### 4.6 Hurt paliw `/oferta/hurt-paliw/` (last edited 2023-10-30; unchanged in all captures)
> Od początku naszej działalności oferujemy hurtową sprzedaż paliw płynnych. W swojej ofercie posiadamy:
> – Olej napędowy z bioestrem – Olej napędowy bez bioestra – Olej napędowy arktyczny (sezonowo) – Benzyny bezołowiowe PB 95 i PB 98 – Olej opałowy Ekoterm ORLEN
> Do zamówień podchodzimy bardzo indywidualnie, najmniejsze zamówienia hurtowe to już 500 litrów. Każdorazowo ustalamy z klientem formę płatności, cenę oraz termin darmowej dostawy. Istnieje możliwość rozliczania dostaw w temperaturze rzeczywistej lub temperaturze referencyjnej 15°C.
> Naszym głównym dostawcą jest firma ORLEN. Pozostali dostawcy to: Aramco, BP, Unimot, Total, Solumus.
> Zamówione paliwo mogą Państwo odebrać własnym transportem na: bazach paliw PERN: Emilianów, Małaszewicze, bazach paliw ORLEN: Lublin, Sokółka

Logos shown: ORLEN, Aramco, bp, Unimot, Total, Solumus (uploaded 2023-10).

### 4.7 Stacje paliw `/oferta/stacje-paliw/` (last edited 2024-06-13)
> Stacje Paliw Exoil proponują znacznie więcej niż tylko świetnej jakości paliwo. Oferujemy również: parkingi dla samochodów ciężarowych, dobrze zaopatrzone sklepy z szerokim asortymentem spożywczym, przekąski na ciepło oraz aromatyczną kawę.
> Na stacjach realizujemy detaliczną sprzedaż paliw dla klientów indywidualnych, instytucji państwowych oraz firm.

Seven station cards (full field-level history in [`stations-verification.md`](./stations-verification.md)): Okszowska (Chełm), Hutnicza (Chełm), Siedliszcze, Wierzbica, Siennica (Siennica Królewska Duża), Świdnik, Zamość. Each card had an unrendered `[arkusz id=N]` shortcode (a price-sheet plugin that no longer rendered — **no prices were ever visible in any capture**) and a row of service icons whose meaning cannot be recovered.

### 4.8 Olej opałowy `/oferta/olej-opalowy/` (last edited 2023-10-09)
> Jesteśmy autoryzowanym dystrybutorem na terenie województwa lubelskiego Oleju Grzewczego Ekoterm w ramach sieci dystrybutorów firmy ORLEN
> Olej opałowy to sprawdzony nośnik energii stosowany od wielu lat do ogrzewania suszarni, domów, ale także hal produkcyjnych. […]
> Olej opałowy dostarczamy bezpośrednio we wskazane przez Państwa miejsce, specjalnie przystosowanymi samochodami.

Logo: Ekoterm. Stock photo (fireplace + woollen socks).

### 4.9 Zbiorniki `/oferta/zbiorniki/` (last edited **2019-02-13**)
> Zbiorniki dwupłaszczowe sprzedawane przez naszą firmę to doskonałe rozwiązanie dla podmiotów o dużym zużyciu oleju napędowego. […] Szczególnie sprawdza się przy tankowaniu sprzętów wolnobieżnych.
> […] Istnieje możliwość podłączenia dodatkowych urządzeń umożliwiających odczyt danych on-line […] rozliczyć paliwo na kierowcę i na samochód. Dodatkowy osprzęt instalowany przez naszych partnerów pozwala na kontrolę stanu paliwa przez naszą Firmę co eliminuje potrzebę składania zamówień.
> Podstawowe wyposażenie to: pompa o wydajności około 56 l/min, wąż dystrybucyjny o długości 6 metrów, pistolet automatyczny, przepływomierz elektroniczny oraz filtr. […]
> Pojemności zbiorników to: 1500 l, 2500 l, 5000 l, 7500 l, 10000 l.
> Zbiorniki posiadają pozytywną opinię p.poż i OŚ, zatwierdzenie typu przez UDT. Gwarancja na szczelność zbiornika to 10 lat.
> Dla stałych klientów oferujemy możliwość wynajmu, warunki ustalamy indywidualnie.

### 4.10 Dostawy `/oferta/dostawy/` (last edited 2023-10-30)
> Proponujemy również darmowy transport paliw we wskazane miejsce (jednorazowe zamówienie nie mniej niż 500 litrów).
> Transport realizowany jest za pomocą autocystern o pojemnościach od 17 m³ do 35 m³, wyposażonych w nowoczesne systemy pomiarowe legalizowane przez GUM.
> Zamówienia realizujemy w przeciągu maksymalnie 24 godzin od dnia złożenia zamówienia (nie licząc weekendów).
> Każdorazowa dostawa jest zgłaszana do systemu SENT, możliwe jest uproszczenie procedury odbioru paliwa poprzez złożenie pełnomocnictwa do zamykania zgłoszeń, potwierdzenie odbioru jest wówczas wysyłane na adres e-mail wskazany przez Państwa.

### 4.11 Kariera `/kariera/` (last edited 2023-09-13)
> Exoil Paliwa zatrudnia ponad 100 osób o różnym wykształceniu i doświadczeniu zawodowym. Zespół ten tworzą: pracownicy administracyjni w siedzibie firmy, przedstawiciele handlowi, kierowcy cystern, mechanicy, przedstawiciele handlowi oraz pracownicy stacji paliw Exoil.

Form: imię i nazwisko*, e-mail*, telefon, CV, list motywacyjny, wiadomość. Consent cites the **repealed** *ustawa z 29 sierpnia 1997 r. o ochronie danych osobowych*, names the administrator as **Exoil Paliwa sp. z o.o. sp.k.** (entity struck off in 2023) and gives contact **praca@exoil.co**, retention 5 years. → must not be migrated.

### 4.12 Kontakt `/kontakt/` (last edited 2024-05-27)
Company block as footer + bank account "Bank Polskiej Spółdzielczości: 14 1930 1725 2520 0573 6786 0001". Departments:
- Dział sprzedaży: 519 310 310 · 519 310 572 · 725 045 045 · 724 724 564 · 519 303 199 · biuro@exoil.pl
- Dział logistyki: 577 871 787 · zakupy@exoil.pl
- Księgowość: 725 106 090 · finanse@exoil.pl (until 2024-08 a landline 82 564 06 44 and a personal e-mail address)
- Kadry: 519 310 569 · a personal (named employee) e-mail address

Map info window still named **"Exoil Paliwa Sp. z o.o. Sp. K"**.

### 4.13 News
Single post, 2018-05-04, "Witamy w nowej odsłonie naszej strony internetowej" (announces the 2018 site by Kwant Studio; promises industry/price news that never followed). No other posts exist.

---

## 5. Media recovered

Stored in `.cache/wayback/assets/` (analysis cache, git-ignored). Copies used by the new site are listed in [`brand-assets.md`](./brand-assets.md).

| File | Size | What it shows | Real EXOIL operations? | Use |
|---|---|---|---|---|
| `2023/10/1-1903x500.jpg` | 1903×500 | Red DAF XF tractor + white 3-axle **Stokota** tanker semi-trailer, side profile against straw bales. Compartment markings 10 000 / 4 000 / 9 000 / 5 000 / 8 000 L. Livery: black "X" stroke + red triangle super-graphic, "SPRZEDAŻ PALIW", logo, "tel. 519 310 310 www.exoil.pl". ADR diamonds (class 3, environment). | **Yes** | Primary reference for 3D tanker + hero photography (pending full-res originals) |
| `2023/10/2-1903x500.jpg` | 1903×500 | Red DAF CF 450 **rigid tanker** (3 axles), same livery. Logo on the red cab door in a reversed version (EX dark, "oil" white). | **Yes** | Photography; evidence of rigid-tanker fleet |
| `2023/10/3-1903x500.jpg` | 1903×500 | Same XF + semi-trailer, front ¾. Orange ADR plate **30 / 1202** (diesel). | **Yes** | Photography |
| `2023/10/4-1903x500.jpg` | 1903×500 | DAF CF rigid tanker in motion (panning shot). ADR 30/1202. Logo on cab front. | **Yes** | Photography |
| `2018/05/dostawy-350x200.jpg` | 350×200 | DAF CF rigid tanker, ¾ front. | Yes | Thumbnail only (too small) |
| `2018/05/historia2-350x209.jpg` | 350×209 | Sepia photo of an older **Iveco** tanker truck. | Yes (historic fleet) | History page, small |
| `2018/06/numery-350x200.jpg` | 350×200 | Tone-on-tone red logo with lottery balls. | Brand graphic | Do not use (logo recolour not approved for new use) |
| `2018/06/dokumenty-350x200.jpg` | 350×200 | Hand holding a phone with a download icon. | Stock | Remove |
| `2018/06/olej-opalowy-350x200.jpg` | 350×200 | Fireplace + woollen socks. | Stock | Remove |
| `2018/06/zbiorniki-350x200.jpg` | 350×200 | Grey double-wall tanks (red/yellow lids) on paving. | Likely manufacturer product photo | Rights unknown → do not use |
| `2018/03/image001.png` | 304×102 RGBA | **Current logo**, transparent background. | Brand | Header/footer (see brand doc) |
| `2018/06/cropped-logo-Exoil-na-fav.png` | 512×512 | **Current logo** on white, square canvas (favicon source). | Brand | Highest-resolution archived logo |
| `gfx/logo.jpg` (2001) | 125×106 | Old tiger logo. | Obsolete | Historical reference only |
| `images/ex.jpg` (2013) | 998×411 | Blue "EXOIL" wordmark banner with stock pump photos. | Obsolete | Historical reference only |

Photographs of stations, loading, drivers, staff and customer installations: **none recoverable**.

---

## 6. Structural and SEO observations

- Offer URLs lived under `/oferta/…`; company pages under `/o-firmie/…`. No meta descriptions, no structured data, no hreflang.
- Duplicate thin archives (`/category/*`, `/tag/*`, `/author/*`, date archives, `/page/N/`, `/3/`) were indexable.
- The "Nasze ceny" item promised prices but pointed to the stations page where the price shortcode no longer rendered: a broken promise to visitors.
- Many internal image URLs point at `www.exoil.co` (mixed http/https), i.e. the old staging domain leaked into production content.

---

## 7. Current authoritative sources consulted (2026-09-19)

| Source | What it confirms |
|---|---|
| KRS API, *odpis aktualny/pełny* 0001016528 (state as of 2026-07-10) — `https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/0001016528?rejestr=P&format=json` | Name, address, NIP 5632423329, REGON 061545019, share capital 7 205 000,00 PLN, registration 30.01.2023 by transformation (19.12.2022) of Exoil Paliwa sp. z o.o. sp.k. (KRS 0000458124); main PKD 47.30.Z, also 46.81.Z; financial statements filed for 2023, 2024, 2025. |
| KRS 0000458124 (full extract) | Predecessor sp.k. registered 11.04.2013, struck off 2023 on transformation. |
| KRS 0000009048 (full extract) | Earlier, **separate** legal entity "EXOIL Sprzedaż Paliw Bałabasz – Budzyński – Misiurski" sp.j. (later EXOIL Budzyński Misiurski sp.j.), NIP 5631628561, registered 24.04.2001 by transforming the civil partnership "Przedsiębiorstwo Wielobranżowe EXOIL – Stacja Paliw"; dissolved 14.12.2016, struck off 13.01.2017. |
| URE fuel-concession registry — `https://api.ure.gov.pl/api/ConcessionFuel` | Concession **OPC/12090/22487/W/OLB/2013/AGo** (DKN 22487), issued 2013-06-06, valid 2013-06-10 → **2030-12-31**, holder EXOIL PALIWA sp. z o.o.; last amendment OLB.4113.82.2025.DŚ of 17.01.2025. Scope: petrol, diesel, LPG, light heating oil; trade via stations, brokerage and **own road tankers**. |
| URE station infrastructure registry — `https://api.ure.gov.pl/api/InfrastructureFuelStation` | 7 station sites (see stations doc). |
| URE transport infrastructure registry — `https://api.ure.gov.pl/api/InfrastructureTransport` | 27 registered road-tanker entries + 3 subcontracted carriers (entries may count tractors and trailers separately). |
| kronikatygodnia.pl "Perły Biznesu 2024" (11.08.2024) and "2025" (22.08.2025) | Start in 1997 leasing a station without a tanker; 70 employees; 6 towns (2024) incl. "Lublin", 7 towns (2025) incl. Świdnik. Reads as sponsored content. |
| lublin112.pl (01.02.2026) | Świdnik (Piasecka) and Zamość (Zagłoby) stations passed 2025 fuel-quality inspections. |
| ekoterm.pl distributor page `…/punkty-sprzedazy/exoil-paliwa-sp-z-o-o/` | Listing exists; could not be fetched directly (firewall). |

Registry facts about named individuals (board members, proxies) were seen but are intentionally **not** reproduced anywhere in the project.
