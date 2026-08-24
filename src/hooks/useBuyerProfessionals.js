import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { searchService } from "../api/services/searchService";

const ITEMS_PER_PAGE = 9;

const getProfessionalName = (pro) =>
  pro.name || `${pro.user?.firstName || ""} ${pro.user?.lastName || ""}`.trim();

const getProfessionalLocation = (pro) =>
  pro.location || pro.user?.location || "";

const getProfessionalRating = (pro) => pro.rating ?? pro.avgRating ?? 0;

const getProfessionalPrice = (pro) => pro.pricePerDay ?? pro.hourlyRate ?? 0;

const getProfessionalRole = (pro) =>
  pro.profession ||
  pro.role ||
  (pro.skills && pro.skills.length > 0
    ? typeof pro.skills[0] === "string"
      ? pro.skills[0]
      : pro.skills[0].name || ""
    : "") ||
  "Professional";

const matchesBudget = (price, budget) => {
  const normalizedBudget = budget?.replace(/–/g, "-") || "";

  if (!normalizedBudget || normalizedBudget === "Any Budget") {
    return true;
  }

  if (normalizedBudget === "Under ₦5,000") {
    return price < 5000;
  }

  if (normalizedBudget === "₦5,000 - ₦20,000") {
    return price >= 5000 && price <= 20000;
  }

  if (normalizedBudget === "₦20,000 - ₦50,000") {
    return price >= 20000 && price <= 50000;
  }

  if (normalizedBudget === "₦50,000+") {
    return price > 50000;
  }

  return true;
};

const matchesRating = (rating, selectedRating) => {
  if (!selectedRating || selectedRating === "Any Rating") {
    return true;
  }

  const minStars = Number(selectedRating.match(/\d+/)?.[0] || 0);

  return rating >= minStars;
};

const useBuyerProfessionals = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [apiProfessionals, setApiProfessionals] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [error, setError] = useState(null);

  const isFirstMount = useRef(true);

  const filteredProfessionals = useMemo(() => {
    const { searchQuery, location, rating, budget } = filters;

    const list = Array.isArray(apiProfessionals) ? apiProfessionals : [];

    return list.filter((pro) => {
      if (!pro) return false;

      const search = searchQuery?.toLowerCase() || "";
      const name = getProfessionalName(pro);
      const proLocation = getProfessionalLocation(pro);
      const proRating = getProfessionalRating(pro);
      const proPrice = getProfessionalPrice(pro);
      const proRole = getProfessionalRole(pro);

      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search) ||
        proRole.toLowerCase().includes(search) ||
        (pro.bio || "").toLowerCase().includes(search);

      const matchesLocation =
        !location || proLocation.toLowerCase().includes(location.toLowerCase());

      return (
        matchesSearch &&
        matchesLocation &&
        matchesRating(proRating, rating) &&
        matchesBudget(proPrice, budget)
      );
    });
  }, [apiProfessionals, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProfessionals.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProfessionals = filteredProfessionals.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const fetchProfessionals = async (
    activeFilters = filters,
    isInitial = false,
  ) => {
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsSearching(true);
    }

    setError(null);

    let minRating;

    if (activeFilters.rating && activeFilters.rating !== "Any Rating") {
      const starsMatch = activeFilters.rating.match(/\d+/);

      if (starsMatch) {
        minRating = Number(starsMatch[0]);
      }
    }

    let minRate;
    let maxRate;

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
      const response =
        await searchService.smartSearchProfessionals(searchParams);

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

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimePassed(true), 2500);

    fetchProfessionals(filters, true);

    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    fetchProfessionals(filters, false);
  }, [filters]);

  return {
    filters,
    filteredProfessionals,
    paginatedProfessionals,
    currentPage,
    safeCurrentPage,
    totalPages,
    isInitialLoading,
    isSearching,
    minTimePassed,
    error,
    handleApplyFilters,
    handlePageChange,
    fetchProfessionals,
  };
};

export default useBuyerProfessionals;
