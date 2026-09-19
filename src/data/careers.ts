import { fact } from "../lib/verification";

/** Teams listed on the archived careers page (2023). Hidden in production until the client confirms them. */
export const careerTeams = fact(
  ["Biuro i administracja", "Handel i obsługa klientów", "Kierowcy autocystern", "Warsztat i mechanika", "Stacje paliw"],
  "CLIENT_CONFIRMATION_REQUIRED",
  "Archiwalna strona /kariera/ (13.09.2023) — zespoły wymienione na starej stronie",
);
