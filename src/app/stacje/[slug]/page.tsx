import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { FactValue } from "@/components/ui/FactValue";
import { stationAddress, stationFuelLabel } from "@/data/station-helpers";
import { FACILITY_LABELS, FUEL_CATEGORY_LABELS, getStation, getStations, townPosition, type OpeningHours } from "@/data/stations";
import { directionsUrl, distanceKm } from "@/lib/geo";
import { gasStationLd, JsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { isReviewMode, isVisible, publishable } from "@/lib/verification";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getStations().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getStation(slug);
  if (!s) return {};
  return pageMetadata({
    title: `${s.name} — adres i dojazd`,
    description: `${s.name}: ${stationAddress(s, "production")}. Paliwa: ${stationFuelLabel(s) || "zobacz na stronie"}. Dojazd i pozostałe stacje EXOIL w okolicy.`,
    path: `/stacje/${s.slug}/`,
  });
}

const DAYS = ["pon.", "wt.", "śr.", "czw.", "pt.", "sob.", "niedz."];

function formatHours(rows: OpeningHours[]): string[] {
  return rows.map((r) => {
    const first = DAYS[r.days[0] ?? 0];
    const last = DAYS[r.days[r.days.length - 1] ?? 0];
    const days = r.days.length > 1 ? `${first}–${last}` : first;
    return `${days} ${r.opens}–${r.closes}`;
  });
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line-light py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
      <dt className="label pt-1 text-ink-muted">{label}</dt>
      <dd className="text-lg">{children}</dd>
    </div>
  );
}

export default async function StationPage({ params }: Props) {
  const { slug } = await params;
  const station = getStation(slug);
  if (!station) notFound();
  const address = stationAddress(station);
  const fuels = publishable(station.fuels) ?? [];
  const facilities = publishable(station.facilities) ?? [];
  const others = getStations()
    .filter((s) => s.id !== station.id)
    .sort((a, b) => distanceKm(townPosition(station), townPosition(a)) - distanceKm(townPosition(station), townPosition(b)))
    .slice(0, 3);

  return (
    <>
      <PageHeader
        trail={[
          { name: "Stacje", path: "/stacje/" },
          { name: station.shortName, path: `/stacje/${station.slug}/` },
        ]}
        title={station.name}
        lede={address}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={directionsUrl(`EXOIL ${address}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center bg-exoil-red px-7 font-display text-lg font-bold text-white hover:bg-red-deep"
          >
            Wyznacz trasę<span className="sr-only"> (otwiera Mapy Google w nowej karcie)</span>
          </a>
          <Link href="/stacje/" className="inline-flex h-13 items-center border-2 border-tank/70 px-6 font-display text-lg font-bold hover:bg-tank hover:text-carbon">
            Wszystkie stacje
          </Link>
        </div>
      </PageHeader>

      <section aria-labelledby="dane-title" className="bg-tank py-14 lg:py-20">
        <div className="frame grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div>
            <h2 id="dane-title" className="text-3xl font-extrabold">
              Informacje o stacji
            </h2>
            <dl className="mt-8 border-t border-line-light">
              <Row label="Adres">
                <FactValue fact={station.street} />
                {isVisible(station.street) && <br />}
                <FactValue fact={station.postalCode} /> {station.postTown ?? station.city}
                {station.note && isReviewMode() && <p className="mt-2 text-sm text-ink-muted">{station.note}</p>}
              </Row>
              {fuels.length > 0 && (
                <Row label="Paliwa">
                  <FactValue fact={station.fuels}>{(v) => v.map((f) => FUEL_CATEGORY_LABELS[f]).join(", ")}</FactValue>
                </Row>
              )}
              {isVisible(station.open24h) && station.open24h?.value && !isVisible(station.hours) && (
                <Row label="Godziny otwarcia">
                  <FactValue fact={station.open24h}>{() => "Całodobowo"}</FactValue>
                </Row>
              )}
              {isVisible(station.hours) && (
                <Row label="Godziny otwarcia">
                  <FactValue fact={station.hours} as="div">
                    {(rows) => (
                      <ul>
                        {formatHours(rows).map((h) => (
                          <li key={h} className="tabular">
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </FactValue>
                </Row>
              )}
              {isVisible(station.phone) && (
                <Row label="Telefon">
                  <FactValue fact={station.phone}>
                    {(v) => (
                      <a className="tabular underline decoration-exoil-red underline-offset-4" href={`tel:+48${v.replace(/\s/g, "")}`}>
                        {v}
                      </a>
                    )}
                  </FactValue>
                </Row>
              )}
              {isVisible(station.email) && (
                <Row label="E-mail">
                  <FactValue fact={station.email}>
                    {(v) => (
                      <a className="underline decoration-exoil-red underline-offset-4" href={`mailto:${v}`}>
                        {v}
                      </a>
                    )}
                  </FactValue>
                </Row>
              )}
              {facilities.length > 0 && (
                <Row label="Na stacji">
                  <FactValue fact={station.facilities} as="div">
                    {(v) => (
                      <ul className="flex flex-wrap gap-2">
                        {v.map((f) => (
                          <li key={f} className="border border-line-light bg-paper px-3 py-1 text-base">
                            {FACILITY_LABELS[f]}
                          </li>
                        ))}
                      </ul>
                    )}
                  </FactValue>
                </Row>
              )}
            </dl>
            <p className="mt-8 max-w-xl text-ink-muted">
              Szukasz dostawy paliwa do firmy?{" "}
              <Link href="/zamow-paliwo/" className="font-medium text-carbon underline decoration-exoil-red decoration-2 underline-offset-4">
                Wyślij zapytanie o dostawę
              </Link>
              .
            </p>
          </div>
          <aside aria-labelledby="okolica-title">
            <h2 id="okolica-title" className="label text-ink-muted">
              Inne stacje EXOIL w okolicy
            </h2>
            <ul className="mt-4 border-t border-line-light">
              {others.map((s) => (
                <li key={s.id} className="border-b border-line-light">
                  <Link href={`/stacje/${s.slug}/`} className="block py-4 hover:text-red-deep">
                    <span className="block font-display text-lg font-bold">{s.shortName}</span>
                    <span className="block text-sm text-ink-muted">{stationAddress(s)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
      <JsonLd data={gasStationLd(station)} />
    </>
  );
}
