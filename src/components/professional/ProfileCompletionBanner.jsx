import React, { useState } from "react";
import { FiCheckCircle, FiChevronRight, FiUserCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { calculateProfileCompletion } from "../../utils/profileCompletion";

const SESSION_STORAGE_KEY = "lps_profile_completion_banner_dismissed";

const ProfileCompletionBanner = ({
  user,
  profileData,
  skills = [],
  portfolio = [],
  onNavigateToProfile,
  className = "",
}) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const completion = calculateProfileCompletion({
    user,
    profileData,
    skills,
    portfolio,
  });

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch (e) {
      console.warn("Could not save dismissal state:", e);
    }
    setIsDismissed(true);
  };

  // If complete or dismissed for this session, render nothing
  if (completion.isComplete || isDismissed) {
    return null;
  }

  const { percentage, missingItems } = completion;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-blue-50/40 p-4 sm:p-5 shadow-sm ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Icon & Progress details */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#016EA6] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#016EA6]/20">
              <FiUserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                  Complete Your Professional Profile
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#016EA6] text-white shrink-0">
                  {percentage}% Done
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Profiles with full portfolios and verified skills receive up to 4× more job invitations.
              </p>

              {/* Progress Bar */}
              <div className="mt-2.5 w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#016EA6] to-[#0092DC] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Missing recommendations */}
              {missingItems.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-600">Next up:</span>
                  {missingItems.slice(0, 2).map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 font-medium"
                    >
                      <FiCheckCircle className="w-3 h-3 text-gray-400" />
                      {item.label}
                    </span>
                  ))}
                  {missingItems.length > 2 && (
                    <span className="text-gray-400">+{missingItems.length - 2} more</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={onNavigateToProfile}
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Update Profile</span>
              <FiChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss profile completion nudge for this session"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Dismiss"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileCompletionBanner;
