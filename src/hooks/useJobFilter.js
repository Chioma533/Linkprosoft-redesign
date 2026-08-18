import { useMemo, useState } from "react";

export const useJobFilter = (jobs = [], initialSearch = "") => {
  const [search, setSearch] = useState(initialSearch);
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = (search || "").toLowerCase().trim();
      const matchesSearch = !q
        ? true
        : (job.title || "").toLowerCase().includes(q) ||
          (job.description || "").toLowerCase().includes(q) ||
          (job.client || "").toLowerCase().includes(q) ||
          (job.category || "").toLowerCase().includes(q) ||
          (job.orderId || "").toLowerCase().includes(q);

      const matchesCategory = categoryFilter
        ? (job.category || "").toLowerCase().includes(categoryFilter.toLowerCase())
        : true;

      const matchesLocation = locationFilter
        ? (job.location || "").toLowerCase().includes(locationFilter.toLowerCase())
        : true;

      const matchesStatus = statusFilter
        ? (job.status || "").toLowerCase().includes(statusFilter.toLowerCase())
        : true;

      const matchesRating = (() => {
        if (!ratingFilter) return true;

        const rating = Number(job.rating ?? 0);
        if (ratingFilter === "5 Stars") return rating >= 5;
        if (ratingFilter === "4+ Stars") return rating >= 4;
        if (ratingFilter === "3+ Stars") return rating >= 3;
        return true;
      })();

      const matchesBudget = (() => {
        if (!budgetFilter) return true;

        if (budgetFilter.endsWith("+")) {
          const min = Number(budgetFilter.replace("+", ""));
          return Number(job.budget) >= min;
        }

        const [min, max] = budgetFilter.split("-").map(Number);

        return Number(job.budget) >= min && Number(job.budget) <= max;
      })();

      // We'll add the date filter later
      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesBudget &&
        matchesStatus &&
        matchesRating
      );
    });
  }, [jobs, search, locationFilter, budgetFilter, ratingFilter, categoryFilter, dateFilter, statusFilter]);

  return {
    search,
    setSearch,

    dateFilter,
    setDateFilter,

    locationFilter,
    setLocationFilter,

    budgetFilter,
    setBudgetFilter,

    ratingFilter,
    setRatingFilter,

    categoryFilter,
    setCategoryFilter,

    statusFilter,
    setStatusFilter,

    filteredJobs,
  };
};