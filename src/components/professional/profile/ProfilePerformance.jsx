import React from "react";
import { Star } from "lucide-react";

const numberValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const ProfilePerformance = ({ profile }) => {
  const hours = numberValue(profile?.totalHoursWorked ?? profile?.total_hours_worked);
  const totalReviews = numberValue(profile?.totalReviews ?? profile?.total_reviews);
  const rating = numberValue(profile?.avgRating ?? profile?.avg_rating);
  const responseHours = numberValue(profile?.responseTimeHours ?? profile?.response_time_hours);
  const metrics = [
    hours !== null ? { label: "Hours Worked", value: hours.toLocaleString() } : null,
    totalReviews > 0 && rating !== null ? { label: "Avg Rating", value: rating.toFixed(1), rating: true } : null,
    responseHours !== null ? { label: "Avg Response", value: `${responseHours}h` } : null,
  ].filter(Boolean);

  return (
    <section className="space-y-4 rounded-3xl border border-gray-100/50 bg-white p-6 shadow-xs">
      <h3 className="mb-2 text-sm font-bold text-gray-900">Performance</h3>
      {metrics.length ? (
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center justify-center rounded-2xl border border-gray-100/30 bg-gray-50/50 p-4 text-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-extrabold ${metric.rating ? "gap-0.5 bg-amber-50 text-amber-500" : "bg-sky-50 text-sm text-[#016EA6]"}`}>
                {metric.rating ? <Star className="h-4 w-4 fill-current" /> : null}
                <span className={metric.rating ? "text-xs" : ""}>{metric.value}</span>
              </div>
              <span className="mt-2 text-[10px] font-semibold text-gray-400">{metric.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-100 bg-gray-50/50 py-8 text-center text-xs text-gray-400">
          No performance metrics available yet.
        </p>
      )}
    </section>
  );
};

export default ProfilePerformance;
