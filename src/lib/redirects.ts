/**
 * Single source of truth for legacy URL handling (docs/url-migration-map.md).
 * Consumed by next.config.ts (redirects) and src/proxy.ts (410 Gone).
 * Targets that depend on whether a business line is live are computed from src/data/services.ts.
 */
import { isServiceLive } from "../data/services";
import { hasNews } from "./news-index";

export interface LegacyRedirect {
  source: string;
  destination: string;
}

export function legacyRedirects(): LegacyRedirect[] {
  const tanks = isServiceLive("tanks") ? "/zbiorniki/" : "/hurt-paliw/";
  const heating = isServiceLive("heating-oil") ? "/olej-opalowy/" : "/hurt-paliw/";
  const news = hasNews() ? "/aktualnosci/" : "/o-firmie/";

  const table: LegacyRedirect[] = [
    { source: "/oferta/hurt-paliw/", destination: "/hurt-paliw/" },
    { source: "/oferta/stacje-paliw/", destination: "/stacje/" },
    { source: "/oferta/olej-opalowy/", destination: heating },
    { source: "/oferta/zbiorniki/", destination: tanks },
    { source: "/oferta/dostawy/", destination: "/dostawy/" },
    { source: "/oferta/", destination: "/" },
    { source: "/oferta/page/:n/", destination: "/" },
    { source: "/nasze-ceny/", destination: "/stacje/" },
    { source: "/o-firmie/exoil-w-liczbach/", destination: "/o-firmie/" },
    { source: "/o-firmie/page/:n/", destination: "/o-firmie/" },
    { source: "/witamy-w-nowej-odslonie-naszej-strony-internetowej/", destination: "/" },
    { source: "/category/:slug*/", destination: "/" },
    { source: "/tag/:slug*/", destination: "/" },
    { source: "/author/:slug*/", destination: "/" },
    { source: "/page/:n/", destination: "/" },
    { source: "/3/", destination: "/" },
    { source: "/download-category/:slug*/", destination: "/o-firmie/dokumenty/" },
    { source: "/download/:slug*/", destination: "/o-firmie/dokumenty/" },
    { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
    { source: "/wp-sitemap-:rest.xml", destination: "/sitemap.xml" },
  ];

  // WordPress date archives (/2018/, /2018/05/, /2018/05/04/ …) — only plausible years, not any 4 digits.
  table.push({ source: "/:year(20[0-3]\\d)/:rest*/", destination: "/" });

  if (!hasNews()) table.push({ source: "/aktualnosci/:path*/", destination: news });
  return table;
}

/** Paths answered with 410 Gone (WordPress system URLs and feeds). Matched as prefixes. */
export const GONE_PREFIXES = [
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/wp-json",
  "/wp-content",
  "/wp-includes",
  "/feed",
  "/comments/feed",
] as const;

export function isGonePath(pathname: string): boolean {
  return GONE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}?`));
}
