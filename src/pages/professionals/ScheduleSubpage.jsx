import React, { useEffect, useMemo, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import { useAuthStore } from "../../store/authStore";
import { greeting } from "../../utils/greeting";
import StatsCard from "../../components/ui/StatsCard";
import CalendarWidget from "../../components/ui/CalendarWidget";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "Selected date";

  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const ScheduleSubpage = () => {
  const { schedules, setSelectedJob, setPreviousTab, setActiveTab } =
    useDashboardStore();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  useEffect(() => {
    if (!schedules.length) return;

    const isSelectedDatePresent = schedules.some(
      (sch) => sch.date === selectedDate,
    );

    if (!isSelectedDatePresent) {
      setSelectedDate(schedules[0].date);
    }
  }, [schedules, selectedDate]);

  const activeDates = useMemo(
    () => schedules.map((sch) => sch.date),
    [schedules],
  );

  const daySchedules = useMemo(
    () => schedules.filter((sch) => sch.date === selectedDate),
    [schedules, selectedDate],
  );

  const upcomingCount = schedules.filter(
    (sch) => sch.date >= selectedDate,
  ).length;
  const pendingCount = schedules.filter(
    (sch) => String(sch.status).toLowerCase() === "pending",
  ).length;
  const rejectedCount = schedules.filter(
    (sch) => String(sch.status).toLowerCase() === "rejected",
  ).length;

  const { user } = useAuthStore();
  const userName = user?.fullName || user?.full_name || user?.name || "Samuel";

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {greeting(new Date())} {userName}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage jobs, appointments, finance and schedules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Today's Jobs" value={String(daySchedules.length)} />
        <StatsCard title="Upcoming" value={String(upcomingCount)} />
        <StatsCard title="Pending Deadline" value={String(pendingCount)} />
        <StatsCard title="Rejected" value={String(rejectedCount)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <CalendarWidget
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            activeDates={activeDates}
          />
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-base font-bold text-gray-900">
              Schedule for {formatDisplayDate(selectedDate)}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors">
                This week
              </button>
              <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors">
                This month
              </button>
              <button className="px-3.5 py-1.5 bg-blue-50 text-[#016EA6] border border-blue-100 rounded-full text-xs font-semibold transition-colors">
                This Week
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Job title</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {daySchedules.length > 0 ? (
                  daySchedules.map((sch) => (
                    <tr
                      key={sch.id}
                      className="hover:bg-gray-50/30 transition-colors"
                    >
                      <td className="py-4 font-semibold text-gray-500">
                        {sch.orderId}
                      </td>
                      <td className="py-4 font-bold text-gray-800">
                        {sch.jobTitle}
                      </td>
                      <td className="py-4 font-semibold text-gray-400">
                        {sch.location}
                      </td>
                      <td className="py-4 font-semibold text-gray-800">
                        {sch.client}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedJob({
                              id: sch.id,
                              orderId: sch.orderId,
                              title: sch.jobTitle,
                              location: sch.location,
                              client: sch.client,
                              budget: sch.budget || 0,
                              category: sch.category || "General Service",
                              status: sch.status || "Active",
                            });
                            setPreviousTab("schedule");
                            setActiveTab("project-details");
                          }}
                          className="bg-sky-50 hover:bg-[#016EA6] text-[#016EA6] hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <FiChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400 font-semibold"
                    >
                      No jobs scheduled on this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSubpage;
