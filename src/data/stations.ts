import { fact, isVisible, type Fact } from "@/lib/verification";

/**
 * Canonical station registry. Every station mention on the site derives from here:
 * station index, station pages, homepage network, footer, sitemap and JSON-LD.
 * Evidence per field: docs/stations-verification.md.
 */

const URE = "Rejestr infrastruktury stacji paliw URE (koncesja DKN 22487), odczyt 19.09.2026";
const OLD = "Archiwalna strona /oferta/stacje-paliw/ (ostatnia edycja 13.06.2024) — wymaga potwierdzenia klienta";
const OLD_MAP = "Współrzędne z archiwalnej mapy (wtyczka WP Google Map) — tylko do schematu sieci, nie do danych strukturalnych";

export type FuelCategory = "petrol" | "diesel" | "lpg";

export type Facility =
  | "open24h"
  | "truckParking"
  | "shop"
  | "hotFood"
  | "coffee"
  | "carWash"
  | "toilets"
  | "adBlue"
  | "fleetCards";

export const FACILITY_LABELS: Record<Facility, string> = {
  open24h: "Czynna całą dobę",
  truckParking: "Parking dla samochodów ciężarowych",
  shop: "Sklep",
  hotFood: "Przekąski na ciepło",
  coffee: "Kawa",
  carWash: "Myjnia",
  toilets: "Toalety",
  adBlue: "AdBlue",
  fleetCards: "Karty flotowe",
};

export const FUEL_CATEGORY_LABELS: Record<FuelCategory, string> = {
  petrol: "Benzyna",
  diesel: "Olej napędowy",
  lpg: "LPG",
};

export interface OpeningHours {
  /** 0 = Monday … 6 = Sunday */
  days: number[];
  opens: string;
  closes: string;
}

export interface Station {
  id: string;
  slug: string;
  name: string;
  /** Short label used on maps and lists. */
  shortName: string;
  /** Listed as an EXOIL station under the current URE concession. */
  listing: Fact<boolean>;
  street: Fact<string>;
  postalCode: Fact<string>;
  city: string;
  /** Postal town when different from the locality (e.g. Siennica Różana). */
  postTown?: string;
  county: string;
  fuels: Fact<FuelCategory[]>;
  phone?: Fact<string>;
  email?: Fact<string>;
  open24h?: Fact<boolean>;
  hours?: Fact<OpeningHours[]>;
  facilities: Fact<Facility[]>;
  /** Approximate — used only to lay out the schematic network map. */
  approx: Fact<{ lat: number; lng: number }>;
  note?: string;
}

const listed = fact(true, "VERIFIED_CURRENT", URE);
const noFacilities = fact<Facility[]>([], "CLIENT_CONFIRMATION_REQUIRED", "Legenda ikon z archiwalnej strony nie jest odtwarzalna — do uzupełnienia przez klienta");

const stations: Station[] = [
  {
    id: "okszowska",
    slug: "chelm-okszowska",
    name: "Stacja EXOIL Chełm, ul. Okszowska",
    shortName: "Chełm — Okszowska",
    listing: listed,
    street: fact("ul. Okszowska 27", "VERIFIED_CURRENT", URE),
    postalCode: fact("22-100", "VERIFIED_CURRENT", URE),
    city: "Chełm",
    county: "Chełm",
    fuels: fact<FuelCategory[]>(["petrol", "diesel", "lpg"], "VERIFIED_CURRENT", URE),
    phone: fact("519 310 573", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    email: fact("okszowska@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    open24h: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD),
    facilities: noFacilities,
    approx: fact({ lat: 51.145203, lng: 23.481168 }, "CLIENT_CONFIRMATION_REQUIRED", OLD_MAP),
  },
  {
    id: "hutnicza",
    slug: "chelm-hutnicza",
    name: "Stacja EXOIL Chełm, ul. Hutnicza",
    shortName: "Chełm — Hutnicza",
    listing: listed,
    // URE registry: "Hutnicza 19"; archived site and 2025 concession decision: "Hutnicza 3".
    street: fact("ul. Hutnicza", "VERIFIED_CURRENT", `${URE} (numer budynku rozbieżny: 19 w rejestrze, 3 na starej stronie)`),
    postalCode: fact("22-100", "VERIFIED_CURRENT", URE),
    city: "Chełm",
    county: "Chełm",
    fuels: fact<FuelCategory[]>(["petrol", "diesel"], "VERIFIED_CURRENT", URE),
    phone: fact("519 303 195", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    email: fact("hutnicza@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    open24h: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD),
    facilities: noFacilities,
    approx: fact({ lat: 51.1464108, lng: 23.495686 }, "CLIENT_CONFIRMATION_REQUIRED", OLD_MAP),
    note: "Numer budynku do potwierdzenia (3 czy 19).",
  },
  {
    id: "siedliszcze",
    slug: "siedliszcze",
    name: "Stacja EXOIL Siedliszcze",
    shortName: "Siedliszcze",
    listing: listed,
    street: fact("ul. Chełmska 2", "VERIFIED_CURRENT", URE),
    postalCode: fact("22-130", "VERIFIED_CURRENT", URE),
    city: "Siedliszcze",
    county: "chełmski",
    fuels: fact<FuelCategory[]>(["petrol", "diesel"], "VERIFIED_CURRENT", URE),
    phone: fact("519 310 577", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    email: fact("siedliszcze@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    open24h: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD),
    facilities: noFacilities,
    approx: fact({ lat: 51.1763048, lng: 23.1783423 }, "CLIENT_CONFIRMATION_REQUIRED", OLD_MAP),
  },
  {
    id: "wierzbica",
    slug: "wierzbica",
    name: "Stacja EXOIL Wierzbica",
    shortName: "Wierzbica",
    listing: listed,
    // URE lists only the number "25"; the street name comes from the archived site.
    street: fact("ul. Chełmska 25", "CLIENT_CONFIRMATION_REQUIRED", `${URE} (bez nazwy ulicy) + ${OLD}`),
    postalCode: fact("22-150", "VERIFIED_CURRENT", URE),
    city: "Wierzbica",
    county: "chełmski",
    fuels: fact<FuelCategory[]>(["petrol", "diesel", "lpg"], "VERIFIED_CURRENT", URE),
    phone: fact("575 660 076", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    email: fact("wierzbica@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    open24h: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD),
    facilities: noFacilities,
    approx: fact({ lat: 51.2577536, lng: 23.31137 }, "CLIENT_CONFIRMATION_REQUIRED", OLD_MAP),
  },
  {
    id: "siennica",
    slug: "siennica-krolewska-duza",
    name: "Stacja EXOIL Siennica Królewska Duża",
    shortName: "Siennica Królewska Duża",
    listing: listed,
    street: fact("Siennica Królewska Duża 130", "VERIFIED_CURRENT", URE),
    postalCode: fact("22-304", "VERIFIED_CURRENT", URE),
    city: "Siennica Królewska Duża",
    postTown: "Siennica Różana",
    county: "krasnostawski",
    fuels: fact<FuelCategory[]>(["petrol", "diesel", "lpg"], "VERIFIED_CURRENT", URE),
    phone: fact("723 403 407", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    email: fact("siennica@exoil.pl", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    open24h: fact(true, "CLIENT_CONFIRMATION_REQUIRED", OLD),
    facilities: noFacilities,
    approx: fact({ lat: 50.9940028, lng: 23.259864 }, "CLIENT_CONFIRMATION_REQUIRED", OLD_MAP),
  },
  {
    id: "swidnik",
    slug: "swidnik-piasecka",
    name: "Stacja EXOIL Świdnik, ul. Piasecka",
    shortName: "Świdnik",
    listing: listed,
    street: fact("ul. Piasecka 20", "VERIFIED_CURRENT", URE),
    postalCode: fact("21-040", "VERIFIED_CURRENT", URE),
    city: "Świdnik",
    county: "świdnicki",
    fuels: fact<FuelCategory[]>(["petrol", "diesel"], "VERIFIED_CURRENT", URE),
    facilities: noFacilities,
    approx: fact({ lat: 51.2116337, lng: 22.6463495 }, "CLIENT_CONFIRMATION_REQUIRED", OLD_MAP),
  },
  {
    id: "zamosc",
    slug: "zamosc-zagloby",
    name: "Stacja EXOIL Zamość, ul. Zagłoby",
    shortName: "Zamość",
    listing: listed,
    street: fact("ul. Zagłoby 10", "VERIFIED_CURRENT", URE),
    postalCode: fact("22-400", "VERIFIED_CURRENT", URE),
    city: "Zamość",
    county: "Zamość",
    fuels: fact<FuelCategory[]>(["petrol", "diesel"], "VERIFIED_CURRENT", URE),
    phone: fact("575 733 883", "CLIENT_CONFIRMATION_REQUIRED", OLD),
    open24h: fact(false, "CLIENT_CONFIRMATION_REQUIRED", OLD),
    hours: fact<OpeningHours[]>(
      [
        { days: [0, 1, 2, 3, 4, 5], opens: "06:00", closes: "22:00" },
        { days: [6], opens: "09:00", closes: "17:00" },
      ],
      "CLIENT_CONFIRMATION_REQUIRED",
      OLD,
    ),
    facilities: noFacilities,
    approx: fact({ lat: 50.7299129, lng: 23.2714769 }, "CLIENT_CONFIRMATION_REQUIRED", OLD_MAP),
  },
];

/**
 * Town-level position (rounded to 0.01°, ~1 km). Used only to lay out the schematic map and to order stations by
 * distance. Never render or emit the precise `approx` value — it is unconfirmed (docs/stations-verification.md).
 */
export function townPosition(s: Station): { lat: number; lng: number } {
  const r = (v: number) => Math.round(v * 100) / 100;
  return { lat: r(s.approx.value.lat), lng: r(s.approx.value.lng) };
}

/** Stations that may be listed in the current content mode, in registry order. */
export function getStations(): Station[] {
  return stations.filter((s) => isVisible(s.listing));
}

export function getStation(slug: string): Station | undefined {
  return getStations().find((s) => s.slug === slug);
}

/** For tests and tooling only — includes stations that are not listed. */
export function getAllStationRecords(): readonly Station[] {
  return stations;
}
