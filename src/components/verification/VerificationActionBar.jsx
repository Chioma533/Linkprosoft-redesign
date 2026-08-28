import { ArrowRight } from "lucide-react";

const VerificationActionBar = ({
  onBack,
  onContinue,
  backLabel = "Save as draft",
  continueLabel = "Save and continue",
}) => (
  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-5">
    <button
      type="button"
      onClick={onBack}
      className="h-10 rounded-full border border-[#e8e8e8] px-10 text-xs text-[#777b7d] hover:border-[#0879aa]"
    >
      {backLabel}
    </button>

    <button
      type="button"
      onClick={onContinue}
      className="h-10 rounded-full bg-[#0879aa] px-10 text-xs text-white hover:bg-[#076b97]"
    >
      {continueLabel}

      <ArrowRight size={14} className="ml-2 inline" />
    </button>
  </div>
);

export default VerificationActionBar;