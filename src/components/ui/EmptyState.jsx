import React from "react";
import { FiArrowRight } from "react-icons/fi";

/**
 * Reusable, modern EmptyState component.
 * Fully backwards-compatible with previous { title } usage,
 * while supporting icons, descriptions, and CTA buttons.
 */
const EmptyState = ({
  icon: Icon,
  title = "No data found",
  description = "",
  actionLabel = "",
  onAction,
  actionIcon: ActionIcon = FiArrowRight,
  secondaryActionLabel = "",
  onSecondaryAction,
  className = "",
  compact = false,
}) => {
  return (
    <div
      className={`col-span-full w-full rounded-2xl md:rounded-3xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/70 to-white flex flex-col items-center justify-center text-center ${
        compact ? "py-8 px-4" : "py-14 px-6 sm:px-8"
      } ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center mb-3 shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      )}

      {title && (
        <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
          {title}
        </h4>
      )}

      {description && (
        <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-md mb-5 leading-relaxed">
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}

          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer active:scale-95"
            >
              <span>{actionLabel}</span>
              {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
