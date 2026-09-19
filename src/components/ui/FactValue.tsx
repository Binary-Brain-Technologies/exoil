import type { ReactNode } from "react";
import { publishable, type Fact } from "@/lib/verification";

/** Renders a Fact's value (or `fallback` when the fact is absent or marked REMOVE/OUTDATED). */
export function FactValue<T>({
  fact,
  children,
  fallback = null,
}: {
  fact: Fact<T> | undefined;
  children?: (value: T) => ReactNode;
  fallback?: ReactNode;
  /** Kept for call-site compatibility; the value renders without a wrapper. */
  as?: "span" | "div";
}) {
  const value = publishable(fact);
  if (value === undefined) return <>{fallback}</>;
  return <>{children ? children(value) : String(value)}</>;
}
