import React, { useState, useEffect, useMemo } from "react";
import { X, Search, Check, Sparkles, Star, Award, Clock, Layers } from "lucide-react";
import { profileService } from "../../api/services/profileService";
import { toast } from "react-hot-toast";

const PROFICIENCY_OPTIONS = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Basic knowledge & assisted work",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Independent execution & solid experience",
  },
  {
    id: "expert",
    label: "Expert",
    description: "Mastery & complex problem solving",
  },
];

const EXPERIENCE_PRESETS = [1, 2, 3, 5, 7, 10];

const AddSkillModal = ({ isOpen, onClose, existingSkills = [], onSkillAdded }) => {
  const [catalog, setCatalog] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Form State
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("expert");
  const [yearsOfExperience, setYearsOfExperience] = useState(7);
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
          if (firstAvailable) {
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
  }, [isOpen, existingSkills]);

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      proficiencyLevel: proficiencyLevel,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[92vh] overflow-y-auto border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Add Skill to Profile</h3>
            <p className="text-xs text-gray-400 font-medium">
              Showcase your expertise and get matched with relevant client projects
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Skill Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#016EA6]" />
                Select Skill
              </label>
              <span className="text-[11px] text-gray-400 font-medium">
                {catalog.length} available
              </span>
            </div>

            {/* Search and Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search skills e.g. Carpentry, Plumbing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-[#016EA6] focus:bg-white transition-all"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                      selectedCategory === cat
                        ? "bg-[#016EA6] text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Catalog Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-100 rounded-2xl bg-gray-50/40">
              {isLoadingCatalog ? (
                <div className="col-span-2 py-8 text-center text-xs text-gray-400">
                  Loading skills catalog...
                </div>
              ) : filteredSkills.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-xs text-gray-400">
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
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? "border-[#016EA6] bg-[#016EA6]/5 shadow-xs ring-1 ring-[#016EA6]"
                          : alreadyAdded
                          ? "border-gray-200 bg-gray-100/60 opacity-60 cursor-not-allowed"
                          : "border-gray-200 bg-white hover:border-[#016EA6]/50 hover:bg-gray-50/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-gray-800 leading-tight">
                          {skill.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#016EA6] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3px]" />
                          </div>
                        )}
                        {alreadyAdded && !isSelected && (
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                            Added
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {skill.category || "General"}
                        </span>
                      </div>
                      {skill.description && (
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-1 font-normal">
                          {skill.description}
                        </p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Step 2: Proficiency Level */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#016EA6]" />
              Proficiency Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PROFICIENCY_OPTIONS.map((opt) => {
                const isSelected = proficiencyLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProficiencyLevel(opt.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "border-[#016EA6] bg-[#016EA6]/5 ring-1 ring-[#016EA6]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-bold capitalize text-gray-900">
                      {opt.label}
                    </span>
                    <span className="text-[9px] text-gray-400 leading-tight">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Years of Experience */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#016EA6]" />
                Years of Experience
              </label>
              <span className="text-xs font-bold text-[#016EA6]">
                {yearsOfExperience} {Number(yearsOfExperience) === 1 ? "year" : "years"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="50"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="w-24 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-[#016EA6] focus:bg-white text-center"
              />

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {EXPERIENCE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setYearsOfExperience(preset)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      Number(yearsOfExperience) === preset
                        ? "bg-[#016EA6] text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {preset} {preset === 1 ? "yr" : "yrs"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: Primary Skill Toggle */}
          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/60 flex items-start gap-3">
            <input
              id="isPrimaryCheckbox"
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#016EA6] rounded border-gray-300 focus:ring-[#016EA6] cursor-pointer"
            />
            <label htmlFor="isPrimaryCheckbox" className="cursor-pointer select-none">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-900">
                  Set as Primary Skill
                </span>
                <Star className={`w-3.5 h-3.5 ${isPrimary ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Highlights this skill at the top of your public profile and prioritizes you in client matching searches.
              </p>
            </label>
          </div>

          {/* Live Preview Card */}
          {selectedSkill && (
            <div className="p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Live Profile Badge Preview
              </span>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-2xs">
                  {isPrimary && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      Primary
                    </span>
                  )}
                  <span className="text-xs font-bold text-gray-800">
                    {selectedSkill.name}
                  </span>
                  <span className="text-[10px] font-semibold capitalize text-[#016EA6] bg-[#016EA6]/10 px-2 py-0.5 rounded-full">
                    {proficiencyLevel}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {yearsOfExperience} {Number(yearsOfExperience) === 1 ? "yr" : "yrs"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedSkillId}
              className="px-6 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
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
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
