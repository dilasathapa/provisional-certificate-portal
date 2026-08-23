import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AppLayout from "../../layouts/AppLayout";
import StepIndicator from "./components/StepIndicator";

import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import DocumentsStep from "./steps/DocumentsStep";
import ReviewStep from "./steps/ReviewStep";

import {
  createApplication,
  submitApplication,
} from "../../api/application.api";

import {
  uploadApplicationDocument,
} from "../../api/document.api";

const personalDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters."),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine(
      (value) => {
        const selectedDate = new Date(`${value}T00:00:00`);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return selectedDate <= today;
      },
      {
        message: "Date of birth cannot be in the future.",
      }
    ),

  registrationNumber: z
    .string()
    .trim()
    .min(3, "Registration number is required."),

  address: z
    .string()
    .trim()
    .min(10, "Please enter your complete address."),
});

function NewApplication() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [documents, setDocuments] = useState({
    idProof: null,
    degreeCertificate: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalDetailsSchema),
    mode: "onBlur",

    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      registrationNumber: "",
      address: "",
    },
  });

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handlePersonalDetailsNext = async () => {
    const valid = await trigger([
      "fullName",
      "dateOfBirth",
      "registrationNumber",
      "address",
    ]);

    if (!valid) {
      return;
    }

    setCurrentStep(2);
  };

  const handleDocumentsNext = () => {
    if (!documents.idProof || !documents.degreeCertificate) {
      return;
    }

    setCurrentStep(3);
  };

  const handleBack = () => {
    setSubmitError("");

    setCurrentStep((previous) => previous - 1);
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);

    try {
        // Validate personal details again before final submission
        const valid = await trigger([
        "fullName",
        "dateOfBirth",
        "registrationNumber",
        "address",
        ]);

        if (!valid) {
        setCurrentStep(1);
        return;
        }

        // Make sure both required documents exist
        if (
        !documents.idProof ||
        !documents.degreeCertificate
        ) {
        setCurrentStep(2);
        return;
        }

        const applicationData = getValues();

        // 1. Create a draft application
        const applicationResponse =
        await createApplication({
            fullName: applicationData.fullName,
            dateOfBirth: applicationData.dateOfBirth,
            registrationNumber:
            applicationData.registrationNumber,
            address: applicationData.address,
        });

        const applicationId =
        applicationResponse.application.id;

        // 2. Upload ID proof
        await uploadApplicationDocument({
        applicationId,
        file: documents.idProof,
        type: "ID_PROOF",
        });

        // 3. Upload degree certificate
        await uploadApplicationDocument({
        applicationId,
        file: documents.degreeCertificate,
        type: "DEGREE_CERTIFICATE",
        });

        // 4. Submit the application
        const submissionResponse =
        await submitApplication(applicationId);

        console.log(
        "Application submitted successfully:",
        submissionResponse
        );

        // 5. Navigate to dashboard
        navigate("/dashboard");
    } catch (error) {
        console.error(
        "Application submission failed:",
        error
        );

        const message =
        error.response?.data?.message ||
        "Unable to submit your application. Please try again.";

        setSubmitError(message);
    } finally {
        setSubmitting(false);
    }
  };

  const applicationData = getValues();

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-600">
            New Application
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Provisional Certificate
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Complete the following steps to submit your
            application.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

          <StepIndicator currentStep={currentStep} />

          {submitError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {currentStep === 1 && (
            <PersonalDetailsStep
              register={register}
              errors={errors}
              onNext={handlePersonalDetailsNext}
              maxDate={getToday()}
            />
          )}

          {currentStep === 2 && (
            <DocumentsStep
              documents={documents}
              setDocuments={setDocuments}
              onNext={handleDocumentsNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              applicationData={applicationData}
              documents={documents}
              onBack={handleBack}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default NewApplication;