function PersonalDetailsStep({
  register,
  errors,
  onNext,
  maxDate,
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Personal & registration details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the details exactly as they appear on your
          official documents.
        </p>
      </div>

      <div className="space-y-5">

        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Full name
          </label>

          <input
            id="fullName"
            {...register("fullName")}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          {errors.fullName && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* DOB */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Date of birth
          </label>

          <input
            id="dateOfBirth"
            type="date"
            max={maxDate}
            {...register("dateOfBirth")}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          {errors.dateOfBirth && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Registration */}
        <div>
          <label
            htmlFor="registrationNumber"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Registration number
          </label>

          <input
            id="registrationNumber"
            {...register("registrationNumber")}
            placeholder="e.g. REG202400123"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          {errors.registrationNumber && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.registrationNumber.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Address
          </label>

          <textarea
            id="address"
            rows={4}
            {...register("address")}
            placeholder="Enter your complete address"
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          {errors.address && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Continue
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
}

export default PersonalDetailsStep;