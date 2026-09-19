"use client";

import { useActionState } from "react";
import { submitApplication } from "@/app/actions/forms";
import { initialFormState } from "@/lib/forms/state";
import { FormStatus, SpamGuard, SubmitButton, TextArea, TextField } from "./fields";

export function CareerForm({ notice, uploads }: { notice: string; uploads: boolean }) {
  const [state, action, pending] = useActionState(submitApplication, initialFormState);
  const formKey = String(state.at ?? 0);
  if (state.status === "success") return <FormStatus state={state} />;
  return (
    <form key={formKey} action={action} noValidate className="relative" encType={uploads ? "multipart/form-data" : undefined}>
      <FormStatus state={state} />
      <SpamGuard />
      <div className="grid gap-6 md:grid-cols-2">
        <TextField name="name" label="Imię i nazwisko" state={state} required autoComplete="name" maxLength={120} />
        <TextField name="email" label="E-mail" state={state} required type="email" autoComplete="email" maxLength={254} />
        <TextField name="phone" label="Telefon" state={state} type="tel" autoComplete="tel" maxLength={32} />
        <TextField name="role" label="Stanowisko lub obszar pracy" state={state} maxLength={120} />
        <div className="md:col-span-2">
          <TextArea name="message" label="Kilka słów o sobie" state={state} required maxLength={4000} hint="Doświadczenie, uprawnienia (np. prawo jazdy kat. C+E, ADR), dostępność." />
        </div>
        {uploads && (
          <div className="md:col-span-2">
            <TextField
              name="cv"
              label="CV (PDF, do 5 MB)"
              state={state}
              type="file"
              accept="application/pdf,.pdf"
              className="mt-2 block w-full border-2 border-dashed border-carbon/60 bg-paper p-4"
            />
          </div>
        )}
      </div>
      <p className="mt-6 max-w-2xl text-sm text-ink-muted">{notice}</p>
      <div className="mt-8">
        <SubmitButton pending={pending}>Wyślij zgłoszenie</SubmitButton>
      </div>
    </form>
  );
}
