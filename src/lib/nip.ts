/** Polish NIP (tax id) checksum validation. Accepts digits with optional separators or a "PL" prefix. */
const WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7] as const;

export function normalizeNip(input: string): string {
  return input.replace(/^PL/i, "").replace(/[\s-]/g, "");
}

export function isValidNip(input: string): boolean {
  const nip = normalizeNip(input);
  if (!/^\d{10}$/.test(nip)) return false;
  const digits = nip.split("").map(Number);
  const sum = WEIGHTS.reduce((acc, w, i) => acc + w * (digits[i] ?? 0), 0);
  const control = sum % 11;
  return control !== 10 && control === digits[9];
}
