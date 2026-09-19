import { company, SITE_URL } from "@/data/company";
import type { Service } from "@/data/services";
import { FUEL_CATEGORY_LABELS, type Station } from "@/data/stations";
import { isPublic, type Fact } from "@/lib/verification";
import { absoluteUrl } from "@/lib/seo";

/**
 * Structured data for search engines uses ONLY confirmed facts, so JSON-LD never asserts unconfirmed hours, phones or
 * coordinates to Google, even though the pages display them. No ratings, no price ranges.
 */
function pub<T>(f: Fact<T>): T | undefined {
  return isPublic(f) ? f.value : undefined;
}

export function organizationLd() {
  const a = company.address;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "EXOIL",
    legalName: pub(company.legalNameFull),
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/brand/exoil-logo-on-white.png"),
    taxID: pub(company.nip),
    identifier: [
      { "@type": "PropertyValue", propertyID: "KRS", value: pub(company.krs) },
      { "@type": "PropertyValue", propertyID: "REGON", value: pub(company.regon) },
    ].filter((x) => x.value),
    address: {
      "@type": "PostalAddress",
      streetAddress: pub(a.street),
      postalCode: pub(a.postalCode),
      addressLocality: pub(a.city),
      addressRegion: "lubelskie",
      addressCountry: "PL",
    },
    telephone: pub(company.orderPhone),
    email: pub(company.generalEmail),
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function serviceLd(service: Service, areaServed?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    url: absoluteUrl(service.href),
    provider: { "@id": `${SITE_URL}/#organization` },
    ...(areaServed ? { areaServed } : {}),
  };
}

export function gasStationLd(station: Station) {
  const fuels = pub(station.fuels) ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "@id": absoluteUrl(`/stacje/${station.slug}/#station`),
    name: station.name,
    url: absoluteUrl(`/stacje/${station.slug}/`),
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: pub(station.street),
      postalCode: pub(station.postalCode),
      addressLocality: station.postTown ?? station.city,
      addressRegion: "lubelskie",
      addressCountry: "PL",
    },
    telephone: station.phone ? pub(station.phone) : undefined,
    description: fuels.length ? `Paliwa: ${fuels.map((f) => FUEL_CATEGORY_LABELS[f]).join(", ")}.` : undefined,
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
