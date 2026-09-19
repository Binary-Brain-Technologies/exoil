import { resolveSiteUrl } from "@/lib/site-url";
import { fact, type Fact } from "@/lib/verification";

const KRS_SOURCE = "KRS 0001016528 — odpis aktualny, stan na 10.07.2026 (api-krs.ms.gov.pl, odczyt 19.09.2026)";
const OLD_CONTACT = "Archiwalna strona /kontakt/ (ostatnia edycja 27.05.2024) — wymaga potwierdzenia klienta";

export interface Department {
  id: "sales" | "logistics" | "accounting" | "hr";
  label: string;
  description: string;
  phones: Fact<string>[];
  email?: Fact<string>;
}

export const company = {
  brand: "EXOIL",
  legalName: fact("Exoil Paliwa Sp. z o.o.", "VERIFIED_CURRENT", KRS_SOURCE),
  legalNameFull: fact("Exoil Paliwa spółka z ograniczoną odpowiedzialnością", "VERIFIED_CURRENT", KRS_SOURCE),
  address: {
    street: fact("ul. Okszowska 27", "VERIFIED_CURRENT", KRS_SOURCE),
    postalCode: fact("22-100", "VERIFIED_CURRENT", KRS_SOURCE),
    city: fact("Chełm", "VERIFIED_CURRENT", KRS_SOURCE),
    region: fact("lubelskie", "VERIFIED_CURRENT", KRS_SOURCE),
    country: "PL",
  },
  nip: fact("5632423329", "VERIFIED_CURRENT", KRS_SOURCE),
  regon: fact("061545019", "VERIFIED_CURRENT", KRS_SOURCE),
  krs: fact("0001016528", "VERIFIED_CURRENT", KRS_SOURCE),
  shareCapital: fact("7 205 000,00 zł", "VERIFIED_CURRENT", KRS_SOURCE),
  registryCourt: fact(
    "Sąd Rejonowy Lublin-Wschód w Lublinie z siedzibą w Świdniku",
    "CLIENT_CONFIRMATION_REQUIRED",
    "Stopka archiwalnej strony (2026-06); pole nie występuje w odpisie API KRS",
  ),
  krsRegisteredOn: fact("2023-01-30", "VERIFIED_CURRENT", KRS_SOURCE),
  bankAccount: fact(
    "14 1930 1725 2520 0573 6786 0001",
    "CLIENT_CONFIRMATION_REQUIRED",
    OLD_CONTACT,
  ),
  orderPhone: fact("519 310 310", "CLIENT_CONFIRMATION_REQUIRED", "Stopka archiwalna 2026-06 i oklejenie cystern 2023"),
  generalEmail: fact("biuro@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT),
  facebookUrl: fact(
    "https://www.facebook.com/p/Exoil-Paliwa-Sp-z-oo-Sp-K-100054226220613/",
    "CLIENT_CONFIRMATION_REQUIRED",
    "Profil nadal pod nazwą sp.k. — link dopiero po zmianie nazwy/akceptacji",
  ),
  /** Business origin year — used for "Historia EXOIL sięga … roku" and computed "years of history". */
  originYear: fact(1997, "CLIENT_CONFIRMATION_REQUIRED", "Archiwalna strona (2018), kronikatygodnia.pl 2024/2025"),
  departments: [
    {
      id: "sales",
      label: "Dział sprzedaży",
      description: "Zamówienia paliwa, wyceny, warunki współpracy.",
      phones: ["519 310 310", "519 310 572", "725 045 045", "724 724 564", "519 303 199"].map((p) =>
        fact(p, "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT),
      ),
      email: fact("biuro@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT),
    },
    {
      id: "logistics",
      label: "Dział logistyki",
      description: "Terminy i przebieg dostaw, dokumenty przewozowe.",
      phones: [fact("577 871 787", "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT)],
      email: fact("zakupy@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT),
    },
    {
      id: "accounting",
      label: "Księgowość",
      description: "Faktury, płatności, rozrachunki.",
      phones: [fact("725 106 090", "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT)],
      email: fact("finanse@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT),
    },
    {
      id: "hr",
      label: "Kadry",
      description: "Rekrutacja i sprawy pracownicze.",
      phones: [fact("519 310 569", "CLIENT_CONFIRMATION_REQUIRED", OLD_CONTACT)],
      // The old site used a named employee's address. A role address must be supplied instead.
    },
  ] satisfies Department[],
} as const;

export const SITE_URL = resolveSiteUrl();

export function formatNip(nip: string): string {
  return `${nip.slice(0, 3)}-${nip.slice(3, 6)}-${nip.slice(6, 8)}-${nip.slice(8)}`;
}
