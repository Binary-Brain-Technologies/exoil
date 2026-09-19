import { fact, type Fact } from "@/lib/verification";

/**
 * Client-approved legal texts. `null` = not supplied yet (launch blocker, see docs/legal-launch-requirements.md).
 * Forms work without them (showing the interim notice); `npm run launch-check` fails until all are present.
 */
export const legal = {
  privacyPolicyApproved: fact(false, "CLIENT_CONFIRMATION_REQUIRED", "Brak zatwierdzonej polityki prywatności"),
  orderFormNotice: null as string | null,
  contactFormNotice: null as string | null,
  recruitmentNotice: null as string | null,
  /** Draft wording for the non-binding nature of the order request (L8). */
  orderNonBinding: fact(
    "Formularz to zapytanie, a nie wiążące zamówienie. Cenę, ilość i termin dostawy potwierdza dział sprzedaży.",
    "SAFE_GENERAL_COPY",
    "Treść robocza — do akceptacji klienta (L8)",
  ) satisfies Fact<string>,
};

/**
 * Interim text under forms until the client supplies approved clauses: it only identifies the controller
 * (a registry fact). It is NOT a legal information clause — `npm run launch-check` fails while it is in use.
 */
export const PENDING_NOTICE = "Administrator danych osobowych: Exoil Paliwa Sp. z o.o., ul. Okszowska 27, 22-100 Chełm.";
