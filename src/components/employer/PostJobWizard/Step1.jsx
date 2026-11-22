import React, { useEffect, useMemo, useRef, useState } from "react";
import StepBar from "../../common/StepBar";
import PillGroup from "../../common/PillGroup";
import FieldLabel from "../../common/FieldLabel";
import WizardInput from "../../common/WizardInput";
import WizardTextarea from "../../common/WizardTextarea";
import NavButtons from "../../common/NavButtons";
import { jobService } from "../../../api/services/jobService";
import {
  JOB_CATEGORIES,
  ALL_DEFAULT_SKILLS,
  getSkillsForCategory,
} from "../../../constants/jobTaxonomy";

const Step1 = ({ data, onChange, onBack, onNext }) => {
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [skillsCatalog, setSkillsCatalog] = useState(ALL_DEFAULT_SKILLS);
  const [skillSearch, setSkillSearch] = useState("");
  const skillDropdownRef = useRef(null);

  const isOtherCategory = data.category === "Other";
  const hasTitle = Boolean(data.title && data.title.trim().length > 0);
  const hasCategory = isOtherCategory
    ? Boolean(data.customCategory && data.customCategory.trim().length > 0)
    : Boolean(data.category);
  const hasSkill = isOtherCategory ? true : Boolean(data.skill);
  const canContinue = hasTitle && hasCategory && hasSkill;

  // Load skills catalog from backend
  useEffect(() => {
    let isMounted = true;
    const loadCatalog = async () => {
      try {
        const catalog = await jobService.getSkillsCatalog();
        if (isMounted && Array.isArray(catalog) && catalog.length > 0) {
          setSkillsCatalog(catalog);
        }
      } catch (err) {
        console.warn("Using default skills catalog fallback:", err.message);
      }
    };
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setIsSkillOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (selectedCategory) => {
    onChange("category", selectedCategory);
    // Reset skill and search whenever the category changes
    onChange("skill", "");
    onChange("skillId", "");
    setSkillSearch("");
    if (selectedCategory !== "Other") {
      onChange("customCategory", "");
    }
  };

  const categorySkills = useMemo(() => {
    return getSkillsForCategory(data.category, skillsCatalog);
  }, [data.category, skillsCatalog]);

  const filteredSkills = useMemo(() => {
    if (!skillSearch.trim()) return categorySkills;
    const query = skillSearch.toLowerCase();
    return categorySkills.filter((s) => {
      const name = s.name || s.title || "";
      return name.toLowerCase().includes(query);
    });
  }, [categorySkills, skillSearch]);

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
          <PillGroup
            options={JOB_CATEGORIES}
            value={data.category}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Custom Category input if "Other" is selected */}
        {isOtherCategory && (
          <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-4">
            <div>
              <FieldLabel>Specify Category *</FieldLabel>
              <div className="mt-2">
                <WizardInput
                  placeholder="e.g. Agriculture, Legal, Automobile, Logistics..."
                  value={data.customCategory || ""}
                  onChange={(v) => onChange("customCategory", v)}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Specific Skill or Role (Optional)</FieldLabel>
              <div className="mt-2">
                <WizardInput
                  placeholder="e.g. Tractor Driver, Conveyance Lawyer..."
                  value={data.skill || ""}
                  onChange={(v) => {
                    onChange("skill", v);
                    onChange("skillId", "custom-other-skill");
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Category-Filtered Skillset Dropdown (for predefined categories) */}
        {!isOtherCategory && (
          <div>
            <FieldLabel>Skillset</FieldLabel>
            <p className="text-xs text-gray-400 mb-2">
              {data.category
                ? `Showing skills for ${data.category}`
                : "Select a category above to view available skills"}
            </p>
            <div ref={skillDropdownRef} className="relative w-fit">
              <button
                type="button"
                onClick={() => {
                  if (data.category) {
                    setIsSkillOpen((open) => !open);
                  }
                }}
                aria-haspopup="listbox"
                aria-expanded={isSkillOpen}
                disabled={!data.category}
                className={`flex min-w-[160px] items-center justify-between gap-3 rounded-full border bg-white px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#016EA6]/10 ${
                  !data.category
                    ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                    : isSkillOpen
                    ? "border-[#016EA6] text-[#016EA6] shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                <span>{data.skill || (data.category ? "Select skill" : "Choose category first")}</span>
                <svg
                  className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
                    isSkillOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div
                role="listbox"
                aria-label="Select skillset"
                className={`absolute left-0 top-full z-20 mt-2 w-full min-w-[240px] max-h-64 overflow-y-auto origin-top rounded-2xl border border-gray-100 bg-white p-2 shadow-lg shadow-gray-200/60 transition-all duration-200 ${
                  isSkillOpen
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                {categorySkills.length > 5 && (
                  <div className="pb-2 mb-1 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Filter skills..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#016EA6]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                {filteredSkills.length === 0 ? (
                  <p className="text-xs text-gray-400 py-3 text-center">No matching skills found</p>
                ) : (
                  filteredSkills.map((s) => {
                    const sName = s.name || s.title || s;
                    const sId = s.id || s.skillId || s;
                    return (
                      <button
                        key={sId}
                        type="button"
                        role="option"
                        aria-selected={data.skill === sName}
                        onClick={() => {
                          onChange("skill", sName);
                          onChange("skillId", sId);
                          setIsSkillOpen(false);
                        }}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                          data.skill === sName
                            ? "bg-[#EEF5F9] font-semibold text-[#016EA6]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {sName}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

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
