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
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Review your application
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Please verify all information before submitting your
          application.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal details */}
        <section className="rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Personal details
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Applicant information
              </p>
            </div>

            <span className="text-xs font-medium text-emerald-600">
              Step 1
            </span>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Full name
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {applicationData.fullName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Date of birth
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(applicationData.dateOfBirth)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Registration number
              </p>

              <p className="mt-1 font-mono text-sm font-medium text-slate-900">
                {applicationData.registrationNumber || "—"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-slate-500">
                Address
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-900">
                {applicationData.address || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Documents
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Required supporting documents
              </p>
            </div>

            <span className="text-xs font-medium text-emerald-600">
              Step 2
            </span>
          </div>

          <div className="space-y-3 p-5">
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

        {/* Submission notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 text-amber-600">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Before you submit
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-700">
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
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </div>
  );
}

function DocumentRow({
  label,
  file,
  formatFileSize,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-600">
          PDF
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="truncate text-sm font-medium text-slate-900">
            {file?.name || "No file"}
          </p>
        </div>
      </div>

      <span className="shrink-0 text-xs text-slate-500">
        {formatFileSize(file?.size)}
      </span>
    </div>
  );
}

export default ReviewStep;