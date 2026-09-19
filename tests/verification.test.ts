import { afterEach, describe, expect, it } from "vitest";
import { company } from "@/data/company";
import { getAllStationRecords, getStations } from "@/data/stations";
import { getMetrics } from "@/data/metrics";
import { getServices } from "@/data/services";
import { getApprovedPartners } from "@/data/partners";
import { gasStationLd, organizationLd } from "@/lib/jsonld";
import { fact, isVisible, needsMarker, publishable } from "@/lib/verification";

afterEach(() => {
  delete process.env.CONTENT_MODE;
});

describe("verification gate", () => {
  it("hides unverified facts in production and marks them in review", () => {
    const f = fact("519 310 310", "CLIENT_CONFIRMATION_REQUIRED", "test");
    expect(publishable(f, "production")).toBeUndefined();
    expect(publishable(f, "review")).toBe("519 310 310");
    expect(needsMarker(f, "review")).toBe(true);
  });

  it("never shows REMOVE or OUTDATED, even in review", () => {
    for (const status of ["REMOVE", "OUTDATED"] as const) {
      expect(isVisible(fact(1, status, "t"), "review")).toBe(false);
    }
  });

  it("defaults to production when CONTENT_MODE is unset or unknown", () => {
    process.env.CONTENT_MODE = "preview";
    expect(publishable(fact("x", "CONFLICTING", "t"))).toBeUndefined();
  });
});

describe("content registry in production mode", () => {
  it("publishes no business metric (all 2018 figures are unverified)", () => {
    expect(getMetrics()).toHaveLength(0);
  });

  it("publishes no partner or supplier", () => {
    expect(getApprovedPartners()).toHaveLength(0);
  });

  it("does not offer the unconfirmed tanks service", () => {
    expect(getServices().map((s) => s.id)).not.toContain("tanks");
  });

  it("lists every URE-registered station, with unique slugs", () => {
    const stations = getStations();
    expect(stations.length).toBe(getAllStationRecords().length);
    expect(new Set(stations.map((s) => s.slug)).size).toBe(stations.length);
  });

  it("keeps unverified contact data out of structured data", () => {
    const org = JSON.stringify(organizationLd());
    expect(org).not.toContain("519 310 310");
    expect(org).not.toContain("biuro@exoil.pl");
    expect(org).toContain(company.krs.value);
    for (const s of getStations()) {
      const ld = JSON.stringify(gasStationLd(s));
      expect(ld).not.toMatch(/telephone|openingHours|geo|aggregateRating|priceRange/);
    }
  });

  it("never states the Hutnicza house number while it is conflicting", () => {
    const hutnicza = getStations().find((s) => s.id === "hutnicza");
    expect(hutnicza?.street.value).toBe("ul. Hutnicza");
  });
});
