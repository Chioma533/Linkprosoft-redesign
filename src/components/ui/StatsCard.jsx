import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const StatsCard = ({ title, value, changeText = "+20% this week", icon: Icon, iconColor = "text-[#016EA6]", iconBg = "bg-[#EBF3FA]" }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-medium text-gray-400">{title}</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-green-500 font-semibold mt-4">
        <FiTrendingUp className="w-3.5 h-3.5" />
        <span>{changeText}</span>
      </div>
    </div>
  );
};

export default StatsCard;
