import { fact, isVisible, type Fact } from "@/lib/verification";

/**
 * Two separate timelines, never merged:
 *  - business: the EXOIL business as the owners describe it (needs client approval)
 *  - legal: registry facts about the legal entities (verified)
 * Do not state or imply that the current sp. z o.o. has existed since 1997.
 */
export interface HistoryEntry {
  year: string;
  title: string;
  body: string;
  kind: "business" | "legal";
  record: Fact<boolean>;
}

const entries: HistoryEntry[] = [
  {
    year: "1997",
    kind: "business",
    title: "Początek",
    body: "Historia EXOIL sięga 1997 roku i pierwszej stacji paliw w Chełmie.",
    record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", "Archiwalna strona Historia (2018); kronikatygodnia.pl 2024/2025 — dokładne brzmienie do akceptacji klienta"),
  },
  {
    year: "2013",
    kind: "legal",
    title: "Spółka komandytowa i koncesja",
    body: "Rejestracja Exoil Paliwa Sp. z o.o. Sp.K. w KRS (11.04.2013) oraz udzielenie koncesji na obrót paliwami ciekłymi (06.06.2013).",
    record: fact(true, "VERIFIED_CURRENT", "KRS 0000458124; rejestr koncesji URE"),
  },
  {
    year: "2023",
    kind: "legal",
    title: "Przekształcenie w spółkę z o.o.",
    body: "Exoil Paliwa Sp. z o.o. Sp.K. została przekształcona w Exoil Paliwa Sp. z o.o. — wpis do KRS 30.01.2023. Numery NIP i REGON pozostały bez zmian.",
    record: fact(true, "VERIFIED_CURRENT", "KRS 0001016528 i 0000458124"),
  },
  {
    year: "2025",
    kind: "legal",
    title: "Aktualizacja koncesji",
    body: "Zmiana koncesji OPC decyzją Prezesa URE z 17.01.2025. Koncesja jest ważna do 31.12.2030.",
    record: fact(true, "VERIFIED_CURRENT", "Rejestr koncesji URE"),
  },
];

export function getHistory(kind?: HistoryEntry["kind"]): HistoryEntry[] {
  return entries.filter((e) => isVisible(e.record) && (!kind || e.kind === kind));
}

/** For tooling only — every record regardless of status. */
export function getAllHistoryRecords(): readonly HistoryEntry[] {
  return entries;
}
