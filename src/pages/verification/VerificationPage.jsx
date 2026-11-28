import React from "react";
import VerificationProgress from "../../components/verification/VerificationProgress";
import ProfessionalVerification from "../../components/verification/ProfessionalVerification";
import useVerification from "../../hooks/verification/useVerification";
import VerificationOverview from "./components/VerificationOverview";
import IdentityVerificationStep from "./components/IdentityVerificationStep";
import FaceVerificationStep from "./components/FaceVerificationStep";
import PaymentVerificationStep from "./components/PaymentVerificationStep";
import VerificationReviewStep from "./components/VerificationReviewStep";
import VerificationSuccessModal from "./components/VerificationSuccessModal";

const VerificationPage = () => {
  const verification = useVerification();
  const {
    view,
    setView,
    completedSteps,
    highestReachedStep,
    handleStepClick,
    profile,
    updateProfile,
    errors,
    idDocumentFile,
    uploadedFile,
    handleIdentityUpload,
    selfieCaptured,
    setSelfieCaptured,
    setSelfieBlob,
    setSelfieMediaId,
    selfiePreviewUrl,
    setSelfiePreviewUrl,
    banks,
    bankError,
    resolveBankAccount,
    overallStatus,
    rejectionReason,
    rejectedStep,
    isLoading,
    showSuccess,
    setShowSuccess,
    submitIdentityStep,
    submitProfessionalStep,
    submitFaceStep,
    submitPaymentStep,
    submitFinalVerification,
  } = verification;

  if (view === "overview") {
    return (
      <VerificationOverview
        completedSteps={completedSteps}
        overallStatus={overallStatus}
        rejectionReason={rejectionReason}
        rejectedStep={rejectedStep}
        setView={setView}
      />
    );
  }

  const stepNumber =
    view === "identity"
      ? 1
      : view === "professional"
        ? 2
        : view === "face"
          ? 3
          : view === "payment"
            ? 4
            : 1;
  const isFaceStep = view === "face";

  return (
    <main
      className={`verification-page min-h-screen bg-[#f7f7f7] px-3 sm:px-8 ${
        isFaceStep ? "py-4 sm:py-6" : "py-5 sm:py-12"
      }`}
    >
      <section
        className={`verification-shell mx-auto max-w-[960px] rounded-[28px] bg-white ${
          isFaceStep
            ? "px-4 py-5 sm:px-12 sm:py-6"
            : "px-4 py-7 sm:px-12 sm:py-8"
        }`}
      >
        <VerificationProgress
          activeStep={stepNumber}
          completedSteps={completedSteps}
          highestReachedStep={highestReachedStep}
          onStepClick={handleStepClick}
        />

        <div className={isFaceStep ? "mt-5" : "mt-7"}>
          {view === "identity" && (
            <IdentityVerificationStep
              profile={profile}
              errors={errors}
              updateProfile={updateProfile}
              idDocumentFile={idDocumentFile}
              uploadedFile={uploadedFile}
              handleIdentityUpload={handleIdentityUpload}
              isLoading={isLoading}
              onBack={() => setView("overview")}
              onContinue={submitIdentityStep}
            />
          )}

          {view === "professional" && (
            <ProfessionalVerification
              profile={profile}
              updateProfile={updateProfile}
              errors={errors}
              uploadedFile={uploadedFile}
              isLoading={isLoading}
              onBack={() => setView("identity")}
              onContinue={submitProfessionalStep}
            />
          )}

          {view === "face" && (
            <FaceVerificationStep
              view={view}
              selfieCaptured={selfieCaptured}
              selfiePreviewUrl={selfiePreviewUrl}
              setSelfieCaptured={setSelfieCaptured}
              setSelfieBlob={setSelfieBlob}
              setSelfieMediaId={setSelfieMediaId}
              setSelfiePreviewUrl={setSelfiePreviewUrl}
              errors={errors}
              isLoading={isLoading}
              onBack={() => setView("professional")}
              onContinue={submitFaceStep}
            />
          )}

          {view === "payment" && (
            <PaymentVerificationStep
              profile={profile}
              errors={errors}
              banks={banks}
              bankError={bankError}
              uploadedFile={uploadedFile}
              updateProfile={updateProfile}
              resolveBankAccount={resolveBankAccount}
              isLoading={isLoading}
              onBack={() => setView("face")}
              onContinue={submitPaymentStep}
            />
          )}

          {view === "review" && (
            <VerificationReviewStep
              profile={profile}
              isLoading={isLoading}
              onBack={() => setView("payment")}
              onContinue={submitFinalVerification}
            />
          )}
        </div>
      </section>

      {showSuccess && (
        <VerificationSuccessModal onClose={() => setShowSuccess(false)} />
      )}
    </main>
  );
};

export default VerificationPage;
