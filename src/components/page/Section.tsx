import type { ReactNode } from "react";

export function Section({
  id,
  title,
  eyebrow,
  children,
  tone = "tank",
  intro,
}: {
  id: string;
  title: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  tone?: "tank" | "paper" | "night";
  intro?: ReactNode;
}) {
  const bg = tone === "night" ? "bg-night text-tank" : tone === "paper" ? "bg-paper" : "bg-tank";
  const muted = tone === "night" ? "text-night-muted" : "text-ink-muted";
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${bg} py-16 lg:py-24`}>
      <div className="frame">
        {eyebrow && (
          <p className={`label flex items-center gap-3 ${muted}`}>
            <span aria-hidden className="h-px w-8 bg-exoil-red" />
            {eyebrow}
          </p>
        )}
        <h2 id={`${id}-title`} className="mt-4 max-w-3xl text-[clamp(1.75rem,3vw,2.6rem)] font-extrabold">
          {title}
        </h2>
        {intro && <div className={`mt-5 max-w-2xl text-lg ${muted}`}>{intro}</div>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
