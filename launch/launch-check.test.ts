/**
 * Launch gate (docs/migration-checklist.md). Every failing test is an open launch item.
 * Run: npm run launch-check. Expected to FAIL until the client has supplied and approved the items.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { company } from "@/data/company";
import { getAllHistoryRecords } from "@/data/history";
import { legal } from "@/data/legal";
import { getAllPhotoRecords } from "@/data/media";
import { getAllStationRecords } from "@/data/stations";
import { isPublic } from "@/lib/verification";

describe("legal (docs/legal-launch-requirements.md)", () => {
  it("L1 privacy policy approved and present", () => {
    expect(isPublic(legal.privacyPolicyApproved) && legal.privacyPolicyApproved.value).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), "content", "legal", "polityka-prywatnosci.md"))).toBe(true);
  });
  it("L2 order form information clause supplied", () => expect(legal.orderFormNotice).not.toBeNull());
  it("L3 contact form information clause supplied", () => expect(legal.contactFormNotice).not.toBeNull());
  it("L4 recruitment notice supplied", () => expect(legal.recruitmentNotice).not.toBeNull());
  it("L7 registry court confirmed", () => expect(isPublic(company.registryCourt)).toBe(true));
});

describe("contacts", () => {
  it("order phone confirmed", () => expect(isPublic(company.orderPhone)).toBe(true));
  it("general e-mail confirmed", () => expect(isPublic(company.generalEmail)).toBe(true));
  it("every department has at least one confirmed channel", () => {
    for (const d of company.departments) {
      const ok = d.phones.some(isPublic) || (d.email ? isPublic(d.email) : false);
      expect(ok, d.label).toBe(true);
    }
  });
});

describe("stations (docs/stations-verification.md)", () => {
  for (const s of getAllStationRecords()) {
    it(`${s.shortName}: address, hours and phone confirmed`, () => {
      expect(isPublic(s.street), "street").toBe(true);
      expect(s.street.value).toMatch(/\d/); // house number resolved (e.g. Hutnicza 3 vs 19)
      expect(isPublic(s.open24h) || isPublic(s.hours), "hours").toBe(true);
      expect(!s.phone || isPublic(s.phone), "phone").toBe(true);
    });
  }
});

describe("history", () => {
  it("business origin (1997) confirmed or removed", () => {
    const business = getAllHistoryRecords().filter((e) => e.kind === "business");
    for (const e of business) expect(isPublic(e.record), `${e.year} ${e.title}`).toBe(true);
  });
});

describe("photography (docs/brand-assets.md §3–4)", () => {
  it("rights confirmed for every photo in use (or photo removed)", () => {
    for (const p of getAllPhotoRecords()) expect(isPublic(p.record), p.caption).toBe(true);
  });
});

describe("brand", () => {
  it("vector logo supplied (public/brand/*.svg)", () => {
    const files = fs.readdirSync(path.join(process.cwd(), "public", "brand"));
    expect(files.some((f) => f.endsWith(".svg"))).toBe(true);
  });
});

describe("environment (run with production env loaded)", () => {
  it("e-mail delivery configured", () => {
    for (const k of ["RESEND_API_KEY", "FORMS_FROM_EMAIL", "ORDER_TO_EMAIL", "CONTACT_TO_EMAIL", "CAREERS_TO_EMAIL"]) {
      expect(process.env[k], k).toBeTruthy();
    }
  });
});
