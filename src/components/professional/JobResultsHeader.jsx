import React from "react";
import { FiZap } from "react-icons/fi";

const JobResultsHeader = ({
  selectedSkillName,
  filteredJobsCount,
  isLoadingJobs,
  skills,
  selectedSkillId,
  onSkillChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Related to{" "}
          <span className="text-[#016EA6]">
            &ldquo;
            {selectedSkillName ||
              skills[0]?.name ||
              skills[0]?.skill?.name ||
              "Your Skills"}
            &rdquo;
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          {isLoadingJobs
            ? "Loading jobs..."
            : `${filteredJobsCount} ${
                filteredJobsCount === 1 ? "job" : "jobs"
              } available`}
        </p>
      </div>

      {skills.length > 1 && (
        <div className="hidden md:flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 mr-1">
            Filter by skill:
          </span>

          {skills.map((skill) => {
            const skillId = skill.skillId || skill.id;
            const skillName = skill.name || skill.skill?.name || "Skill";

            const isActive = selectedSkillId === skillId;

            return (
              <button
                key={skillId}
                type="button"
                onClick={() => onSkillChange(skillId, skillName)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#016EA6] text-white border-[#016EA6] shadow-xs"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#016EA6]"
                }`}
              >
                <FiZap
                  className={`w-3 h-3 ${
                    isActive ? "text-amber-300 fill-current" : "text-gray-400"
                  }`}
                />

                <span>{skillName}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobResultsHeader;
