import React from "react";
import { FiFilter, FiDownload, FiPlus } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import StatsCard from "../../components/ui/StatsCard";
import ToggleOffIcon from "../../components/icons/ToggleOffIcon";
import InformationCircleIcon from "../../components/icons/InformationCircleIcon";
import DatabaseLockedIcon from "../../components/icons/DatabaseLockedIcon";
import BorderFullIcon from "../../components/icons/BorderFullIcon";

const EmployerOverviewSubpage = ({ onViewProject }) => {
  const { user } = useAuthStore();
  const userName = user?.fullName || user?.full_name || "Elvis Chimamanda";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace("NGN", "₦");
  };

  const activeJobs = [
    { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "Awaiting Escrow", actionText: "Fund Escrow" },
    { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "Awaiting Escrow", actionText: "Fund Escrow" },
    { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "Awaiting Escrow", actionText: "Fund Escrow" },
    { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "In Progress", actionText: "View Progress" },
    { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "In Progress", actionText: "View Progress" },
    { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "Completed", actionText: "Release Funds" }
  ];

  const schedule = [
    { id: "ORD-87W7", title: "Wardrobe installation", time: "11:00 AM", professional: "Johnatan david" },
    { id: "ORD-87W7", title: "Wardrobe installation", time: "11:00 AM", professional: "Johnatan david" },
    { id: "ORD-87W7", title: "Wardrobe installation", time: "11:00 AM", professional: "Johnatan david" },
    { id: "ORD-87W7", title: "Wardrobe installation", time: "11:00 AM", professional: "Johnatan david" }
  ];

  const getStatusBadgeStyle = (status) => {
    if (status === "Awaiting Escrow") return "bg-sky-50 text-[#016EA6]";
    if (status === "In Progress") return "bg-orange-50 text-orange-500";
    return "bg-green-50 text-green-600";
  };

  const getActionButtonStyle = (actionText) => {
    if (actionText === "Fund Escrow") return "bg-[#016EA6] hover:bg-[#061EA6] text-white";
    if (actionText === "Release Funds") return "bg-emerald-600 hover:bg-emerald-700 text-white";
    return "bg-sky-50 hover:bg-[#016EA6]/10 text-[#016EA6]";
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-normal text-gray-900">{getGreeting()} {userName}</h2>
        <p className="text-sm text-gray-400 mt-1 font-light">Manage your jobs and payments effortlessly.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active jobs" value="18" icon={ToggleOffIcon} iconColor="text-blue-500"/>
        <StatsCard title="Awaiting action" value="8" icon={InformationCircleIcon} iconColor="text-orange-500"  BgColor="bg-[#fff4ea]" />
        <StatsCard title="Funds in Escrow" value={formatCurrency(540000)} icon={DatabaseLockedIcon} iconColor="text-green-500"/>
        <StatsCard title="Completed jobs" value="98" icon={BorderFullIcon} iconColor="text-emerald-500" />
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-base font-bold text-gray-900">Active jobs</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
                  <FiFilter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Export data</span>
                </button>
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Post a project</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                    <th className="pb-3 font-semibold">OrderID</th>
                    <th className="pb-3 font-semibold">Job title</th>
                    <th className="pb-3 font-semibold">Professional</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeJobs.map((job, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-3.5 font-semibold text-gray-500">{job.id}</td>
                      <td className="py-3.5 font-bold text-gray-800">{job.title}</td>
                      <td className="py-3.5 font-semibold text-gray-800">{job.professional}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${getStatusBadgeStyle(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <button
                          onClick={() => onViewProject("job-1")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${getActionButtonStyle(job.actionText)}`}
                        >
                          {job.actionText}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Escrow Overview & Performance */}
        <div className="space-y-8">
          {/* Escrow Overview */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Escrow Overview</h3>
            <div className="bg-gradient-to-r from-[#013554] via-[#01507B] to-[#016EA6] p-6 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between h-44 shadow-md">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200 via-transparent to-transparent" />
              <div className="relative z-10">
                <span className="text-[10px] text-sky-200 font-semibold tracking-wide block">Money held</span>
                <h1 className="text-2xl font-extrabold tracking-tight mt-1">{formatCurrency(540000)}</h1>
                <p className="text-[10px] text-sky-100 font-medium mt-1">4 active escrows</p>
              </div>
              <button className="bg-white text-[#013554] hover:bg-sky-50 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all self-start cursor-pointer">
                View Details
              </button>
            </div>
          </div>

          {/* Your Performance */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900">Your performance</h3>
              <span className="text-[10px] text-gray-400 font-bold border border-gray-100 rounded-lg px-2 py-0.5">This week</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/30">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-400 border-r-transparent flex items-center justify-center font-bold text-xs text-indigo-500 shrink-0">75%</div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Response rate</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">How fast you reply to messages</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/30">
                <div className="w-10 h-10 rounded-full border-4 border-emerald-400 border-r-transparent flex items-center justify-center font-bold text-xs text-emerald-500 shrink-0">75%</div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Success rate</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">How amazing you complete a job</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Schedule */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-base font-bold text-gray-900">Upcoming Schedule</h3>
          <div className="flex gap-2">
            <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">Today</button>
            <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">This week</button>
            <button className="px-3.5 py-1.5 bg-blue-50 text-[#016EA6] border border-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer">This month</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                <th className="pb-3 font-semibold">OrderID</th>
                <th className="pb-3 font-semibold">Job title</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Professional</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {schedule.map((sch, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 font-semibold text-gray-500">{sch.id}</td>
                  <td className="py-4 font-bold text-gray-800">{sch.title}</td>
                  <td className="py-4 font-semibold text-gray-400">{sch.time}</td>
                  <td className="py-4 font-semibold text-gray-800">{sch.professional}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onViewProject("job-1")}
                      className="text-[#016EA6] hover:text-[#061EA6] font-bold text-xs transition-colors cursor-pointer bg-transparent border-none"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerOverviewSubpage;
