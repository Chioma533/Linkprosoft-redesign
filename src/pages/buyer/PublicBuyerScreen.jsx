import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiChevronRight,
  FiChevronLeft,
  FiMenu,
  FiX,
  FiHome,
  FiSearch,
  FiBriefcase,
  FiMessageSquare,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import ProfessionalSearchBar from "../../components/buyer/ProfessionalSearchBar";
import ProfessionalCard from "../../components/buyer/ProfessionalCard";
import LoadingScreen from "../../components/common/preloader/LoadingScreen";
import { searchService } from "../../api/services/searchService";
import Logo from "/temp_figma_mockups/linkprosoft-logo.png";

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
          id="public-pagination-prev-btn"
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
              id={`public-pagination-page-${page}-btn`}
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
          id="public-pagination-next-btn"
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
   Public Buyer Navbar (no auth dependency — Sign In / Get Started)
   ───────────────────────────────────────────────────────────── */
const PublicBuyerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "browse", label: "Browse Professionals", path: "/browse-professionals" },
    { id: "community", label: "Community", path: "/community" },
    { id: "trending", label: "Trending Professionals", path: "/trending" },
  ];

  return (
    <nav className="relative w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Desktop Logo */}
          <Link
            to="/browse-professionals"
            className="hidden md:flex items-center shrink-0 hover:opacity-90 transition-opacity gap-2"
          >
            <img src={Logo} alt="Linkprosoft" className="w-9 h-9 rounded-lg object-cover" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                id={`public-nav-${link.id}`}
                className={`text-sm font-semibold tracking-wide transition-colors whitespace-nowrap pb-1 ${
                  link.id === "browse"
                    ? "text-[#016EA6] border-b-2 border-[#016EA6]"
                    : "text-gray-600 hover:text-[#016EA6]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right: Sign In / Get Started */}
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
                Browse Professionals
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
                link.id === "browse" ? "text-[#016EA6]" : "text-gray-700"
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
   Public Bottom Nav (auth-gated links redirect to /login)
   ───────────────────────────────────────────────────────────── */
const PublicBuyerBottomNav = () => {
  const navItems = [
    { id: "overview", label: "Overview", icon: FiHome, path: "/login" },
    { id: "browse", label: "Browse", icon: FiSearch, path: "/browse-professionals" },
    { id: "my-jobs", label: "My Jobs", icon: FiBriefcase, path: "/login" },
    { id: "community", label: "Community", icon: FiMessageSquare, path: "/community" },
    { id: "profile", label: "Profile", icon: FiUser, path: "/login" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg md:hidden">
      <nav className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "browse";

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
const PublicBuyerScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
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
      const proRole =
        pro.profession ||
        pro.role ||
        (pro.skills && pro.skills.length > 0
          ? typeof pro.skills[0] === "string"
            ? pro.skills[0]
            : pro.skills[0].name || ""
          : "") ||
        "Professional";

      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search) ||
        proRole.toLowerCase().includes(search) ||
        (pro.bio || "").toLowerCase().includes(search);

      const matchesLocation =
        !location ||
        proLocation.toLowerCase().includes(location.toLowerCase());

      const matchesRating =
        !rating ||
        rating === "Any Rating" ||
        (() => {
          const minStars = Number(rating?.match(/\d+/)?.[0] || 0);
          return proRating >= minStars;
        })();

      const normalizedBudget = budget?.replace(/–/g, "-") || "";
      const matchesBudget =
        !normalizedBudget ||
        normalizedBudget === "Any Budget" ||
        (() => {
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

      const isSuccess =
        response?.status === "success" ||
        response?.success === true ||
        Boolean(response?.data);
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

  // Sync filters if URL search params change
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setFilters((prev) => {
      if (prev.searchQuery === q) return prev;
      return { ...prev, searchQuery: q };
    });
  }, [location.search]);

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
      {/* ── Public Navbar ──────────────────────────────────────── */}
      <PublicBuyerNavbar />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section
        id="public-hero-section"
        className="bg-[#EEF5F9] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            {/* Left: Text */}
            <div className="flex-1 max-w-full sm:max-w-xl">
              <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
                Find The Right Professional
              </h1>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
                Need help with a project? Browse verified professionals.
              </p>

              {/* Mobile illustration (no verification banner in public view) */}
              <div className="-mt-6 flex items-end justify-end gap-2 sm:hidden z-10">
                <div className="w-[43%] z-0" style={{ mixBlendMode: "multiply" }}>
                  <img
                    src="/tools_illustration.png"
                    alt="Construction Tools"
                    className="w-full object-contain translate-y-[38px] translate-x-[25px]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Desktop Tools illustration */}
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
      <section
        id="public-search-filter-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        <ProfessionalSearchBar
          onApply={handleApplyFilters}
          initialQuery={filters.searchQuery}
        />
      </section>

      {/* ── Results Grid ─────────────────────────────────────── */}
      <section
        id="public-professionals-results-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8">
          {/* Section header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {filters.searchQuery ? (
                <>
                  Related to <span className="text-gray-700">&ldquo;{filters.searchQuery}&rdquo;</span>
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
            id="public-professionals-grid"
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
                    avatarUrl={pro.avatarUrl || pro.user?.avatar || "/professional_avatar.png"}
                    rating={pro.rating ?? pro.avgRating ?? 0}
                    reviewCount={pro.reviewCount ?? pro.totalReviews ?? 0}
                    bio={pro.bio || "No bio available"}
                    pricePerDay={pro.pricePerDay ?? pro.hourlyRate ?? 0}
                    isBookmarked={false}
                    isSelected={idx === 0 && safeCurrentPage === 1}
                    onContact={() => navigate("/login")}
                    onBookmark={() => navigate("/login")}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm text-gray-500">
                  No professionals match your current filters. Try expanding your search or adjusting the filters.
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
      <PublicBuyerBottomNav />
    </div>
  );
};

export default PublicBuyerScreen;
