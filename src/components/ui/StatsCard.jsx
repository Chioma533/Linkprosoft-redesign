import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-[#016EA6]",
  iconBg = "bg-[#EBF3FA]",
  trend = {
    direction: "up",
    percentage: 20,
    period: "this week",
  },
}) => {
  const hasTrend = trend?.direction && trend?.percentage !== undefined;
  const trendText = hasTrend ? `${trend.percentage}% ${trend.period}` : "";

  const trendColor = hasTrend
    ? trend.direction === "down"
      ? "text-red-500"
      : "text-green-500"
    : "";

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100/50 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-1">
        <div>
          <span className="text-xs sm:text-sm font-medium text-gray-400">{title}</span>
          <h3 className="text-sm xs:text-base sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2 truncate max-w-[100px] xs:max-w-none">{value}</h3>
        </div>
        {Icon && (
          <div
            className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-4 h-4 sm:w-5 h-5" />
          </div>
        )}
      </div>

      {hasTrend && (
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold mt-4 ${trendColor}`}
        >
          {trend.direction === "up" ? (
            <FiTrendingUp className="w-3.5 h-3.5" />
          ) : (
            <FiTrendingDown className="w-3.5 h-3.5" />
          )}

          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
