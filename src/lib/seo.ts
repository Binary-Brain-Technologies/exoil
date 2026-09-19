import type { Metadata } from "next";
import { SITE_URL } from "@/data/company";
import { resolveIndexable } from "@/lib/site-url";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** See resolveIndexable: only the real domain (exoil.pl) in production is indexable; previews never are. */
export function isIndexable(): boolean {
  return resolveIndexable();
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
