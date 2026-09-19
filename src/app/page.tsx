import Link from "next/link";
import { FactValue } from "@/components/ui/FactValue";
import { DrawOnView } from "@/components/ui/DrawOnView";
import { Journey } from "@/components/home/Journey";
import { JourneyDiagram } from "@/components/home/JourneyDiagram";
import { JOURNEY_CHAPTERS } from "@/components/home/journeyChapters";
import { NetworkMap } from "@/components/home/NetworkMap";
import { PhotoBand } from "@/components/page/PhotoBand";
import { RailNode, RouteRail } from "@/components/home/RouteRail";
import { company, formatNip } from "@/data/company";
import { getDocuments } from "@/data/documents";
import { getHistory } from "@/data/history";
import { getServices, isServiceEnabled } from "@/data/services";
import { getStations } from "@/data/stations";
import { stationCountLabel } from "@/lib/plural";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "EXOIL — hurt i dostawy paliw, stacje paliw | Chełm",
  description:
    "Hurtowa sprzedaż paliw i dostawy własnymi autocysternami: od bazy paliw do zbiornika w Twojej firmie. Stacje paliw EXOIL w województwie lubelskim. Zapytaj o dostawę.",
  path: "/",
});

function Eyebrow({ index, label, tone = "dark" }: { index: string; label: string; tone?: "dark" | "light" }) {
  return (
    <p className={`label flex items-center gap-3 ${tone === "dark" ? "text-night-muted" : "text-ink-muted"}`}>
      <span className={tone === "dark" ? "text-tank" : "text-carbon"}>{index}</span>
      <span aria-hidden className="h-px w-8 bg-exoil-red" />
      {label}
    </p>
  );
}

function townsList(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} i ${names[names.length - 1]}`;
}

export default function HomePage() {
  const stations = getStations();
  const towns = Array.from(new Set(stations.map((s) => s.city)));
  const concession = getDocuments().find((d) => d.id === "concession");
  const legalHistory = getHistory();
  const tanks = isServiceEnabled("tanks");
  const heating = isServiceEnabled("heating-oil");
  const services = getServices();

  return (
    <div className="relative">
      <RouteRail />

      {/* 00–04: the journey (3D on capable desktops, SVG elsewhere). All text is server-rendered here. */}
      <Journey chapters={JOURNEY_CHAPTERS} doubleWall={tanks}>
        {JOURNEY_CHAPTERS.map((c, i) => (
          <article
            key={c.id}
            id={c.id}
            aria-labelledby={`${c.id}-title`}
            className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-16 lg:py-24"
          >
            <RailNode index={c.index} label={c.label} />
            <div className="frame lg:!pr-12">
              {i === 0 ? (
                <>
                  <Eyebrow index={c.index} label="Hurt · dostawy · stacje paliw" />
                  <h1 id={`${c.id}-title`} className="mt-6">
                    <span className="display block text-[clamp(3rem,5.6vw,5.5rem)] text-tank">Energia w&nbsp;ruchu.</span>
                    <span className="mt-6 block max-w-xl font-sans text-[1.2rem] font-normal leading-snug tracking-normal text-tank/85 [font-variation-settings:normal]">
                      EXOIL sprzedaje paliwa hurtowo i dowozi je własnymi autocysternami — od bazy paliw do zbiornika w Twojej
                      firmie. Do tego stacje paliw EXOIL w województwie lubelskim.
                    </span>
                  </h1>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link href="/zamow-paliwo/" className="inline-flex h-13 items-center bg-exoil-red px-7 font-display text-lg font-bold text-white hover:bg-red-deep">
                      Zamów paliwo
                    </Link>
                    <Link href="/hurt-paliw/" className="inline-flex h-13 items-center border-2 border-tank/70 px-6 font-display text-lg font-bold text-tank hover:border-tank hover:bg-tank hover:text-carbon">
                      Poznaj ofertę
                    </Link>
                    <Link href="/stacje/" className="inline-flex h-13 items-center px-3 font-medium text-tank underline decoration-exoil-red decoration-2 underline-offset-8 hover:text-white">
                      Znajdź stację
                    </Link>
                  </div>
                  <p className="label mt-16 hidden text-night-muted lg:block">Przewiń, żeby przejechać trasę paliwa ↓</p>
                </>
              ) : (
                <>
                  <Eyebrow index={c.index} label={c.label} />
                  <h2 id={`${c.id}-title`} className="mt-5 text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold text-tank">
                    {c.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-lg text-tank/80">{c.body}</p>
                  {c.id === "dostawa" && (
                    <Link href="/dostawy/" className="mt-6 inline-block font-medium text-tank underline decoration-exoil-red decoration-2 underline-offset-8">
                      Jak wygląda dostawa krok po kroku
                    </Link>
                  )}
                  {c.id === "zbiornik" && tanks && (
                    <Link href="/zbiorniki/" className="mt-6 inline-block font-medium text-tank underline decoration-exoil-red decoration-2 underline-offset-8">
                      Zbiorniki na paliwo dla firm
                    </Link>
                  )}
                </>
              )}
              {/* Per-chapter diagram on small screens (desktop shows the sticky visual instead). */}
              <JourneyDiagram step={i} className="mt-10 w-full max-w-xl lg:hidden" doubleWall={tanks} />
            </div>
          </article>
        ))}
      </Journey>

      {/* Photography: proof that the system is real (shown once rights are confirmed). */}
      <PhotoBand id="fleetSemitrailerSide" />

      {/* 05 NAPĘD */}
      <section id="naped" aria-labelledby="naped-title" className="relative bg-tank py-24 lg:py-32">
        <RailNode index="05" label="Napęd" />
        <div className="frame">
          <Eyebrow index="05" label="Napęd" tone="light" />
          <h2 id="naped-title" className="mt-5 max-w-3xl text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold">
            Na tym paliwie pracują pojazdy, maszyny i instalacje grzewcze.
          </h2>
          <div className="mt-14 grid gap-px bg-line-light md:grid-cols-3">
            {[
              { k: "Flota", t: "Olej napędowy i benzyna", d: "Do samochodów dostawczych, ciężarowych i osobowych w firmie." },
              { k: "Maszyny", t: "Olej napędowy", d: "Do maszyn i urządzeń tankowanych na miejscu pracy." },
              ...(heating ? [{ k: "Ciepło", t: "Lekki olej opałowy", d: "Do kotłów i instalacji grzewczych w budynkach i halach." }] : []),
            ].map((b) => (
              <div key={b.k} className="bg-tank pt-6 md:pr-8">
                <p className="label text-ink-muted">{b.k}</p>
                <h3 className="mt-3 text-2xl font-bold">{b.t}</h3>
                <p className="mt-3 text-ink-muted">{b.d}</p>
              </div>
            ))}
          </div>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
            {services
              .filter((s) => s.id !== "stations")
              .map((s) => (
                <li key={s.id}>
                  <Link href={s.href} className="font-display text-lg font-bold underline decoration-exoil-red decoration-2 underline-offset-8 hover:text-red-deep">
                    {s.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* 06 SIEĆ */}
      <section id="siec" aria-labelledby="siec-title" className="relative bg-night py-24 text-tank lg:py-32">
        <RailNode index="06" label="Sieć" />
        <div className="frame grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
          <div>
            <Eyebrow index="06" label="Sieć" />
            <h2 id="siec-title" className="mt-5 text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold">
              Trasa prowadzi też na stacje EXOIL.
            </h2>
            <p className="mt-5 max-w-md text-lg text-tank/80">
              <span className="tabular">{stationCountLabel(stations.length)}</span> EXOIL w województwie lubelskim: {townsList(towns)}.
            </p>
            <ul className="mt-8 border-t border-line-dark">
              {stations.map((s) => (
                <li key={s.id} className="border-b border-line-dark">
                  <Link href={`/stacje/${s.slug}/`} className="flex items-baseline justify-between gap-4 py-3 hover:text-white">
                    <span className="font-medium">{s.shortName}</span>
                    <span className="text-sm text-night-muted">
                      <FactValue fact={s.street} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/stacje/" className="mt-8 inline-flex h-12 items-center border-2 border-tank/70 px-6 font-display font-bold hover:bg-tank hover:text-carbon">
              Wszystkie stacje
            </Link>
          </div>
          <DrawOnView>
            <NetworkMap stations={stations} />
          </DrawOnView>
        </div>
      </section>

      {/* 07 KONCESJA / ZAUFANIE */}
      <section id="koncesja" aria-labelledby="koncesja-title" className="relative bg-paper py-24 lg:py-32">
        <RailNode index="07" label="Koncesja" />
        <div className="frame">
          <Eyebrow index="07" label="Koncesja i dane rejestrowe" tone="light" />
          <h2 id="koncesja-title" className="mt-5 max-w-3xl text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold">
            Obrót paliwami na podstawie koncesji Prezesa URE.
          </h2>
          <dl className="mt-14 grid gap-px border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-4">
            {concession && (
              <>
                <div className="bg-paper p-6">
                  <dt className="label text-ink-muted">Koncesja OPC</dt>
                  <dd className="tabular mt-3 font-mono text-[0.95rem]">
                    {concession.number?.split("/").map((part, i, all) => (
                      <span key={i}>
                        {part}
                        {i < all.length - 1 && (
                          <>
                            /<wbr />
                          </>
                        )}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="bg-paper p-6">
                  <dt className="label text-ink-muted">Ważność</dt>
                  <dd className="tabular mt-3 font-display text-2xl font-bold">
                    {concession.validUntil ? `do ${concession.validUntil.split("-").reverse().join(".")}` : concession.validity}
                  </dd>
                </div>
              </>
            )}
            <div className="bg-paper p-6">
              <dt className="label text-ink-muted">KRS</dt>
              <dd className="tabular mt-3 font-display text-2xl font-bold">
                <FactValue fact={company.krs} />
              </dd>
            </div>
            <div className="bg-paper p-6">
              <dt className="label text-ink-muted">NIP</dt>
              <dd className="tabular mt-3 font-display text-2xl font-bold">
                <FactValue fact={company.nip}>{(v) => formatNip(v)}</FactValue>
              </dd>
            </div>
          </dl>
          <Link href="/o-firmie/dokumenty/" className="mt-10 inline-block font-display text-lg font-bold underline decoration-exoil-red decoration-2 underline-offset-8">
            Dokumenty firmy
          </Link>
        </div>
      </section>

      {/* 08 HISTORIA */}
      <section id="historia" aria-labelledby="historia-title" className="relative bg-tank py-24 lg:py-32">
        <RailNode index="08" label="Historia" />
        <div className="frame">
          <Eyebrow index="08" label="Historia" tone="light" />
          <h2 id="historia-title" className="mt-5 text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold">
            Od spółki komandytowej do spółki z o.o.
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {legalHistory.map((e) => (
              <li key={`${e.year}-${e.title}`} className="border-t-2 border-carbon pt-5">
                <FactValue fact={e.record} as="div">
                  {() => (
                    <>
                      <p className="display text-4xl text-exoil-red">{e.year}</p>
                      <h3 className="mt-3 text-xl font-bold">{e.title}</h3>
                      <p className="mt-2 text-ink-muted">{e.body}</p>
                    </>
                  )}
                </FactValue>
              </li>
            ))}
          </ol>
          <Link href="/o-firmie/historia/" className="mt-12 inline-block font-display text-lg font-bold underline decoration-exoil-red decoration-2 underline-offset-8">
            Historia EXOIL
          </Link>
        </div>
      </section>

      {/* 09 ZAMÓWIENIE */}
      <section id="zamowienie" aria-labelledby="zamowienie-title" className="relative bg-exoil-red py-24 text-white lg:py-32">
        <RailNode index="09" label="Cel" />
        <div className="frame grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <p className="label flex items-center gap-3 text-white">
              <span className="text-white">09</span>
              <span aria-hidden className="h-px w-8 bg-white" />
              Cel trasy
            </p>
            <h2 id="zamowienie-title" className="display mt-5 text-[clamp(2.5rem,5.5vw,5rem)]">
              Dokąd dowieźć paliwo?
            </h2>
            <p className="mt-6 max-w-xl text-lg text-white">
              Podaj rodzaj paliwa, ilość i miejsce dostawy. Dział sprzedaży odezwie się z ceną i terminem.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <Link href="/zamow-paliwo/" className="inline-flex h-14 items-center justify-center bg-paper px-8 font-display text-lg font-bold text-carbon hover:bg-tank">
              Wyślij zapytanie o paliwo
            </Link>
            <FactValue fact={company.orderPhone}>
              {(v) => (
                <a href={`tel:+48${v.replace(/\s/g, "")}`} className="tabular font-display text-2xl font-bold hover:underline">
                  tel. {v}
                </a>
              )}
            </FactValue>
            <Link href="/kontakt/" className="text-white underline underline-offset-4 hover:text-white">
              Inne sprawy: kontakt z działami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
