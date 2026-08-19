import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FiAlertCircle, FiChevronRight, FiChevronLeft, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import BuyerNavbar from "../../layouts/buyer/BuyerNavbar";
import ProfessionalSearchBar from "../../components/buyer/ProfessionalSearchBar";
import ProfessionalCard from "../../components/buyer/ProfessionalCard";
import BuyerBottomNav from "../../components/buyer/BuyerBottomNav";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";
import { searchService } from "../../api/services/searchService";
import ProfessionalIllustration from "../../assets/images/professional_illustration.png"

/* ─────────────────────────────────────────────────────────────
   Pagination sub-component (responsive format)
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
        <span className="sm:hidden text-gray-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <span className="hidden sm:inline">
          Showing page {currentPage} of {totalPages} pages
        </span>
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
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${currentPage === page
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
  const location = useLocation();
  const [filters, setFilters] = useState(() => {
    const q = new URLSearchParams(location.search).get('q') || "";
    return {
      searchQuery: q,
      location: "",
      rating: "",
      budget: "",
    };
  });

  // Data from API
  const [apiProfessionals, setApiProfessionals] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPagesAPI, setTotalPagesAPI] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [error, setError] = useState(null);
  const isFirstMount = useRef(true);

  // Apply filters client-side on the fetched data
  const filteredProfessionals = useMemo(() => {
    const { searchQuery, location, rating, budget } = filters;
    const list = Array.isArray(apiProfessionals) ? apiProfessionals : [];
    return list.filter((pro) => {
      if (!pro) return false;
      const search = searchQuery?.toLowerCase() || "";
      const name = pro.name || `${pro.user?.firstName || ''} ${pro.user?.lastName || ''}`.trim();
      const proLocation = pro.location || pro.user?.location || "";
      const proRating = pro.rating ?? pro.avgRating ?? 0;
      const proPrice = pro.pricePerDay ?? pro.hourlyRate ?? 0;
      const proRole = pro.profession || pro.role || (pro.skills && pro.skills.length > 0 ? (typeof pro.skills[0] === 'string' ? pro.skills[0] : pro.skills[0].name || "") : "") || "Professional";

      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search) ||
        proRole.toLowerCase().includes(search) ||
        (pro.bio || "").toLowerCase().includes(search);

      const matchesLocation =
        !location ||
        proLocation.toLowerCase().includes(location.toLowerCase());

      const matchesRating = !rating || rating === "Any Rating" || (() => {
        const minStars = Number(rating?.match(/\d+/)?.[0] || 0);
        return proRating >= minStars;
      })();

      const normalizedBudget = budget?.replace(/–/g, "-") || "";
      const matchesBudget = !normalizedBudget || normalizedBudget === "Any Budget" || (() => {
        if (normalizedBudget === "Under ₦5,000") return proPrice < 5000;
        if (normalizedBudget === "₦5,000 - ₦20,000")
          return proPrice >= 5000 && proPrice <= 20000;
        if (normalizedBudget === "₦20,000 - ₦50,000")
          return proPrice >= 20000 && proPrice <= 50000;
        if (normalizedBudget === "₦50,000+") return proPrice > 50000;
        return true;
      })();

      return matchesSearch && matchesLocation && matchesRating && matchesBudget;
    });
  }, [apiProfessionals, filters]);

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil((filteredProfessionals?.length || 0) / ITEMS_PER_PAGE));

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProfessionals = (filteredProfessionals || []).slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const fetchProfessionals = async (activeFilters = filters, isInitial = false) => {
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsSearching(true);
    }
    setError(null);

    // Parse filters into query params
    let minRating;
    if (activeFilters.rating && activeFilters.rating !== "Any Rating") {
      const starsMatch = activeFilters.rating.match(/\d+/);
      if (starsMatch) minRating = Number(starsMatch[0]);
    }

    let minRate, maxRate;
    const normBudget = activeFilters.budget?.replace(/–/g, "-") || "";
    if (normBudget === "Under ₦5,000") {
      maxRate = 5000;
    } else if (normBudget === "₦5,000 - ₦20,000") {
      minRate = 5000;
      maxRate = 20000;
    } else if (normBudget === "₦20,000 - ₦50,000") {
      minRate = 20000;
      maxRate = 50000;
    } else if (normBudget === "₦5,000+" || normBudget === "₦50,000+") {
      minRate = 50000;
    }

    const searchParams = {
      query: activeFilters.searchQuery?.trim() || undefined,
      profession: activeFilters.searchQuery?.trim() || undefined,
      location: activeFilters.location || undefined,
      rating: activeFilters.rating || undefined,
      budget: activeFilters.budget || undefined,
      minRating,
      minRate,
      maxRate,
      page: 1,
      limit: 100,
    };
    try {
      const response = await searchService.smartSearchProfessionals(searchParams);

      const isSuccess = response?.status === "success" || response?.success === true || Boolean(response?.data);
      const dataObj = response?.data || response;

      if (isSuccess && dataObj) {
        const items = Array.isArray(dataObj.professionals)
          ? dataObj.professionals
          : Array.isArray(dataObj.items)
            ? dataObj.items
            : Array.isArray(dataObj)
              ? dataObj
              : [];
        setApiProfessionals(items);
        setTotal(dataObj.meta?.total || dataObj.total || items.length);
        setTotalPagesAPI(dataObj.meta?.pages || dataObj.totalPages || 1);
      } else {
        throw new Error(response?.message || "Failed to fetch professionals");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load professionals");
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      } else {
        setIsSearching(false);
      }
    }
  };

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

  // Initial page mount
  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimePassed(true), 2500);
    fetchProfessionals(filters, true);
    return () => clearTimeout(minTimer);
  }, []);

  // Subsequent filter updates
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    fetchProfessionals(filters, false);
  }, [filters]);

  if (isInitialLoading || !minTimePassed) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading professionals</h2>
        <p className="text-gray-500 text-center">{error}</p>
        <button
          onClick={() => fetchProfessionals()}
          className="mt-6 bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-3 rounded-full text-font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-12">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <BuyerNavbar activePage="browse" />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section
        id="hero-section"
        className="bg-linear-to-r from-[#ddf5fd] via-[#eef7fa] to-[#B9DCE8] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            {/* Left: Text + Verification banner */}
            <div className="flex-1 max-w-full sm:max-w-xl">
              <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
                Find The Right Professional
              </h1>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
                Need help with a project? Browse verified professionals.
              </p>

              {/* Mobile verification banner + illustration */}
              {!verificationDismissed && (
                <div className="-mt-6 flex items-end justify-between gap-2 sm:hidden z-10">
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
                      src={ProfessionalIllustration}
                      alt="Construction Tools"
                      className="w-full object-contain translate-y-[38px] translate-x-[25px]"
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

            {/* Right: Desktop Tools illustration */}

            <img
              src={ProfessionalIllustration}
              alt="Professional Tools"
              className="hidden sm:flex items-center justify-center"
            />
          </div>
        </div>

        {/* subtle bottom wave / gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#016EA6]/20 to-transparent" />
      </section>

      {/* ── Search & Filter Bar ───────────────────────────────── */}
      <section
        id="search-filter-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        <ProfessionalSearchBar
          onApply={handleApplyFilters}
          initialQuery={filters.searchQuery}
        />
      </section>

      {/* ── Results Grid ─────────────────────────────────────── */}
      <section
        id="professionals-results-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8">
          {/* Section header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {filters.searchQuery ? (
                <>
                  Related to{" "}
                  <span className="text-gray-700">
                    &ldquo;{filters.searchQuery}&rdquo;
                  </span>
                </>
              ) : filters.location || filters.rating || filters.budget ? (
                "Filtered Professionals"
              ) : (
                "All Professionals"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {filteredProfessionals.length} professionals available
            </p>
          </div>

          {/* 3-column professional grid */}
          <div
            id="professionals-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-h-[240px]"
          >
            {isSearching ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-9 h-9 border-3 border-[#016EA6]/20 border-t-[#016EA6] rounded-full animate-spin" />
                <p className="text-xs font-semibold text-gray-500 animate-pulse">
                  Searching professionals...
                </p>
              </div>
            ) : paginatedProfessionals.length > 0 ? (
              paginatedProfessionals.map((pro, idx) => {
                const fullName =
                  pro.name ||
                  `${pro.user?.firstName || ""} ${pro.user?.lastName || ""}`.trim() ||
                  "Unknown";
                const roleName =
                  pro.profession ||
                  pro.role ||
                  (pro.skills && pro.skills.length > 0
                    ? typeof pro.skills[0] === "string"
                      ? pro.skills[0]
                      : pro.skills[0].name || "Professional"
                    : "Professional");
                const locationName = pro.location || pro.user?.location || "";
                return (
                  <ProfessionalCard
                    key={pro.id}
                    id={pro.id}
                    name={fullName}
                    role={roleName}
                    location={locationName}
                    avatarUrl={
                      pro.avatarUrl ||
                      pro.user?.avatar ||
                      "/professional_avatar.png"
                    }
                    rating={pro.rating ?? pro.avgRating ?? 0}
                    reviewCount={pro.reviewCount ?? pro.totalReviews ?? 0}
                    bio={pro.bio || "No bio available"}
                    pricePerDay={pro.pricePerDay ?? pro.hourlyRate ?? 0}
                    isBookmarked={false}
                    isSelected={idx === 0 && safeCurrentPage === 1}
                    onContact={() => console.log(`Contacting ${fullName}`)}
                    onBookmark={(val) =>
                      console.log(`Bookmarked ${fullName}: ${val}`)
                    }
                  />
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm text-gray-500">
                  No professionals match your current filters. Try expanding
                  your search or adjusting the filters.
                </p>
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

      {/* ── Mobile Bottom Navigation ─────────────────────────────── */}
      <BuyerBottomNav activeTab="browse" />
    </div>
  );
};

export default DefaultBuyerScreen;