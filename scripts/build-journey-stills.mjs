#!/usr/bin/env node
/**
 * Encodes the mobile journey "film" stills: one frame per chapter, rendered from the real 3D scene (same models,
 * lighting and the real logo decal), so phones get the look without WebGL.
 *
 *   node scripts/build-journey-stills.mjs
 *
 * Masters: .cache/journey-stills/00.png … 04.png (chapters 00–04). They are captured from the running site with
 * `?still` (portrait framing, no grain) on a 1100 × 1330 desktop viewport at device scale 2: the canvas is then
 * 1106 × 2208, the phone's ≈ 1 : 2. Capture each chapter at journey progress 0, 0.3, 0.48, 0.72 and 0.92
 * (docs/hero-3d-models.md §7).
 *
 * Output: public/journey/<chapter>.<width>.<hash>.{avif,webp} at 640 and 1080 px wide, a 12 px blurred placeholder,
 * and src/components/home/journey-stills.json for the page.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const masters = join(root, ".cache", "journey-stills");
const outDir = join(root, "public", "journey");
const manifestPath = join(root, "src", "components", "home", "journey-stills.json");

const CHAPTERS = ["zrodlo", "zaladunek", "trasa", "dostawa", "zbiornik"];
const WIDTHS = [640, 1080];

mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) unlinkSync(join(outDir, f));

const manifest = {};
for (const [i, id] of CHAPTERS.entries()) {
  const src = join(masters, `${String(i).padStart(2, "0")}.png`);
  if (!existsSync(src)) throw new Error(`Missing master ${src} (see the header of this script for how to capture it)`);
  const meta = await sharp(src).metadata();
  const entry = { width: meta.width, height: meta.height, avif: [], webp: [], placeholder: "" };
  for (const w of WIDTHS) {
    const base = sharp(src).resize({ width: w });
    for (const [format, buf] of [
      ["avif", await base.clone().avif({ quality: 52, effort: 6, chromaSubsampling: "4:2:0" }).toBuffer()],
      ["webp", await base.clone().webp({ quality: 72, effort: 6 }).toBuffer()],
    ]) {
      const hash = createHash("sha256").update(buf).digest("hex").slice(0, 10);
      const file = `${id}.${w}.${hash}.${format}`;
      writeFileSync(join(outDir, file), buf);
      entry[format].push({ src: `/journey/${file}`, width: w, bytes: buf.byteLength });
    }
  }
  // Painted instantly (inline) under the first frame while the real image arrives.
  const tiny = await sharp(src).resize({ width: 12 }).blur(0.6).webp({ quality: 40 }).toBuffer();
  entry.placeholder = `data:image/webp;base64,${tiny.toString("base64")}`;
  manifest[id] = entry;
  console.log(id, entry.avif.map((a) => `${a.width}w ${(a.bytes / 1024).toFixed(0)} KB avif`).join(", "), "|", entry.webp.map((a) => `${(a.bytes / 1024).toFixed(0)} KB webp`).join(", "));
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
