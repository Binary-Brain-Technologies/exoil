import type { ReactNode } from "react";

/**
 * Minimal, safe Markdown renderer for client-supplied news and legal texts:
 * headings (##, ###), paragraphs, unordered/ordered lists, **bold**, *italic*, [links](url).
 * No raw HTML is ever injected — everything is rendered as React nodes.
 */
/** Allows site-relative paths, http(s), mailto and tel. Protocol-relative ("//host") and other schemes are dropped. */
function safeLink(href: string): { href: string; external: boolean } {
  if (href.startsWith("#") || /^(mailto:|tel:)/i.test(href)) return { href, external: false };
  if (href.startsWith("/") && !href.startsWith("//")) return { href, external: false };
  try {
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") return { href: "#", external: false };
    return { href: url.toString(), external: url.hostname !== "exoil.pl" && url.hostname !== "www.exoil.pl" };
  } catch {
    return { href: "#", external: false };
  }
}

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[2]) out.push(<strong key={k}>{m[2]}</strong>);
    else if (m[3]) out.push(<em key={k}>{m[3]}</em>);
    else if (m[4] && m[5]) {
      const { href: safe, external } = safeLink(m[5]);
      out.push(
        <a key={k} href={safe} {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}>
          {m[4]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const first = lines[0] ?? "";
        const key = `b${bi}`;
        if (first.startsWith("### ")) return <h3 key={key}>{inline(first.slice(4), key)}</h3>;
        if (first.startsWith("## ")) return <h2 key={key}>{inline(first.slice(3), key)}</h2>;
        if (lines.every((l) => /^[-*] /.test(l)))
          return (
            <ul key={key}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.slice(2), `${key}-${li}`)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\. /.test(l)))
          return (
            <ol key={key}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\d+\. /, ""), `${key}-${li}`)}</li>
              ))}
            </ol>
          );
        return <p key={key}>{inline(lines.join(" "), key)}</p>;
      })}
    </>
  );
}
