import React from "react";
import { User } from "lucide-react";

const RecentActivityFeed = ({ onNavigate, onViewAllActivities }) => {
  const activities = [
    {
      id: 1,
      name: "Marco Rossi",
      role: "Professional (UI/UX Designer)",
      action: "registered as a",
      time: "8 days ago",
      statusText: "Awaiting verification",
    },
    {
      id: 2,
      name: "Marco Rossi",
      role: "Professional (UI/UX Designer)",
      action: "registered as a",
      time: "8 days ago",
      statusText: "Awaiting verification",
    },
    {
      id: 3,
      name: "Marco Rossi",
      role: "Professional (UI/UX Designer)",
      action: "registered as a",
      time: "8 days ago",
      statusText: "Awaiting verification",
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Title */}
      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base tracking-tight mb-4">
        Recent Platform Activity
      </h3>

      {/* Activities List */}
      <div className="space-y-3 flex-1">
        {activities.map((item) => (
          <div
            key={item.id}
            className="bg-gray-50/40 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors hover:bg-gray-50/80"
          >
            {/* Left User avatar & action info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E6F4FA] text-[#016EA6] flex items-center justify-center shrink-0">
                <User className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-[13px] font-bold text-gray-800 leading-snug truncate">
                  <span>{item.name} </span>
                  <span className="font-normal text-gray-600">{item.action} </span>
                  <span className="font-bold text-gray-800">{item.role}</span>
                </p>
                <span className="text-[10px] text-gray-400 mt-0.5 font-medium block">
                  {item.time}
                </span>
              </div>
            </div>

            {/* Right Status Badge & View Details link */}
            <div className="shrink-0 text-right">
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-500 block">
                {item.statusText}
              </span>
              <button
                onClick={() => onNavigate && onNavigate("verifications")}
                className="text-[10px] font-bold text-[#016EA6] hover:underline cursor-pointer block mt-0.5 ml-auto"
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Activities Link */}
      <button
        onClick={onViewAllActivities}
        className="text-[#016EA6] hover:text-[#015582] text-xs sm:text-[13px] font-bold text-center mt-4 pt-1 cursor-pointer transition-colors block w-full hover:underline"
      >
        View All Activities
      </button>
    </div>
  );
};

export default RecentActivityFeed;
