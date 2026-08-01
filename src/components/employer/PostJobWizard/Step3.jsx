import React from "react";
import StepBar from "../../common/StepBar";
import ReviewRow from "../../common/ReviewRow";
import NavButtons from "../../common/NavButtons";

const Step3 = ({ data, onBack, onSubmit, onGoToStep, isSubmitting = false }) => {
  const formatBudget = () => {
    if (!data.budgetMin && !data.budgetMax) return "—";
    const fmt = (v) => `₦${Number(v).toLocaleString("en-NG")}`;
    return `${fmt(data.budgetMin)} – ${fmt(data.budgetMax)}`;
  };

  const urgencyLabel = () => {
    if (data.urgency === "Urgent-24hrs") return "Urgent – within 24hrs";
    return data.urgency || "—";
  };

  return (
    <div>
      <StepBar total={3} current={3} />
      <p className="text-sm font-semibold text-[#016EA6] mb-3">Step 3 of 3</p>
      <h1 className="text-3xl font-light text-gray-900 mb-1">Review your job post</h1>
      <p className="text-sm text-gray-400 mb-8">Last look before it goes live.</p>

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-[#016EA6]">{data.category || "—"}</span>
          <button type="button" onClick={() => onGoToStep(1)} className="text-sm font-semibold text-[#016EA6] hover:text-[#061EA6] transition-colors cursor-pointer">
            Edit
          </button>
        </div>
        <h2 className="text-lg font-bold text-gray-900">{data.title || "—"}</h2>
        {data.description && <p className="text-sm text-gray-400 mt-1 leading-relaxed">{data.description}</p>}
      </div>

      <div className="border-t border-gray-100 mt-4">
        <ReviewRow label="Budget" value={formatBudget()} onEdit={() => onGoToStep(2)} />
        <ReviewRow label="Timeline" value={urgencyLabel()} onEdit={() => onGoToStep(2)} />
        <ReviewRow label="Location" value={data.location || "—"} onEdit={() => onGoToStep(2)} noBorder />
      </div>

      <NavButtons onBack={onBack} onContinue={onSubmit} continueLabel="Post Job" isSubmitting={isSubmitting} />
    </div>
  );
};

export default Step3;

