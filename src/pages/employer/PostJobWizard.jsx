import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Step1 from "../../components/employer/PostJobWizard/Step1";
import Step2 from "../../components/employer/PostJobWizard/Step2";
import Step3 from "../../components/employer/PostJobWizard/Step3";
import SuccessModal from "../../components/employer/PostJobWizard/SuccessModal";

const INITIAL_DATA = {
  title: "",
  category: "",
  description: "",
  budgetMin: "",
  budgetMax: "",
  urgency: "",
  location: "",
};

const PostJobWizard = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = () => setSubmitted(true);
  const handleGoHome = () => {
    setSubmitted(false);
    setData(INITIAL_DATA);
    setStep(1);
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#F3F4F6] overflow-y-auto flex flex-col">
        <div className="flex justify-end px-6 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-4">
          <div className="w-full max-w-xl">
            {step === 1 && <Step1 data={data} onChange={handleChange} onBack={onClose} onNext={() => setStep(2)} />}
            {step === 2 && <Step2 data={data} onChange={handleChange} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <Step3 data={data} onBack={() => setStep(2)} onSubmit={handleSubmit} onGoToStep={(s) => setStep(s)} />}
          </div>
        </div>
      </div>

      {submitted && <SuccessModal onGoHome={handleGoHome} />}
    </>
  );
};

export default PostJobWizard;
