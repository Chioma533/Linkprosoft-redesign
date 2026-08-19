import React, { useState, useEffect } from "react";
import {
  FiBriefcase,
  FiStar,
  FiCheckCircle,
  FiX,
  FiSend,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { useDashboardStore } from "../../store/dashboardStore";
import JobCard from "../../components/ui/JobCard";
import { toast } from "react-hot-toast";
import WelcomeHeader from "../../components/common/WelcomeHeader";
import DashboardStats from "../../components/common/DashboardStats";
import ProfessionalSearchBar from "../../components/buyer/ProfessionalSearchBar";
import Pagination from "../../components/common/Pagination";
import { useJobFilter } from "../../hooks/useJobFilter";
import { usePagination } from "../../hooks/usePagination";
import EmptyState from "../../components/ui/EmptyState";
import { PAGINATION } from "../../constants/pagination";
import { formatCurrency } from "../../utils/formatCurrency";

const BrowseJobsSubpage = () => {
  const { jobs = [], metrics, applyForJob, globalSearchQuery } = useDashboardStore();

  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidForm, setBidForm] = useState({
    bidAmount: "",
    estimatedDays: "",
    coverLetter: "",
  });

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
      id: "performance",
      title: "Performance",
      value: `${metrics?.performancePercentage ?? 0}%`,
      icon: FiStar,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
  ];

  const normalizedJobs = (jobs || []).map((job, idx) => ({
    ...job,
    id: job.id || idx + 1,
    title: job.title || "Open Job Posting",
    description: job.description || "No description provided.",
    category: job.category?.name || job.category || "General",
    location: job.location || "Remote / Nigeria",
    budget: Number(job.budget || job.budgetMax || 0),
    client: job.client?.fullName || job.client || job.employerName || "Verified Buyer",
    postedAt: job.postedAt || job.createdAt || "Recently posted",
    status: job.status || "Active",
  }));

  const {
    search,
    setSearch,
    locationFilter,
    setLocationFilter,
    budgetFilter,
    setBudgetFilter,
    ratingFilter,
    setRatingFilter,
    filteredJobs,
  } = useJobFilter(normalizedJobs);

  useEffect(() => {
    if (globalSearchQuery) {
      setSearch(globalSearchQuery);
    }
  }, [globalSearchQuery, setSearch]);

  const { pagination, currentItems, handlePageChange } = usePagination(
    filteredJobs,
    PAGINATION.BROWSE_JOBS,
  );

  const handleOpenApplyModal = (job) => {
    setSelectedJobToApply(job);
    setBidForm({
      bidAmount: job.budget ? String(job.budget) : "",
      estimatedDays: "3",
      coverLetter: "",
    });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!bidForm.bidAmount || Number(bidForm.bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }
    if (!bidForm.coverLetter.trim()) {
      toast.error("Please include a brief proposal message or cover letter.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (applyForJob) {
        await applyForJob(
          selectedJobToApply.id,
          Number(bidForm.bidAmount),
          bidForm.coverLetter
        );
      }
      toast.success(`Proposal submitted successfully for: ${selectedJobToApply.title}`);
      setSelectedJobToApply(null);
    } catch (error) {
      toast.error(error.message || "Failed to submit proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterApply = ({ searchQuery, location, rating, budget }) => {
    setSearch(searchQuery ?? "");
    setLocationFilter(location ?? "");
    setRatingFilter(rating ?? "");
    setBudgetFilter(budget ?? "");
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <WelcomeHeader />

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <ProfessionalSearchBar
          onApply={handleFilterApply}
          initialQuery={search}
        />
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleOpenApplyModal} />
          ))
        ) : (
          <div className="col-span-full py-14 px-4 rounded-3xl bg-white border border-gray-100/60 flex flex-col items-center justify-center text-center">
            <div className="text-[#016EA6] mb-3 flex items-center justify-center">
              <FiBriefcase className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">No Open Jobs Found</h4>
            <p className="text-xs text-gray-400 max-w-sm mb-4">
              {search || locationFilter || budgetFilter
                ? "No job listings matched your filter query. Try clearing some filters."
                : "New job opportunities will appear here when buyers post requests."}
            </p>
            {(search || locationFilter || budgetFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setLocationFilter("");
                  setBudgetFilter("");
                  setRatingFilter("");
                }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        )}
      </div>

      {currentItems.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Proposal / Bid Submission Modal */}
      {selectedJobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fade-in text-gray-800">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJobToApply(null)}
              className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#016EA6] flex items-center justify-center shrink-0">
                <FiSend className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#016EA6]">Submit Proposal</span>
                <h3 className="text-base font-bold text-gray-900 leading-snug">{selectedJobToApply.title}</h3>
                <p className="text-xs text-gray-400 font-semibold">Client: {selectedJobToApply.client} • Budget: {formatCurrency(selectedJobToApply.budget)}</p>
              </div>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Bid Amount (₦)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₦</span>
                    <input
                      type="number"
                      required
                      value={bidForm.bidAmount}
                      onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
                      placeholder="e.g. 45000"
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-semibold text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Days</label>
                  <div className="relative">
                    <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="number"
                      value={bidForm.estimatedDays}
                      onChange={(e) => setBidForm({ ...bidForm, estimatedDays: e.target.value })}
                      placeholder="e.g. 3"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-semibold text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Proposal & Cover Letter</label>
                <textarea
                  rows={4}
                  required
                  value={bidForm.coverLetter}
                  onChange={(e) => setBidForm({ ...bidForm, coverLetter: e.target.value })}
                  placeholder="Explain why you are the best fit for this project, past relevant experience, and tools you will use..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] focus:bg-white font-medium text-gray-800 resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100/40 text-[11px] text-[#016EA6] font-medium leading-relaxed">
                Escrow protected: The client funds the full project into escrow before work begins.
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedJobToApply(null)}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <FiSend className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Send Proposal"}</span>
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

