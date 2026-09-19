"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Sets data-drawn="true" on its wrapper when it scrolls into view (used for route lines drawing in). */
export function DrawOnView({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.drawn = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} data-drawn="false">
      {children}
    </div>
  );
}
