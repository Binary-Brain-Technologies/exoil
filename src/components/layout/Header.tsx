import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { headerNav } from "./nav";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

export function Header() {
  const nav = headerNav();
  return (
    <header className="sticky top-0 z-50 border-b border-line-light bg-paper">
      <div className="frame flex h-[var(--header-h)] items-center gap-6">
        <Link href="/" className="shrink-0" aria-label="EXOIL — strona główna">
          <Logo width={124} priority />
        </Link>
        <nav aria-label="Główna" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/zamow-paliwo/"
          className="ml-auto inline-flex h-11 items-center bg-exoil-red px-4 font-display text-[0.95rem] font-bold text-white [font-variation-settings:'wdth'_112] transition-colors hover:bg-red-deep sm:px-5 lg:ml-2"
        >
          Zamów<span className="hidden sm:inline">&nbsp;paliwo</span>
        </Link>
        <MobileMenu items={nav} />
      </div>
    </header>
  );
}
