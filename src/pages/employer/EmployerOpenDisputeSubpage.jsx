import React, { useState } from "react";
import { FiArrowLeft, FiAlertTriangle, FiCheckSquare, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";

const EmployerOpenDisputeSubpage = ({ jobId, onBack }) => {
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Please select a reason for the dispute");
      return;
    }
    if (!explanation.trim()) {
      toast.error("Please explain your dispute details");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Dispute raised successfully! Support team will review shortly.");
      onBack(); // Go back to details view
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-8">
      {/* Title Header with Back arrow */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-xl transition-all cursor-pointer"
          title="Back to Project Details"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 font-sans">Open a Dispute</h2>
      </div>

      {/* Dispute Alert Info Banner */}
      <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-start gap-4 text-amber-800">
        <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 font-semibold leading-relaxed">
          <p className="font-bold">Important Notice About Disputes</p>
          <p className="text-amber-600">
            Filing a dispute locks the remaining escrow budget. Our moderation team will investigate both parties' progress, messages, and uploaded gallery evidence to reach a fair resolution. This process typically takes 3-5 business days.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project display */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/30 flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Dispute regarding project</span>
              <span className="text-xs font-bold text-gray-800">Wardrobe Installation (ID: {jobId || "ORD657783"})</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">With Professional</span>
              <span className="text-xs font-bold text-gray-800">Johnathan David</span>
            </div>
          </div>

          {/* Reason Select */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Reason for Dispute</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none cursor-pointer text-gray-700 font-semibold"
            >
              <option value="">Select a reason</option>
              <option value="delays">Significant delays in project delivery</option>
              <option value="quality">Poor quality of cabinetry workmanship</option>
              <option value="communication">No response/communication from professional</option>
              <option value="conduct">Unprofessional or aggressive conduct</option>
              <option value="other">Other reasons</option>
            </select>
          </div>

          {/* Explanation Textarea */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Explain what happened</label>
            <textarea
              rows={5}
              placeholder="Be as detailed as possible. Mention specific dates, quality issues, or parts of the contract that were breached..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-rose-500 transition-all resize-none font-semibold text-gray-700"
            />
          </div>

          {/* Claim Refund Amount */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Requested Refund Amount (₦)</label>
            <input
              type="number"
              placeholder="Enter amount to claim back from escrow"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-rose-500 transition-all font-semibold text-gray-700"
            />
            <span className="text-[9px] text-gray-400 mt-1 block">
              Note: You can request up to the maximum remaining escrow balance (₦350,000).
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-rose-100"
            >
              <FiAlertTriangle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting Dispute..." : "Submit Dispute Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerOpenDisputeSubpage;
