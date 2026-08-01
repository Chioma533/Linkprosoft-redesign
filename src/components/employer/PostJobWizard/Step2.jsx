import React from "react";
import StepBar from "../../common/StepBar";
import FieldLabel from "../../common/FieldLabel";
import WizardInput from "../../common/WizardInput";
import PillGroup from "../../common/PillGroup";
import NavButtons from "../../common/NavButtons";

const URGENCY_OPTIONS = ["Urgent-24hrs", "This week", "Flexible"];

const Step2 = ({ data, onChange, onBack, onNext }) => {
  const canContinue = data.budgetMin.trim() && data.budgetMax.trim() && data.urgency && data.location.trim();

  return (
    <div>
      <StepBar total={3} current={2} />
      <p className="text-sm font-semibold text-[#016EA6] mb-3">Step 2 of 3</p>
      <h1 className="text-3xl font-light text-gray-900 mb-1">What your budget and timeline?</h1>
      <p className="text-sm text-gray-400 mb-8">Help us match you with pros in your range</p>

      <div className="space-y-7">
        <div>
          <FieldLabel>Budget</FieldLabel>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <WizardInput placeholder="Min" value={data.budgetMin} onChange={(v) => onChange("budgetMin", v)} type="number" />
            <WizardInput placeholder="Max" value={data.budgetMax} onChange={(v) => onChange("budgetMax", v)} type="number" />
          </div>
        </div>

        <div>
          <FieldLabel>Urgency</FieldLabel>
          <PillGroup options={URGENCY_OPTIONS} value={data.urgency} onChange={(v) => onChange("urgency", v)} />
        </div>

        <div>
          <FieldLabel>Location</FieldLabel>
          <div className="mt-2 max-w-xs">
            <WizardInput placeholder="Port Harcourt, Rivers State" value={data.location} onChange={(v) => onChange("location", v)} />
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onContinue={onNext} disableContinue={!canContinue} />
    </div>
  );
};

export default Step2;
