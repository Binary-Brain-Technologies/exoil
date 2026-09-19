/** Contact topics — kept free of Zod so client components can import it without shipping the validator. */
export const CONTACT_TOPICS = {
  sales: "Zamówienia i oferta",
  logistics: "Dostawy i logistyka",
  accounting: "Faktury i płatności",
  stations: "Stacje paliw",
  other: "Inna sprawa",
} as const;
export type ContactTopic = keyof typeof CONTACT_TOPICS;
