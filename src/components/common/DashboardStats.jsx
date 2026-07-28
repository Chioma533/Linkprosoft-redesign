import React from "react";
import StatsCard from "../ui/StatsCard";

const DashboardStats = ({stats = []}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          iconBg={stat.iconBg}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
