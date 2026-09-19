import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderCta } from "@/components/page/OrderCta";
import { PageHeader } from "@/components/page/PageHeader";
import { Section } from "@/components/page/Section";
import { Steps } from "@/components/page/Steps";
import { FactValue } from "@/components/ui/FactValue";
import { getService } from "@/data/services";
import { heatingOilClaims } from "@/data/terms";
import { JsonLd, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Olej opałowy z dostawą",
  description:
    "Lekki olej opałowy od EXOIL z dostawą autocysterną do zbiornika przy budynku lub hali. Zapytaj o cenę i termin dostawy.",
  path: "/olej-opalowy/",
});

export default function HeatingOilPage() {
  const service = getService("heating-oil");
  if (!service) notFound();
  return (
    <>
      <PageHeader
        trail={[{ name: "Olej opałowy", path: "/olej-opalowy/" }]}
        title="Olej opałowy z dostawą do zbiornika"
        lede="Lekki olej opałowy przywozimy autocysterną i przepompowujemy bezpośrednio do zbiornika przy Twoim budynku, hali albo innej instalacji grzewczej."
      >
        <FactValue fact={heatingOilClaims.ekotermDistributor} as="div">
          {(v) => <p className="mt-6 max-w-2xl text-tank/85">{v}</p>}
        </FactValue>
        <div className="mt-10">
          <Link href="/zamow-paliwo/?paliwo=OO" className="inline-flex h-13 items-center bg-exoil-red px-7 font-display text-lg font-bold text-white hover:bg-red-deep">
            Zapytaj o olej opałowy
          </Link>
        </div>
      </PageHeader>

      <Section id="jak" eyebrow="Dostawa" title="Jak zamówić olej opałowy">
        <Steps
          steps={[
            { title: "Sprawdź zbiornik", body: "Oceń, ile oleju zmieści się w zbiorniku i czy autocysterna może do niego podjechać." },
            { title: "Wyślij zapytanie", body: "Podaj ilość, adres dostawy i preferowany termin. Odpowiemy z ceną." },
            { title: "Dostawa", body: "Kierowca przepompowuje olej do zbiornika, a ilość mierzy licznik autocysterny." },
            { title: "Dokument", body: "Dostajesz dokument wydania z ilością oleju, a potem fakturę." },
          ]}
        />
      </Section>

      <OrderCta title="Zapytaj o olej opałowy" fuel="OO" label="Zapytaj o cenę oleju" />
      <JsonLd data={serviceLd(service)} />
    </>
  );
}
