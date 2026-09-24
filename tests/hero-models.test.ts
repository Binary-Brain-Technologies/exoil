import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/components/three/scene/hero-models.json";

// Built by scripts/build-hero-models.mjs. These budgets keep the hero fast on an ordinary connection.
const MAX_FILE = 1.3 * 1024 * 1024;
const MAX_TOTAL = 6 * 1024 * 1024;

function glbJson(file: string): { extensionsUsed?: string[]; images?: Array<{ mimeType?: string }> } {
  const buf = readFileSync(file);
  expect(buf.readUInt32LE(0)).toBe(0x46546c67); // "glTF"
  const jsonLength = buf.readUInt32LE(12);
  expect(buf.readUInt32LE(16)).toBe(0x4e4f534a); // "JSON" chunk
  return JSON.parse(buf.subarray(20, 20 + jsonLength).toString("utf8"));
}

describe("hero models", () => {
  const entries = Object.entries(manifest);
  const files = entries.map(([name, url]) => ({ name, url, file: path.join(process.cwd(), "public", url) }));

  it("lists every model the scene loads", () => {
    expect(Object.keys(manifest).sort()).toEqual(["customer-hall", "customer-tank", "exoil-tractor", "exoil-trailer", "fuel-gantry", "storage-tank"]);
  });

  it.each(files)("$name has a content-hashed file name (served immutable) that exists", ({ name, url, file }) => {
    expect(url).toMatch(new RegExp(`^/models/${name}\\.[0-9a-f]{10}\\.glb$`));
    expect(statSync(file).isFile()).toBe(true);
  });

  it.each(files)("$name is compressed (meshopt geometry, WebP textures) and within budget", ({ file }) => {
    expect(statSync(file).size).toBeLessThan(MAX_FILE);
    const json = glbJson(file);
    expect(json.extensionsUsed).toEqual(expect.arrayContaining(["EXT_meshopt_compression", "EXT_texture_webp"]));
    for (const image of json.images ?? []) expect(image.mimeType).toBe("image/webp");
  });

  it("stays within the total download budget", () => {
    const total = files.reduce((sum, f) => sum + statSync(f.file).size, 0);
    expect(total).toBeLessThan(MAX_TOTAL);
  });
});
