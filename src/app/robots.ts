import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/lib/seo";

/**
 * Production: open to search engines and AI crawlers (public business information is meant to be understood).
 * Previews / review mode: blocked entirely.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
