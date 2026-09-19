#!/usr/bin/env node
/**
 * Verifies real HTTP behaviour of legacy URLs against a running deployment.
 * Usage: node scripts/check-redirects.mjs https://<preview-or-local-url>
 * Expectations mirror docs/url-migration-map.md (no news posts yet).
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const cases = [
  ["/oferta/hurt-paliw/", 308, "/hurt-paliw/"],
  ["/oferta/stacje-paliw/", 308, "/stacje/"],
  ["/oferta/olej-opalowy/", 308, "/olej-opalowy/"],
  ["/oferta/zbiorniki/", 308, "/zbiorniki/"],
  ["/zbiorniki/", 200],
  ["/oferta/dostawy/", 308, "/dostawy/"],
  ["/oferta/", 308, "/"],
  ["/nasze-ceny/", 308, "/stacje/"],
  ["/o-firmie/exoil-w-liczbach/", 308, "/o-firmie/"],
  ["/aktualnosci/", 308, "/o-firmie/"],
  ["/witamy-w-nowej-odslonie-naszej-strony-internetowej/", 308, "/"],
  ["/category/glowna/", 308, "/"],
  ["/author/kwant/", 308, "/"],
  ["/2018/05/04/", 308, "/"],
  ["/page/2/", 308, "/"],
  ["/download/koncesja-na-obrot-paliwami/", 308, "/o-firmie/dokumenty/"],
  ["/download-category/dokumenty/", 308, "/o-firmie/dokumenty/"],
  ["/wp-sitemap.xml", 308, "/sitemap.xml"],
  ["/o-firmie/", 200],
  ["/o-firmie/historia/", 200],
  ["/o-firmie/dokumenty/", 200],
  ["/kariera/", 200],
  ["/kontakt/", 200],
  ["/hurt-paliw/", 200],
  ["/dostawy/", 200],
  ["/stacje/", 200],
  ["/stacje/chelm-okszowska/", 200],
  ["/zamow-paliwo/", 200],
  ["/sitemap.xml", 200],
  ["/robots.txt", 200],
  ["/wp-admin/", 410],
  ["/wp-login.php", 410],
  ["/xmlrpc.php", 410],
  ["/wp-content/uploads/2023/10/1-1903x500.jpg", 410],
  ["/feed/", 410],
  ["/ta-strona-nie-istnieje/", 404],
];

let failed = 0;
for (const [path, status, location] of cases) {
  const res = await fetch(base + path, { redirect: "manual" });
  const loc = res.headers.get("location");
  const locPath = loc ? new URL(loc, base).pathname : null;
  const ok = res.status === status && (!location || locPath === location);
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${res.status} ${path}${loc ? ` → ${locPath}` : ""}${ok ? "" : `   (expected ${status}${location ? ` → ${location}` : ""})`}`);
}
console.log(failed ? `\n${failed} check(s) failed` : "\nAll redirect checks passed");
process.exit(failed ? 1 : 0);
