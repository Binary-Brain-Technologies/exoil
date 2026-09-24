import { statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { JOURNEY_CHAPTERS } from "@/components/home/journeyChapters";
import stills from "@/components/home/journey-stills.json";

// Built by scripts/build-journey-stills.mjs: the mobile journey film. Budgets keep phones fast.
const MAX_FRAME = 60 * 1024; // largest AVIF per chapter
const MAX_FIRST_FRAME = 40 * 1024; // the phone's largest paint
const MAX_PLACEHOLDER = 1024; // inlined in the HTML

type Entry = { avif: Array<{ src: string; width: number }>; webp: Array<{ src: string; width: number }>; placeholder: string };
const manifest = stills as Record<string, Entry>;
const size = (src: string) => statSync(path.join(process.cwd(), "public", src)).size;

describe("mobile journey film stills", () => {
  it("has a frame for every chapter", () => {
    expect(Object.keys(manifest).sort()).toEqual(JOURNEY_CHAPTERS.map((c) => c.id).sort());
  });

  it.each(JOURNEY_CHAPTERS.map((c) => c.id))("%s: AVIF + WebP at phone widths, content-hashed, within budget", (id) => {
    const e = manifest[id]!;
    for (const list of [e.avif, e.webp]) {
      expect(list.map((s) => s.width)).toEqual([640, 1080]);
      for (const s of list) expect(s.src).toMatch(new RegExp(`^/journey/${id}\\.\\d+\\.[0-9a-f]{10}\\.(avif|webp)$`));
    }
    for (const s of e.avif) expect(size(s.src)).toBeLessThan(MAX_FRAME);
    expect(e.placeholder.startsWith("data:image/webp;base64,")).toBe(true);
    expect(e.placeholder.length).toBeLessThan(MAX_PLACEHOLDER);
  });

  it("keeps the first frame (largest paint on phones) small", () => {
    const first = manifest[JOURNEY_CHAPTERS[0]!.id]!;
    for (const s of first.avif) expect(size(s.src)).toBeLessThan(MAX_FIRST_FRAME);
  });
});
