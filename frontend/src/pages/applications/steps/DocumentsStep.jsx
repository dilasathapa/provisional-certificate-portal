import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function DocumentsStep({
  documents,
  setDocuments,
  onNext,
  onBack,
}) {
  const [errors, setErrors] = useState({});

  const validateFile = (file, fieldName) => {
    if (!file) {
      return "Please select a file.";
    }

    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must not exceed 5 MB.";
    }

    return "";
  };

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const error = validateFile(file, fieldName);

    if (error) {
      setErrors((previous) => ({
        ...previous,
        [fieldName]: error,
      }));

      setDocuments((previous) => ({
        ...previous,
        [fieldName]: null,
      }));

      return;
    }

    setErrors((previous) => ({
      ...previous,
      [fieldName]: "",
    }));

    setDocuments((previous) => ({
      ...previous,
      [fieldName]: file,
    }));
  };

  const handleNext = () => {
    const newErrors = {};

    if (!documents.idProof) {
      newErrors.idProof = "ID Proof is required.";
    }

    if (!documents.degreeCertificate) {
      newErrors.degreeCertificate =
        "Degree Certificate is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onNext();
  };

  const removeFile = (fieldName) => {
    setDocuments((previous) => ({
      ...previous,
      [fieldName]: null,
    }));

    setErrors((previous) => ({
      ...previous,
      [fieldName]: "",
    }));
  };

  const renderUpload = ({
    fieldName,
    label,
    description,
  }) => {
    const file = documents[fieldName];
    const error = errors[fieldName];

    return (
      <div>
        <label className="mb-2.5 block text-sm font-semibold text-slate-800">
          {label}
        </label>

        {!file ? (
          <label
            htmlFor={fieldName}
            className={[
              "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-9 text-center transition-all duration-200",
              error
                ? "border-red-300 bg-red-50/40"
                : "border-slate-300 bg-slate-50/70 hover:border-indigo-400 hover:bg-indigo-50/40",
            ].join(" ")}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-200 group-hover:scale-105 group-hover:ring-indigo-200">
              <svg
                className="h-5 w-5 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0L8 8m4-4 4 4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
                />
              </svg>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              Click to upload
            </p>

            <p className="mt-1.5 text-xs text-slate-500">
              {description}
            </p>

            <input
              id={fieldName}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) =>
                handleFileChange(event, fieldName)
              }
            />
          </label>
        ) : (
          <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 transition">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-red-600 shadow-sm ring-1 ring-slate-200">
                PDF
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {file.name}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                  <span className="mx-1.5 text-slate-300">
                    •
                  </span>
                  PDF document
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeFile(fieldName)}
              className="ml-4 shrink-0 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer text-red-600 transition hover:bg-red-50 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Upload required documents
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Upload clear PDF copies of the required documents.
          Each file must be no larger than 5 MB.
        </p>
      </div>

      <div className="space-y-6">
        {renderUpload({
          fieldName: "idProof",
          label: "ID Proof",
          description: "PDF only · Maximum 5 MB",
        })}

        {renderUpload({
          fieldName: "degreeCertificate",
          label: "Degree Certificate",
          description: "PDF only · Maximum 5 MB",
        })}
      </div>

      <div className="mt-9 flex items-center justify-between border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold cursor-pointer text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/20 cursor-pointer"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

export default DocumentsStep;