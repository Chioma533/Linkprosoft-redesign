import { useMemo, useState } from "react";

export const useJobFilter = (jobs = []) => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("")

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter
        ? job.category.toLowerCase().includes(categoryFilter.toLowerCase())
        : true;

      const matchesLocation = locationFilter
        ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
        : true;
      
        const matchesStatus = statusFilter
        ? job.status.toLowerCase().includes(statusFilter.toLowerCase())
        : true;

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
        matchesSearch && matchesCategory && matchesLocation && matchesBudget && matchesStatus
      );
    });
  }, [jobs, search, locationFilter, budgetFilter, categoryFilter, dateFilter]);

  return {
    search,
    setSearch,

    dateFilter,
    setDateFilter,

    locationFilter,
    setLocationFilter,

    budgetFilter,
    setBudgetFilter,

    categoryFilter,
    setCategoryFilter,

    statusFilter,
    setStatusFilter,

    filteredJobs,
  };
};