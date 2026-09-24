"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { loadSiteAssets, loadVehicleAssets, type SiteAssets, type VehicleAssets } from "./scene/hero-assets";
import { createJourney, type Detail } from "./scene/journey";
import { journeyProgress } from "./progress";

/**
 * The scene starts when the generated tanker (≈ 1.8 MB) has arrived, or at this point after navigation at the latest
 * (with the procedural tanker, swapped for the real one when it lands). Kept well inside Journey's 8 s WebGL deadline,
 * so a slow connection still gets the 3D scene rather than the static fallback.
 */
const START_BY_MS = 5500;

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
    const abort = new AbortController();
    let teardown: (() => void) | null = null;
    let journey: ReturnType<typeof createJourney> | null = null;
    let pendingSite: SiteAssets | null = null;
    let pendingVehicle: VehicleAssets | null = null;
    let started = false;

    const start = (vehicle: VehicleAssets | null) => {
      if (abort.signal.aborted || started) {
        vehicle?.dispose();
        return;
      }
      started = true;
      // A fresh canvas per mount: a disposed renderer forces context loss on its canvas, so it can't be reused.
      const canvas = document.createElement("canvas");
      canvas.className = "block h-full w-full";
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);
      let created: ReturnType<typeof createJourney>;
      try {
        created = createJourney(canvas, { detail, doubleWall, vehicle, onReady: () => ready() });
      } catch {
        vehicle?.dispose();
        pendingSite?.dispose();
        pendingSite = null;
        pendingVehicle?.dispose();
        pendingVehicle = null;
        // Whatever the renderer allocated before the throw goes with its context (browsers cap live contexts).
        canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
        canvas.remove();
        fail();
        return;
      }
      journey = created;
      if (pendingVehicle) {
        created.setVehicle(pendingVehicle);
        pendingVehicle = null;
      }
      if (pendingSite) {
        created.setSite(pendingSite);
        pendingSite = null;
      }

      const size = () => {
        const r = canvas.getBoundingClientRect();
        created.resize(Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height)));
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(canvas);

      const unsubscribe = journeyProgress.subscribe((p) => created.setProgress(p));

      let onScreen = true;
      const sync = () => (onScreen && document.visibilityState === "visible" ? created.start() : created.stop());
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

      teardown = () => {
        unsubscribe();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
        canvas.removeEventListener("webglcontextlost", lost);
        created.dispose(); // also releases the models
        journey = null;
        canvas.remove();
      };
    };

    const options = { detail, maxAnisotropy: 8, signal: abort.signal };
    // The route loader stays up while the tanker downloads (at most until START_BY_MS after navigation).
    const deadline = window.setTimeout(() => start(null), Math.max(1200, START_BY_MS - performance.now()));
    const loadSite = () =>
      // The base and the customer site stream in after the tanker (it gets the bandwidth first) and replace their
      // procedural stand-ins when they land: they are only reached after some scrolling. If they never arrive, the
      // procedural ones simply stay.
      loadSiteAssets(options).then(
        (site) => {
          if (abort.signal.aborted) site.dispose();
          else if (journey) journey.setSite(site);
          else pendingSite = site;
        },
        () => {},
      );
    loadVehicleAssets(options).then(
      (vehicle) => {
        window.clearTimeout(deadline);
        if (abort.signal.aborted) vehicle.dispose();
        else if (!started) start(vehicle);
        else if (journey) journey.setVehicle(vehicle);
        else pendingVehicle = vehicle;
        loadSite();
      },
      () => {
        window.clearTimeout(deadline);
        start(null);
        loadSite();
      },
    );

    return () => {
      window.clearTimeout(deadline);
      abort.abort();
      teardown?.();
      pendingSite?.dispose();
      pendingSite = null;
      pendingVehicle?.dispose();
      pendingVehicle = null;
    };
  }, [detail, doubleWall]);

  return <div ref={hostRef} className="h-full w-full" />;
}
