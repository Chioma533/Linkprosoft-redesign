import React, { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import StatsCard from "../../components/ui/StatsCard";
import CalendarWidget from "../../components/ui/CalendarWidget";

const ScheduleSubpage = () => {
  const { schedules } = useDashboardStore();
  const [selectedDate, setSelectedDate] = useState("2026-07-02");

  // Filter schedules by selected date
  const daySchedules = schedules.filter(sch => sch.date === selectedDate);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good Morning Samuel</h2>
        <p className="text-sm text-gray-400 mt-1">Manage, jobs, appointment, finance and schedules</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Today's Job" value="100" />
        <StatsCard title="Upcoming" value="88" />
        <StatsCard title="Pending Deadline" value="8" />
        <StatsCard title="Rejected" value="100" />
      </div>

      {/* Grid: Calendar & Schedule List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Calendar Widget */}
        <div className="lg:col-span-1">
          <CalendarWidget selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Today's Schedule</h3>
            <div className="flex gap-2">
              <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors">
                This week
              </button>
              <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors">
                This month
              </button>
              <button className="px-3.5 py-1.5 bg-blue-50 text-[#016EA6] border border-blue-100 rounded-xl text-xs font-semibold transition-colors">
                This Week
              </button>
            </div>
          </div>

          {/* Schedule Table */}
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
                    <tr key={sch.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 font-semibold text-gray-500">{sch.orderId}</td>
                      <td className="py-4 font-bold text-gray-800">{sch.jobTitle}</td>
                      <td className="py-4 font-semibold text-gray-400">{sch.location}</td>
                      <td className="py-4 font-semibold text-gray-800">{sch.client}</td>
                      <td className="py-4 text-right">
                        <button className="bg-sky-50 hover:bg-[#016EA6] text-[#016EA6] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer inline-flex items-center gap-1">
                          <span>View Details</span>
                          <FiChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-semibold">
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
