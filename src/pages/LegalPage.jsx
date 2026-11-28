import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const legalContent = {
  privacy: {
    title: "Privacy Policy",
    Icon: ShieldCheck,
    sections: [
      ["Account information", "We use account details to provide authentication, profile, messaging, payments, and support services."],
      ["Data use", "We process information to operate the platform, prevent fraud, communicate important updates, and improve service quality."],
      ["Sharing", "We share data only when needed to deliver a requested service, comply with legal obligations, or protect users and the platform."],
      ["Choices", "You can review and update profile information and use account settings to manage password and linked-account options."],
    ],
  },
  terms: {
    title: "Terms and Conditions",
    Icon: FileText,
    sections: [
      ["Use of Linkprosoft", "Users must provide accurate information and use the platform lawfully and respectfully."],
      ["Projects and payments", "Employers and professionals are responsible for the details, delivery, and acceptance of agreed work. Escrow rules apply where funded."],
      ["Disputes", "Disputes must include accurate information and supporting evidence. Platform decisions are subject to applicable moderation procedures."],
      ["Account responsibility", "Keep sign-in details secure and notify support promptly if you believe account access is compromised."],
    ],
  },
};

const LegalPage = ({ type }) => {
  const navigate = useNavigate();
  const content = legalContent[type] || legalContent.privacy;
  const Icon = content.Icon;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <button type="button" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0879A8]">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF5F8] text-[#0879A8]">
            <Icon className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-semibold text-gray-900">{content.title}</h1>
        </div>
        <div className="space-y-5">
          {content.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-sm font-semibold text-gray-900">{heading}</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LegalPage;
