import React from "react";
import { FiBriefcase, FiTool, FiDroplet, FiZap, FiActivity, FiArrowRight } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";

// Custom wardrobe SVG icon matching the mock design
const WardrobeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
  </svg>
);

const MobileJobCard = ({ job, onViewDetails }) => {
  // Map categories to appropriate icons
  const getCategoryIcon = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("carpentry")) return <WardrobeIcon className="w-5 h-5" />;
    if (cat.includes("plumb")) return <FiDroplet className="w-5 h-5" />;
    if (cat.includes("elect")) return <FiZap className="w-5 h-5" />;
    if (cat.includes("paint")) return <FiActivity className="w-5 h-5" />;
    if (cat.includes("clean")) return <FiTool className="w-5 h-5" />;
    return <FiBriefcase className="w-5 h-5" />;
  };

  return (
    <div className="bg-white p-5 rounded-[18px] border border-gray-100 flex flex-col gap-4 relative">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Icon Container */}
          <div className="w-12 h-12 bg-[#EBF3FA] text-[#016EA6] rounded-lg flex items-center justify-center shrink-0">
            {getCategoryIcon(job.category)}
          </div>
          
          {/* Main Info */}
          <div className="space-y-0.5">
            <h4 className="font-bold text-gray-900 text-base leading-snug">{job.title}</h4>
            <div className="text-xs text-gray-400 font-medium">
              <span>{job.client || "Client"}</span>
              <span className="mx-1.5">•</span>
              <span>{job.category || "General"}</span>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1 font-medium">
              <span>{job.datePosted || "July 10"}</span>
              <span>•</span>
              <span>9:00 am</span>
            </div>
            <div className="text-xs font-bold text-gray-800 pt-1">
              {formatCurrency(job.budget || 45000)}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <StatusBadge status={job.status || "Active"} type="job" />
        </div>
      </div>

      {/* View Details Link */}
      <div className="flex justify-end border-t border-gray-50/80 pt-3 mt-1">
        <button
          onClick={() => onViewDetails && onViewDetails(job)}
          className="text-xs font-bold text-[#016EA6] hover:text-[#061EA6] transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>View Details</span>
          <FiArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default MobileJobCard;
