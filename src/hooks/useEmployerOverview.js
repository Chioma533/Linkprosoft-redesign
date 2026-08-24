import { useCallback, useEffect, useMemo, useState } from "react";
import { jobService } from "../api/services/jobService";

const formatJob = (item) => ({
  id: String(item.id || item._id || "ORD-000"),
  title: item.title || "Untitled Job",
  professional: item.professional || item.assignedProfessional?.name || "Direct Candidate",
  status: item.status || "Posted",
  actionText: item.status === "Completed" ? "Release Funds" : (item.status || "").toLowerCase().includes("escrow") ? "Fund Escrow" : "View Progress",
  category: item.category || item.skill?.name || "Services",
  budget: Number(item.budget || 0),
  scheduledTime: item.scheduledTime || item.scheduled_time || null,
});

export const useEmployerOverview = () => {
  const [employerJobs, setEmployerJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobSearch, setJobSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState("This week");

  const fetchLiveJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const response = await jobService.getMyEmployerJobs();
      const rawItems = Array.isArray(response?.data) ? response.data : response?.data?.items || response?.items || [];
      setEmployerJobs(rawItems.map(formatJob));
    } catch (err) {
      console.warn("Failed to load live employer jobs:", err.message);
      setEmployerJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  useEffect(() => { fetchLiveJobs(); }, [fetchLiveJobs]);

  const activeJobs = employerJobs.filter((job) => !["completed", "cancelled"].includes((job.status || "").toLowerCase()));
  const awaitingAction = employerJobs.filter((job) => (job.status || "").toLowerCase().includes("escrow"));
  const completedJobs = employerJobs.filter((job) => (job.status || "").toLowerCase() === "completed");
  const scheduleJobs = employerJobs.filter((job) => (job.status || "").toLowerCase().includes("progress"));
  const filteredActiveJobs = useMemo(() => {
    const search = jobSearch.toLowerCase();
    return employerJobs.filter((job) => {
      const matchesSearch = !jobSearch.trim() || [job.title, job.professional, job.id, job.category].some((value) => value?.toLowerCase().includes(search));
      const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [employerJobs, jobSearch, statusFilter]);
  const jobFormatter = (jobs) => jobs.map((job) => ({ "Order ID": job.id, "Job Title": job.title, Professional: job.professional, Status: job.status, Action: job.actionText || "View Details", Budget: job.budget ? `\u20a6${job.budget.toLocaleString()}` : "\u2014" }));

  return { employerJobs, isLoadingJobs, activeJobs, awaitingAction, completedJobs, scheduleJobs, escrowTotal: awaitingAction.reduce((total, job) => total + job.budget, 0), filteredActiveJobs, jobSearch, setJobSearch, statusFilter, setStatusFilter, showFilterMenu, setShowFilterMenu, scheduleFilter, setScheduleFilter, fetchLiveJobs, jobFormatter };
};