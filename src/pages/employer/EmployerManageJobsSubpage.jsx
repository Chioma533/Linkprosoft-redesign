import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import StatsCard from "../../components/ui/StatsCard";
import PostJobWizard from "./PostJobWizard";
import { jobService } from "../../api/services/jobService";

const EmployerManageJobsSubpage = ({ onViewProject }) => {
  const { user } = useAuthStore();
  const userName = user?.fullName || user?.full_name || "Elvis Chimamanda";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("All");
  const [showWizard, setShowWizard] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployerJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await jobService.getMyEmployerJobs();
      if (response && response.success && response.data) {
        // Handle array response or paginated DTO response ({ items: [...] })
        const rawItems = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];

        // Normalize backend fields to UI props
        const formatted = rawItems.map((item) => ({
          id: String(item.id || item._id || "ORD-000"),
          title: item.title || "Untitled Job",
          category: item.category || (item.skill && item.skill.name) || "General",
          location: item.location || "Remote",
          budget: item.budget || 0,
          currency: item.currency || "NGN",
          professional: item.professional || (item.assignedProfessional && item.assignedProfessional.name) || "Johnathan David",
          status: normalizeStatus(item.status),
        }));

        setJobs(formatted);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Error fetching employer jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployerJobs();
  }, [fetchEmployerJobs]);

  const normalizeStatus = (rawStatus) => {
    if (!rawStatus) return "Awaiting Offers";
    const s = String(rawStatus).toLowerCase();
    if (s === "draft" || s === "posted" || s.includes("offer")) return "Awaiting Offers";
    if (s.includes("escrow")) return "Awaiting Escrow";
    if (s.includes("progress") || s === "active") return "In Progress";
    if (s.includes("complete")) return "Completed";
    if (s.includes("cancel")) return "Canceled";
    return rawStatus;
  };

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

  // Dynamic Metrics Calculations
  const totalAllJobs = jobs.length;
  const upcomingJobsCount = jobs.filter((j) =>
    ["In Progress", "Awaiting Escrow", "Awaiting Offers"].includes(j.status)
  ).length;
  const completedJobsCount = jobs.filter((j) => j.status === "Completed").length;
  const cancelledJobsCount = jobs.filter((j) => j.status === "Canceled").length;

  // Dynamic Sub-Tabs calculation
  const subTabs = [
    { label: "All", count: jobs.length },
    { label: "Awaiting Offers", count: jobs.filter((j) => j.status === "Awaiting Offers").length },
    { label: "Awaiting Escrow", count: jobs.filter((j) => j.status === "Awaiting Escrow").length },
    { label: "In progress", count: jobs.filter((j) => j.status === "In Progress").length },
    { label: "Canceled", count: jobs.filter((j) => j.status === "Canceled").length },
    { label: "Completed", count: jobs.filter((j) => j.status === "Completed").length },
  ];

  const getStatusStyle = (status) => {
    if (status === "In Progress") return "bg-orange-50 text-orange-500";
    if (status === "Awaiting Escrow") return "bg-sky-50 text-[#016EA6]";
    if (status === "Awaiting Offers") return "bg-amber-50 text-amber-600";
    if (status === "Completed") return "bg-green-50 text-green-600";
    return "bg-red-50 text-red-500";
  };

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;

    if (activeSubTab === "All") return matchesSearch && matchesCategory;
    if (activeSubTab === "Awaiting Offers") return job.status === "Awaiting Offers" && matchesSearch && matchesCategory;
    if (activeSubTab === "Awaiting Escrow") return job.status === "Awaiting Escrow" && matchesSearch && matchesCategory;
    if (activeSubTab === "In progress") return job.status === "In Progress" && matchesSearch && matchesCategory;
    if (activeSubTab === "Canceled") return job.status === "Canceled" && matchesSearch && matchesCategory;
    if (activeSubTab === "Completed") return job.status === "Completed" && matchesSearch && matchesCategory;
    return false;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-normal text-gray-900">{getGreeting()} {userName}</h2>
          <p className="text-sm text-gray-400 mt-1 font-light">Manage your jobs and payments effortlessly.</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center justify-center gap-2 bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer text-center self-start sm:self-center"
        >
          <FiPlus className="w-4 h-4" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="All Jobs" value={totalAllJobs} icon={FiBriefcase} iconColor="text-blue-500"  />
        <StatsCard title="Upcoming jobs" value={upcomingJobsCount} icon={FiClock} iconColor="text-orange-500" />
        <StatsCard title="Completed jobs" value={completedJobsCount} icon={FiCheckCircle} iconColor="text-green-500" />
        <StatsCard title="Cancelled jobs" value={cancelledJobsCount} icon={FiXCircle} iconColor="text-red-500" />
      </div>

      {/* Filter Options */}
      <div className="rounded-full flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by job ID or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#e9e8e7] rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-[#e9e8e7] rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
          >
            <option value="">All Categories</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="General">General</option>
          </select>

          <select
            className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-[#e9e8e7] rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold"
          >
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
          </select>

          <button
            onClick={fetchEmployerJobs}
            className="bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer text-center"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white p-[50px] rounded-3xl">
        {/* Scrollable Sub-Tabs */}
        <div className="overflow-x-auto pb-2 border-b border-[#e9e8e7]/50">
          <div className="flex items-center gap-6 min-w-max">
            {subTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveSubTab(tab.label)}
                className={`pb-3 text-[18px] font-regular transition-all border-b-2 relative cursor-pointer
                  ${activeSubTab === tab.label 
                    ? "border-[#016EA6] text-[#016EA6]" 
                    : "border-transparent text-gray-400 hover:text-gray-900"
                  }
                `}
                style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 px-2 py-0.5 bg-gray-50 text-gray-400 font-semibold text-[9px] rounded-full">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Cards List */}
        <div className="space-y-4 mt-8">
          {isLoading ? (
            <div className="bg-white p-12 text-center rounded-3xl space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#016EA6] border-t-transparent"></div>
              <p className="text-sm font-semibold text-gray-500">Loading your posted jobs...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 p-6 text-center rounded-3xl text-rose-600 text-sm font-medium">
              {error}
              <button
                onClick={fetchEmployerJobs}
                className="ml-3 underline font-bold hover:text-rose-800"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-[#f9f9f9] p-6 rounded-3xl border border-[#e9e8e7]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300">
                {/* Left Details */}
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full md:w-auto">
                  <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-rose-600 rounded-2xl shrink-0 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                    {job.title ? job.title.charAt(0).toUpperCase() : "J"}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{job.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider ${getStatusStyle(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold">
                      ID: {job.id} • <span className="text-gray-500">{job.category}</span>
                    </p>
                    <p className="text-[11px] text-gray-500 font-semibold">
                      📍 {job.location} • <span className="text-gray-900 font-extrabold">{formatCurrency(job.budget)}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 bg-slate-50 px-2 py-1 rounded-lg w-max">
                      <div className="w-4 h-4 bg-sky-100 rounded-full flex items-center justify-center text-[#016EA6] font-bold text-[8px]">
                        {job.professional ? job.professional.substring(0, 2).toUpperCase() : "JD"}
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold">{job.professional}</span>
                    </div>
                  </div>
                </div>

                {/* View Project Button */}
                <button
                  onClick={() => onViewProject(job.id)}
                  className="w-full md:w-auto bg-[#EBF3FA] hover:bg-[#016EA6] text-[#016EA6] hover:text-white px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer text-center"
                >
                  View Project
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 text-center rounded-3xl">
              <p className="text-sm font-semibold text-gray-400">No jobs match your filter parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Post a Job Wizard */}
      {showWizard && (
        <PostJobWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            fetchEmployerJobs();
          }}
        />
      )}
    </div>
  );
};

export default EmployerManageJobsSubpage;

