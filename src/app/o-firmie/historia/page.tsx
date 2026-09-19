import Image from "next/image";
import { PageHeader } from "@/components/page/PageHeader";
import { Section } from "@/components/page/Section";
import { FactValue } from "@/components/ui/FactValue";
import { getHistory, type HistoryEntry } from "@/data/history";
import { pageMetadata } from "@/lib/seo";
import { getPhoto } from "@/data/media";

export const metadata = pageMetadata({
  title: "Historia EXOIL",
  description:
    "Historia EXOIL i kalendarium spółki Exoil Paliwa: spółka komandytowa i koncesja URE (2013), przekształcenie w sp. z o.o. (2023).",
  path: "/o-firmie/historia/",
});

function Timeline({ entries }: { entries: HistoryEntry[] }) {
  return (
    <ol className="relative border-l-2 border-carbon pl-8">
      {entries.map((e) => (
        <li key={`${e.year}-${e.title}`} className="relative pb-12 last:pb-0">
          <span aria-hidden className="absolute -left-[2.45rem] top-2 block size-4 border-2 border-exoil-red bg-tank" />
          <FactValue fact={e.record} as="div">
            {() => (
              <>
                <p className="display text-4xl text-exoil-red tabular">{e.year}</p>
                <h3 className="mt-2 text-2xl font-bold">{e.title}</h3>
                <p className="mt-2 max-w-xl text-lg text-ink-muted">{e.body}</p>
              </>
            )}
          </FactValue>
        </li>
      ))}
    </ol>
  );
}

export default function HistoryPage() {
  const business = getHistory("business");
  const legal = getHistory("legal");
  const oldTanker = getPhoto("historyIveco");
  return (
    <>
      <PageHeader
        trail={[
          { name: "O firmie", path: "/o-firmie/" },
          { name: "Historia", path: "/o-firmie/historia/" },
        ]}
        title="Historia EXOIL"
        lede={
          business.length > 0
            ? "Dwie osie czasu: historia działalności EXOIL i historia spółki, która dziś ją prowadzi."
            : "Kalendarium spółki Exoil Paliwa według rejestrów publicznych."
        }
      />
      {business.length > 0 && (
        <Section id="dzialalnosc" eyebrow="Działalność" title="Historia działalności">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            <Timeline entries={business} />
            {oldTanker && (
              <figure>
                <Image src={oldTanker.src} alt={oldTanker.alt} className="h-auto w-full grayscale" placeholder="blur" sizes="(min-width: 1024px) 30vw, 100vw" />
                <figcaption className="label mt-2 text-[0.7rem] text-ink-muted">{oldTanker.caption}</figcaption>
              </figure>
            )}
          </div>
        </Section>
      )}
      <Section
        id="spolka"
        eyebrow="Rejestry publiczne"
        title="Kalendarium spółki"
        tone="paper"
        intro="Daty z Krajowego Rejestru Sądowego i rejestru koncesji Urzędu Regulacji Energetyki."
      >
        <Timeline entries={legal} />
      </Section>
    </>
  );
}
