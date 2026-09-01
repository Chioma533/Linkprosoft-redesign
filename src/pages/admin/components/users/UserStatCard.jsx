import React from "react";
import { ArrowUpRight } from "lucide-react";

const UserStatCard = ({ title, value, trend = "+20% this week", icon: Icon, iconColor = "text-[#016EA6]", iconBg = "" }) => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs">
      {/* Top Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight">
          {title}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-full ${iconBg}`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} stroke-[1.8]`} />
          </div>
        )}
      </div>

      {/* Middle Metric */}
      <div className="mt-3 mb-2">
        <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block leading-none">
          {value}
        </span>
      </div>

      {/* Bottom Trend */}
      <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{trend}</span>
      </div>
    </div>
  );
};

export default UserStatCard;
