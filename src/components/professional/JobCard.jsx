import React, { useState } from "react";
import { FiBookmark } from "react-icons/fi";

/**
 * JobCard — matches the Figma design for the "Default Professional Screen"
 * Shows: employer avatar, job title, "Posted X ago" timestamp (teal), bookmark icon,
 *        description text, budget (₦), Apply button.
 * First card in page 1 gets a blue left-border selected state if isSelected is true.
 */
const JobCard = ({
  job,
  id,
  title,
  employerName,
  employerAvatarUrl,
  postedAgo,
  description,
  budget,
  isSaved,
  isSelected = false,
  showBorder = true,
  onApply,
  onSave,
  ...rest
}) => {
  const currentJob = job || {
    id,
    title,
    employerName,
    employerAvatarUrl,
    postedAgo,
    description,
    budget,
    isSaved,
    isSelected,
    showBorder,
    ...rest,
  };

  const [saved, setSaved] = useState(
    currentJob?.isSaved || currentJob?.isBookmarked || isSaved || false
  );
  const [isApplying, setIsApplying] = useState(false);

  const displayTitle = currentJob?.title || "Job Posting";
  const displayEmployerName =
    currentJob?.employerName ||
    currentJob?.client?.fullName ||
    currentJob?.client ||
    currentJob?.employer?.fullName ||
    currentJob?.employer?.name ||
    "Client";

  const displayAvatarUrl =
    currentJob?.employerAvatarUrl ||
    currentJob?.avatarUrl ||
    currentJob?.employer?.avatarUrl ||
    currentJob?.client?.avatarUrl ||
    "/professional_avatar.png";

  const displayDescription =
    currentJob?.description || "No job description provided.";

  const displayPostedAgo = (() => {
    if (currentJob?.postedAgo) return currentJob.postedAgo;
    if (currentJob?.postedAt) return currentJob.postedAt;
    if (currentJob?.createdAt) {
      const date = new Date(currentJob.createdAt);
      if (!isNaN(date.getTime())) {
        const diffMs = Date.now() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 1) return "Posted just now";
        if (diffMins < 60)
          return `Posted ${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24)
          return `Posted ${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return "Posted yesterday";
        if (diffDays < 7) return `Posted ${diffDays} days ago`;
        return `Posted on ${date.toLocaleDateString()}`;
      }
    }
    return "Recently";
  })();

  const numBudget = Number(currentJob?.budget || currentJob?.budgetMax || 0);
  const cardId = currentJob?.id ?? id ?? "card";
  const cardSelected = currentJob?.isSelected ?? isSelected ?? false;
  const cardShowBorder = currentJob?.showBorder ?? showBorder ?? true;

  const handleSave = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    onSave?.(nextSaved, currentJob);
  };

  const handleApply = async () => {
    setIsApplying(true);
    await onApply?.(currentJob);
    setTimeout(() => setIsApplying(false), 700);
  };

  return (
    <article
      id={`job-card-${cardId}`}
      className={`bg-[#f9f9f9] rounded-2xl transition-all duration-300 flex flex-col overflow-hidden group relative ${
        cardShowBorder
          ? `border hover:border-[#016EA6] ${
              cardSelected
                ? "border-[#016EA6] border-l-4"
                : "border-transparent"
            }`
          : ""
      }`}
    >
      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header: employer avatar + title/timestamp + save button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Employer avatar */}
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
              <img
                src={displayAvatarUrl}
                alt={displayEmployerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] font-bold text-sm">${displayEmployerName.charAt(
                    0
                  )}</div>`;
                }}
              />
            </div>

            {/* Title + Posted timestamp */}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate">
                {displayTitle}
              </h3>
              <span className="text-xs font-medium text-[#016EA6] mt-0.5 block truncate">
                {displayPostedAgo}
              </span>
            </div>
          </div>

          {/* Save / Bookmark */}
          <button
            id={`save-job-btn-${cardId}`}
            onClick={handleSave}
            className="p-2 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer shrink-0 mt-0.5"
            title={saved ? "Unsave job" : "Save job"}
          >
            <FiBookmark
              className={`w-4 h-4 transition-colors ${
                saved
                  ? "fill-[#016EA6] text-[#016EA6]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {displayDescription}
        </p>
      </div>

      {/* Footer: budget + Apply button */}
      <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-bold text-gray-900">
          ₦ {numBudget.toLocaleString()}
        </span>
        <button
          id={`apply-job-btn-${cardId}`}
          onClick={handleApply}
          disabled={isApplying}
          className="px-4 py-2 bg-[#e6f1f6] hover:bg-[#d5e7ef] text-[#2683b3] text-xs font-semibold rounded-full border border-[#2683b3]/10 transition-all duration-200 cursor-pointer disabled:opacity-70"
        >
          {isApplying ? "..." : "Apply"}
        </button>
      </div>
    </article>
  );
};

export default JobCard;
