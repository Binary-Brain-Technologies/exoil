import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Procedural EXOIL fuel tanker: tractor unit + 3-axle tank semi-trailer.
 * Configuration follows the 2023 fleet photograph (red cab, white elliptical tank with 5 dome covers,
 * top rail, black under-run, side guard rail, ADR plates). Generic cab — no manufacturer grille or badge.
 * Units: metres. The combination faces +X; origin is on the ground under the kingpin area.
 */

export interface Tanker {
  group: THREE.Group;
  /** Wheel meshes to rotate with travelled distance. */
  wheels: THREE.Object3D[];
  wheelRadius: number;
  /** Local-space points of interest. */
  anchors: {
    /** Top of the middle dome cover (loading arm target). */
    loadingPort: THREE.Vector3;
    /** Discharge coupling on the side cabinet (delivery hose start, -Z side). */
    dischargePort: THREE.Vector3;
    /** Rear end of the combination (route trace follows this). */
    rear: THREE.Vector3;
    front: THREE.Vector3;
  };
  headlight: THREE.SpotLight;
  /** Adds the logo decal (the unmodified image) to both tank sides. */
  attachLogo(texture: THREE.Texture): void;
  dispose(): void;
}

export interface TankerOptions {
  logoTexture?: THREE.Texture | null;
  detail: "high" | "low";
}

const COLORS = {
  cab: 0xc81d17,
  tank: 0xffffff, // pure white shell, so the logo's white field blends into the paint
  chassis: 0x161414,
  steel: 0x9aa0a5,
  glass: 0x0e1418,
  tyre: 0x121212,
  rim: 0xb9bdc0,
  adr: 0xf08a00,
};

export function createTanker({ logoTexture, detail }: TankerOptions): Tanker {
  const group = new THREE.Group();
  group.name = "exoil-tanker";
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const seg = detail === "high" ? 1 : 0.5;

  const m = {
    cab: track(new THREE.MeshStandardMaterial({ color: COLORS.cab, roughness: 0.38, metalness: 0.15 })),
    tank: track(new THREE.MeshStandardMaterial({ color: COLORS.tank, roughness: 0.32, metalness: 0.35 })),
    chassis: track(new THREE.MeshStandardMaterial({ color: COLORS.chassis, roughness: 0.7, metalness: 0.2 })),
    steel: track(new THREE.MeshStandardMaterial({ color: COLORS.steel, roughness: 0.3, metalness: 0.85 })),
    glass: track(new THREE.MeshStandardMaterial({ color: COLORS.glass, roughness: 0.08, metalness: 0.6 })),
    tyre: track(new THREE.MeshStandardMaterial({ color: COLORS.tyre, roughness: 0.9 })),
    rim: track(new THREE.MeshStandardMaterial({ color: COLORS.rim, roughness: 0.25, metalness: 0.9 })),
    adr: track(new THREE.MeshStandardMaterial({ color: COLORS.adr, roughness: 0.5, emissive: 0x3a1f00 })),
    head: track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff1d6, emissiveIntensity: 2.2 })),
    tail: track(new THREE.MeshStandardMaterial({ color: 0x400000, emissive: 0xff1a10, emissiveIntensity: 1.2 })),
    amber: track(new THREE.MeshStandardMaterial({ color: 0x402000, emissive: 0xff9a1a, emissiveIntensity: 0.9 })),
  };

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, cast = true) => {
    track(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // ---------------------------------------------------------------- tractor
  const cabLen = 2.35;
  const cabFront = 8.0;
  const cabCx = cabFront - cabLen / 2;
  add(new RoundedBoxGeometry(cabLen, 2.95, 2.5, 3, 0.16), m.cab, cabCx, 2.62, 0); // cab body
  add(new RoundedBoxGeometry(cabLen * 0.92, 0.5, 2.3, 2, 0.18), m.cab, cabCx - 0.05, 4.25, 0); // high roof
  add(new THREE.BoxGeometry(0.06, 1.05, 2.2), m.glass, cabFront + 0.005, 3.28, 0, false); // windscreen
  add(new THREE.BoxGeometry(0.7, 0.72, 0.04), m.glass, cabFront - 0.55, 3.28, 1.26, false); // side window R
  add(new THREE.BoxGeometry(0.7, 0.72, 0.04), m.glass, cabFront - 0.55, 3.28, -1.26, false); // side window L
  add(new THREE.BoxGeometry(0.1, 0.95, 1.7), m.chassis, cabFront + 0.02, 1.95, 0); // grille panel
  add(new THREE.BoxGeometry(0.28, 0.5, 2.5), m.chassis, cabFront + 0.02, 0.95, 0); // bumper
  add(new THREE.BoxGeometry(0.06, 0.16, 0.42), m.head, cabFront + 0.17, 1.18, 0.9, false); // headlights
  add(new THREE.BoxGeometry(0.06, 0.16, 0.42), m.head, cabFront + 0.17, 1.18, -0.9, false);
  add(new THREE.BoxGeometry(0.04, 0.3, 0.4), m.adr, cabFront + 0.17, 0.95, 0, false); // front ADR plate
  add(new THREE.BoxGeometry(0.12, 0.08, 2.3), m.amber, cabFront - 0.25, 4.52, 0, false); // roof marker lights
  for (const z of [1.42, -1.42]) {
    add(new THREE.BoxGeometry(0.12, 0.55, 0.14), m.chassis, cabFront - 0.2, 3.35, z); // mirror housings
    add(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), m.chassis, cabFront - 0.2, 3.35, z * 0.93).rotation.set(Math.PI / 2, 0, 0);
  }
  // Tractor chassis, fuel tanks, fifth wheel.
  add(new THREE.BoxGeometry(6.0, 0.3, 0.95), m.chassis, 4.8, 0.95, 0);
  for (const z of [1.02, -1.02]) {
    add(new THREE.CylinderGeometry(0.34, 0.34, 1.3, Math.round(20 * seg) + 4), m.steel, 4.9, 0.95, z).rotation.set(0, 0, Math.PI / 2);
  }
  add(new THREE.CylinderGeometry(0.75, 0.75, 0.12, 20), m.chassis, 3.3, 1.18, 0);

  // ---------------------------------------------------------------- tank semi-trailer
  const tankLen = 11.2;
  const tankCx = -2.95;
  const tankCy = 2.42;
  const tankRy = 1.08; // elliptical section, flatter than wide
  const tankRz = 1.27;
  const radial = detail === "high" ? 56 : 28;

  const shellGeo = new THREE.CylinderGeometry(1, 1, tankLen, radial, 1, true);
  shellGeo.rotateZ(Math.PI / 2);
  const shell = add(shellGeo, m.tank, tankCx, tankCy, 0);
  shell.scale.set(1, tankRy, tankRz);

  // Dished ends.
  for (const side of [1, -1]) {
    const cap = new THREE.SphereGeometry(1, radial, Math.round(12 * seg) + 4, 0, Math.PI * 2, 0, Math.PI / 2);
    cap.rotateZ(side > 0 ? -Math.PI / 2 : Math.PI / 2);
    const capMesh = add(cap, m.tank, tankCx + (side * tankLen) / 2, tankCy, 0);
    capMesh.scale.set(0.34, tankRy, tankRz);
  }

  // Stiffening bands (visible seams between compartments).
  const bandXs = [-6.6, -4.4, -2.3, -0.3, 1.3];
  for (const x of bandXs) {
    const band = add(new THREE.CylinderGeometry(1.012, 1.012, 0.05, radial, 1, true), m.steel, x, tankCy, 0, false);
    band.rotation.z = Math.PI / 2;
    band.scale.set(1, tankRy, tankRz);
  }

  // Top walkway, dome covers, fold-down rail.
  const topY = tankCy + tankRy;
  add(new THREE.BoxGeometry(tankLen - 1.4, 0.05, 0.62), m.steel, tankCx, topY + 0.04, 0, false);
  const domeXs = [-7.2, -5.4, -3.4, -1.3, 0.8];
  for (const x of domeXs) {
    add(new THREE.CylinderGeometry(0.3, 0.32, 0.16, 18), m.steel, x, topY + 0.1, 0);
  }
  for (const z of [0.36, -0.36]) {
    add(new THREE.BoxGeometry(tankLen - 1.6, 0.045, 0.045), m.steel, tankCx, topY + 0.38, z, false);
  }
  for (let x = tankCx - tankLen / 2 + 1; x <= tankCx + tankLen / 2 - 1; x += 1.6) {
    for (const z of [0.36, -0.36]) add(new THREE.BoxGeometry(0.04, 0.34, 0.04), m.steel, x, topY + 0.21, z, false);
  }

  // Sub-frame, cabinets, side guard rails.
  add(new THREE.BoxGeometry(tankLen - 0.4, 0.26, 1.5), m.chassis, tankCx, tankCy - tankRy - 0.1, 0);
  add(new THREE.BoxGeometry(1.9, 0.75, 2.36), m.chassis, -0.4, 0.95, 0); // pump / meter cabinet
  add(new THREE.BoxGeometry(0.34, 0.42, 0.34), m.chassis, 1.7, 0.72, 0.85); // landing legs
  add(new THREE.BoxGeometry(0.34, 0.42, 0.34), m.chassis, 1.7, 0.72, -0.85);
  for (const z of [1.2, -1.2]) {
    add(new THREE.CylinderGeometry(0.045, 0.045, 5.2, 8), m.steel, -3.9, 0.82, z, false).rotation.z = Math.PI / 2;
  }
  // Rear bumper, lights, ADR plate.
  add(new THREE.BoxGeometry(0.2, 0.25, 2.45), m.chassis, tankCx - tankLen / 2 - 0.25, 0.72, 0);
  add(new THREE.BoxGeometry(0.05, 0.16, 0.34), m.tail, tankCx - tankLen / 2 - 0.36, 0.95, 0.95, false);
  add(new THREE.BoxGeometry(0.05, 0.16, 0.34), m.tail, tankCx - tankLen / 2 - 0.36, 0.95, -0.95, false);
  add(new THREE.BoxGeometry(0.04, 0.3, 0.4), m.adr, tankCx - tankLen / 2 - 0.37, 0.95, 0, false);

  // ---------------------------------------------------------------- wheels (instanced-like reuse of geometry)
  const wheelRadius = 0.52;
  const tyreGeo = track(new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.36, detail === "high" ? 28 : 16));
  tyreGeo.rotateX(Math.PI / 2);
  const rimGeo = track(new THREE.CylinderGeometry(0.3, 0.3, 0.38, 16));
  rimGeo.rotateX(Math.PI / 2);
  const wheels: THREE.Object3D[] = [];
  const axles: Array<[number, boolean]> = [
    [6.95, false], // tractor steer
    [3.35, true], // tractor drive (dual)
    [-5.25, false],
    [-6.6, false],
    [-7.95, false],
  ];
  for (const [x, dual] of axles) {
    for (const side of [1, -1]) {
      const wheel = new THREE.Group();
      const tyre = new THREE.Mesh(tyreGeo, m.tyre);
      const rim = new THREE.Mesh(rimGeo, m.rim);
      tyre.castShadow = true;
      wheel.add(tyre, rim);
      if (dual) {
        const inner = new THREE.Mesh(tyreGeo, m.tyre);
        inner.position.z = -side * 0.38;
        wheel.add(inner);
      }
      wheel.position.set(x, wheelRadius, side * 1.05);
      group.add(wheel);
      wheels.push(wheel);
    }
    // Mudguards over trailer axles group.
  }
  add(new THREE.BoxGeometry(4.2, 0.06, 2.5), m.chassis, -6.6, 1.15, 0, false);
  add(new THREE.BoxGeometry(1.2, 0.06, 2.55), m.chassis, 6.95, 1.2, 0, false);

  // ---------------------------------------------------------------- logo decal (unmodified image, both sides)
  const attachLogo = (texture: THREE.Texture) => {
    const w = 3.2;
    const h = (w * 192) / 512; // exact aspect of the recovered logo file
    // Lit exactly like the tank shell (same roughness/metalness, shell is pure white), so the logo reads as paint on the
    // tank rather than a sticker. The image itself is untouched; only the scene lighting falls on it, as on the real trailer.
    const decalMat = track(
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.32, metalness: 0.35, polygonOffset: true, polygonOffsetFactor: -2 }),
    );
    for (const side of [1, -1]) {
      const decal = new THREE.Mesh(track(curvedDecalGeometry(side as 1 | -1, w, h)), decalMat);
      decal.receiveShadow = true;
      group.add(decal);
    }
  };

  /**
   * A patch lying on the elliptical tank shell (rear half, as on the real semi-trailer). Rows are spaced by arc length
   * along the ellipse, so the logo keeps its exact proportions while wrapping around the curve.
   */
  function curvedDecalGeometry(side: 1 | -1, width: number, height: number): THREE.BufferGeometry {
    const centreX = -5.4;
    const lift = 1.003; // sits a hair above the paint to avoid z-fighting
    const rows = 32;
    // Arc-length table for the ellipse (y = Ry·sinφ, z = Rz·cosφ), φ measured up from the horizontal side line.
    const steps = 720;
    const phis: number[] = [];
    const arcs: number[] = [];
    let acc = 0;
    for (let i = 0; i <= steps; i++) {
      const phi = -Math.PI / 2 + (Math.PI * i) / steps;
      if (i > 0) {
        const mid = phi - Math.PI / steps / 2;
        acc += Math.hypot(tankRy * Math.cos(mid), tankRz * Math.sin(mid)) * (Math.PI / steps);
      }
      phis.push(phi);
      arcs.push(acc);
    }
    const phiAtArc = (sArc: number) => {
      let i = 1;
      while (i < arcs.length - 1 && arcs[i]! < sArc) i++;
      const a0 = arcs[i - 1]!;
      const a1 = arcs[i]!;
      const t = a1 === a0 ? 0 : (sArc - a0) / (a1 - a0);
      return phis[i - 1]! + t * (phis[i]! - phis[i - 1]!);
    };
    const centrePhi = Math.asin(0.18 / tankRy);
    const centreArc = arcs[Math.round(((centrePhi + Math.PI / 2) / Math.PI) * steps)]!;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let j = 0; j <= rows; j++) {
      const v = j / rows;
      const phi = phiAtArc(centreArc + (v - 0.5) * height);
      const y = tankCy + tankRy * Math.sin(phi) * lift;
      const z = side * tankRz * Math.cos(phi) * lift;
      const n = new THREE.Vector3(0, Math.sin(phi) / tankRy, (side * Math.cos(phi)) / tankRz).normalize();
      for (let i = 0; i <= 1; i++) {
        // Seen from its own side the logo always reads left-to-right (never mirrored).
        const x = centreX + (side > 0 ? i - 0.5 : 0.5 - i) * width;
        positions.push(x, y, z);
        normals.push(n.x, n.y, n.z);
        uvs.push(i, v);
      }
    }
    for (let j = 0; j < rows; j++) {
      const a = j * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, d, a, d, c);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }
  if (logoTexture) attachLogo(logoTexture);

  // ---------------------------------------------------------------- headlight
  const headlight = new THREE.SpotLight(0xfff0d8, detail === "high" ? 60 : 30, 45, Math.PI / 7, 0.55, 1.6);
  headlight.position.set(cabFront + 0.3, 1.3, 0);
  headlight.target.position.set(cabFront + 20, 0, 0);
  group.add(headlight, headlight.target);

  return {
    group,
    wheels,
    wheelRadius,
    anchors: {
      loadingPort: new THREE.Vector3(-3.4, topY + 0.2, 0),
      dischargePort: new THREE.Vector3(-0.4, 0.95, -1.2),
      rear: new THREE.Vector3(tankCx - tankLen / 2 - 0.4, 0, 0),
      front: new THREE.Vector3(cabFront + 0.2, 0, 0),
    },
    headlight,
    attachLogo,
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}
