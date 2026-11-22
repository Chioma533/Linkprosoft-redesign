import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  CreditCard,
  Layers3,
  UserRound,
  X,
} from "lucide-react";

import selfieImage from "../../assets/images/faceverification_illustration.jpg";
import VerificationFormIllustration from "../../assets/images/verification_form_illustration.png";
import IdentityIllustration from "../../assets/images/identity-verification_illustration.png";
import ProfessionalIllustration from "../../assets/images/profession-verification_illustration.png";
import PaymentIllustration from "../../assets/images/payment-verification_illustration.png";
import PreviewIllustration from "../../assets/images/preview-verification_illustration.png";

import VerificationHeader from "../../components/verification/VerificationHeader";
import VerificationProgress from "../../components/verification/VerificationProgress";
import VerificationField from "../../components/verification/VerificationField";
import VerificationPreview from "../../components/verification/VerificationPreview";
import VerificationActionBar from "../../components/verification/VerificationActionBar";
import ProfessionalVerification from "../../components/verification/ProfessionalVerification";

import useVerification from "../../hooks/verification/useVerification";

const VerificationPage = () => {
  const {
    view,
    setView,
    completedSteps,
    highestReachedStep,
    handleStepClick,

    profile,
    updateProfile,
    errors,

    uploadedFile,
    handleIdentityUpload,

    selfieCaptured,
    setSelfieCaptured,
    setSelfieBlob,
    setSelfieMediaId,
    selfiePreviewUrl,
    setSelfiePreviewUrl,

    banks,
    resolveBankAccount,

    isLoading,
    showSuccess,
    setShowSuccess,

    submitIdentityStep,
    submitProfessionalStep,
    submitFaceStep,
    submitPaymentStep,
    submitFinalVerification,
  } = useVerification();

  const selfieObjectUrlRef = useRef(null);

  useEffect(() => () => {
    if (selfieObjectUrlRef.current) URL.revokeObjectURL(selfieObjectUrlRef.current);
  }, []);

  const handleSelfieUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) return;
      if (selfieObjectUrlRef.current) URL.revokeObjectURL(selfieObjectUrlRef.current);
      const previewUrl = URL.createObjectURL(file);
      selfieObjectUrlRef.current = previewUrl;
      setSelfieBlob(file);
      setSelfieMediaId(null);
      setSelfiePreviewUrl(previewUrl);
      setSelfieCaptured(true);
    }
  };

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

  if (view === "overview") {
    const isIdentityCompleted = completedSteps.includes("identity");
    const isProfessionalCompleted = completedSteps.includes("professional");
    const isPaymentCompleted = completedSteps.includes("payment");

    return (
      <main className="verification-page verification-overview-page min-h-screen bg-[#f7f7f7] px-4 py-6 text-[#171a1c] sm:px-8 sm:py-12">
        <section className="verification-shell mx-auto max-w-[960px] rounded-[28px] bg-white px-4 py-7 sm:px-12 sm:py-12 space-y-8">
          {/* Header */}
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:items-start sm:justify-between sm:gap-5">
            <div className="min-w-0">
              <h1 className="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-extrabold text-gray-900">
                Holla! Let&apos;s Get You Verified
              </h1>

              <p className="mt-2 max-w-[570px] text-sm leading-relaxed text-[#777b7d]">
                Complete your verification to unlock more opportunities, build trust with clients, and start receiving verified job requests on Linkprosoft.
              </p>
            </div>

            <img
              src={VerificationFormIllustration}
              alt=""
              className="w-20 shrink-0 object-contain sm:w-[150px]"
            />
          </div>

          {/* Standard Stepper Cards */}
          <div className="pt-2">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {[
                {
                  icon: UserRound,
                  title: "Verify Your Information",
                  description:
                    "Get your details verified to create a trusted profile and start reaching out to clients.",
                  step: "identity",
                  isCompleted: isIdentityCompleted,
                  isLocked: false,
                },
                {
                  icon: Layers3,
                  title: "Professional Profile",
                  description:
                    "Confirm your skills and credentials to strengthen your profile and connect with clients.",
                  step: "professional",
                  isCompleted: isProfessionalCompleted,
                  isLocked: !isIdentityCompleted,
                },
                {
                  icon: CreditCard,
                  title: "Payment Verification",
                  description:
                    "Add and confirm your payment information so we can process your earnings safely and securely.",
                  step: "payment",
                  isCompleted: isPaymentCompleted,
                  isLocked: !isIdentityCompleted || !isProfessionalCompleted,
                },
              ].map(({ icon: Icon, title, description, step, isCompleted, isLocked }) => (
                <article
                  key={title}
                  className={`flex min-h-[220px] min-w-0 flex-col rounded-2xl border p-5 transition ${
                    isLocked
                      ? "border-[#e7e8e8] bg-[#fafafa] opacity-60"
                      : "border-[#e7e8e8] bg-white"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef8fc] text-[#0879aa]">
                    <Icon size={22} />
                  </div>

                  <span className="mt-5 w-fit rounded-md bg-[#eaf3f6] px-2.5 py-0.5 text-[10px] text-[#555b5e]">
                    Duration: 1 min
                  </span>

                  <h4 className="mt-3 text-sm font-bold text-gray-900">{title}</h4>

                  <p className="mt-1 text-xs leading-relaxed text-[#85898b]">
                    {description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-[#85898b]">
                    <button
                      type="button"
                      disabled={isLocked}
                      className="text-[#85898b] transition hover:text-[#0879aa] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Learn more&nbsp; &#8250;
                    </button>
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => !isLocked && setView(step)}
                      className={`rounded-full px-4 py-2 text-[10px] text-white transition ${
                        isLocked
                          ? "cursor-not-allowed bg-gray-300"
                          : "bg-[#0879aa] hover:bg-[#076b97] cursor-pointer"
                      }`}
                    >
                      {isCompleted ? "Edit Step" : isLocked ? "Locked" : "Start Step"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="verification-page min-h-screen bg-[#f7f7f7] px-3 py-5 sm:px-8 sm:py-12">
      <section className="verification-shell mx-auto max-w-[960px] rounded-[28px] bg-white px-4 py-7 sm:px-12 sm:py-8">
        <VerificationProgress
          activeStep={stepNumber}
          completedSteps={completedSteps}
          highestReachedStep={highestReachedStep}
          onStepClick={handleStepClick}
        />

        <div className="mt-7">
          {view === "identity" && (
            <>
              <VerificationHeader
                title="Identity Verification."
                description="Get your details verified to create a trusted profile and start reaching to clients"
                image={IdentityIllustration}
              />

              <div className="verification-panel mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.25fr_.75fr] sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <VerificationField
                    label="First Name"
                    placeholder="Enter name"
                    value={profile.firstName || ""}
                    onChange={(e) => updateProfile("firstName", e.target.value)}
                    error={errors.firstName}
                  />

                  <VerificationField
                    label="Last Name"
                    placeholder="Enter name"
                    value={profile.lastName || ""}
                    onChange={(e) => updateProfile("lastName", e.target.value)}
                    error={errors.lastName}
                  />

                  <VerificationField
                    label="Phone Number"
                    placeholder="(+234)"
                    value={profile.phone || ""}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                    error={errors.phone}
                  />

                  <VerificationField
                    label="Date of birth"
                    placeholder="Enter date"
                    value={profile.dateOfBirth || ""}
                    onChange={(e) => updateProfile("dateOfBirth", e.target.value)}
                    error={errors.dateOfBirth}
                  />

                  <VerificationField
                    label="Residential Address"
                    placeholder="Enter address"
                    value={profile.address || ""}
                    onChange={(e) => updateProfile("address", e.target.value)}
                    error={errors.address}
                  />

                  <VerificationField
                    label="Nationality"
                    placeholder="Select nationality"
                    value={profile.nationality || "Nigerian"}
                    onChange={(e) => updateProfile("nationality", e.target.value)}
                    error={errors.nationality}
                  />
                </div>

                <VerificationPreview
                  profile={profile}
                  onUpload={handleIdentityUpload}
                  uploadedFile={uploadedFile}
                  error={errors.idDocument}
                />
              </div>

              <VerificationActionBar
                onBack={() => setView("overview")}
                onContinue={submitIdentityStep}
                isLoading={isLoading}
              />
            </>
          )}

          {view === "professional" && (
            <>
              <VerificationHeader
                title="Professional Verification."
                description="Showcase your professional background and service disciplines"
                image={ProfessionalIllustration}
              />

              <ProfessionalVerification
                profile={profile}
                updateProfile={updateProfile}
                errors={errors}
                uploadedFile={uploadedFile}
                isLoading={isLoading}
                onBack={() => setView("identity")}
                onContinue={submitProfessionalStep}
              />
            </>
          )}

          {view === "face" && (
            <>
              <VerificationHeader
                title="Face Verification."
                description="Snap a selfie to match your face with the identity document provided"
                image={selfieImage}
              />

              <div className="verification-panel mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.25fr_.75fr] sm:p-6">
                <div>
                  <div className="overflow-hidden rounded-2xl border border-[#e7e8e8] bg-[#f9fbfb] p-6 text-center">
                    {selfiePreviewUrl ? (
                      <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-full border-4 border-[#0879aa] shadow-md">
                        <img
                          src={selfiePreviewUrl}
                          alt="Selfie"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelfieCaptured(false);
                            setSelfiePreviewUrl(null);
                            setSelfieBlob(null);
                          }}
                          className="absolute bottom-2 right-2 rounded-full bg-rose-500 p-1.5 text-white shadow-md hover:bg-rose-600 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-full border-2 border-dashed border-[#0879aa] bg-[#eef8fc]">
                        <Camera size={44} className="text-[#0879aa]" />
                        <span className="mt-2 text-xs font-semibold text-[#0879aa]">
                          Capture Face
                        </span>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <label className="cursor-pointer rounded-full bg-[#0879aa] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#076b97] transition">
                        <span>{selfieCaptured ? "Retake Photo" : "Upload Selfie"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="user"
                          onChange={handleSelfieUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {errors.selfie && (
                      <p className="mt-3 text-xs text-rose-500">{errors.selfie}</p>
                    )}
                  </div>
                </div>

                <VerificationPreview
                  profile={profile}
                  compact
                  uploadedFile={uploadedFile}
                />
              </div>

              <VerificationActionBar
                onBack={() => setView("professional")}
                onContinue={submitFaceStep}
                isLoading={isLoading}
              />
            </>
          )}

          {view === "payment" && (
            <>
              <VerificationHeader
                title="Payment Setup & Payout Verification."
                description="Securely link your verified bank details for automated escrow releases"
                image={PaymentIllustration}
              />

              <div className="verification-panel mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.25fr_.75fr] sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Commercial Bank
                    </label>
                    <select
                      value={profile.bankCode || ""}
                      onChange={(e) => {
                        const code = e.target.value;
                        const b = banks.find((item) => item.code === code);
                        updateProfile("bankCode", code);
                        updateProfile("bankName", b?.name || "");
                      }}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#0879aa]"
                    >
                      <option value="">Select Financial Institution</option>
                      {banks.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    {errors.bankName && (
                      <p className="text-[10px] text-rose-500 mt-1">{errors.bankName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <VerificationField
                      label="Account Number (10-Digit NUBAN)"
                      placeholder="0123456789"
                      value={profile.accountNumber || ""}
                      onChange={(e) => updateProfile("accountNumber", e.target.value)}
                      error={errors.accountNumber}
                    />

                    <VerificationField
                      label="Resolved Account Name"
                      placeholder="Account Holder Name"
                      value={profile.accountName || profile.account_name || ""}
                      disabled
                      onChange={() => {}}
                      error={errors.accountName}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => resolveBankAccount(profile.bankCode, profile.accountNumber)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#eef8fc] text-[#0879aa] hover:bg-sky-100 transition cursor-pointer"
                    >
                      Verify Account Number
                    </button>
                  </div>
                </div>

                <VerificationPreview
                  profile={profile}
                  compact
                  uploadedFile={uploadedFile}
                />
              </div>

              <VerificationActionBar
                onBack={() => setView("face")}
                onContinue={submitPaymentStep}
                isLoading={isLoading}
              />
            </>
          )}

          {view === "review" && (
            <>
              <VerificationHeader
                title="Review & Final Confirmation"
                description="Double-check your submitted dossier before committing to platform compliance review"
                image={PreviewIllustration}
              />

              <div className="mt-6 rounded-2xl border border-gray-200 p-6 bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase">Identity</h4>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{profile.phone}</p>
                    <p className="text-xs text-gray-500">{profile.address}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase">Trade & Discipline</h4>
                    <p className="text-sm font-bold text-gray-800 mt-1">{profile.profession || "N/A"}</p>
                    <p className="text-xs text-gray-500">{profile.category}</p>
                    <p className="text-xs text-gray-500">{profile.yearsOfExperience} years experience</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase">Payout Bank</h4>
                    <p className="text-sm font-bold text-gray-800 mt-1">{profile.bankName || "N/A"}</p>
                    <p className="text-xs text-gray-500">{profile.accountNumber}</p>
                    <p className="text-xs text-emerald-600 font-semibold">{profile.accountName}</p>
                  </div>
                </div>
              </div>

              <VerificationActionBar
                onBack={() => setView("payment")}
                onContinue={submitFinalVerification}
                isLoading={isLoading}
                backLabel="Go back"
                continueLabel="Confirm & Submit Dossier"
              />
            </>
          )}
        </div>
      </section>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[340px] rounded-2xl bg-white p-7 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7fb] text-[#0879aa]">
              <Check size={34} />
            </div>

            <h2 className="mt-5 text-xl font-bold">Dossier Submitted!</h2>

            <p className="mt-1 text-xs text-[#85898b]">
              Your verification dossier is now in the administrative review queue.
            </p>

            <Link
              to="/home"
              id="view-profile-btn"
              className="mt-6 block rounded-full bg-[#0879aa] py-3 text-xs text-white hover:bg-[#076b97] transition font-bold"
            >
              Return to Dashboard
            </Link>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-2 w-full rounded-full bg-[#fafafa] py-3 text-xs text-[#4d5254] hover:bg-gray-100 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default VerificationPage;
