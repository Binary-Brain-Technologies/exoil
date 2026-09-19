/** A real sequence (order → delivery …). Numbered because order matters. */
export function Steps({ steps, tone = "light" }: { steps: Array<{ title: string; body: string }>; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-night-muted" : "text-ink-muted";
  const line = tone === "dark" ? "bg-line-dark" : "bg-line-light";
  return (
    <ol className="relative grid gap-10 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="relative pt-8">
          <span aria-hidden className={`absolute left-0 right-0 top-2 h-px ${line}`} />
          <span aria-hidden className="absolute left-0 top-0 block size-4 border-2 border-exoil-red bg-exoil-red" />
          <p className={`label ${muted}`}>
            Krok <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
          </p>
          <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
          <p className={`mt-2 ${muted}`}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
