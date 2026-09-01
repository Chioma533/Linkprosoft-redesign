import React, { useState } from "react";
import { X, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { toast } from "react-hot-toast";

const ArbitrateSliderModal = ({ dispute, onClose, onResolve }) => {
  const [sliderVal, setSliderVal] = useState(50); // Default 50% split
  const [reason, setReason] = useState("");

  const employerRefund = (dispute.amount * sliderVal) / 100;
  const professionalPayout = (dispute.amount * (100 - sliderVal)) / 100;

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Please enter the arbitration reason / rationale.");
      return;
    }

    // Call resolve action callback
    onResolve(dispute.id, {
      type: sliderVal === 100 ? "refund_employer" : sliderVal === 0 ? "release_professional" : "split",
      employerRefund,
      professionalPayout,
      reason
    });
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (Drawer on mobile, Modal on desktop) */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-150 max-h-[95vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md md:rounded-2xl md:border border-gray-150 md:max-h-[85vh]
        transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-150 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Arbitrate Escrow</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-bold">Disputed Total: ${dispute.amount.toLocaleString()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all cursor-pointer border border-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs font-semibold text-gray-700">
          {/* Info Card */}
          <div className="border border-gray-150 p-4 rounded-xl space-y-1.5 bg-gray-50/20">
            <span className="text-[9px] uppercase font-bold text-gray-400">Arbitration Target</span>
            <h4 className="text-xs font-bold text-gray-800">{dispute.jobTitle}</h4>
            <div className="flex justify-between items-center text-xs font-bold pt-1.5 border-t border-gray-150 mt-1.5">
              <span className="text-gray-400">Locked Escrow Payout:</span>
              <span className="text-rose-600 text-sm font-extrabold">${dispute.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Split slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <span>Client Refund: {sliderVal}%</span>
              <span>Professional: {100 - sliderVal}%</span>
            </div>

            {/* Custom Slider Input */}
            <div className="relative pt-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderVal} 
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer focus:outline-none accent-[#016EA6]"
                style={{
                  background: `linear-gradient(to right, #016EA6 0%, #016EA6 ${sliderVal}%, #e5e7eb ${sliderVal}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
                <span>0% (Full Pro Payout)</span>
                <span>50% (Equal Split)</span>
                <span>100% (Full Refund)</span>
              </div>
            </div>

            {/* Dynamic breakdown values */}
            <div className="grid grid-cols-2 gap-3 border border-gray-150 p-3.5 rounded-xl bg-gray-50/20 text-xs">
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Employer Client Refund</span>
                <p className="text-gray-800 font-extrabold text-sm mt-0.5">${employerRefund.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Professional Payout</span>
                <p className="text-[#016EA6] font-extrabold text-sm mt-0.5">${professionalPayout.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Warning alert */}
          <div className="bg-rose-50/50 border border-rose-150 p-3.5 rounded-xl flex gap-2.5 leading-relaxed text-rose-800 text-[11px] font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Audit Warning</p>
              <p className="mt-0.5 font-medium">Specifying splits releases locked escrow assets from held state to corresponding wallets immediately.</p>
            </div>
          </div>

          {/* Reason text-box */}
          <label className="block text-xs font-bold text-gray-700">
            Arbitration Reason / Justification
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the audit considerations and why this allocation represents a fair resolution. This message is logged in user notification summaries."
              rows="3"
              className="w-full mt-2 p-3 border border-gray-150 focus:border-[#016EA6] rounded-xl text-xs bg-white outline-none resize-none font-semibold text-gray-700 leading-relaxed"
            />
          </label>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-150 px-6 py-4 flex gap-3 z-10">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer border border-rose-600"
          >
            Arbitrate
          </button>
        </div>
      </div>
    </>
  );
};

export default ArbitrateSliderModal;
