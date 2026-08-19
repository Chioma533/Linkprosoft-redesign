import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import Step1 from "../../components/employer/PostJobWizard/Step1";
import Step2 from "../../components/employer/PostJobWizard/Step2";
import Step3 from "../../components/employer/PostJobWizard/Step3";
import SuccessModal from "../../components/employer/PostJobWizard/SuccessModal";
import { jobService } from "../../api/services/jobService";
import DashboardNavbar from "../../components/layout/DashboardNavbar";

const INITIAL_DATA = {
  title: "",
  category: "",
  skill: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map urgency option to durationDays
      let durationDays = 7;
      if (data.urgency === "Urgent-24hrs") durationDays = 1;
      else if (data.urgency === "This week") durationDays = 7;
      else if (data.urgency === "Flexible") durationDays = 14;

      const payload = {
        title: data.title,
        category: data.category || undefined,
        skill: data.skill || undefined,
        description: data.description,
        budget: data.budgetMax ? Number(data.budgetMax) : data.budgetMin ? Number(data.budgetMin) : undefined,
        currency: "NGN",
        durationDays,
        location: data.location || undefined,
        visibility: "public",
      };

      const response = await jobService.createJob(payload);
      if (response && (response.success || response.data)) {
        toast.success(response.message || "Job posted successfully!");
        setSubmitted(true);
      } else {
        toast.error(response?.message || "Failed to post job");
      }
    } catch (err) {
      console.error("Failed to post job:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to post job. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <DashboardNavbar title="post a job" onMenuClick={onClose} />

        <div className="flex justify-end px-6 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-4">
          <div className="w-full max-w-xl">
            {step === 1 && <Step1 data={data} onChange={handleChange} onBack={onClose} onNext={() => setStep(2)} />}
            {step === 2 && <Step2 data={data} onChange={handleChange} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && (
              <Step3
                data={data}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                onGoToStep={(s) => setStep(s)}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>

      {submitted && <SuccessModal onGoHome={handleGoHome} />}
    </>
  );
};

export default PostJobWizard;

