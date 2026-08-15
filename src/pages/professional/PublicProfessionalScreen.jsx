import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiHome,
  FiSearch,
  FiBriefcase,
  FiFileText,
  FiCreditCard,
} from "react-icons/fi";
import JobSearchBar from "../../components/professional/JobSearchBar";
import JobCard from "../../components/professional/JobCard";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";
import Logo from "/temp_figma_mockups/linkprosoft-logo.png";

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
   Pagination sub-component
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
          id="public-job-pagination-prev-btn"
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
              id={`public-job-pagination-page-${page}-btn`}
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
          id="public-job-pagination-next-btn"
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
   Public Navbar (no auth dependency — shows Sign In / Sign Up)
   ───────────────────────────────────────────────────────────── */
const PublicProfessionalNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "browse-jobs", label: "Browse Jobs", path: "/professionals" },
    { id: "community", label: "Community", path: "/community" },
  ];

  return (
    <nav className="relative w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Desktop Logo */}
          <Link
            to="/professionals"
            className="hidden md:flex items-center shrink-0 hover:opacity-90 transition-opacity"
          >
            <img
              src={Logo}
              alt="Linkprosoft"
              className="w-9 h-9 rounded-lg object-cover"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                id={`public-nav-${link.id}`}
                className={`text-sm font-semibold tracking-wide transition-colors whitespace-nowrap pb-1 ${
                  link.id === "browse-jobs"
                    ? "text-[#016EA6] border-b-2 border-[#016EA6]"
                    : "text-gray-600 hover:text-[#016EA6]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right: Sign In / Sign Up */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              id="public-nav-login-btn"
              className="text-sm font-semibold text-gray-700 hover:text-[#016EA6] transition-colors px-4 py-2 rounded-full hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              id="public-nav-signup-btn"
              className="text-sm font-bold text-white bg-[#016EA6] hover:bg-[#015a8c] transition-colors px-5 py-2 rounded-full shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Navigation Header */}
          <div className="flex md:hidden items-center justify-between w-full h-full">
            <div className="flex items-center gap-3">
              <button
                id="public-mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6 text-gray-700" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                Browse Jobs
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                id="public-mobile-login-btn"
                className="text-xs font-semibold text-gray-700 hover:text-[#016EA6] transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#016EA6]/40"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                id="public-mobile-signup-btn"
                className="text-xs font-bold text-white bg-[#016EA6] hover:bg-[#015a8c] transition-colors px-3 py-1.5 rounded-full"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 bg-white border-t border-gray-100 shadow-lg flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium hover:text-[#016EA6] transition-colors ${
                link.id === "browse-jobs" ? "text-[#016EA6]" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-gray-100 my-1" />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-center text-gray-700 border border-gray-200 rounded-full py-2.5 hover:text-[#016EA6] hover:border-[#016EA6]/40 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-center text-white bg-[#016EA6] hover:bg-[#015a8c] rounded-full py-2.5 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ─────────────────────────────────────────────────────────────
   Public Bottom Nav (links to /login for auth-protected items)
   ───────────────────────────────────────────────────────────── */
const PublicBottomNav = () => {
  const navItems = [
    { id: "overview", label: "Overview", icon: FiHome, path: "/login" },
    { id: "browse-jobs", label: "Browse jobs", icon: FiSearch, path: "/professionals" },
    { id: "my-jobs", label: "My Jobs", icon: FiBriefcase, path: "/login" },
    { id: "applications", label: "Applications", icon: FiFileText, path: "/login" },
    { id: "wallet", label: "Wallet", icon: FiCreditCard, path: "/login" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg md:hidden">
      <nav className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "browse-jobs";

          return (
            <Link
              key={item.id}
              to={item.path}
              id={`public-mobile-bottom-nav-${item.id}`}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-150 cursor-pointer ${
                isActive
                  ? "text-[#016EA6] font-semibold"
                  : "text-gray-400 hover:text-gray-600 font-normal"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  isActive ? "scale-110 text-[#016EA6]" : "text-gray-400"
                }`}
              />
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* iOS Home Indicator Bar */}
      <div className="pb-1 pt-0.5 flex justify-center">
        <div className="w-32 h-1 bg-gray-900/80 rounded-full" />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Public Page
   ───────────────────────────────────────────────────────────── */
const PublicProfessionalScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  if (isInitialLoading || !minTimePassed) {
    return <LoadingScreen variant="professional" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-12">
      {/* ── Public Navbar ──────────────────────────────────────── */}
      <PublicProfessionalNavbar />

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section id="public-professional-hero-section" className="bg-[#EEF5F9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            {/* Left: headline */}
            <div className="flex-1 max-w-full sm:max-w-xl">
              <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
                Find Your Next Opportunity
              </h1>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
                Looking for jobs? Browse our latest job openings to view
              </p>

              {/* Mobile illustration (no verification banner in public view) */}
              <div className="mt-0 flex items-end justify-end gap-2 sm:hidden z-10">
                <div className="w-[43%] z-0" style={{ mixBlendMode: "multiply" }}>
                  <img
                    src="/tools_bucket_illustration.png"
                    alt="Construction Tools"
                    className="w-full object-contain translate-y-[8px] translate-x-[25px]"
                  />
                </div>
              </div>
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
        id="public-job-search-filter-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        <JobSearchBar onApply={handleApplyFilters} />
      </section>

      {/* ── Job Results Grid ─────────────────────────────────────── */}
      <section
        id="public-jobs-results-section"
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
            id="public-jobs-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
                  onApply={() => console.log(`Applying to job: ${job.title}`)}
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
      <PublicBottomNav />
    </div>
  );
};

export default PublicProfessionalScreen;
