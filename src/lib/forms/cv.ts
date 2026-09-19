/**
 * Optional CV upload (docs/legal-launch-requirements.md §3). Off unless RECRUITMENT_UPLOADS_ENABLED=true.
 * The file is validated in memory and attached to the HR e-mail — it is never written to disk or public storage.
 */
export const CV_MAX_BYTES = 5 * 1024 * 1024;

export function cvUploadsEnabled(): boolean {
  return process.env.RECRUITMENT_UPLOADS_ENABLED === "true";
}

export type CvResult =
  | { ok: true; file?: { filename: string; content: Buffer } }
  | { ok: false; error: string };

export async function readCv(entry: FormDataEntryValue | null): Promise<CvResult> {
  if (!entry || typeof entry === "string" || entry.size === 0) return { ok: true };
  if (entry.size > CV_MAX_BYTES) return { ok: false, error: "Plik może mieć najwyżej 5 MB." };
  const content = Buffer.from(await entry.arrayBuffer());
  // Check the real file signature, not the extension or the browser-reported type.
  if (content.subarray(0, 5).toString("latin1") !== "%PDF-") return { ok: false, error: "Załącz CV w formacie PDF." };
  const base = (entry.name || "cv").replace(/\.pdf$/i, "").replace(/[^\p{L}\p{N}_-]+/gu, "-").slice(0, 60) || "cv";
  return { ok: true, file: { filename: `${base}.pdf`, content } };
}
