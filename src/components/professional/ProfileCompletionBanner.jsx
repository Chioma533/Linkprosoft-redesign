import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { calculateProfileCompletion } from "../../utils/profileCompletion";
import { profileService } from "../../api/services/profileService";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";

/**
 * Persistent Profile Completion Banner
 * Styled to exactly match the Figma design (reversed theme: #016EA6 blue background,
 * clean white typography, bright green progress fill, and white action pill).
 *
 * Rules:
 * - No cancel / [X] button.
 * - Stays persistently visible until the profile is 100% completed.
 * - No unnecessary icons in tags or buttons.
 */
const ProfileCompletionBanner = ({
  user: userProp,
  profileData: profileDataProp,
  skills: skillsProp,
  portfolio: portfolioProp,
  onNavigateToProfile,
  className = "",
}) => {
  const { user: authUser } = useAuthStore();
  const { setActiveTab, setHighlightSection } = useDashboardStore();
  const effectiveUser = userProp || authUser;
  const userId = effectiveUser?.id || effectiveUser?.userId || effectiveUser?.data?.id;

  const [profileData, setProfileData] = useState(profileDataProp || null);
  const [skills, setSkills] = useState(skillsProp || []);
  const [portfolio, setPortfolio] = useState(portfolioProp || []);
  const [isLoaded, setIsLoaded] = useState(Boolean(profileDataProp && skillsProp));

  // Fetch real profile data, skills, and portfolio if not passed directly via props
  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        const [profileRes, skillsRes, portfolioRes] = await Promise.allSettled([
          profileDataProp ? Promise.resolve(profileDataProp) : profileService.getMyProfile(),
          skillsProp ? Promise.resolve(skillsProp) : (userId ? profileService.getUserSkills(userId) : Promise.resolve([])),
          portfolioProp ? Promise.resolve(portfolioProp) : (userId ? profileService.getPortfolio(userId) : Promise.resolve([])),
        ]);

        if (isMounted) {
          if (profileRes.status === "fulfilled" && profileRes.value) {
            setProfileData(profileRes.value);
          }
          if (skillsRes.status === "fulfilled" && Array.isArray(skillsRes.value)) {
            setSkills(skillsRes.value);
          }
          if (portfolioRes.status === "fulfilled" && Array.isArray(portfolioRes.value)) {
            setPortfolio(portfolioRes.value);
          }
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn("Could not load profile completion data:", err.message);
        if (isMounted) setIsLoaded(true);
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [userId, profileDataProp, skillsProp, portfolioProp]);

  const completion = calculateProfileCompletion({
    user: effectiveUser,
    profileData,
    skills,
    portfolio,
  });

  // The ONLY condition for the modal to disappear is when the user's profile is completed (100%)
  if (!isLoaded || completion.isComplete) {
    return null;
  }

  const { percentage, missingItems } = completion;

  const handleNavigateToSection = (sectionId) => {
    if (sectionId) {
      setHighlightSection(sectionId);
    }
    if (onNavigateToProfile) {
      onNavigateToProfile(sectionId);
    } else {
      setActiveTab("profile");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-[24px] bg-[#016EA6] p-6 sm:p-8 shadow-md text-white ${className}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left section: Icon + Info + Progress Bar + Next up */}
          <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1">
            {/* Outline User Icon (no background box, exact match to Figma) */}
            <div className="shrink-0 pt-0.5">
              <FiUser className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.75]" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Header Titles */}
              <h3 className="text-base sm:text-[18px] font-semibold text-white tracking-tight leading-snug">
                Complete your Professional Profile
              </h3>
              <p className="text-xs sm:text-[13px] text-white/85 font-normal mt-1 leading-relaxed">
                Profiles with full portfolios and verified skills received up to 4x more job invitations
              </p>

              {/* Progress Bar + Percentage Row */}
              <div className="mt-3.5 flex items-center gap-4 sm:gap-6">
                <div className="w-full max-w-[440px] h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-[#18d552] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="text-xl sm:text-[24px] font-normal text-white shrink-0 leading-none">
                  {percentage}%
                </span>
              </div>

              {/* Next Up Tags (bordered, clickable, redirects to specific profile section) */}
              {missingItems.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white">
                  <span className="font-medium text-white/95">Next up:</span>
                  {missingItems.slice(0, 3).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleNavigateToSection(item.id)}
                      title={`Go to ${item.label}`}
                      className="border border-[#64a6c8] hover:border-white hover:bg-white/10 active:scale-95 text-white text-[11px] sm:text-[12px] px-2.5 py-0.5 rounded-[4px] font-normal leading-normal transition-all cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Button: Clean White Pill, no unnecessary icons */}
          <div className="shrink-0 self-start lg:self-center pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => handleNavigateToSection(missingItems[0]?.id || "profile")}
              className="bg-white text-gray-900 font-medium text-sm sm:text-[15px] px-7 py-3 rounded-full hover:bg-white/95 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              Update your Profile
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileCompletionBanner;
