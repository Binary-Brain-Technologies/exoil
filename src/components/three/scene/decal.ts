import * as THREE from "three";

/**
 * A logo patch laid onto an arbitrary tank shell (the generated trailer mesh) by ray casting. Rows are spaced by arc
 * length along the surface, so the image keeps its exact proportions while wrapping around the curve, and the patch
 * is never mirrored: seen from its own side it always reads left-to-right.
 */
export interface SurfaceDecalOptions {
  /** +1: the +Z side of the tank, -1: the -Z side. */
  side: 1 | -1;
  /** Centre of the patch along the tank (X) and its height (Y), in the target's space. */
  centreX: number;
  centreY: number;
  /** Size along the surface, in metres. Height / width must be the image's aspect ratio. */
  width: number;
  height: number;
  /** Distance the patch floats off the paint (avoids z-fighting). */
  lift?: number;
  columns?: number;
  rows?: number;
}

/**
 * Returns a geometry in the target's space, or null when the shell was not found under the patch (a malformed
 * mesh) — the caller then simply shows no decal rather than a floating one.
 */
export function surfaceDecalGeometry(target: THREE.Object3D, o: SurfaceDecalOptions): THREE.BufferGeometry | null {
  const { side, centreX, centreY, width, height } = o;
  const lift = o.lift ?? 0.006;
  const columns = o.columns ?? 12;
  const rows = o.rows ?? 24;
  target.updateMatrixWorld(true);

  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const dir = new THREE.Vector3(0, 0, -side);
  const far = 20;
  /** Horizontal ray from outside the tank towards its axis; first surface hit on this side. */
  const hit = (x: number, y: number) => {
    origin.set(x, y, side * far);
    raycaster.set(origin, dir);
    raycaster.far = far;
    const h = raycaster.intersectObject(target, true)[0];
    if (!h || h.point.z * side <= 0) return null;
    return h.point.clone();
  };

  // Profile of the shell at the patch centre: arc length as a function of height.
  // Just past the patch edges (arc ≥ half-height), but not so far that rails below or above the logo band get sampled.
  const span = height * 0.62;
  const steps = 96;
  const ys: number[] = [];
  const arcs: number[] = [];
  let prev: THREE.Vector3 | null = null;
  let acc = 0;
  for (let i = 0; i <= steps; i++) {
    const y = centreY - span + (2 * span * i) / steps;
    const h = hit(centreX, y);
    if (!h) return null;
    if (prev) acc += Math.hypot(h.y - prev.y, h.z - prev.z);
    prev = h;
    ys.push(y);
    arcs.push(acc);
  }
  const centreArc = arcs[steps / 2]!;
  const yAtArc = (s: number) => {
    let i = 1;
    while (i < arcs.length - 1 && arcs[i]! < s) i++;
    const a0 = arcs[i - 1]!;
    const a1 = arcs[i]!;
    const t = a1 === a0 ? 0 : (s - a0) / (a1 - a0);
    return ys[i - 1]! + t * (ys[i]! - ys[i - 1]!);
  };

  const positions: number[] = [];
  const uvs: number[] = [];
  for (let j = 0; j <= rows; j++) {
    const v = j / rows;
    const y = yAtArc(centreArc + (v - 0.5) * height);
    for (let i = 0; i <= columns; i++) {
      const u = i / columns;
      // Seen from the +Z side screen-right is +X; from the -Z side it is -X.
      const x = centreX + (side > 0 ? u - 0.5 : 0.5 - u) * width;
      const h = hit(x, y);
      if (!h) return null;
      // Lifted straight back along the ray: generated meshes have noisy face normals, the ray direction is stable.
      positions.push(h.x, h.y, h.z + side * lift);
      uvs.push(u, v);
    }
  }
  const indices: number[] = [];
  const stride = columns + 1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      const a = j * stride + i;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      // Counter-clockwise seen from outside on both sides (columns already run the other way on the -Z side).
      indices.push(a, b, d, a, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  // Smooth normals from the patch itself (it follows the shell, without the shell's bake noise).
  geo.computeVertexNormals();
  return geo;
}

/**
 * The triangles of `source` that touch `box`, in the space of `relativeTo` (e.g. the vehicle group, wherever it is on
 * the road). Ray casting a whole 36k-triangle vehicle hundreds of times would block the main thread; the region under
 * a logo is a few thousand triangles.
 */
export function regionMesh(source: THREE.Mesh, box: THREE.Box3, relativeTo?: THREE.Object3D): THREE.Mesh {
  source.updateWorldMatrix(true, false);
  const toLocal = new THREE.Matrix4();
  if (relativeTo) {
    relativeTo.updateWorldMatrix(true, false);
    toLocal.copy(relativeTo.matrixWorld).invert();
  }
  const m = toLocal.multiply(source.matrixWorld);
  const geo = source.geometry;
  const pos = geo.getAttribute("position");
  const index = geo.getIndex();
  const count = index ? index.count : pos.count;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const tri = new THREE.Box3();
  const out: number[] = [];
  for (let t = 0; t < count; t += 3) {
    const ia = index ? index.getX(t) : t;
    const ib = index ? index.getX(t + 1) : t + 1;
    const ic = index ? index.getX(t + 2) : t + 2;
    a.fromBufferAttribute(pos, ia).applyMatrix4(m);
    b.fromBufferAttribute(pos, ib).applyMatrix4(m);
    c.fromBufferAttribute(pos, ic).applyMatrix4(m);
    tri.makeEmpty().expandByPoint(a).expandByPoint(b).expandByPoint(c);
    if (tri.intersectsBox(box)) out.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }
  const region = new THREE.BufferGeometry();
  region.setAttribute("position", new THREE.Float32BufferAttribute(out, 3));
  // Both faces: a ray must hit the shell whichever way the generator wound its triangles.
  return new THREE.Mesh(region, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
}
