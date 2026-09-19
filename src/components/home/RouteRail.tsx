"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * THE ROUTE — one continuous line in the left rail of the homepage, from the first chapter to the order form.
 * The red trace follows the reader; each chapter node "arrives" when reached. Desktop only (the rail
 * column exists from the lg breakpoint). With reduced motion the full route is shown, without scrubbing.
 */
export function RouteRail() {
  const fill = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current?.parentElement;
    if (!container || !fill.current) return;
    const nodes = Array.from(container.querySelectorAll<HTMLElement>("[data-rail-node]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill.current.style.transform = "scaleY(1)";
      nodes.forEach((n) => n.setAttribute("data-reached", "true"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const triggers = [
      ScrollTrigger.create({
        trigger: container,
        start: "top 55%",
        end: "bottom 55%",
        onUpdate: (self) => {
          if (fill.current) fill.current.style.transform = `scaleY(${self.progress.toFixed(4)})`;
        },
      }),
      ...nodes.map((node) =>
        ScrollTrigger.create({
          trigger: node,
          start: "top 55%",
          onToggle: (self) => node.setAttribute("data-reached", String(self.isActive || self.progress > 0)),
          onEnter: () => node.setAttribute("data-reached", "true"),
          onLeaveBack: () => node.setAttribute("data-reached", "false"),
        }),
      ),
    ];
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-[var(--rail)] lg:block">
      <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#8B9095_0_10px,transparent_10px_22px)] opacity-60" />
      <div ref={fill} className="absolute inset-y-0 left-1/2 -ml-[1.5px] w-[3px] origin-top bg-exoil-red" style={{ transform: "scaleY(0)" }} />
    </div>
  );
}

/** A chapter stop on the rail. Place inside a `relative` chapter element. */
export function RailNode({ index, label }: { index: string; label: string }) {
  return (
    <div
      data-rail-node
      data-reached="false"
      aria-hidden="true"
      className="group absolute left-[calc(var(--rail)/2)] top-0 z-30 hidden -translate-x-1/2 flex-col items-center lg:flex"
    >
      <span className="block size-3.5 border-2 border-steel bg-night transition-colors duration-500 group-data-[reached=true]:border-exoil-red group-data-[reached=true]:bg-exoil-red" />
      <span className="label mt-2 translate-x-3.5 text-[0.65rem] text-[#707579] [writing-mode:vertical-rl] rotate-180">
        {index} {label}
      </span>
    </div>
  );
}
