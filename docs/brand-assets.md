# Brand assets

Audit date: 2026-09-19.

## 1. The logo — hard rule

The current EXOIL logo (black "EX" mark + red "oil" with a fuel drop over the "i") is used **exactly as recovered**.
It is not redrawn, traced, vectorised, recoloured, re-proportioned, animated by distortion or regenerated.
No vector original exists in the archive. **A vector original (SVG / EPS / PDF / AI) must be requested from the client
before launch** and will replace the raster files one-for-one.

Evidence that this is the current logo: it is on the 2023 fleet livery (four archived photos), on the 2018–2026 site
header, and on the favicon.

### 1.1 Recovered files

| File in repo | Origin | Pixels | Background | SHA-256 | Changes made |
|---|---|---|---|---|---|
| `public/brand/exoil-logo-archive-304-transparent-original.png` | `wp-content/uploads/2018/03/image001.png` (capture 2025-07-30) | 304×102 | transparent | `d600e748…c45b` | None (byte-identical) |
| `public/brand/exoil-logo-archive-512-original.png` | `wp-content/uploads/2018/06/cropped-logo-Exoil-na-fav.png` (capture 2025-07-30) | 512×512 | opaque white | `01ce6f83…450f` | None (byte-identical) |
| `public/brand/exoil-logo-on-white.png` | crop of the 512 px file, rows 160–352 | 512×192 | opaque white | `a60f341f…38c83` | **Canvas crop only** (white margin removed above and below). No pixel of the mark is altered. |

The 512 px file is the best available resolution (mark ≈ 498 × 168 px). It is used at ≤ 180 CSS px wide (≤ 360 device px
on 2× screens), so it stays sharp. It must not be enlarged beyond that.

### 1.2 Measured logo colours (from the recovered raster)

| Role | Hex | Share of opaque pixels (512 px file) |
|---|---|---|
| Logo black ("EX") | `#1F1A17` | 24 879 px (+ anti-aliasing) |
| Logo red ("oil", drop, triangle) | `#DA251D` | 20 254 px |

These are sRGB values measured from a web raster, not official brand specifications. The client should supply the
official colour references (CMYK / Pantone / RAL for livery). Until then they are used as the supporting palette anchors
but are **never applied to the logo itself** (the logo is always the image file).

### 1.3 Placement rules used in the build

- The logo always sits on a white (`#FFFFFF`) field, because the recovered file's black "EX" disappears on dark backgrounds.
  On dark "night" sections the logo appears on a white **plate** — the same way it appears on the white tank shell of the fleet.
- Minimum clear space around the mark: the height of the red drop (≈ 12 % of logo height) on all sides.
- Minimum size: 104 CSS px wide.
- The generated 3D tanker (docs/hero-3d-models.md) is built from references with all branding removed; it carries the
  logo only as the recovered transparent original (`exoil-logo-archive-304-transparent-original.png`, unmodified),
  laid onto the generated tank shell at runtime (rear part of the tank side, never mirrored, proportions kept along
  the curve; `tests/surface-decal.test.ts`, `tests/tanker-model.test.ts`). The procedural fallback tanker below keeps
  the on-white file.
- The procedural 3D tanker carries the logo as an unmodified texture on the white tank shell, placed where it is on the real
  semi-trailer (rear half of the tank side, below the top rail). The decal is a patch that follows the tank's elliptical
  curvature (rows spaced by arc length, so the logo's proportions are preserved) and is lit with the same material as the
  pure-white shell, so it reads as paint on the tank. The image is never altered; only scene lighting falls on it, as on
  the real vehicle. `tests/tanker-decal.test.ts` guards orientation (never mirrored) and proportions.
- **Not used:** tone-on-tone red version (`numery-350x200.jpg`) and the reversed cab-door version (EX dark / "oil" white on
  red, seen on vehicle photos) — both exist in the wild, but no approved digital files were recovered. Request them.

### 1.4 Obsolete marks (never use)

- 2001 tiger + "EXoil" badge (`gfx/logo.jpg`).
- 2013 blue "EXOIL" wordmark (`images/ex.jpg`).

## 2. Fleet livery reference (from 2023 photographs)

| Element | Observation |
|---|---|
| Cab | Red (DAF XF on the semi-trailer combination; DAF CF 450 rigid tanker). Logo on cab front and doors. |
| Tank | White, polished-aluminium-look shell, top walkway rail, 5 dome covers on the semi-trailer. |
| Super-graphic | A large black diagonal stroke with a red triangle below it — derived from the "X" in the logo. |
| Text | "SPRZEDAŻ PALIW", "tel. 519 310 310", "www.exoil.pl" in a heavy geometric sans. |
| Chassis | Black under-run, side-guard rail, 3 axles on the semi-trailer, 3 axles on the rigid. |
| Safety | Orange ADR plates **30 / 1202** (diesel), class-3 flammable and environment diamonds. |

The livery super-graphic is **not** recreated in the 3D model or on the site (it is a livery artwork, not a recovered
asset). Request livery artwork files if the client wants it used.

## 3. Photography

| File in repo | Origin | Pixels | Content | Status |
|---|---|---|---|---|
| `public/photos/fleet-semitrailer-side.jpg` | `2023/10/1-1903x500.jpg` | 1903×500 | DAF XF + Stokota 3-axle tanker semi-trailer, side | Interim — request full-res original + usage confirmation |
| `public/photos/fleet-rigid-side.jpg` | `2023/10/2-1903x500.jpg` | 1903×500 | DAF CF rigid tanker, side | Interim |
| `public/photos/fleet-semitrailer-front.jpg` | `2023/10/3-1903x500.jpg` | 1903×500 | XF + semi-trailer, front ¾ | Interim |
| `public/photos/fleet-rigid-road.jpg` | `2023/10/4-1903x500.jpg` | 1903×500 | CF rigid tanker on the road | Interim |
| `public/photos/history-iveco-tanker.jpg` | `2018/05/historia2-350x209.jpg` | 350×209 | Older Iveco tanker, sepia | Interim, small — used small on the history page only |

The archived photos are strips (3.8 : 1) at modest resolution; the layout uses them as full-bleed bands, not tall heroes.
They are registered in `src/data/media.ts` with status CLIENT_CONFIRMATION_REQUIRED: they are displayed, and `npm run launch-check` fails until the client confirms ownership/licence and that the pictured fleet is current.

## 4. Photography request list (client)

Priority order, full resolution, with confirmation of ownership/licence:

1. Current tankers: side profile (both configurations), front ¾, rear, top/aerial if available.
2. Loading at a fuel base (driver, loading arm/bottom loading, compartments).
3. A delivery at a customer site: hose, meter, driver with the SENT paperwork/tablet.
4. Each of the 7 stations: exterior, forecourt, shop interior, truck parking.
5. Customer double-wall tanks installed on site (if the offer is current).
6. People: drivers, dispatch/logistics, sales team, station staff (with consent).
7. The Chełm base / headquarters exterior.
8. Historical photos with dates (first station 1997, first tanker, etc.) for the history page.

## 5. Supporting design system (built around the logo, not replacing it)

| Token | Hex | Derivation |
|---|---|---|
| `--carbon` | `#1F1A17` | logo black |
| `--night` | `#121010` | deeper carbon for the night-logistics chapters |
| `--tank` | `#F2F2EF` | white tank shell under daylight — neutral, not cream |
| `--paper` | `#FFFFFF` | logo plate, forms |
| `--exoil-red` | `#DA251D` | logo red — used sparingly (CTA, route trace head, alerts) |
| `--steel` | `#8B9095` | brushed aluminium of the tank / walkways |
| `--steel-dark` | `#3B3F43` | chassis / under-run |
| `--adr` | `#F08A00` | ADR orange hazard plate → used only for data labels (the "plate" component) |

Typography (Google Fonts via `next/font`, self-hosted at build): **Archivo** (variable width axis; expanded heavy cuts
for display, echoing the livery lettering), **IBM Plex Sans** (body), **IBM Plex Mono** (tabular logistics data).
