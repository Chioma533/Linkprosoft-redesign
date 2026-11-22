import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TourTooltip from "./TourTooltip";
import useTour from "../../hooks/useTour";
import { EMPLOYER_TOUR_STEPS } from "../../constants/tourSteps";

const SpotlightTour = ({
  steps = EMPLOYER_TOUR_STEPS,
  tourHook,
}) => {
  const defaultHook = useTour(steps);
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    targetRect,
    nextStep,
    prevStep,
    skipTour,
  } = tourHook || defaultHook;

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99990] overflow-hidden pointer-events-auto"
        aria-modal="true"
        role="dialog"
      >
        {/* Semi-transparent backdrop when targetRect is not yet ready */}
        {!targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={skipTour}
          />
        )}

        {/* Dynamic Spotlight Cutout Box */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              top: targetRect.top - 6,
              left: targetRect.left - 6,
              width: targetRect.width + 12,
              height: targetRect.height + 12,
            }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
            }}
            style={{
              position: "fixed",
              borderRadius: "18px",
              boxShadow: "0 0 0 9999px rgba(10, 20, 30, 0.65)",
              pointerEvents: "none",
              border: "2px solid rgba(1, 110, 166, 0.8)",
            }}
          >
            {/* Subtle pulse ring around active spotlight element */}
            <span className="absolute -inset-1 rounded-[20px] border border-[#016EA6] opacity-75 animate-ping pointer-events-none" />
          </motion.div>
        )}

        {/* Floating Tooltip */}
        <TourTooltip
          step={currentStep}
          stepIndex={currentStepIndex}
          totalSteps={totalSteps}
          targetRect={targetRect}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
        />
      </div>
    </AnimatePresence>
  );
};

export default SpotlightTour;
