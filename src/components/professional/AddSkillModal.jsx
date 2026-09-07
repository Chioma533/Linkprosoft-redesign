import React, { useState, useEffect, useMemo } from "react";
import { X, Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { profileService } from "../../api/services/profileService";
import { toast } from "react-hot-toast";

const PROFICIENCY_OPTIONS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "expert", label: "Expert" },
];

const EXPERIENCE_PRESETS = [1, 3, 5, 7];

const AddSkillModal = ({ isOpen, onClose, existingSkills = [], onSkillAdded }) => {
  const [catalog, setCatalog] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Form State
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("beginner");
  const [yearsOfExperience, setYearsOfExperience] = useState(1);
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch catalog on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchCatalog = async () => {
      setIsLoadingCatalog(true);
      try {
        const list = await profileService.getSkillsCatalog();
        if (isMounted) {
          setCatalog(list || []);
          // Auto-select first available skill if not selected
          const existingIds = new Set(
            existingSkills.map((s) => s.skillId || s.id || s.skill?.id)
          );
          const firstAvailable = list.find((s) => !existingIds.has(s.id));
          if (firstAvailable && !selectedSkillId) {
            setSelectedSkillId(firstAvailable.id);
          }
        }
      } catch (err) {
        console.warn("Failed to load skills catalog", err);
      } finally {
        if (isMounted) setIsLoadingCatalog(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [isOpen, existingSkills, selectedSkillId]);

  // Set of already added skill IDs / names for deduping
  const existingSkillIds = useMemo(() => {
    return new Set(
      existingSkills
        .map((s) => s.skillId || s.id || s.skill?.id || s.name || s.title)
        .filter(Boolean)
    );
  }, [existingSkills]);

  // Categories extracted from catalog
  const categories = useMemo(() => {
    const cats = new Set(["All"]);
    catalog.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [catalog]);

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return catalog.filter((skill) => {
      const matchesSearch =
        skill.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.description &&
          skill.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [catalog, searchQuery, selectedCategory]);

  const selectedSkill = useMemo(() => {
    return catalog.find((s) => s.id === selectedSkillId) || null;
  }, [catalog, selectedSkillId]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!selectedSkillId) {
      toast.error("Please select a skill from the list");
      return;
    }

    const yearsNum = Number(yearsOfExperience);
    if (isNaN(yearsNum) || yearsNum < 0) {
      toast.error("Please enter a valid number of years of experience");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      skillId: selectedSkillId,
      proficiencyLevel,
      yearsOfExperience: yearsNum,
      isPrimary: Boolean(isPrimary),
    };

    try {
      const res = await profileService.addMySkill(payload);
      toast.success(
        `${selectedSkill?.name || "Skill"} added to your profile!`
      );
      if (onSkillAdded) {
        const newSkillObj = {
          id: selectedSkillId,
          skillId: selectedSkillId,
          name: selectedSkill?.name,
          category: selectedSkill?.category,
          description: selectedSkill?.description,
          proficiencyLevel,
          yearsOfExperience: yearsNum,
          isPrimary: Boolean(isPrimary),
          ...(typeof res === "object" ? res : {}),
        };
        onSkillAdded(newSkillObj);
      }
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add skill. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Dim/dull backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Full Viewport Height Sliding Drawer Modal */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ transformOrigin: "right center" }}
            className="fixed inset-y-0 right-0 z-50 h-full w-full sm:max-w-xl md:max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 md:px-8 md:py-6 border-b border-gray-100 flex items-center justify-between gap-3 sm:gap-4 bg-white shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                {/* Megaphone / Horn icon badge */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                  <svg
                    width="20"
                    height="20"
                    className="sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#016EA6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 leading-tight truncate sm:whitespace-normal">
                    Add Skill to Profile
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-normal mt-0.5 leading-snug truncate sm:whitespace-normal">
                    Showcase your expertise and get matched with relevant client projects
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Skill draft saved");
                    onClose();
                  }}
                  className="text-xs sm:text-sm font-semibold text-[#1E1B4B] hover:text-[#016EA6] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 sm:p-1.5 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6"
            >
              {/* Select Skill Section */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-base sm:text-xl font-bold text-[#1E1B4B] tracking-tight">
                  Select Skill
                </h4>

                {/* Search Bar */}
                <div className="bg-[#F8F9FA] rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex items-center border border-transparent focus-within:border-gray-200 transition-all">
                  <input
                    type="text"
                    placeholder="Search skills e.g carpentry, Plumbing"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none font-normal"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                          isActive
                            ? "bg-[#016EA6] text-white shadow-xs"
                            : "bg-[#F3F4F6] text-gray-600 hover:bg-gray-200/80"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Skill Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                  {isLoadingCatalog ? (
                    <div className="col-span-2 py-8 sm:py-12 text-center text-xs text-gray-400">
                      Loading available skills...
                    </div>
                  ) : filteredSkills.length === 0 ? (
                    <div className="col-span-2 py-8 sm:py-12 text-center text-xs text-gray-400">
                      No skills match your search
                    </div>
                  ) : (
                    filteredSkills.map((skill) => {
                      const isSelected = selectedSkillId === skill.id;
                      const alreadyAdded =
                        existingSkillIds.has(skill.id) ||
                        existingSkillIds.has(skill.name);

                      return (
                        <button
                          key={skill.id}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => setSelectedSkillId(skill.id)}
                          className={`min-h-[85px] sm:min-h-[105px] rounded-xl sm:rounded-2xl p-3 sm:p-5 text-left transition-all cursor-pointer relative flex flex-col justify-start ${
                            isSelected
                              ? "border border-[#016EA6] bg-[#EAF4FB] shadow-xs"
                              : alreadyAdded
                              ? "border border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed"
                              : "border border-gray-200/90 bg-white hover:border-gray-300"
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-medium text-gray-900 leading-snug">
                            {skill.name}
                          </span>
                          {alreadyAdded && (
                            <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-1">
                              Already added
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Proficiency Level Section */}
              <div className="space-y-2 sm:space-y-3 pt-1">
                <label className="text-[11px] sm:text-xs font-semibold text-gray-800 block">
                  Proficiency Level
                </label>
                <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
                  {PROFICIENCY_OPTIONS.map((opt) => {
                    const isSelected = proficiencyLevel === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setProficiencyLevel(opt.id)}
                        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
                      >
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-[#016EA6]"
                              : "border-gray-300 bg-gray-100 group-hover:border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#016EA6]" />
                          )}
                        </div>
                        <span className="text-[11px] sm:text-xs font-normal text-gray-800 capitalize">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Years of Experience Section */}
              <div className="space-y-2 sm:space-y-3 pt-1">
                <label className="text-[11px] sm:text-xs font-semibold text-gray-800 block">
                  Years of Experience
                </label>
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  {/* Custom Number Input */}
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-12 sm:w-14 h-8 sm:h-9 border border-gray-200 rounded-lg sm:rounded-xl text-center text-xs font-semibold text-gray-800 outline-none focus:border-[#016EA6] focus:bg-white bg-[#FAFAFA]"
                  />

                  {/* Preset Pills */}
                  {EXPERIENCE_PRESETS.map((preset) => {
                    const isSelected = Number(yearsOfExperience) === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setYearsOfExperience(preset)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-[11px] sm:text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#016EA6] bg-[#EAF4FB] text-[#016EA6] font-semibold"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {preset === 1 ? "1yr" : `${preset}yrs`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Skill Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#016EA6] rounded border-gray-300 focus:ring-[#016EA6] cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs font-medium text-gray-700 flex items-center gap-1">
                    Set as Primary Skill
                    <Star
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                        isPrimary
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  </span>
                </label>
              </div>
            </form>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 md:px-8 md:py-5 border-t border-gray-100 bg-white flex items-center gap-2.5 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-full bg-[#F8F9FA] hover:bg-gray-100 text-gray-800 font-semibold text-xs sm:text-sm transition-all text-center cursor-pointer border border-transparent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedSkillId}
                className="flex-1 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-full bg-[#016EA6] hover:bg-[#061EA6] text-white font-semibold text-xs sm:text-sm transition-all text-center cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Skill...
                  </>
                ) : (
                  "Add Skill to Profile"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSkillModal;
