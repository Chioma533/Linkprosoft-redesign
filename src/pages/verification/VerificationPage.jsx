import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  CreditCard,
  Layers3,
  UserRound,
  X,
} from "lucide-react";

import selfieImage from "../../assets/images/faceverification_illustration.jpg";
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

  const handleSelfieUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieBlob(file);
      setSelfiePreviewUrl(URL.createObjectURL(file));
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
      <main className="min-h-screen bg-[#f7f7f7] px-4 py-8 text-[#171a1c] sm:px-8 sm:py-12">
        <section className="mx-auto max-w-[960px] rounded-[28px] bg-white px-5 py-10 sm:px-12 sm:py-16">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight">
                Holla! Let&apos;s Get You Verified
              </h1>

              <p className="mt-2 max-w-[570px] text-sm leading-relaxed text-[#777b7d]">
                Complete your verification to unlock more opportunities, build
                trust with clients, and start receiving verified job requests on
                Linkprosoft.
              </p>
            </div>

            <img
              src={IdentityIllustration}
              alt=""
              className="hidden shrink-0 text-[#0879aa] sm:block"
            />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: UserRound,
                title: "Verify Your Information",
                description:
                  "Get your details verified to create a trusted profile and start reaching to clients.",
                step: "identity",
                isCompleted: isIdentityCompleted,
                isLocked: false,
              },
              {
                icon: Layers3,
                title: "Professional Verification",
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
                className={`flex min-h-[250px] flex-col rounded-2xl border p-5 transition ${
                  isLocked
                    ? "border-[#e7e8e8] bg-[#fafafa] opacity-60"
                    : "border-[#e7e8e8] bg-white"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8fc] text-[#0879aa]">
                  <Icon size={24} />
                </div>

                <span className="mt-7 w-fit rounded-md bg-[#eaf3f6] px-3 py-1 text-[10px] text-[#555b5e]">
                  Duration: 1 min
                </span>

                <h2 className="mt-4 text-base">{title}</h2>

                <p className="mt-1 text-xs leading-relaxed text-[#85898b]">
                  {description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5 text-xs text-[#85898b]">
                  <span>
                    Learn more <ArrowRight size={14} className="ml-1 inline" />
                  </span>

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
                    {isCompleted ? "Edit Step" : isLocked ? "Locked" : "Start Verification"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-3 py-5 sm:px-8 sm:py-12">
      <section className="mx-auto max-w-[960px] rounded-[28px] bg-white px-4 py-7 sm:px-12 sm:py-8">
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

              <div className="mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.25fr_.75fr] sm:p-6">
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
                    placeholder="Enter name"
                    value={profile.nationality || ""}
                    onChange={(e) => updateProfile("nationality", e.target.value)}
                    error={errors.nationality}
                  />

                  <label className="sm:col-span-2 text-xs text-[#44484a]">
                    Upload ID
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) handleIdentityUpload(file);
                      }}
                      className="mt-2 block h-20 w-full cursor-pointer rounded-xl border border-[#e7e8e8] px-4 py-7 text-xs text-[#85898b] file:hidden"
                    />
                    {uploadedFile && (
                      <span className="mt-1 block text-[10px] text-[#0879aa]">
                        {uploadedFile}
                      </span>
                    )}
                    {errors.idDocument && (
                      <span className="mt-1 block text-[10px] text-red-500">
                        {errors.idDocument}
                      </span>
                    )}
                  </label>
                </div>
                <VerificationPreview profile={profile} uploadedFile={uploadedFile} />
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
                title="Profession Verification."
                description="Get your details verified to create a trusted profile and start reaching to clients"
                image={ProfessionalIllustration}
              />

              <ProfessionalVerification
                profile={profile}
                updateProfile={updateProfile}
                errors={errors}
                isLoading={isLoading}
                uploadedFile={uploadedFile}
                onBack={() => setView("identity")}
                onContinue={submitProfessionalStep}
              />
            </>
          )}

          {view === "face" && (
            <>
              <VerificationHeader
                title="Face Verification."
                description="Kindly take a quick selfie to let us confirm you are not a bot"
                image={PreviewIllustration}
              />

              <div className="mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.1fr_.9fr] sm:p-6">
                <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-[#dbe5e7] sm:min-h-[380px]">
                  <img
                    src={selfiePreviewUrl || selfieImage}
                    alt="Selfie verification preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-8 top-1/2 h-32 -translate-y-1/2 rounded-[48%] border-2 border-[#52d6e8]" />

                  <label className="absolute bottom-5 cursor-pointer rounded-full bg-white px-5 py-3 text-xs text-[#242729] shadow-sm hover:bg-gray-50 transition">
                    <Camera size={15} className="mr-2 inline" />
                    {selfieCaptured ? "Selfie captured" : "Take Selfie"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleSelfieUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex min-h-[300px] flex-col rounded-2xl bg-[#fafafa] p-5 sm:min-h-[380px]">
                  <div className="flex items-center justify-between border-b border-[#ececec] pb-4 text-sm text-[#424648]">
                    Preview
                    <X size={16} className="text-[#787d80]" />
                  </div>

                  <div className="flex flex-1 items-center justify-center py-5">
                    <img
                      src={selfiePreviewUrl || selfieImage}
                      alt="Captured selfie"
                      className="max-h-[245px] rounded-xl object-cover"
                    />
                  </div>

                  {selfieCaptured && (
                    <p className="text-center text-xs text-[#0879aa]">
                      <CheckCircle2 size={14} className="mr-1 inline" />
                      Ready for review
                    </p>
                  )}
                </div>
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
                title="Payment Verification"
                description="Add and confirm your payment information so we can process your earnings safely and securely."
                image={PaymentIllustration}
              />

              <div className="mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.25fr_.75fr] sm:p-6">
                <div className="grid content-start gap-5 sm:grid-cols-2">
                  <label className="block text-xs text-[#44484a]">
                    <span>Bank Name</span>
                    <input
                      list="banks-datalist"
                      placeholder="Enter bank name"
                      value={profile.bankName || ""}
                      onChange={(e) => {
                        const name = e.target.value;
                        const matching = banks.find((b) => b.name.toLowerCase() === name.toLowerCase());
                        updateProfile("bankName", name);
                        if (matching) {
                          updateProfile("bankCode", matching.code);
                          if (profile.accountNumber && profile.accountNumber.length === 10) {
                            resolveBankAccount(matching.code, profile.accountNumber);
                          }
                        }
                      }}
                      className="mt-2 h-10 w-full rounded-full border border-[#e7e8e8] px-4 text-xs text-[#333] outline-none placeholder:text-[#a5a8aa] focus:border-[#0879aa]"
                    />
                    <datalist id="banks-datalist">
                      {banks.map((b) => (
                        <option key={b.code} value={b.name} />
                      ))}
                    </datalist>
                    {errors.bankName && (
                      <span className="mt-1 block text-[10px] text-red-500">
                        {errors.bankName}
                      </span>
                    )}
                  </label>

                  <VerificationField
                    label="Account Number"
                    placeholder="Enter number"
                    maxLength={10}
                    value={profile.accountNumber || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      updateProfile("accountNumber", val);
                      if (val.length === 10 && profile.bankCode) {
                        resolveBankAccount(profile.bankCode, val);
                      }
                    }}
                    error={errors.accountNumber}
                  />

                  <VerificationField
                    label="account_name"
                    placeholder="Enter account name"
                    value={profile.account_name || profile.accountName || ""}
                    onChange={(e) => updateProfile("account_name", e.target.value)}
                    error={errors.account_name}
                  />

                  <VerificationField
                    label="Set payment password"
                    optional
                    placeholder="Enter password"
                    type="password"
                    value={profile.paymentPassword || ""}
                    onChange={(e) => updateProfile("paymentPassword", e.target.value)}
                  />

                  <VerificationField
                    label="BVN"
                    optional
                    placeholder="Enter name"
                    maxLength={11}
                    value={profile.bvn || ""}
                    onChange={(e) => updateProfile("bvn", e.target.value)}
                  />
                </div>
                <VerificationPreview profile={profile} compact uploadedFile={uploadedFile} />
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
                title="Preview"
                description="Kindly review the information that you have provided, Meanwhile you can always edit on the profile section."
                image={PreviewIllustration}
              />

              <div className="mt-6 rounded-2xl border border-[#e7e8e8] p-3 sm:p-5">
                <div className="rounded-2xl bg-[#fafafa] p-5 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1 */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-xs">
                      {[
                        ["First Name", profile.firstName || "Marvellous"],
                        ["Last Name", profile.lastName || "Oluwaseun"],
                        ["Phone Number", profile.phone || "+2349066760056"],
                        ["Date of birth", profile.dateOfBirth || "July 09 2002"],
                        ["Residential Address", profile.address || "No 2 Aremu olatunbosun"],
                        ["Nationality", profile.nationality || "Nigerian"],
                      ].map(([label, value]) => (
                        <div key={label} className="min-w-0">
                          <p className="text-[#44484a]">{label}</p>
                          <p className="mt-1 truncate text-[#85898b]">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Column 2 */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-xs">
                      {[
                        ["First Name", profile.firstName || "Marvellous"],
                        ["Last Name", profile.lastName || "Oluwaseun"],
                        ["Phone Number", profile.phone || "+2349066760056"],
                        ["Date of birth", profile.dateOfBirth || "July 09 2002"],
                        ["Residential Address", profile.address || "No 2 Aremu olatunbosun"],
                        ["Nationality", profile.nationality || "Nigerian"],
                      ].map(([label, value]) => (
                        <div key={`col2-${label}`} className="min-w-0">
                          <p className="text-[#44484a]">{label}</p>
                          <p className="mt-1 truncate text-[#85898b]">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3 overflow-hidden">
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[#dcecef] bg-[#e9f5ee] text-[9px] font-semibold text-[#43876a]">
                      {uploadedFile ? "ID ATTACHED" : "NIGERIA ID"}
                    </div>
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[#e5e5df] bg-[#f3f1e7] text-[9px] text-[#67675d]">
                      IDENTITY CARD
                    </div>
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[#e5e5df] bg-[#f3f1e7] text-[9px] text-[#67675d]">
                      IDENTITY CARD
                    </div>
                  </div>
                </div>
              </div>

              <VerificationActionBar
                onBack={() => setView("payment")}
                onContinue={submitFinalVerification}
                isLoading={isLoading}
                backLabel="Go back"
                continueLabel="Confirm"
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

            <h2 className="mt-5 text-xl">Yay!!! You are verified</h2>

            <p className="mt-1 text-xs text-[#85898b]">
              Congratulations, you have completed the verification.
            </p>

            <Link
              to="/home"
              id="view-profile-btn"
              className="mt-6 block rounded-full bg-[#0879aa] py-3 text-xs text-white hover:bg-[#076b97] transition"
            >
              View profile
            </Link>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-2 w-full rounded-full bg-[#fafafa] py-3 text-xs text-[#4d5254] hover:bg-gray-100 transition cursor-pointer"
            >
              Go back
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default VerificationPage;
