import Link from "next/link";
import { notFound } from "next/navigation";
import { JourneyDiagram } from "@/components/home/JourneyDiagram";
import { OrderCta } from "@/components/page/OrderCta";
import { PageHeader } from "@/components/page/PageHeader";
import { PhotoBand } from "@/components/page/PhotoBand";
import { Section } from "@/components/page/Section";
import { TermsList } from "@/components/page/TermsList";
import { getService, isServiceEnabled } from "@/data/services";
import { deliveryTerms } from "@/data/terms";
import { JsonLd, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Dostawy paliwa autocysterną",
  description:
    "Dostawy oleju napędowego, benzyn i oleju opałowego własnymi autocysternami EXOIL: zamówienie, załadunek w bazie, przewóz dokumentowany zgodnie z SENT, pomiar licznikiem i dokument dostawy.",
  path: "/dostawy/",
});

const STAGES = [
  { step: 0, title: "Zamówienie", body: "Przyjmujemy zapytanie z rodzajem paliwa, ilością, adresem i oknem czasowym dostawy. Potwierdzamy cenę i termin." },
  { step: 1, title: "Załadunek", body: "Autocysterna ładuje paliwo w bazie paliw. Każda komora zbiornika przyjmuje osobny produkt albo osobną partię." },
  { step: 2, title: "Przewóz", body: "Przewóz dokumentujemy zgodnie z wymogami systemu SENT. Kierowca jedzie z kompletem dokumentów przewozowych." },
  { step: 3, title: "Rozładunek i pomiar", body: "Na miejscu kierowca podłącza wąż do zbiornika. Ilość wydanego paliwa mierzy licznik autocysterny." },
  { step: 4, title: "Dokumenty", body: "Wynik pomiaru trafia na dokument dostawy, który zostaje u Ciebie." },
];

export default function DeliveriesPage() {
  const service = getService("delivery");
  if (!service) notFound();
  return (
    <>
      <PageHeader
        trail={[{ name: "Dostawy", path: "/dostawy/" }]}
        title="Dostawy paliwa autocysterną"
        lede="Paliwo przyjeżdża do Ciebie autocysterną EXOIL. Poniżej każdy etap dostawy — od zapytania do dokumentu, który zostaje w Twojej firmie."
      >
        <div className="mt-10">
          <Link href="/zamow-paliwo/" className="inline-flex h-13 items-center bg-exoil-red px-7 font-display text-lg font-bold text-white hover:bg-red-deep">
            Zamów dostawę
          </Link>
        </div>
      </PageHeader>

      <PhotoBand id="fleetRigidRoad" />

      <section aria-labelledby="etapy-title" className="bg-night py-16 text-tank lg:py-24">
        <div className="frame">
          <p className="label flex items-center gap-3 text-night-muted">
            <span aria-hidden className="h-px w-8 bg-exoil-red" />
            Etapy dostawy
          </p>
          <h2 id="etapy-title" className="mt-4 text-[clamp(1.75rem,3vw,2.6rem)] font-extrabold">
            Od zapytania do dokumentu dostawy
          </h2>
          <ol className="mt-12 border-t border-line-dark">
            {STAGES.map((s, i) => (
              <li key={s.title} className="grid items-center gap-6 border-b border-line-dark py-10 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.1fr)]">
                <p className="display text-5xl text-exoil-red tabular">{String(i + 1).padStart(2, "0")}</p>
                <div>
                  <h3 className="text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 max-w-md text-tank/80">{s.body}</p>
                </div>
                <JourneyDiagram step={s.step} className="w-full max-w-md" doubleWall={isServiceEnabled("tanks")} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section id="warunki-dostaw" eyebrow="Warunki" title="Warunki dostaw" intro="Termin i koszt dostawy potwierdzamy przy każdym zamówieniu.">
        <TermsList terms={deliveryTerms} />
      </Section>

      <OrderCta title="Zamów dostawę paliwa" label="Zamów dostawę" />
      <JsonLd data={serviceLd(service)} />
    </>
  );
}
