import { z } from "zod";
import { todayInPoland } from "@/lib/dates";
import { isValidNip, normalizeNip } from "@/lib/nip";
import { CONTACT_TOPICS, type ContactTopic } from "./topics";

const trimmed = (max: number) => z.string().trim().max(max, `Maksymalnie ${max} znaków.`);
const required = (max: number, message: string) => trimmed(max).min(1, message);

const phone = trimmed(32)
  .min(1, "Podaj numer telefonu.")
  .regex(/^[+()\d\s-]{7,}$/, "Numer telefonu może zawierać cyfry, spacje, „+”, „-” i nawiasy.");

const email = trimmed(254).min(1, "Podaj adres e-mail.").pipe(z.email("Podaj poprawny adres e-mail."));

const optionalPhone = trimmed(32).refine((v) => v === "" || /^[+()\d\s-]{7,}$/.test(v), {
  message: "Numer telefonu może zawierać cyfry, spacje, „+”, „-” i nawiasy.",
});

/** Anti-spam fields present on every form (validated separately in guard.ts). */
export const spamFields = {
  website: z.string().optional(), // honeypot, must stay empty
  startedAt: z.string().optional(), // ms timestamp when the form rendered
};

export function orderSchema(fuelCodes: readonly string[]) {
  return z.object({
    company: required(160, "Podaj nazwę firmy."),
    nip: trimmed(20)
      .refine((v) => v === "" || /^\d{10}$/.test(normalizeNip(v)), { message: "NIP ma 10 cyfr." })
      .refine((v) => v === "" || !/^\d{10}$/.test(normalizeNip(v)) || isValidNip(v), { message: "Ten NIP ma niepoprawną sumę kontrolną." })
      .transform((v) => (v ? normalizeNip(v) : "")),
    contactName: required(120, "Podaj imię i nazwisko osoby kontaktowej."),
    phone,
    email,
    fuel: z.string().refine((v) => fuelCodes.includes(v), { message: "Wybierz rodzaj paliwa." }),
    quantity: z.coerce
      .number({ message: "Podaj ilość w litrach." })
      .int("Podaj pełną liczbę litrów.")
      .min(1, "Podaj ilość w litrach.")
      .max(1_000_000, "Przy tej ilości skontaktuj się bezpośrednio z działem sprzedaży."),
    postalCode: trimmed(6).regex(/^\d{2}-\d{3}$/, "Kod pocztowy w formacie 00-000."),
    town: required(80, "Podaj miejscowość dostawy."),
    address: trimmed(200),
    preferredDate: trimmed(10)
      .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: "Wybierz datę z kalendarza." })
      .refine((v) => v === "" || v >= todayInPoland(), { message: "Termin nie może być w przeszłości." }),
    message: trimmed(2000),
    ...spamFields,
  });
}

export { CONTACT_TOPICS };

export const contactSchema = z.object({
  topic: z.enum(Object.keys(CONTACT_TOPICS) as [ContactTopic, ...ContactTopic[]], { message: "Wybierz temat." }),
  name: required(120, "Podaj imię i nazwisko."),
  email,
  phone: optionalPhone,
  message: required(4000, "Napisz, w czym możemy pomóc."),
  ...spamFields,
});

export const careerSchema = z.object({
  name: required(120, "Podaj imię i nazwisko."),
  email,
  phone: optionalPhone,
  role: trimmed(120),
  message: required(4000, "Napisz kilka słów o sobie i o pracy, której szukasz."),
  ...spamFields,
});

export type FieldErrors = Record<string, string>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
