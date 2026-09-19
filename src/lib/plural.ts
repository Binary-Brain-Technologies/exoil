/** Polish plural forms: 1 stacja, 2–4 stacje, 5+ stacji (with 12–14 → stacji, 22–24 → stacje). */
export function plPlural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10;
  const t = n % 100;
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
}

export function stationCountLabel(n: number): string {
  return `${n} ${plPlural(n, "stacja", "stacje", "stacji")}`;
}
