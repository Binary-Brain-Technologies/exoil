import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createTanker } from "./tanker";
import { createHose, createWorld, LAYOUT } from "./world";

/**
 * The homepage journey: SOURCE → LOAD → ROUTE → DELIVER → STORE, driven by a single progress value (0–1)
 * that the page's scroll position provides. Everything is deterministic in `progress`, so scrolling back
 * reverses the story exactly. Motion is smoothed with a slow critically-damped follow to read as mass.
 */

export type Detail = "high" | "low";

export const CHAPTER_BOUNDS = [0, 0.2, 0.4, 0.6, 0.8, 1] as const;

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** 0→1 as p moves from a to b, eased. */
const phase = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));

const TANKER_Z = -1.6;

/** Tanker X along the road by progress (piecewise, eased — accelerates and brakes like a loaded vehicle). */
const TANKER_KEYS: Array<[number, number]> = [
  [0, -150],
  [0.14, -80],
  [0.22, LAYOUT.gantryX - 0.2 + 3.4],
  [0.38, LAYOUT.gantryX - 0.2 + 3.4],
  [0.64, LAYOUT.customerX - 3],
  [1, LAYOUT.customerX - 3],
];

function keyed(keys: Array<[number, number]>, p: number): number {
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, v0] = keys[i]!;
    const [p1, v1] = keys[i + 1]!;
    if (p <= p1) return v0 + (v1 - v0) * phase(p, p0, p1);
  }
  return keys[keys.length - 1]![1];
}

type Vec = [number, number, number];
interface CamKey {
  p: number;
  pos: Vec;
  look: Vec;
  /** Positions relative to the tanker instead of the world. */
  rel?: boolean;
}

const gx = LAYOUT.gantryX;
const cx = LAYOUT.customerX;
const tz = LAYOUT.customerTank.z;

const CAMERA_KEYS: CamKey[] = [
  { p: 0.0, pos: [-58, 1.5, 5.5], look: [-150, 2.2, TANKER_Z] },
  { p: 0.12, pos: [20, 2.6, 10], look: [2, 2.2, 0], rel: true },
  { p: 0.22, pos: [gx + 19, 10.5, 27], look: [gx - 1, 3, -3] },
  { p: 0.33, pos: [gx + 10, 7.4, 17], look: [gx - 2, 3.6, -1] },
  { p: 0.44, pos: [0, 3.2, 16], look: [1, 2.1, 0], rel: true },
  { p: 0.52, pos: [-24, 6, 4], look: [10, 2, 0], rel: true },
  { p: 0.6, pos: [-34, 40, 28], look: [10, 0, 0], rel: true },
  { p: 0.7, pos: [cx - 13, 6.5, -18], look: [cx - 3, 1.4, -5] },
  // Swing around the yard (not over the tank) on the way to the tank close-up.
  { p: 0.76, pos: [cx - 3, 7.5, -19], look: [cx, 1.8, tz] },
  { p: 0.79, pos: [cx + 8, 6.8, -15.5], look: [cx, 1.8, tz] },
  { p: 0.82, pos: [cx + 9, 6, -5], look: [cx, 1.8, tz] },
  { p: 0.92, pos: [cx + 5.5, 4.2, -5.6], look: [cx, 1.9, tz] },
  { p: 1.0, pos: [cx - 14, 34, 26], look: [cx - 12, 0, -6] },
];

export interface JourneyHandle {
  setProgress(p: number): void;
  resize(width: number, height: number): void;
  start(): void;
  stop(): void;
  dispose(): void;
}

export function createJourney(
  canvas: HTMLCanvasElement,
  { detail, doubleWall = false, onReady, onDowngrade }: { detail: Detail; doubleWall?: boolean; onReady?: () => void; onDowngrade?: () => void },
): JourneyHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: detail === "high", powerPreference: "high-performance", alpha: false });
  let dpr = Math.min(window.devicePixelRatio || 1, detail === "high" ? 1.75 : 1.25);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = detail === "high";
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const night = new THREE.Color(0x121010);
  scene.background = night;
  scene.fog = new THREE.Fog(night, 45, 250);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envMap = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0.22;

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.5, 600);

  // Lighting: dim sky, one cool "moon" key with shadows, plus the tanker's own headlight.
  scene.add(new THREE.HemisphereLight(0x5b6678, 0x0b0a09, 0.9));
  const moon = new THREE.DirectionalLight(0xcdd6e6, 1.6);
  moon.castShadow = detail === "high";
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.left = -22;
  moon.shadow.camera.right = 22;
  moon.shadow.camera.top = 16;
  moon.shadow.camera.bottom = -16;
  moon.shadow.camera.far = 120;
  moon.shadow.bias = -0.0004;
  scene.add(moon, moon.target);
  const gantryLight = new THREE.PointLight(0xffd9a0, 90, 26, 1.6);
  gantryLight.position.set(gx, 6.8, 0);
  const siteLight = new THREE.PointLight(0xffd9a0, 70, 24, 1.6);
  siteLight.position.set(cx - 5.5, 5.6, -6);
  scene.add(gantryLight, siteLight);

  const world = createWorld(detail, { doubleWall });
  scene.add(world.group);

  const loader = new THREE.TextureLoader();
  let logoTexture: THREE.Texture | null = null;
  const tanker = createTanker({ logoTexture: null, detail });
  tanker.group.position.set(TANKER_KEYS[0]![1], 0, TANKER_Z);
  scene.add(tanker.group);
  // Logo decal is added once the unmodified image has loaded.
  loader.load("/brand/exoil-logo-on-white.png", (tex) => {
    if (disposed) {
      tex.dispose();
      return;
    }
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    logoTexture = tex;
    tanker.attachLogo(tex);
    needsRender = true;
    wake();
  });

  // Delivery hose (built once, in world space, for the parked position).
  const parkedX = TANKER_KEYS[TANKER_KEYS.length - 1]![1];
  const hoseFrom = tanker.anchors.dischargePort.clone().add(new THREE.Vector3(parkedX, 0, TANKER_Z));
  const hose = createHose(hoseFrom, world.customerTank.inletTop, world.customerTank.hoseApproach);
  hose.setConnected(0);
  scene.add(hose.mesh);

  const traceStartX = TANKER_KEYS[0]![1] + tanker.anchors.rear.x;

  // --------------------------------------------------------------- state
  let target = 0;
  let shown = 0;
  let lastTankerX = tanker.group.position.x;
  let running = false;
  let raf = 0;
  let last = performance.now();
  let needsRender = true;
  let readyFired = false;
  let disposed = false;
  let settleFrames = 90;
  let idle = false;
  const frameTimes: number[] = [];
  let downgraded = detail === "low";

  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpLookA = new THREE.Vector3();
  const tmpLookB = new THREE.Vector3();
  let camInitialised = false;

  function resolveKey(k: CamKey, tankerX: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
    const ox = k.rel ? tankerX : 0;
    const oz = k.rel ? TANKER_Z : 0;
    outPos.set(k.pos[0] + ox, k.pos[1], k.pos[2] + oz);
    outLook.set(k.look[0] + ox, k.look[1], k.look[2] + oz);
  }

  function cameraAt(p: number, tankerX: number) {
    let i = 0;
    while (i < CAMERA_KEYS.length - 2 && p > CAMERA_KEYS[i + 1]!.p) i++;
    const a = CAMERA_KEYS[i]!;
    const b = CAMERA_KEYS[i + 1]!;
    const t = phase(p, a.p, b.p);
    resolveKey(a, tankerX, tmpA, tmpLookA);
    resolveKey(b, tankerX, tmpB, tmpLookB);
    return { pos: tmpA.lerp(tmpB, t), look: tmpLookA.lerp(tmpLookB, t) };
  }

  function apply(p: number, dt: number) {
    // Tanker.
    const x = keyed(TANKER_KEYS, p);
    tanker.group.position.x = x;
    const dx = x - lastTankerX;
    lastTankerX = x;
    for (const w of tanker.wheels) w.rotation.z -= dx / tanker.wheelRadius;

    // Route trace from the start of the journey to the tanker's rear.
    const rearX = x + tanker.anchors.rear.x;
    const len = Math.max(0.001, rearX - traceStartX);
    world.trace.scale.x = len;
    world.trace.position.set(traceStartX + len / 2, 0.018, TANKER_Z);

    // Loading arm down (0.25→0.29), up (0.34→0.37).
    const armLen = 0.4 + (world.loadingArmTop - 3.95 - 0.4) * (phase(p, 0.245, 0.29) - phase(p, 0.34, 0.37));
    world.loadingArm.scale.y = armLen;

    // Hose connects and flows.
    hose.setConnected(phase(p, 0.66, 0.72));
    const flowing = p > 0.72 && p < 0.93;
    hose.material.emissiveIntensity = flowing ? 0.9 : 0;
    if (flowing) hose.texture.offset.x -= dt * 1.4;

    // Customer tank: outer wall fades to reveal the inner tank and the rising level.
    const cut = phase(p, 0.8, 0.87);
    world.customerTank.outerMaterial.opacity = 1 - cut * 0.8;
    world.customerTank.outerMaterial.depthWrite = cut < 0.5;
    world.customerTank.level.scale.y = world.customerTank.height * (0.16 + 0.66 * phase(p, 0.73, 0.92));

    // Camera with a slow follow (mass, no shake).
    const c = cameraAt(p, x);
    if (!camInitialised) {
      camPos.copy(c.pos);
      camLook.copy(c.look);
      camInitialised = true;
    } else {
      const k = 1 - Math.exp(-dt * 3.2);
      camPos.lerp(c.pos, k);
      camLook.lerp(c.look, k);
    }
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    // Moon shadow frustum follows the action.
    moon.position.set(x + 18, 36, 22);
    moon.target.position.set(x, 0, 0);
  }

  /** Restarts the rAF loop after it went idle (scroll, resize, texture loaded). */
  function wake() {
    if (!running || !idle) return;
    idle = false;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const prev = shown;
    shown += (target - shown) * (1 - Math.exp(-dt * 5));
    if (Math.abs(target - shown) < 0.00005) shown = target;
    // Keep rendering while progress moves and for ~1.5 s after, so the damped camera can settle.
    if (Math.abs(shown - prev) > 1e-6) settleFrames = 90;
    else settleFrames = Math.max(0, settleFrames - 1);
    const flowing = shown > 0.72 && shown < 0.93;
    if (settleFrames === 0 && !flowing && !needsRender) {
      // Nothing moves: stop requesting frames entirely until something wakes the loop.
      idle = true;
      return;
    }
    raf = requestAnimationFrame(frame);
    needsRender = false;

    apply(shown, dt);
    const t0 = performance.now();
    renderer.render(scene, camera);
    if (!readyFired) {
      readyFired = true;
      onReady?.();
    }

    // Adaptive quality: if frames are consistently slow, drop DPR and shadows once.
    frameTimes.push(performance.now() - t0 + dt * 1000 * 0.5);
    if (frameTimes.length > 90) frameTimes.shift();
    if (!downgraded && frameTimes.length === 90) {
      const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      if (avg > 22) {
        downgraded = true;
        dpr = 1;
        renderer.setPixelRatio(dpr);
        renderer.shadowMap.enabled = false;
        moon.castShadow = false;
        onDowngrade?.();
      }
    }
  }

  return {
    setProgress(p) {
      target = clamp01(p);
      wake();
    },
    resize(width, height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      // Narrower viewports get a wider field of view so the tanker stays in frame.
      camera.fov = camera.aspect < 1.1 ? 46 : 34;
      camera.updateProjectionMatrix();
      needsRender = true;
      wake();
    },
    start() {
      if (running) return;
      running = true;
      idle = false;
      last = performance.now();
      needsRender = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose() {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      tanker.dispose();
      world.dispose();
      hose.dispose();
      logoTexture?.dispose();
      envMap.dispose();
      envScene.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
