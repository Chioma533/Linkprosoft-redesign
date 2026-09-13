import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 9;

const useProfessionalJobFilter = (jobs = []) => {
  const [filters, setFilters] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const search = filters.searchQuery?.toLowerCase().trim() || "";

      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(search) ||
        job.description?.toLowerCase().includes(search) ||
        job.category?.toLowerCase().includes(search) ||
        job.employerName?.toLowerCase().includes(search);

      const matchesLocation =
        !filters.location ||
        filters.location === "All Locations" ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase());

      const normalizedBudget = filters.budget?.replace(/–/g, "-") || "";

      const matchesBudget =
        !normalizedBudget ||
        normalizedBudget === "Any Budget" ||
        (() => {
          if (normalizedBudget === "Under ₦5,000") {
            return job.budget < 5000;
          }

          if (normalizedBudget === "₦5,000 - ₦20,000") {
            return job.budget >= 5000 && job.budget <= 20000;
          }

          if (normalizedBudget === "₦20,000 - ₦50,000") {
            return job.budget >= 20000 && job.budget <= 50000;
          }

          if (normalizedBudget === "₦50,000+") {
            return job.budget > 50000;
          }

          return true;
        })();

      const matchesDate =
        !filters.datePosted ||
        filters.datePosted === "Any time" ||
        (() => {
          if (filters.datePosted === "Today") {
            return job.datePostedDays === 0;
          }

          if (filters.datePosted === "This week") {
            return job.datePostedDays <= 7;
          }

          if (filters.datePosted === "This month") {
            return job.datePostedDays <= 30;
          }

          if (filters.datePosted === "Last 3 months") {
            return job.datePostedDays <= 90;
          }

          return true;
        })();

      return matchesSearch && matchesLocation && matchesBudget && matchesDate;
    });
  }, [jobs, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedJobs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, safeCurrentPage]);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    filters,
    filteredJobs,
    paginatedJobs,
    currentPage: safeCurrentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,

    applyFilters,
    resetFilters,
    changePage,
  };
};

export default useProfessionalJobFilter;
