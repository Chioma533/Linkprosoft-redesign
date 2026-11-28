import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
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
  } = useVerification();

  const selfieObjectUrlRef = useRef(null);
  const selfieStreamRef = useRef(null);
  const selfieVideoRef = useRef(null);
  const currentViewRef = useRef(view);
  const isMountedRef = useRef(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  currentViewRef.current = view;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      selfieStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (selfieObjectUrlRef.current) URL.revokeObjectURL(selfieObjectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const video = selfieVideoRef.current;
    if (!isCameraActive || !video || !selfieStreamRef.current) return undefined;
    video.srcObject = selfieStreamRef.current;
    return () => {
      video.srcObject = null;
    };
  }, [isCameraActive]);

  useEffect(() => {
    if (view === "face") return;
    selfieStreamRef.current?.getTracks().forEach((track) => track.stop());
    selfieStreamRef.current = null;
    setIsCameraActive(false);
  }, [view]);

  const stopSelfieCamera = () => {
    selfieStreamRef.current?.getTracks().forEach((track) => track.stop());
    selfieStreamRef.current = null;
    setIsCameraActive(false);
  };

  const startSelfieCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Live camera access requires a supported browser on HTTPS or localhost.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: false,
      });
      if (!isMountedRef.current || currentViewRef.current !== "face") {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      selfieStreamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      if (!isMountedRef.current || currentViewRef.current !== "face") return;
      const message = error?.name === "NotAllowedError"
        ? "Camera access was denied. Allow camera access in your browser settings and try again."
        : error?.name === "NotFoundError"
        ? "No camera was found on this device."
        : "Unable to start the camera. Check your camera connection and permissions.";
      setCameraError(message);
    }
  };

  const captureSelfie = () => {
    const video = selfieVideoRef.current;
    if (!video?.videoWidth || !video.videoHeight) {
      setCameraError("The camera is starting. Please try capturing again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("This browser could not capture the selfie. Please try again.");
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    try {
      canvas.toBlob((blob) => {
        if (!isMountedRef.current || currentViewRef.current !== "face") return;
        if (!blob) {
          setCameraError("The selfie could not be captured. Please try again.");
          return;
        }

        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        if (selfieObjectUrlRef.current) URL.revokeObjectURL(selfieObjectUrlRef.current);
        const previewUrl = URL.createObjectURL(file);
        selfieObjectUrlRef.current = previewUrl;
        setSelfieBlob(file);
        setSelfieMediaId(null);
        setSelfiePreviewUrl(previewUrl);
        setSelfieCaptured(true);
        setCameraError("");
        stopSelfieCamera();
      }, "image/jpeg", 0.92);
    } catch {
      setCameraError("The selfie could not be captured. Please try again.");
    }
  };

  const clearSelfie = () => {
    if (selfieObjectUrlRef.current) {
      URL.revokeObjectURL(selfieObjectUrlRef.current);
      selfieObjectUrlRef.current = null;
    }
    setSelfieCaptured(false);
    setSelfieBlob(null);
    setSelfieMediaId(null);
    setSelfiePreviewUrl(null);
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
  const isFaceStep = view === "face";

  if (view === "overview") {
    const isIdentityCompleted = completedSteps.includes("identity");
    const isProfessionalCompleted = completedSteps.includes("professional");
    const isFaceCompleted = completedSteps.includes("face");
    const isPaymentCompleted = completedSteps.includes("payment");

    return (
      <main className="verification-page verification-overview-page min-h-screen bg-[#f7f7f7] px-4 py-6 text-[#171a1c] sm:px-8 sm:py-12">
        <section className="verification-shell mx-auto max-w-[960px] rounded-[28px] bg-white px-4 py-7 sm:px-12 sm:py-12 space-y-8">
          {overallStatus === "pending_review" && (
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-[#0879aa]">
              Your verification dossier is pending administrative review.
            </div>
          )}
          {overallStatus === "rejected" && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Verification was rejected{rejectedStep ? ` at the ${rejectedStep} step` : ""}.
              {rejectionReason ? ` Reason: ${rejectionReason}` : ""}
            </div>
          )}
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
              ].map(({ icon: Icon, title, description, step, isCompleted, isLocked }) => {
                const continueFaceVerification = step === "payment" && !isFaceCompleted;

                return (
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
                        onClick={() => !isLocked && setView(continueFaceVerification ? "face" : step)}
                        className={`rounded-full px-4 py-2 text-[10px] text-white transition ${
                          isLocked
                            ? "cursor-not-allowed bg-gray-300"
                            : "bg-[#0879aa] hover:bg-[#076b97] cursor-pointer"
                        }`}
                      >
                        {isCompleted
                          ? "Edit Step"
                          : isLocked
                          ? "Locked"
                          : continueFaceVerification
                          ? "Continue Step"
                          : "Start Step"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={`verification-page min-h-screen bg-[#f7f7f7] px-3 sm:px-8 ${isFaceStep ? "py-4 sm:py-6" : "py-5 sm:py-12"}`}>
      <section className={`verification-shell mx-auto max-w-[960px] rounded-[28px] bg-white ${isFaceStep ? "px-4 py-5 sm:px-12 sm:py-6" : "px-4 py-7 sm:px-12 sm:py-8"}`}>
        <VerificationProgress
          activeStep={stepNumber}
          completedSteps={completedSteps}
          highestReachedStep={highestReachedStep}
          onStepClick={handleStepClick}
        />

        <div className={isFaceStep ? "mt-5" : "mt-7"}>
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
                    placeholder="DD/MM/YY"
                    maxLength={8}
                    inputMode="numeric"
                    value={profile.dateOfBirth || ""}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                      let formatted = digits;
                      if (digits.length > 4) {
                        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
                      } else if (digits.length > 2) {
                        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                      }
                      updateProfile("dateOfBirth", formatted);
                    }}
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
                    value={profile.nationality || ""}
                    onChange={(e) => updateProfile("nationality", e.target.value)}
                    error={errors.nationality}
                  />
                </div>

                <VerificationPreview
                  profile={profile}
                  documentFile={idDocumentFile}
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
              />

              <div className="verification-panel mt-4 grid gap-3 rounded-2xl border border-[#e7e8e8] p-3 sm:h-[clamp(280px,44vh,390px)] sm:grid-cols-[1.2fr_.85fr] sm:gap-4 sm:p-4">
                <div className="relative h-[220px] overflow-hidden rounded-xl bg-[#f9fbfb] sm:h-full">
                  {isCameraActive ? (
                    <video
                      ref={selfieVideoRef}
                      autoPlay
                      playsInline
                      muted
                      aria-label="Live selfie camera"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ) : (
                    <img
                      src={selfieImage}
                      alt="Face verification camera guide"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-900/10" />
                  <button
                    type="button"
                    onClick={isCameraActive ? captureSelfie : startSelfieCamera}
                    className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#171a1c] shadow-md transition hover:bg-[#f1f8fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0879aa]"
                  >
                    <Camera size={17} className="text-[#0879aa]" />
                    <span>
                      {isCameraActive
                        ? "Capture Selfie"
                        : selfieCaptured
                        ? "Retake Selfie"
                        : "Take Selfie"}
                    </span>
                  </button>
                  {isCameraActive && (
                    <button
                      type="button"
                      onClick={stopSelfieCamera}
                      aria-label="Close live camera"
                      className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-[#424648] shadow transition hover:bg-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                  {(cameraError || errors.selfie) && (
                    <p role="alert" className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 px-3 py-2 text-center text-xs text-rose-600">
                      {cameraError || errors.selfie}
                    </p>
                  )}
                </div>

                <aside className="flex h-[220px] min-h-0 flex-col rounded-xl bg-[#fafafa] p-3 sm:h-full sm:p-4">
                  <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
                    <span className="text-sm text-[#424648]">Preview</span>
                    {selfiePreviewUrl && (
                      <button
                        type="button"
                        onClick={clearSelfie}
                        aria-label="Remove selfie"
                        className="rounded-full p-1 text-[#787d80] transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="mt-3 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-white">
                    {selfiePreviewUrl ? (
                      <img
                        src={selfiePreviewUrl}
                        alt="Selected selfie preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 px-4 text-center text-[#85898b]">
                        <Camera size={30} className="text-[#9cbac7]" />
                        <p className="text-xs">Your selfie preview will appear here</p>
                      </div>
                    )}
                  </div>
                </aside>
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
                    {bankError && (
                      <p className="text-[10px] text-rose-500 mt-1">{bankError}</p>
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

                    <VerificationField
                      label="Set payment password"
                      optional
                      type="password"
                      autoComplete="new-password"
                      placeholder="Enter password"
                      value={profile.paymentPassword || ""}
                      onChange={(e) => updateProfile("paymentPassword", e.target.value)}
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
