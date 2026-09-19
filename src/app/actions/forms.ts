"use server";

import { orderableFuelCodes, getWholesaleFuels } from "@/data/fuels";
import { CONTACT_TOPICS, careerSchema, contactSchema, flattenErrors, orderSchema } from "@/lib/forms/schemas";
import { allowRequest, isHoneypotFilled, isTooFast, releaseRequest } from "@/lib/forms/guard";
import { formatFields, sendMail } from "@/lib/forms/email";
import type { FormState } from "@/lib/forms/state";
import { cvUploadsEnabled, readCv } from "@/lib/forms/cv";

function values(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string" && k !== "website" && k !== "startedAt") out[k] = v.slice(0, 4000);
  return out;
}

const RATE_LIMITED: FormState = {
  status: "error",
  message: "Wysłano kilka wiadomości w krótkim czasie. Spróbuj ponownie za kilka minut.",
};

const DELIVERY_FAILED =
  "Nie udało się wysłać wiadomości. Wpisane dane zostały w formularzu — spróbuj ponownie za chwilę.";

/** Honeypot bots get a success-looking response so they learn nothing; nothing is sent. */
const SPAM_ACCEPTED: FormState = { status: "success", message: "Dziękujemy. Wiadomość została wysłana." };

const TOO_FAST: FormState = { status: "error", message: "Formularz został wysłany bardzo szybko. Sprawdź dane i wyślij go ponownie." };

async function submitOrderRequestInner(formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = orderSchema(orderableFuelCodes()).safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Popraw zaznaczone pola.", fieldErrors: flattenErrors(parsed.error), values: values(formData) };
  }
  const d = parsed.data;
  if (isHoneypotFilled(d.website)) return SPAM_ACCEPTED;
  if (isTooFast(d.startedAt)) return { ...TOO_FAST, values: values(formData) };
  if (!(await allowRequest("order"))) return { ...RATE_LIMITED, values: values(formData) };

  const fuelName = getWholesaleFuels().find((f) => f.code === d.fuel)?.name ?? d.fuel;
  const result = await sendMail({
    to: process.env.ORDER_TO_EMAIL ?? "",
    replyTo: d.email,
    subject: `Zapytanie o paliwo: ${fuelName}, ${d.quantity} l — ${d.company}`,
    text: formatFields([
      ["Rodzaj zgłoszenia", "Zapytanie o dostawę paliwa (formularz www, niewiążące)"],
      ["Firma", d.company],
      ["NIP", d.nip],
      ["Osoba kontaktowa", d.contactName],
      ["Telefon", d.phone],
      ["E-mail", d.email],
      ["Paliwo", fuelName],
      ["Ilość (l)", d.quantity],
      ["Miejsce dostawy", [d.address, `${d.postalCode} ${d.town}`].filter(Boolean).join(", ")],
      ["Preferowany termin", d.preferredDate],
      ["Wiadomość", d.message],
    ]),
  });
  if (!result.ok) {
    await releaseRequest("order");
    return { status: "error", message: DELIVERY_FAILED, values: values(formData) };
  }
  return {
    status: "success",
    message: "Zapytanie dotarło do działu sprzedaży. Odpowiemy z ceną i terminem dostawy.",
  };
}

const CONTACT_ENV: Record<keyof typeof CONTACT_TOPICS, string> = {
  sales: "CONTACT_TO_EMAIL_SALES",
  logistics: "CONTACT_TO_EMAIL_LOGISTICS",
  accounting: "CONTACT_TO_EMAIL_ACCOUNTING",
  stations: "CONTACT_TO_EMAIL_STATIONS",
  other: "CONTACT_TO_EMAIL",
};

async function submitContactInner(formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Popraw zaznaczone pola.", fieldErrors: flattenErrors(parsed.error), values: values(formData) };
  }
  const d = parsed.data;
  if (isHoneypotFilled(d.website)) return SPAM_ACCEPTED;
  if (isTooFast(d.startedAt)) return { ...TOO_FAST, values: values(formData) };
  if (!(await allowRequest("contact"))) return { ...RATE_LIMITED, values: values(formData) };

  const to = process.env[CONTACT_ENV[d.topic]] || process.env.CONTACT_TO_EMAIL || "";
  const result = await sendMail({
    to,
    replyTo: d.email,
    subject: `Kontakt www: ${CONTACT_TOPICS[d.topic]} — ${d.name}`,
    text: formatFields([
      ["Temat", CONTACT_TOPICS[d.topic]],
      ["Imię i nazwisko", d.name],
      ["E-mail", d.email],
      ["Telefon", d.phone],
      ["Wiadomość", d.message],
    ]),
  });
  if (!result.ok) {
    await releaseRequest("contact");
    return { status: "error", message: DELIVERY_FAILED, values: values(formData) };
  }
  return { status: "success", message: "Wiadomość wysłana. Odpowiemy na podany adres e-mail." };
}

async function submitApplicationInner(formData: FormData): Promise<FormState> {
  const parsed = careerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Popraw zaznaczone pola.", fieldErrors: flattenErrors(parsed.error), values: values(formData) };
  }
  const d = parsed.data;
  if (isHoneypotFilled(d.website)) return SPAM_ACCEPTED;
  if (isTooFast(d.startedAt)) return { ...TOO_FAST, values: values(formData) };
  if (!(await allowRequest("career"))) return { ...RATE_LIMITED, values: values(formData) };

  let attachments: Array<{ filename: string; content: Buffer }> | undefined;
  if (cvUploadsEnabled()) {
    const cv = await readCv(formData.get("cv"));
    if (!cv.ok) return { status: "error", message: "Popraw zaznaczone pola.", fieldErrors: { cv: cv.error }, values: values(formData) };
    if (cv.file) attachments = [cv.file];
  }

  const result = await sendMail({
    attachments,
    to: process.env.CAREERS_TO_EMAIL ?? "",
    replyTo: d.email,
    subject: `Zgłoszenie kandydata${d.role ? `: ${d.role}` : ""} — ${d.name}`,
    text: formatFields([
      ["Imię i nazwisko", d.name],
      ["E-mail", d.email],
      ["Telefon", d.phone],
      ["Stanowisko / obszar", d.role],
      ["Wiadomość", d.message],
    ]),
  });
  if (!result.ok) {
    await releaseRequest("career");
    return { status: "error", message: DELIVERY_FAILED, values: values(formData) };
  }
  return { status: "success", message: "Dziękujemy. Zgłoszenie trafiło do działu kadr." };
}

export async function submitOrderRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  return { ...(await submitOrderRequestInner(formData)), at: Date.now() };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return { ...(await submitContactInner(formData)), at: Date.now() };
}

export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  return { ...(await submitApplicationInner(formData)), at: Date.now() };
}
