import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { createHeadlightBeams } from "@/components/three/scene/cinematic";
import type { VehicleAssets } from "@/components/three/scene/hero-assets";
import { createTanker } from "@/components/three/scene/tanker";
import { createModelTanker, MODEL_TANKER, roofMarkerSpots } from "@/components/three/scene/tanker-model";

/** Stand-ins for the generated models: an elliptical tank shell where the real trailer's is. */
function fakeAssets(): VehicleAssets {
  const shellGeo = new THREE.CylinderGeometry(1, 1, 11.8, 64, 4, true);
  shellGeo.rotateZ(Math.PI / 2);
  shellGeo.scale(1, 1.05, 1.27);
  shellGeo.translate(-3.8, MODEL_TANKER.tank.equatorY, 0);
  const trailerMesh = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial());
  const trailer = new THREE.Group().add(trailerMesh);
  return { tractor: new THREE.Group(), trailer, trailerMesh, dispose() {} };
}

function allNormalsFinite(root: THREE.Object3D) {
  const bad: string[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const n = mesh.isMesh ? mesh.geometry.getAttribute("normal") : undefined;
    if (!n) return;
    for (let i = 0; i < n.count * n.itemSize; i++) {
      if (!Number.isFinite(n.array[i]!)) {
        bad.push(`${mesh.name || mesh.geometry.type} normal[${i}]`);
        break;
      }
    }
  });
  return bad;
}

describe("tanker built from the generated models", () => {
  it.each(["high", "low"] as const)("%s detail: every normal is finite (one NaN pixel blacks out the bloomed frame)", (detail) => {
    const tanker = createModelTanker(fakeAssets(), detail);
    tanker.attachLogo(new THREE.Texture());
    expect(allNormalsFinite(tanker.group)).toEqual([]);
  });

  it("has a rolling wheel on each side of every axle", () => {
    const tanker = createModelTanker(fakeAssets(), "high");
    expect(tanker.wheels).toHaveLength(MODEL_TANKER.axles.length * 2);
    for (const w of tanker.wheels) expect(w.position.y).toBeCloseTo(tanker.wheelRadius, 5);
  });

  it("stops under the gantry drop pipe exactly like the procedural tanker (middle dome at x = -3.4)", () => {
    const model = createModelTanker(fakeAssets(), "high");
    const procedural = createTanker({ detail: "low" });
    expect(model.anchors.loadingPort.x).toBeCloseTo(procedural.anchors.loadingPort.x, 5);
  });

  it("lays the unmodified logo on both tank sides, on the rear part of the tank", () => {
    const tanker = createModelTanker(fakeAssets(), "high");
    const before = tanker.group.children.length;
    tanker.attachLogo(new THREE.Texture());
    const decals = tanker.group.children.slice(before) as THREE.Mesh[];
    expect(decals).toHaveLength(2);
    const zs = decals.map((d) => Math.sign(d.geometry.getAttribute("position").getZ(0))).sort();
    expect(zs).toEqual([-1, 1]);
    const { rearX, frontX } = MODEL_TANKER.tank;
    for (const d of decals) {
      d.geometry.computeBoundingBox();
      const cx = d.geometry.boundingBox!.getCenter(new THREE.Vector3()).x;
      expect((cx - rearX) / (frontX - rearX)).toBeLessThan(0.35);
    }
  });

  it("headlight beams have finite normals", () => {
    const beams = createHeadlightBeams([new THREE.Vector3(6, 0.9, 1), new THREE.Vector3(6, 0.9, -1)]);
    expect(allNormalsFinite(beams.group)).toEqual([]);
  });

  it("seats the roof marker lights on the cab roof's front edge (not floating above it)", () => {
    // A high-roof cab: front roof at y 3.5 (x 4.4–5.9), rising to a rear spoiler at y 3.8 (x 3.4–4.4).
    const mat = new THREE.MeshBasicMaterial();
    const front = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 2.5).translate(5.15, 1.75, 0), mat);
    const rear = new THREE.Mesh(new THREE.BoxGeometry(1.0, 3.8, 2.5).translate(3.9, 1.9, 0), mat);
    const spots = roofMarkerSpots(new THREE.Group().add(front, rear));
    expect(spots).toHaveLength(4);
    for (const [x, y] of spots) {
      expect(y).toBeCloseTo(3.5, 3); // on the front roof, not floating and not back on the spoiler
      expect(x).toBeGreaterThan(5.6);
      expect(x).toBeLessThan(5.9);
    }
  });
});
