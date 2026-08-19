import React, { useState } from "react";
import { FiBookmark } from "react-icons/fi";

/**
 * JobCard — matches the Figma design for the "Default Professional Screen"
 * Shows: employer avatar, job title, "Posted X ago" timestamp (teal), bookmark icon,
 *        description text, budget (₦), Apply button.
 * First card in page 1 gets a blue left-border selected state.
 */
const JobCard = ({
  id,
  title = "Wardrobe Installation",
  employerName = "Jonathan David",
  employerAvatarUrl = "/professional_avatar.png",
  postedAgo = "Posted 2 min ago",
  description = "Hi, I'm looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers.",
  budget = 10000,
  isSaved = false,
  isSelected = false,
  onApply,
  onSave,
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [isApplying, setIsApplying] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(!saved);
  };

  const handleApply = async () => {
    setIsApplying(true);
    await onApply?.();
    setTimeout(() => setIsApplying(false), 1000);
  };

  return (
    <article
      id={`job-card-${id}`}
      className={`bg-[#f9f9f9] rounded-2xl transition-all duration-300 flex flex-col overflow-hidden group relative border hover:border-[#016EA6] ${
        isSelected
          ? "border-[#016EA6] border-l-4"
          : "border-transparent"
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
                src={employerAvatarUrl}
                alt={employerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] font-bold text-sm">${employerName.charAt(0)}</div>`;
                }}
              />
            </div>

            {/* Title + Posted timestamp */}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate">
                {title}
              </h3>
              <span className="text-xs font-medium text-[#016EA6] mt-0.5 block truncate">
                {postedAgo}
              </span>
            </div>
          </div>

          {/* Save / Bookmark */}
          <button
            id={`save-job-btn-${id}`}
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
          {description}
        </p>
      </div>

      {/* Footer: budget + Apply button */}
      <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-bold text-gray-900">
          ₦ {budget.toLocaleString()}
        </span>
        <button
          id={`apply-job-btn-${id}`}
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
