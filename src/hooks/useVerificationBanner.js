import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { isUserVerified } from "../utils/dashboardNavbar.js";

const SESSION_STORAGE_KEY = "lps_verification_banner_dismissed";

/**
 * Hook to manage persistent verification banner status across sessions.
 * Banner re-appears on every new browser session until user is verified.
 */
export const useVerificationBanner = () => {
  const { user } = useAuthStore();

  const isVerified = isUserVerified(user);

  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Re-check sessionStorage on mount
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
      setIsDismissed(dismissed);
    } catch {
      setIsDismissed(false);
    }
  }, []);

  const dismissVerification = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch (e) {
      console.warn("Could not write to sessionStorage:", e);
    }
    setIsDismissed(true);
  }, []);

  const resetDismissal = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn("Could not write to sessionStorage:", e);
    }
    setIsDismissed(false);
  }, []);

  // Show banner if the user is NOT verified and hasn't dismissed it in the current session
  const showBanner = !isVerified && !isDismissed;

  return {
    isVerified,
    showBanner,
    dismissVerification,
    resetDismissal,
  };
};

export default useVerificationBanner;
