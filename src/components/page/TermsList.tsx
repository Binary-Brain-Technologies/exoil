import { FactValue } from "@/components/ui/FactValue";
import type { Term } from "@/data/terms";
import { isVisible } from "@/lib/verification";

/** Definition list of commercial/technical terms. Renders only terms visible in the current content mode. */
export function TermsList({ terms, tone = "light" }: { terms: Term[]; tone?: "light" | "dark" }) {
  const visible = terms.filter((t) => isVisible(t.value));
  if (visible.length === 0) return null;
  const line = tone === "dark" ? "border-line-dark" : "border-line-light";
  const muted = tone === "dark" ? "text-night-muted" : "text-ink-muted";
  return (
    <dl className={`border-t ${line}`}>
      {visible.map((t) => (
        <div key={t.id} className={`grid gap-2 border-b ${line} py-5 md:grid-cols-[14rem_1fr] md:gap-8`}>
          <dt className={`label pt-1 ${muted}`}>{t.label}</dt>
          <dd className="text-lg">
            <FactValue fact={t.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
