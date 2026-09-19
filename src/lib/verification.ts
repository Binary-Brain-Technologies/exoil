/**
 * Every business fact on the site is a `Fact`: a value plus the evidence behind it.
 * Components never render a Fact's value directly — they go through `publishable()`,
 * which hides anything not verified unless the site runs in review mode.
 * See docs/content-verification.md.
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

/** Statuses that may be rendered on the public production site. */
const PUBLIC_STATUSES: ReadonlySet<VerificationStatus> = new Set(["VERIFIED_CURRENT", "SAFE_GENERAL_COPY"]);

/** Statuses that may be shown (marked) to the client in review mode. Never REMOVE/OUTDATED. */
const REVIEW_STATUSES: ReadonlySet<VerificationStatus> = new Set([
  "VERIFIED_CURRENT",
  "SAFE_GENERAL_COPY",
  "CLIENT_CONFIRMATION_REQUIRED",
  "HISTORICAL_ONLY",
  "CONFLICTING",
]);

export type ContentMode = "production" | "review";

/**
 * `CONTENT_MODE=review` shows unverified facts with a visible marker and makes the whole site noindex.
 * Anything else (including unset) is production: verified facts only.
 */
export function contentMode(): ContentMode {
  return process.env.CONTENT_MODE === "review" ? "review" : "production";
}

export function isReviewMode(): boolean {
  return contentMode() === "review";
}

export function isPublic(f: Fact<unknown> | undefined): boolean {
  return !!f && PUBLIC_STATUSES.has(f.status);
}

/** True when the fact may appear in the current mode. */
export function isVisible(f: Fact<unknown> | undefined, mode: ContentMode = contentMode()): boolean {
  if (!f) return false;
  return mode === "review" ? REVIEW_STATUSES.has(f.status) : PUBLIC_STATUSES.has(f.status);
}

/** The value if it may be shown in the current mode, otherwise undefined. */
export function publishable<T>(f: Fact<T> | undefined, mode: ContentMode = contentMode()): T | undefined {
  return f && isVisible(f, mode) ? f.value : undefined;
}

/** True when a fact is visible only because of review mode (render it with a marker). */
export function needsMarker(f: Fact<unknown> | undefined, mode: ContentMode = contentMode()): boolean {
  return mode === "review" && !!f && isVisible(f, mode) && !isPublic(f);
}
