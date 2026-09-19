import Link from "next/link";
import { breadcrumbLd, JsonLd } from "@/lib/jsonld";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Breadcrumbs drawn as a route: each level is a stop on the line, the current page is where the line ends.
 * Also emits BreadcrumbList JSON-LD.
 */
export function RouteBar({ trail, tone = "light" }: { trail: Crumb[]; tone?: "light" | "dark" }) {
  const all = [{ name: "EXOIL", path: "/" }, ...trail];
  const muted = tone === "dark" ? "text-night-muted" : "text-ink-muted";
  const line = tone === "dark" ? "bg-line-dark" : "bg-line-light";
  return (
    <>
      <nav aria-label="Ścieżka nawigacji" className="label">
        <ol className="flex flex-wrap items-center gap-y-2">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center">
                <span aria-hidden className={`mr-2 inline-block size-2 ${last ? "bg-exoil-red" : `border ${tone === "dark" ? "border-night-muted" : "border-ink-muted"}`}`} />
                {last ? (
                  <span aria-current="page">{c.name}</span>
                ) : (
                  <Link href={c.path} className={`${muted} hover:underline`}>
                    {c.name}
                  </Link>
                )}
                {!last && <span aria-hidden className={`mx-3 inline-block h-px w-8 ${line}`} />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}
