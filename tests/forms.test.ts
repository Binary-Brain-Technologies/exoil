import { describe, expect, it } from "vitest";
import { isValidNip } from "@/lib/nip";
import { contactSchema, orderSchema } from "@/lib/forms/schemas";
import { isHoneypotFilled, isTooFast } from "@/lib/forms/guard";

describe("NIP checksum", () => {
  it("accepts EXOIL's NIP in any common format", () => {
    for (const v of ["5632423329", "563-242-33-29", "563 242 33 29", "PL5632423329"]) expect(isValidNip(v)).toBe(true);
  });
  it("rejects wrong checksums and lengths", () => {
    for (const v of ["5632423328", "123", "abcdefghij", ""]) expect(isValidNip(v)).toBe(false);
  });
});

const validOrder = {
  company: "Firma Testowa",
  nip: "",
  contactName: "Jan Kowalski",
  phone: "+48 500 600 700",
  email: "jan@example.com",
  fuel: "ON",
  quantity: "2500",
  postalCode: "22-100",
  town: "Chełm",
  address: "",
  preferredDate: "",
  message: "",
};

describe("order request schema", () => {
  const schema = orderSchema(["ON", "PB", "OO"]);
  it("accepts a complete request", () => {
    const r = schema.safeParse(validOrder);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.quantity).toBe(2500);
  });
  it("rejects a fuel that is not currently offered", () => {
    expect(schema.safeParse({ ...validOrder, fuel: "PB98" }).success).toBe(false);
  });
  it("rejects a bad postcode and an invalid NIP", () => {
    expect(schema.safeParse({ ...validOrder, postalCode: "22100" }).success).toBe(false);
    expect(schema.safeParse({ ...validOrder, nip: "1234567890" }).success).toBe(false);
  });
  it("rejects non-integer or absurd quantities", () => {
    expect(schema.safeParse({ ...validOrder, quantity: "12.5" }).success).toBe(false);
    expect(schema.safeParse({ ...validOrder, quantity: "0" }).success).toBe(false);
    expect(schema.safeParse({ ...validOrder, quantity: "5000000" }).success).toBe(false);
  });
});

describe("contact schema", () => {
  it("requires a known topic", () => {
    expect(contactSchema.safeParse({ topic: "sales", name: "A", email: "a@b.pl", phone: "", message: "Dzień dobry" }).success).toBe(true);
    expect(contactSchema.safeParse({ topic: "marketing", name: "A", email: "a@b.pl", phone: "", message: "x" }).success).toBe(false);
  });
});

describe("spam guard", () => {
  it("flags a filled honeypot", () => {
    expect(isHoneypotFilled("http://spam")).toBe(true);
    expect(isHoneypotFilled("")).toBe(false);
    expect(isHoneypotFilled(undefined)).toBe(false);
  });
  it("flags only implausibly fast JS submissions", () => {
    expect(isTooFast(String(Date.now() - 300))).toBe(true);
    expect(isTooFast(String(Date.now() - 20_000))).toBe(false);
  });
  it("does not treat a missing timestamp (no JavaScript) as spam — regression for silently dropped messages", () => {
    expect(isTooFast(undefined)).toBe(false);
    expect(isTooFast("")).toBe(false);
  });
  it("does not expire forms left open for a long time", () => {
    expect(isTooFast(String(Date.now() - 1000 * 60 * 60 * 48))).toBe(false);
  });
});

describe("order date and NIP messages", () => {
  const schema = orderSchema(["ON"]);
  it("rejects a delivery date in the past", () => {
    const r = schema.safeParse({ ...validOrder, preferredDate: "2020-01-01" });
    expect(r.success).toBe(false);
  });
  it("explains a wrong-length NIP separately from a bad checksum", () => {
    const short = schema.safeParse({ ...validOrder, nip: "123" });
    expect(short.success ? "" : short.error.issues[0]?.message).toBe("NIP ma 10 cyfr.");
    const bad = schema.safeParse({ ...validOrder, nip: "5632423328" });
    expect(bad.success ? "" : bad.error.issues[0]?.message).toBe("Ten NIP ma niepoprawną sumę kontrolną.");
  });
});
