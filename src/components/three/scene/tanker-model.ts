import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { regionMesh, surfaceDecalGeometry } from "./decal";
import type { VehicleAssets } from "./hero-assets";
import type { Tanker } from "./tanker";

/**
 * The EXOIL tanker built from the generated models (tractor + tank semi-trailer, from the 2023 fleet photographs with
 * all branding removed). The models arrive with their wheels cut out; the wheels here are procedural so they can
 * roll. The logo is the unmodified recovered image, laid onto the generated tank shell at runtime.
 *
 * Same frame and interface as the procedural tanker (tanker.ts): faces +X, the middle dome cover is at x = -3.4.
 */

export const MODEL_TANKER = {
  wheelRadius: 0.55,
  /**
   * Axle x, |z| of the wheel's centre plane (between the tyres of a dual pair), width of one tyre, dual.
   * Measured from the tyre bands of the generated meshes (scripts/build-hero-models.mjs --analyze).
   */
  axles: [
    { x: 4.638, z: 1.11, width: 0.32, dual: false }, // tractor steer
    { x: 0.738, z: 0.935, width: 0.3, dual: true }, // tractor drive (twin tyres)
    { x: -5.006, z: 0.84, width: 0.42, dual: false }, // trailer axles (wide singles)
    { x: -6.359, z: 0.84, width: 0.42, dual: false },
    { x: -7.706, z: 0.84, width: 0.42, dual: false },
  ],
  /** Tank shell: equator height, and the rear/front ends along X. */
  tank: { equatorY: 2.37, rearX: -9.7, frontX: 2.07 },
  /** Logo on the rear part of the tank side, as on the real semi-trailer (≈ 17 % of the tank length from the rear). */
  logo: { centreX: -7.7, centreY: 2.25, width: 2.6 },
  /** Recovered transparent original (304 × 102 px), so the generated shell's own white shows around the letters. */
  logoUrl: "/brand/exoil-logo-archive-304-transparent-original.png",
  logoAspect: 102 / 304,
  /** Pump / meter cabinet between the landing legs and the axles, on the -Z side: the delivery hose starts here. */
  dischargePort: [-2.93, 0.95, -1.22],
} as const;

/** Rounded tyre cross-section revolved around the axle (Y before rotation). */
function tyreGeometry(radius: number, width: number, segments: number) {
  const r0 = radius * 0.62; // rim seat
  const shoulder = 0.06;
  const hw = width / 2;
  // No repeated points: LatheGeometry derives normals from each profile segment, and a zero-length one yields NaN
  // (which the bloom pass then spreads over the whole frame).
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(r0, -hw * 0.9));
  for (let i = 0; i <= 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - shoulder + Math.cos(a) * shoulder, -hw + shoulder + Math.sin(a) * shoulder));
  }
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - shoulder + Math.cos(a) * shoulder, hw - shoulder + Math.sin(a) * shoulder));
  }
  pts.push(new THREE.Vector2(r0, hw * 0.9));
  const geo = new THREE.LatheGeometry(pts, segments);
  geo.rotateX(Math.PI / 2); // axle along Z
  return geo;
}

/** Dished aluminium wheel face (outer side), with a raised hub. */
function rimGeometry(radius: number, segments: number) {
  const r = radius * 0.62;
  const pts = [
    new THREE.Vector2(0.0, 0.07),
    new THREE.Vector2(r * 0.22, 0.07),
    new THREE.Vector2(r * 0.26, 0.04),
    new THREE.Vector2(r * 0.55, 0.02),
    new THREE.Vector2(r * 0.8, -0.04),
    new THREE.Vector2(r * 0.95, 0.0),
    new THREE.Vector2(r, -0.02),
  ];
  const geo = new THREE.LatheGeometry(pts, segments);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/**
 * Four marker-light spots along the front edge of the cab roof (above the sun visor, as on the real cab): for each
 * lateral position, rays straight down find the cab, and the front-most x that is already at roof level — within
 * 0.5 m of the roof's highest point, which is the rear spoiler on this high-roof cab — is the edge.
 */
export function roofMarkerSpots(tractor: THREE.Object3D): Array<[number, number, number]> {
  tractor.updateMatrixWorld(true);
  const raycaster = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const origin = new THREE.Vector3();
  const heightAt = (x: number, z: number) => {
    origin.set(x, 10, z);
    raycaster.set(origin, down);
    return raycaster.intersectObject(tractor, true)[0]?.point.y ?? -Infinity;
  };
  const spots: Array<[number, number, number]> = [];
  for (const z of [0.75, 0.25, -0.25, -0.75]) {
    const samples: Array<[number, number]> = [];
    for (let x = 6.4; x >= 3.0; x -= 0.05) samples.push([x, heightAt(x, z)]);
    const peak = Math.max(...samples.map(([, y]) => y));
    if (!Number.isFinite(peak)) continue;
    const edge = samples.find(([, y]) => y >= peak - 0.5)!;
    // A little behind the edge so the lamp sits on the roof, not on its rounded lip.
    const x = edge[0] - 0.08;
    spots.push([x, heightAt(x, z), z]);
  }
  return spots;
}

export function createModelTanker(assets: VehicleAssets, detail: "high" | "low"): Tanker {
  const group = new THREE.Group();
  group.name = "exoil-tanker-model";
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  group.add(assets.tractor, assets.trailer);
  // The generator baked studio lighting into the paint's normal map; soften it so the cab reads as smooth lacquer.
  assets.tractor.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (m?.normalScale) m.normalScale.setScalar(0.45);
  });

  // ------------------------------------------------------------------ wheels
  const seg = detail === "high" ? 40 : 24;
  const { wheelRadius } = MODEL_TANKER;
  const tyreMat = track(new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.88, metalness: 0 }));
  const rimMat = track(new THREE.MeshStandardMaterial({ color: 0xd9dcdf, roughness: 0.22, metalness: 1 }));
  const hubMat = track(new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.6 }));
  const tyreGeos = new Map<number, THREE.BufferGeometry>();
  const tyreGeo = (w: number) => {
    let g = tyreGeos.get(w);
    if (!g) tyreGeos.set(w, (g = track(tyreGeometry(wheelRadius, w, seg))));
    return g;
  };
  const rimGeo = track(rimGeometry(wheelRadius, seg));
  // Ten wheel nuts on the 335 mm bolt circle, merged into one geometry (one draw call per wheel, not ten). They make
  // the rotation readable, which a smooth disc does not.
  const nutParts = Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * Math.PI * 2;
    return new THREE.CylinderGeometry(0.018, 0.018, 0.04, 6).rotateX(Math.PI / 2).translate(Math.cos(a) * 0.1675, Math.sin(a) * 0.1675, 0);
  });
  const nutsGeo = track(mergeGeometries(nutParts));
  nutParts.forEach((g) => g.dispose());
  const wheels: THREE.Object3D[] = [];
  for (const axle of MODEL_TANKER.axles) {
    for (const side of [1, -1] as const) {
      const wheel = new THREE.Group();
      wheel.position.set(axle.x, wheelRadius, side * axle.z);
      const tyres = axle.dual ? [axle.width / 2 + 0.005, -axle.width / 2 - 0.005] : [0];
      for (const dz of tyres) {
        const tyre = new THREE.Mesh(tyreGeo(axle.width), tyreMat);
        tyre.position.z = dz * side;
        tyre.castShadow = true;
        wheel.add(tyre);
      }
      // Outer rim face, towards the viewer on each side.
      const faceZ = side * ((axle.dual ? axle.width + 0.005 : axle.width / 2) - 0.02);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.z = faceZ;
      if (side < 0) rim.rotation.y = Math.PI;
      wheel.add(rim);
      if (detail === "high") {
        const nuts = new THREE.Mesh(nutsGeo, hubMat);
        nuts.position.z = faceZ + side * 0.045;
        wheel.add(nuts);
      }
      group.add(wheel);
      wheels.push(wheel);
    }
  }

  // ------------------------------------------------------------------ lights (emissive, picked up by the bloom pass)
  const head = track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff1d6, emissiveIntensity: 3.2 }));
  const tail = track(new THREE.MeshStandardMaterial({ color: 0x400000, emissive: 0xff1a10, emissiveIntensity: 2.4 }));
  const amber = track(new THREE.MeshStandardMaterial({ color: 0x402000, emissive: 0xff9a1a, emissiveIntensity: 2.2 }));
  const lamp = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(track(geo), mat);
    m.position.set(x, y, z);
    group.add(m);
  };
  for (const z of [0.98, -0.98]) lamp(new THREE.BoxGeometry(0.05, 0.13, 0.36), head, 6.07, 0.86, z);
  for (const z of [0.95, -0.95]) lamp(new THREE.BoxGeometry(0.04, 0.12, 0.3), tail, MODEL_TANKER.tank.rearX - 0.06, 0.95, z);
  // Side marker lights along the trailer (ADR vehicles carry them).
  for (let x = -9.2; x <= 1.4; x += 1.8) for (const z of [1.27, -1.27]) lamp(new THREE.BoxGeometry(0.08, 0.05, 0.02), amber, x, 1.12, z);
  // Roof marker lights, seated on the front edge of the generated cab's roof (found by ray casting, not guessed).
  for (const [x, y, z] of roofMarkerSpots(assets.tractor)) lamp(new THREE.BoxGeometry(0.1, 0.05, 0.08), amber, x, y + 0.02, z);

  // ------------------------------------------------------------------ logo (unmodified recovered image)
  const attachLogo = (texture: THREE.Texture) => {
    const { centreX, centreY, width } = MODEL_TANKER.logo;
    const height = width * MODEL_TANKER.logoAspect;
    const decalMat = track(
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        roughness: 0.32,
        metalness: 0.1,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    );
    for (const side of [1, -1] as const) {
      const box = new THREE.Box3(
        new THREE.Vector3(centreX - width / 2 - 0.2, centreY - height, side > 0 ? 0 : -3),
        new THREE.Vector3(centreX + width / 2 + 0.2, centreY + height, side > 0 ? 3 : 0),
      );
      // In the tanker's own frame: the patch is added to the group, which by now is somewhere along the road.
      const region = regionMesh(assets.trailerMesh, box, group);
      const geo = surfaceDecalGeometry(region, { side, centreX, centreY, width, height });
      region.geometry.dispose();
      (region.material as THREE.Material).dispose();
      if (!geo) continue;
      const decal = new THREE.Mesh(track(geo), decalMat);
      decal.receiveShadow = true;
      decal.renderOrder = 1;
      group.add(decal);
    }
  };

  // ------------------------------------------------------------------ headlight
  const headlight = new THREE.SpotLight(0xfff0d8, detail === "high" ? 60 : 30, 45, Math.PI / 7, 0.55, 1.6);
  headlight.position.set(6.3, 1.0, 0);
  headlight.target.position.set(26, 0, 0);
  group.add(headlight, headlight.target);

  return {
    group,
    wheels,
    wheelRadius,
    anchors: {
      loadingPort: new THREE.Vector3(-3.4, 3.66, 0),
      dischargePort: new THREE.Vector3(...MODEL_TANKER.dischargePort),
      rear: new THREE.Vector3(MODEL_TANKER.tank.rearX - 0.1, 0, 0),
      front: new THREE.Vector3(6.1, 0, 0),
      headlamps: [new THREE.Vector3(6.1, 0.86, 0.98), new THREE.Vector3(6.1, 0.86, -0.98)],
    },
    headlight,
    logoUrl: MODEL_TANKER.logoUrl,
    attachLogo,
    dispose() {
      for (const d of disposables) d.dispose();
      // The model roots belong to the asset set; it releases them (VehicleAssets.dispose).
    },
  };
}
