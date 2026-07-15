import React, { useState } from "react";
import { FiBookmark } from "react-icons/fi";

const JobCard = ({ job, onApply }) => {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace("NGN", "₦");
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-700 text-sm">
              {job.client ? job.client.substring(0, 2) : "CL"}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">{job.title}</h4>
              <span className="text-xs text-blue-500 font-medium">{job.postedAt}</span>
            </div>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl transition-all border ${
              isBookmarked
                ? "bg-blue-50/50 text-[#016EA6] border-blue-100"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-gray-100"
            }`}
          >
            <FiBookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Job Description */}
        <p className="text-xs text-gray-400 leading-relaxed mt-4 line-clamp-3">
          {job.description}
        </p>
      </div>

      {/* Budget & Apply Action */}
      <div className="border-t border-gray-50/80 pt-4 mt-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 font-medium block">Budget</span>
          <span className="text-base font-bold text-gray-900">{formatCurrency(job.budget)}</span>
        </div>

        <button
          onClick={() => onApply(job)}
          className="bg-sky-50 hover:bg-[#016EA6] text-[#016EA6] hover:text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm shadow-sky-100/30 cursor-pointer active:scale-95"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;
