"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "./nav";

export function MobileMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean | ((v: boolean) => boolean)) =>
    setOpenOn((prev) => {
      const current = prev === pathname;
      const value = typeof next === "function" ? next(current) : next;
      return value ? pathname : null;
    });
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Keep keyboard focus inside the open menu: everything behind the overlay becomes inert.
    const behind = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    behind.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      behind.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-2 px-2 font-medium"
      >
        <span aria-hidden className="relative block h-3 w-6">
          <span className={`absolute left-0 h-0.5 w-6 bg-carbon transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 h-0.5 w-6 bg-carbon transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
        {open ? "Zamknij" : "Menu"}
      </button>
      <div
        id={id}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-paper"
      >
        <nav aria-label="Główna (mobilna)" className="frame py-6">
          <ul className="border-t border-line-light">
            {items.map((item) => (
              <li key={item.href} className="border-b border-line-light">
                <Link
                  href={item.href}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  className="flex items-center justify-between py-4 font-display text-2xl font-bold [font-variation-settings:'wdth'_112]"
                >
                  {item.label}
                  <span aria-hidden className="text-exoil-red">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/zamow-paliwo/"
            className="mt-8 flex h-14 items-center justify-center bg-exoil-red font-display text-lg font-bold text-white"
          >
            Zamów paliwo
          </Link>
        </nav>
      </div>
    </div>
  );
}
