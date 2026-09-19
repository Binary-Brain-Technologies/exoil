import { fact, isVisible, type Fact } from "@/lib/verification";

export interface CompanyDocument {
  id: string;
  type: string;
  title: string;
  /** Issuing authority or source. */
  issuer: string;
  number?: string;
  issuedOn?: string;
  validity: string;
  /** Machine-readable end of validity (YYYY-MM-DD), when the document has one. */
  validUntil?: string;
  /** Path under /public or an official registry URL. */
  href?: string;
  hrefLabel?: string;
  /** Size of a downloadable file, e.g. "420 KB". */
  fileSize?: string;
  record: Fact<boolean>;
}

const documents: CompanyDocument[] = [
  {
    id: "concession",
    type: "Koncesja",
    title: "Koncesja na obrót paliwami ciekłymi (OPC)",
    issuer: "Prezes Urzędu Regulacji Energetyki",
    number: "OPC/12090/22487/W/OLB/2013/AGo",
    issuedOn: "2013-06-06",
    validity: "Ważna do 31.12.2030 (ostatnia zmiana: 17.01.2025)",
    validUntil: "2030-12-31",
    href: "https://rejestry.ure.gov.pl/",
    hrefLabel: "Sprawdź w rejestrze URE",
    record: fact(true, "VERIFIED_CURRENT", "Rejestr koncesji URE (api.ure.gov.pl/api/ConcessionFuel), odczyt 19.09.2026"),
  },
  {
    id: "krs",
    type: "Rejestr",
    title: "Krajowy Rejestr Sądowy — odpis aktualny",
    issuer: "Ministerstwo Sprawiedliwości",
    number: "KRS 0001016528",
    validity: "Dane bieżące w rejestrze publicznym",
    href: "https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/",
    hrefLabel: "Wyszukiwarka KRS",
    record: fact(true, "VERIFIED_CURRENT", "KRS 0001016528, stan na 10.07.2026"),
  },
  {
    id: "tax-strategy",
    type: "Strategia podatkowa",
    title: "Informacja o realizowanej strategii podatkowej",
    issuer: "Exoil Paliwa Sp. z o.o.",
    validity: "Za ostatni zakończony rok obrotowy — do dostarczenia przez klienta",
    record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", "Na archiwalnej stronie wersja za 2023 r. — nieaktualna"),
  },
  {
    id: "zus",
    type: "Zaświadczenie",
    title: "Zaświadczenie o niezaleganiu w opłacaniu składek (ZUS)",
    issuer: "Zakład Ubezpieczeń Społecznych",
    validity: "Do dostarczenia przez klienta (archiwalna wersja z 2018 r. — nieaktualna)",
    record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", "Archiwalny plik z 08.05.2018"),
  },
  {
    id: "us",
    type: "Zaświadczenie",
    title: "Zaświadczenie o niezaleganiu w podatkach (US)",
    issuer: "Urząd Skarbowy",
    validity: "Do dostarczenia przez klienta (archiwalna wersja z 2018 r. — nieaktualna)",
    record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", "Archiwalny plik z 08.05.2018"),
  },
];

export function getDocuments(): CompanyDocument[] {
  return documents.filter((d) => isVisible(d.record));
}
