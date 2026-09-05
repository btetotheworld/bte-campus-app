export type StepperStep = {
  label: string;
  state: "done" | "current" | "todo";
};

export function Stepper({ steps }: { steps: StepperStep[] }) {
  return (
    <ol className="flex flex-col gap-4 md:flex-row md:gap-6">
      {steps.map((step, index) => {
        const number = index + 1;
        return (
          <li key={step.label} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={
                step.state === "current"
                  ? "flex size-8 items-center justify-center rounded bg-navy text-sm font-semibold text-white"
                  : step.state === "done"
                    ? "flex size-8 items-center justify-center rounded bg-surface-2 text-sm font-semibold text-navy"
                    : "flex size-8 items-center justify-center rounded border border-border text-sm font-semibold text-ink-muted"
              }
            >
              {number}
            </span>
            <span
              className={
                step.state === "todo"
                  ? "text-sm text-ink-muted"
                  : "text-sm font-semibold text-ink"
              }
            >
              {step.label}
              {step.state === "current" ? (
                <span className="sr-only">, current step</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
