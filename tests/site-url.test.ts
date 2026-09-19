import { describe, expect, it } from "vitest";
import { resolveIndexable, resolveSiteUrl } from "@/lib/site-url";

const vercelProdPreviewDomain = { VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "exoil.vercel.app", VERCEL_URL: "exoil-abc123.vercel.app" };

describe("site URL", () => {
  it("ignores an empty NEXT_PUBLIC_SITE_URL (regression: build crashed with ERR_INVALID_URL)", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "", ...vercelProdPreviewDomain })).toBe("https://exoil.vercel.app");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "   " })).toBe("https://exoil.pl");
  });
  it("ignores an invalid value instead of throwing", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "not a url::" })).toBe("https://exoil.pl");
  });
  it("uses an explicit valid value, normalised to its origin", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://exoil.pl/" })).toBe("https://exoil.pl");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "exoil.pl" })).toBe("https://exoil.pl");
  });
  it("on Vercel production uses the project's production domain, on previews the deployment URL", () => {
    expect(resolveSiteUrl(vercelProdPreviewDomain)).toBe("https://exoil.vercel.app");
    expect(resolveSiteUrl({ VERCEL_ENV: "preview", VERCEL_URL: "exoil-git-feature.vercel.app" })).toBe("https://exoil-git-feature.vercel.app");
  });
  it("falls back to exoil.pl locally", () => {
    expect(resolveSiteUrl({})).toBe("https://exoil.pl");
  });
});

describe("indexing", () => {
  it("keeps the client preview on exoil.vercel.app out of search engines", () => {
    expect(resolveIndexable(vercelProdPreviewDomain)).toBe(false);
  });
  it("indexes only the real domain in production", () => {
    expect(resolveIndexable({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "exoil.pl" })).toBe(true);
  });
  it("does not index the preview even if NEXT_PUBLIC_SITE_URL is set to the real domain", () => {
    expect(resolveIndexable({ ...vercelProdPreviewDomain, NEXT_PUBLIC_SITE_URL: "https://exoil.pl" })).toBe(false);
  });
  it("never indexes previews or local builds", () => {
    expect(resolveIndexable({ VERCEL_ENV: "preview", VERCEL_URL: "x.vercel.app" })).toBe(false);
    expect(resolveIndexable({})).toBe(false);
  });
  it("respects explicit overrides", () => {
    expect(resolveIndexable({ SITE_INDEXABLE: "true" })).toBe(true);
    expect(resolveIndexable({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "exoil.pl", SITE_INDEXABLE: "false" })).toBe(false);
  });
});
