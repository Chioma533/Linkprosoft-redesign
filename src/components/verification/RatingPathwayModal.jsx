import React, { useState } from "react";
import { X, Star, CheckCircle, XCircle, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { evaluateRatingEligibility, DEFAULT_VERIFICATION_CONFIG } from "../../utils/verificationConfig";
import verificationService from "../../api/services/verificationService";

/**
 * Pathway 2: Rating-based verification modal.
 * For professionals without government certifications, using platform performance and ratings.
 */
const RatingPathwayModal = ({
  isOpen,
  onClose,
  metrics = {},
  onSubmitSuccess,
  config = DEFAULT_VERIFICATION_CONFIG.ratingPathway,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Evaluate current user eligibility with configurable thresholds
  const evaluation = evaluateRatingEligibility(metrics, config);
  const { isEligible, unmetCriteria } = evaluation;

  const handleApply = async () => {
    if (!isEligible) {
      toast.error("You must meet all platform performance criteria before applying.");
      return;
    }

    setIsSubmitting(true);
    try {
      await verificationService.submitBadgeApplication({
        pathway: "rating",
        applicationData: evaluation,
      });
      setIsSubmitting(false);
      toast.success("Rating-based verification application submitted for administrative approval!");
      onSubmitSuccess?.({
        pathway: "rating",
        metrics: evaluation.metrics,
        status: "pending_review",
        submittedAt: new Date().toISOString(),
      });
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error?.response?.data?.message || "Failed to submit rating application.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#016EA6] text-white">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Platform Rating-Based Verification Pathway
              </h2>
              <p className="text-xs text-gray-500">
                Qualify for the Blue Professional Badge through verified client reviews and completed jobs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Eligibility Overview Banner */}
          <div
            className={`rounded-xl p-4 border flex items-center gap-3 ${
              isEligible
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            {isEligible ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            )}
            <div>
              <h4 className="text-xs font-bold">
                {isEligible
                  ? "Congratulations! You meet all rating verification criteria."
                  : "Criteria in progress. Complete more jobs and collect 5-star reviews to qualify."}
              </h4>
              <p className="text-[11px] mt-0.5 opacity-90">
                {isEligible
                  ? "You can now submit your profile for platform compliance review."
                  : "LinkProSoft uses fraud-detection filters to prevent duplicate or self-generated ratings."}
              </p>
            </div>
          </div>

          {/* Criteria Checklist Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Verification Requirements
            </h3>

            {/* Metric 1: Average Rating */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Average Client Rating</p>
                  <p className="text-[11px] text-gray-500">
                    Threshold: {config.minAverageRating}+ stars across genuine jobs
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-gray-900">
                  {evaluation.metrics.rating.toFixed(1)} / 5.0
                </span>
                <span className="block text-[10px]">
                  {evaluation.metrics.rating >= config.minAverageRating ? (
                    <span className="text-emerald-600 font-bold">✓ Met</span>
                  ) : (
                    <span className="text-rose-500 font-bold">Pending</span>
                  )}
                </span>
              </div>
            </div>

            {/* Metric 2: Completed Jobs */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#016EA6] flex items-center justify-center font-bold">
                  #
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Completed Jobs on LinkProSoft</p>
                  <p className="text-[11px] text-gray-500">
                    Threshold: At least {config.minCompletedJobs} successfully fulfilled contracts
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-gray-900">
                  {evaluation.metrics.completedJobs} / {config.minCompletedJobs}
                </span>
                <span className="block text-[10px]">
                  {evaluation.metrics.completedJobs >= config.minCompletedJobs ? (
                    <span className="text-emerald-600 font-bold">✓ Met</span>
                  ) : (
                    <span className="text-rose-500 font-bold">Pending</span>
                  )}
                </span>
              </div>
            </div>

            {/* Metric 3: Genuine Reviews & Fraud Screening */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-150 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Fraud & Integrity Screening</p>
                  <p className="text-[11px] text-gray-500">
                    Filtered for genuine client reviews (no self-generated feedback)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600">
                  Clean History
                </span>
                <span className="block text-[10px] text-gray-400">
                  {evaluation.metrics.reviews} verified reviews
                </span>
              </div>
            </div>
          </div>

          {unmetCriteria.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-xl text-gray-600 text-xs space-y-1">
              <p className="font-bold text-gray-800">Unmet Criteria:</p>
              {unmetCriteria.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-rose-600">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
            >
              Close
            </button>
            <button
              type="button"
              disabled={!isEligible || isSubmitting}
              onClick={handleApply}
              className="rounded-xl bg-[#016EA6] px-5 py-2 text-xs font-bold text-white hover:bg-[#061EA6] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSubmitting ? "Submitting..." : "Apply for Rating Verification"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingPathwayModal;
