import { fact, isVisible, type Fact } from "@/lib/verification";

/**
 * Operational metrics. Nothing here is rendered unless verified (docs/business-metrics-verification.md).
 * Old 2018 values are kept only so the client can see what needs replacing in review mode.
 */
export interface Metric {
  id: string;
  label: string;
  value: Fact<string>;
  unit?: string;
  asOf?: string;
}

const OLD_2018 = "Archiwalna strona „Exoil w liczbach” — ostatnia edycja 08.06.2018";

const metrics: Metric[] = [
  { id: "employees", label: "pracowników", value: fact("70", "CONFLICTING", `${OLD_2018}; strona Kariera 2023: „ponad 100 osób”`) },
  { id: "business-customers", label: "firm współpracujących", value: fact("ok. 4 000", "OUTDATED", OLD_2018) },
  { id: "km-per-year", label: "km rocznie w dostawach", value: fact("ok. 2 000 000", "OUTDATED", OLD_2018) },
  { id: "transactions", label: "transakcji rocznie", value: fact("ponad 500 000", "OUTDATED", OLD_2018) },
  { id: "tanker-capacity", label: "pojemność autocystern", value: fact("17–35", "CONFLICTING", "Archiwalna strona Dostawy 2023 vs zdjęcie naczepy 2023 (komory łącznie 36 000 l)"), unit: "m³" },
  { id: "polish-capital", label: "polskiego kapitału", value: fact("100", "CLIENT_CONFIRMATION_REQUIRED", OLD_2018), unit: "%" },
];

export function getMetrics(): Metric[] {
  return metrics.filter((m) => isVisible(m.value));
}
