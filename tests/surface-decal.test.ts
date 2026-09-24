import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { regionMesh, surfaceDecalGeometry } from "@/components/three/scene/decal";

// An elliptical tank shell along X, like the generated trailer's (centre y 2.37, half-height 1.05, half-width 1.27).
const CY = 2.37;
const RY = 1.05;
const RZ = 1.27;
function shell() {
  const geo = new THREE.CylinderGeometry(1, 1, 11, 96, 8, true);
  geo.rotateZ(Math.PI / 2);
  geo.scale(1, RY, RZ);
  geo.translate(-3.8, CY, 0);
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
}

const W = 2.6;
const H = (W * 102) / 304; // the transparent logo's aspect
const opts = { centreX: -7.7, centreY: 2.25, width: W, height: H };

describe("logo decal laid onto a tank shell", () => {
  it.each([1, -1] as const)("side %i: on the surface, facing out, upright and never mirrored", (side) => {
    const geo = surfaceDecalGeometry(shell(), { side, ...opts })!;
    expect(geo).not.toBeNull();
    const pos = geo.getAttribute("position");
    const uv = geo.getAttribute("uv");
    const nor = geo.getAttribute("normal");
    for (let k = 0; k < pos.count; k++) {
      const y = pos.getY(k);
      const z = pos.getZ(k);
      // On the ellipse (plus the small lift), on the requested side.
      expect(Math.sign(z)).toBe(side);
      expect(Math.abs(((y - CY) / RY) ** 2 + (z / RZ) ** 2 - 1)).toBeLessThan(0.02);
      expect(Number.isFinite(nor.getX(k) + nor.getY(k) + nor.getZ(k))).toBe(true);
      expect(Math.sign(nor.getZ(k))).toBe(side);
    }
    // Seen from its own side, screen-right is +X on the +Z side and -X on the -Z side: u must grow that way.
    expect(Math.sign((uv.getX(1) - uv.getX(0)) * (pos.getX(1) - pos.getX(0)))).toBe(side);
    // v grows upwards.
    const last = pos.count - 1;
    expect(uv.getY(last)).toBe(1);
    expect(pos.getY(last)).toBeGreaterThan(pos.getY(0));
  });

  it("keeps the image's proportions around the curve (arc length = height, straight length = width)", () => {
    const geo = surfaceDecalGeometry(shell(), { side: 1, ...opts, columns: 12, rows: 24 })!;
    const pos = geo.getAttribute("position");
    const stride = 13;
    let arc = 0;
    for (let j = 1; j <= 24; j++) {
      const a = (j - 1) * stride;
      const b = j * stride;
      arc += Math.hypot(pos.getY(b) - pos.getY(a), pos.getZ(b) - pos.getZ(a));
    }
    expect(arc).toBeGreaterThan(H * 0.98);
    expect(arc).toBeLessThan(H * 1.02);
    expect(Math.abs(pos.getX(12) - pos.getX(0))).toBeCloseTo(W, 5);
  });

  it("works in the vehicle's own frame wherever the vehicle is on the road", () => {
    const tanker = new THREE.Group();
    const mesh = shell();
    tanker.add(mesh);
    tanker.position.set(-150, 0, -1.6);
    const box = new THREE.Box3(new THREE.Vector3(-9.5, 1, 0), new THREE.Vector3(-5.9, 3.5, 3));
    const geo = surfaceDecalGeometry(regionMesh(mesh, box, tanker), { side: 1, ...opts });
    expect(geo).not.toBeNull();
    geo!.computeBoundingBox();
    expect(geo!.boundingBox!.getCenter(new THREE.Vector3()).x).toBeCloseTo(-7.7, 1);
  });

  it("returns null (no floating decal) when there is no shell under the patch", () => {
    expect(surfaceDecalGeometry(shell(), { side: 1, ...opts, centreX: 40 })).toBeNull();
  });
});
