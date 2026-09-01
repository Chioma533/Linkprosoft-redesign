import React, { useState } from "react";
import {
  X,
  User,
  MapPin,
  Calendar,
  Globe,
  Phone,
  FileCheck,
  FileX,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import VerificationSuccessModal from "./VerificationSuccessModal";

// Placeholders for illustrations to match design
import docPlaceholder from "../../../assets/images/preview-verification_illustration.png";
import facePlaceholder from "../../../assets/images/faceverification_illustration.jpg";

const VerificationReviewModal = ({ request, onClose, onApprove, onReject }) => {
  const [rejectionText, setRejectionText] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isPending = request.status === "pending";

  const handleActionReject = () => {
    if (!rejectionText.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    onReject(request.id, rejectionText);
    toast.success("Verification request rejected.");
  };

  const handleActionApprove = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onApprove(request.id);
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Failed to approve request.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container (Drawer on mobile, Modal on desktop) */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-100 max-h-[95vh] overflow-y-auto flex flex-col
        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-2xl md:rounded-2xl md:border border-gray-100 md:max-h-[85vh]
        transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Verification Document Review
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Request ID: {request.id}
            </p>
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
          {/* User basic details card */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-[#016EA6] flex items-center justify-center font-extrabold text-sm shrink-0">
                {request.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  {request.name}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {request.email} • {request.role}
                </p>
              </div>
              <span
                className={`ml-auto px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                  request.status === "approved"
                    ? "bg-emerald-50 text-emerald-600"
                    : request.status === "rejected"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-amber-50 text-amber-600"
                }`}
              >
                {request.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-gray-600">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>Nationality: {request.details.nationality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>DoB: {request.details.dob}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>Phone: {request.details.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">
                  Address: {request.details.address}
                </span>
              </div>
            </div>
          </div>

          {/* Documents Grid Previews */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Submitted Evidence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ID Document Preview */}
              <div className="border border-gray-100 rounded-xl p-3 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Uploaded document
                  </span>
                  <h5 className="text-xs font-bold text-gray-800 mb-2">
                    {request.docType}
                  </h5>
                </div>
                <div className="h-40 sm:h-44 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative group">
                  <img
                    src={docPlaceholder}
                    alt="Document proof"
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                      Click to view scan
                    </span>
                  </div>
                </div>
              </div>

              {/* Face Selfie Preview */}
              <div className="border border-gray-100 rounded-xl p-3 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Face validation check
                  </span>
                  <h5 className="text-xs font-bold text-gray-800 mb-2">
                    Live Verification Selfie
                  </h5>
                </div>
                <div className="h-40 sm:h-44 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative group">
                  <img
                    src={facePlaceholder}
                    alt="User verification selfie"
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                      Compare facial profile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Feedbacks */}
          {!isPending && request.status === "rejected" && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-xs text-rose-800 font-semibold leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-bold">Rejection Feedback:</p>
                <p className="mt-1 font-medium">{request.rejectionReason}</p>
              </div>
            </div>
          )}

          {isPending && (
            <div className="space-y-3.5 border-t border-gray-100 pt-5">
              <label className="block text-xs font-bold text-gray-700">
                Audit Feedback / Rejection Reason
                <textarea
                  value={rejectionText}
                  onChange={(e) => setRejectionText(e.target.value)}
                  placeholder="Explain why this request is being rejected (e.g. Blurry photo, mismatched names, expired ID documents). Required only if rejecting."
                  rows="3"
                  className="w-full mt-2 p-3 border border-gray-200 focus:border-rose-500 rounded-xl text-xs bg-white outline-none resize-none font-semibold text-gray-700 leading-relaxed"
                />
              </label>

              <div className="flex gap-2 p-3 bg-blue-50/50 rounded-xl text-[10px] text-[#016EA6] font-semibold leading-relaxed">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Approving will mark this account as Verified, adding the trust
                  badge and allowing them to trade on the platform immediately.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 sm:flex-row z-10">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Cancel Review
          </button>

          {isPending && (
            <>
              <button
                onClick={handleActionReject}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileX className="w-4 h-4" /> Reject Request
              </button>
              <button
                onClick={handleActionApprove}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />{" "}
                {isProcessing ? "Processing..." : "Approve Proofs"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <VerificationSuccessModal
          userName={request.name}
          onClose={() => {
            setShowSuccessModal(false);
            onClose();
          }}
          onViewDetails={() => {
            setShowSuccessModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default VerificationReviewModal;
