import React, { useState } from "react";
import { FiSearch, FiFilter, FiChevronRight } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import StatsCard from "../../components/ui/StatsCard";

const MyJobsSubpage = () => {
  const { myJobs } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace("NGN", "₦");
  };

  // Filter Jobs
  const filteredJobs = myJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? job.category === categoryFilter : true;
    const matchesStatus = statusFilter ? job.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good Morning Samuel</h2>
        <p className="text-sm text-gray-400 mt-1">Manage, jobs, appointment, finance and schedules</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active Jobs" value="100" />
        <StatsCard title="Upcoming jobs" value="88" />
        <StatsCard title="Completed jobs" value="500" />
        <StatsCard title="Total Earnings" value="₦500,000" />
      </div>

      {/* Main Table Wrapper */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between">
        <div>
          {/* Header and Filter Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">All jobs</h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Jobs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-56 pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
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
                className="pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button className="bg-[#016EA6] hover:bg-[#061EA6] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer text-center">
                Apply filter
              </button>
            </div>
          </div>

          {/* Job List Table */}
          <div className="overflow-x-auto">
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
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 font-bold text-gray-800">{job.title}</td>
                      <td className="py-4 font-semibold text-gray-800">{job.client}</td>
                      <td className="py-4 font-medium text-gray-400">{job.category}</td>
                      <td className="py-4 font-semibold text-gray-500">
                        {job.datePosted} • 9:00 AM
                      </td>
                      <td className="py-4 font-bold text-gray-800">
                        {formatCurrency(job.budget)}
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${getStatusStyle(job.status)}`}>
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
                    <td colSpan={7} className="py-8 text-center text-gray-400 font-semibold">
                      No jobs match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <span className="text-xs font-medium text-gray-400">Showing page 1 of 5 pages</span>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#016EA6] text-white text-xs font-bold shadow-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-50">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-50">3</button>
          <span className="text-gray-400 text-xs px-1">..</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-50">5</button>
        </div>
      </div>
    </div>
  );
};

export default MyJobsSubpage;
