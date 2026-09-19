import { NetworkMap } from "@/components/home/NetworkMap";
import { PageHeader } from "@/components/page/PageHeader";
import { StationFinder, type StationSummary } from "@/components/stations/StationFinder";
import { DrawOnView } from "@/components/ui/DrawOnView";
import { stationAddress, stationFuelLabel } from "@/data/station-helpers";
import { getStations, townPosition } from "@/data/stations";
import { stationCountLabel } from "@/lib/plural";
import { gasStationLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata() {
  const towns = Array.from(new Set(getStations().map((s) => s.city)));
  return pageMetadata({
    title: "Stacje paliw EXOIL — województwo lubelskie",
    description: `Stacje paliw EXOIL: ${towns.join(", ")}. Adresy, paliwa i dojazd.`,
    path: "/stacje/",
  });
}

export default function StationsPage() {
  const stations = getStations();
  const summaries: StationSummary[] = stations.map((s) => ({
    slug: s.slug,
    name: s.name.replace("Stacja EXOIL ", ""),
    city: s.city,
    address: stationAddress(s),
    fuels: stationFuelLabel(s),
    approx: townPosition(s),
  }));
  return (
    <>
      <PageHeader
        trail={[{ name: "Stacje", path: "/stacje/" }]}
        title="Stacje paliw EXOIL"
        lede={`${stationCountLabel(stations.length)} w województwie lubelskim. Wybierz stację, żeby wyznaczyć dojazd.`}
      />
      <section aria-label="Lista i mapa stacji" className="bg-tank py-14 lg:py-20">
        <div className="frame grid gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <StationFinder stations={summaries} />
          <div className="bg-night p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <DrawOnView>
              <NetworkMap stations={stations} />
            </DrawOnView>
          </div>
        </div>
      </section>
      <JsonLd data={stations.map(gasStationLd)} />
    </>
  );
}
