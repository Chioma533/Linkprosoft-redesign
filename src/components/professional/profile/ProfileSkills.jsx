import React from "react";
import { Plus, Star, X } from "lucide-react";

const getSkillName = (skill) =>
  skill?.name || skill?.skill?.name || skill?.title || (typeof skill === "string" ? skill : "");

const getSkillId = (skill) => skill?.skillId || skill?.id || skill?.skill?.id;

const ProfileSkills = ({
  skills,
  isDeletingSkillId,
  onAdd,
  onDelete,
  highlightSection,
}) => (
  <section
    id="profile-skills-section"
    className={`space-y-4 rounded-3xl border border-gray-100/50 bg-white p-6 shadow-xs transition-all duration-300 ${
      highlightSection === "skills" ? "border-2 border-[#016EA6] shadow-md ring-4 ring-[#016EA6]/30" : ""
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-900">Skills and Services</h3>
        {skills.length ? <span className="rounded-full bg-[#016EA6]/10 px-2 py-0.5 text-[10px] font-bold text-[#016EA6]">{skills.length}</span> : null}
      </div>
      <button type="button" onClick={onAdd} className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#016EA6]/10 px-3 py-1.5 text-xs font-bold text-[#016EA6] transition-all hover:bg-[#016EA6]/20">
        <Plus className="h-3.5 w-3.5" /> Add Skill
      </button>
    </div>

    {skills.length ? (
      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill, index) => {
          const skillName = getSkillName(skill);
          const skillId = getSkillId(skill);
          const isPrimary = Boolean(skill?.isPrimary || skill?.primary);
          const proficiency = skill?.proficiencyLevel || skill?.level;
          const years = skill?.yearsOfExperience;
          return (
            <div key={skillId || skillName || index} className="group inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-xs shadow-2xs transition-all hover:border-[#016EA6]/40 hover:bg-gray-50/70">
              {isPrimary ? <span className="flex items-center gap-0.5 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-600"><Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Primary</span> : null}
              <span className="font-bold text-gray-800">{skillName || "Skill"}</span>
              {proficiency ? <span className="rounded-full bg-[#016EA6]/10 px-1.5 py-0.5 text-[9px] font-semibold capitalize text-[#016EA6]">{proficiency}</span> : null}
              {years !== undefined && years !== null ? <span className="text-[9px] font-medium text-gray-400">{years} {Number(years) === 1 ? "yr" : "yrs"}</span> : null}
              {skillId ? (
                <button
                  type="button"
                  title={`Remove ${skillName || "skill"}`}
                  aria-label={`Remove ${skillName || "skill"}`}
                  disabled={isDeletingSkillId === skillId}
                  onClick={() => onDelete(skill)}
                  className="-mr-1 cursor-pointer rounded-full p-0.5 text-gray-400 opacity-40 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:cursor-wait"
                >
                  {isDeletingSkillId === skillId ? <span className="block h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /> : <X className="h-3 w-3" />}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-8 text-center">
        <p className="text-xs font-medium text-gray-400">No skills declared yet.</p>
        <button type="button" onClick={onAdd} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#016EA6] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#061EA6]">
          <Plus className="h-3.5 w-3.5" /> Add Your First Skill
        </button>
      </div>
    )}
  </section>
);

export default ProfileSkills;
