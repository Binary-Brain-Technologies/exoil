/**
 * Every business fact on the site is a `Fact`: a value plus the evidence behind it (status + source).
 * The status records what the client still has to confirm before launch (docs/pre-launch-plan.md,
 * `npm run launch-check`); it does not hide content, except material marked REMOVE or OUTDATED.
 */

export type VerificationStatus =
  | "VERIFIED_CURRENT"
  | "CLIENT_CONFIRMATION_REQUIRED"
  | "HISTORICAL_ONLY"
  | "CONFLICTING"
  | "OUTDATED"
  | "REMOVE"
  | "SAFE_GENERAL_COPY";

export interface Fact<T> {
  readonly value: T;
  readonly status: VerificationStatus;
  /** Where the value comes from, e.g. "KRS 0001016528, stan na 10.07.2026". */
  readonly source: string;
}

export function fact<T>(value: T, status: VerificationStatus, source: string): Fact<T> {
  return { value, status, source };
}

/** Confirmed facts: what search-engine structured data and the launch checklist rely on. */
const CONFIRMED_STATUSES: ReadonlySet<VerificationStatus> = new Set(["VERIFIED_CURRENT", "SAFE_GENERAL_COPY"]);

/**
 * Everything the site was designed to show. Only material removed for cause (REMOVE) or known to be superseded
 * (OUTDATED) is never displayed. Facts still awaiting client confirmation ARE displayed; what is left to confirm is
 * tracked by `npm run launch-check` and docs/pre-launch-plan.md, not by hiding content.
 */
const DISPLAYED_STATUSES: ReadonlySet<VerificationStatus> = new Set([
  "VERIFIED_CURRENT",
  "SAFE_GENERAL_COPY",
  "CLIENT_CONFIRMATION_REQUIRED",
  "HISTORICAL_ONLY",
  "CONFLICTING",
]);

/** True when the fact is confirmed (verified in a registry or by the client). */
export function isPublic(f: Fact<unknown> | undefined): boolean {
  return !!f && CONFIRMED_STATUSES.has(f.status);
}

/** True when the fact is part of the displayed site. */
export function isVisible(f: Fact<unknown> | undefined): boolean {
  return !!f && DISPLAYED_STATUSES.has(f.status);
}

/** The value if it is displayed on the site, otherwise undefined. */
export function publishable<T>(f: Fact<T> | undefined): T | undefined {
  return f && isVisible(f) ? f.value : undefined;
}
