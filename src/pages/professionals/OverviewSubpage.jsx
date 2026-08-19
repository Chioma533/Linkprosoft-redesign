import React, { useState } from "react";
import { FiFilter, FiPlus, FiFileText, FiSearch, FiBriefcase, FiClock, FiCheckCircle, FiStar, FiInbox, FiMessageSquare, FiBell, FiArrowRight } from "react-icons/fi";
import MobileJobCard from "../../components/ui/MobileJobCard";
import { useDashboardStore } from "../../store/dashboardStore";
import WelcomeHeader from "../../components/common/WelcomeHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import ExportButton from "../../components/common/ExportButton";
import { useExport } from "../../hooks/useExport";
import PerformanceMetrics from "../../components/ui/PerformanceMetrics";
import NotificationList from "../../components/ui/NotificationList";
import MessageList from "../../components/messages/MessageList";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../../components/common/DashboardStats";
import { formatCurrency } from "../../utils/formatCurrency";

const OverviewSubpage = () => {
  const navigate = useNavigate();
  const [jobSearch, setJobSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState("unread");
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [performancePeriod, setPerformancePeriod] = useState("this_week");

  const { metrics, myJobs, messages, notifications, setActiveTab } = useDashboardStore();
  const { exportData } = useExport();

  const stats = [
    {
      id: "earnings",
      title: "Earnings",
      value: formatCurrency(metrics?.earningsTotal ?? 0),
      icon: FiBriefcase,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      id: "upcoming-jobs",
      title: "Upcoming jobs",
      value: String(metrics?.upcomingJobsCount ?? 0),
      icon: FiClock,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
    {
      id: "completed-jobs",
      title: "Completed jobs",
      value: String(metrics?.completedJobsCount ?? 0),
      icon: FiCheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
    },
    {
      id: "performance",
      title: "Performance",
      value: `${metrics?.performancePercentage ?? 0}%`,
      icon: FiStar,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
  ];

  const jobFormatter = (jobs) =>
    jobs.map((job) => ({
      "Order ID": job.orderId || job.order_id || (job.id ? `ORD-${job.id}` : "—"),
      "Job Title": job.title || job.jobTitle || "Untitled Job",
      Category: job.category?.name || job.category || "General",
      Client: job.client?.fullName || job.client?.name || job.client || job.employerName || "Direct Client",
      Status: job.status || "Active",
      Payment: job.paymentStatus || job.payment_status || "Pending",
    }));

  const allActiveJobs = (myJobs || []).filter(
    (job) => (job.status || "Active").toLowerCase() === "active" || (job.status || "").toLowerCase() === "in progress"
  );

  const activeJobs = allActiveJobs.filter((job) => {
    if (!jobSearch) return true;
    const q = jobSearch.toLowerCase();
    const title = (job.title || job.jobTitle || "").toLowerCase();
    const client = (job.client?.fullName || job.client?.name || job.client || job.employerName || "").toLowerCase();
    const category = (job.category?.name || job.category || "").toLowerCase();
    return title.includes(q) || client.includes(q) || category.includes(q);
  });

  const filteredMessages = (messages || []).filter((msg) => {
    if (messageFilter === "unread") return Boolean(msg.unread);
    return true;
  });

  const filteredNotifications = (notifications || []).filter((notif) => {
    if (notificationFilter === "unread") return Boolean(notif.unread ?? !notif.is_read);
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeHeader />

      {/* Metrics Row */}
      <DashboardStats stats={stats} />

      {/* Middle Grid: Active Jobs Table & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-gray-900">Active jobs</h3>
                {allActiveJobs.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#016EA6]">
                    {allActiveJobs.length}
                  </span>
                )}
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                <div className="relative max-w-[180px]">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search active jobs..."
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
                  />
                </div>

                <ExportButton
                  onExport={(type) =>
                    exportData({
                      type,
                      data: activeJobs,
                      formatter: jobFormatter,
                      filename: "active-jobs",
                      sheetName: "Active Jobs",
                      pdfTitle: "Active Jobs Report",
                    })
                  }
                  disabled={activeJobs.length === 0}
                />

                <button
                  onClick={() => setActiveTab("browse-jobs")}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Find Jobs</span>
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="relative sm:hidden max-w-[130px]">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search Jobs"
                  className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
                />
              </div>
            </div>

            {/* Content View: Table / Empty State */}
            {activeJobs.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block">
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
                        <tr
                          key={job.id || idx}
                          onClick={() => {
                            setActiveTab("my-jobs");
                          }}
                          className="hover:bg-gray-50/40 transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 font-semibold text-gray-500">
                            {job.orderId || job.order_id || `ORD-${String(job.id || idx + 1).slice(0, 6)}`}
                          </td>
                          <td className="py-3.5 font-bold text-gray-800">
                            {job.title || job.jobTitle || "Untitled Job"}
                          </td>
                          <td className="py-3.5 font-medium text-gray-400">
                            {job.category?.name || job.category || "General"}
                          </td>
                          <td className="py-3.5 font-semibold text-gray-800">
                            {job.client?.fullName || job.client?.name || job.client || job.employerName || "Direct Client"}
                          </td>
                          <td className="py-3.5">
                            <span className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-lg font-bold text-[10px]">
                              {job.status || "Active"}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <StatusBadge
                              status={job.paymentStatus || job.payment_status || "Pending"}
                              type="payment"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List View */}
                <div className="md:hidden space-y-4">
                  {activeJobs.slice(0, 3).map((job, idx) => (
                    <MobileJobCard
                      key={job.id || idx}
                      job={{
                        ...job,
                        id: job.id || idx,
                        title: job.title || job.jobTitle || "Untitled Job",
                        client: job.client?.fullName || job.client || "Client",
                        status: job.status || "Active",
                      }}
                      onViewDetails={() => setActiveTab("my-jobs")}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Modern Empty State for Active Jobs */
              <div className="py-12 px-4 rounded-2xl bg-gradient-to-b from-gray-50/60 to-white border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="text-[#016EA6] mb-3 flex items-center justify-center">
                  <FiBriefcase className="w-8 h-8 stroke-[2]" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">No Active Jobs Right Now</h4>
                <p className="text-xs text-gray-400 font-medium max-w-sm mb-5 leading-relaxed">
                  {jobSearch
                    ? "No active jobs match your search keywords. Try adjusting your search query."
                    : "When clients accept your proposals or assign you contracts, your ongoing jobs will appear here in real-time."}
                </p>
                <div className="flex items-center gap-3">
                  {jobSearch ? (
                    <button
                      onClick={() => setJobSearch("")}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-all cursor-pointer"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab("browse-jobs")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <span>Explore Open Jobs</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages Widget */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Recent Messages</h3>
              <select
                value={messageFilter}
                onChange={(e) => setMessageFilter(e.target.value)}
                className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 outline-none cursor-pointer hover:border-gray-200 transition-colors"
              >
                <option value="unread">Unread</option>
                <option value="all">All</option>
              </select>
            </div>

            {filteredMessages.length > 0 ? (
              <MessageList
                messages={filteredMessages}
                limit={4}
                filter={messageFilter}
                onMessageClick={() => setActiveTab("chat")}
              />
            ) : (
              <div className="py-10 px-4 rounded-2xl bg-gray-50/50 border border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="text-indigo-500 mb-2.5 flex items-center justify-center">
                  <FiMessageSquare className="w-7 h-7" />
                </div>
                <h5 className="text-xs font-bold text-gray-800 mb-0.5">No Messages Found</h5>
                <p className="text-[11px] text-gray-400 font-medium">
                  {messageFilter === "unread" ? "You have no unread messages." : "Your conversations with clients will appear here."}
                </p>
              </div>
            )}
          </div>

          <div className="text-center border-t border-gray-50/80 pt-4 mt-6">
            <button
              className="text-xs font-bold text-[#016EA6] hover:text-[#061EA6] transition-colors cursor-pointer inline-flex items-center gap-1"
              onClick={() => setActiveTab("chat")}
            >
              <span>View all messages</span>
              <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Notifications, Performance meters, Recent Jobs placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Notifications list */}
        <div id="notifications-section" className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Notifications</h3>
                {filteredNotifications.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                    {filteredNotifications.length}
                  </span>
                )}
              </div>

              <select
                value={notificationFilter}
                onChange={(e) => setNotificationFilter(e.target.value)}
                className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 outline-none cursor-pointer hover:border-gray-200 transition-colors"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
              </select>
            </div>

            {filteredNotifications.length > 0 ? (
              <NotificationList notifications={filteredNotifications} />
            ) : (
              <div className="py-10 px-4 rounded-2xl bg-gray-50/50 border border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="text-amber-500 mb-2.5 flex items-center justify-center">
                  <FiBell className="w-7 h-7" />
                </div>
                <h5 className="text-xs font-bold text-gray-800 mb-0.5">You're All Caught Up!</h5>
                <p className="text-[11px] text-gray-400 font-medium">
                  {notificationFilter === "unread" ? "No unread notifications." : "No activity notifications at this time."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Your Performance Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Your performance</h3>
              <select
                value={performancePeriod}
                onChange={(e) => setPerformancePeriod(e.target.value)}
                className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 outline-none cursor-pointer hover:border-gray-200 transition-colors"
              >
                <option value="this_week">This week</option>
                <option value="this_month">This month</option>
              </select>
            </div>
            <PerformanceMetrics metrics={metrics} />
          </div>
        </div>

        {/* Recent Jobs Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Recommended Jobs</h3>
              <span className="text-[10px] font-semibold text-gray-400">Live Feed</span>
            </div>
            <div className="py-8 px-4 rounded-2xl bg-gray-50/50 border border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="text-[#016EA6] mb-2 flex items-center justify-center">
                <FiFileText className="w-7 h-7" />
              </div>
              <h5 className="text-xs font-bold text-gray-800 mb-1">Find Your Next Contract</h5>
              <p className="text-[11px] text-gray-400 font-medium max-w-[220px] leading-relaxed mb-4">
                Discover job listings matching your skills and submit proposals.
              </p>
              <button
                onClick={() => setActiveTab("browse-jobs")}
                className="px-4 py-2 bg-sky-50 hover:bg-[#016EA6] text-[#016EA6] hover:text-white rounded-full text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                Browse Job Market
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSubpage;
