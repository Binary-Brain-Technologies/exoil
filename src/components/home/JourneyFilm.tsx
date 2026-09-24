"use client";

import { useEffect, useState, type RefObject } from "react";
import { preload } from "react-dom";
import stills from "./journey-stills.json";
import type { JourneyChapter } from "./journeyChapters";

/**
 * Mobile journey "film": one still per chapter, rendered from the real 3D scene (scripts/build-journey-stills.mjs),
 * held full-bleed behind the chapter text. Chapters crossfade; within a chapter the frame pushes in slowly with the
 * scroll (Journey writes the transform). Only compositor work — no WebGL, no per-frame layout.
 *
 * Phones only: the sources carry a max-width media query, so desktops never download them (the <img> fallback is
 * an inline placeholder).
 */
const MOBILE = "(max-width: 63.99rem)";

type Still = { avif: Array<{ src: string; width: number }>; webp: Array<{ src: string; width: number }>; placeholder: string };
const STILLS = stills as Record<string, Still>;

const srcSet = (list: Array<{ src: string; width: number }>) => list.map((s) => `${s.src} ${s.width}w`).join(", ");

/** Static film grain (an SVG turbulence tile), the same texture the desktop scene has. Painted once, never animated. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")";

export function JourneyFilm({
  chapters,
  active,
  frames,
}: {
  chapters: JourneyChapter[];
  active: number;
  /** Journey writes each frame's push-in transform here while scrolling. */
  frames: RefObject<Array<HTMLImageElement | null>>;
}) {
  const first = STILLS[chapters[0]!.id];
  // Later frames get their sources only once the page has loaded: stacked in the same spot, "lazy" would not hold
  // them back, and they would compete with the first frame (the phone's largest paint) for the connection.
  const [later, setLater] = useState(false);
  useEffect(() => {
    const go = () => setLater(true);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);
  // The first frame is the phone's largest paint: hint it in the document head (phones only) so it is fetched with
  // the HTML, not after the scripts.
  if (first) {
    preload(first.avif[first.avif.length - 1]!.src, {
      as: "image",
      type: "image/avif",
      imageSrcSet: srcSet(first.avif),
      imageSizes: "100vw",
      media: MOBILE,
      fetchPriority: "high",
    });
  }
  return (
    <div
      // Sized to the *large* viewport: on iOS the toolbar collapses while scrolling and the screen grows taller than
      // 100svh; a svh-tall film would leave a strip at the bottom where the next chapter's text shows through.
      className="sticky top-[var(--header-h)] z-0 -mb-[calc(100vh-var(--header-h))] h-[calc(100vh-var(--header-h))] overflow-hidden bg-night bg-cover bg-top supports-[height:100lvh]:-mb-[calc(100lvh-var(--header-h))] supports-[height:100lvh]:h-[calc(100lvh-var(--header-h))] lg:hidden"
      style={first ? { backgroundImage: `url(${first.placeholder})` } : undefined}
      aria-hidden="true"
    >
      {chapters.map((c, i) => {
        const still = STILLS[c.id];
        if (!still) return null;
        return (
          <picture
            key={c.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`}
          >
            {(i === 0 || later) && (
              <>
                <source media={MOBILE} type="image/avif" srcSet={srcSet(still.avif)} sizes="100vw" />
                <source media={MOBILE} type="image/webp" srcSet={srcSet(still.webp)} sizes="100vw" />
              </>
            )}
            <img
              ref={(el) => {
                frames.current[i] = el;
              }}
              src={still.placeholder}
              alt=""
              width={1106}
              height={2208}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
              className="h-full w-full origin-[50%_30%] object-cover object-top"
            />
          </picture>
        );
      })}
      {/* Legibility: the lower part of every frame is road; the text sits there on a night scrim. */}
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-b from-night/0 via-night/70 to-night" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night/70 to-night/0" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: GRAIN }} />
      {/* Progress along the route: one tick per chapter, the red trace fills with the scroll. */}
      <div className="frame absolute inset-x-0 top-4 flex items-center gap-1.5">
        {chapters.map((c, i) => (
          <span key={c.id} className="relative h-0.5 flex-1 overflow-hidden bg-tank/20">
            <span className={`absolute inset-0 origin-left bg-exoil-red transition-transform duration-500 motion-reduce:transition-none ${i <= active ? "scale-x-100" : "scale-x-0"}`} />
          </span>
        ))}
      </div>
      <p className="frame label absolute inset-x-0 top-7 text-right text-[0.6rem] text-tank/50">Wizualizacja poglądowa</p>
    </div>
  );
}
