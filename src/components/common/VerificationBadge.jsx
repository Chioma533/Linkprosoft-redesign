import { BadgeCheck } from "lucide-react";
import { getVerificationBadge } from "../../utils/verificationBadge";

const VerificationBadge = ({ user, className = "" }) => {
  const badge = getVerificationBadge(user);
  if (!badge) return null;

  return (
    <span
      aria-label={badge.ariaLabel}
      title={badge.ariaLabel}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${badge.className} ${className}`}
    >
      <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
      <span className="sr-only">{badge.ariaLabel}</span>
    </span>
  );
};

export default VerificationBadge;
