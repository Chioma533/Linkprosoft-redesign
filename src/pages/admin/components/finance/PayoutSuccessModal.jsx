import React from "react";
import { Check } from "lucide-react";
import { toast } from "react-hot-toast";

const PayoutSuccessModal = ({ payout, onClose }) => {
  const handleDownloadReceipt = () => {
    toast.success("Downloading payout receipt PDF...");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-none text-center overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Floating Confetti Graphics */}
        <div className="absolute top-4 left-6 w-3 h-3 bg-pink-500 rounded-sm transform rotate-45 animate-bounce" />
        <div className="absolute top-8 left-12 w-2 h-4 bg-purple-500 rounded-full transform -rotate-12" />
        <div className="absolute top-6 right-8 w-3 h-3 bg-yellow-400 rounded-full" />
        <div className="absolute top-10 right-14 w-2 h-4 bg-cyan-400 rounded-sm transform rotate-30" />
        <div className="absolute top-14 left-8 w-4 h-2 bg-emerald-400 rounded-full transform rotate-12" />

        {/* Central Scalloped Green Check Badge */}
        <div className="relative z-10 my-4 inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#34D399] text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
        </div>

        {/* Modal Text */}
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-2">
          Payout Successful
        </h3>
        <p className="text-xs font-semibold text-gray-500 max-w-xs mx-auto leading-relaxed mt-2">
          {payout?.amount || "₦690,000"} has been sent into the bank provided by {payout?.professional || "Samuel"}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5 mt-7">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer border-none"
          >
            Okay
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-full transition-all cursor-pointer border-none"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutSuccessModal;
