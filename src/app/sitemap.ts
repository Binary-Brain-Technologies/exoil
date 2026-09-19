import type { MetadataRoute } from "next";
import { getServices } from "@/data/services";
import { getStations } from "@/data/stations";
import { legal } from "@/data/legal";
import { getNewsPosts } from "@/lib/news-index";
import { absoluteUrl, isIndexable } from "@/lib/seo";
import { isPublic } from "@/lib/verification";

/** Only published, indexable routes. Derived from the same registries as the pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  const posts = getNewsPosts();
  const paths = [
    "/",
    ...getServices().map((s) => s.href),
    ...getStations().map((s) => `/stacje/${s.slug}/`),
    "/o-firmie/",
    "/o-firmie/historia/",
    "/o-firmie/dokumenty/",
    "/kariera/",
    "/kontakt/",
    "/zamow-paliwo/",
    ...(posts.length ? ["/aktualnosci/", ...posts.map((p) => `/aktualnosci/${p.slug}/`)] : []),
    ...(isPublic(legal.privacyPolicyApproved) && legal.privacyPolicyApproved.value ? ["/polityka-prywatnosci/"] : []),
  ];
  return Array.from(new Set(paths)).map((p) => ({ url: absoluteUrl(p) }));
}
