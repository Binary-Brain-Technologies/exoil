"use client";

import { useMemo, useState } from "react";
import { distanceKm } from "@/lib/geo";

export interface StationSummary {
  slug: string;
  name: string;
  city: string;
  address: string;
  fuels: string;
  /** Town-level position (rounded to ~1 km on the server), only for ordering by distance. */
  approx: { lat: number; lng: number };
}

/**
 * Filters the server-rendered station list by town and, only after an explicit click, orders it by distance
 * from the visitor. Location is requested from the browser only then, used locally and never sent anywhere.
 */
export function StationFinder({ stations }: { stations: StationSummary[] }) {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "pending" | "denied" | "unsupported">("idle");

  const normalize = (s: string) => s.toLocaleLowerCase("pl").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ł/g, "l");

  const list = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = q ? stations.filter((s) => normalize(`${s.city} ${s.name} ${s.address}`).includes(q)) : stations;
    return origin ? [...filtered].sort((a, b) => distanceKm(origin, a.approx) - distanceKm(origin, b.approx)) : filtered;
  }, [query, origin, stations]);

  function locate() {
    if (!("geolocation" in navigator)) return setGeoState("unsupported");
    setGeoState("pending");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("idle");
      },
      () => setGeoState("denied"),
      { maximumAge: 600000, timeout: 10000, enableHighAccuracy: false },
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="label mb-2 block text-ink-muted">Szukaj po miejscowości</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="np. Chełm"
            className="h-12 w-full border-2 border-carbon bg-paper px-4 text-lg outline-none focus-visible:border-exoil-red"
          />
        </label>
        <button
          type="button"
          onClick={locate}
          className="h-12 border-2 border-carbon px-5 font-medium hover:bg-carbon hover:text-white"
        >
          {geoState === "pending" ? "Ustalanie położenia…" : "Pokaż najbliższe"}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-6 text-sm text-ink-muted">
        {geoState === "denied" && "Bez zgody na lokalizację pokazujemy stacje w kolejności listy."}
        {geoState === "unsupported" && "Ta przeglądarka nie udostępnia lokalizacji."}
        {origin && geoState === "idle" && "Stacje ułożone od najbliższej (odległość w linii prostej)."}
        {query && `Znalezione stacje: ${list.length}.`}
      </p>
      <ul className="mt-4 border-t border-line-light">
        {list.map((s) => (
          <li key={s.slug} className="border-b border-line-light">
            <a href={`/stacje/${s.slug}/`} className="grid gap-1 py-5 hover:bg-paper sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-2">
              <span>
                <span className="block font-display text-xl font-bold">{s.name}</span>
                <span className="block text-ink-muted">{s.address}</span>
              </span>
              <span className="label text-ink-muted">{s.fuels}</span>
            </a>
          </li>
        ))}
        {list.length === 0 && (
          <li className="py-6 text-ink-muted">
            Nie ma stacji EXOIL w tej miejscowości. Wyczyść pole wyszukiwania, żeby zobaczyć wszystkie stacje.
          </li>
        )}
      </ul>
    </div>
  );
}
