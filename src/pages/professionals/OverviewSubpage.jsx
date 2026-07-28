import {FiFilter,FiPlus, FiFileText, FiSearch } from "react-icons/fi";
import { FiBriefcase, FiClock, FiCheckCircle, FiStar } from "react-icons/fi";
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

  const { metrics, myJobs, messages, notifications } = useDashboardStore();
  const { exportData } = useExport();

   const stats = [
     {
       id: " earnings",
       title: "Earnings",
       value: formatCurrency(metrics?.earningsTotal),
       icon: FiBriefcase,
       iconColor: "text-blue-500",
       iconBg: "bg-blue-50",
     },
     {
       id: " upcoming-jobs",
       title: "Upcoming jobs",
       value: String(metrics?.upcomingJobsCount ?? 0),
       icon: FiClock,
       iconColor: "text-orange-500",
       iconBg: "bg-orange-50",
     },
     {
       id: " completed-jobs",
       title: "Completed jobs",
       value: String(metrics?.completedJobsCount ?? 0),
       icon: FiCheckCircle,
       iconColor: "text-green-500",
       iconBg: "bg-green-50",
     },
     {
       id: " performance",
       title: "Performance",
       value: `${metrics?.performancePercentage ?? 0}%`,
       icon: FiStar,
       iconColor: "text-amber-500",
       iconBg: "bg-amber-50",
     },
   ];

  const jobFormatter = (jobs) =>
  jobs.map((job) => ({
    "Order ID": job.orderId,
    "Job Title": job.title,
    Category: job.category,
    Client: job.client,
    Status: job.status,
    Payment: job.paymentStatus,
  }));

  const activeJobs = myJobs.filter((job) => job.status === "Active");

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeHeader />

      {/* Metrics Row */}
      <DashboardStats stats={stats} />

      {/* Middle Grid: Active Jobs Table & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">Active jobs</h3>
              
              {/* Desktop Actions */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <FiFilter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
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
                />
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-semibold transition-colors">
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>List a service</span>
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="relative sm:hidden max-w-[130px]">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Search Jobs"
                  className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
                />
              </div>
            </div>

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
                      key={idx}
                      className="hover:bg-gray-50/30 transition-colors"
                    >
                      <td className="py-3.5 font-semibold text-gray-500">
                        {job.orderId}
                      </td>
                      <td className="py-3.5 font-bold text-gray-800">
                        {job.title}
                      </td>
                      <td className="py-3.5 font-medium text-gray-400">
                        {job.category}
                      </td>
                      <td className="py-3.5 font-semibold text-gray-800">
                        {job.client}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-sky-50 text-sky-500 rounded-lg font-bold text-[10px]">
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <StatusBadge
                          status={job.paymentStatus}
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
              {myJobs.slice(0, 3).map((job) => (
                <MobileJobCard
                  key={job.id}
                  job={job}
                  onViewDetails={() => navigate("/professional/my-jobs")}
                />
              ))}

              {/* Mobile Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <span className="text-[10px] text-gray-400 font-semibold">Page 1 of 5</span>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded-lg bg-[#016EA6] text-white text-xs font-bold flex items-center justify-center">1</button>
                  <button className="w-6 h-6 rounded-lg border border-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center">2</button>
                  <button className="w-6 h-6 rounded-lg border border-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center">3</button>
                  <span className="text-[10px] text-gray-400 font-bold px-1">..</span>
                  <button className="w-6 h-6 rounded-lg border border-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center">5</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">
                Recent Messages
              </h3>
              <select className="text-xs font-semibold text-gray-400 outline-none border-none bg-transparent cursor-pointer">
                <option>Unread</option>
                <option>All</option>
              </select>
            </div>

            <MessageList
              messages={messages}
              limit={4}
              filter="unread"
              onMessageClick={(message) => {
                // navigate later
              }}
            />
          </div>
          <div className="text-center border-t border-gray-50/80 pt-4 mt-6">
            <button
              className="text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors"
              onClick={() => navigate("/professional/messages")}
            >
              View all messages
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Notifications, Performance meters, Recent Jobs placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Notifications list */}
        <div id="notifications-section" className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">
                Notifications
              </h3>
              
              {/* Desktop filter select */}
              <select className="hidden sm:block text-xs font-semibold text-gray-400 outline-none border-none bg-transparent cursor-pointer">
                <option>Unread</option>
                <option>All</option>
              </select>

              {/* Mobile Search messages input */}
              <div className="relative sm:hidden max-w-[130px]">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
                />
              </div>
            </div>
            <NotificationList notifications={notifications} />{" "}
          </div>
        </div>

        {/* Your Performance Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900">
                Your performance
              </h3>
              <select className="text-xs font-semibold text-gray-400 outline-none border-none bg-transparent cursor-pointer">
                <option>This week</option>
                <option>This month</option>
              </select>
            </div>
            <PerformanceMetrics metrics={metrics} />{" "}
          </div>
        </div>

        {/* Recent Jobs Placeholder */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Recent Jobs</h3>
          </div>
          <div className="h-44 border border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <FiFileText className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs font-medium text-gray-400">
              No new job listings match your primary skills right now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSubpage;
