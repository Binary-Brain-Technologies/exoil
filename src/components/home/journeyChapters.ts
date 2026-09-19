/**
 * Homepage journey chapters (the part of the route rendered with the 3D / SVG system).
 * All copy is SAFE_GENERAL_COPY: it describes how fuel logistics works, with no quantities,
 * times, capacities or partner names (docs/content-verification.md §L).
 */
export interface JourneyChapter {
  id: string;
  index: string;
  label: string;
  /** Short status word for the HUD plate (illustrative). */
  status: string;
  title: string;
  body: string;
}

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: "zrodlo",
    index: "00",
    label: "Źródło",
    status: "W drodze do bazy",
    title: "Energia w ruchu.",
    body: "",
  },
  {
    id: "zaladunek",
    index: "01",
    label: "Załadunek",
    status: "Napełnianie komór",
    title: "Paliwo zaczyna drogę w bazie paliw.",
    body: "Autocysterna staje pod stanowiskiem nalewczym. Zbiornik jest podzielony na komory — każda przyjmuje osobny produkt albo osobną partię.",
  },
  {
    id: "trasa",
    index: "02",
    label: "Trasa",
    status: "W trasie",
    title: "Własne autocysterny, zaplanowana trasa.",
    body: "Dostawy wozimy autocysternami EXOIL. Przewóz dokumentujemy zgodnie z wymogami systemu SENT, a ładunek jedzie z kompletem dokumentów przewozowych.",
  },
  {
    id: "dostawa",
    index: "03",
    label: "Dostawa",
    status: "Rozładunek u klienta",
    title: "Pod wskazany adres, z pomiarem.",
    body: "Kierowca podłącza wąż do Twojego zbiornika. Ilość wydanego paliwa mierzy licznik autocysterny, a wynik trafia na dokument dostawy.",
  },
  {
    id: "zbiornik",
    index: "04",
    label: "Zbiornik",
    status: "Paliwo u klienta",
    title: "Paliwo tam, gdzie tankujesz.",
    body: "Olej napędowy trafia do zbiornika na terenie Twojej firmy. Pojazdy i maszyny tankujesz na miejscu, bez wyjazdów na stację.",
  },
];
