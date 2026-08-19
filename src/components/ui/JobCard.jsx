import React, { useState } from "react";
import { FiBookmark } from "react-icons/fi";

const JobCard = ({ job, onApply, onSave }) => {
  const [saved, setSaved] = useState(job?.isBookmarked || false);
  const [isApplying, setIsApplying] = useState(false);

  const employerName = job?.employerName || job?.client || "Client";
  const employerAvatarUrl = job?.employerAvatarUrl || job?.avatarUrl || "/professional_avatar.png";
  const title = job?.title || "Wardrobe Installation";
  const description =
    job?.description ||
    "Hi, I'm looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom.";
  const postedAgo = job?.postedAgo || job?.postedAt || "Posted 2 min ago";
  const budget = Number(job?.budget || 0);

  const handleSave = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    onSave?.(nextSaved);
  };

  const handleApply = async () => {
    setIsApplying(true);
    await onApply?.(job);
    setTimeout(() => setIsApplying(false), 700);
  };

  return (
    <article
      id={`job-card-${job?.id ?? "card"}`}
      className="bg-[#f9f9f9] rounded-2xl transition-all duration-300 flex flex-col overflow-hidden group relative border border-transparent hover:border-[#016EA6]"
    >
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 bg-gray-100">
              <img
                src={employerAvatarUrl}
                alt={employerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.parentElement) {
                    e.target.parentElement.innerHTML = `<div class="w-full h-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] font-bold text-sm">${employerName.charAt(0)}</div>`;
                  }
                }}
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate">
                {title}
              </h3>
              <span className="text-xs font-medium text-[#016EA6] mt-0.5 block truncate">
                {postedAgo}
              </span>
            </div>
          </div>

          <button
            id={`save-job-btn-${job?.id ?? "card"}`}
            onClick={handleSave}
            className="p-2 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer shrink-0 mt-0.5"
            title={saved ? "Unsave job" : "Save job"}
          >
            <FiBookmark
              className={`w-4 h-4 transition-colors ${
                saved ? "fill-[#016EA6] text-[#016EA6]" : "text-gray-400 hover:text-gray-600"
              }`}
            />
          </button>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>
      </div>

      <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-bold text-gray-900">₦ {budget.toLocaleString()}</span>
        <button
          id={`apply-job-btn-${job?.id ?? "card"}`}
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
