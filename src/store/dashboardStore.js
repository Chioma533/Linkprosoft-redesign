import { create } from "zustand";
import { projectService } from "../api/services/projectService";
import { notificationService } from "../api/services/notificationService";

export const useDashboardStore = create((set, get) => ({
  jobs: [],
  myJobs: [],
  applications: [],
  messages: [],
  notifications: [],
  metrics: null,
  schedules: [],
  activeTab: "overview", // overview, browse-jobs, my-jobs, applications, schedule, wallet
  selectedJob: null,
  previousTab: "overview",
  globalSearchQuery: "",
  highlightSection: null, // avatar, bio, skills, location, portfolio
  isLoading: true,
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setPreviousTab: (tab) => set({ previousTab: tab }),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
  setHighlightSection: (section) => set({ highlightSection: section }),
  reset: () => set({ jobs: [], myJobs: [], applications: [], messages: [], notifications: [], metrics: null, schedules: [], selectedJob: null, highlightSection: null, error: null, isLoading: false }),

  /**
   * Fetch all dashboard sidebar data EXCEPT browse-jobs.
   * Jobs for the professional feed are loaded separately by BrowseJobsSubpage
   * with the correct skillId filter to prevent showing unmatched jobs.
   */
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [myJobs, applications, messages, notifications, metrics, schedules] = await Promise.all([
        projectService.getMyJobs(),
        projectService.getApplications(),
        notificationService.getMessages(),
        notificationService.getNotifications(),
        notificationService.getPerformanceMetrics(),
        notificationService.getSchedules()
      ]);

      set({
        myJobs,
        applications,
        messages,
        notifications,
        metrics,
        schedules,
        isLoading: false
      });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch dashboard data",
        isLoading: false
      });
    }
  },

  fetchJobs: async (params = {}) => {
    try {
      const jobs = await projectService.getJobs(params);
      set({ jobs, error: null });
      return jobs;
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      set({ error: err?.response?.data?.message || err.message || "Failed to fetch jobs" });
      throw err;
    }
  },

  fetchMyJobs: async (params = {}) => {
    try {
      const myJobs = await projectService.getMyJobs(params);
      set({ myJobs, error: null });
      return myJobs;
    } catch (err) {
      console.error("Failed to fetch my jobs", err);
      set({ error: err?.response?.data?.message || err.message || "Failed to fetch my jobs" });
      throw err;
    }
  },

  fetchApplications: async (params = {}) => {
    try {
      const applications = await projectService.getApplications(params);
      set({ applications, error: null });
      return applications;
    } catch (err) {
      console.error("Failed to fetch applications", err);
      set({ error: err?.response?.data?.message || err.message || "Failed to fetch applications" });
      throw err;
    }
  },

  applyForJob: async (jobId, bidAmount, coverLetter, estimatedDeliveryDays = 7) => {
    set({ isLoading: true });
    try {
      const response = await projectService.applyForJob(jobId, bidAmount, coverLetter, estimatedDeliveryDays);
      if (response.success && response.application) {
        const updatedApplications = [response.application, ...get().applications];
        set({
          applications: updatedApplications,
          isLoading: false
        });
        return response;
      }
      return response;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  }
}));
