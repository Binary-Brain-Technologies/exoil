import { PageHeader } from "@/components/page/PageHeader";
import { Section } from "@/components/page/Section";
import { getDocuments } from "@/data/documents";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Dokumenty firmy — koncesja i dane rejestrowe",
  description:
    "Dokumenty Exoil Paliwa Sp. z o.o.: koncesja Prezesa URE na obrót paliwami ciekłymi (OPC), dane z Krajowego Rejestru Sądowego.",
  path: "/o-firmie/dokumenty/",
});

function formatDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export default function DocumentsPage() {
  const docs = getDocuments();
  return (
    <>
      <PageHeader
        trail={[
          { name: "O firmie", path: "/o-firmie/" },
          { name: "Dokumenty", path: "/o-firmie/dokumenty/" },
        ]}
        title="Dokumenty firmy"
        lede="Aktualne dokumenty i dane rejestrowe. Przy każdym dokumencie podajemy datę i okres ważności."
      />
      <Section id="lista" eyebrow="Dokumenty" title="Koncesja i rejestry">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Dokumenty firmy z datą wydania, ważnością i odnośnikiem</caption>
            <thead>
              <tr className="label border-b-2 border-carbon text-ink-muted">
                <th scope="col" className="py-3 pr-4 font-medium">Rodzaj</th>
                <th scope="col" className="py-3 pr-4 font-medium">Dokument</th>
                <th scope="col" className="py-3 pr-4 font-medium">Data</th>
                <th scope="col" className="py-3 pr-4 font-medium">Ważność</th>
                <th scope="col" className="py-3 font-medium"><span className="sr-only">Odnośnik</span></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b border-line-light align-top">
                  <td className="label py-5 pr-4 text-ink-muted">{d.type}</td>
                  <td className="py-5 pr-4">
                    <span className="block font-bold">{d.title}</span>
                    <span className="block text-sm text-ink-muted">{d.issuer}</span>
                    {d.number && <span className="tabular mt-1 block break-all font-mono text-sm">{d.number}</span>}
                  </td>
                  <td className="tabular py-5 pr-4">{formatDate(d.issuedOn)}</td>
                  <td className="py-5 pr-4">{d.validity}</td>
                  <td className="py-5">
                    {d.href && (
                      <a
                        href={d.href}
                        {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
                        className="whitespace-nowrap font-medium underline decoration-exoil-red decoration-2 underline-offset-4"
                      >
                        {d.hrefLabel ?? "Pobierz"}
                        {d.fileSize && <span className="text-ink-muted"> ({d.fileSize})</span>}
                        {d.href.startsWith("http") && <span className="sr-only"> (nowa karta)</span>}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
