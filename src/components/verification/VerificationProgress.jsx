const steps = ["Identity", "Professional", "Face", "Payment"];

const VerificationProgress = ({ activeStep }) => {
  return (
    <div
      className="mx-auto flex w-full max-w-[180px] flex-col items-center gap-2"
      aria-label={`Step ${activeStep} of 4`}
    >
      <div className="flex w-full items-center gap-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full ${
              index < activeStep ? "bg-[#0879aa]" : "bg-[#e2e4e5]"
            }`}
          />
        ))}
      </div>

      <span className="text-[10px] text-[#0879aa]">
        Step {activeStep} of 4
      </span>
    </div>
  );
};

export default VerificationProgress;