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
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>

        {!file ? (
          <label
            htmlFor={fieldName}
            className={[
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition",
              error
                ? "border-red-300 bg-red-50/30"
                : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/30",
            ].join(" ")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
              <span className="text-lg">↑</span>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              Click to upload
            </p>

            <p className="mt-1 text-xs text-slate-500">
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
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-600">
                PDF
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {file.name}
                </p>

                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeFile(fieldName)}
              className="ml-4 shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Upload required documents
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
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

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

export default DocumentsStep;