import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  PauseCircle, 
  Search, 
  ChevronDown, 
  Eye, 
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../api/services/adminService";
import JobDetailModal from "./components/JobDetailModal";

const AdminJobsSubpage = ({ onNavigate }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  /*
  // Seed jobs data matching the UI mockup as fallback
  const defaultJobs = [
    {
      id: "JOB-701",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "in_progress",
      statusText: "In Progress",
      date: "24 jul 2026",
    },
    {
      id: "JOB-702",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "cancelled",
      statusText: "Cancelled",
      date: "24 jul 2026",
    },
    {
      id: "JOB-703",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "completed",
      statusText: "Completed",
      date: "24 jul 2026",
    },
    {
      id: "JOB-704",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "in_progress",
      statusText: "In Progress",
      date: "24 jul 2026",
    },
    {
      id: "JOB-705",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "in_progress",
      statusText: "In Progress",
      date: "24 jul 2026",
    },
    {
      id: "JOB-706",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "in_progress",
      statusText: "In Progress",
      date: "24 jul 2026",
    },
    {
      id: "JOB-707",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "in_progress",
      statusText: "In Progress",
      date: "24 jul 2026",
    },
    {
      id: "JOB-708",
      title: "Wardrobe Installation",
      client: "Samuel O",
      professional: "Elvis Chioma",
      category: "Carpentry",
      amount: "₦85,000",
      status: "in_progress",
      statusText: "In Progress",
      date: "24 jul 2026",
    },
  ];
  */

  const [jobs, setJobs] = useState([]);

  const fetchJobsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsRes, jobsRes] = await Promise.allSettled([
        adminService.getJobsMetrics(),
        adminService.getJobs({ page: 1, limit: 20 }),
      ]);

      if (metricsRes.status === "fulfilled" && metricsRes.value?.data) {
        setMetrics(metricsRes.value.data);
      }

      if (jobsRes.status === "fulfilled" && jobsRes.value?.data) {
        const items = jobsRes.value.data.items || jobsRes.value.data.jobs || jobsRes.value.data;
        if (Array.isArray(items) && items.length > 0) {
          const normalized = items.map((j) => {
            const rawStatus = (j.status || "in_progress").toLowerCase();
            let statusText = "In Progress";
            if (rawStatus === "completed") statusText = "Completed";
            else if (rawStatus === "cancelled") statusText = "Cancelled";
            else if (rawStatus === "disputed") statusText = "Disputed";

            const rawAmount = j.amount || j.budget || j.price || 0;
            const formattedAmount = typeof rawAmount === "number" ? `₦${rawAmount.toLocaleString()}` : rawAmount;

            return {
              id: j.id || j._id || `JOB-${Math.floor(Math.random() * 1000)}`,
              title: j.title || "Job Project",
              client: j.client?.name || (typeof j.client === "string" ? j.client : "Samuel O"),
              professional: j.professional?.name || (typeof j.professional === "string" ? j.professional : "Elvis Chioma"),
              category: j.category || "Carpentry",
              amount: formattedAmount,
              status: rawStatus,
              statusText,
              date: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toLowerCase() : "",
            };
          });
          setJobs(normalized);
        } else {
          setJobs([]);
        }
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.warn("[AdminJobsSubpage] Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobsData();
  }, [fetchJobsData]);

  const formatNumber = (val) => {
    if (val === undefined || val === null) return null;
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  const formatTrend = (trend) => {
    if (trend === undefined || trend === null) return /* "+20% this week" */ "";
    if (typeof trend === "number") {
      const sign = trend >= 0 ? "+" : "";
      return `${sign}${trend}% this week`;
    }
    return trend;
  };

  const statCards = [
    {
      id: "total-jobs",
      title: "Total Jobs",
      value: formatNumber(metrics?.totalJobs?.value ?? metrics?.totalJobs) || (isLoading ? "..." : /* "1,284" */ "0"),
      trend: formatTrend(metrics?.totalJobs?.growthPercentage ?? metrics?.totalJobsTrend),
      icon: Users,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "active-jobs",
      title: "Active Jobs",
      value: formatNumber(metrics?.activeJobs?.value ?? metrics?.activeJobs ?? metrics?.inProgress) || (isLoading ? "..." : /* "156" */ "0"),
      trend: formatTrend(metrics?.activeJobs?.growthPercentage ?? metrics?.activeJobsTrend),
      icon: Briefcase,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "completed-jobs",
      title: "Completed Jobs",
      value: formatNumber(metrics?.completedJobs?.value ?? metrics?.completedJobs ?? metrics?.completed) || (isLoading ? "..." : /* "42" */ "0"),
      trend: formatTrend(metrics?.completedJobs?.growthPercentage ?? metrics?.completedJobsTrend),
      icon: CheckCircle2,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "disputed-jobs",
      title: "Disputed",
      value: formatNumber(metrics?.disputedJobs?.value ?? metrics?.disputedJobs ?? metrics?.disputed) || (isLoading ? "..." : /* "76" */ "0"),
      trend: formatTrend(metrics?.disputedJobs?.growthPercentage ?? metrics?.disputedJobsTrend),
      icon: PauseCircle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
    },
  ];

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.professional.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all"
        ? true
        : j.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" ? true : j.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", validCurrentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
          Good Morning Admin
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
          Review identity documents, certifications, and portfolios before approving professionals to join the marketplace.
        </p>
      </div>

      {/* Top 4 Stat Cards (Border-less) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-none shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-tight">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-full ${card.iconBg || ""}`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor} stroke-[1.8]`} />
                </div>
              </div>
              <div className="mt-3 mb-2">
                <span className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight block leading-none">
                  {card.value}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Jobs Table Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 mt-6 shadow-xs border-none">
        {/* Table Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
            All Jobs
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or ID...."
                className="pl-9 pr-4 py-2 bg-gray-50/90 focus:bg-gray-100/80 rounded-full text-xs font-medium text-gray-700 outline-none border-none w-full sm:w-64 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Jobs</option>
                <option value="carpentry">Carpentry</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 pr-8 bg-gray-50/90 hover:bg-gray-100/80 rounded-full text-xs font-semibold text-gray-600 border-none outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Apply Filter Button */}
            <button className="bg-[#016EA6] hover:bg-[#015582] text-white font-bold text-xs px-4.5 py-2 rounded-full cursor-pointer transition-all border-none">
              Apply filter
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-none">
            <thead>
              <tr className="border-none text-xs font-semibold text-gray-400">
                <th className="py-3.5 px-3">Job Title</th>
                <th className="py-3.5 px-3">Client</th>
                <th className="py-3.5 px-3">Professional</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Amount</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Date posted</th>
                <th className="py-3.5 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="border-none">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400 text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#016EA6]" />
                      <span>Loading marketplace jobs...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400 text-xs font-medium">
                    No jobs match the specified criteria.
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-none hover:bg-gray-50/70 rounded-2xl transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-3 text-xs sm:text-sm font-bold text-gray-800">
                      {job.title}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {job.client}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {job.professional}
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-700">
                      {job.category}
                    </td>
                    <td className="py-3.5 px-3 text-xs sm:text-sm font-extrabold text-gray-900">
                      {job.amount}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${
                          job.status === "in_progress"
                            ? "bg-[#FFF4E5] text-[#FF9800]"
                            : job.status === "completed"
                            ? "bg-[#E6F9F0] text-[#00CC66]"
                            : "bg-[#FFEBEB] text-[#FF4D4D]"
                        }`}
                      >
                        {job.statusText}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-gray-600">
                      {job.date}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="p-1.5 text-gray-400 hover:text-[#016EA6] rounded-lg transition-colors cursor-pointer border-none"
                        title="View job details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400 text-xs font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#016EA6]" />
              <span>Loading jobs...</span>
            </div>
          ) : paginatedJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs font-medium">
              No jobs found.
            </div>
          ) : (
            paginatedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-50/40 p-4 rounded-2xl space-y-2.5 border-none"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-sm">{job.title}</h4>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="p-1 text-gray-500 hover:text-[#016EA6]"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>Client: {job.client}</span>
                  <span>Pro: {job.professional}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-extrabold text-gray-900 text-sm">{job.amount}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      job.status === "in_progress"
                        ? "bg-[#FFF4E5] text-[#FF9800]"
                        : job.status === "completed"
                        ? "bg-[#E6F9F0] text-[#00CC66]"
                        : "bg-[#FFEBEB] text-[#FF4D4D]"
                    }`}
                  >
                    {job.statusText}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-2 border-none">
          <span className="text-xs font-medium text-gray-500">
            Showing page {validCurrentPage} of {totalPages} pages ({filteredJobs.length} jobs)
          </span>

          <div className="flex items-center gap-1.5">
            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage <= 1}
              className="w-7 h-7 rounded hover:bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((p, idx) => {
              if (p === "...") {
                return (
                  <span key={`ellipsis-${idx}`} className="text-xs text-gray-400 px-1 select-none">
                    ...
                  </span>
                );
              }
              const isActive = p === validCurrentPage;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded font-bold text-xs flex items-center justify-center cursor-pointer transition-all border-none ${
                    isActive
                      ? "bg-[#1E1B4B] text-white shadow-xs"
                      : "hover:bg-gray-100 text-gray-600 font-semibold"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage >= totalPages}
              className="w-7 h-7 rounded hover:bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Details view */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default AdminJobsSubpage;
