import React from "react";
import { BadgeCheck, Building2, Landmark, Check } from "lucide-react";
import { getVerificationBadge } from "../../utils/verificationBadge";

/**
 * Three-tier VerificationBadge component for LinkProSoft.
 *
 * Tiers:
 * 1. Professional: Blue (#016EA6)
 * 2. Company / Employer: Gold (#D69A16)
 * 3. Government Agency: Ash/Grey (#73777D)
 *
 * Strict Rule: Returns null if user is unverified or maintenance has lapsed.
 * Never displays a placeholder, default checkmark, or grey badge for unverified accounts.
 */
const VerificationBadge = ({
  user,
  className = "",
  size = "md",
  showLabel = false,
  variant = "badge", // "badge" (pill) | "avatar" (circular overlay) | "icon" (minimal)
}) => {
  const badge = getVerificationBadge(user);
  if (!badge) return null;

  // Icon glyph for category
  const renderCategoryIcon = (iconClass) => {
    switch (badge.category) {
      case "company":
        return <Building2 aria-hidden="true" className={iconClass} />;
      case "government":
        return <Landmark aria-hidden="true" className={iconClass} />;
      case "professional":
      default:
        return <BadgeCheck aria-hidden="true" className={iconClass} />;
    }
  };

  // Avatar floating overlay variant (e.g. on profile pictures)
  if (variant === "avatar") {
    const avatarSizeClasses = {
      sm: "w-4 h-4 p-0.5",
      md: "w-5 h-5 p-0.5",
      lg: "w-7 h-7 p-1",
    };

    const iconSizes = {
      sm: "w-2.5 h-2.5",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    const currentAvatarSize = avatarSizeClasses[size] || avatarSizeClasses.md;
    const currentIconSize = iconSizes[size] || iconSizes.md;

    // Solid category background for circular avatar overlay
    const bgStyles = {
      professional: "bg-[#016EA6] text-white",
      company: "bg-[#D69A16] text-white",
      government: "bg-[#73777D] text-white",
    };

    const badgeBg = bgStyles[badge.category] || "bg-[#016EA6] text-white";

    return (
      <span
        aria-label={badge.ariaLabel}
        title={`${badge.ariaLabel} (${badge.code})`}
        className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ${badgeBg} ${currentAvatarSize} ${className}`}
      >
        <Check aria-hidden="true" className={`${currentIconSize} stroke-[3px]`} />
        <span className="sr-only">{badge.ariaLabel}</span>
      </span>
    );
  }

  // Size configurations for standard badge pill / icon
  const sizeConfig = {
    sm: {
      pill: "px-1 py-0.5 text-[9px] gap-0.5",
      icon: "h-3 w-3",
      text: "text-[9px]",
    },
    md: {
      pill: "px-1.5 py-0.5 text-[10px] gap-1",
      icon: "h-3.5 w-3.5",
      text: "text-[10px]",
    },
    lg: {
      pill: "px-2 py-1 text-xs gap-1.5",
      icon: "h-4 w-4",
      text: "text-xs",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  if (variant === "icon") {
    return (
      <span
        aria-label={badge.ariaLabel}
        title={`${badge.ariaLabel} (${badge.code})`}
        className={`inline-flex shrink-0 items-center ${badge.className.split(" ")[1] || "text-[#016EA6]"} ${className}`}
      >
        {renderCategoryIcon(currentSize.icon)}
        <span className="sr-only">{badge.ariaLabel}</span>
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label={badge.ariaLabel}
      title={`${badge.ariaLabel} • ${badge.code}`}
      className={`inline-flex shrink-0 items-center rounded-full font-bold border border-current/15 ${currentSize.pill} ${badge.className} ${className}`}
    >
      {renderCategoryIcon(currentSize.icon)}
      {/* Tier code tag to distinguish without relying on color alone */}
      <span className="font-extrabold tracking-wider text-[8px] opacity-90 uppercase">
        {badge.code}
      </span>
      {showLabel && (
        <span className="hidden sm:inline font-semibold capitalize ml-0.5">
          {badge.category}
        </span>
      )}
      <span className="sr-only">{badge.ariaLabel}</span>
    </span>
  );
};

export default VerificationBadge;
