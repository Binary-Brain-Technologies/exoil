import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { SITE_URL } from "@/data/company";
import { JsonLd } from "@/lib/jsonld";
import { Markdown } from "@/lib/markdown";
import { getNewsPosts } from "@/lib/news-index";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { formatPlDate } from "@/lib/dates";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getNewsPosts();
  // Next requires at least one param for a static dynamic route; with no posts the route renders 404.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "brak" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPosts().find((p) => p.slug === slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.description, path: `/aktualnosci/${post.slug}/` });
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getNewsPosts().find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <article>
      <PageHeader
        trail={[
          { name: "Aktualności", path: "/aktualnosci/" },
          { name: post.title, path: `/aktualnosci/${post.slug}/` },
        ]}
        title={post.title}
        tone="light"
      >
        <p className="label mt-6 text-ink-muted">
          <time dateTime={post.date}>{formatPlDate(post.date)}</time>
        </p>
      </PageHeader>
      <div className="bg-tank pb-24">
        <div className="frame prose-exoil text-lg">
          <Markdown source={post.body} />
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.title,
          datePublished: post.date,
          description: post.description,
          mainEntityOfPage: absoluteUrl(`/aktualnosci/${post.slug}/`),
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />
    </article>
  );
}
