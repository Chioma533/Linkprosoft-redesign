import React, { useMemo } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const TourTooltip = ({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrev,
  onSkip,
}) => {
  // Calculate position: default is below targetRect, fallback to above if near viewport bottom
  const position = useMemo(() => {
    if (!targetRect) return { top: 0, left: 0, width: 320 };

    const tooltipWidth = Math.min(360, window.innerWidth - 32);
    const tooltipHeight = 180;
    const padding = 12;

    let top = targetRect.bottom + padding;
    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

    // Boundary constraints horizontally
    if (left < 16) left = 16;
    if (left + tooltipWidth > window.innerWidth - 16) {
      left = window.innerWidth - tooltipWidth - 16;
    }

    // Boundary constraints vertically: if tooltip would overflow bottom, place it above
    if (top + tooltipHeight > window.innerHeight - 16) {
      top = Math.max(16, targetRect.top - tooltipHeight - padding);
    }

    return { top, left, width: tooltipWidth };
  }, [targetRect]);

  if (!step || !targetRect) return null;

  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 6 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        zIndex: 99999,
      }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-5 pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#016EA6] bg-[#016EA6]/10 px-2.5 py-0.5 rounded-full">
          Step {stepIndex + 1} of {totalSteps}
        </span>

        <button
          type="button"
          onClick={onSkip}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors cursor-pointer"
          title="Skip Tour"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 leading-snug">
        {step.title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mb-4">
        {step.description}
      </p>

      {/* Step Indicators & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === stepIndex
                  ? "w-5 bg-[#016EA6]"
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Previous Step"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#016EA6] hover:bg-[#061EA6] text-white text-xs font-bold rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>{isLastStep ? "Got it!" : "Next"}</span>
            {isLastStep ? <FiCheck className="w-3.5 h-3.5" /> : <FiArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourTooltip;
