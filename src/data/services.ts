import { fact, isVisible, type Fact } from "../lib/verification";

const CONCESSION =
  "Koncesja URE OPC/12090/22487/W/OLB/2013/AGo, zmiana z 17.01.2025 (obrót, w tym własnymi autocysternami); rejestr URE, odczyt 19.09.2026";

export type ServiceId = "wholesale" | "delivery" | "stations" | "heating-oil" | "tanks";

export interface Service {
  id: ServiceId;
  /** Route of the service page (with trailing slash). */
  href: string;
  /** Short label for navigation. */
  navLabel: string;
  title: string;
  /** One factual sentence, safe to render wherever the service is listed. */
  summary: string;
  /** Whether the business line is current. Only visible services get pages, nav entries and sitemap URLs. */
  offered: Fact<boolean>;
  /** Position in the header navigation; undefined = footer/"Oferta" group only. */
  headerOrder?: number;
}

const services: Service[] = [
  {
    id: "wholesale",
    href: "/hurt-paliw/",
    navLabel: "Hurt paliw",
    title: "Hurtowa sprzedaż paliw",
    summary: "Olej napędowy, benzyny i olej opałowy dla firm, z dostawą własnymi autocysternami.",
    offered: fact(true, "VERIFIED_CURRENT", `${CONCESSION}; PKD 46.81.Z (KRS)`),
    headerOrder: 1,
  },
  {
    id: "delivery",
    href: "/dostawy/",
    navLabel: "Dostawy",
    title: "Dostawy paliwa autocysternami",
    summary: "Własne autocysterny dowożą paliwo pod wskazany adres, z pomiarem i dokumentacją przewozu.",
    offered: fact(true, "VERIFIED_CURRENT", `${CONCESSION}; rejestr autocystern URE`),
    headerOrder: 2,
  },
  {
    id: "stations",
    href: "/stacje/",
    navLabel: "Stacje",
    title: "Stacje paliw EXOIL",
    summary: "Stacje EXOIL w województwie lubelskim.",
    offered: fact(true, "VERIFIED_CURRENT", "Rejestr infrastruktury stacji URE; PKD 47.30.Z (KRS)"),
    headerOrder: 3,
  },
  {
    id: "heating-oil",
    href: "/olej-opalowy/",
    navLabel: "Olej opałowy",
    title: "Olej opałowy",
    summary: "Lekki olej opałowy dowożony autocysterną do zbiornika klienta.",
    offered: fact(true, "VERIFIED_CURRENT", `${CONCESSION} — zakres obejmuje lekki olej opałowy`),
  },
  {
    id: "tanks",
    href: "/zbiorniki/",
    navLabel: "Zbiorniki",
    title: "Zbiorniki na paliwo dla firm",
    summary: "Dwupłaszczowe zbiorniki z dystrybutorem do tankowania pojazdów i maszyn na terenie firmy.",
    offered: fact(
      true,
      "CLIENT_CONFIRMATION_REQUIRED",
      "Archiwalna strona /oferta/zbiorniki/ — ostatnia edycja 13.02.2019",
    ),
    headerOrder: 4,
  },
];

export function getServices(): Service[] {
  return services.filter((s) => isVisible(s.offered) && s.offered.value);
}

export function getService(id: ServiceId): Service | undefined {
  return getServices().find((s) => s.id === id);
}

export function isServiceEnabled(id: ServiceId): boolean {
  return getService(id) !== undefined;
}

/** Enabled in production (verified), regardless of review mode — used for redirects, which must be stable. */
export function isServiceLive(id: ServiceId): boolean {
  const s = services.find((x) => x.id === id);
  return !!s && s.offered.value && (s.offered.status === "VERIFIED_CURRENT");
}
