function PersonalDetailsStep({
  register,
  errors,
  onNext,
  maxDate,
}) {
  return (
    <div>
      {/* Section heading */}
      <div className="mb-7">
        <h2 className="text-lg font-bold tracking-tight text-[#172033] sm:text-xl">
          Personal & registration details
        </h2>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#667085]">
          Enter the details exactly as they appear on your
          official documents.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name + DOB */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Full name
              <span className="ml-1 text-[#D92D20]">*</span>
            </label>

            <input
              id="fullName"
              {...register("fullName")}
              placeholder="Enter your full name"
              autoComplete="name"
              className={[
                "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#172033] outline-none transition-all duration-200",
                "placeholder:text-[#98A2B3]",
                "hover:border-[#98A2B3]",
                "focus:border-[#2A9D8F] focus:ring-4 focus:ring-[#2A9D8F]/10",
                errors.fullName
                  ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                  : "border-[#D0D5DD]",
              ].join(" ")}
            />

            {errors.fullName && (
              <p className="mt-2 text-xs font-medium text-[#D92D20]">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-2 block text-sm font-semibold text-[#344054]"
            >
              Date of birth
              <span className="ml-1 text-[#D92D20]">*</span>
            </label>

            <input
              id="dateOfBirth"
              type="date"
              max={maxDate}
              {...register("dateOfBirth")}
              className={[
                "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#172033] outline-none transition-all duration-200",
                "hover:border-[#98A2B3]",
                "focus:border-[#2A9D8F] focus:ring-4 focus:ring-[#2A9D8F]/10",
                errors.dateOfBirth
                  ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                  : "border-[#D0D5DD]",
              ].join(" ")}
            />

            {errors.dateOfBirth && (
              <p className="mt-2 text-xs font-medium text-[#D92D20]">
                {errors.dateOfBirth.message}
              </p>
            )}

            {!errors.dateOfBirth && (
              <p className="mt-2 text-xs text-[#667085]">
                Select a date on or before today.
              </p>
            )}
          </div>
        </div>

        {/* Registration number */}
        <div>
          <label
            htmlFor="registrationNumber"
            className="mb-2 block text-sm font-semibold text-[#344054]"
          >
            Registration number
            <span className="ml-1 text-[#D92D20]">*</span>
          </label>

          <input
            id="registrationNumber"
            {...register("registrationNumber")}
            placeholder="e.g. REG202400123"
            autoComplete="off"
            className={[
              "w-full rounded-xl border bg-white px-4 py-3 text-sm uppercase text-[#172033] outline-none transition-all duration-200",
              "placeholder:normal-case placeholder:text-[#98A2B3]",
              "hover:border-[#98A2B3]",
              "focus:border-[#2A9D8F] focus:ring-4 focus:ring-[#2A9D8F]/10",
              errors.registrationNumber
                ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                : "border-[#D0D5DD]",
            ].join(" ")}
          />

          {errors.registrationNumber && (
            <p className="mt-2 text-xs font-medium text-[#D92D20]">
              {errors.registrationNumber.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-semibold text-[#344054]"
          >
            Address
            <span className="ml-1 text-[#D92D20]">*</span>
          </label>

          <textarea
            id="address"
            rows={4}
            {...register("address")}
            placeholder="Enter your complete address"
            autoComplete="street-address"
            className={[
              "w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-[#172033] outline-none transition-all duration-200",
              "placeholder:text-[#98A2B3]",
              "hover:border-[#98A2B3]",
              "focus:border-[#2A9D8F] focus:ring-4 focus:ring-[#2A9D8F]/10",
              errors.address
                ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                : "border-[#D0D5DD]",
            ].join(" ")}
          />

          {errors.address && (
            <p className="mt-2 text-xs font-medium text-[#D92D20]">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      {/* Continue */}
      <div className="mt-9 flex justify-end border-t border-[#E4E7EC] pt-6">
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/20 cursor-pointer"
        >
          Continue
          <span className="ml-2 text-base">→</span>
        </button>
      </div>
    </div>
  );
}

export default PersonalDetailsStep;