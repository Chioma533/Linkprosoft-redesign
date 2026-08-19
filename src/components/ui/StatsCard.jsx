import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-[#016EA6]",
  BgColor = "bg-white",
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
    <div className={`${BgColor} p-5 rounded-[18px] border border-gray-100 flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs sm:text-sm font-medium text-gray-400">{title}</span>
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</h3>
        </div>
        {Icon && (
          <div className={`${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {hasTrend && (
        <div
          className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold mt-4 ${trendColor}`}
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

