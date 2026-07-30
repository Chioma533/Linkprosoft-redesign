import React from "react";

const NavButtons = ({ onBack, onContinue, continueLabel = "Continue", disableContinue = false }) => (
  <div className="flex items-center gap-4 mt-8">
    <button
      type="button"
      onClick={onBack}
      className="flex-1 sm:flex-none sm:w-40 px-6 py-3.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer"
    >
      Go back
    </button>
    <button
      type="button"
      onClick={onContinue}
      disabled={disableContinue}
      className={`flex-1 sm:flex-none sm:w-52 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer ${
        disableContinue
          ? "bg-gray-200 cursor-not-allowed"
          : "bg-[#016EA6] hover:bg-[#061EA6] shadow-sm hover:shadow-md active:scale-[0.98]"
      }`}
    >
      {continueLabel}
    </button>
  </div>
);

export default NavButtons;
