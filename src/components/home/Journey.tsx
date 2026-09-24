"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journeyProgress } from "@/components/three/progress";
import { VEHICLE_MODEL_URLS } from "@/components/three/scene/hero-model-urls";
import { JourneyDiagram } from "./JourneyDiagram";
import { JourneyFilm } from "./JourneyFilm";
import type { JourneyChapter } from "./journeyChapters";

/** Stand-in used when the 3D chunk cannot be downloaded: reports failure so the page falls back to the static visual. */
function CanvasUnavailable({ onFail }: ComponentProps<typeof import("@/components/three/JourneyCanvas").default>) {
  useEffect(() => onFail(), [onFail]);
  return null;
}

// A failed chunk download (network blip, blocking extension) must never take the page down.
const JourneyCanvas = dynamic(
  () => import("@/components/three/JourneyCanvas").catch(() => ({ default: CanvasUnavailable })),
  { ssr: false },
);

type Mode = "pending" | "webgl-high" | "webgl-low" | "svg-motion" | "static";

function detectMode(): Mode {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = window.matchMedia("(min-width: 64rem) and (pointer: fine)").matches;
  if (!desktop) return reduced ? "static" : "svg-motion";
  if (reduced) return "static";
  if (new URLSearchParams(window.location.search).has("no3d")) return "static";
  try {
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2")) return "static";
  } catch {
    return "static";
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "static";
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return weak ? "webgl-low" : "webgl-high";
}

// Capability detection runs once on the client; the server snapshot is "pending" (render the SVG poster).
let detected: Mode | null = null;
const subscribeNoop = () => () => {};
const getMode = () => (detected ??= detectMode());
const getServerMode = (): Mode => "pending";

/** Quiet loader in the route motif: a thin road line with a red trace travelling along it. */
function RouteLoader({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden={!visible}
    >
      <div className="relative h-0.5 w-56 overflow-hidden bg-line-dark">
        <span className="route-loader absolute inset-y-0 left-0 w-16 bg-exoil-red" />
      </div>
      <p className="label text-[0.65rem] text-night-muted" role={visible ? "status" : undefined}>
        Planowanie trasy
      </p>
    </div>
  );
}

function Plate({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="border-2 border-carbon bg-adr px-3 py-1.5 text-carbon">
      <div className="label text-[0.65rem] leading-tight">{top}</div>
      <div className="font-display text-base font-extrabold leading-tight [font-variation-settings:'wdth'_112]">{bottom}</div>
    </div>
  );
}

export function Journey({ chapters, children, doubleWall = false }: { chapters: JourneyChapter[]; children: ReactNode; doubleWall?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const frames = useRef<Array<HTMLImageElement | null>>([]);
  const detectedMode = useSyncExternalStore(subscribeNoop, getMode, getServerMode);
  const [failed, setFailed] = useState(false);
  const mode: Mode = failed && detectedMode.startsWith("webgl") ? "static" : detectedMode;
  const [active, setActive] = useState(0);
  const [glReady, setGlReady] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el || mode === "pending") return;
    gsap.registerPlugin(ScrollTrigger);
    const n = chapters.length;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate(self) {
        const p = self.progress;
        journeyProgress.set(p);
        const index = Math.min(n - 1, Math.floor(p * n));
        setActive(index);
        // Mobile film: the active frame pushes in slowly with the scroll (transform only: compositor work).
        if (mode === "svg-motion") {
          const t = Math.min(1, Math.max(0, p * n - index));
          frames.current.forEach((img, i) => {
            if (!img) return;
            img.style.willChange = i === index ? "transform" : "";
            if (i === index) img.style.transform = `scale(${(1.02 + 0.08 * t).toFixed(4)}) translate3d(0, ${(-1.5 * t).toFixed(3)}%, 0)`;
          });
        }
      },
    });
    return () => st.kill();
  }, [mode, chapters.length]);

  const webgl = mode === "webgl-high" || mode === "webgl-low";
  // The tanker model starts downloading as soon as this device is known to run WebGL, in parallel with the Three.js
  // chunk; the loader's requests are then served from the preload. (The site models follow once it has arrived.)
  useEffect(() => {
    if (!webgl) return;
    const links = VEHICLE_MODEL_URLS.map((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.crossOrigin = "anonymous";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((l) => l.remove());
  }, [webgl]);
  // The loader stays up briefly even on fast machines (no flicker) and gives WebGL at most 8 s before falling back.
  const [minElapsed, setMinElapsed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMinElapsed(true), 450);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!webgl || glReady) return;
    const t = window.setTimeout(() => setFailed(true), 8000);
    return () => window.clearTimeout(t);
  }, [webgl, glReady]);
  const revealed = webgl && glReady && minElapsed;
  // "Settled": the final visual for this device is on screen (3D scene or static graphic).
  const settled = mode !== "pending" && minElapsed && (!webgl || revealed);
  const chapter = chapters[active] ?? chapters[0]!;

  return (
    <section ref={section} aria-label="Droga paliwa: od bazy do Twojego zbiornika" className="relative bg-night text-tank" data-journey-mode={mode}>
      {/* Mobile: the journey as a film of stills rendered from the 3D scene, behind the chapter text. */}
      <JourneyFilm chapters={chapters} active={active} frames={frames} />

      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative z-[1]">{children}</div>

        {/* Visual column (desktop): sticky WebGL scene, or the static diagram for the active chapter. */}
        <div className="hidden lg:block">
          <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden border-l border-line-dark">
            {/* Static chapter graphic: reduced motion / no WebGL / 3D failed. Fades in after the loader. */}
            {settled && !webgl ? (
              <div className="journey-fade-in absolute inset-0 flex items-center justify-center p-12">
                <JourneyDiagram step={active} className="w-full max-w-3xl" doubleWall={doubleWall} />
              </div>
            ) : null}
            {webgl && (
              <div className={`absolute inset-0 transition-opacity duration-700 ${revealed ? "opacity-100" : "opacity-0"}`}>
                <JourneyCanvas
                  detail={mode === "webgl-high" ? "high" : "low"}
                  doubleWall={doubleWall}
                  onReady={() => setGlReady(true)}
                  onFail={() => {
                    setGlReady(false);
                    setFailed(true);
                  }}
                />
              </div>
            )}
            <RouteLoader visible={!settled} />
            <div
              className={`pointer-events-none absolute bottom-6 left-6 flex items-end gap-3 transition-opacity duration-500 ${settled ? "opacity-100" : "opacity-0"}`}
              aria-hidden="true"
            >
              <Plate top={`Etap ${chapter.index}`} bottom={chapter.label} />
              <Plate top="Status" bottom={chapter.status} />
            </div>
            <p
              className={`label pointer-events-none absolute bottom-6 right-6 max-w-[16rem] text-right text-[0.65rem] text-night-muted transition-opacity duration-500 ${settled ? "opacity-100" : "opacity-0"}`}
            >
              Wizualizacja poglądowa — nie przedstawia danych operacyjnych.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
