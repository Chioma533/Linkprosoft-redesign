import React from "react";
import { FiTrendingUp, FiFilter, FiDownload, FiPlus, FiBriefcase, FiCheckCircle, FiClock, FiStar, FiFileText } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import StatsCard from "../../components/ui/StatsCard";

const OverviewSubpage = () => {
  const { metrics, myJobs, messages, notifications } = useDashboardStore();

  const activeJobs = myJobs.filter((job) => job.status === "Active");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount).replace("NGN", "₦");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good Morning Samuel</h2>
        <p className="text-sm text-gray-400 mt-1">Manage, jobs, appointment, finance and schedules</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Earnings" value={formatCurrency(metrics?.earningsTotal || 500000)} icon={FiBriefcase} iconColor="text-blue-500" iconBg="bg-blue-50" />
        <StatsCard title="Upcoming jobs" value={String(metrics?.upcomingJobsCount || 172)} icon={FiClock} iconColor="text-orange-500" iconBg="bg-orange-50" />
        <StatsCard title="Completed jobs" value={String(metrics?.completedJobsCount || 288)} icon={FiCheckCircle} iconColor="text-green-500" iconBg="bg-green-50" />
        <StatsCard title="Performance" value={`${metrics?.performancePercentage || 80}%`} icon={FiStar} iconColor="text-amber-500" iconBg="bg-amber-50" />
      </div>

      {/* Middle Grid: Active Jobs Table & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Active jobs</h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <FiFilter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Export data</span>
                </button>
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-semibold transition-colors">
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>List a service</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Job title</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeJobs.slice(0, 5).map((job, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-3.5 font-semibold text-gray-500">ORD-87W7</td>
                      <td className="py-3.5 font-bold text-gray-800">{job.title}</td>
                      <td className="py-3.5 font-medium text-gray-400">{job.category}</td>
                      <td className="py-3.5 font-semibold text-gray-800">{job.client}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-sky-50 text-sky-500 rounded-lg font-bold text-[10px]">
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-green-500">Successful</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Recent Messages</h3>
              <select className="text-xs font-semibold text-gray-400 outline-none border-none bg-transparent cursor-pointer">
                <option>Unread</option>
                <option>All</option>
              </select>
            </div>

            <div className="space-y-4">
              {messages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-gray-700 text-xs shrink-0">
                      {msg.sender.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 leading-snug">{msg.sender}</h4>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5 max-w-[140px] md:max-w-[180px]">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                  {msg.unread && (
                    <span className="w-2.5 h-2.5 bg-[#016EA6] rounded-full ring-2 ring-white shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center border-t border-gray-50/80 pt-4 mt-6">
            <button className="text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors">
              View all messages
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Notifications, Performance meters, Recent Jobs placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Notifications list */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Notifications</h3>
              <select className="text-xs font-semibold text-gray-400 outline-none border-none bg-transparent cursor-pointer">
                <option>Unread</option>
                <option>All</option>
              </select>
            </div>

            <div className="space-y-4">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl shrink-0 mt-0.5">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 leading-snug">{notif.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{notif.body}</p>
                    </div>
                  </div>
                  {notif.unread && (
                    <span className="w-2 h-2 bg-[#016EA6] rounded-full ring-2 ring-white shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Your Performance Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Your performance</h3>
              <select className="text-xs font-semibold text-gray-400 outline-none border-none bg-transparent cursor-pointer">
                <option>This week</option>
                <option>This month</option>
              </select>
            </div>

            <div className="space-y-4">
              {/* Response Rate */}
              <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/30">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-400 border-r-transparent flex items-center justify-center font-bold text-xs text-indigo-500 shrink-0">
                  75%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Response rate</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">How fast you reply to messages</p>
                </div>
              </div>

              {/* Success Rate */}
              <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/30">
                <div className="w-10 h-10 rounded-full border-4 border-emerald-400 border-r-transparent flex items-center justify-center font-bold text-xs text-emerald-500 shrink-0">
                  75%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Success rate</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">How amazing you complete a job</p>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/30">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center font-bold text-xs text-amber-500 shrink-0">
                  5.0
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Reviews</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Reviews from your clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs Placeholder */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Recent Jobs</h3>
          </div>
          <div className="h-44 border border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <FiFileText className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs font-medium text-gray-400">No new job listings match your primary skills right now.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSubpage;
