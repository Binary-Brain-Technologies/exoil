"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/forms";
import { CONTACT_TOPICS } from "@/lib/forms/topics";
import { initialFormState } from "@/lib/forms/state";
import { FormStatus, SelectField, SpamGuard, SubmitButton, TextArea, TextField } from "./fields";

export function ContactForm({ notice, defaultTopic }: { notice: string; defaultTopic?: string }) {
  const [state, action, pending] = useActionState(submitContact, initialFormState);
  const formKey = String(state.at ?? 0);
  if (state.status === "success") return <FormStatus state={state} />;
  return (
    <form key={formKey} action={action} noValidate className="relative">
      <FormStatus state={state} />
      <SpamGuard />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <SelectField
            name="topic"
            label="Temat"
            state={state}
            required
            defaultValue={defaultTopic}
            options={Object.entries(CONTACT_TOPICS).map(([value, label]) => ({ value, label }))}
            hint="Wiadomość trafi bezpośrednio do właściwego działu."
          />
        </div>
        <TextField name="name" label="Imię i nazwisko" state={state} required autoComplete="name" maxLength={120} />
        <TextField name="email" label="E-mail" state={state} required type="email" autoComplete="email" maxLength={254} />
        <TextField name="phone" label="Telefon" state={state} type="tel" autoComplete="tel" maxLength={32} />
        <div className="md:col-span-2">
          <TextArea name="message" label="Wiadomość" state={state} required maxLength={4000} />
        </div>
      </div>
      <p className="mt-6 max-w-2xl text-sm text-ink-muted">{notice}</p>
      <div className="mt-8">
        <SubmitButton pending={pending}>Wyślij wiadomość</SubmitButton>
      </div>
    </form>
  );
}
