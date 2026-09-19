import type { StaticImageData } from "next/image";
import { fact, publishable, type Fact } from "../lib/verification";
import fleetSemitrailerSide from "../../public/photos/fleet-semitrailer-side.jpg";
import fleetSemitrailerFront from "../../public/photos/fleet-semitrailer-front.jpg";
import fleetRigidSide from "../../public/photos/fleet-rigid-side.jpg";
import fleetRigidRoad from "../../public/photos/fleet-rigid-road.jpg";
import historyIveco from "../../public/photos/history-iveco-tanker.jpg";

/**
 * Photography recovered from the archived exoil.pl (docs/brand-assets.md §3).
 * Rendered only once the client confirms ownership/licence and that the pictured fleet is current (content item K3).
 */
export interface Photo {
  src: StaticImageData;
  alt: string;
  caption: string;
  record: Fact<boolean>;
}

const ARCHIVE = "Zdjęcie z archiwalnej strony exoil.pl (2023) — prawa do użycia i aktualność floty do potwierdzenia przez klienta (K3)";

const photos = {
  fleetSemitrailerSide: { src: fleetSemitrailerSide, alt: "Czerwony ciągnik siodłowy z białą naczepą-cysterną EXOIL, widok z boku", caption: "Autocysterna EXOIL · zdjęcie z 2023 r.", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", ARCHIVE) },
  fleetSemitrailerFront: { src: fleetSemitrailerFront, alt: "Ciągnik z naczepą-cysterną EXOIL, widok z przodu pod kątem", caption: "Autocysterna EXOIL · zdjęcie z 2023 r.", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", ARCHIVE) },
  fleetRigidSide: { src: fleetRigidSide, alt: "Autocysterna EXOIL na podwoziu ciężarowym, widok z boku", caption: "Autocysterna EXOIL · zdjęcie z 2023 r.", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", ARCHIVE) },
  fleetRigidRoad: { src: fleetRigidRoad, alt: "Autocysterna EXOIL na drodze, widok z przodu", caption: "Autocysterna EXOIL · zdjęcie z 2023 r.", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", ARCHIVE) },
  historyIveco: { src: historyIveco, alt: "Archiwalne zdjęcie autocysterny na podwoziu Iveco", caption: "Zdjęcie archiwalne", record: fact(true, "CLIENT_CONFIRMATION_REQUIRED", "Archiwalna strona exoil.pl (2018) — prawa i datowanie do potwierdzenia") },
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;

/** The photo if it may be shown in the current content mode. */
export function getPhoto(id: PhotoId): Photo | undefined {
  const p = photos[id];
  return publishable(p.record) ? p : undefined;
}

export function getAllPhotoRecords(): readonly Photo[] {
  return Object.values(photos);
}
