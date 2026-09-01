import React from "react";
import { ArrowUpRight } from "lucide-react";

const OverviewStatCard = ({ 
  title, 
  value, 
  trend = "+20% this week", 
  subtitle,
  icon: Icon, 
  iconColor = "text-[#016EA6]", 
  bgColor = "bg-white", 
  trendColor = "text-emerald-500",
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`${bgColor} rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:border-gray-300 ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Top row: Title and Icon */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight leading-snug">
          {title}
        </span>
        {Icon && (
          <div className="shrink-0 p-1">
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} stroke-[1.8]`} />
          </div>
        )}
      </div>

      {/* Middle: Big Metric Value */}
      <div className="mt-3 mb-2">
        <span className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight block leading-none">
          {value}
        </span>
      </div>

      {/* Bottom: Trend or Subtitle */}
      <div className="mt-1">
        {subtitle ? (
          <span className="text-xs font-semibold text-emerald-600/80">
            {subtitle}
          </span>
        ) : (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewStatCard;
