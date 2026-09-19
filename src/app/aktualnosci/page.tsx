import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { getNewsPosts } from "@/lib/news-index";
import { formatPlDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Aktualności",
  description: "Aktualności EXOIL: informacje o firmie, stacjach i dostawach paliw.",
  path: "/aktualnosci/",
});

export default function NewsPage() {
  const posts = getNewsPosts();
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHeader trail={[{ name: "Aktualności", path: "/aktualnosci/" }]} title="Aktualności" />
      <section className="bg-tank py-14 lg:py-20">
        <ul className="frame border-t border-line-light">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-line-light">
              <Link href={`/aktualnosci/${p.slug}/`} className="grid gap-2 py-8 md:grid-cols-[12rem_1fr] md:gap-8">
                <time dateTime={p.date} className="label pt-1 text-ink-muted">
                  {formatPlDate(p.date)}
                </time>
                <span>
                  <span className="block font-display text-2xl font-bold">{p.title}</span>
                  {p.description && <span className="mt-2 block text-ink-muted">{p.description}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
