import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderCta } from "@/components/page/OrderCta";
import { PageHeader } from "@/components/page/PageHeader";
import { PhotoBand } from "@/components/page/PhotoBand";
import { Section } from "@/components/page/Section";
import { Steps } from "@/components/page/Steps";
import { TermsList } from "@/components/page/TermsList";
import { FactValue } from "@/components/ui/FactValue";
import { getWholesaleFuels } from "@/data/fuels";
import { getService } from "@/data/services";
import { wholesaleTerms } from "@/data/terms";
import { JsonLd, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hurtowa sprzedaż paliw dla firm",
  description:
    "Hurt paliw EXOIL: olej napędowy, benzyny i lekki olej opałowy dla firm z dostawą własnymi autocysternami. Koncesja URE na obrót paliwami. Wyślij zapytanie o cenę i termin.",
  path: "/hurt-paliw/",
});

export default function WholesalePage() {
  const service = getService("wholesale");
  if (!service) notFound();
  const fuels = getWholesaleFuels();

  return (
    <>
      <PageHeader
        trail={[{ name: "Hurt paliw", path: "/hurt-paliw/" }]}
        title="Hurtowa sprzedaż paliw dla firm"
        lede="Olej napędowy, benzyny i olej opałowy kupujesz bezpośrednio od EXOIL. Paliwo dowozimy własnymi autocysternami pod adres, który wskażesz."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/zamow-paliwo/" className="inline-flex h-13 items-center bg-exoil-red px-7 font-display text-lg font-bold text-white hover:bg-red-deep">
            Zapytaj o cenę paliwa
          </Link>
          <Link href="/dostawy/" className="inline-flex h-13 items-center border-2 border-tank/70 px-6 font-display text-lg font-bold hover:bg-tank hover:text-carbon">
            Jak działają dostawy
          </Link>
        </div>
      </PageHeader>

      <PhotoBand id="fleetSemitrailerFront" />

      <Section id="paliwa" eyebrow="Paliwa" title="Co możesz zamówić">
        <ul className="grid gap-px border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-3">
          {fuels.map((f) => (
            <li key={f.id} className="flex flex-col justify-between gap-6 bg-tank p-6">
              <div>
                <p className="label text-ink-muted">{f.code}</p>
                <h3 className="mt-2 text-2xl font-bold">
                  <FactValue fact={f.offered}>{() => f.name}</FactValue>
                </h3>
                {f.note && <p className="mt-2 text-ink-muted">{f.note}</p>}
              </div>
              <Link href={`/zamow-paliwo/?paliwo=${f.code}`} className="font-medium underline decoration-exoil-red decoration-2 underline-offset-8 hover:text-red-deep">
                Zapytaj o {f.nameAcc}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-ink-muted">
          Obrót paliwami prowadzimy na podstawie koncesji Prezesa URE. Szczegóły w{" "}
          <Link href="/o-firmie/dokumenty/" className="underline decoration-exoil-red underline-offset-4">
            dokumentach firmy
          </Link>
          .
        </p>
      </Section>

      <Section id="jak-zamowic" eyebrow="Zamówienie" title="Jak wygląda zamówienie hurtowe" tone="paper">
        <Steps
          steps={[
            { title: "Zapytanie", body: "Wysyłasz zapytanie: rodzaj paliwa, ilość, miejsce i preferowany termin dostawy." },
            { title: "Wycena i termin", body: "Dział sprzedaży potwierdza cenę, formę płatności i termin dostawy." },
            { title: "Dostawa", body: "Autocysterna EXOIL przywozi paliwo pod wskazany adres i wydaje je przez licznik." },
            { title: "Dokumenty", body: "Dostajesz dokument wydania z ilością paliwa, a potem fakturę." },
          ]}
        />
      </Section>

      <Section id="warunki" eyebrow="Warunki" title="Warunki współpracy">
        <TermsList terms={wholesaleTerms} />
      </Section>

      <OrderCta title="Zapytaj o cenę hurtową" />
      <JsonLd data={serviceLd(service)} />
    </>
  );
}
