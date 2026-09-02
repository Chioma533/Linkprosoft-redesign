import React from "react";
import { X, Wallet, AlertTriangle, Loader2 } from "lucide-react";

const ApprovePayoutModal = ({ payout, onClose, onConfirm, isApproving = false }) => {
  if (!payout) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border-none transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl">
              <Wallet className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
              Approve Payouts
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border-none"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Payout Amount Banner */}
        <div className="bg-[#E0F2FE]/40 rounded-2xl p-5 flex items-center justify-between border border-[#BAE6FD]/60 my-4 relative overflow-hidden">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Total Payout Amount</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 block mt-1">
              {payout.amount || "₦690,000"}
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#BAE6FD]/40 text-[#016EA6] flex items-center justify-center shrink-0">
            <Wallet className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>

        {/* Parties Grid (Recipient & Job Reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Recipient */}
          <div className="bg-gray-50/80 rounded-2xl p-3.5 flex items-center gap-3 border-none">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Samuel Owoniyi"
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Recipient</span>
              <h5 className="text-xs font-bold text-gray-800 truncate">{payout.professional || "Samuel Owoniyi"}</h5>
            </div>
          </div>

          {/* Job Reference */}
          <div className="bg-gray-50/80 rounded-2xl p-3.5 flex items-center gap-3 border-none">
            <img
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&auto=format&fit=crop&q=80"
              alt="Kitchen Plumbing"
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Job Reference</span>
              <h5 className="text-xs font-bold text-gray-800 truncate">{payout.job || "Kitchen Plumbing"}</h5>
            </div>
          </div>
        </div>

        {/* Irreversible Warning Alert Banner */}
        <div className="bg-[#FFF5ED] rounded-2xl p-4 flex items-start gap-3 border-none mb-6">
          <AlertTriangle className="w-5 h-5 text-[#FF7A00] shrink-0 mt-0.5" />
          <div className="text-left space-y-0.5">
            <h5 className="text-xs font-bold text-[#FF7A00]">Irreversible Transaction</h5>
            <p className="text-[11px] font-medium text-[#FF7A00]/90 leading-relaxed">
              This will release funds from the platform account to the professional's bank account. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onConfirm}
            disabled={isApproving}
            className="w-full py-3.5 bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isApproving && <Loader2 className="w-4 h-4 animate-spin text-white" />}
            <span>{isApproving ? "Processing Approval..." : "Confirm Approval"}</span>
          </button>
          <button
            onClick={onClose}
            disabled={isApproving}
            className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-full transition-all cursor-pointer border-none disabled:opacity-60"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovePayoutModal;
