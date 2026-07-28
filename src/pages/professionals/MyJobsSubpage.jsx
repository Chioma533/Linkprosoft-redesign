import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
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

const MyJobsSubpage = () => {
  const { jobs, metrics } = useDashboardStore();
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
      icon: FiBriefcase,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
  ];

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter Jobs
  // const filteredJobs = myJobs.filter((job) => {
  //   const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                         job.client.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = categoryFilter ? job.category === categoryFilter : true;
  //   const matchesStatus = statusFilter ? job.status === statusFilter : true;
  //   return matchesSearch && matchesCategory && matchesStatus;
  // });

  const {
    search,
    setSearch,
    locationFilter,
    setLocationFilter,
    budgetFilter,
    setBudgetFilter,
    filteredJobs,
  } = useJobFilter(jobs);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-sky-50 text-sky-500";
      case "Pending":
        return "bg-orange-50 text-orange-500";
      case "Completed":
        return "bg-emerald-50 text-emerald-600";
      case "Cancelled":
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">All jobs</h3>
            
            {/* Desktop Filters */}
            <div className="hidden lg:flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-auto">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Jobs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-56 pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
              >
                <option value="">All categories</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Painting">Painting</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button className="w-full sm:w-auto bg-[#016EA6] hover:bg-[#061EA6] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer text-center">
                Apply filter
              </button>
            </div>

            {/* Mobile Filters */}
            <div className="flex lg:hidden items-center justify-between gap-4 w-full max-w-[280px]">
              {/* Dropdown status text */}
              <div className="relative flex items-center pr-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-0 pr-6 py-2 bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer appearance-none border-none font-sans capitalize"
                >
                  <option value="">All jobs</option>
                  <option value="Active">Active jobs</option>
                  <option value="Pending">Pending jobs</option>
                  <option value="Completed">Completed jobs</option>
                  <option value="Cancelled">Cancelled jobs</option>
                </select>
                <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-900 w-4 h-4 pointer-events-none" />
              </div>

              {/* Search input */}
              <div className="relative max-w-[130px] sm:max-w-xs">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Search Jobs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none focus:border-[#016EA6] focus:bg-white transition-all font-medium text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Desktop Job List Table */}
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
                {currentItems.length > 0 ? (
                  currentItems.map((job) => (
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
                        {job.datePosted} • 9:00 AM
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
                        <button className="text-blue-500 hover:text-blue-700 font-bold transition-colors inline-flex items-center gap-1 cursor-pointer">
                          <span>View</span>
                          <FiChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-gray-400 font-semibold"
                    >
                      No jobs match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {currentItems.length > 0 ? (
              currentItems.map((job) => (
                <MobileJobCard
                  key={job.id}
                  job={job}
                  onViewDetails={() => {}}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-400 font-semibold text-xs bg-gray-50 rounded-2xl">
                No jobs match the current filters.
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />{" "}
    </div>
    </div>
  );
};

export default MyJobsSubpage;
