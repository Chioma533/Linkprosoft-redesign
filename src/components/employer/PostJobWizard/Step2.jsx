import React from "react";
import StepBar from "../../common/StepBar";
import FieldLabel from "../../common/FieldLabel";
import WizardInput from "../../common/WizardInput";
import PillGroup from "../../common/PillGroup";
import NavButtons from "../../common/NavButtons";
import { BUDGET_TYPES } from "../../../constants/jobTaxonomy";

const URGENCY_OPTIONS = ["Urgent-24hrs", "This week", "Flexible"];

const Step2 = ({ data, onChange, onBack, onNext }) => {
  const currentBudgetType = data.budgetType || "workmanship";
  const selectedTypeObj =
    BUDGET_TYPES.find((t) => t.id === currentBudgetType) || BUDGET_TYPES[0];

  const canContinue = Boolean(
    data.budgetMin &&
    String(data.budgetMin).trim() &&
    data.budgetMax &&
    String(data.budgetMax).trim() &&
    data.urgency &&
    data.location &&
    data.location.trim()
  );

  return (
    <div>
      <StepBar total={3} current={2} />
      <p className="text-sm font-semibold text-[#016EA6] mb-3">Step 2 of 3</p>
      <h1 className="text-3xl font-light text-gray-900 mb-1">What is your budget and timeline?</h1>
      <p className="text-sm text-gray-400 mb-8">Help us match you with pros in your range</p>

      <div className="space-y-7">
        {/* Budget Type Specification */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <FieldLabel>Budget Type</FieldLabel>
            <span className="text-xs text-gray-400 font-medium">Specify workmanship or turnkey</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {BUDGET_TYPES.map((type) => {
              const isSelected = currentBudgetType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onChange("budgetType", type.id)}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#016EA6] bg-[#EEF5F9] text-[#016EA6] shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <span className="text-sm font-semibold">{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contextual Explainer Note */}
          <div className="mt-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
            <span className="text-[#016EA6] font-bold">Note:</span>
            <span>{selectedTypeObj.description}</span>
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <FieldLabel>Budget Range (₦)</FieldLabel>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <WizardInput
              placeholder="Min amount"
              value={data.budgetMin}
              onChange={(v) => onChange("budgetMin", v)}
              type="number"
            />
            <WizardInput
              placeholder="Max amount"
              value={data.budgetMax}
              onChange={(v) => onChange("budgetMax", v)}
              type="number"
            />
          </div>
        </div>

        {/* Urgency */}
        <div>
          <FieldLabel>Urgency</FieldLabel>
          <PillGroup
            options={URGENCY_OPTIONS}
            value={data.urgency}
            onChange={(v) => onChange("urgency", v)}
          />
        </div>

        {/* Location */}
        <div>
          <FieldLabel>Location</FieldLabel>
          <div className="mt-2 max-w-sm">
            <WizardInput
              placeholder="e.g. Port Harcourt, Rivers State"
              value={data.location}
              onChange={(v) => onChange("location", v)}
            />
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onContinue={onNext} disableContinue={!canContinue} />
    </div>
  );
};

export default Step2;
