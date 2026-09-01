import React, { useState } from "react";
import {
  X,
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Globe,
  Phone,
  FileCheck,
  FileX,
  AlertTriangle,
  Info,
  Download,
  Maximize2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import VerificationSuccessModal from "./VerificationSuccessModal";

// Placeholder images
import docPlaceholder from "../../../assets/images/preview-verification_illustration.png";
import facePlaceholder from "../../../assets/images/faceverification_illustration.jpg";

const VerificationRequestDetailPage = ({ request, onApprove, onReject }) => {
  const navigate = useNavigate();
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionCategory, setRejectionCategory] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isPending = request.status === "pending";

  const rejectionReasons = [
    "Blurry or unclear image",
    "Document partially cut off",
    "Mismatched names",
    "Expired ID document",
    "Document not legible",
    "Face does not match document",
    "Other reason",
  ];

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onApprove(request.id);
      setShowSuccessModal(true);
      toast.success("Verification request approved successfully.");
    } catch (error) {
      toast.error("Failed to approve request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionCategory.trim()) {
      toast.error("Please select a rejection reason.");
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error("Please provide additional rejection details.");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const fullReason = `${rejectionCategory}: ${rejectionReason}`;
      onReject(request.id, fullReason);
      toast.success("Verification request rejected.");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to reject request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Verification Request #{request.id}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {request.docType} • {request.date}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
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
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Request Details and Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                Applicant Information
              </h3>

              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#016EA6] flex items-center justify-center font-bold text-lg shrink-0">
                  {request.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{request.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {request.email} • {request.role}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Nationality</p>
                    <p className="text-sm font-bold text-gray-800">
                      {request.details.nationality}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-bold text-gray-800">
                      {request.details.dob}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-bold text-gray-800">
                      {request.details.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {request.details.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Documents */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                Submitted Evidence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Document Preview */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="mb-4">
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                      Uploaded Document
                    </p>
                    <h4 className="text-sm font-bold text-gray-800 mt-1">
                      {request.docType}
                    </h4>
                  </div>

                  <div className="relative h-56 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden group">
                    <img
                      src={docPlaceholder}
                      alt="Document proof"
                      className="max-h-full max-w-full object-contain p-3"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 justify-center">
                      <button className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" /> View
                      </button>
                      <button className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selfie Preview */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="mb-4">
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                      Face Validation Check
                    </p>
                    <h4 className="text-sm font-bold text-gray-800 mt-1">
                      Live Verification Selfie
                    </h4>
                  </div>

                  <div className="relative h-56 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden group">
                    <img
                      src={facePlaceholder}
                      alt="Verification selfie"
                      className="max-h-full max-w-full object-contain p-3"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 justify-center">
                      <button className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" /> View
                      </button>
                      <button className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Review Decision */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Review Decision</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isPending
                    ? "Make a decision on this verification request"
                    : "This request has already been reviewed"}
                </p>
              </div>

              {/* Rejection Feedback (if already rejected) */}
              {!isPending && request.status === "rejected" && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2">
                  <div className="flex gap-2 text-xs text-rose-700 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Rejection Reason:</span>
                  </div>
                  <p className="text-xs text-rose-600 leading-relaxed">
                    {request.rejectionReason}
                  </p>
                </div>
              )}

              {/* Approval section (if pending) */}
              {isPending && (
                <div className="space-y-4 border-t border-gray-100 pt-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Rejection Category
                    </label>
                    <select
                      value={rejectionCategory}
                      onChange={(e) => setRejectionCategory(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:border-[#016EA6] outline-none bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select a reason (if rejecting)</option>
                      {rejectionReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Additional Details
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide additional feedback or details about your decision..."
                      rows="4"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:border-[#016EA6] outline-none resize-none bg-white leading-relaxed"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 text-xs text-blue-700 font-semibold leading-relaxed">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Approving will mark this account as Verified, adding the
                      trust badge and enabling them to trade immediately.
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FileX className="w-4 h-4" />
                      {isProcessing ? "Processing..." : "Reject Request"}
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FileCheck className="w-4 h-4" />
                      {isProcessing ? "Processing..." : "Approve Request"}
                    </button>
                  </div>
                </div>
              )}

              {/* Approved status message */}
              {!isPending && request.status === "approved" && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center space-y-2">
                  <p className="text-xs font-bold text-emerald-700">
                    ✓ This request has been approved
                  </p>
                  <p className="text-xs text-emerald-600">
                    The user is now verified on the platform
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <VerificationSuccessModal
          userName={request.name}
          onClose={() => setShowSuccessModal(false)}
          onViewDetails={() => {
            setShowSuccessModal(false);
          }}
        />
      )}
    </>
  );
};

export default VerificationRequestDetailPage;
