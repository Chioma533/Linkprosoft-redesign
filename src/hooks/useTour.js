import { useState, useEffect, useCallback } from "react";
import { EMPLOYER_TOUR_STEPS, TOUR_STORAGE_KEY } from "../constants/tourSteps";

export const useTour = (steps = EMPLOYER_TOUR_STEPS, storageKey = TOUR_STORAGE_KEY) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  // Check if tour should auto-start on mount
  useEffect(() => {
    try {
      const completed = localStorage.getItem(storageKey);
      if (!completed) {
        // Small delay to allow initial DOM elements to mount and layout
        const timer = setTimeout(() => {
          setIsActive(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("Tour storage check error:", e);
    }
  }, [storageKey]);

  // Update target rect whenever step changes or window resizes
  const updateTargetRect = useCallback(() => {
    if (!isActive || !steps[currentStepIndex]) {
      setTargetRect(null);
      return;
    }

    const currentStep = steps[currentStepIndex];
    const el = document.querySelector(currentStep.target);

    if (el) {
      // Scroll into view if needed
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      });
    } else {
      setTargetRect(null);
    }
  }, [isActive, steps, currentStepIndex]);

  useEffect(() => {
    if (!isActive) return;

    // Give scroll time to settle, then capture rect
    const timer = setTimeout(updateTargetRect, 250);
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [isActive, currentStepIndex, updateTargetRect]);

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Finished
      setIsActive(false);
      try {
        localStorage.setItem(storageKey, "completed");
      } catch (e) {
        console.warn("Tour storage save error:", e);
      }
    }
  }, [currentStepIndex, steps.length, storageKey]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    try {
      localStorage.setItem(storageKey, "skipped");
    } catch (e) {
      console.warn("Tour storage save error:", e);
    }
  }, [storageKey]);

  const resetTour = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Tour storage remove error:", e);
    }
    setCurrentStepIndex(0);
    setIsActive(true);
  }, [storageKey]);

  return {
    isActive,
    currentStep: steps[currentStepIndex] || null,
    currentStepIndex,
    totalSteps: steps.length,
    targetRect,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    resetTour,
    updateTargetRect,
  };
};

export default useTour;
