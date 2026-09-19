/**
 * Public origin of the site, resolved in this order:
 *  1. NEXT_PUBLIC_SITE_URL — if set to a valid http(s) URL (empty or invalid values are ignored)
 *  2. Vercel production: VERCEL_PROJECT_PRODUCTION_URL (exoil.vercel.app now; becomes exoil.pl once the domain is added)
 *  3. Vercel preview: VERCEL_URL (the deployment's own address)
 *  4. https://exoil.pl
 * Canonicals, sitemap, Open Graph and JSON-LD all use this origin, so every deployment links to itself.
 */
export const PRODUCTION_HOST = "exoil.pl";

type Env = Record<string, string | undefined>;

function origin(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function resolveSiteUrl(env: Env = process.env): string {
  return (
    origin(env.NEXT_PUBLIC_SITE_URL) ??
    (env.VERCEL_ENV === "production" ? origin(env.VERCEL_PROJECT_PRODUCTION_URL) : null) ??
    origin(env.VERCEL_URL) ??
    `https://${PRODUCTION_HOST}`
  );
}

/**
 * Search engines may index the site only when it is served from the real domain. On Vercel that is decided by the
 * domain attached to the project (VERCEL_PROJECT_PRODUCTION_URL) — never by NEXT_PUBLIC_SITE_URL — so the client
 * preview on exoil.vercel.app stays noindex even as a "production" deployment, whatever the site URL is set to.
 * Off Vercel, indexing requires SITE_INDEXABLE=true. SITE_INDEXABLE=false always wins.
 */
export function resolveIndexable(env: Env = process.env): boolean {
  if (env.SITE_INDEXABLE === "false") return false;
  if (env.SITE_INDEXABLE === "true") return true;
  if (env.VERCEL_ENV !== "production") return false;
  const projectDomain = origin(env.VERCEL_PROJECT_PRODUCTION_URL);
  const host = projectDomain ? new URL(projectDomain).hostname : "";
  return host === PRODUCTION_HOST || host === `www.${PRODUCTION_HOST}`;
}
