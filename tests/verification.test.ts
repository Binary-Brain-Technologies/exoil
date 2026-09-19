import { describe, expect, it } from "vitest";
import { company } from "@/data/company";
import { getAllStationRecords, getStations } from "@/data/stations";
import { getMetrics } from "@/data/metrics";
import { getServices } from "@/data/services";
import { getApprovedPartners } from "@/data/partners";
import { gasStationLd, organizationLd } from "@/lib/jsonld";
import { fact, isPublic, isVisible, publishable } from "@/lib/verification";

describe("what the site displays", () => {
  it("shows facts that still await client confirmation", () => {
    const f = fact("519 310 310", "CLIENT_CONFIRMATION_REQUIRED", "test");
    expect(publishable(f)).toBe("519 310 310");
    expect(isPublic(f)).toBe(false); // …but it is not treated as confirmed
  });

  it("never shows material removed for cause or known to be outdated", () => {
    for (const status of ["REMOVE", "OUTDATED"] as const) expect(isVisible(fact(1, status, "t"))).toBe(false);
  });

  it("shows the full station network with unique slugs, and the tanks offer", () => {
    const stations = getStations();
    expect(stations.length).toBe(getAllStationRecords().length);
    expect(new Set(stations.map((s) => s.slug)).size).toBe(stations.length);
    expect(getServices().map((s) => s.id)).toContain("tanks");
  });

  it("does not show the outdated 2018 figures (only the conflicting/unconfirmed ones for review)", () => {
    const ids = getMetrics().map((m) => m.id);
    expect(ids).not.toContain("km-per-year");
    expect(ids).not.toContain("transactions");
  });

  it("names no supplier or partner without approved wording", () => {
    expect(getApprovedPartners()).toHaveLength(0);
  });
});

describe("structured data for search engines", () => {
  it("carries only confirmed facts — no unconfirmed phones, e-mails, hours or coordinates", () => {
    const org = JSON.stringify(organizationLd());
    expect(org).not.toContain("519 310 310");
    expect(org).not.toContain("biuro@exoil.pl");
    expect(org).toContain(company.krs.value);
    for (const s of getStations()) {
      expect(JSON.stringify(gasStationLd(s))).not.toMatch(/telephone|openingHours|geo|aggregateRating|priceRange/);
    }
  });

  it("never states the Hutnicza house number while it is conflicting", () => {
    expect(getStations().find((s) => s.id === "hutnicza")?.street.value).toBe("ul. Hutnicza");
  });
});
