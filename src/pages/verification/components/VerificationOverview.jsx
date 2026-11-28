import {
  CreditCard,
  Layers3,
  UserRound,
} from "lucide-react";
import VerificationFormIllustration from "../../../assets/images/verification_form_illustration.png";

const VerificationOverview = ({
  completedSteps,
  overallStatus,
  rejectionReason,
  rejectedStep,
  setView,
}) => {
  const isIdentityCompleted = completedSteps.includes("identity");
  const isProfessionalCompleted = completedSteps.includes("professional");
  const isFaceCompleted = completedSteps.includes("face");
  const isPaymentCompleted = completedSteps.includes("payment");

  const cards = [
    {
      icon: UserRound,
      title: "Verify Your Information",
      description: "Get your details verified to create a trusted profile and start reaching out to clients.",
      step: "identity",
      isCompleted: isIdentityCompleted,
      isLocked: false,
    },
    {
      icon: Layers3,
      title: "Professional Profile",
      description: "Confirm your skills and credentials to strengthen your profile and connect with clients.",
      step: "professional",
      isCompleted: isProfessionalCompleted,
      isLocked: !isIdentityCompleted,
    },
    {
      icon: CreditCard,
      title: "Payment Verification",
      description: "Add and confirm your payment information so we can process your earnings safely and securely.",
      step: "payment",
      isCompleted: isPaymentCompleted,
      isLocked: !isIdentityCompleted || !isProfessionalCompleted,
    },
  ];

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

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:items-start sm:justify-between sm:gap-5">
          <div className="min-w-0">
            <h1 className="text-[clamp(1.75rem,4vw,2.35rem)] leading-tight font-extrabold text-gray-900">
              Holla! Let&apos;s Get You Verified
            </h1>
            <p className="mt-2 max-w-[570px] text-sm leading-relaxed text-[#777b7d]">
              Complete your verification to unlock more opportunities, build trust with clients, and start receiving verified job requests on Linkprosoft.
            </p>
          </div>
          <img src={VerificationFormIllustration} alt="" className="w-20 shrink-0 object-contain sm:w-[150px]" />
        </div>

        <div className="pt-2">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {cards.map(({ icon: Icon, title, description, step, isCompleted, isLocked }) => {
              const continueFaceVerification = step === "payment" && !isFaceCompleted;
              return (
                <article key={title} className={`flex min-h-[220px] min-w-0 flex-col rounded-2xl border p-5 transition ${isLocked ? "border-[#e7e8e8] bg-[#fafafa] opacity-60" : "border-[#e7e8e8] bg-white"}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef8fc] text-[#0879aa]"><Icon size={22} /></div>
                  <span className="mt-5 w-fit rounded-md bg-[#eaf3f6] px-2.5 py-0.5 text-[10px] text-[#555b5e]">Duration: 1 min</span>
                  <h4 className="mt-3 text-sm font-bold text-gray-900">{title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#85898b]">{description}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-[#85898b]">
                    <button type="button" disabled={isLocked} className="text-[#85898b] transition hover:text-[#0879aa] disabled:cursor-not-allowed disabled:opacity-50">
                      Learn more&nbsp; &#8250;
                    </button>
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => !isLocked && setView(continueFaceVerification ? "face" : step)}
                      className={`rounded-full px-4 py-2 text-[10px] text-white transition ${isLocked ? "cursor-not-allowed bg-gray-300" : "bg-[#0879aa] hover:bg-[#076b97] cursor-pointer"}`}
                    >
                      {isCompleted ? "Edit Step" : isLocked ? "Locked" : continueFaceVerification ? "Continue Step" : "Start Step"}
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
};

export default VerificationOverview;
