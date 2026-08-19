import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import ProfessionalNavbar from "../../layouts/professional/ProfessionalNavbar";
import JobSearchBar from "../../components/professional/JobSearchBar";
import JobCard from "../../components/professional/JobCard";
import ProfessionalBottomNav from "../../components/professional/ProfessionalBottomNav";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";

/* ─────────────────────────────────────────────────────────────
   Mock data — 108 jobs, 9 per page (3×3 grid), 5 pages total display
   ───────────────────────────────────────────────────────────── */
const ALL_JOBS = Array.from({ length: 108 }, (_, i) => ({
  id: i + 1,
  title: "Wardrobe Installation",
  employerName: "Jonathan David",
  employerAvatarUrl: "/professional_avatar.png",
  postedAgo: "Posted 2 min ago",
  description:
    "Hi, I'm looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers.",
  budget: 10000,
  location: "Lagos",
  category: "Carpentry",
  datePostedDays: 0, // 0 = today
}));

const ITEMS_PER_PAGE = 9;

/* ─────────────────────────────────────────────────────────────
   Pagination sub-component (identical pattern to DefaultBuyerScreen)
   ───────────────────────────────────────────────────────────── */
const ProfessionalPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
      <span className="text-xs text-gray-500 font-medium">
        <span className="sm:hidden text-gray-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <span className="hidden sm:inline">
          Showing page {currentPage} of {totalPages} pages
        </span>
      </span>

      <div className="flex items-center gap-1.5">
        <button
          id="job-pagination-prev-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <FiChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPages().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1 text-xs text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              id={`job-pagination-page-${page}-btn`}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-[#016EA6] text-white shadow-sm"
                  : "border border-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          id="job-pagination-next-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────── */
const DefaultProfessionalScreen = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [verificationDismissed, setVerificationDismissed] = useState(false);
  const [filters, setFilters] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimePassed(true);
      setIsInitialLoading(false);
    }, 2500);
    return () => clearTimeout(minTimer);
  }, []);

  /* ── Filtering ─────────────────────────────────────────────── */
  const filteredJobs = useMemo(() => {
    return ALL_JOBS.filter((job) => {
      const search = filters.searchQuery?.toLowerCase() || "";
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.category.toLowerCase().includes(search);

      const matchesLocation =
        !filters.location ||
        filters.location === "All Locations" ||
        job.location === filters.location;

      const normalizedBudget = filters.budget?.replace(/–/g, "-") || "";
      const matchesBudget =
        !normalizedBudget ||
        normalizedBudget === "Any Budget" ||
        (() => {
          if (normalizedBudget === "Under ₦5,000") return job.budget < 5000;
          if (normalizedBudget === "₦5,000 - ₦20,000")
            return job.budget >= 5000 && job.budget <= 20000;
          if (normalizedBudget === "₦20,000 - ₦50,000")
            return job.budget >= 20000 && job.budget <= 50000;
          if (normalizedBudget === "₦50,000+") return job.budget > 50000;
          return true;
        })();

      const matchesDate =
        !filters.datePosted ||
        filters.datePosted === "Any time" ||
        (() => {
          if (filters.datePosted === "Today") return job.datePostedDays === 0;
          if (filters.datePosted === "This week") return job.datePostedDays <= 7;
          if (filters.datePosted === "This month") return job.datePostedDays <= 30;
          if (filters.datePosted === "Last 3 months") return job.datePostedDays <= 90;
          return true;
        })();

      return matchesSearch && matchesLocation && matchesBudget && matchesDate;
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedJobs = filteredJobs.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDismissVerification = () => {
    setVerificationDismissed(true);
  };

  if (isInitialLoading || !minTimePassed) {
    return <LoadingScreen variant="professional" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-12">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <ProfessionalNavbar activePage="browse-jobs" />

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section id="professional-hero-section" className="bg-[#EEF5F9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            {/* Left: headline + verification banner */}
            <div className="flex-1 max-w-full sm:max-w-xl">
              <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
                Find Your Next Opportunity
              </h1>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
                Looking for jobs? Browse our latest job openings to view
              </p>

              {/* Mobile verification banner + illustration */}
              {!verificationDismissed && (
                <div className="mt-0 flex items-end justify-between gap-2 sm:hidden z-10">
                  <div
                    id="verification-banner"
                    className="w-[248px] shrink-0. rounded-[6px] border border-[#ff8d28]/30 bg-[#fff4ea] py-2.5 px-1.5"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <FiAlertCircle className="h-3 w-3 shrink-0 translate-y-[0.5px] text-orange-500" />
                        <p className="text-[7.14px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#59310e]">
                          Verification Required
                        </p>
                      </div>
                    </div>

                    <div className="mt-0 ml-1.5 flex items-center justify-between gap-1.5">
                      <p className="flex-1 min-w-0 ml-[12px] self-center text-[5.5px] leading-[1.1] tracking-[-0.01em] text-[#ff8d28]">
                        Complete your verification to apply for jobs and receive
                        payments securely.
                      </p>

                      <button
                        id="complete-verification-btn"
                        className="inline-flex -translate-y-1 h-[15px] min-w-[64px] shrink-0 items-center justify-center rounded-full bg-orange-500 px-1 text-[4.71px] font-bold leading-none text-white transition-all duration-200 hover:bg-orange-600"
                      >
                        Complete Verification
                      </button>
                    </div>
                  </div>

                  <div
                    className="w-[43%] z-0"
                    style={{ mixBlendMode: "multiply" }}
                  >
                    <img
                      src="/tools_bucket_illustration.png"
                      alt="Construction Tools"
                      className="w-full object-contain translate-y-[8px] translate-x-[25px]"
                    />
                  </div>
                </div>
              )}

              {/* Desktop verification banner */}
              {!verificationDismissed && (
                <div className="hidden sm:block">
                  <div
                    id="verification-banner"
                    className="mt-6 flex max-w-md items-center gap-3 rounded-xl border border-[#ff8d28]/30 bg-[#fff4ea] p-3 px-5 py-4"
                  >
                    <FiAlertCircle className="h-5 w-5 shrink-0 text-orange-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#59310e]">
                        Verification Required
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#ff8d28]">
                        Complete your verification to apply for jobs and receive
                        payments securely.
                      </p>
                    </div>
                    <button
                      id="complete-verification-btn"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-orange-500 px-3.5 py-2 text-[10px] font-bold text-white transition-all duration-200 hover:bg-orange-600"
                    >
                      Complete Verification
                    </button>
                    <button
                      id="dismiss-verification-btn"
                      onClick={handleDismissVerification}
                      className="rounded-full p-1 text-gray-400 transition-colors hover:text-gray-700"
                      aria-label="Dismiss verification banner"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Tools bucket illustration (desktop only) */}
            <div
              className="hidden sm:flex sm:shrink-0 sm:w-64 sm:max-w-xs sm:items-end sm:justify-center"
              style={{ mixBlendMode: "multiply" }}
            >
              <img
                src="/tools_bucket_illustration.png"
                alt="Construction Tools"
                className="w-full object-contain sm:translate-y-[100px] lg:w-72"
              />
            </div>
          </div>
        </div>

        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#016EA6]/20 to-transparent" />
      </section>

      {/* ── Search & Filter Bar ─────────────────────────────────── */}
      <section
        id="job-search-filter-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        <JobSearchBar onApply={handleApplyFilters} />
      </section>

      {/* ── Job Results Grid ─────────────────────────────────────── */}
      <section
        id="jobs-results-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8">
          {/* Section header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Related to{" "}
              <span className="text-gray-700">&ldquo;Carpentry&rdquo;</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {filteredJobs.length} jobs available
            </p>
          </div>

          {/* 3-column job grid */}
          <div
            id="jobs-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
                  onApply={() => navigate("/professional/jobs/apply")}
                  onSave={(val) =>
                    console.log(`Saved job ${job.title}: ${val}`)
                  }
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm text-gray-500">
                  No jobs match your current filters. Try expanding your search
                  or adjusting the filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <ProfessionalPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      {/* ── Mobile Bottom Navigation ─────────────────────────────── */}
      <ProfessionalBottomNav activeTab="browse-jobs" />
    </div>
  );
};

export default DefaultProfessionalScreen;
