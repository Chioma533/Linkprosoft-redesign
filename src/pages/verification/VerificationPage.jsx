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
  Award,
  Star,
  Building2,
  Landmark,
  ShieldCheck,
  RefreshCw,
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
import VerificationBadge from "../../components/common/VerificationBadge";
import CertificationPathwayModal from "../../components/verification/CertificationPathwayModal";
import RatingPathwayModal from "../../components/verification/RatingPathwayModal";
import CompanyVerificationModal from "../../components/verification/CompanyVerificationModal";
import GovernmentVerificationModal from "../../components/verification/GovernmentVerificationModal";
import BadgeMaintenanceModal from "../../components/verification/BadgeMaintenanceModal";

import useVerification from "../../hooks/verification/useVerification";
import { useAuthStore } from "../../store/authStore";
import { getVerificationBadge, isSubscriptionLapsed } from "../../utils/verificationBadge";

const VerificationPage = () => {
  const { user } = useAuthStore();
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

  // Modal dialog states
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isGovernmentModalOpen, setIsGovernmentModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  // Local user verification state override to reflect immediate pathway submissions
  const [localUserOverrides, setLocalUserOverrides] = useState({});
  const activeUser = { ...user, ...localUserOverrides };

  const currentBadge = getVerificationBadge(activeUser);
  const isLapsed = isSubscriptionLapsed(activeUser);

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
                LinkProSoft Verification & Trust Badges
              </h1>

              <p className="mt-2 max-w-[570px] text-sm leading-relaxed text-[#777b7d]">
                Distinguish your professional credibility, corporate identity, or government recognition with our three-tier verification system.
              </p>
            </div>

            <img
              src={IdentityIllustration}
              alt=""
              className="w-20 shrink-0 text-[#0879aa] sm:w-[150px]"
            />
          </div>

          {/* Current Verification Status Panel */}
          <div className="rounded-2xl border border-gray-150 p-5 bg-gradient-to-br from-gray-50/80 to-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                {currentBadge ? (
                  <VerificationBadge user={activeUser} size="lg" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">
                    {currentBadge
                      ? `Active Badge: ${currentBadge.category.toUpperCase()}`
                      : "Account Unverified"}
                  </h3>
                  <VerificationBadge user={activeUser} size="sm" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentBadge
                    ? `Public display active • Maintained via ${activeUser.role === "government_agency" ? "Institutional Accreditation" : "Subscription"}`
                    : isLapsed
                    ? "Verification approved, but badge is temporarily hidden because subscription maintenance has lapsed. Renew to restore display."
                    : "No verification badge is currently displayed. Choose an eligible pathway below to apply."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                <span>Subscription Status</span>
              </button>
            </div>
          </div>

          {/* Verification Pathways Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Available Verification Pathways & Categories
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                LinkProSoft enforces three separate verification tiers with strict administrative review.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pathway A1: Professional - Certification */}
              <div className="rounded-2xl border border-sky-150 p-5 bg-sky-50/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#e6f1f6] text-[#016EA6]">
                      <Award className="w-3 h-3" />
                      Blue Badge (#016EA6)
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">Pathway 1</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Certified Professional</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    For professionals with government-issued or recognised trade licenses (plumbers, engineers, electricians).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(true)}
                  className="mt-5 w-full rounded-xl bg-[#016EA6] hover:bg-[#061EA6] text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Submit Certification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pathway A2: Professional - Rating based */}
              <div className="rounded-2xl border border-sky-150 p-5 bg-sky-50/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#e6f1f6] text-[#016EA6]">
                      <Star className="w-3 h-3 fill-current" />
                      Blue Badge (#016EA6)
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">Pathway 2</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Rating-Based Professional</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    For professionals without formal certifications. Qualify through average ratings (≥ 4.5) and completed jobs (≥ 10).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(true)}
                  className="mt-5 w-full rounded-xl bg-white border border-[#016EA6] text-[#016EA6] hover:bg-sky-50 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Check Rating Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Category B: Company / Employer Verified */}
              <div className="rounded-2xl border border-amber-150 p-5 bg-amber-50/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#fdf6e7] text-[#D69A16]">
                      <Building2 className="w-3 h-3" />
                      Gold Badge (#D69A16)
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">Corporate</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Company & Employer</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    For registered companies and employers. Verified via CAC certificates and corporate identity evidence.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(true)}
                  className="mt-5 w-full rounded-xl bg-[#D69A16] hover:bg-amber-600 text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Apply for Company Badge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category C: Government Agency Banner */}
            <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#73777D] text-white flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      Government Institutional Accreditation
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#f1f2f3] text-[#73777D]">
                      Ash/Grey Badge (#73777D)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Official accreditation for ministries, departments, and government bodies. Requires institutional administrative validation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGovernmentModalOpen(true)}
                className="shrink-0 rounded-xl px-4 py-2 text-xs font-bold border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition"
              >
                Institutional Verification
              </button>
            </div>
          </div>

          {/* Standard Stepper Cards */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Core Identity & Financial Enrollment
            </h3>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {[
                {
                  icon: UserRound,
                  title: "Verify Your Information",
                  description:
                    "Get your personal details and government ID verified to build platform trust.",
                  step: "identity",
                  isCompleted: isIdentityCompleted,
                  isLocked: false,
                },
                {
                  icon: Layers3,
                  title: "Professional Profile",
                  description:
                    "Confirm your trade, experience, and service categories to strengthen your profile.",
                  step: "professional",
                  isCompleted: isProfessionalCompleted,
                  isLocked: !isIdentityCompleted,
                },
                {
                  icon: CreditCard,
                  title: "Payout Verification",
                  description:
                    "Add and confirm your bank account so contract earnings are disbursed safely.",
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
                    Step Duration: 1 min
                  </span>

                  <h4 className="mt-3 text-sm font-bold text-gray-900">{title}</h4>

                  <p className="mt-1 text-xs leading-relaxed text-[#85898b]">
                    {description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-[#85898b]">
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

        {/* Modals */}
        <CertificationPathwayModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          onSubmitSuccess={(certData) => {
            setLocalUserOverrides((prev) => ({
              ...prev,
              certification_status: "pending",
              certification: certData,
            }));
          }}
        />

        <RatingPathwayModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          metrics={{
            rating: activeUser.rating || 4.9,
            completedJobs: activeUser.completedJobs || 12,
            totalReviews: activeUser.totalReviews || 8,
          }}
          onSubmitSuccess={(ratingData) => {
            setLocalUserOverrides((prev) => ({
              ...prev,
              rating_application: ratingData,
            }));
          }}
        />

        <CompanyVerificationModal
          isOpen={isCompanyModalOpen}
          onClose={() => setIsCompanyModalOpen(false)}
          onSubmitSuccess={(companyData) => {
            setLocalUserOverrides((prev) => ({
              ...prev,
              company_verification: companyData,
            }));
          }}
        />

        <GovernmentVerificationModal
          isOpen={isGovernmentModalOpen}
          onClose={() => setIsGovernmentModalOpen(false)}
          onSubmitSuccess={(govData) => {
            setLocalUserOverrides((prev) => ({
              ...prev,
              government_verification: govData,
            }));
          }}
        />

        <BadgeMaintenanceModal
          isOpen={isMaintenanceModalOpen}
          onClose={() => setIsMaintenanceModalOpen(false)}
          user={activeUser}
          onRenewSuccess={(renewedUser) => {
            setLocalUserOverrides((prev) => ({
              ...prev,
              ...renewedUser,
            }));
          }}
        />
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
