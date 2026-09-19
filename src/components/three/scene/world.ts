import * as THREE from "three";

/**
 * Static environment for the journey: a night road along +X, a fuel base with a loading gantry,
 * and a customer site with a double-wall storage tank. Deliberately abstract — this explains the
 * system; the photography elsewhere on the site proves it is real.
 */

export const LAYOUT = {
  roadStart: -190,
  roadEnd: 170,
  gantryX: -40,
  customerX: 104,
  customerTank: new THREE.Vector3(104, 0, -9.5),
};

export interface World {
  group: THREE.Group;
  loadingArm: THREE.Mesh;
  loadingArmTop: number;
  customerTank: {
    group: THREE.Group;
    outer: THREE.Mesh;
    outerMaterial: THREE.MeshStandardMaterial;
    level: THREE.Mesh;
    inletTop: THREE.Vector3;
    height: number;
  };
  trace: THREE.Mesh;
  dispose(): void;
}

function stripeTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 8;
  const g = c.getContext("2d");
  if (g) {
    g.fillStyle = "#3a0c09";
    g.fillRect(0, 0, 64, 8);
    g.fillStyle = "#f08a00";
    g.fillRect(0, 0, 20, 8);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createWorld(detail: "high" | "low", { doubleWall = false }: { doubleWall?: boolean } = {}): World {
  const group = new THREE.Group();
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);
  const mat = (params: THREE.MeshStandardMaterialParameters) => track(new THREE.MeshStandardMaterial(params));
  const mesh = (geo: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(track(geo), material);
    m.position.set(x, y, z);
    m.receiveShadow = true;
    m.castShadow = true;
    group.add(m);
    return m;
  };

  const asphalt = mat({ color: 0x1b1918, roughness: 0.82, metalness: 0.05 });
  const ground = mat({ color: 0x0d0c0b, roughness: 1 });
  const concrete = mat({ color: 0x4a4744, roughness: 0.9 });
  const steel = mat({ color: 0x7d8388, roughness: 0.45, metalness: 0.7 });
  const darkSteel = mat({ color: 0x2c2f32, roughness: 0.6, metalness: 0.5 });
  const paint = mat({ color: 0xcfcfca, roughness: 0.55 });
  const lamp = mat({ color: 0xffffff, emissive: 0xffe2b0, emissiveIntensity: 1.6 });

  // Ground and road.
  const roadLen = LAYOUT.roadEnd - LAYOUT.roadStart;
  const roadCx = (LAYOUT.roadEnd + LAYOUT.roadStart) / 2;
  const groundMesh = mesh(new THREE.PlaneGeometry(600, 300), ground, roadCx, -0.02, 0);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.castShadow = false;
  const road = mesh(new THREE.PlaneGeometry(roadLen, 8), asphalt, roadCx, 0, 0);
  road.rotation.x = -Math.PI / 2;
  road.castShadow = false;

  // Lane dashes and edge lines (instanced).
  const dashMat = mat({ color: 0xbdbab3, roughness: 0.6 });
  const dashGeo = track(new THREE.PlaneGeometry(3, 0.14));
  const count = Math.floor(roadLen / 9);
  const dashes = new THREE.InstancedMesh(dashGeo, dashMat, count);
  const d = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    d.position.set(LAYOUT.roadStart + i * 9 + 2, 0.012, 0);
    d.rotation.set(-Math.PI / 2, 0, 0);
    d.updateMatrix();
    dashes.setMatrixAt(i, d.matrix);
  }
  dashes.receiveShadow = true;
  group.add(dashes);
  for (const z of [3.7, -3.7]) {
    const edge = mesh(new THREE.PlaneGeometry(roadLen, 0.12), dashMat, roadCx, 0.011, z);
    edge.rotation.x = -Math.PI / 2;
    edge.castShadow = false;
  }

  // Route trace: a flat ribbon on the road that grows behind the tanker.
  const traceMat = mat({ color: 0x4a0b08, emissive: 0xda251d, emissiveIntensity: 0.55, roughness: 0.6 });
  const trace = mesh(new THREE.PlaneGeometry(1, 0.16), traceMat, 0, 0.018, 0.95);
  trace.rotation.x = -Math.PI / 2;
  trace.castShadow = false;
  trace.scale.x = 0.001;

  // ------------------------------------------------------------ fuel base (loading gantry + storage)
  const gx = LAYOUT.gantryX;
  const apron = mesh(new THREE.PlaneGeometry(40, 30), concrete, gx, 0.005, -10);
  apron.rotation.x = -Math.PI / 2;
  apron.castShadow = false;
  for (const x of [gx - 5, gx + 5]) for (const z of [-4.6, 4.6]) mesh(new THREE.BoxGeometry(0.4, 7.4, 0.4), steel, x, 3.7, z);
  mesh(new THREE.BoxGeometry(11.5, 0.5, 10.4), darkSteel, gx, 7.55, 0);
  // Operator walkway at tank-top height, on the far side of the loading lane.
  mesh(new THREE.BoxGeometry(9, 0.12, 1.2), steel, gx, 3.9, -4.2);
  mesh(new THREE.BoxGeometry(9, 0.05, 0.05), steel, gx, 4.9, -4.75);
  // Loading arm: a pipe that descends onto the tank dome.
  const armTop = 7.3;
  const arm = mesh(new THREE.CylinderGeometry(0.13, 0.13, 1, 12), steel, gx - 0.2, armTop - 0.5, 0);
  arm.geometry.translate(0, -0.5, 0); // pivot at the top
  arm.position.y = armTop;
  arm.scale.y = 0.4;
  for (const x of [gx - 3, gx + 3]) {
    mesh(new THREE.BoxGeometry(1.4, 0.06, 0.5), lamp, x, 7.27, 0).castShadow = false;
  }
  // Storage tanks behind the gantry.
  const storageMat = mat({ color: 0xb9bab5, roughness: 0.5, metalness: 0.3 });
  for (const [x, r] of [
    [gx - 16, 6],
    [gx, 7],
    [gx + 17, 5.5],
  ] as const) {
    mesh(new THREE.CylinderGeometry(r, r, 11, detail === "high" ? 40 : 20), storageMat, x, 5.5, -30);
    mesh(new THREE.CylinderGeometry(r + 0.05, r + 0.05, 0.15, detail === "high" ? 40 : 20), darkSteel, x, 11.05, -30);
  }

  // ------------------------------------------------------------ customer site
  const cx = LAYOUT.customerX;
  const pad = mesh(new THREE.PlaneGeometry(30, 18), concrete, cx, 0.005, -12);
  pad.rotation.x = -Math.PI / 2;
  pad.castShadow = false;
  // Hall.
  mesh(new THREE.BoxGeometry(22, 8, 12), paint, cx + 4, 4, -24);
  mesh(new THREE.BoxGeometry(5, 4.5, 0.2), darkSteel, cx - 1, 2.25, -17.9);
  mesh(new THREE.BoxGeometry(5, 4.5, 0.2), darkSteel, cx + 7, 2.25, -17.9);
  // Site light.
  mesh(new THREE.BoxGeometry(0.15, 6, 0.15), steel, cx - 6, 3, -6);
  mesh(new THREE.BoxGeometry(1.2, 0.08, 0.5), lamp, cx - 5.5, 6, -6).castShadow = false;

  // Customer tank. The outer wall fades to reveal the level; the inner (second) wall is modelled only when the
  // double-wall tank offer is confirmed — otherwise it is a plain tank.
  const tankGroup = new THREE.Group();
  tankGroup.position.copy(LAYOUT.customerTank);
  group.add(tankGroup);
  const tankH = 3.2;
  const outerMaterial = mat({ color: 0x8b9095, roughness: 0.55, metalness: 0.35, transparent: true, opacity: 1 });
  const outer = new THREE.Mesh(track(new THREE.CylinderGeometry(1.45, 1.45, tankH, 40)), outerMaterial);
  outer.position.y = tankH / 2 + 0.25;
  outer.castShadow = true;
  const innerMat = mat({ color: 0x9aa0a5, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 0.35, depthWrite: false });
  const inner = new THREE.Mesh(track(new THREE.CylinderGeometry(1.28, 1.28, tankH - 0.25, 40, 1, true)), innerMat);
  inner.position.y = tankH / 2 + 0.25;
  const fuelMat = mat({ color: 0x6a4a12, emissive: 0xf08a00, emissiveIntensity: 0.6, roughness: 0.2, transparent: true, opacity: 0.95 });
  const levelGeo = track(new THREE.CylinderGeometry(1.24, 1.24, 1, 40));
  levelGeo.translate(0, 0.5, 0);
  const level = new THREE.Mesh(levelGeo, fuelMat);
  level.position.y = 0.4;
  level.scale.y = 0.18 * (tankH - 0.4);
  const lid = new THREE.Mesh(track(new THREE.CylinderGeometry(0.35, 0.35, 0.18, 20)), mat({ color: 0xda251d, roughness: 0.5 }));
  lid.position.y = tankH + 0.34;
  const skid = new THREE.Mesh(track(new THREE.BoxGeometry(3.4, 0.25, 3.4)), darkSteel);
  skid.position.y = 0.125;
  inner.visible = doubleWall;
  tankGroup.add(outer, inner, level, lid, skid);

  return {
    group,
    loadingArm: arm,
    loadingArmTop: armTop,
    customerTank: {
      group: tankGroup,
      outer,
      outerMaterial,
      level,
      inletTop: new THREE.Vector3(LAYOUT.customerTank.x, tankH + 0.3, LAYOUT.customerTank.z + 1.2),
      height: tankH - 0.4,
    },
    trace,
    dispose() {
      for (const x of disposables) x.dispose();
      dashes.dispose();
    },
  };
}

/** Delivery hose from the tanker discharge port to the customer tank inlet, with a moving flow texture. */
export function createHose(from: THREE.Vector3, to: THREE.Vector3) {
  const mid = from.clone().lerp(to, 0.5);
  mid.y = 0.12;
  const curve = new THREE.CatmullRomCurve3([
    from,
    from.clone().add(new THREE.Vector3(0, -0.6, -0.8)),
    mid,
    to.clone().add(new THREE.Vector3(0, -1.2, 0.9)),
    to,
  ]);
  const texture = stripeTexture();
  texture.repeat.set(40, 1);
  const geometry = new THREE.TubeGeometry(curve, 96, 0.075, 10, false);
  const material = new THREE.MeshStandardMaterial({ color: 0x222222, map: texture, emissiveMap: texture, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.6 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  // drawRange lets the hose "connect" progressively.
  const totalIndices = geometry.index ? geometry.index.count : 0;
  return {
    mesh,
    texture,
    material,
    setConnected(t: number) {
      geometry.setDrawRange(0, Math.floor(totalIndices * THREE.MathUtils.clamp(t, 0, 1)));
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
