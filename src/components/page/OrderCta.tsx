import Link from "next/link";
import { FactValue } from "@/components/ui/FactValue";
import { company } from "@/data/company";

export function OrderCta({ title = "Potrzebujesz paliwa?", fuel, label = "Wyślij zapytanie o paliwo" }: { title?: string; fuel?: string; label?: string }) {
  const href = fuel ? `/zamow-paliwo/?paliwo=${encodeURIComponent(fuel)}` : "/zamow-paliwo/";
  return (
    <section aria-labelledby="order-cta-title" className="bg-exoil-red text-white">
      <div className="frame flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div>
          <h2 id="order-cta-title" className="display text-[clamp(2rem,4vw,3.5rem)]">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white">
            Podaj rodzaj paliwa, ilość i miejsce dostawy. Dział sprzedaży odezwie się z ceną i terminem.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <Link href={href} className="inline-flex h-14 items-center justify-center bg-paper px-8 font-display text-lg font-bold text-carbon hover:bg-tank">
            {label}
          </Link>
          <FactValue fact={company.orderPhone}>
            {(v) => (
              <a href={`tel:+48${v.replace(/\s/g, "")}`} className="tabular font-display text-xl font-bold hover:underline">
                tel. {v}
              </a>
            )}
          </FactValue>
        </div>
      </div>
    </section>
  );
}
