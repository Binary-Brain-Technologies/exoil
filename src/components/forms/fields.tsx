"use client";

import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import type { FormState } from "@/lib/forms/state";

const inputClass =
  "mt-2 block w-full border-2 border-carbon/80 bg-paper px-4 py-3 text-lg text-carbon outline-none transition-colors placeholder:text-ink-muted focus-visible:border-exoil-red aria-[invalid=true]:border-red-deep";

function FieldShell({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
        {required ? <span aria-hidden className="text-red-deep"> *</span> : <span className="text-ink-muted"> (opcjonalnie)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-deep">
          {error}
        </p>
      )}
    </div>
  );
}

type Common = { name: string; label: string; state: FormState; hint?: string; required?: boolean };

export function TextField({ name, label, state, hint, required, defaultValue, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const error = state.fieldErrors?.[name];
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        defaultValue={state.values?.[name] ?? defaultValue}
        className={inputClass}
        {...rest}
      />
    </FieldShell>
  );
}

export function TextArea({ name, label, state, hint, required, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const error = state.fieldErrors?.[name];
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        defaultValue={state.values?.[name]}
        className={inputClass}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  state,
  hint,
  required,
  options,
  defaultValue,
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }> }) {
  const id = useId();
  const error = state.fieldErrors?.[name];
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        defaultValue={state.values?.[name] ?? defaultValue ?? ""}
        className={`${inputClass} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M2 5l6 6 6-6' fill='none' stroke='%231F1A17' stroke-width='2'/%3E%3C/svg%3E\")" }}
        {...rest}
      >
        <option value="" disabled>
          Wybierz…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Honeypot + render timestamp. Bots fill the hidden field; humans never see it. */
export function SpamGuard() {
  const startedAt = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Strona internetowa
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />
    </>
  );
}

/** Announces the result and moves focus to it, so screen-reader and keyboard users know what happened. */
export function FormStatus({ state }: { state: FormState }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status !== "idle") ref.current?.focus();
  }, [state]);
  if (state.status === "idle") return null;
  const ok = state.status === "success";
  const errors = Object.values(state.fieldErrors ?? {});
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={ok ? "status" : "alert"}
      className={`mb-8 border-l-4 p-5 outline-none ${ok ? "border-carbon bg-paper" : "border-red-deep bg-paper"}`}
    >
      <p className="font-display text-xl font-bold">{state.message}</p>
      {errors.length > 1 && (
        <ul className="mt-2 list-disc pl-5 text-sm text-ink-muted">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex h-14 items-center justify-center bg-exoil-red px-8 font-display text-lg font-bold text-white transition-colors hover:bg-red-deep disabled:cursor-progress disabled:opacity-70"
    >
      {pending ? "Wysyłanie…" : children}
    </button>
  );
}
