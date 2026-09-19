import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { createTanker } from "@/components/three/scene/tanker";

describe("logo decal on the 3D tanker", () => {
  const tanker = createTanker({ detail: "low" });
  const before = tanker.group.children.length;
  tanker.attachLogo(new THREE.Texture());
  const decals = tanker.group.children.slice(before) as THREE.Mesh[];

  it("is placed on both sides of the tank", () => {
    expect(decals).toHaveLength(2);
    expect(decals.map((d) => Math.sign(d.geometry.getAttribute("position").getZ(0))).sort()).toEqual([-1, 1]);
  });

  it.each([0, 1])("side %i faces outward, reads left-to-right and is upright (never mirrored)", (i) => {
    const d = decals[i]!;
    const pos = d.geometry.getAttribute("position");
    const uv = d.geometry.getAttribute("uv");
    const idx = d.geometry.getIndex()!;
    const side = Math.sign(pos.getZ(0));
    const p = (k: number) => new THREE.Vector3(pos.getX(k), pos.getY(k), pos.getZ(k));
    const [a, b, c] = [idx.getX(0), idx.getX(1), idx.getX(2)].map(p);
    const normal = new THREE.Vector3().subVectors(b!, a!).cross(new THREE.Vector3().subVectors(c!, a!));
    expect(Math.sign(normal.z)).toBe(side);
    // Seen from its own side, screen-right is +X on the +Z side and -X on the -Z side.
    expect(Math.sign((uv.getX(1) - uv.getX(0)) * (pos.getX(1) - pos.getX(0)))).toBe(side);
    const last = pos.count - 1;
    expect(uv.getY(last)).toBe(1);
    expect(pos.getY(last)).toBeGreaterThan(pos.getY(0));
  });

  it("follows the curved shell (not a flat plane) and keeps the logo's proportions", () => {
    const pos = decals[0]!.geometry.getAttribute("position");
    const zs = Array.from({ length: pos.count }, (_, k) => pos.getZ(k));
    expect(Math.max(...zs) - Math.min(...zs)).toBeGreaterThan(0.05); // depth varies with the curve
    // Arc length along the surface ≈ decal height (3.2 × 192/512 = 1.2 m): no vertical stretching.
    let arc = 0;
    for (let k = 2; k < pos.count; k += 2) {
      arc += Math.hypot(pos.getY(k) - pos.getY(k - 2), pos.getZ(k) - pos.getZ(k - 2));
    }
    expect(arc).toBeGreaterThan(1.19);
    expect(arc).toBeLessThan(1.21);
  });
});
