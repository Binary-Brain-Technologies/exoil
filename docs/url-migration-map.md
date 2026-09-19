# URL migration map

Audit date: 2026-09-19. Source of old URLs: Wayback CDX index + WordPress sitemaps (see historical audit).

Conventions of the new site:
- Canonical host: `https://exoil.pl` (apex, HTTPS). `www.exoil.pl` → 308 to apex (configured in Vercel domains, not in code).
- **Trailing slashes are kept** (`trailingSlash: true`), matching the old WordPress URLs, so preserved slugs keep their exact form.
- Redirects are permanent (308 from Next.js, equivalent to 301 for search engines) and live in **one place**:
  `src/lib/redirects.ts`, consumed by `next.config.ts`. Service-dependent targets are computed from `src/data/services.ts`
  (e.g. if tanks are disabled, the tanks URL points to wholesale instead of a 404).
- WordPress system paths answer **410 Gone** from `src/proxy.ts` so crawlers drop them quickly.

| Old URL | New URL | Action | Reason |
|---|---|---|---|
| `/` | `/` | Keep | |
| `/o-firmie/` | `/o-firmie/` | Keep | Same slug |
| `/o-firmie/page/2/` | `/o-firmie/` | 308 | WP pagination |
| `/o-firmie/historia/` | `/o-firmie/historia/` | Keep | |
| `/o-firmie/exoil-w-liczbach/` | `/o-firmie/` | 308 | Old metrics are unverified (2018); the company page carries the verified facts. Re-create this slug later only if the client confirms current figures. |
| `/o-firmie/dokumenty/` | `/o-firmie/dokumenty/` | Keep | |
| `/aktualnosci/` | `/aktualnosci/` if at least one current post exists, else `/o-firmie/` | Keep / 308 (computed) | Only one 2018 post ever existed |
| `/witamy-w-nowej-odslonie-naszej-strony-internetowej/` | `/` | 308 | 2018 site-launch notice, not migrated |
| `/category/aktualnosci/`, `/category/glowna/` | `/` | 308 | WP archive |
| `/tag/oferta/`, `/tag/o-firmie/` | `/` | 308 | WP archive |
| `/author/kwant/`, `/author/piotrb/` | `/` | 308 | WP archive (also removes a personal name from the index) |
| `/2018/`, `/2018/05/`, `/2018/05/04/`, `/2018/05/08/`, `/2024/01/08/` | `/` | 308 | WP date archive |
| `/page/2/`, `/page/3/`, `/3/` | `/` | 308 | WP pagination / stray page |
| `/nasze-ceny/` | `/stacje/` | 308 | Never existed as a URL, but was a menu label; cheap safety net |
| `/oferta/` | `/` | 308 | No offer index in the new IA; the homepage is the offer overview |
| `/oferta/page/2/` | `/` | 308 | |
| `/oferta/hurt-paliw/` | `/hurt-paliw/` | 308 | Flagship B2B page, shorter slug per brief |
| `/oferta/stacje-paliw/` | `/stacje/` | 308 | |
| `/oferta/olej-opalowy/` | `/olej-opalowy/` | 308 | |
| `/oferta/zbiorniki/` | `/zbiorniki/` if the tanks service is enabled, else `/hurt-paliw/` | 308 (computed) | Offer unconfirmed (last edited 2019) |
| `/oferta/dostawy/` | `/dostawy/` | 308 | |
| `/kariera/` | `/kariera/` | Keep | |
| `/kontakt/` | `/kontakt/` | Keep | |
| `/download-category/dokumenty/` | `/o-firmie/dokumenty/` | 308 | |
| `/download/koncesja-na-obrot-paliwami/` | `/o-firmie/dokumenty/` | 308 | Page lists the current concession |
| `/download/krajowy-rejestr-sadowy-krs/` | `/o-firmie/dokumenty/` | 308 | |
| `/download/numer-nip/`, `/download/numer-regon/` | `/o-firmie/dokumenty/` | 308 | |
| `/download/zaswiadczenie-o-niezaleganiu-us/`, `/download/zaswiadczenie-o-niezaleganiu-zus/` | `/o-firmie/dokumenty/` | 308 | |
| `/download/strategia-podatkowa-2022/`, `/download/strategia-podatkowa-2023/` | `/o-firmie/dokumenty/` | 308 | |
| `/wp-sitemap.xml`, `/wp-sitemap-*.xml` | `/sitemap.xml` | 308 | |
| `/feed/`, `/comments/feed/` | — | 410 | No feed in the new site |
| `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*`, `/wp-content/*`, `/wp-includes/*` | — | 410 | WordPress system paths; old image URLs have no retained value |
| `http://exoil.pl/*`, `http://www.exoil.pl/*`, `https://www.exoil.pl/*` | `https://exoil.pl/*` | 308 | Vercel domain config |
| `exoil.co/*` | `https://exoil.pl/*` | 308 | Only if the client keeps `exoil.co` pointed at Vercel (decision needed) |
| `portal.exoil.pl` | — | Out of scope | Separate remote-access system — **do not** change its DNS record |

## New routes without a historical equivalent

`/zamow-paliwo/` (B2B order request / quote), `/stacje/[slug]/` (7 station pages), `/polityka-prywatnosci/`.

## Verification

`npm run test` includes `tests/redirects.test.ts`, which asserts every row above resolves to its target (or 410)
from the redirect table, and that no redirect target is itself a redirect (no chains). After deployment to a preview URL,
run `scripts/check-redirects.mjs <base-url>` to verify real HTTP responses.
