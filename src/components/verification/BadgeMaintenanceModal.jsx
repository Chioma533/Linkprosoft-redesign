import React, { useState } from "react";
import { X, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, Clock, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import VerificationBadge from "../common/VerificationBadge";
import { isSubscriptionLapsed } from "../../utils/verificationBadge";
import subscriptionService from "../../api/services/subscriptionService";

/**
 * Modal to view and renew verification badge subscription maintenance.
 */
const BadgeMaintenanceModal = ({ isOpen, onClose, user, onRenewSuccess }) => {
  const [isRenewing, setIsRenewing] = useState(false);

  if (!isOpen) return null;

  const isGovernment = (user?.role === "government_agency" || user?.verification_category === "government");
  const isLapsed = !isGovernment && isSubscriptionLapsed(user);

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      const callbackUrl = `${window.location.origin}${window.location.pathname}`;
      const res = await subscriptionService.initiateSubscription({
        plan: "pro",
        callbackUrl,
      });
      if (res?.authorizationUrl) {
        window.location.href = res.authorizationUrl;
      } else {
        toast.error("Payment gateway URL was not returned. Please try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to initialize badge renewal.");
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#016EA6] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Badge Maintenance Status
              </h2>
              <p className="text-xs text-gray-500">
                Manage your verification credibility & public badge display
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Live Preview Card */}
          <div className="p-4 rounded-xl border border-gray-150 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#016EA6]/10 text-[#016EA6] font-bold flex items-center justify-center text-sm">
                {(user?.fullName || user?.name || "U").charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900">
                    {user?.fullName || user?.name || "Member Account"}
                  </span>
                  <VerificationBadge user={user} size="sm" />
                </div>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || "Professional"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isLapsed
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-200"
              }`}>
                {isLapsed ? "Badge Inactive" : "Badge Active"}
              </span>
            </div>
          </div>

          {/* Maintenance Diagnostics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Underlying Verification Approval</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved & Valid on Record
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Subscription Maintenance Status</span>
              <span className={`font-bold flex items-center gap-1 ${
                isLapsed ? "text-rose-600" : "text-emerald-600"
              }`}>
                {isGovernment ? (
                  "Exempt (Institutional Validation)"
                ) : isLapsed ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    Lapsed / Expired
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active (Maintained)
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Informational callout */}
          <div className="p-3 bg-sky-50 rounded-xl text-[11px] text-[#016EA6] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Integrity Guarantee:</strong> If your maintenance subscription lapses or payment fails, your underlying verification approval and certification records are permanently preserved. Renewing your subscription immediately restores your active verification badge.
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
            >
              Close
            </button>
            {!isGovernment && (
              <button
                type="button"
                disabled={isRenewing}
                onClick={handleRenew}
                className="rounded-xl bg-[#016EA6] px-5 py-2 text-xs font-bold text-white hover:bg-[#061EA6] transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? "animate-spin" : ""}`} />
                {isRenewing ? "Processing Renewal..." : isLapsed ? "Renew Maintenance Now ($10/mo)" : "Extend Subscription"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeMaintenanceModal;
