import React, { useState } from "react";
import { Check, X, Crown, Users } from "lucide-react";
import { toast } from "react-hot-toast";

const PremiumSubpage = () => {
  const [selectedPlan, setSelectedPlan] = useState("free"); // free or pro

  const features = [
    { name: "Create a professional profile", free: true, pro: false },
    { name: "List unlimited services", free: true, pro: false },
    { name: "Upload portfolio", free: true, pro: false },
    { name: "Receive job requests", free: true, pro: false },
    { name: "In-app messaging", free: true, pro: false },
    { name: "Professional dashboard", free: true, pro: false },
    { name: "Customer reviews & ratings", free: true, pro: false },
    { name: "Secure payments", free: true, pro: false }
  ];

  const handleContinue = () => {
    if (selectedPlan === "free") {
      toast.success("You are currently using the Free plan!");
    } else {
      toast.success("Redirecting to premium secure payment portal...");
    }
  };

  return (
    <div className="bg-white border border-gray-100/50 shadow-sm rounded-3xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row animate-fade-in relative min-h-[500px]">
      {/* Left Column: Comparisons */}
      <div className="flex-1 p-8 bg-gray-50/50 border-b md:border-r border-gray-100 md:border-b-0 flex flex-col justify-between">
        <div>
          {/* User count header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#016EA6] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">S</div>
              <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">M</div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">O</div>
              <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white text-gray-700 text-[8px] font-bold flex items-center justify-center">+2k</div>
            </div>
            <p className="text-xs font-semibold text-gray-800">
              Over 2,800 new users joined today
            </p>
          </div>

          {/* Features Comparison Matrix */}
          <div className="space-y-4">
            {/* Headers */}
            <div className="flex justify-between text-[11px] font-bold text-gray-400 border-b border-gray-100 pb-2">
              <span className="w-1/2">Features</span>
              <span className="w-1/4 text-center">Free</span>
              <span className="w-1/4 text-center text-[#016EA6]">Pro</span>
            </div>

            {/* Matrix items */}
            {features.map((feat, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold text-gray-700 py-1.5">
                <span className="w-1/2 text-gray-500">{feat.name}</span>
                <span className="w-1/4 flex justify-center">
                  {feat.free ? <Check className="w-4 h-4 text-[#016EA6]" /> : <X className="w-4 h-4 text-gray-300" />}
                </span>
                <span className="w-1/4 flex justify-center">
                  {feat.pro ? <Check className="w-4 h-4 text-[#016EA6]" /> : <X className="w-4 h-4 text-gray-300" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Upgrade panel */}
      <div className="w-full md:w-[45%] p-8 flex flex-col justify-between relative bg-white">
        {/* Floating Crown Decoration */}
        <div className="absolute bottom-4 right-4 text-amber-100 pointer-events-none opacity-50">
          <Crown className="w-24 h-24 stroke-[1]" />
        </div>

        <div className="space-y-6 relative z-10">
          <h3 className="text-base font-extrabold text-gray-900 text-center">Upgrade to Linkprosoft PRO</h3>

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
              <span className="text-xs font-bold text-gray-800">Free access</span>
            </div>
            <span className="text-xs font-bold text-gray-800">$0</span>
          </label>

          {/* Radio Plan 2: Pro */}
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
                <span className="text-xs font-bold text-gray-800 block">Linkprosoft PRO</span>
                <span className="text-[9px] text-gray-400 font-medium">Monthly billing</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#016EA6]">$10<span className="text-[10px] font-semibold text-gray-400 block text-right mt-0.5">Monthly</span></span>
          </label>

          {/* Total Due Display */}
          <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-xs font-bold text-gray-800">
            <span>Total Due</span>
            <span className="text-sm font-extrabold text-gray-900">${selectedPlan === "free" ? "0" : "10"}</span>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            Continue
          </button>
        </div>

        {/* Footer Terms */}
        <p className="text-[9px] text-gray-400 text-center mt-6 leading-relaxed relative z-10">
          By continuing, you agree to our{" "}
          <a href="#" className="underline font-semibold hover:text-gray-600">Terms of Service</a>,{" "}
          <a href="#" className="underline font-semibold hover:text-gray-600">Privacy & Cookie Statement</a> and{" "}
          <a href="#" className="underline font-semibold hover:text-gray-600">Refund & Cancellation Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default PremiumSubpage;
