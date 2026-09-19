import { CareerForm } from "@/components/forms/CareerForm";
import { PageHeader } from "@/components/page/PageHeader";
import { Section } from "@/components/page/Section";
import { FactValue } from "@/components/ui/FactValue";
import { cvUploadsEnabled } from "@/lib/forms/cv";
import { recruitmentNotice } from "@/lib/forms/notices";
import { careerTeams } from "@/data/careers";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kariera — praca w EXOIL",
  description: "Praca w EXOIL w Chełmie i na stacjach paliw w województwie lubelskim. Wyślij zgłoszenie do działu kadr.",
  path: "/kariera/",
});

export default function CareersPage() {
  return (
    <>
      <PageHeader
        trail={[{ name: "Kariera", path: "/kariera/" }]}
        title="Praca w EXOIL"
        lede="Nie publikujemy teraz konkretnych ogłoszeń. Jeśli chcesz z nami pracować, wyślij zgłoszenie — dział kadr odezwie się, gdy pojawi się pasujące stanowisko."
      />
      <FactValue fact={careerTeams} as="div">
        {(list) => (
          <Section id="zespoly" eyebrow="Zespoły" title="Gdzie pracujemy">
            <ul className="flex flex-wrap gap-3">
              {list.map((r) => (
                <li key={r} className="border-2 border-carbon px-4 py-2 font-medium">
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </FactValue>
      <Section id="zgloszenie" eyebrow="Zgłoszenie" title="Wyślij zgłoszenie" tone="paper">
        <div className="max-w-4xl">
          <CareerForm notice={recruitmentNotice()} uploads={cvUploadsEnabled()} />
        </div>
      </Section>
    </>
  );
}
