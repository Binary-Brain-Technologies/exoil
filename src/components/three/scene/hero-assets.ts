import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { SITE_MODEL_URLS, VEHICLE_MODEL_URLS } from "./hero-model-urls";

/**
 * The generated hero models (built by scripts/build-hero-models.mjs: meshopt geometry, WebP textures, ≈ 4 MB in total).
 * All are already in scene metres (+X forward, ground at y = 0); the tractor and trailer are pre-placed so they
 * couple at the fifth wheel. See docs/hero-3d-models.md.
 *
 * They load in two groups: the vehicle (≈ 1.8 MB, needed for the first frame) and the site props (the base and the
 * customer site, reached only after some scrolling), which stream in behind it.
 * Loaded roots are kept whole: quantised meshes carry their de-quantising transform on the glTF node.
 */
export interface VehicleAssets {
  tractor: THREE.Object3D;
  trailer: THREE.Object3D;
  /** The trailer's single mesh (the tank shell the logo is laid onto). */
  trailerMesh: THREE.Mesh;
  dispose(): void;
}

export interface SiteAssets {
  gantry: THREE.Object3D;
  storageTank: THREE.Object3D;
  customerTank: THREE.Object3D;
  customerHall: THREE.Object3D;
  dispose(): void;
}

type Detail = "high" | "low";

function firstMesh(root: THREE.Object3D): THREE.Mesh {
  let found: THREE.Mesh | null = null;
  root.traverse((o) => {
    if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
  });
  if (!found) throw new Error("hero model without a mesh");
  return found;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      for (const value of Object.values(m)) if (value instanceof THREE.Texture) value.dispose();
      m.dispose();
    }
  });
}

function prepare(root: THREE.Object3D, detail: Detail, maxAnisotropy: number) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const m = mesh.material as THREE.MeshStandardMaterial;
    if (m.map) m.map.anisotropy = Math.min(8, maxAnisotropy);
    if (detail === "low" && m.normalMap) {
      // Weak GPUs: drop the normal map (the colour map carries most of the detail) to save memory and bandwidth.
      m.normalMap.dispose();
      m.normalMap = null;
      m.needsUpdate = true;
    }
  });
}

interface LoadOptions {
  detail: Detail;
  maxAnisotropy: number;
  signal: AbortSignal;
  /** Rejects after this long (the scene then keeps its procedural stand-ins). */
  timeoutMs?: number;
}

/** Loads a group of models; all or nothing. Whatever arrives after a failure, timeout or abort is disposed. */
async function loadGroup(urls: readonly string[], { detail, maxAnisotropy, signal, timeoutMs }: LoadOptions) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const all = Promise.all(urls.map((url) => loader.loadAsync(url).then((g) => g.scene)));
  let timer = 0;
  const timeout = new Promise<never>((_, reject) => {
    if (timeoutMs !== undefined) timer = window.setTimeout(() => reject(new Error("hero models timed out")), timeoutMs);
  });
  try {
    const roots = await Promise.race([all, timeout]);
    if (signal.aborted) throw new Error("aborted");
    roots.forEach((r) => prepare(r, detail, maxAnisotropy));
    return roots;
  } catch (err) {
    all.then((roots) => roots.forEach(disposeObject)).catch(() => {});
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function loadVehicleAssets(options: LoadOptions): Promise<VehicleAssets> {
  const roots = await loadGroup(VEHICLE_MODEL_URLS, options);
  const tractor = roots[0]!;
  const trailer = roots[1]!;
  return { tractor, trailer, trailerMesh: firstMesh(trailer), dispose: () => roots.forEach(disposeObject) };
}

export async function loadSiteAssets(options: LoadOptions): Promise<SiteAssets> {
  const roots = await loadGroup(SITE_MODEL_URLS, options);
  return {
    gantry: roots[0]!,
    storageTank: roots[1]!,
    customerTank: roots[2]!,
    customerHall: roots[3]!,
    dispose: () => roots.forEach(disposeObject),
  };
}
