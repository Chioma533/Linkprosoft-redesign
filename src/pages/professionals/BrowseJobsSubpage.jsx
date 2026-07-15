import React, { useState } from "react";
import { FiSearch, FiMapPin, FiCalendar, FiDollarSign, FiX, FiCheck } from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import StatsCard from "../../components/ui/StatsCard";
import JobCard from "../../components/ui/JobCard";
import { toast } from "react-hot-toast";

const BrowseJobsSubpage = () => {
  const { jobs, metrics, applyForJob, isLoading } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount).replace("NGN", "₦");
  };

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesBudget = budgetFilter ? job.budget >= parseInt(budgetFilter) : true;
    return matchesSearch && matchesLocation && matchesBudget;
  });

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setBidAmount(job.budget.toString());
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    try {
      await applyForJob(selectedJob.id, parseFloat(bidAmount), coverLetter);
      toast.success("Application submitted successfully!");
      setSelectedJob(null);
      setBidAmount("");
      setCoverLetter("");
    } catch (err) {
      toast.error(err.message || "Failed to submit application");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good Morning Samuel</h2>
        <p className="text-sm text-gray-400 mt-1">Manage, jobs, appointment, finance and schedules</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Earnings" value={formatCurrency(metrics?.earningsTotal || 500000)} />
        <StatsCard title="Upcoming jobs" value={String(metrics?.upcomingJobsCount || 172)} />
        <StatsCard title="Completed jobs" value={String(metrics?.completedJobsCount || 288)} />
        <StatsCard title="Performance" value={`${metrics?.performancePercentage || 80}%`} />
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Jobs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full md:w-auto flex-1 max-w-[180px]">
          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full pl-11 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer text-gray-500 font-semibold"
          >
            <option value="">Location</option>
            <option value="Lekki">Lekki</option>
            <option value="Ikeja">Ikeja</option>
            <option value="Surulere">Surulere</option>
            <option value="Ikoyi">Ikoyi</option>
          </select>
        </div>

        {/* Date Posted */}
        <div className="relative w-full md:w-auto flex-1 max-w-[180px]">
          <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            className="w-full pl-11 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer text-gray-500 font-semibold"
          >
            <option>Date posted</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>This week</option>
          </select>
        </div>

        {/* Budget */}
        <div className="relative w-full md:w-auto flex-1 max-w-[180px]">
          <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="w-full pl-11 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer text-gray-500 font-semibold"
          >
            <option value="">Budget</option>
            <option value="10000">₦10,000 +</option>
            <option value="30000">₦30,000 +</option>
            <option value="50000">₦50,000 +</option>
          </select>
        </div>

        {/* Apply filter button */}
        <button className="w-full md:w-auto bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer">
          Apply
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApplyClick} />
          ))
        ) : (
          <div className="col-span-full bg-white p-8 text-center border border-gray-100 rounded-3xl">
            <p className="text-sm font-semibold text-gray-400">No jobs matching your filter parameters were found.</p>
          </div>
        )}
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

      {/* Apply Bidding Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl border border-gray-100 animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
              <h3 className="text-base font-bold text-gray-900">Bid for job</h3>
              <button onClick={() => setSelectedJob(null)} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-800 leading-tight">{selectedJob.title}</h4>
                <p className="text-[10px] text-blue-500 font-medium mt-1">Budget: {formatCurrency(selectedJob.budget)}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Your Bid Amount (₦)</label>
                <input
                  type="number"
                  placeholder="Bidding amount"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Cover Letter / Note</label>
                <textarea
                  rows={3}
                  placeholder="Explain why you are the best fit for this service..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? "Submitting..." : (
                    <>
                      <FiCheck className="w-3.5 h-3.5" />
                      <span>Submit Bid</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobsSubpage;
