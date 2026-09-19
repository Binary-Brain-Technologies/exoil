import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/page/PageHeader";
import { Section } from "@/components/page/Section";
import { FactValue } from "@/components/ui/FactValue";
import { company, formatNip } from "@/data/company";
import { contactNotice } from "@/lib/forms/notices";
import { pageMetadata } from "@/lib/seo";
import { isVisible } from "@/lib/verification";

export const metadata = pageMetadata({
  title: "Kontakt — Exoil Paliwa Sp. z o.o., Chełm",
  description:
    "Kontakt z EXOIL: zamówienia paliwa, dostawy i logistyka, faktury, stacje paliw, kariera. Exoil Paliwa Sp. z o.o., ul. Okszowska 27, 22-100 Chełm.",
  path: "/kontakt/",
});

export default function ContactPage() {
  const a = company.address;
  const departments = company.departments.filter((d) => d.phones.some((p) => isVisible(p)) || isVisible(d.email));
  return (
    <>
      <PageHeader
        trail={[{ name: "Kontakt", path: "/kontakt/" }]}
        title="Kontakt"
        lede="Wybierz sprawę, a my przekażemy ją właściwej osobie."
      />

      <section aria-label="Najczęstsze sprawy" className="bg-tank py-14">
        <ul className="frame grid gap-px border-y border-line-light bg-line-light md:grid-cols-3">
          {[
            { href: "/zamow-paliwo/", t: "Zamówienie paliwa", d: "Formularz zapytania z rodzajem paliwa, ilością i miejscem dostawy." },
            { href: "/stacje/", t: "Stacje paliw", d: "Adresy stacji i dojazd." },
            { href: "/kariera/", t: "Praca", d: "Zgłoszenie do działu kadr." },
          ].map((l) => (
            <li key={l.href} className="bg-tank">
              <Link href={l.href} className="group block h-full p-6 hover:bg-paper">
                <h2 className="text-2xl font-bold group-hover:text-red-deep">{l.t}</h2>
                <p className="mt-2 text-ink-muted">{l.d}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {departments.length > 0 && (
        <Section id="dzialy" eyebrow="Działy" title="Telefony i e-maile działów" tone="paper">
          <ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {departments.map((d) => (
              <li key={d.id} className="border-t-2 border-carbon pt-5">
                <h3 className="text-xl font-bold">{d.label}</h3>
                <p className="mt-1 text-sm text-ink-muted">{d.description}</p>
                <ul className="mt-4 space-y-1">
                  {d.phones.map((p) => (
                    <li key={p.value}>
                      <FactValue fact={p}>
                        {(v) => (
                          <a href={`tel:+48${v.replace(/\s/g, "")}`} className="tabular text-lg hover:underline">
                            {v}
                          </a>
                        )}
                      </FactValue>
                    </li>
                  ))}
                  {d.email && (
                    <li>
                      <FactValue fact={d.email}>
                        {(v) => (
                          <a href={`mailto:${v}`} className="underline decoration-exoil-red underline-offset-4">
                            {v}
                          </a>
                        )}
                      </FactValue>
                    </li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="formularz" eyebrow="Formularz" title="Napisz do nas">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <ContactForm notice={contactNotice()} />
          <aside aria-labelledby="firma-title" className="lg:border-l lg:border-line-light lg:pl-10">
            <h2 id="firma-title" className="label text-ink-muted">
              Dane firmy
            </h2>
            <address className="mt-4 not-italic leading-relaxed">
              <strong className="font-display text-xl">
                <FactValue fact={company.legalName} />
              </strong>
              <br />
              <FactValue fact={a.street} />
              <br />
              <FactValue fact={a.postalCode} /> <FactValue fact={a.city} />
            </address>
            <dl className="mt-6 space-y-1 text-sm">
              <div>
                <dt className="inline text-ink-muted">KRS </dt>
                <dd className="tabular inline"><FactValue fact={company.krs} /></dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">NIP </dt>
                <dd className="tabular inline"><FactValue fact={company.nip}>{(v) => formatNip(v)}</FactValue></dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">REGON </dt>
                <dd className="tabular inline"><FactValue fact={company.regon} /></dd>
              </div>
              <FactValue fact={company.bankAccount} as="div">
                {(v) => (
                  <>
                    <dt className="inline text-ink-muted">Rachunek </dt>
                    <dd className="tabular inline">{v}</dd>
                  </>
                )}
              </FactValue>
            </dl>
          </aside>
        </div>
      </Section>
    </>
  );
}
