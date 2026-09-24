import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/**
 * The night-film look of the journey (high detail only): lamps bloom, headlights cut beams through the air, and a
 * fine grain plus vignette holds the frame together. Everything here is optional: the scene renders correctly without
 * it, and the adaptive-quality step switches it off on slow machines.
 */

const GrainVignetteShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uSeed: { value: 0 },
    uGrain: { value: 0.045 },
    uVignette: { value: 0.32 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uSeed;
    uniform float uGrain;
    uniform float uVignette;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uSeed) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      // Grain is strongest in the mid-tones, like film; blacks stay black.
      float luma = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      float g = (hash(vUv * 1024.0) - 0.5) * uGrain * (0.35 + luma);
      vec2 d = vUv - 0.5;
      float v = 1.0 - uVignette * smoothstep(0.25, 0.85, dot(d, d) * 2.2);
      gl_FragColor = vec4((c.rgb + g) * v, c.a);
    }
  `,
};

export interface Cinematic {
  render(): void;
  resize(width: number, height: number, pixelRatio: number): void;
  dispose(): void;
}

export function createCinematic(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Cinematic {
  // Multisampled target: the composer would otherwise lose the canvas' antialiasing.
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  // High threshold: only real light sources (lamps, head/tail lights, the route trace) bloom — never the white tank.
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.6, 0.92);
  composer.addPass(bloom);
  const grain = new ShaderPass(GrainVignetteShader);
  composer.addPass(grain);
  composer.addPass(new OutputPass());
  let seed = 0;
  return {
    render() {
      seed = (seed + 1) % 997;
      grain.uniforms.uSeed!.value = seed * 0.618;
      composer.render();
    },
    resize(width, height, pixelRatio) {
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      // Bloom at half resolution: indistinguishable, a quarter of the fill cost.
      bloom.resolution.set(Math.max(1, (width * pixelRatio) / 2), Math.max(1, (height * pixelRatio) / 2));
    },
    dispose() {
      composer.dispose();
      bloom.dispose();
      grain.dispose();
      target.dispose();
    },
  };
}

/** Soft additive cone from a headlamp forward (+X), fading with distance and towards its edges. */
export function createHeadlightBeams(lamps: THREE.Vector3[], { length = 16, spread = 2.2 } = {}) {
  const geo = new THREE.ConeGeometry(spread, length, 32, 1, true);
  geo.translate(0, -length / 2, 0); // apex at the origin
  geo.rotateZ(Math.PI / 2); // pointing +X
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(0xfff1d6) }, uStrength: { value: 0.11 }, uLength: { value: length } },
    vertexShader: /* glsl */ `
      varying float vAlong;
      varying vec3 vNormalV;
      varying vec3 vViewDir;
      uniform float uLength;
      void main() {
        vAlong = clamp(position.x / uLength, 0.0, 1.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormalV = normalMatrix * normal;
        vViewDir = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uStrength;
      varying float vAlong;
      varying vec3 vNormalV;
      varying vec3 vViewDir;
      void main() {
        // Bright near the lamp, gone by the end; edge-on faces (the silhouette of the cone) fade out.
        // Guarded: near the apex the interpolated normal can collapse to zero, and one NaN pixel here would be spread
        // over the whole frame by the bloom pass.
        float fall = pow(clamp(1.0 - vAlong, 0.0, 1.0), 1.8);
        float nl = length(vNormalV);
        float vl = length(vViewDir);
        float facing = (nl > 1e-4 && vl > 1e-4) ? pow(clamp(abs(dot(vNormalV / nl, vViewDir / vl)), 0.0, 1.0), 1.4) : 0.0;
        gl_FragColor = vec4(uColor * uStrength * fall * facing, 1.0);
      }
    `,
  });
  const group = new THREE.Group();
  for (const p of lamps) {
    const beam = new THREE.Mesh(geo, material);
    beam.position.copy(p);
    beam.rotation.z = -0.045; // dipped beam
    beam.renderOrder = 2;
    beam.frustumCulled = false;
    group.add(beam);
  }
  return {
    group,
    dispose() {
      geo.dispose();
      material.dispose();
    },
  };
}
