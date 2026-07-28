import React, { useState } from "react";
import { FiSearch, FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import StatsCard from "../../components/ui/StatsCard";

const EmployerManageJobsSubpage = ({ onViewProject }) => {
  const { user } = useAuthStore();
  const userName = user?.fullName || user?.full_name || "Elvis Chimamanda";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("All");

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

  const subTabs = [
    { label: "All", count: 18 },
    { label: "Awaiting Offers", count: 18 },
    { label: "Awaiting Escrow", count: 18 },
    { label: "In progress", count: 8 },
    { label: "Canceled", count: 87 },
    { label: "Completed", count: 8 }
  ];

  const jobsData = [
    { id: "ORD657783", title: "Wardrobe Installation", category: "Carpentry", location: "Lekki Lagos", budget: 500000, professional: "Johnathan David", status: "In Progress" },
    { id: "ORD657784", title: "Kitchen Cabinet Repair", category: "Carpentry", location: "Ikeja Lagos", budget: 350000, professional: "Johnathan David", status: "Awaiting Escrow" },
    { id: "ORD657785", title: "Plumbing Refurbishment", category: "Plumbing", location: "Lekki Lagos", budget: 120000, professional: "David Jonathan", status: "Awaiting Offers" },
    { id: "ORD657786", title: "Modern Bedroom Closet", category: "Carpentry", location: "Ikoyi Lagos", budget: 600000, professional: "Marvelous Samuel", status: "Completed" },
    { id: "ORD657787", title: "Living Room Cabinet", category: "Carpentry", location: "Surulere Lagos", budget: 200000, professional: "Johnathan David", status: "Canceled" }
  ];

  const getStatusStyle = (status) => {
    if (status === "In Progress") return "bg-orange-50 text-orange-500";
    if (status === "Awaiting Escrow") return "bg-sky-50 text-[#016EA6]";
    if (status === "Awaiting Offers") return "bg-amber-50 text-amber-600";
    if (status === "Completed") return "bg-green-50 text-green-600";
    return "bg-red-50 text-red-500";
  };

  // Simple filtering
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
    
    // Tab filters
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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getGreeting()} {userName}</h2>
          <p className="text-sm text-gray-400 mt-1 font-semibold max-w-xl">
            Manage your active projects, track milestones, and review top professional candidates for your upcoming installations.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#016EA6] hover:bg-[#061EA6] text-white py-3 px-6 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all self-start sm:self-center cursor-pointer">
          <FiPlus className="w-4 h-4" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="All Jobs" value="189" icon={FiBriefcase} iconColor="text-blue-500" iconBg="bg-blue-50" />
        <StatsCard title="Upcoming jobs" value="172" icon={FiClock} iconColor="text-orange-500" iconBg="bg-orange-50" />
        <StatsCard title="Completed jobs" value="288" icon={FiCheckCircle} iconColor="text-green-500" iconBg="bg-green-50" />
        <StatsCard title="Cancelled jobs" value="56" icon={FiXCircle} iconColor="text-red-500" iconBg="bg-red-50" />
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by job ID or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
          >
            <option value="">All Categories</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Plumbing">Plumbing</option>
          </select>

          <select
            className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none cursor-pointer text-gray-500 font-semibold"
          >
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
          </select>

          <button className="bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer text-center">
            Apply
          </button>
        </div>
      </div>

      {/* Scrollable Sub-Tabs */}
      <div className="overflow-x-auto pb-2 border-b border-gray-100/50">
        <div className="flex items-center gap-6 min-w-max">
          {subTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveSubTab(tab.label)}
              className={`pb-3 text-xs font-bold transition-all border-b-2 relative cursor-pointer
                ${activeSubTab === tab.label 
                  ? "border-[#016EA6] text-[#016EA6]" 
                  : "border-transparent text-gray-400 hover:text-gray-900"
                }
              `}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 px-2 py-0.5 bg-gray-50 text-gray-400 font-semibold text-[9px] rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Cards List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow duration-300">
              {/* Left Details */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full md:w-auto">
                <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-rose-600 rounded-2xl shrink-0 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                  W
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
                    <div className="w-4 h-4 bg-sky-100 rounded-full flex items-center justify-center text-[#016EA6] font-bold text-[8px]">JD</div>
                    <span className="text-[10px] text-gray-500 font-bold">{job.professional}</span>
                  </div>
                </div>
              </div>

              {/* View Project Button */}
              <button
                onClick={() => onViewProject(job.id)}
                className="w-full md:w-auto bg-[#EBF3FA] hover:bg-[#016EA6] text-[#016EA6] hover:text-white px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer text-center"
              >
                View Project
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center border border-gray-100 rounded-3xl">
            <p className="text-sm font-semibold text-gray-400">No jobs match your filter parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerManageJobsSubpage;
