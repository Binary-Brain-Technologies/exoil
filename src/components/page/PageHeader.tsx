import type { ReactNode } from "react";
import { RouteBar, type Crumb } from "@/components/ui/RouteBar";

export function PageHeader({
  trail,
  title,
  lede,
  tone = "dark",
  children,
}: {
  trail: Crumb[];
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <header className={dark ? "bg-night text-tank" : "bg-tank text-carbon"}>
      <div className="frame pb-16 pt-10 lg:pb-24 lg:pt-14">
        <RouteBar trail={trail} tone={tone} />
        <h1 className="display mt-10 max-w-4xl text-[clamp(2.5rem,5.2vw,4.75rem)]">{title}</h1>
        {lede && <p className={`mt-6 max-w-2xl text-xl leading-relaxed ${dark ? "text-tank/85" : "text-ink-muted"}`}>{lede}</p>}
        {children}
      </div>
    </header>
  );
}
