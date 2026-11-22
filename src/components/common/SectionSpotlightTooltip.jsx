import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTION_CONFIGS = {
  avatar: {
    badge: "Profile Photo",
    title: "Update Your Profile Photo",
    description: "Click your avatar to upload a clear professional headshot so clients can recognize and trust you.",
    actionText: "Upload Photo",
  },
  bio: {
    badge: "About Me / Bio",
    title: "Add a Professional Bio",
    description: "Share your years of trade experience, craftsmanship standards, and specialties to win client proposals.",
    actionText: "Edit Bio",
  },
  skills: {
    badge: "Skills & Services",
    title: "Register Your Skills",
    description: "Add your trade services and proficiency levels so you match client requests in search results.",
    actionText: "Add Skill",
  },
  location: {
    badge: "Service Location",
    title: "Specify Your Location",
    description: "Set your operating city and state so nearby employers and home owners can hire you locally.",
    actionText: "Set Location",
  },
  portfolio: {
    badge: "Portfolio & Projects",
    title: "Showcase Your Past Work",
    description: "Upload photos and descriptions of your completed projects to prove the quality of your workmanship.",
    actionText: "Add Project",
  },
};

/**
 * SectionSpotlightTooltip
 * Renders a floating tooltip anchored to a highlighted profile section with an active blue border.
 */
const SectionSpotlightTooltip = ({
  sectionKey,
  targetSelector,
  onAction,
  onDismiss,
}) => {
  const [targetRect, setTargetRect] = useState(null);
  const config = SECTION_CONFIGS[sectionKey] || {
    badge: "Profile Section",
    title: "Complete This Section",
    description: "Complete this section to bring your profile to 100% and receive more job proposals.",
    actionText: "Open Editor",
  };

  const updateRect = () => {
    if (!targetSelector) return;
    const el = document.querySelector(targetSelector);
    if (el) {
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
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateRect, 200);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [sectionKey, targetSelector]);

  // Position calculation
  const position = useMemo(() => {
    if (!targetRect) return { top: 0, left: 0, width: 340 };

    const tooltipWidth = Math.min(380, window.innerWidth - 32);
    const tooltipHeight = 170;
    const padding = 12;

    let top = targetRect.bottom + padding;
    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

    // Horizontal boundary
    if (left < 16) left = 16;
    if (left + tooltipWidth > window.innerWidth - 16) {
      left = window.innerWidth - tooltipWidth - 16;
    }

    // Vertical boundary: if overflowing bottom, position above target
    if (top + tooltipHeight > window.innerHeight - 16) {
      top = Math.max(16, targetRect.top - tooltipHeight - padding);
    }

    return { top, left, width: tooltipWidth };
  }, [targetRect]);

  if (!sectionKey || !targetRect) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          zIndex: 9999,
        }}
        className="bg-white rounded-2xl shadow-2xl border-2 border-[#016EA6] p-4 sm:p-5 pointer-events-auto"
      >
        {/* Step Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#016EA6] bg-[#016EA6]/10 px-2.5 py-0.5 rounded-full">
            {config.badge}
          </span>
          <span className="inline-flex h-2 w-2 rounded-full bg-[#016EA6] animate-ping" />
        </div>

        {/* Title & Guidance */}
        <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1 leading-snug">
          {config.title}
        </h4>
        <p className="text-xs text-gray-500 font-normal leading-relaxed mb-4">
          {config.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onDismiss}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            Got it
          </button>

          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#016EA6] hover:bg-[#061EA6] text-white text-xs font-bold rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{config.actionText}</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SectionSpotlightTooltip;
