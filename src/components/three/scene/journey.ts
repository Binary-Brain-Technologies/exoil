import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createCinematic, createHeadlightBeams, type Cinematic } from "./cinematic";
import type { SiteAssets, VehicleAssets } from "./hero-assets";
import { createTanker, type Tanker } from "./tanker";
import { createModelTanker } from "./tanker-model";
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

/**
 * Tanker X along the road by progress (piecewise, eased — accelerates and brakes like a loaded vehicle).
 * At the gantry it stops with its loading port (middle dome) under the drop pipe.
 */
function tankerKeys(loadingPortX: number): Array<[number, number]> {
  const atGantry = LAYOUT.gantryX - 0.2 - loadingPortX;
  return [
    [0, -150],
    [0.14, -80],
    [0.22, atGantry],
    [0.38, atGantry],
    [0.64, LAYOUT.customerX - 3],
    [1, LAYOUT.customerX - 3],
  ];
}

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
  // Opening frame: low, close, in front of the oncoming tanker — headlights and cab fill the shot.
  { p: 0.0, pos: [15, 0.9, 7.5], look: [0.5, 2.2, 0], rel: true },
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

/** Sky dome with a vertical gradient; re-centred on the camera every frame so it is always "at infinity". */
function createSky(horizon: THREE.Color, zenith: THREE.Color) {
  const geo = new THREE.SphereGeometry(500, 32, 16);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uHorizon: { value: horizon }, uZenith: { value: zenith } },
    vertexShader: /* glsl */ `
      varying float vH;
      void main() {
        vH = normalize(position).y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uHorizon;
      uniform vec3 uZenith;
      varying float vH;
      void main() {
        gl_FragColor = vec4(mix(uHorizon, uZenith, smoothstep(-0.02, 0.35, vH)), 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;
  return {
    mesh,
    dispose() {
      geo.dispose();
      material.dispose();
    },
  };
}

export interface JourneyHandle {
  setProgress(p: number): void;
  /** Swaps the procedural base and customer site for the generated models once they have streamed in. */
  setSite(site: SiteAssets): void;
  /** Swaps the procedural tanker for the generated one when it arrives after the scene has started. */
  setVehicle(vehicle: VehicleAssets): void;
  resize(width: number, height: number): void;
  start(): void;
  stop(): void;
  dispose(): void;
}

export function createJourney(
  canvas: HTMLCanvasElement,
  {
    detail,
    doubleWall = false,
    vehicle: initialVehicle = null,
    onReady,
    onDowngrade,
  }: {
    detail: Detail;
    doubleWall?: boolean;
    /** The generated tanker; without it the scene uses the procedural one. */
    vehicle?: VehicleAssets | null;
    onReady?: () => void;
    onDowngrade?: () => void;
  },
): JourneyHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: detail === "high", powerPreference: "high-performance", alpha: false });
  let dpr = Math.min(window.devicePixelRatio || 1, detail === "high" ? 1.75 : 1.25);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = detail === "high";
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  // Night sky: near-black overhead, a faint warm glow at the horizon (distant sodium light); fog uses the horizon
  // colour so the far road dissolves into it rather than into a flat void.
  const horizon = new THREE.Color(0x1d1714);
  scene.background = new THREE.Color(0x121010);
  scene.fog = new THREE.Fog(horizon, 45, 250);
  const sky = createSky(horizon, new THREE.Color(0x09090b));
  scene.add(sky.mesh);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envMap = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0.22;

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.5, 600);
  // `?nofx` (QA): the scene without post-processing, like the adaptive-quality fallback.
  let cinematic: Cinematic | null =
    detail === "high" && !new URLSearchParams(window.location.search).has("nofx") ? createCinematic(renderer, scene, camera) : null;

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
  // Work lights. The generated tank is a real white with a glossy clear coat, so it needs far less light than the
  // flat procedural shell to read as white (and not blow out under the bloom).
  const gantryLight = new THREE.PointLight(0xffd9a0, 90, 26, 1.6);
  const siteLight = new THREE.PointLight(0xffd9a0, 70, 24, 1.6);
  siteLight.position.set(cx - 5.5, 5.6, -6);
  scene.add(gantryLight, siteLight);
  const lightFor = (generated: boolean) => {
    gantryLight.intensity = generated ? 34 : 90;
    gantryLight.position.set(gx, generated ? 6.4 : 6.8, generated ? TANKER_Z - 2.6 : 0);
    siteLight.intensity = generated ? 26 : 70;
  };
  let vehicle = initialVehicle;
  lightFor(!!vehicle);

  let site: SiteAssets | null = null;
  let world = createWorld(detail, { doubleWall, laneZ: TANKER_Z });
  scene.add(world.group);

  const loader = new THREE.TextureLoader();
  let logoTexture: THREE.Texture | null = null;
  let tanker!: Tanker;
  let TANKER_KEYS!: Array<[number, number]>;
  let beams: ReturnType<typeof createHeadlightBeams> | null = null;
  let hoseFrom = new THREE.Vector3();
  let traceStartX = 0;
  let hose: ReturnType<typeof createHose> | null = null;

  /** Delivery hose (in world space, for the parked position) from the tanker's discharge port to the tank's neck. */
  function buildHose() {
    if (hose) {
      scene.remove(hose.mesh);
      hose.dispose();
    }
    hose = createHose(hoseFrom, world.customerTank.inletTop, world.customerTank.hoseApproach);
    hose.setConnected(0);
    scene.add(hose.mesh);
  }

  /** Puts a tanker on the road: the procedural one, or (now or later) the one built from the generated models. */
  function mountTanker(assets: VehicleAssets | null) {
    const prev = tanker as Tanker | undefined;
    const x = prev ? prev.group.position.x : null;
    if (prev) {
      scene.remove(prev.group);
      prev.dispose();
      beams?.dispose();
      logoTexture?.dispose();
      logoTexture = null;
    }
    const t = assets ? createModelTanker(assets, detail) : createTanker({ logoTexture: null, detail });
    tanker = t;
    TANKER_KEYS = tankerKeys(t.anchors.loadingPort.x);
    t.group.position.set(x ?? TANKER_KEYS[0]![1], 0, TANKER_Z);
    scene.add(t.group);
    // Headlight beams through the night air (high detail: they only read with the bloom pass behind them).
    beams = detail === "high" ? createHeadlightBeams(t.anchors.headlamps) : null;
    if (beams) {
      beams.group.visible = !!cinematic;
      t.group.add(beams.group);
    }
    // Logo decal is added once the unmodified image has loaded.
    loader.load(t.logoUrl, (tex) => {
      if (disposed || tanker !== t) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      logoTexture = tex;
      t.attachLogo(tex);
      needsRender = true;
      wake();
    });
    const parkedX = TANKER_KEYS[TANKER_KEYS.length - 1]![1];
    hoseFrom = t.anchors.dischargePort.clone().add(new THREE.Vector3(parkedX, 0, TANKER_Z));
    traceStartX = TANKER_KEYS[0]![1] + t.anchors.rear.x;
  }
  mountTanker(vehicle);
  buildHose();

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
  // Intro: the first reveal comes up out of the dark with a slow push-in (time-based, ~2.4 s, once).
  const INTRO = 2.4;
  let introT = 0;
  const EXPOSURE = 1.05;
  const frameTimes: number[] = [];
  let downgraded = detail === "low";

  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpLookA = new THREE.Vector3();
  const tmpLookB = new THREE.Vector3();
  const introOffset = new THREE.Vector3();
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
    if (hose) {
      hose.setConnected(phase(p, 0.66, 0.72));
      const flowing = p > 0.72 && p < 0.93;
      hose.material.emissiveIntensity = flowing ? 2.2 : 0;
      if (flowing) hose.texture.offset.x -= dt * 1.4;
    }

    // Customer tank: outer wall fades to reveal the inner tank and the rising level.
    const cut = phase(p, 0.8, 0.87);
    for (const m of world.customerTank.outerMaterials) {
      m.opacity = 1 - cut * 0.8;
      m.depthWrite = cut < 0.5;
    }
    world.customerTank.level.scale.y = world.customerTank.height * (0.16 + 0.66 * phase(p, 0.73, 0.92));

    // Camera with a slow follow (mass, no shake).
    const c = cameraAt(p, x);
    // Intro: start further back along the view line and settle onto the keyed shot as the exposure comes up.
    const intro = 1 - smooth(clamp01(introT / INTRO));
    if (intro > 0) c.pos.add(introOffset.subVectors(c.pos, c.look).multiplyScalar(0.35 * intro));
    renderer.toneMappingExposure = EXPOSURE * (0.12 + 0.88 * (1 - intro));
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
    sky.mesh.position.copy(camPos);

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
    if (introT < INTRO && readyFired) introT = Math.min(INTRO, introT + dt);
    // Keep rendering while progress moves (or the intro plays) and for ~1.5 s after, so the damped camera can settle.
    if (Math.abs(shown - prev) > 1e-6 || introT < INTRO) settleFrames = 90;
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
    if (cinematic) cinematic.render();
    else renderer.render(scene, camera);
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
        // Post-processing is the first thing to go; beams without bloom look like plastic, so they go too.
        cinematic?.dispose();
        cinematic = null;
        if (beams) beams.group.visible = false;
        onDowngrade?.();
      }
    }
  }

  return {
    setProgress(p) {
      target = clamp01(p);
      wake();
    },
    setSite(next) {
      if (disposed || site) {
        next.dispose();
        return;
      }
      site = next;
      scene.remove(world.group);
      world.dispose();
      world = createWorld(detail, { doubleWall, assets: site, laneZ: TANKER_Z });
      scene.add(world.group);
      // The generated customer tank is taller: the hose is rebuilt to its filler neck.
      buildHose();
      lightFor(!!vehicle);
      needsRender = true;
      wake();
    },
    setVehicle(next) {
      if (disposed || vehicle) {
        next.dispose();
        return;
      }
      vehicle = next;
      mountTanker(vehicle);
      buildHose();
      lightFor(true);
      needsRender = true;
      wake();
    },
    resize(width, height) {
      renderer.setSize(width, height, false);
      cinematic?.resize(width, height, dpr);
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
      cinematic?.dispose();
      beams?.dispose();
      sky.dispose();
      tanker.dispose();
      world.dispose();
      hose?.dispose();
      vehicle?.dispose();
      site?.dispose();
      logoTexture?.dispose();
      envMap.dispose();
      envScene.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
