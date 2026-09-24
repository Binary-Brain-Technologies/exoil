#!/usr/bin/env node
/**
 * Builds the homepage hero's 3D models from the Higgsfield-generated sources.
 *
 *   node scripts/build-hero-models.mjs            # download sources (cached in .cache/hero-models) and build
 *   node scripts/build-hero-models.mjs --analyze  # print tyre extents used to tune the wheel cut-outs
 *
 * Every source was generated from clean, unbranded references (logos and lettering removed) made from the 2023
 * fleet photographs — see docs/hero-3d-models.md. Nothing here touches the logo: the real image is applied at runtime.
 *
 * Per model: bake a transform into the vertices (scene metres, +X forward, Y up, ground at y = 0), cut out the baked
 * wheels of the vehicles (replaced at runtime by procedural wheels that rotate), decimate, re-encode textures as WebP
 * at web sizes, quantise and meshopt-compress. Output: public/models/<name>.<hash>.glb plus a manifest the scene reads.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, EXTTextureWebP, KHRMeshQuantization } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, quantize, reorder, simplify, textureCompress, weld } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(root, ".cache", "hero-models");
const outDir = join(root, "public", "models");
const manifestPath = join(root, "src", "components", "three", "scene", "hero-models.json");
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3FZpNhENDsZFwLxNKH6aNMezZxA";

/**
 * Transform, in order: centre on the bounding box (ground = lowest vertex), rotate so the model's `lengthAxis` points
 * along +X (`frontSign` picks which end is the front), scale per axis, lift by `-groundCut` (so the tyres, not the
 * landing legs, touch the ground), then translate.
 */
const MODELS = [
  {
    name: "exoil-tractor",
    // Higgsfield job 46814f83 (Tripo H3.1 image-to-3D) from reference image b27ebc9c.
    url: `${CDN}/hf_20260924_090039_46814f83-e7c1-4d62-991a-204d90cdb519.glb`,
    lengthAxis: "x",
    frontSign: 1,
    scale: [6.32, 6.32, 6.32],
    groundCut: 0,
    translate: [2.918, 0, 0],
    // Hub centres (scene metres) and tyre half-width band [inner |z|, outer |z|] to cut out.
    wheels: [
      { x: 4.638, y: 0.55, rx: 0.55, ry: 0.55 },
      { x: 0.738, y: 0.55, rx: 0.55, ry: 0.55 },
    ],
    wheelZ: [0.55, 9],
    ratio: 0.6,
    texture: 2048,
  },
  {
    name: "exoil-trailer",
    // Higgsfield job 2edacfa0 (Tripo H3.1 image-to-3D) from reference image d6f4a0b9.
    url: `${CDN}/hf_20260924_085927_2edacfa0-e629-4cf3-9db9-c044c4d2cbe3.glb`,
    lengthAxis: "z",
    frontSign: 1,
    scale: [11.2 * 1.08, 11.2 * 1.15, 10.4],
    groundCut: 0.153 * 1.15,
    translate: [-3.832, 0, 0],
    wheels: [-7.706, -6.359, -5.006].map((x) => ({ x, y: 0.629, rx: 0.59, ry: 0.629 })),
    wheelZ: [0.55, 9],
    ratio: 0.6,
    texture: 2048,
  },
  {
    name: "fuel-gantry",
    // Higgsfield job f0191411 (Tripo H3.1 image-to-3D) from reference image e35cd609.
    url: `${CDN}/hf_20260924_090124_f0191411-7283-4f06-8378-872e24eae1b9.glb`,
    lengthAxis: "z",
    frontSign: 1,
    // Deck at ≈ 3.6 m: level with the tank tops, where the operator works.
    scale: [15.6, 15.6, 15.6],
    groundCut: 0,
    translate: [0, 0, 0],
    ratio: 0.7,
    texture: 1024,
  },
  {
    name: "storage-tank",
    // Higgsfield job 7eee9ee6 (Tripo H3.1 image-to-3D) from reference image c2a9584f.
    url: `${CDN}/hf_20260924_090053_7eee9ee6-623f-4b46-a86f-576156a5e4f6.glb`,
    lengthAxis: "x",
    frontSign: 1,
    scale: [13, 13, 13],
    groundCut: 0,
    translate: [0, 0, 0],
    ratio: 0.6,
    texture: 1024,
  },
  {
    name: "customer-tank",
    // Higgsfield job ac1756fc (Tripo H3.1 image-to-3D) from reference image 7af90280.
    url: `${CDN}/hf_20260924_092848_ac1756fc-8500-4120-9ac7-109da922e06d.glb`,
    lengthAxis: "x",
    frontSign: 1,
    // Body Ø 2.9 m (it wraps the procedural fuel-level cut-away, r 1.45) and 3.9 m tall, on its skid; origin on the
    // body axis (the bounding box is off-centre because of the dispenser cabinet and the ladder).
    scale: [5.66, 4.81, 5.66],
    groundCut: 0,
    translate: [0.234, 0, 0.183],
    ratio: 0.7,
    texture: 1024,
  },
  {
    name: "customer-hall",
    // Higgsfield job b13052ff (Tripo H3.1 image-to-3D) from reference image 8631698b.
    url: `${CDN}/hf_20260924_093626_b13052ff-6c3a-4b3b-a9ac-28305bf7f168.glb`,
    // Long facade (with the loading doors) turned to face the road (+Z); 22 m long, ≈ 6.8 m high.
    lengthAxis: "z",
    frontSign: -1,
    scale: [22, 22, 22],
    groundCut: 0,
    translate: [0, 0, 0],
    ratio: 0.6,
    texture: 1024,
  },
];

const analyze = process.argv.includes("--analyze");

async function source(model) {
  mkdirSync(cacheDir, { recursive: true });
  const file = join(cacheDir, `${model.name}.src.glb`);
  if (!existsSync(file)) {
    const res = await fetch(model.url);
    if (!res.ok) throw new Error(`Download failed (${res.status}) for ${model.name}: ${model.url}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

/** Bakes the normalising transform into POSITION and NORMAL of every primitive. */
function bakeTransform(doc, m) {
  const prims = doc.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives());
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  const v = [0, 0, 0];
  for (const p of prims) {
    const pos = p.getAttribute("POSITION");
    for (let i = 0; i < pos.getCount(); i++) {
      pos.getElement(i, v);
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], v[k]);
        max[k] = Math.max(max[k], v[k]);
      }
    }
  }
  const c = [(min[0] + max[0]) / 2, min[1], (min[2] + max[2]) / 2];
  const [sx, sy, sz] = m.scale;
  const f = m.frontSign;
  // Rotation about +Y that brings the length axis to +X (proper rotation — never a mirror).
  const rot = (x, z) => (m.lengthAxis === "x" ? [x * f, z * f] : [z * f, -x * f]);
  const seen = new Set();
  for (const p of prims) {
    const pos = p.getAttribute("POSITION");
    const nor = p.getAttribute("NORMAL");
    if (!seen.has(pos)) {
      seen.add(pos);
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, v);
        const [rx, rz] = rot(v[0] - c[0], v[2] - c[2]);
        pos.setElement(i, [rx * sx + m.translate[0], (v[1] - c[1]) * sy - m.groundCut + m.translate[1], rz * sz + m.translate[2]]);
      }
    }
    if (nor && !seen.has(nor)) {
      seen.add(nor);
      for (let i = 0; i < nor.getCount(); i++) {
        nor.getElement(i, v);
        const [rx, rz] = rot(v[0], v[2]);
        // Inverse-transpose of a diagonal scale: divide, then renormalise.
        const n = [rx / sx, v[1] / sy, rz / sz];
        const len = Math.hypot(n[0], n[1], n[2]) || 1;
        nor.setElement(i, [n[0] / len, n[1] / len, n[2] / len]);
      }
    }
  }
  for (const node of doc.getRoot().listNodes()) {
    node.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
  }
}

function insideWheel(m, x, y, z) {
  const az = Math.abs(z);
  if (az < m.wheelZ[0] || az > m.wheelZ[1]) return false;
  return m.wheels.some((w) => ((x - w.x) / (w.rx + 0.03)) ** 2 + ((y - w.y) / (w.ry + 0.03)) ** 2 < 1);
}

/** Removes triangles lying entirely inside a wheel cut-out (tyres, rims). Runtime adds rotating wheels there. */
function cutWheels(doc, m) {
  let removed = 0;
  for (const p of doc.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    const pos = p.getAttribute("POSITION");
    const idx = p.getIndices();
    const inside = new Uint8Array(pos.getCount());
    const v = [0, 0, 0];
    for (let i = 0; i < pos.getCount(); i++) {
      pos.getElement(i, v);
      inside[i] = insideWheel(m, v[0], v[1], v[2]) ? 1 : 0;
    }
    const src = idx.getArray();
    const kept = [];
    for (let t = 0; t < src.length; t += 3) {
      if (inside[src[t]] && inside[src[t + 1]] && inside[src[t + 2]]) removed++;
      else kept.push(src[t], src[t + 1], src[t + 2]);
    }
    idx.setArray(new Uint32Array(kept));
  }
  return removed;
}

function report(doc, m) {
  const v = [0, 0, 0];
  const zs = [];
  for (const p of doc.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives())) {
    const pos = p.getAttribute("POSITION");
    for (let i = 0; i < pos.getCount(); i++) {
      pos.getElement(i, v);
      if (m.wheels.some((w) => ((v[0] - w.x) / (w.rx * 0.85)) ** 2 + ((v[1] - w.y) / (w.ry * 0.85)) ** 2 < 1)) zs.push(Math.abs(v[2]));
    }
  }
  zs.sort((a, b) => a - b);
  const q = (t) => zs[Math.floor(t * (zs.length - 1))]?.toFixed(3);
  console.log(`  tyre |z| quantiles  5%:${q(0.05)}  25%:${q(0.25)}  50%:${q(0.5)}  95%:${q(0.95)}  max:${q(1)}`);
}

const io = new NodeIO().registerExtensions([EXTMeshoptCompression, EXTTextureWebP, KHRMeshQuantization]).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
});
await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

mkdirSync(outDir, { recursive: true });
const manifest = {};
for (const m of MODELS) {
  const doc = await io.read(await source(m));
  bakeTransform(doc, m);
  if (analyze) {
    console.log(m.name);
    if (m.wheels) report(doc, m);
    continue;
  }
  const cut = m.wheels ? cutWheels(doc, m) : 0;
  await doc.transform(
    dedup(),
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: m.ratio, error: 0.0008, lockBorder: true }),
    prune(),
    // Colour carries the detail; normal / ORM maps stay at 1024 px (about half the GPU memory of 2048 px).
    textureCompress({ encoder: sharp, targetFormat: "webp", slots: /^baseColorTexture$/, resize: [m.texture, m.texture], quality: 82 }),
    textureCompress({ encoder: sharp, targetFormat: "webp", slots: /^(normalTexture|metallicRoughnessTexture)$/, resize: [1024, 1024], quality: 90 }),
    reorder({ encoder: MeshoptEncoder }),
    quantize(),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  const bytes = await io.writeBinary(doc);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
  for (const f of readdirSync(outDir)) if (f.startsWith(`${m.name}.`) && f.endsWith(".glb")) unlinkSync(join(outDir, f));
  const file = `${m.name}.${hash}.glb`;
  writeFileSync(join(outDir, file), bytes);
  const tris = doc
    .getRoot()
    .listMeshes()
    .flatMap((mesh) => mesh.listPrimitives())
    .reduce((a, p) => a + (p.getIndices()?.getCount() ?? 0) / 3, 0);
  manifest[m.name] = `/models/${file}`;
  console.log(`${file}  ${(bytes.byteLength / 1024).toFixed(0)} KB  ${tris} triangles  (wheel triangles cut: ${cut})`);
}
if (!analyze) writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
