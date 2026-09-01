import React from "react";

const steps = ["Identity", "Professional", "Face", "Payment"];

const VerificationProgress = ({
  activeStep = 1,
  completedSteps = [],
  highestReachedStep = 1,
  onStepClick,
}) => {
  return (
    <div
      className="mx-auto flex w-full max-w-[180px] flex-col items-center gap-2"
      aria-label={`Step ${activeStep} of 4`}
    >
      <div className="flex w-full items-center gap-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isUnlocked = stepNum <= highestReachedStep || completedSteps.includes(step.toLowerCase());
          const isActiveOrCompleted = index < activeStep;

          return (
            <button
              key={step}
              type="button"
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onStepClick && onStepClick(stepNum, step.toLowerCase())}
              title={
                isUnlocked
                  ? `Switch to ${step}`
                  : `Complete earlier steps first`
              }
              className={`h-1 flex-1 rounded-full transition-all ${
                isActiveOrCompleted ? "bg-[#0879aa]" : "bg-[#e2e4e5]"
              } ${isUnlocked ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
            />
          );
        })}
      </div>

      <span className="text-[10px] text-[#0879aa]">
        Step {activeStep} of 4
      </span>
    </div>
  );
};

export default VerificationProgress;