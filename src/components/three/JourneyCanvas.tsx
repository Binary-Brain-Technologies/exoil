"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { createJourney, type Detail } from "./scene/journey";
import { journeyProgress } from "./progress";

/**
 * WebGL layer of the homepage journey. Loaded with next/dynamic only on capable desktop devices,
 * so Three.js never ships to other routes or to mobile. Pauses when off-screen or when the tab is hidden,
 * and releases every GPU resource on unmount.
 */
export default function JourneyCanvas({
  detail,
  doubleWall,
  onReady,
  onFail,
}: {
  detail: Detail;
  doubleWall: boolean;
  onReady: () => void;
  onFail: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const ready = useEffectEvent(() => onReady());
  const fail = useEffectEvent(() => onFail());

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A fresh canvas per mount: a disposed renderer forces context loss on its canvas, so it can't be reused.
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    let journey: ReturnType<typeof createJourney>;
    try {
      journey = createJourney(canvas, { detail, doubleWall, onReady: () => ready() });
    } catch {
      canvas.remove();
      fail();
      return;
    }

    const size = () => {
      const r = canvas.getBoundingClientRect();
      journey.resize(Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height)));
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    const unsubscribe = journeyProgress.subscribe((p) => journey.setProgress(p));

    let onScreen = true;
    const sync = () => (onScreen && document.visibilityState === "visible" ? journey.start() : journey.stop());
    const io = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const lost = (e: Event) => {
      e.preventDefault();
      fail();
    };
    canvas.addEventListener("webglcontextlost", lost);
    sync();

    return () => {
      unsubscribe();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", lost);
      journey.dispose();
      canvas.remove();
    };
  }, [detail, doubleWall]);

  return <div ref={hostRef} className="h-full w-full" />;
}
