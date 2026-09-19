import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { isGonePath, legacyRedirects } from "@/lib/redirects";

// The same path-to-regexp build Next.js uses for `redirects()`.
const require = createRequire(import.meta.url);
const { pathToRegexp, compile } = require("next/dist/compiled/path-to-regexp") as {
  pathToRegexp: (p: string, keys: Array<{ name: string | number }>, o?: object) => RegExp;
  compile: (p: string, o?: object) => (params: object) => string;
};

function resolve(pathname: string): string | null {
  for (const r of legacyRedirects()) {
    const keys: Array<{ name: string | number }> = [];
    const re = pathToRegexp(r.source, keys, { strict: true, sensitive: false, delimiter: "/" });
    const m = re.exec(pathname);
    if (!m) continue;
    const params: Record<string, string | string[]> = {};
    keys.forEach((k, i) => {
      const v = m[i + 1];
      if (v !== undefined) params[String(k.name)] = v.includes("/") ? v.split("/") : v;
    });
    return compile(r.destination, { validate: false })(params);
  }
  return null;
}

// Every legacy URL from docs/url-migration-map.md with its expected outcome (no news posts yet).
const EXPECTED: Array<[string, string]> = [
  ["/oferta/hurt-paliw/", "/hurt-paliw/"],
  ["/oferta/stacje-paliw/", "/stacje/"],
  ["/oferta/olej-opalowy/", "/olej-opalowy/"],
  ["/oferta/zbiorniki/", "/zbiorniki/"],
  ["/oferta/dostawy/", "/dostawy/"],
  ["/oferta/", "/"],
  ["/oferta/page/2/", "/"],
  ["/nasze-ceny/", "/stacje/"],
  ["/o-firmie/exoil-w-liczbach/", "/o-firmie/"],
  ["/o-firmie/page/2/", "/o-firmie/"],
  ["/aktualnosci/", "/o-firmie/"],
  ["/witamy-w-nowej-odslonie-naszej-strony-internetowej/", "/"],
  ["/category/aktualnosci/", "/"],
  ["/category/glowna/", "/"],
  ["/tag/oferta/", "/"],
  ["/tag/o-firmie/", "/"],
  ["/author/kwant/", "/"],
  ["/author/piotrb/", "/"],
  ["/2018/", "/"],
  ["/2018/05/", "/"],
  ["/2018/05/04/", "/"],
  ["/2024/01/08/", "/"],
  ["/page/2/", "/"],
  ["/page/3/", "/"],
  ["/3/", "/"],
  ["/download-category/dokumenty/", "/o-firmie/dokumenty/"],
  ["/download/koncesja-na-obrot-paliwami/", "/o-firmie/dokumenty/"],
  ["/download/krajowy-rejestr-sadowy-krs/", "/o-firmie/dokumenty/"],
  ["/download/numer-nip/", "/o-firmie/dokumenty/"],
  ["/download/numer-regon/", "/o-firmie/dokumenty/"],
  ["/download/zaswiadczenie-o-niezaleganiu-us/", "/o-firmie/dokumenty/"],
  ["/download/zaswiadczenie-o-niezaleganiu-zus/", "/o-firmie/dokumenty/"],
  ["/download/strategia-podatkowa-2022/", "/o-firmie/dokumenty/"],
  ["/download/strategia-podatkowa-2023/", "/o-firmie/dokumenty/"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/wp-sitemap-posts-page-1.xml", "/sitemap.xml"],
];

const KEPT = ["/1234/", "/9999/abc/", "/", "/zbiorniki/", "/o-firmie/", "/o-firmie/historia/", "/o-firmie/dokumenty/", "/kariera/", "/kontakt/", "/hurt-paliw/", "/dostawy/", "/stacje/", "/stacje/siedliszcze/", "/zamow-paliwo/"];

describe("legacy redirects", () => {
  it.each(EXPECTED)("%s → %s", (from, to) => {
    expect(resolve(from)).toBe(to);
  });

  it.each(KEPT)("%s is served directly (no redirect)", (path) => {
    expect(resolve(path)).toBeNull();
  });

  it("never chains: no destination is itself redirected", () => {
    for (const r of legacyRedirects()) {
      if (r.destination.includes(":")) continue;
      expect(resolve(r.destination), `${r.source} → ${r.destination}`).toBeNull();
    }
  });

  it.each(["/wp-admin/", "/wp-login.php", "/xmlrpc.php", "/wp-json/wp/v2/pages/34", "/wp-content/uploads/2023/10/1-1903x500.jpg", "/feed/", "/comments/feed/"])(
    "%s is 410 Gone",
    (p) => {
      expect(isGonePath(p)).toBe(true);
    },
  );

  it("does not mark real pages as gone", () => {
    for (const p of [...KEPT, "/wpis/", "/feedback/"]) expect(isGonePath(p)).toBe(false);
  });
});
