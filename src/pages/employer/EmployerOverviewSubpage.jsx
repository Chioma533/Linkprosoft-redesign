import React, { useState } from "react";
import { FiFilter, FiPlus, FiSearch, FiX, FiBriefcase, FiArrowRight } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useDashboardStore } from "../../store/dashboardStore";
import StatsCard from "../../components/ui/StatsCard";
import MobileJobCard from "../../components/ui/MobileJobCard";
import NotificationList from "../../components/ui/NotificationList";
import MoneyBag02Icon from "../../components/icons/MoneyBag02Icon";
import ToggleOffIcon from "../../components/icons/ToggleOffIcon";
import InformationCircleIcon from "../../components/icons/InformationCircleIcon";
import DatabaseLockedIcon from "../../components/icons/DatabaseLockedIcon";
import BorderFullIcon from "../../components/icons/BorderFullIcon";
import ExportButton from "../../components/common/ExportButton";
import { useExport } from "../../hooks/useExport";

const EmployerOverviewSubpage = ({ onViewProject }) => {
  const { user } = useAuthStore();
  const { notifications = [], setActiveTab } = useDashboardStore();
  const { exportData } = useExport();

  const [jobSearch, setJobSearch] = useState("");
  const [notificationSearch, setNotificationSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const userName = user?.fullName || user?.full_name || "Elvis Chimamanda";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace("NGN", "₦");
  };

  const allActiveJobs = [
    { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "Awaiting Escrow", actionText: "Fund Escrow", category: "Carpentry", budget: 45000 },
    { id: "ORD-87W8", title: "Kitchen Cabinet Setup", professional: "Sarah Okon", status: "Awaiting Escrow", actionText: "Fund Escrow", category: "Carpentry", budget: 65000 },
    { id: "ORD-87W9", title: "Office Electrical Wiring", professional: "Emeka Okafor", status: "Awaiting Escrow", actionText: "Fund Escrow", category: "Electrical", budget: 80000 },
    { id: "ORD-88W0", title: "Plumbing Renovation", professional: "Ibrahim Musa", status: "In Progress", actionText: "View Progress", category: "Plumbing", budget: 35000 },
    { id: "ORD-88W1", title: "Wall Painting & Decor", professional: "David Jonathan", status: "In Progress", actionText: "View Progress", category: "Painting", budget: 50000 },
    { id: "ORD-88W2", title: "Living Room Lighting", professional: "Samuel Bello", status: "Completed", actionText: "Release Funds", category: "Electrical", budget: 95000 }
  ];

  // Mobile-friendly job data
  const allMobileActiveJobs = [
    { id: 1, title: "Wardrobe installation", client: "David Jonathan", category: "Carpentry", datePosted: "July 10", budget: 45000, status: "Active" },
    { id: 2, title: "Kitchen Cabinet Setup", client: "Sarah Okon", category: "Carpentry", datePosted: "July 12", budget: 65000, status: "Pending" },
    { id: 3, title: "Office Electrical Wiring", client: "Emeka Okafor", category: "Electrical", datePosted: "July 14", budget: 80000, status: "Active" },
    { id: 4, title: "Living Room Lighting", client: "Samuel Bello", category: "Electrical", datePosted: "July 15", budget: 95000, status: "Cancelled" },
  ];

  // Filtered jobs by search and status
  const filteredActiveJobs = allActiveJobs.filter((job) => {
    const matchesSearch = !jobSearch.trim()
      ? true
      : job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.professional.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.id.toLowerCase().includes(jobSearch.toLowerCase()) ||
        (job.category && job.category.toLowerCase().includes(jobSearch.toLowerCase()));

    const matchesStatus = statusFilter === "all"
      ? true
      : job.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const filteredMobileActiveJobs = allMobileActiveJobs.filter((job) => {
    const matchesSearch = !jobSearch.trim()
      ? true
      : job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.client.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.category.toLowerCase().includes(jobSearch.toLowerCase());

    const matchesStatus = statusFilter === "all"
      ? true
      : job.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Filtered notifications
  const filteredNotifications = (notifications || []).filter((notif) => {
    if (!notificationSearch.trim()) return true;
    const q = notificationSearch.toLowerCase();
    const title = (notif.title || notif.subject || "").toLowerCase();
    const body = (notif.message || notif.body || notif.text || "").toLowerCase();
    return title.includes(q) || body.includes(q);
  });

  const jobFormatter = (jobs) =>
    jobs.map((job) => ({
      "Order ID": job.id,
      "Job Title": job.title,
      Professional: job.professional || job.client,
      Status: job.status,
      Action: job.actionText || "View Details",
      Budget: job.budget ? `₦${job.budget.toLocaleString()}` : "—",
    }));

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
        <h2 className="text-2xl font-medium text-gray-900">{getGreeting()} {userName},</h2>
        <p className="text-sm text-gray-400 mt-1 font-light">Manage your jobs and payments effortlessly.</p>
      </div>

      {/* Metrics Row — 2×2 on mobile, 4-col on lg+ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard title="Earnings" value={formatCurrency(500000)} icon={ToggleOffIcon} iconColor="text-blue-500"/>
        <StatsCard title="Upcoming jobs" value="172" icon={InformationCircleIcon} iconColor="text-orange-500" BgColor="bg-[#fff4ea]" />
        <StatsCard title="Completed jobs" value="1292" icon={DatabaseLockedIcon} iconColor="text-green-500"/>
        <StatsCard title="Performance" value="80%" icon={BorderFullIcon} iconColor="text-emerald-500" />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
           MOBILE ACTIVE JOBS SECTION — hidden on md and above
         ───────────────────────────────────────────────────────────────────── */}
      <div className="md:hidden bg-white border border-gray-100 rounded-3xl p-5 space-y-4">
        {/* Active Jobs Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">Active jobs</h3>
            {filteredMobileActiveJobs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#016EA6]">
                {filteredMobileActiveJobs.length}
              </span>
            )}
          </div>
          {/* Mobile Search Input */}
          <div className="relative w-full max-w-[180px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-8 pr-7 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
            />
            {jobSearch && (
              <button
                onClick={() => setJobSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Job Cards */}
        {filteredMobileActiveJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredMobileActiveJobs.map((job) => (
              <MobileJobCard
                key={job.id}
                job={job}
                onViewDetails={() => onViewProject("job-1")}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-800">No active jobs found</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {jobSearch ? `No matches for "${jobSearch}"` : "You have no active jobs at the moment."}
            </p>
            {jobSearch && (
              <button
                onClick={() => setJobSearch("")}
                className="mt-3 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Mobile Pagination */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-[10px] text-gray-400 font-semibold">Page 1 of 1</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg bg-[#016EA6] text-white text-xs font-bold flex items-center justify-center cursor-pointer">1</button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
           MOBILE NOTIFICATIONS SECTION — hidden on md and above
         ───────────────────────────────────────────────────────────────────── */}
      <div id="employer-notifications-mobile" className="md:hidden bg-white border border-gray-100 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-5 gap-2">
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
          {/* Mobile Search Messages Input */}
          <div className="relative max-w-[150px]">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              value={notificationSearch}
              onChange={(e) => setNotificationSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-7 pr-6 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
            />
            {notificationSearch && (
              <button
                onClick={() => setNotificationSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
        <NotificationList notifications={filteredNotifications} limit={3} />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
           DESKTOP MIDDLE GRID — hidden on mobile (below md)
         ───────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col justify-between h-full p-4 lg:p-6 border border-gray-100 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-gray-900">Active jobs</h3>
                  {filteredActiveJobs.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#016EA6]">
                      {filteredActiveJobs.length}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Desktop Active Jobs Search Bar */}
                  <div className="relative max-w-[190px]">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      placeholder="Search active jobs..."
                      className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
                    />
                    {jobSearch && (
                      <button
                        onClick={() => setJobSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        statusFilter !== "all"
                          ? "border-[#016EA6] text-[#016EA6] bg-sky-50"
                          : "border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <FiFilter className="w-3.5 h-3.5" />
                      <span>{statusFilter === "all" ? "Filter" : statusFilter}</span>
                    </button>
                    {showFilterMenu && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-lg py-1.5 z-30">
                        {["all", "Awaiting Escrow", "In Progress", "Completed"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setShowFilterMenu(false);
                            }}
                            className={`w-full text-left px-3.5 py-1.5 text-xs capitalize hover:bg-gray-50 transition-colors ${
                              statusFilter === status ? "font-bold text-[#016EA6]" : "text-gray-600"
                            }`}
                          >
                            {status === "all" ? "All Statuses" : status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Export Data */}
                  <ExportButton
                    onExport={(type) =>
                      exportData({
                        type,
                        data: filteredActiveJobs,
                        formatter: jobFormatter,
                        filename: "employer-active-jobs",
                        sheetName: "Active Jobs",
                        pdfTitle: "Employer Active Jobs Report",
                      })
                    }
                    disabled={filteredActiveJobs.length === 0}
                  />

                  {/* Post a Project */}
                  <button
                    onClick={() => setActiveTab("manage-jobs")}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Post a project</span>
                  </button>
                </div>
              </div>

              {/* Table / Empty State */}
              {filteredActiveJobs.length > 0 ? (
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
                      {filteredActiveJobs.map((job, idx) => (
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
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${getActionButtonStyle(job.actionText)}`}
                            >
                              {job.actionText}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 px-4 rounded-2xl bg-gradient-to-b from-gray-50/60 to-white border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="text-[#016EA6] mb-3 flex items-center justify-center">
                    <FiBriefcase className="w-8 h-8 stroke-[2]" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">No Active Jobs Found</h4>
                  <p className="text-xs text-gray-400 font-medium max-w-sm mb-5 leading-relaxed">
                    {jobSearch || statusFilter !== "all"
                      ? "No active jobs match your search keywords or filter criteria. Try adjusting your query."
                      : "You currently have no active project contracts. Post a new project or explore verified professionals."}
                  </p>
                  <div className="flex items-center gap-3">
                    {jobSearch || statusFilter !== "all" ? (
                      <button
                        onClick={() => {
                          setJobSearch("");
                          setStatusFilter("all");
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab("browse-professionals")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                      >
                        <span>Browse Professionals</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Escrow Overview & Performance */}
        <div className="space-y-8">
          {/* Escrow Overview */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100/50">
            <h3 className="text-base font-bold text-gray-900 mb-4">Escrow Overview</h3>
            <div className="bg-[#016EA6] -py-12 px-6 rounded-[22.68px] text-white relative overflow-hidden shadow-md">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              <div className="relative z-10 flex h-44 items-center">
                <div className="flex-1 max-w-[55%]">
                  <span className="text-[12.47px] text-sky-200 font-regular tracking-wide block">Money held</span>
                  <h1 className="text-2xl font-extrabold tracking-tight mt-1">{formatCurrency(540000)}</h1>
                  <p className="text-[10px] text-sky-100 font-medium mt-1">4 active escrows</p>
                  <button className="mt-4 text-white text-xs font-semibold underline underline-offset-4 hover:text-sky-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-[45%] flex items-end justify-end pr-4 pb-4 pointer-events-none">
                <img
                  src="/secure_wallet_illustration.png"
                  alt="Secure wallet illustration"
                  className="max-h-[170px] w-auto -mx-5 mt-9 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Your Performance */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100/50 space-y-4">
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
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-base font-bold text-gray-900">Upcoming Schedule</h3>
          <div className="flex gap-2">
            <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">Today</button>
            <button className="px-3.5 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">This week</button>
            <button className="px-3.5 py-1.5 bg-blue-50 text-[#016EA6] border border-blue-100 rounded-full text-xs font-bold transition-colors cursor-pointer">This month</button>
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
