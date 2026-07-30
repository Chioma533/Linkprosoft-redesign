import React, { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

// ─── Design tokens (matching project theme) ────────────────────────────────
const PRIMARY = "#016EA6";
const PRIMARY_DARK = "#061EA6";

// ─── Confetti particle (CSS-only) ─────────────────────────────────────────
const CONFETTI_COLORS = [
  "#016EA6", "#ef4444", "#22c55e", "#f59e0b",
  "#a855f7", "#ec4899", "#14b8a6",
];

const ConfettiPiece = ({ style }) => (
  <div
    className="absolute w-2 h-2 rounded-sm opacity-90"
    style={style}
  />
);

// ─── Step progress bar ─────────────────────────────────────────────────────
const StepBar = ({ total, current }) => (
  <div className="flex items-center gap-2 mb-5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="h-1.5 rounded-full transition-all duration-500"
        style={{
          flex: 1,
          backgroundColor: i < current ? PRIMARY : "#d1d5db",
        }}
      />
    ))}
  </div>
);

// ─── Pill selector ─────────────────────────────────────────────────────────
const PillGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2.5 mt-3">
    {options.map((opt) => {
      const active = value === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
            active
              ? "border-[#016EA6] text-[#016EA6] bg-white shadow-sm"
              : "border-gray-200 text-gray-600 bg-white hover:border-gray-400"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

// ─── Field label ───────────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <p className="text-sm font-semibold text-gray-800 mb-0">{children}</p>
);

// ─── Text input ────────────────────────────────────────────────────────────
const WizardInput = ({ placeholder, value, onChange, type = "text", className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#016EA6] focus:ring-2 focus:ring-[#016EA6]/10 transition-all duration-200 ${className}`}
  />
);

// ─── Textarea ─────────────────────────────────────────────────────────────
const WizardTextarea = ({ placeholder, value, onChange }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={5}
    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#016EA6] focus:ring-2 focus:ring-[#016EA6]/10 transition-all duration-200 resize-none"
  />
);

// ─── Nav buttons ──────────────────────────────────────────────────────────
const NavButtons = ({ onBack, onContinue, continueLabel = "Continue", disableContinue = false }) => (
  <div className="flex items-center gap-4 mt-8">
    <button
      type="button"
      onClick={onBack}
      className="flex-1 sm:flex-none sm:w-40 px-6 py-3.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer"
    >
      Go back
    </button>
    <button
      type="button"
      onClick={onContinue}
      disabled={disableContinue}
      className={`flex-1 sm:flex-none sm:w-52 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer ${
        disableContinue
          ? "bg-gray-200 cursor-not-allowed"
          : "bg-[#016EA6] hover:bg-[#061EA6] shadow-sm hover:shadow-md active:scale-[0.98]"
      }`}
    >
      {continueLabel}
    </button>
  </div>
);

// ─── Review row ──────────────────────────────────────────────────────────
const ReviewRow = ({ label, value, onEdit, noBorder = false }) => (
  <div className={`flex items-start justify-between py-5 ${noBorder ? "" : "border-b border-gray-100"}`}>
    <div>
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
    <button
      type="button"
      onClick={onEdit}
      className="text-sm font-semibold text-[#016EA6] hover:text-[#061EA6] transition-colors cursor-pointer shrink-0 ml-6"
    >
      Edit
    </button>
  </div>
);

// ─── Success modal ────────────────────────────────────────────────────────
const SuccessModal = ({ onGoHome }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden pt-8 pb-10 px-8 text-center">
        {/* Ribbon decoration at top */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none">
          <img
            src="/ribbon.png"
            alt="Ribbon banner"
            className="w-full object-cover max-h-36 opacity-90"
          />
        </div>

        {/* 3D Blue Tick Badge */}
        <div className="relative flex justify-center mb-5 pt-4 z-10">
          <img
            src="/3dbluetick.png"
            alt="Success checkmark"
            className="w-20 h-20 object-contain drop-shadow-md"
          />
        </div>

        <h2 className="relative z-10 text-lg font-bold text-gray-900 mb-2">
          Job posted Successfully!
        </h2>
        <p className="relative z-10 text-sm text-gray-400 leading-relaxed mb-8">
          We'll notify you when a professional<br />applies or contacts you.
        </p>

        <button
          onClick={onGoHome}
          className="relative z-10 w-full py-3.5 rounded-full bg-[#016EA6] hover:bg-[#061EA6] text-white text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

// ─── STEP 1 — What do you need done? ─────────────────────────────────────
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
        {/* Job Title */}
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

        {/* Category */}
        <div>
          <FieldLabel>Category</FieldLabel>
          <PillGroup
            options={CATEGORIES}
            value={data.category}
            onChange={(v) => onChange("category", v)}
          />
        </div>

        {/* Description */}
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

      <NavButtons
        onBack={onBack}
        onContinue={onNext}
        disableContinue={!canContinue}
      />
    </div>
  );
};

// ─── STEP 2 — Budget & Timeline ───────────────────────────────────────────
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
        {/* Budget */}
        <div>
          <FieldLabel>Budget</FieldLabel>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <WizardInput
              placeholder="Min"
              value={data.budgetMin}
              onChange={(v) => onChange("budgetMin", v)}
              type="number"
            />
            <WizardInput
              placeholder="Max"
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
          <div className="mt-2 max-w-xs">
            <WizardInput
              placeholder="Port Harcourt, Rivers State"
              value={data.location}
              onChange={(v) => onChange("location", v)}
            />
          </div>
        </div>
      </div>

      <NavButtons
        onBack={onBack}
        onContinue={onNext}
        disableContinue={!canContinue}
      />
    </div>
  );
};

// ─── STEP 3 — Review ──────────────────────────────────────────────────────
const Step3 = ({ data, onBack, onSubmit, onGoToStep }) => {
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

      {/* Top card — job title block */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-[#016EA6]">{data.category || "—"}</span>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-sm font-semibold text-[#016EA6] hover:text-[#061EA6] transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
        <h2 className="text-lg font-bold text-gray-900">{data.title || "—"}</h2>
        {data.description && (
          <p className="text-sm text-gray-400 mt-1 leading-relaxed">{data.description}</p>
        )}
      </div>

      {/* Detail rows */}
      <div className="border-t border-gray-100 mt-4">
        <ReviewRow
          label="Budget"
          value={formatBudget()}
          onEdit={() => onGoToStep(2)}
        />
        <ReviewRow
          label="Timeline"
          value={urgencyLabel()}
          onEdit={() => onGoToStep(2)}
        />
        <ReviewRow
          label="Location"
          value={data.location || "—"}
          onEdit={() => onGoToStep(2)}
          noBorder
        />
      </div>

      <NavButtons
        onBack={onBack}
        onContinue={onSubmit}
        continueLabel="Post Job"
      />
    </div>
  );
};

// ─── ROOT WIZARD COMPONENT ────────────────────────────────────────────────
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

  // Prevent body scroll while wizard open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
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
      {/* Full-screen overlay */}
      <div className="fixed inset-0 z-40 bg-[#F3F4F6] overflow-y-auto flex flex-col">
        {/* Close button */}
        <div className="flex justify-end px-6 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Centred content panel */}
        <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-4">
          <div className="w-full max-w-xl">
            {step === 1 && (
              <Step1
                data={data}
                onChange={handleChange}
                onBack={onClose}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2
                data={data}
                onChange={handleChange}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <Step3
                data={data}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                onGoToStep={(s) => setStep(s)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Success modal */}
      {submitted && <SuccessModal onGoHome={handleGoHome} />}
    </>
  );
};

export default PostJobWizard;
