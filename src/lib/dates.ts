export function formatPlDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Warsaw" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}

/** Today's date (YYYY-MM-DD) in Polish time, so validation matches what the customer sees. */
export function todayInPoland(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(now);
}
