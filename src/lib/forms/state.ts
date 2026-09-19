export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Echo of submitted values (strings only) so the form keeps input after a validation error. */
  values?: Record<string, string>;
  /** Server timestamp of the response; forms re-mount on each new response so kept values become defaults. */
  at?: number;
}

export const initialFormState: FormState = { status: "idle" };
