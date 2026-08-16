import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiArrowRight,
} from "react-icons/fi";
import MobileJobCard from "../../components/ui/MobileJobCard";
import { useDashboardStore } from "../../store/dashboardStore";
import WelcomeHeader from "../../components/common/WelcomeHeader";
import { formatCurrency } from "../../utils/formatCurrency";
import DashboardStats from "../../components/common/DashboardStats";
import { useJobFilter } from "../../hooks/useJobFilter";
import Pagination from "../../components/common/Pagination";
import { PAGINATION } from "../../constants/pagination";
import { usePagination } from "../../hooks/usePagination";
import SearchInput from "../../components/filters/SearchInput";
import FilterSelect from "../../components/filters/FilterSelect";
import { categoryOptions, statusOptions } from "../../constants/filterOptions";
import MoneyBag02Icon from "../../components/icons/MoneyBag02Icon";

const MyJobsSubpage = () => {
  const { myJobs = [], metrics, setSelectedJob, setPreviousTab, setActiveTab } = useDashboardStore();

  const stats = [
    {
      id: "active-jobs",
      title: "Active Jobs",
      value: String(metrics?.activeJobsCount ?? 0),
      icon: FiBriefcase,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      id: "upcoming-jobs",
      title: "Upcoming Jobs",
      value: String(metrics?.upcomingJobsCount ?? 0),
      icon: FiBriefcase,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
    {
      id: "completed-jobs",
      title: "Completed Jobs",
      value: String(metrics?.completedJobsCount ?? 0),
      icon: FiCheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
    },
    {
      id: "earnings",
      title: "Total Earnings",
      value: formatCurrency(metrics?.earningsTotal ?? 0),
      icon: MoneyBag02Icon,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
  ];

  const normalizedJobs = (myJobs || []).map((job, idx) => ({
    ...job,
    id: job.id || idx + 1,
    orderId: job.orderId || job.order_id || (job.id ? `ORD-${String(job.id).slice(0, 6)}` : `ORD-${idx + 1}`),
    title: job.title || job.jobTitle || "Contracted Assignment",
    category: job.category?.name || job.category || "General Service",
    client: job.client?.fullName || job.client?.name || job.client || job.employerName || "Direct Client",
    budget: Number(job.budget || job.totalAmount || job.agreedAmount || 0),
    status: job.status || "Active",
    schedule: job.schedule || job.datePosted || job.createdAt || "In Progress",
  }));

  const {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    filteredJobs,
  } = useJobFilter(normalizedJobs);

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "active":
      case "in progress":
        return "bg-sky-50 text-sky-500";
      case "pending":
      case "under review":
        return "bg-orange-50 text-orange-500";
      case "completed":
        return "bg-emerald-50 text-emerald-600";
      case "cancelled":
        return "bg-red-50 text-red-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const { pagination, currentItems, handlePageChange } = usePagination(
    filteredJobs,
    PAGINATION.BROWSE_JOBS,
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeHeader />
      <DashboardStats stats={stats} />

      {/* Main Table Wrapper */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
        <div>
          {/* Header and Filter Row */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="md:text-base text-sm whitespace-nowrap font-bold text-gray-900">
                All Contracted Jobs
              </h3>
              {normalizedJobs.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#016EA6]">
                  {normalizedJobs.length}
                </span>
              )}
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <SearchInput
                placeholder="Search by job or client..."
                value={search}
                onChange={setSearch}
                debounce={300}
                className="w-37.5 sm:w-80 pr-4 py-2.5 rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
              />

              <FilterSelect
                value={categoryFilter}
                icon={FiChevronDown}
                onChange={setCategoryFilter}
                options={categoryOptions}
                className="w-full sm:w-auto pr-4 py-2.5 rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
              />

              <FilterSelect
                value={statusFilter}
                icon={FiChevronDown}
                onChange={setStatusFilter}
                options={statusOptions}
                className="w-full sm:w-auto pr-4 py-2.5 rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
              />
            </div>

            {/* Mobile Search input */}
            <div className="relative lg:hidden max-w-32.5 sm:max-w-xs">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
              />
            </div>
          </div>

          {/* Desktop Job List Table / Empty State */}
          {currentItems.length > 0 ? (
            <>
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400 font-semibold">
                      <th className="pb-3 font-semibold">Job Title</th>
                      <th className="pb-3 font-semibold">Client</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Schedule</th>
                      <th className="pb-3 font-semibold">Budget</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentItems.map((job) => (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50/30 transition-colors"
                      >
                        <td className="py-4 font-bold text-gray-800">
                          {job.title}
                        </td>
                        <td className="py-4 font-semibold text-gray-800">
                          {job.client}
                        </td>
                        <td className="py-4 font-medium text-gray-400">
                          {job.category}
                        </td>
                        <td className="py-4 font-semibold text-gray-500">
                          {job.schedule}
                        </td>
                        <td className="py-4 font-bold text-gray-800">
                          {formatCurrency(job.budget)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${getStatusStyle(job.status)}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setPreviousTab("my-jobs");
                              setActiveTab("project-details");
                            }}
                            className="text-[#016EA6] hover:text-[#061EA6] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>View</span>
                            <FiChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden space-y-4">
                {currentItems.map((job) => (
                  <MobileJobCard
                    key={job.id}
                    job={job}
                    onViewDetails={() => {
                      setSelectedJob(job);
                      setPreviousTab("my-jobs");
                      setActiveTab("project-details");
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Modern Empty State */
            <div className="py-14 px-4 rounded-2xl bg-gradient-to-b from-gray-50/60 to-white border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#016EA6] flex items-center justify-center mb-3.5 shadow-xs border border-sky-100/50">
                <FiBriefcase className="w-6 h-6 stroke-[2]" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">No Contracted Jobs Found</h4>
              <p className="text-xs text-gray-400 font-medium max-w-sm mb-5 leading-relaxed">
                {search || categoryFilter || statusFilter
                  ? "No jobs match your current filter criteria. Try clearing some filters."
                  : "You do not have any active or contracted jobs yet. Explore open job listings and submit proposals to get hired."}
              </p>
              <div className="flex items-center gap-3">
                {search || categoryFilter || statusFilter ? (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("");
                      setStatusFilter("");
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab("browse-jobs")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <span>Browse Open Jobs</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {currentItems.length > 0 && (
        <div>
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MyJobsSubpage;

