import { FUEL_CATEGORY_LABELS, type Station } from "./stations";
import { publishable } from "../lib/verification";

export function stationAddress(s: Station, mode?: "production" | "review"): string {
  const street = publishable(s.street, mode);
  const postal = publishable(s.postalCode, mode);
  const town = s.postTown ?? s.city;
  const cityLine = [postal, town].filter(Boolean).join(" ");
  // For villages the street field already holds "Locality + number".
  return [street, cityLine].filter(Boolean).join(", ");
}

export function stationFuelLabel(s: Station): string {
  return (publishable(s.fuels) ?? []).map((f) => FUEL_CATEGORY_LABELS[f]).join(" · ");
}
