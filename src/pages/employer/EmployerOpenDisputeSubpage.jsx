import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiAlertTriangle, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";
import DisputeEvidenceUploader from "../../components/common/DisputeEvidenceUploader";
import mediaService from "../../api/services/mediaService";
import disputeService from "../../api/services/disputeService";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { jobService } from "../../api/services/jobService";

const EmployerOpenDisputeSubpage = ({ jobId, onBack }) => {
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [stagedEvidence, setStagedEvidence] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [jobError, setJobError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadJob = async () => {
      if (!jobId) {
        setIsLoadingJob(false);
        setJobError("Select a real project before opening a dispute.");
        return;
      }

      setIsLoadingJob(true);
      setJobError("");
      try {
        const response = await jobService.getJobById(jobId);
        const liveJob = response?.data || response;
        if (isMounted) setJob(liveJob);
      } catch (error) {
        if (isMounted) {
          setJob(null);
          setJobError(error?.response?.data?.message || "Could not load the selected project.");
        }
      } finally {
        if (isMounted) setIsLoadingJob(false);
      }
    };

    loadJob();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const assignmentId =
    job?.assignment?.id || job?.assignmentId || job?.assignment_id || null;
  const jobTitle = job?.title || "Project details unavailable";
  const professionalName =
    job?.acceptedProfessional?.fullName ||
    job?.professional?.fullName ||
    job?.professional?.name ||
    job?.assignedProfessional?.name ||
    "Professional unavailable";
  const escrowBalance = Number(
    job?.payment?.amount ??
    job?.assignment?.acceptedBudget ??
    job?.acceptedBudget ??
    job?.budget ??
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobId || !assignmentId) {
      toast.error("This dispute requires a valid project and assignment.");
      return;
    }
    if (!reason) {
      toast.error("Please select a reason for the dispute");
      return;
    }
    if (!explanation.trim()) {
      toast.error("Please explain your dispute details");
      return;
    }
    if (isLoadingJob) {
      toast.error("Please wait while the selected project loads.");
      return;
    }
    if (jobError) {
      toast.error(jobError);
      return;
    }

    const requestedRefund = refundAmount ? Number(refundAmount) : 0;
    if (!Number.isFinite(requestedRefund) || requestedRefund < 0) {
      toast.error("Requested refund must be a valid amount.");
      return;
    }
    if (escrowBalance > 0 && requestedRefund > escrowBalance) {
      toast.error("Requested refund exceeds the available escrow balance.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload any staged evidence files first
      const uploadedMedia = [];
      for (const item of stagedEvidence) {
        if (!item.mediaId) {
          const { mediaId } = await mediaService.uploadFile(item.file, "dispute_evidence");
          uploadedMedia.push({ mediaId, caption: item.caption });
        } else {
          uploadedMedia.push({ mediaId: item.mediaId, caption: item.caption });
        }
      }

      // 2. File the dispute request
      const disputeRes = await axiosInstance.patch(
        API_PATHS.ASSIGNMENTS.DISPUTE_SATISFACTION(assignmentId),
        {
          reason: `${reason}: ${explanation}`,
          notes: requestedRefund > 0
            ? `Requested refund: ${requestedRefund}`
            : undefined,
        }
      );
      const disputeId =
        disputeRes.data?.data?.dispute?.id ||
        disputeRes.data?.data?.id ||
        null;

      // 3. Link uploaded evidence to the dispute if disputeId is available
      let linkedEvidenceCount = 0;
      let failedEvidenceCount = 0;
      if (uploadedMedia.length > 0) {
        if (!disputeId) {
          failedEvidenceCount = uploadedMedia.length;
        } else {
          for (let i = 0; i < uploadedMedia.length; i++) {
            try {
              await disputeService.submitEvidence(disputeId, {
                mediaId: uploadedMedia[i].mediaId,
                caption: uploadedMedia[i].caption,
                sortOrder: i,
              });
              linkedEvidenceCount += 1;
            } catch (evErr) {
              console.warn("Evidence link warning:", evErr);
              failedEvidenceCount += 1;
            }
          }
        }
      }

      if (failedEvidenceCount > 0) {
        toast.error(
          `Dispute created, but ${failedEvidenceCount} evidence file${failedEvidenceCount > 1 ? "s" : ""} could not be attached.`
        );
      } else if (linkedEvidenceCount > 0) {
        toast.success("Dispute raised successfully with supporting evidence! Support team will review shortly.");
      } else {
        toast.success("Dispute raised successfully! Support team will review shortly.");
      }
      onBack();
    } catch (err) {
      console.error("Dispute submission error:", err);
      toast.error(err.response?.data?.message || "Failed to submit dispute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-8">
      {/* Title Header with Back arrow */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full transition-all cursor-pointer"
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
          {isLoadingJob && (
            <div className="rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-gray-500">
              Loading selected project...
            </div>
          )}
          {jobError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
              {jobError}
            </div>
          )}
          {/* Project display */}
          <div className="bg-slate-50 p-4 rounded-full border border-slate-100/30 flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Dispute regarding project</span>
              <span className="text-xs font-bold text-gray-800">{jobTitle} (ID: {jobId})</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">With Professional</span>
              <span className="text-xs font-bold text-gray-800">{professionalName}</span>
            </div>
          </div>

          {/* Reason Select */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Reason for Dispute</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none cursor-pointer text-gray-700 font-semibold"
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:bg-white focus:border-rose-500 transition-all resize-none font-semibold text-gray-700"
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:bg-white focus:border-rose-500 transition-all font-semibold text-gray-700"
            />
            <span className="text-[9px] text-gray-400 mt-1 block">
              {isLoadingJob
                ? "Loading available escrow balance..."
                : escrowBalance > 0
                  ? `Available escrow balance: ₦${escrowBalance.toLocaleString()}`
                  : "Available escrow balance: ₦0"}
            </span>
          </div>

          {/* Dispute Evidence Uploader */}
          <div className="pt-2 border-t border-gray-100">
            <DisputeEvidenceUploader onEvidenceChange={setStagedEvidence} maxFiles={6} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full text-xs font-bold transition-all text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingJob || Boolean(jobError) || !assignmentId}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-rose-100"
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
