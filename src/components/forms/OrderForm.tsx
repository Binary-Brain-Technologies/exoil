"use client";

import { useActionState } from "react";
import { submitOrderRequest } from "@/app/actions/forms";
import { todayInPoland } from "@/lib/dates";
import { initialFormState } from "@/lib/forms/state";
import { FormStatus, SelectField, SpamGuard, SubmitButton, TextArea, TextField } from "./fields";

export function OrderForm({
  fuels,
  defaultFuel,
  notice,
  nonBinding,
  phone,
}: {
  fuels: Array<{ value: string; label: string }>;
  defaultFuel?: string;
  notice: string;
  nonBinding: string;
  /** Order phone, only when confirmed for publication. */
  phone?: string;
}) {
  const [state, action, pending] = useActionState(submitOrderRequest, initialFormState);
  const formKey = String(state.at ?? 0);
  const today = todayInPoland();

  if (state.status === "success") {
    return (
      <div>
        <FormStatus state={state} />
        {phone && (
          <p className="text-ink-muted">
            Jeśli sprawa jest pilna, zadzwoń:{" "}
            <a className="tabular font-medium text-carbon underline" href={`tel:+48${phone.replace(/\s/g, "")}`}>
              {phone}
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form key={formKey} action={action} noValidate className="relative">
      <FormStatus state={state} />
      <SpamGuard />
      <fieldset>
        <legend className="label mb-6 text-ink-muted">Firma i osoba kontaktowa</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <TextField name="company" label="Nazwa firmy" state={state} required autoComplete="organization" maxLength={160} />
          <TextField name="nip" label="NIP" state={state} inputMode="numeric" autoComplete="off" maxLength={20} hint="Przyspiesza przygotowanie oferty." />
          <TextField name="contactName" label="Imię i nazwisko" state={state} required autoComplete="name" maxLength={120} />
          <TextField name="phone" label="Telefon" state={state} required type="tel" autoComplete="tel" maxLength={32} />
          <div className="md:col-span-2">
            <TextField name="email" label="E-mail" state={state} required type="email" autoComplete="email" maxLength={254} />
          </div>
        </div>
      </fieldset>
      <fieldset className="mt-12">
        <legend className="label mb-6 text-ink-muted">Paliwo i dostawa</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <SelectField name="fuel" label="Rodzaj paliwa" state={state} required options={fuels} defaultValue={defaultFuel} />
          <TextField name="quantity" label="Ilość (litry)" state={state} required inputMode="numeric" pattern="[0-9]*" maxLength={7} />
          <TextField name="postalCode" label="Kod pocztowy dostawy" state={state} required autoComplete="postal-code" placeholder="00-000" maxLength={6} />
          <TextField name="town" label="Miejscowość dostawy" state={state} required autoComplete="address-level2" maxLength={80} />
          <div className="md:col-span-2">
            <TextField name="address" label="Adres lub opis miejsca dostawy" state={state} autoComplete="street-address" maxLength={200} hint="Np. ulica i numer, wjazd od strony magazynu." />
          </div>
          <TextField name="preferredDate" label="Preferowany termin" state={state} type="date" min={today} />
        </div>
        <div className="mt-6">
          <TextArea name="message" label="Wiadomość" state={state} maxLength={2000} hint="Np. godziny, w których można dostarczyć paliwo, pojemność zbiornika." />
        </div>
      </fieldset>
      <p className="mt-10 max-w-2xl border-l-4 border-adr bg-paper p-4 text-sm">{nonBinding}</p>
      <p className="mt-4 max-w-2xl text-sm text-ink-muted">{notice}</p>
      <div className="mt-8">
        <SubmitButton pending={pending}>Wyślij zapytanie</SubmitButton>
      </div>
    </form>
  );
}
