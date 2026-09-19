import { OrderForm } from "@/components/forms/OrderForm";
import { PageHeader } from "@/components/page/PageHeader";
import { FactValue } from "@/components/ui/FactValue";
import { company } from "@/data/company";
import { getWholesaleFuels } from "@/data/fuels";
import { legal } from "@/data/legal";
import { orderNotice } from "@/lib/forms/notices";
import { pageMetadata } from "@/lib/seo";
import { publishable } from "@/lib/verification";

export const metadata = pageMetadata({
  title: "Zamów paliwo — zapytanie o dostawę",
  description:
    "Wyślij zapytanie o dostawę paliwa: olej napędowy, benzyna, olej opałowy. Podaj ilość i miejsce dostawy — dział sprzedaży EXOIL odezwie się z ceną i terminem.",
  path: "/zamow-paliwo/",
});

type Props = { searchParams: Promise<{ paliwo?: string | string[] }> };

export default async function OrderPage({ searchParams }: Props) {
  const { paliwo } = await searchParams;
  const fuels = getWholesaleFuels().map((f) => ({ value: f.code, label: f.name }));
  const requested = typeof paliwo === "string" ? paliwo.toUpperCase() : undefined;
  const defaultFuel = fuels.some((f) => f.value === requested) ? requested : undefined;

  return (
    <>
      <PageHeader
        trail={[{ name: "Zamów paliwo", path: "/zamow-paliwo/" }]}
        title="Zapytanie o dostawę paliwa"
        lede="Wypełnienie zajmuje około dwóch minut. Dział sprzedaży odpowie z ceną i terminem dostawy."
      >
        <FactValue fact={company.orderPhone}>
          {(v) => (
            <p className="mt-6 text-lg text-tank/85">
              Wolisz zadzwonić?{" "}
              <a href={`tel:+48${v.replace(/\s/g, "")}`} className="tabular font-bold text-tank underline decoration-exoil-red underline-offset-4">
                {v}
              </a>
            </p>
          )}
        </FactValue>
      </PageHeader>
      <section aria-label="Formularz zapytania" className="bg-tank py-14 lg:py-20">
        <div className="frame max-w-5xl">
          <OrderForm fuels={fuels} defaultFuel={defaultFuel} notice={orderNotice()} nonBinding={legal.orderNonBinding.value} phone={publishable(company.orderPhone)} />
        </div>
      </section>
    </>
  );
}
