import React from "react";

const NavButtons = ({
  onBack,
  onContinue,
  continueLabel = "Continue",
  disableContinue = false,
  isSubmitting = false,
}) => (
  <div className="flex items-center gap-4 mt-8">
    <button
      type="button"
      onClick={onBack}
      disabled={isSubmitting}
      className="flex-1 sm:flex-none sm:w-40 px-6 py-3.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer disabled:opacity-50"
    >
      Go back
    </button>
    <button
      type="button"
      onClick={onContinue}
      disabled={disableContinue || isSubmitting}
      className={`flex-1 sm:flex-none sm:w-52 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer ${
        disableContinue || isSubmitting
          ? "bg-gray-200 cursor-not-allowed"
          : "bg-[#016EA6] hover:bg-[#061EA6] shadow-sm hover:shadow-md active:scale-[0.98]"
      }`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Posting...
        </span>
      ) : (
        continueLabel
      )}
    </button>
  </div>
);

export default NavButtons;

