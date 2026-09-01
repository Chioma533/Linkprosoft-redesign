import React, { useState, useEffect } from "react";
import { 
  X, 
  AlertTriangle, 
  User, 
  Briefcase, 
  DollarSign, 
  Info,
  CheckCircle,
  Undo
} from "lucide-react";
import { toast } from "react-hot-toast";

const DisputeResolveModal = ({ dispute, onClose, onResolve }) => {
  const [resolutionType, setResolutionType] = useState("split"); // refund_employer, release_professional, split
  const [employerRefund, setEmployerRefund] = useState(dispute.amount / 2);
  const [professionalPayout, setProfessionalPayout] = useState(dispute.amount / 2);
  const [reason, setReason] = useState("");
  const isPending = dispute.status === "pending";

  // Sync split sums
  useEffect(() => {
    if (resolutionType === "refund_employer") {
      setEmployerRefund(dispute.amount);
      setProfessionalPayout(0);
    } else if (resolutionType === "release_professional") {
      setEmployerRefund(0);
      setProfessionalPayout(dispute.amount);
    }
  }, [resolutionType, dispute.amount]);

  const handleEmployerRefundChange = (val) => {
    const num = Math.min(Math.max(Number(val) || 0, 0), dispute.amount);
    setEmployerRefund(num);
    setProfessionalPayout(dispute.amount - num);
  };

  const handleProfessionalPayoutChange = (val) => {
    const num = Math.min(Math.max(Number(val) || 0, 0), dispute.amount);
    setProfessionalPayout(num);
    setEmployerRefund(dispute.amount - num);
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Please provide an arbitration summary reason.");
      return;
    }

    if (resolutionType === "split" && (employerRefund + professionalPayout !== dispute.amount)) {
      toast.error(`The split sum ($${(employerRefund + professionalPayout).toLocaleString()}) must equal the total disputed escrow ($${dispute.amount.toLocaleString()})`);
      return;
    }

    onResolve(dispute.id, {
      type: resolutionType,
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
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-100 max-h-[95vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-2xl md:rounded-2xl md:border border-gray-100 md:max-h-[85vh]
        transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-gray-900">Escrow Dispute Arbitration</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Dispute Case Ref: {dispute.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Dispute Context Card */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-3">
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Disputed Contract</span>
              <h4 className="text-sm font-bold text-gray-800">{dispute.jobTitle}</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-600 pt-1">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Employer (Client)</p>
                <p className="text-gray-700 mt-0.5">{dispute.employer}</p>
                <p className="text-[10px] text-gray-400 font-medium">{dispute.employerEmail}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Professional (Freelancer)</p>
                <p className="text-gray-700 mt-0.5">{dispute.professional}</p>
                <p className="text-[10px] text-gray-400 font-medium">{dispute.professionalEmail}</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Disputed Milestone Value</span>
              <span className="text-lg font-extrabold text-rose-600">${dispute.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Statement Claims */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parties Statement Claims</h4>
            
            {/* Dispute Reason */}
            <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 text-xs leading-relaxed text-amber-850">
              <span className="font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" /> Dispute Reason Summary:</span>
              <p className="mt-1 font-semibold">{dispute.reason}</p>
            </div>

            {/* Statements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="border border-gray-100 p-4 rounded-xl space-y-1">
                <span className="text-[9px] font-bold uppercase text-purple-600 block">Employer Statement Claim</span>
                <p className="text-gray-600 font-medium leading-relaxed italic">
                  &ldquo;{dispute.employerStatement || "No custom statements uploaded."}&rdquo;
                </p>
              </div>
              <div className="border border-gray-100 p-4 rounded-xl space-y-1">
                <span className="text-[9px] font-bold uppercase text-blue-600 block">Professional Statement Claim</span>
                <p className="text-gray-600 font-medium leading-relaxed italic">
                  &ldquo;{dispute.professionalStatement || "No custom statements uploaded."}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Case Resolution Feedbacks */}
          {!isPending && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-850 space-y-3">
              <h5 className="font-extrabold flex items-center gap-1.5 text-emerald-700">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Arbitration Case File Closed
              </h5>
              <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-emerald-100 font-bold">
                <div>Type: <span className="text-gray-800 uppercase text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-250">{dispute.resolution}</span></div>
                {dispute.splitDetails && (
                  <div>
                    Split Details: <span className="text-emerald-700 font-extrabold">${dispute.splitDetails.employerRefund} Client / ${dispute.splitDetails.professionalPayout} Pro</span>
                  </div>
                )}
              </div>
              <p className="font-medium text-gray-600">Case resolved in accordance with escrow regulations by platform auditors.</p>
            </div>
          )}

          {/* Action Resolution inputs */}
          {isPending && (
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Auditor Allocation Controls</h4>
              
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "refund_employer", label: "Full Refund" },
                  { id: "release_professional", label: "Full Release" },
                  { id: "split", label: "Split Escrow" }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setResolutionType(opt.id)}
                    className={`py-2 px-2.5 rounded-xl border text-center text-[10px] font-extrabold transition-all cursor-pointer ${
                      resolutionType === opt.id 
                        ? "bg-[#016EA6] border-[#016EA6] text-white shadow-xs" 
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Split inputs */}
              {resolutionType === "split" ? (
                <div className="grid grid-cols-2 gap-4 border border-gray-100 p-4 rounded-xl bg-gray-50/20">
                  <label className="block text-[11px] font-bold text-gray-500">
                    Employer Refund Amount ($)
                    <input
                      type="number"
                      value={employerRefund}
                      onChange={(e) => handleEmployerRefundChange(e.target.value)}
                      className="w-full mt-1.5 p-2.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#016EA6] font-bold bg-white text-gray-800"
                    />
                  </label>
                  <label className="block text-[11px] font-bold text-gray-500">
                    Professional Payout ($)
                    <input
                      type="number"
                      value={professionalPayout}
                      onChange={(e) => handleProfessionalPayoutChange(e.target.value)}
                      className="w-full mt-1.5 p-2.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#016EA6] font-bold bg-white text-gray-800"
                    />
                  </label>
                </div>
              ) : (
                <div className="border border-gray-100 p-4 rounded-xl text-xs font-semibold text-gray-700 space-y-2 bg-gray-50/20">
                  <div className="flex justify-between">
                    <span>Refund to Client (Employer):</span>
                    <span className="font-extrabold text-emerald-600">${employerRefund.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Release to Professional (Freelancer):</span>
                    <span className="font-extrabold text-emerald-600">${professionalPayout.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Resolution justification */}
              <label className="block text-xs font-bold text-gray-700">
                Arbitration Rationale & Summary
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Summarize the core factors justifying this arbitration decision. This statement is logged and shared with both platform parties."
                  rows="3"
                  className="w-full mt-2 p-3 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs bg-white outline-none resize-none font-semibold text-gray-700 leading-relaxed"
                />
              </label>

              <div className="flex gap-2 p-3 bg-blue-50/50 rounded-xl text-[10px] text-[#016EA6] font-semibold leading-relaxed">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Arbitration is permanent. Executing this choice releases funds from escrow to corresponding platform wallets immediately.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 z-10">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Cancel Arbitration
          </button>
          {isPending && (
            <button 
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Undo className="w-4 h-4" /> Finalize Split & Release
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DisputeResolveModal;
