import React, { useState } from "react";
import { Check, X, Crown, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import VerificationBadge from "../../components/common/VerificationBadge";
import { isSubscriptionLapsed } from "../../utils/verificationBadge";

const PremiumSubpage = () => {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState("pro"); // default to pro for badge maintenance

  const isLapsed = isSubscriptionLapsed(user);

  const features = [
    { name: "Create a professional profile", free: true, pro: true },
    { name: "List unlimited services & portfolio", free: true, pro: true },
    { name: "Receive job requests & messaging", free: true, pro: true },
    { name: "Customer reviews & ratings", free: true, pro: true },
    { name: "Secure payments & escrow protection", free: true, pro: true },
    {
      name: "Verified Badge Active Display & Maintenance",
      free: false,
      pro: true,
      highlight: true,
    },
    { name: "Priority Search & Browse Ranking", free: false, pro: true },
    { name: "Certified Trade Credential Audit", free: false, pro: true },
  ];

  const handleContinue = () => {
    if (selectedPlan === "free") {
      toast.success("You are currently using the Free plan.");
    } else {
      toast.success("Connecting to secure payment portal for Badge Maintenance Subscription ($10/mo)...");
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row animate-fade-in relative min-h-[520px]">
      {/* Left Column: Comparisons */}
      <div className="flex-1 p-8 bg-gray-50/50 border-b md:border-r border-gray-100 md:border-b-0 flex flex-col justify-between">
        <div>
          {/* User count & verification header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#016EA6] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">S</div>
                <div className="w-7 h-7 rounded-full bg-[#D69A16] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">M</div>
                <div className="w-7 h-7 rounded-full bg-[#73777D] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">G</div>
                <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white text-gray-700 text-[8px] font-bold flex items-center justify-center">+2k</div>
              </div>
              <p className="text-xs font-semibold text-gray-800">
                Verified Credibility on Linkprosoft
              </p>
            </div>

            {user && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                <span className="text-[10px] font-bold text-gray-600">Your Badge:</span>
                <VerificationBadge user={user} size="sm" />
                {!user.verification_status && (
                  <span className="text-[10px] text-gray-400 font-semibold">Unverified</span>
                )}
              </div>
            )}
          </div>

          {/* Features Comparison Matrix */}
          <div className="space-y-3.5">
            {/* Headers */}
            <div className="flex justify-between text-[11px] font-bold text-gray-400 border-b border-gray-150 pb-2">
              <span className="w-1/2">Features & Capabilities</span>
              <span className="w-1/4 text-center">Free</span>
              <span className="w-1/4 text-center text-[#016EA6]">Pro & Badge Maintenance</span>
            </div>

            {/* Matrix items */}
            {features.map((feat, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center text-xs py-1.5 rounded-lg px-1 transition ${
                  feat.highlight ? "bg-sky-50/60 font-bold text-[#016EA6]" : "font-semibold text-gray-700"
                }`}
              >
                <span className="w-1/2">{feat.name}</span>
                <span className="w-1/4 flex justify-center">
                  {feat.free ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-gray-300" />}
                </span>
                <span className="w-1/4 flex justify-center">
                  {feat.pro ? <Check className="w-4 h-4 text-[#016EA6]" /> : <X className="w-4 h-4 text-gray-300" />}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-sky-50 rounded-xl text-[11px] text-[#016EA6] space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Subscription-Based Badge Maintenance Policy
            </p>
            <p className="text-gray-600 leading-relaxed">
              An active subscription maintains public badge display. When a subscription expires or payment fails, the badge is temporarily hidden without deleting underlying verification approval records. Restoring or renewing subscription restores the badge immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Upgrade panel */}
      <div className="w-full md:w-[45%] p-8 flex flex-col justify-between relative bg-white">
        <div className="absolute bottom-4 right-4 text-amber-100 pointer-events-none opacity-40">
          <Crown className="w-24 h-24 stroke-[1]" />
        </div>

        <div className="space-y-5 relative z-10">
          <div className="text-center">
            <h3 className="text-base font-extrabold text-gray-900">
              Badge Maintenance & Pro Access
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Keep your verification badge active and elevate search trust
            </p>
          </div>

          {/* Radio Plan 1: Free */}
          <label
            onClick={() => setSelectedPlan("free")}
            className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedPlan === "free"
                ? "border-[#016EA6] bg-sky-50/40"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="plan"
                checked={selectedPlan === "free"}
                onChange={() => {}}
                className="w-4 h-4 text-[#016EA6] border-gray-300 focus:ring-[#016EA6] cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Free Access</span>
                <span className="text-[10px] text-gray-400 font-medium">Standard profile without badge maintenance</span>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-800">$0</span>
          </label>

          {/* Radio Plan 2: Pro + Badge Maintenance */}
          <label
            onClick={() => setSelectedPlan("pro")}
            className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedPlan === "pro"
                ? "border-[#016EA6] bg-sky-50/40"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="plan"
                checked={selectedPlan === "pro"}
                onChange={() => {}}
                className="w-4 h-4 text-[#016EA6] border-gray-300 focus:ring-[#016EA6] cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Pro & Badge Maintenance</span>
                <span className="text-[10px] text-gray-400 font-medium">Maintains Blue/Gold Badge display</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#016EA6]">
              $10
              <span className="text-[9px] font-semibold text-gray-400 block text-right">/mo</span>
            </span>
          </label>

          {/* Total Due Display */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-bold text-gray-800">
            <span>Total Due Today</span>
            <span className="text-base font-extrabold text-[#016EA6]">
              ${selectedPlan === "free" ? "0" : "10"}
            </span>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            {selectedPlan === "free" ? "Stay on Free Plan" : "Maintain Active Badge ($10/mo)"}
          </button>
        </div>

        {/* Footer Terms */}
        <p className="text-[9px] text-gray-400 text-center mt-6 leading-relaxed relative z-10">
          Government agencies undergo institutional accreditation and are exempt from maintenance subscriptions. By subscribing, you agree to Linkprosoft Terms of Service and Verification Policies.
        </p>
      </div>
    </div>
  );
};

export default PremiumSubpage;
