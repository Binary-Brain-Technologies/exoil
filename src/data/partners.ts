import { fact, isPublic, type Fact } from "@/lib/verification";

/**
 * Suppliers and partners. Rendered ONLY when verified, with approved wording (and an approved logo file for logos).
 * Partner claims are never shown unapproved. See docs/partners-verification.md.
 */
export interface Partner {
  id: string;
  name: string;
  relationship: "supplier" | "terminal" | "authorisation" | "community";
  record: Fact<boolean>;
  approvedWording?: string;
  /** Path under /public/partners/, supplied by the client together with written permission. */
  logo?: string;
}

const OLD = "Archiwalna strona /oferta/hurt-paliw/ (30.10.2023)";

const partners: Partner[] = [
  { id: "orlen", name: "ORLEN", relationship: "supplier", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "aramco", name: "Aramco", relationship: "supplier", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "bp", name: "BP", relationship: "supplier", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "unimot", name: "Unimot", relationship: "supplier", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "totalenergies", name: "TotalEnergies (na starej stronie: Total)", relationship: "supplier", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "solumus", name: "Solumus", relationship: "supplier", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "ekoterm", name: "ORLEN Ekoterm — autoryzowany dystrybutor", relationship: "authorisation", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", "Archiwalna strona /oferta/olej-opalowy/ (09.10.2023)") },
];

export function getApprovedPartners(): Partner[] {
  return partners.filter((p) => isPublic(p.record) && p.record.value && !!p.approvedWording);
}
