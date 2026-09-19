import { getServices } from "@/data/services";

export interface NavItem {
  href: string;
  label: string;
}

/** Header navigation is generated from the service registry, so disabled services never appear. */
export function headerNav(): NavItem[] {
  const services = getServices()
    .filter((s) => s.headerOrder !== undefined)
    .sort((a, b) => (a.headerOrder ?? 0) - (b.headerOrder ?? 0))
    .map((s) => ({ href: s.href, label: s.navLabel }));
  return [...services, { href: "/o-firmie/", label: "O firmie" }, { href: "/kontakt/", label: "Kontakt" }];
}
