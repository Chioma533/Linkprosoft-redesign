import React from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProfessionalHero = ({ verificationDismissed, onDismissVerification }) => {
  return (
    <section
      id="professional-hero-section"
      className="bg-[#EEF5F9] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          {/* Left: headline + verification banner */}
          <div className="flex-1 max-w-full sm:max-w-xl">
            <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
              Find Your Next Opportunity
            </h1>

            <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
              Looking for jobs? Browse openings curated specifically for your
              skillset
            </p>

            {/* Mobile verification banner + illustration */}
            {!verificationDismissed && (
              <div className="mt-0 flex items-end justify-between gap-2 sm:hidden z-10">
                <div
                  id="verification-banner"
                  className="w-62 shrink-0 rounded-md border border-[#ff8d28]/30 bg-[#fff4ea] py-2.5 px-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <FiAlertCircle className="h-3 w-3 shrink-0 translate-y-[0.5px] text-orange-500" />

                      <p className="text-[7.14px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#59310e]">
                        Verification Required
                      </p>
                    </div>
                  </div>

                  <div className="mt-0 ml-1.5 flex items-center justify-between gap-1.5">
                    <p className="flex-1 min-w-0 ml-3 self-center text-[5.5px] leading-[1.1] tracking-[-0.01em] text-[#ff8d28]">
                      Complete your verification to apply for jobs and receive
                      payments securely.
                    </p>

                    <Link
                      id="complete-verification-btn"
                      to="/verification"
                      className="inline-flex -translate-y-1 h-3.75 min-w-16 shrink-0 items-center justify-center rounded-full bg-orange-500 px-1 text-[4.71px] font-bold leading-none text-white transition-all duration-200 hover:bg-orange-600"
                    >
                      Complete Verification
                    </Link>
                  </div>
                </div>

                <div
                  className="w-[43%] z-0"
                  style={{ mixBlendMode: "multiply" }}
                >
                  <img
                    src="/tools_bucket_illustration.png"
                    alt="Construction Tools"
                    className="w-full object-contain translate-y-2 translate-x-6.25"
                  />
                </div>
              </div>
            )}

            {/* Desktop verification banner */}
            {!verificationDismissed && (
              <div className="hidden sm:block">
                <div
                  id="verification-banner"
                  className="mt-6 flex max-w-md items-center gap-3 rounded-xl border border-[#ff8d28]/30 bg-[#fff4ea] p-3 px-5 py-4"
                >
                  <FiAlertCircle className="h-5 w-5 shrink-0 text-orange-500" />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#59310e]">
                      Verification Required
                    </p>

                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#ff8d28]">
                      Complete your verification to apply for jobs and receive
                      payments securely.
                    </p>
                  </div>

                  <Link
                    id="complete-verification-btn"
                    to="/verification"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-orange-500 px-3.5 py-2 text-[10px] font-bold text-white transition-all duration-200 hover:bg-orange-600"
                  >
                    Complete Verification
                  </Link>

                  <button
                    id="dismiss-verification-btn"
                    onClick={onDismissVerification}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:text-gray-700"
                    aria-label="Dismiss verification banner"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Tools bucket illustration */}
          <div
            className="hidden sm:flex sm:shrink-0 sm:w-64 sm:max-w-xs sm:items-end sm:justify-center"
            style={{ mixBlendMode: "multiply" }}
          >
            <img
              src="/tools_bucket_illustration.png"
              alt="Construction Tools"
              className="w-full object-contain sm:translate-y-25 lg:w-72"
            />
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#016EA6]/20 to-transparent" />
    </section>
  );
};

export default ProfessionalHero;
