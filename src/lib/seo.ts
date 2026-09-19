import type { Metadata } from "next";
import { SITE_URL } from "@/data/company";
import { isReviewMode } from "@/lib/verification";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * True only for the real production deployment: Vercel production, or SITE_INDEXABLE=true when hosted elsewhere.
 * Local builds, previews and review mode are noindex.
 */
export function isIndexable(): boolean {
  if (isReviewMode()) return false;
  if (process.env.SITE_INDEXABLE === "false") return false;
  if (process.env.SITE_INDEXABLE === "true") return true;
  return process.env.VERCEL_ENV === "production";
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: "EXOIL",
      url,
      title,
      description,
      images: [{ url: image ?? "/opengraph-image", width: 1200, height: 630, alt: "EXOIL" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image ?? "/opengraph-image"] },
    robots: noindex || !isIndexable() ? { index: false, follow: !noindex } : undefined,
  };
}
