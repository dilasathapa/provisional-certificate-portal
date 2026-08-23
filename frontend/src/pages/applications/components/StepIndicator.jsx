function StepIndicator({ currentStep }) {
  const steps = [
    {
      number: 1,
      label: "Personal Details",
    },
    {
      number: 2,
      label: "Documents",
    },
    {
      number: 3,
      label: "Review & Submit",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed = currentStep > step.number;
          const active = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition",
                    completed
                      ? "bg-emerald-600 text-white"
                      : active
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {completed ? "✓" : step.number}
                </div>

                <span
                  className={[
                    "mt-2 hidden text-xs font-medium sm:block",
                    active || completed
                      ? "text-emerald-700"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "mx-3 h-px flex-1",
                    completed
                      ? "bg-emerald-600"
                      : "bg-slate-200",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;