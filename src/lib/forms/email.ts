/**
 * Sends form submissions through the Resend HTTP API (no SDK needed).
 * Required env: RESEND_API_KEY, FORMS_FROM_EMAIL and the per-form recipient variable.
 * Without configuration the submission is NOT silently dropped: the action reports a delivery error
 * and keeps the visitor's input in the form.
 */
export interface OutgoingMail {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

export type SendResult = { ok: true; id?: string } | { ok: false; reason: "not-configured" | "provider-error" };

function escapeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}

export async function sendMail(mail: OutgoingMail): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;
  if (!apiKey || !from || !mail.to) return { ok: false, reason: "not-configured" };

  try {
    const res = await fetch(`${process.env.RESEND_API_BASE ?? "https://api.resend.com"}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: mail.to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: mail.replyTo,
        subject: escapeHeader(mail.subject),
        text: mail.text,
        attachments: mail.attachments?.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[forms] mail provider rejected message", res.status);
      return { ok: false, reason: "provider-error" };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch {
    console.error("[forms] mail provider unreachable");
    return { ok: false, reason: "provider-error" };
  }
}

/** Plain-text e-mail body: one "Label: value" line per field, empty fields skipped. */
export function formatFields(rows: Array<[string, string | number | undefined]>): string {
  return rows
    .filter(([, v]) => v !== undefined && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${String(v).replace(/\r\n/g, "\n")}`)
    .join("\n");
}
