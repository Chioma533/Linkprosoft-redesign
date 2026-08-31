import React from "react";

const VerificationActionBar = ({
  onBack,
  onContinue,
  backLabel = "Save as draft",
  continueLabel = "Save and continue",
  isLoading = false,
  isContinueDisabled = false,
  showBack = true,
}) => (
  <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-4">
    {showBack && onBack && (
      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className="h-10 w-full sm:w-auto rounded-full border border-[#e8e8e8] px-10 text-xs text-[#777b7d] transition hover:border-[#0879aa] disabled:opacity-50"
      >
        {backLabel}
      </button>
    )}

    <button
      type="button"
      onClick={onContinue}
      disabled={isLoading || isContinueDisabled}
      className="h-10 w-full sm:w-auto rounded-full bg-[#0879aa] px-10 text-xs text-white transition hover:bg-[#076b97] disabled:opacity-50"
    >
      {isLoading ? "Saving..." : continueLabel}
    </button>
  </div>
);

export default VerificationActionBar;