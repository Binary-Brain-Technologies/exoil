import type { ReactNode } from "react";
import { needsMarker, publishable, type Fact } from "@/lib/verification";

/**
 * Renders a Fact through the verification gate. In production, unverified facts render nothing
 * (or `fallback`). In review mode they render with a hatched "Do weryfikacji" marker and the source in a tooltip.
 */
export function FactValue<T>({
  fact,
  children,
  fallback = null,
  as: Tag = "span",
}: {
  fact: Fact<T> | undefined;
  children?: (value: T) => ReactNode;
  fallback?: ReactNode;
  as?: "span" | "div";
}) {
  const value = publishable(fact);
  if (value === undefined || fact === undefined) return <>{fallback}</>;
  const content = children ? children(value) : String(value);
  if (!needsMarker(fact)) return <>{content}</>;
  return (
    <Tag className="unverified" title={`Do weryfikacji (${fact.status}): ${fact.source}`} data-status={fact.status}>
      {content}
      <span className="sr-only"> (dane do weryfikacji)</span>
    </Tag>
  );
}
