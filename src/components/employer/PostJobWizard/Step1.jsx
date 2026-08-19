import React, { useEffect, useRef, useState } from "react";
import StepBar from "../../common/StepBar";
import PillGroup from "../../common/PillGroup";
import FieldLabel from "../../common/FieldLabel";
import WizardInput from "../../common/WizardInput";
import WizardTextarea from "../../common/WizardTextarea";
import NavButtons from "../../common/NavButtons";

const CATEGORIES = ["Home Services", "Design", "Tech", "Events"];
const SKILLS = ["Plumber", "Carpenter", "Electrician", "Painter", "Mason", "Welder"];

const Step1 = ({ data, onChange, onBack, onNext }) => {
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const skillDropdownRef = useRef(null);
  const canContinue = data.title.trim().length > 0 && data.category;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setIsSkillOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <FieldLabel>Skillset</FieldLabel>
          <div ref={skillDropdownRef} className="relative mt-3 w-fit">
            <button
              type="button"
              onClick={() => setIsSkillOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isSkillOpen}
              className={`flex min-w-[108px] items-center justify-between gap-3 rounded-full border bg-white px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#016EA6]/10 ${
                isSkillOpen
                  ? "border-[#016EA6] text-[#016EA6] shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              <span>{data.skill || "Select skill"}</span>
              <svg
                className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${isSkillOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            <div
              role="listbox"
              aria-label="Select skillset"
              className={`absolute left-0 top-full z-20 mt-2 w-full min-w-[168px] origin-top rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg shadow-gray-200/60 transition-all duration-200 ${
                isSkillOpen
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  role="option"
                  aria-selected={data.skill === skill}
                  onClick={() => {
                    onChange("skill", skill);
                    setIsSkillOpen(false);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                    data.skill === skill
                      ? "bg-[#EEF5F9] font-semibold text-[#016EA6]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
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
