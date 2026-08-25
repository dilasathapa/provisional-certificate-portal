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

      if (
        !documents.idProof ||
        !documents.degreeCertificate
      ) {
        setCurrentStep(2);
        return;
      }

      const applicationData = getValues();

      // 1. Create draft application
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

      // 4. Submit application
      const submissionResponse =
        await submitApplication(applicationId);

      console.log(
        "Application submitted successfully:",
        submissionResponse
      );

      

      // 5. Return to dashboard
      navigate("/dashboard", {
        state: {
            applicationSubmitted: true,
        },
      });
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
      <div className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-4xl">

          {/* Page heading */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-[#2A9D8F]" />

              <p className="text-sm font-semibold tracking-wide text-[#206B62]">
                New Application
              </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Provisional Certificate
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
              Complete the following steps to submit your
              provisional certificate application.
            </p>
          </div>

          {/* Application card */}
          <div className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-[0_4px_20px_rgba(16,24,40,0.05)]">

            {/* Card top accent */}
            <div className="h-1 w-full bg-[#173F5F]" />

            <div className="p-5 sm:p-8 lg:p-10">

              {/* Step indicator */}
              <StepIndicator currentStep={currentStep} />

              {/* Error */}
              {submitError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700">
                  {submitError}
                </div>
              )}

              {/* Step content */}
              <div className="mt-8">
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
          </div>

          {/* Supporting information */}
          <div className="mt-5 flex flex-col gap-2 text-center text-xs text-[#667085] sm:flex-row sm:items-center sm:justify-center sm:gap-3">
            <span>Secure application process</span>

            <span className="hidden h-1 w-1 rounded-full bg-[#98A2B3] sm:block" />

            <span>Your information is handled securely</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default NewApplication;