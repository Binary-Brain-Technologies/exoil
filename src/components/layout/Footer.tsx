import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { FactValue } from "@/components/ui/FactValue";
import { company, formatNip } from "@/data/company";
import { getServices } from "@/data/services";
import { getStations } from "@/data/stations";
import { hasNews } from "@/lib/news-index";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="label mb-4 text-night-muted">{title}</h2>
      <ul className="space-y-2.5 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-tank/90 hover:text-white hover:underline">
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  const services = getServices();
  const stations = getStations();
  const a = company.address;
  return (
    <footer className="bg-night text-tank">
      <div className="frame grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="EXOIL — strona główna" className="inline-block p-3 bg-paper">
            <Logo width={132} />
          </Link>
          <p className="mt-6 max-w-xs text-night-muted">
            Hurtowa sprzedaż paliw, dostawy autocysternami i stacje paliw EXOIL.
          </p>
          <Link
            href="/zamow-paliwo/"
            className="mt-6 inline-flex h-11 items-center bg-exoil-red px-5 font-display font-bold text-white hover:bg-red-deep"
          >
            Zamów paliwo
          </Link>
        </div>

        <Group title="Oferta">
          {services.map((s) => (
            <FLink key={s.id} href={s.href}>
              {s.navLabel}
            </FLink>
          ))}
          <FLink href="/zamow-paliwo/">Zapytanie o dostawę</FLink>
        </Group>

        <Group title="Stacje">
          {stations.map((s) => (
            <FLink key={s.id} href={`/stacje/${s.slug}/`}>
              {s.shortName}
            </FLink>
          ))}
        </Group>

        <Group title="Firma">
          <FLink href="/o-firmie/">O firmie</FLink>
          <FLink href="/o-firmie/historia/">Historia</FLink>
          <FLink href="/o-firmie/dokumenty/">Dokumenty</FLink>
          {hasNews() && <FLink href="/aktualnosci/">Aktualności</FLink>}
          <FLink href="/kariera/">Kariera</FLink>
          <FLink href="/kontakt/">Kontakt</FLink>
        </Group>
      </div>

      <div className="border-t border-line-dark">
        <div className="frame flex flex-col gap-4 py-6 text-sm text-night-muted lg:flex-row lg:items-start lg:justify-between">
          <address className="not-italic leading-relaxed">
            <FactValue fact={company.legalName} />, <FactValue fact={a.street} />, <FactValue fact={a.postalCode} />{" "}
            <FactValue fact={a.city} />
            <br />
            KRS <FactValue fact={company.krs} /> · NIP <FactValue fact={company.nip}>{(v) => formatNip(v)}</FactValue> · REGON{" "}
            <FactValue fact={company.regon} /> · Kapitał zakładowy <FactValue fact={company.shareCapital} />
            <FactValue fact={company.registryCourt}>{(v) => <><br />{v}</>}</FactValue>
          </address>
          <div className="flex flex-col gap-3 lg:items-end">
            <ul className="flex gap-5">
              <li>
                <Link href="/polityka-prywatnosci/" className="hover:text-white hover:underline">
                  Polityka prywatności
                </Link>
              </li>
            </ul>
            <p>
              Realizacja:{" "}
              <a href="https://binarybrain.dev/pl" target="_blank" rel="noopener" className="text-tank/90 hover:text-white hover:underline">
                Binary Brain Technologies
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
