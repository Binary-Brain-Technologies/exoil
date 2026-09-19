import Link from "next/link";
import { PageHeader } from "@/components/page/PageHeader";
import { PhotoBand } from "@/components/page/PhotoBand";
import { Section } from "@/components/page/Section";
import { FactValue } from "@/components/ui/FactValue";
import { company, formatNip } from "@/data/company";
import { getServices } from "@/data/services";
import { getStations } from "@/data/stations";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "O firmie — Exoil Paliwa Sp. z o.o.",
  description:
    "Exoil Paliwa Sp. z o.o. z Chełma: hurt paliw, dostawy własnymi autocysternami i stacje paliw EXOIL. Dane rejestrowe, koncesja URE, historia i dokumenty.",
  path: "/o-firmie/",
});

export default function AboutPage() {
  const services = getServices();
  const stations = getStations();
  const a = company.address;
  return (
    <>
      <PageHeader
        trail={[{ name: "O firmie", path: "/o-firmie/" }]}
        title="Firma paliwowa z Chełma"
        lede={
          <>
            EXOIL to firma paliwowa z Chełma. Kupujemy paliwo, przewozimy je własnymi autocysternami i sprzedajemy — firmom w
            hurcie i kierowcom na {stations.length} stacjach EXOIL.
            <FactValue fact={company.originYear}>{(y) => ` Historia EXOIL sięga ${y} roku.`}</FactValue>
          </>
        }
      />

      <PhotoBand id="fleetRigidSide" />

      <Section id="czym-sie-zajmujemy" eyebrow="Działalność" title="Czym się zajmujemy">
        <ul className="grid gap-px border border-line-light bg-line-light md:grid-cols-2">
          {services.map((s) => (
            <li key={s.id} className="bg-tank">
              <Link href={s.href} className="block h-full p-6 hover:bg-paper">
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 text-ink-muted">{s.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="dane" eyebrow="Dane rejestrowe" title="Dane spółki" tone="paper">
        <dl className="grid gap-px border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Nazwa", <FactValue key="n" fact={company.legalName} />],
            ["Siedziba", <><FactValue fact={a.street} />, <FactValue fact={a.postalCode} /> <FactValue fact={a.city} /></>],
            ["KRS", <FactValue key="k" fact={company.krs} />],
            ["NIP", <FactValue key="ni" fact={company.nip}>{(v) => formatNip(v)}</FactValue>],
            ["REGON", <FactValue key="r" fact={company.regon} />],
            ["Kapitał zakładowy", <FactValue key="c" fact={company.shareCapital} />],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-paper p-6">
              <dt className="label text-ink-muted">{label}</dt>
              <dd className="tabular mt-2 text-lg">{value}</dd>
            </div>
          ))}
        </dl>
        <FactValue fact={company.registryCourt} as="div">
          {(v) => <p className="mt-6 text-ink-muted">Sąd rejestrowy: {v}</p>}
        </FactValue>
      </Section>

      <Section id="wiecej" eyebrow="Więcej" title="Historia, dokumenty, praca">
        <ul className="grid gap-6 md:grid-cols-3">
          {[
            { href: "/o-firmie/historia/", t: "Historia", d: "Jak zmieniała się firma i jej forma prawna." },
            { href: "/o-firmie/dokumenty/", t: "Dokumenty", d: "Koncesja na obrót paliwami i dane rejestrowe." },
            { href: "/kariera/", t: "Kariera", d: "Praca w EXOIL i formularz zgłoszeniowy." },
          ].map((l) => (
            <li key={l.href} className="border-t-2 border-carbon pt-5">
              <Link href={l.href} className="group block">
                <h3 className="text-2xl font-bold group-hover:text-red-deep">{l.t}</h3>
                <p className="mt-2 text-ink-muted">{l.d}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
