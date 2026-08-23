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
    <div className="mb-8 mx-25 w-full">
      {/* Desktop */}
      <div className="hidden w-full sm:block">
        {/* Circles + connectors */}
        <div className="flex w-full items-start">
          {steps.map((step, index) => {
            const completed = currentStep > step.number;
            const active = currentStep === step.number;

            return (
              <div
                key={step.number}
                className="flex min-w-0 flex-1 items-start"
              >
                {/* Circle + label */}
                <div className="flex w-10 shrink-0 flex-col items-center">
                  <div
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-200",
                      completed
                        ? "bg-[#2A9D8F] text-white"
                        : active
                        ? "bg-[#173F5F] text-white ring-4 ring-[#E6F4F1]"
                        : "border border-[#D0D5DD] bg-[#F9FAFB] text-[#667085]",
                    ].join(" ")}
                  >
                    {completed ? "✓" : step.number}
                  </div>

                  <span
                    className={[
                      "mt-3 w-32 text-center text-xs font-semibold leading-4",
                      active
                        ? "text-[#173F5F]"
                        : completed
                        ? "text-[#206B62]"
                        : "text-[#667085]",
                    ].join(" ")}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex flex-1 items-center pt-5">
                    <div
                      className={[
                        "mx-4 h-0.5 flex-1 rounded-full transition-all duration-300",
                        currentStep > step.number
                          ? "bg-[#2A9D8F]"
                          : "bg-[#E4E7EC]",
                      ].join(" ")}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-center sm:hidden">
        <div className="rounded-full bg-[#EEF7F5] px-3 py-1.5 text-xs font-semibold text-[#206B62]">
          Step {currentStep} of {steps.length}:{" "}
          {steps[currentStep - 1]?.label}
        </div>
      </div>
    </div>
  );
}

export default StepIndicator;