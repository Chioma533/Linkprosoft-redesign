import React from "react";

const PerformanceMetrics = ({ metrics }) => {
  const performanceMetrics = [
    {
      title: "Response rate",
      description: "How fast you reply to messages",
      value: metrics?.responseRate ?? 0,
      color: "indigo",
      isPercentage: true,
    },
    {
      title: "Success rate",
      description: "How successfully you complete jobs",
      value: metrics?.successRate ?? 0,
      color: "emerald",
      isPercentage: true,
    },
    {
      title: "Reviews",
      description: "Reviews from your clients",
      value: metrics?.averageRating ?? 0,
      color: "amber",
      isPercentage: false,
    },
  ];

  return (
    <div className="space-y-4">
      {performanceMetrics.map((metric) => (
        <div
          key={metric.title}
          className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/30"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
              metric.color === "indigo"
                ? "border-4 border-indigo-400 border-r-transparent text-indigo-500"
                : metric.color === "emerald"
                  ? "border-4 border-emerald-400 border-r-transparent text-emerald-500"
                  : "bg-amber-50 text-amber-500"
            }`}
          >
            {metric.value}
            {metric.isPercentage && "%"}
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-800">{metric.title}</h4>

            <p className="text-[10px] text-gray-400 mt-0.5">
              {metric.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetrics;
