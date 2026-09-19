import { fact, type Fact } from "../lib/verification";

/**
 * Commercial and operational terms. All from the archived site (2019–2023) and therefore hidden in production
 * until the client confirms them (docs/content-verification.md §D).
 */
const WHOLESALE = "Archiwalna strona /oferta/hurt-paliw/ (30.10.2023)";
const DELIVERY = "Archiwalna strona /oferta/dostawy/ (30.10.2023)";
const TANKS = "Archiwalna strona /oferta/zbiorniki/ (13.02.2019)";

export interface Term {
  id: string;
  label: string;
  value: Fact<string>;
}

export const wholesaleTerms: Term[] = [
  { id: "individual", label: "Cena i płatność", value: fact("Cenę, formę płatności i termin dostawy ustalamy indywidualnie przy każdym zamówieniu.", "SAFE_GENERAL_COPY", "Ogólny opis procesu; do akceptacji klienta") },
  { id: "min-order", label: "Minimalne zamówienie", value: fact("500 litrów", "CLIENT_CONFIRMATION_REQUIRED", WHOLESALE) },
  { id: "free-delivery", label: "Transport", value: fact("Bezpłatny transport przy jednorazowym zamówieniu od 500 litrów", "CLIENT_CONFIRMATION_REQUIRED", `${WHOLESALE}; ${DELIVERY}`) },
  { id: "temperature", label: "Rozliczenie", value: fact("W temperaturze rzeczywistej albo referencyjnej 15 °C", "CLIENT_CONFIRMATION_REQUIRED", WHOLESALE) },
  { id: "pickup", label: "Odbiór własnym transportem", value: fact("Bazy paliw PERN: Emilianów, Małaszewicze; bazy ORLEN: Lublin, Sokółka", "CLIENT_CONFIRMATION_REQUIRED", WHOLESALE) },
];

export const deliveryTerms: Term[] = [
  { id: "lead-time", label: "Termin", value: fact("Do 24 godzin od złożenia zamówienia (bez weekendów)", "CLIENT_CONFIRMATION_REQUIRED", DELIVERY) },
  { id: "capacity", label: "Autocysterny", value: fact("Pojemność od 17 do 35 m³", "CONFLICTING", `${DELIVERY} vs zdjęcie naczepy 2023`) },
  { id: "meters", label: "Pomiar", value: fact("Układy pomiarowe legalizowane przez GUM", "CLIENT_CONFIRMATION_REQUIRED", DELIVERY) },
  { id: "sent-poa", label: "SENT", value: fact("Możliwość udzielenia pełnomocnictwa do zamykania zgłoszeń SENT — potwierdzenie odbioru wysyłamy e-mailem", "CLIENT_CONFIRMATION_REQUIRED", DELIVERY) },
];

export const tankSpecs: Term[] = [
  { id: "capacities", label: "Pojemności", value: fact("1 500 · 2 500 · 5 000 · 7 500 · 10 000 l", "CLIENT_CONFIRMATION_REQUIRED", TANKS) },
  { id: "equipment", label: "Wyposażenie podstawowe", value: fact("Pompa ok. 56 l/min, wąż 6 m, pistolet automatyczny, przepływomierz elektroniczny, filtr", "CLIENT_CONFIRMATION_REQUIRED", TANKS) },
  { id: "approvals", label: "Dopuszczenia", value: fact("Pozytywna opinia ppoż. i ochrony środowiska, zatwierdzenie typu przez UDT", "CLIENT_CONFIRMATION_REQUIRED", TANKS) },
  { id: "warranty", label: "Gwarancja szczelności", value: fact("10 lat", "CLIENT_CONFIRMATION_REQUIRED", TANKS) },
  { id: "rental", label: "Wynajem", value: fact("Dla stałych klientów — warunki ustalane indywidualnie", "CLIENT_CONFIRMATION_REQUIRED", TANKS) },
  { id: "monitoring", label: "Odczyt online", value: fact("Opcjonalne urządzenia do zdalnego odczytu stanu paliwa i rozliczania na kierowcę i pojazd (montaż przez partnerów)", "CLIENT_CONFIRMATION_REQUIRED", TANKS) },
];

export const heatingOilClaims = {
  ekotermDistributor: fact(
    "Autoryzowany dystrybutor Oleju Grzewczego Ekoterm (ORLEN) na terenie województwa lubelskiego",
    "CLIENT_CONFIRMATION_REQUIRED",
    "Archiwalna strona /oferta/olej-opalowy/ (09.10.2023); wymaga aktualnego upoważnienia i zgody na użycie znaku",
  ),
};
