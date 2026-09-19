import { fact, isVisible, type Fact } from "@/lib/verification";

const CONCESSION = "Zakres koncesji URE OPC/12090/22487/W/OLB/2013/AGo (zmiana 17.01.2025)";
const OLD = "Archiwalna strona /oferta/hurt-paliw/ (ostatnia edycja 30.10.2023)";

export interface Fuel {
  id: string;
  name: string;
  /** Accusative form for phrases like "Zapytaj o …". */
  nameAcc: string;
  /** Code used in forms and e-mails. */
  code: string;
  category: "diesel" | "petrol" | "heating-oil" | "lpg";
  offered: Fact<boolean>;
  /** Offered for delivery / wholesale (as opposed to station retail only). */
  wholesale: boolean;
  note?: string;
}

const fuels: Fuel[] = [
  { id: "diesel", code: "ON", name: "Olej napędowy", nameAcc: "olej napędowy", category: "diesel", wholesale: true, offered: fact(true, "VERIFIED_CURRENT", CONCESSION) },
  { id: "petrol", code: "PB", name: "Benzyna bezołowiowa", nameAcc: "benzynę bezołowiową", category: "petrol", wholesale: true, offered: fact(true, "VERIFIED_CURRENT", CONCESSION) },
  { id: "heating-oil", code: "OO", name: "Lekki olej opałowy", nameAcc: "lekki olej opałowy", category: "heating-oil", wholesale: true, offered: fact(true, "VERIFIED_CURRENT", CONCESSION) },
  { id: "lpg", code: "LPG", name: "Autogaz LPG", nameAcc: "autogaz LPG", category: "lpg", wholesale: false, offered: fact(true, "VERIFIED_CURRENT", `${CONCESSION}; rejestr stacji URE`), note: "Na wybranych stacjach." },
  // Grades from the archived wholesale page — hidden until confirmed.
  { id: "diesel-bio", code: "ON-B", name: "Olej napędowy z biokomponentem", nameAcc: "olej napędowy z biokomponentem", category: "diesel", wholesale: true, offered: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "diesel-nobio", code: "ON-0", name: "Olej napędowy bez biokomponentu", nameAcc: "olej napędowy bez biokomponentu", category: "diesel", wholesale: true, offered: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "diesel-arctic", code: "ON-A", name: "Olej napędowy arktyczny (sezonowo)", nameAcc: "olej napędowy arktyczny", category: "diesel", wholesale: true, offered: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "pb95", code: "PB95", name: "Benzyna PB 95", nameAcc: "benzynę PB 95", category: "petrol", wholesale: true, offered: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
  { id: "pb98", code: "PB98", name: "Benzyna PB 98", nameAcc: "benzynę PB 98", category: "petrol", wholesale: true, offered: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD) },
];

export function getFuels(): Fuel[] {
  return fuels.filter((f) => isVisible(f.offered) && f.offered.value);
}

export function getWholesaleFuels(): Fuel[] {
  return getFuels().filter((f) => f.wholesale);
}

/** Codes accepted by the order form in the current mode. */
export function orderableFuelCodes(): string[] {
  return getWholesaleFuels().map((f) => f.code);
}
