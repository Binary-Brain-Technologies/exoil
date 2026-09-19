import { notFound } from "next/navigation";
import { OrderCta } from "@/components/page/OrderCta";
import { PageHeader } from "@/components/page/PageHeader";
import { Section } from "@/components/page/Section";
import { TermsList } from "@/components/page/TermsList";
import { getService } from "@/data/services";
import { tankSpecs } from "@/data/terms";
import { JsonLd, serviceLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

/*
 * Built but gated: the customer-tank offer was last described on the old site in 2019.
 * This page exists while src/data/services.ts lists "tanks" as offered; the offer still needs client confirmation.
 */
export function generateMetadata() {
  if (!getService("tanks")) return { title: "Nie znaleziono strony", robots: { index: false, follow: true } };
  return pageMetadata({
    title: "Zbiorniki na paliwo dla firm",
    description: "Dwupłaszczowe zbiorniki na olej napędowy z dystrybutorem do tankowania pojazdów i maszyn na terenie firmy.",
    path: "/zbiorniki/",
  });
}

function TankSection() {
  return (
    <svg viewBox="0 0 640 360" className="h-auto w-full" role="img" aria-labelledby="tank-svg-title">
      <title id="tank-svg-title">Przekrój zbiornika dwupłaszczowego z dystrybutorem</title>
      <rect x="0" y="330" width="640" height="30" fill="#1F1A17" />
      {/* outer wall */}
      <rect x="90" y="60" width="300" height="260" rx="18" fill="none" stroke="#8B9095" strokeWidth="6" />
      {/* inner tank */}
      <rect x="112" y="82" width="256" height="216" rx="10" fill="#2A2624" stroke="#C9CCCF" strokeWidth="3" />
      <rect x="115" y="170" width="250" height="125" fill="#F08A00" opacity="0.85" />
      {/* interstitial space label */}
      <line x1="390" y1="110" x2="440" y2="110" stroke="#C9CCCF" />
      <text x="446" y="114" fill="#F2F2EF" fontSize="14" fontFamily="var(--font-plex-mono)">ŚCIANA ZEWNĘTRZNA</text>
      <line x1="368" y1="150" x2="440" y2="150" stroke="#C9CCCF" />
      <text x="446" y="154" fill="#F2F2EF" fontSize="14" fontFamily="var(--font-plex-mono)">ZBIORNIK WEWNĘTRZNY</text>
      {/* pump & meter cabinet */}
      <rect x="200" y="20" width="80" height="40" fill="#DA251D" />
      <text x="240" y="45" fill="#fff" fontSize="12" textAnchor="middle" fontFamily="var(--font-plex-mono)">POMPA</text>
      <line x1="280" y1="40" x2="440" y2="40" stroke="#C9CCCF" />
      <text x="446" y="44" fill="#F2F2EF" fontSize="14" fontFamily="var(--font-plex-mono)">POMPA I LICZNIK</text>
      {/* hose & nozzle */}
      <path d="M200 40 C 140 40, 40 120, 50 250" fill="none" stroke="#F2F2EF" strokeWidth="5" />
      <rect x="38" y="250" width="24" height="40" fill="#1F1A17" stroke="#F2F2EF" strokeWidth="2" />
      <text x="20" y="315" fill="#F2F2EF" fontSize="14" fontFamily="var(--font-plex-mono)">PISTOLET</text>
    </svg>
  );
}

export default function TanksPage() {
  const service = getService("tanks");
  if (!service) notFound();
  return (
    <>
      <PageHeader
        trail={[{ name: "Zbiorniki", path: "/zbiorniki/" }]}
        title="Zbiorniki na paliwo dla firm"
        lede="Dwupłaszczowy zbiornik z dystrybutorem na terenie firmy: pojazdy i maszyny tankujesz na miejscu, a my dowozimy paliwo autocysterną."
      />
      <section aria-labelledby="budowa-title" className="bg-night py-16 text-tank lg:py-24">
        <div className="frame grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="budowa-title" className="text-[clamp(1.75rem,3vw,2.6rem)] font-extrabold">
              Dwie ściany, jeden dystrybutor
            </h2>
            <p className="mt-5 max-w-lg text-lg text-tank/80">
              Zbiornik wewnętrzny przechowuje paliwo, a ściana zewnętrzna tworzy drugą, niezależną powłokę. Paliwo wydaje
              dystrybutor z pompą, licznikiem i pistoletem — tak jak na stacji, tylko na Twoim placu.
            </p>
          </div>
          <TankSection />
        </div>
      </section>
      <Section id="parametry" eyebrow="Parametry" title="Pojemności i wyposażenie">
        <TermsList terms={tankSpecs} />
      </Section>
      <OrderCta title="Zapytaj o zbiornik i dostawy" label="Wyślij zapytanie" />
      <JsonLd data={serviceLd(service)} />
    </>
  );
}
