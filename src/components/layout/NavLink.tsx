"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative inline-flex h-11 items-center px-3 text-[0.95rem] font-medium text-carbon transition-colors hover:text-red-deep ${
        active ? "after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:bg-exoil-red" : ""
      }`}
    >
      {children}
    </Link>
  );
}
