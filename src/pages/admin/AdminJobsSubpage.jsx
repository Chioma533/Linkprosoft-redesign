import React, { useState } from "react";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  PauseCircle, 
  Search, 
  ChevronDown, 
  Eye, 
  ArrowUpRight 
} from "lucide-react";
import JobDetailModal from "./components/JobDetailModal";

const AdminJobsSubpage = ({ onNavigate }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Seed jobs data matching the UI mockup
  const [jobs, setJobs] = useState([
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
  ]);

  const statCards = [
    {
      id: "total-jobs",
      title: "Total Jobs",
      value: "1,284",
      trend: "+20% this week",
      icon: Users,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "active-jobs",
      title: "Active Jobs",
      value: "156",
      trend: "+20% this week",
      icon: Briefcase,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "completed-jobs",
      title: "Completed Jobs",
      value: "42",
      trend: "+20% this week",
      icon: CheckCircle2,
      iconColor: "text-[#016EA6]",
    },
    {
      id: "disputed-jobs",
      title: "Disputed",
      value: "76",
      trend: "+20% this week",
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
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400 text-xs font-medium">
                    No jobs match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
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
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs font-medium">
              No jobs found.
            </div>
          ) : (
            filteredJobs.map((job) => (
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
            Showing page 1 of 5 pages
          </span>

          <div className="flex items-center gap-1.5">
            <button className="w-6 h-6 rounded bg-[#1E1B4B] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs border-none">
              1
            </button>
            <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
              2
            </button>
            <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
              3
            </button>
            <span className="text-xs text-gray-400 px-1">...</span>
            <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-500 font-semibold text-xs flex items-center justify-center cursor-pointer border-none">
              5
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
