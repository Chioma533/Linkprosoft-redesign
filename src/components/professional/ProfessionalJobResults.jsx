import React from "react";
import { FiBriefcase, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import JobCard from "./JobCard";

const ProfessionalJobResults = ({
  isLoadingJobs,
  proSkills,
  paginatedJobs,
  filteredJobs,
  filters,
  selectedSkillName,
  selectedSkillId,
  onApply,
  onSave,
  onResetFilters,
  onRefresh,
}) => {
  if (isLoadingJobs) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#016EA6] mb-3" />

        <p className="text-sm font-medium text-gray-500">
          Loading jobs matching your skillset...
        </p>
      </div>
    );
  }

  if (proSkills.length === 0) {
    return (
      <div className="py-16 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center mb-3">
          <FiBriefcase className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-1">
          No Skills Registered Yet
        </h3>

        <p className="text-xs text-gray-500 max-w-md mb-4">
          Add your professional skills to your profile to view matching job
          openings and opportunities tailored to your trade.
        </p>

        <Link
          to="/professional/dashboard"
          className="px-5 py-2 bg-[#016EA6] hover:bg-[#015885] text-white rounded-full text-xs font-semibold transition-colors"
        >
          Add Skills to Profile
        </Link>
      </div>
    );
  }

  if (paginatedJobs.length === 0) {
    const hasActiveFilters =
      filters.searchQuery ||
      filters.location ||
      filters.budget ||
      filters.datePosted;

    return (
      <div className="py-16 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
          <FiBriefcase className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-1">
          No Matching Jobs Found
        </h3>

        <p className="text-xs text-gray-500 max-w-md mb-4">
          {hasActiveFilters
            ? "No jobs match your active filter criteria. Try expanding your search or resetting filters."
            : `There are currently no open jobs posted for “${
                selectedSkillName || "your skill"
              }”. New requests from employers will appear here automatically.`}
        </p>

        {hasActiveFilters ? (
          <button
            onClick={onResetFilters}
            className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        ) : (
          <button
            onClick={() => onRefresh(selectedSkillId)}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#016EA6] hover:bg-[#015885] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Openings</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      id="jobs-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
    >
      {paginatedJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onApply={onApply}
          onSave={(val) => onSave(job, val)}
        />
      ))}
    </div>
  );
};

export default ProfessionalJobResults;
