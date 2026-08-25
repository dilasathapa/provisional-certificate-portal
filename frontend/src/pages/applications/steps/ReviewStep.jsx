function ReviewStep({
  applicationData,
  documents,
  onBack,
  onSubmit,
  submitting,
}) {
  const formatDate = (value) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z"
              />
            </svg>
          </div>

          <span className="text-sm font-semibold text-indigo-600">
            Final review
          </span>
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
          Review your application
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Please verify all information and documents carefully
          before submitting your application.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Details */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                  />
                  <circle cx="9" cy="7" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 8v6m3-3h-6"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Personal details
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Applicant information
                </p>
              </div>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              Step 1
            </span>
          </div>

          <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6">
            <DetailItem
              label="Full name"
              value={applicationData.fullName}
            />

            <DetailItem
              label="Date of birth"
              value={formatDate(applicationData.dateOfBirth)}
            />

            <DetailItem
              label="Registration number"
              value={applicationData.registrationNumber}
              mono
            />

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Address
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-800">
                {applicationData.address || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 2v6h6"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Documents
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Required supporting documents
                </p>
              </div>
            </div>

            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
              Step 2
            </span>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            <DocumentRow
              label="ID Proof"
              file={documents.idProof}
              formatFileSize={formatFileSize}
            />

            <DocumentRow
              label="Degree Certificate"
              file={documents.degreeCertificate}
              formatFileSize={formatFileSize}
            />
          </div>
        </section>

        {/* Submission Notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Before you submit
              </p>

              <p className="mt-1.5 text-sm leading-6 text-amber-800/80">
                Please make sure all information and uploaded
                documents are correct. Once submitted, the
                application will be recorded and an acknowledgment
                PDF will be generated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold cursor-pointer text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Submitting...
            </span>
          ) : (
            "Submit application →"
          )}
        </button>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  mono = false,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={[
          "mt-2 text-sm font-medium text-slate-800",
          mono ? "font-mono tracking-wide" : "",
        ].join(" ")}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function DocumentRow({
  label,
  file,
  formatFileSize,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-600 ring-1 ring-red-100">
          PDF
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {file?.name || "No file"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 sm:inline">
          {formatFileSize(file?.size)}
        </span>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;