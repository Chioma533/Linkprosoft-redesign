import React from "react";
import StepBar from "../../common/StepBar";
import PillGroup from "../../common/PillGroup";
import FieldLabel from "../../common/FieldLabel";
import WizardInput from "../../common/WizardInput";
import WizardTextarea from "../../common/WizardTextarea";
import NavButtons from "../../common/NavButtons";

const CATEGORIES = ["Home Services", "Design", "Tech", "Events"];

const Step1 = ({ data, onChange, onBack, onNext }) => {
  const canContinue = data.title.trim().length > 0 && data.category;

  return (
    <div>
      <StepBar total={3} current={1} />
      <p className="text-sm font-semibold text-[#016EA6] mb-3">Step 1 of 3</p>
      <h1 className="text-3xl font-light text-gray-900 mb-1">What do you need done?</h1>
      <p className="text-sm text-gray-400 mb-8">Be specific, clearer jobs attract better matched pros.</p>

      <div className="space-y-7">
        <div>
          <FieldLabel>Job Title</FieldLabel>
          <div className="mt-2">
            <WizardInput
              placeholder="e.g. Fix a leaking pipe"
              value={data.title}
              onChange={(v) => onChange("title", v)}
            />
          </div>
        </div>

        <div>
          <FieldLabel>Category</FieldLabel>
          <PillGroup options={CATEGORIES} value={data.category} onChange={(v) => onChange("category", v)} />
        </div>

        <div>
          <FieldLabel>Description</FieldLabel>
          <div className="mt-2">
            <WizardTextarea
              placeholder="Describe the job and any details the pro should know."
              value={data.description}
              onChange={(v) => onChange("description", v)}
            />
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onContinue={onNext} disableContinue={!canContinue} />
    </div>
  );
};

export default Step1;
