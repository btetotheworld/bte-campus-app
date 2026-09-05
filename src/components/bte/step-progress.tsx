export type StepProgressItem = {
  label: string;
  state: "done" | "current" | "todo";
};

export function StepProgress({ steps }: { steps: StepProgressItem[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step) => (
        <li key={step.label} className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={
              step.state === "done"
                ? "size-3 rounded-sm bg-navy"
                : step.state === "current"
                  ? "size-3 rounded-sm border-2 border-navy bg-bg"
                  : "size-3 rounded-sm border border-border-strong bg-bg"
            }
          />
          <span
            className={
              step.state === "todo"
                ? "text-sm text-ink-muted"
                : "text-sm font-semibold text-ink"
            }
          >
            {step.label}
            <span className="sr-only">
              {step.state === "done"
                ? ", confirmed"
                : step.state === "current"
                  ? ", current"
                  : ", not yet confirmed"}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
