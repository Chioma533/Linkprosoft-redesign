import React, { useMemo, useState } from "react";
import { FiAlertCircle, FiChevronRight, FiChevronLeft, FiX } from "react-icons/fi";
import BuyerNavbar from "../../layouts/buyer/BuyerNavbar";
import ProfessionalSearchBar from "../../components/buyer/ProfessionalSearchBar";
import ProfessionalCard from "../../components/buyer/ProfessionalCard";

/* ─────────────────────────────────────────────────────────────
   Mock data — 9 professionals per page to match the Figma 3x3 grid
   ───────────────────────────────────────────────────────────── */
const ALL_PROFESSIONALS = Array.from({ length: 108 }, (_, i) => ({
  id: i + 1,
  name: "Jonathan David",
  role: "Carpenter",
  avatarUrl: "/professional_avatar.png",
  rating: 2.5,
  reviewCount: 32,
  bio: "Skilled carpenter specializing in custom wardrobes, sliding doors, and bespoke storage solutions. Available for on-site consultation this week.",
  pricePerDay: 10000,
}));

const ITEMS_PER_PAGE = 9;

/* ─────────────────────────────────────────────────────────────
   Pagination sub-component
   ───────────────────────────────────────────────────────────── */
const BuyerPagination = ({ currentPage, totalPages, onPageChange }) => {
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
        Showing page {currentPage} of {totalPages} pages
      </span>

      <div className="flex items-center gap-1.5">
        <button
          id="pagination-prev-btn"
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
              id={`pagination-page-${page}-btn`}
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
          id="pagination-next-btn"
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
const DefaultBuyerScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [verificationDismissed, setVerificationDismissed] = useState(false);
  const [filters, setFilters] = useState({});

  const filteredProfessionals = useMemo(() => {
    return ALL_PROFESSIONALS.filter((pro) => {
      const search = filters.searchQuery?.toLowerCase() || "";
      const matchesSearch =
        !search ||
        pro.name.toLowerCase().includes(search) ||
        pro.role.toLowerCase().includes(search) ||
        pro.bio.toLowerCase().includes(search);

      const matchesRating = !filters.rating || filters.rating === "Any Rating" || (() => {
        const minStars = Number(filters.rating?.match(/\d+/)?.[0] || 0);
        return pro.rating >= minStars;
      })();

      const normalizedBudget = filters.budget?.replace(/–/g, "-") || "";
      const matchesBudget = !normalizedBudget || normalizedBudget === "Any Budget" || (() => {
        if (normalizedBudget === "Under ₦5,000") return pro.pricePerDay < 5000;
        if (normalizedBudget === "₦5,000 - ₦20,000") return pro.pricePerDay >= 5000 && pro.pricePerDay <= 20000;
        if (normalizedBudget === "₦20,000 - ₦50,000") return pro.pricePerDay >= 20000 && pro.pricePerDay <= 50000;
        if (normalizedBudget === "₦50,000+") return pro.pricePerDay > 50000;
        return true;
      })();

      return matchesSearch && matchesRating && matchesBudget;
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProfessionals.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProfessionals = filteredProfessionals.slice(
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
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <BuyerNavbar activePage="browse" />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section
        id="hero-section"
        className="bg-[#EEF5F9] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center justify-between gap-8">
            {/* Left: Text + Verification banner */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                Find The Right Professional
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-3 font-normal">
                Need help with a project? Browse verified professionals.
              </p>

              {/* Verification Required Banner */}
              {!verificationDismissed && (
                <div
                  id="verification-banner"
                  className="mt-6 flex items-center gap-3 bg-[#fff4ea] border border-[#ff8d28]/30 rounded-xl px-5 py-4 max-w-md"
                >
                  <FiAlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#59310e]">
                      Verification Required
                    </p>
                    <p className="text-[11px] text-[#ff8d28] mt-0.5 leading-relaxed max-w-[26rem]">
                      Complete your verification to apply for jobs and receive payments securely.
                    </p>
                  </div>
                  <button
                    id="complete-verification-btn"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
                  >
                    Complete Verification
                  </button>
                  <button
                    id="dismiss-verification-btn"
                    onClick={handleDismissVerification}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Dismiss verification banner"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Tools illustration */}
            <div
              className="hidden sm:flex items-center justify-center flex-1 max-w-xs"
              style={{ mixBlendMode: "multiply" }}
            >
              <img
                src="/tools_illustration.png"
                alt="Professional Tools"
                className="w-56 sm:w-64 lg:w-72 object-contain"
                style={{ transform: "rotate(-10deg) translateY(8px)" }}
              />
            </div>
          </div>
        </div>

        {/* subtle bottom wave / gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#016EA6]/20 to-transparent" />
      </section>

      {/* ── Search & Filter Bar ───────────────────────────────── */}
      <section id="search-filter-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfessionalSearchBar onApply={handleApplyFilters} />
      </section>

      {/* ── Results Grid ─────────────────────────────────────── */}
      <section
        id="professionals-results-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            {/* Section header */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Related to{" "}
                <span className="text-gray-700">&ldquo;Carpentry&rdquo;</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProfessionals.length} professionals available
              </p>
            </div>

          {/* 3-column professional grid */}
          <div
            id="professionals-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {paginatedProfessionals.length > 0 ? (
              paginatedProfessionals.map((pro, idx) => (
                <ProfessionalCard
                  key={pro.id}
                  {...pro}
                  isSelected={idx === 0 && safeCurrentPage === 1}
                  onContact={() => console.log(`Contacting ${pro.name}`)}
                  onBookmark={(val) => console.log(`Bookmarked ${pro.name}: ${val}`)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm text-gray-500">No professionals match your current filters. Try expanding your search or adjusting the filters.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <BuyerPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DefaultBuyerScreen;
