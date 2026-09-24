# Hero 3D models

Date: 2026-09-24. The homepage journey (`src/components/three/`) renders generated 3D models of the fleet and the
sites. The procedural models (`scene/tanker.ts`, `scene/world.ts`) stay as the fallback.

## 1. What is in the scene

| Model | File (`public/models/`) | Size | Triangles | Replaces |
|---|---|---|---|---|
| Tractor unit (red 4x2, high-roof sleeper cab) | `exoil-tractor.<hash>.glb` | ≈ 0.9 MB | 34k | procedural cab |
| Tank semi-trailer (white elliptical tank, 5 domes, 3 axles) | `exoil-trailer.<hash>.glb` | ≈ 1.0 MB | 36k | procedural trailer |
| Top-loading gantry (fuel base) | `fuel-gantry.<hash>.glb` | ≈ 1.1 MB | 41k | box gantry |
| Fuel-depot storage tank (used 3×, different sizes and headings) | `storage-tank.<hash>.glb` | ≈ 0.4 MB | 21k | cylinders |
| Customer yard tank (ladder, gauge, dispenser cabinet, skid) | `customer-tank.<hash>.glb` | ≈ 0.5 MB | 25k | cylinder |
| Customer warehouse hall | `customer-hall.<hash>.glb` | ≈ 0.3 MB | 9k | box hall |

Total ≈ 4.2 MB. `tests/hero-models.test.ts` enforces the budgets (≤ 1.3 MB per file, ≤ 6 MB in total) and the
compression (meshopt geometry, WebP textures).

Kept procedural on purpose: the rolling wheels, the logo decal, the loading arm, the delivery hose, the fuel-level
cut-away inside the customer tank and the road. These are the parts that move or that must be exact.

## 2. Provenance (Higgsfield, 2026-09-24)

1. **Reference images:** made with GPT Image 2.5, starting from the client's 2023 fleet photographs
   (`public/photos/fleet-semitrailer-side.jpg` and `fleet-semitrailer-front.jpg`, uploaded to Higgsfield as
   references). The prompt asked for **all branding to be removed**: logo, livery super-graphic, lettering, phone number,
   website, compartment labels, ADR plates, number plates and the manufacturer badge. The tractor was corrected to the
   real 4x2 axle layout. The props (gantry, storage tank, yard tank, hall) come from text-only prompts, also without
   text, logos or signage.
2. **3D:** Tripo H3.1 image-to-3D (textured, PBR). A Meshy multi-view variant of the tractor and of the trailer was
   also generated and rejected: an orange cast and softer detail on the tractor; the trailer was an acceptable
   second-best.

| Model | Reference image job | 3D job |
|---|---|---|
| Tractor | `b27ebc9c-1ad0-4a17-87b4-25621142a16f` | `46814f83-e7c1-4d62-991a-204d90cdb519` |
| Trailer | `d6f4a0b9-dc96-4225-b688-e28236a73ef3` | `2edacfa0-e629-4cf3-9db9-c044c4d2cbe3` |
| Gantry | `e35cd609-485d-4858-9563-93a79f2548c8` | `f0191411-7283-4f06-8378-872e24eae1b9` |
| Storage tank | `c2a9584f-1e56-4df8-bf40-03870e2b7087` | `7eee9ee6-623f-4b46-a86f-576156a5e4f6` |
| Customer tank | `7af90280-fa2a-4f5e-bcf2-c18a0001abe7` | `ac1756fc-8500-4120-9ac7-109da922e06d` |
| Hall | `8631698b-224e-4721-9ea0-ec9b30372c04` | `b13052ff-6c3a-4b3b-a9ac-28305bf7f168` |

**To confirm before launch:**

- The Higgsfield plan's licence terms for commercial use of generated assets.
- The client's consent to the fleet photographs being used as generation references. The photos themselves are
  still CLIENT_CONFIRMATION_REQUIRED in `src/data/media.ts`.

## 3. The logo rule (docs/brand-assets.md §1)

The generated models carry **no logo**: every reference image had it removed before the 3D step. On the tanker, the
logo is the recovered original `public/brand/exoil-logo-archive-304-transparent-original.png`, byte-identical and with
its own transparency. At runtime it is laid onto the generated tank shell (`scene/decal.ts`):

- Rays are cast from outside onto the shell.
- Rows are spaced by arc length, so the image keeps its proportions around the curve.
- It is never mirrored: seen from its own side, it always reads left to right.
- It sits on the rear part of the tank side, where it is on the real semi-trailer.

The transparent file is used because the generated shell is not pure `#FFFFFF`: the on-white file would show as a
rectangle. The procedural fallback tanker still uses `exoil-logo-on-white.png`. Tests: `tests/surface-decal.test.ts`
and `tests/tanker-model.test.ts`.

## 4. Build pipeline

```bash
node scripts/build-hero-models.mjs            # downloads the sources (cached in .cache/hero-models/) and builds
node scripts/build-hero-models.mjs --analyze  # prints the tyre bands used to place the wheel cut-outs
```

Per model the script:

1. Bakes a transform into the vertices: scene metres, +X forward, ground at y = 0. The tractor and trailer are
   pre-placed so the kingpin sits on the fifth wheel and the middle dome is at x = −3.4, the same as the procedural
   tanker, so the gantry stop is unchanged.
2. Cuts out the baked wheels of the vehicles; rotating procedural wheels replace them.
3. Decimates.
4. Re-encodes textures as WebP: colour at 2048 px for the vehicles and 1024 px for the props; normal and ORM maps at
   1024 px.
5. Quantises and meshopt-compresses the geometry.
6. Writes a content-hashed file name and `src/components/three/scene/hero-models.json`.

The build is deterministic: the same sources give the same hashes. Files are served with
`Cache-Control: public, max-age=31536000, immutable` (`next.config.ts`).

## 5. Loading and performance

- **Only capable desktops load the models.** Phones (the film of stills, §7), `prefers-reduced-motion` and `?no3d` download none.
- **Order:** the tanker (≈ 1.8 MB) is preloaded as soon as the page knows it will run WebGL, in parallel with the
  Three.js chunk. The site props download after it and swap in when they land; they are only reached after scrolling.
- **The scene starts** when the tanker has arrived, or 5.5 s after navigation at the latest. In the late case the
  procedural tanker is shown and the real one swaps in when it lands, which stays inside Journey's 8 s WebGL deadline.
- **Measured on a local production build:**

  | Connection | Scene shown | Real tanker | All models |
  |---|---|---|---|
  | 50 Mbit/s | 1.5 s | 1.5 s | 1.5 s |
  | 9 Mbit/s (fast 4G) | 3.4 s | 3.4 s | 4.5 s |
  | 3 Mbit/s | 6.4 s (procedural tanker) | 7.3 s | 13.2 s |

  Before staging, 3 Mbit/s fell back to the static diagram.
- **GPU cost:** textures ≈ 33 MB per vehicle (the raw generator output was ≈ 270 MB each). The scene has 86 visible
  meshes and about 236k triangles.
- **Frame time:** a full scripted scroll with bloom, grain and shadows on an Apple M4 Pro at 120 Hz measured 8.4 ms
  average and 9.3 ms p99. The same run at DPR 2 with 4× CPU throttling gave the same numbers, with 1 frame over 33 ms
  out of 955.
- **Render on demand is unchanged.** The loop stops when nothing moves. The adaptive step (average frame > 22 ms over
  90 frames) turns off post-processing, the beams and shadows, and lowers the pixel ratio.
- **Low detail** (≤ 4 cores or ≤ 4 GB): same models, no normal maps, no post-processing, no shadows.

## 6. Look ("night film")

- A bloom pass at half resolution, with a high threshold so only real light sources glow: head, tail and side-marker
  lights, work lights and the hose flow pulses.
- Additive headlight beams, film grain and a vignette (`scene/cinematic.ts`).
- A gradient night sky, with fog in its horizon colour.
- A low opening shot of the oncoming tanker, and an intro where exposure rises from darkness.

The beam shader guards against NaN: a single NaN pixel would be spread over the whole frame by the bloom pass, and
`tests/tanker-model.test.ts` checks every normal. QA switches: `?no3d` (static diagrams), `?nofx` (the 3D scene
without post-processing).

## 7. Mobile: the journey as a film of stills

Phones (and any viewport under 64rem) don't run WebGL. They get a sticky, full-bleed "film" behind the chapter text
(`src/components/home/JourneyFilm.tsx`): one still per chapter, rendered from the real 3D scene with the same models,
lighting and the real logo decal. The logo in the stills is the unmodified recovered image as the scene renders it,
never generated.

- **Motion:** chapters crossfade. Within a chapter the frame pushes in slowly with the scroll, using a transform on
  one layer, written from the existing ScrollTrigger. There is no WebGL and no per-frame layout.
- **Reduced motion:** plain swaps, no push-in.
- **Legibility:** a night scrim over the lower part of the frame, plus a soft vignette that travels with each chapter's
  text. The film grain is a static CSS tile, since grain baked into the images would bloat them.
- **Weight:** 5 × AVIF (WebP fallback) at 640 and 1080 px. At 1080 px the AVIFs are 17–35 KB each, ≈ 120 KB in
  total. The first frame is preloaded in the document head (phones only, `fetchpriority=high`) with a 12 px inline
  placeholder. The other frames get their sources only after `load`, so they don't compete with it.
- **Desktop downloads none of them:** every source carries a max-width media query.
- **Budgets and completeness:** checked by `tests/journey-stills.test.ts`.
- **Measured** on a phone profile (390 × 844 @3x, slow 4G at 1.6 Mbit/s, CPU slowed 4×):

  | Metric | Result |
  |---|---|
  | LCP (the first frame) | 1.8 s |
  | CLS | 0.076 (0.09 before this change; header font swap) |
  | Scrolling | 60 fps (16.7 ms average, p95 17.6 ms), no long tasks |
  | 3D model downloads | 0 |

  LCP is bound by the ≈ 280 KB of web fonts loading at the same time, not by the film.

**Re-rendering the stills** (e.g. after a scene change):

1. Run the site locally.
2. Open `/?still` in a 1100 × 1330 desktop viewport at device scale 2. `?still` frames for portrait (subject in the
   upper third, wider lens) and turns the grain off.
3. Screenshot the canvas at journey progress 0, 0.3, 0.48, 0.72 and 0.92 into `.cache/journey-stills/00–04.png`.
4. Run `node scripts/build-journey-stills.mjs`.

The stills show the customer tank as configured at capture time: re-render them if the double-wall tank offer
(`isServiceEnabled("tanks")`) changes.
