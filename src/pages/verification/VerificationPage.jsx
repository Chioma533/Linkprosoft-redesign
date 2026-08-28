import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  CreditCard,
  Eye,
  Layers3,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import selfieImage from "../../assets/images/faceverification_illustration.jpg";
import VerificationHeader from "../../components/verification/VerificationHeader";
import VerificationProgress from "../../components/verification/VerificationProgress";
import VerificationField from "../../components/verification/VerificationField";
import VerificationPreview from "../../components/verification/VerificationPreview";
import VerificationActionBar from "../../components/verification/VerificationActionBar";
import IdentityIllustration from "../../assets/images/identity-verification_illustration.png";
import ProfessionalIllustration from "../../assets/images/profession-verification_illustration.png";
import PaymentIllustration from "../../assets/images/payment-verification_illustration.png";
import PreviewIllustration from "../../assets/images/preview-verification_illustration.png";
import ProfessionalVerification from "../../components/verification/ProfessionalVerification";

const profile = {
  firstName: "Marvellous",
  lastName: "Oluwaseun",
  phone: "+2349066760056",
  dateOfBirth: "July 09 2002",
  address: "No 2 Aremu Olatunbosun",
  nationality: "Nigerian",
};

const VerificationPage = () => {
  const [view, setView] = useState("overview");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

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

  const begin = () => setView("identity");

  const finish = () => {
    setShowSuccess(true);
    toast.success("Your verification has been submitted.");
  };

  if (view === "overview") {
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
              className="hidden shrink-0 text-[#0879aa] sm:block"
            />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                UserRound,
                "Verify Your Information",
                "Get your details verified to create a trusted profile and start reaching to clients.",
              ],
              [
                Layers3,
                "Professional Verification",
                "Confirm your skills and credentials to strengthen your profile and connect with clients.",
              ],
              [
                CreditCard,
                "Payment Verification",
                "Add and confirm your payment information so we can process your earnings safely and securely.",
              ],
            ].map(([Icon, title, description]) => (
              <article
                key={title}
                className="flex min-h-[250px] flex-col rounded-2xl border border-[#e7e8e8] p-5"
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
                    onClick={begin}
                    className="rounded-full bg-[#0879aa] px-4 py-2 text-[10px] text-white"
                  >
                    Start Verification
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
        <VerificationProgress activeStep={stepNumber} />

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
                  />

                  <VerificationField
                    label="Last Name"
                    placeholder="Enter name"
                  />

                  <VerificationField
                    label="Phone Number"
                    placeholder="(+234)"
                  />

                  <VerificationField
                    label="Date of birth"
                    placeholder="Enter date"
                  />

                  <VerificationField
                    label="Residential Address"
                    placeholder="Enter address"
                  />

                  <VerificationField
                    label="Nationality"
                    placeholder="Enter name"
                  />

                  <label className="sm:col-span-2 text-xs text-[#44484a]">
                    Upload ID
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setUploadedFile(event.target.files?.[0]?.name || null)
                      }
                      className="mt-2 block h-20 w-full cursor-pointer rounded-xl border border-[#e7e8e8] px-4 py-7 text-xs text-[#85898b] file:hidden"
                    />
                    {uploadedFile && (
                      <span className="mt-1 block text-[10px] text-[#0879aa]">
                        {uploadedFile}
                      </span>
                    )}
                  </label>
                </div>
                <VerificationPreview profile={profile} />
              </div>

              <VerificationActionBar
                onBack={() => setView("overview")}
                onContinue={() => setView("professional")}
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
                onBack={() => setView("identity")}
                onContinue={() => setView("face")}
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
                    src={selfieImage}
                    alt="Selfie verification preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-8 top-1/2 h-32 -translate-y-1/2 rounded-[48%] border-2 border-[#52d6e8]" />

                  <button
                    type="button"
                    onClick={() => setSelfieCaptured(true)}
                    className="absolute bottom-5 rounded-full bg-white px-5 py-3 text-xs text-[#242729]"
                  >
                    <Camera size={15} className="mr-2 inline" />

                    {selfieCaptured ? "Selfie captured" : "Take Selfie"}
                  </button>
                </div>

                <div className="flex min-h-[300px] flex-col rounded-2xl bg-[#fafafa] p-5 sm:min-h-[380px]">
                  <div className="flex items-center justify-between border-b border-[#ececec] pb-4 text-sm text-[#424648]">
                    Preview
                    <X size={16} className="text-[#787d80]" />
                  </div>

                  <div className="flex flex-1 items-center justify-center py-5">
                    <img
                      src={selfieImage}
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
                onContinue={() => setView("payment")}
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
                  <VerificationField
                    label="Bank Name"
                    placeholder="Enter bank name"
                  />

                  <VerificationField
                    label="Account Number"
                    placeholder="Enter number"
                  />

                  <VerificationField
                    label="Set payment password"
                    optional
                    placeholder="Enter password"
                    type="password"
                  />

                  <VerificationField
                    label="BVN"
                    optional
                    placeholder="Enter name"
                  />
                </div>
                <VerificationPreview profile={profile} compact />
              </div>

              <VerificationActionBar
                onBack={() => setView("face")}
                onContinue={() => setView("review")}
              />
            </>
          )}

          {view === "review" && (
            <>
              <VerificationHeader
                title="Preview"
                description="Kindly review the information that you have provided. Meanwhile you can always edit on the profile section."
                image={PreviewIllustration}
              />

              <div className="mt-6 rounded-2xl border border-[#e7e8e8] p-3 sm:p-5">
                <div className="rounded-2xl bg-[#fafafa] p-5 sm:p-8">
                  <VerificationPreview profile={profile} compact />
                </div>
              </div>

              <VerificationActionBar
                onBack={() => setView("payment")}
                onContinue={finish}
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
              to="/"
              className="mt-6 block rounded-full bg-[#0879aa] py-3 text-xs text-white"
            >
              View profile
            </Link>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-2 w-full rounded-full bg-[#fafafa] py-3 text-xs text-[#4d5254]"
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
