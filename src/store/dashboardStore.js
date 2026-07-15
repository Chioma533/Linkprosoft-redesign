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
  isLoading: false,
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [jobs, myJobs, applications, messages, notifications, metrics, schedules] = await Promise.all([
        projectService.getJobs(),
        projectService.getMyJobs(),
        projectService.getApplications(),
        notificationService.getMessages(),
        notificationService.getNotifications(),
        notificationService.getPerformanceMetrics(),
        notificationService.getSchedules()
      ]);

      set({
        jobs,
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

  fetchJobs: async () => {
    try {
      const jobs = await projectService.getJobs();
      set({ jobs });
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  },

  fetchMyJobs: async () => {
    try {
      const myJobs = await projectService.getMyJobs();
      set({ myJobs });
    } catch (err) {
      console.error("Failed to fetch my jobs", err);
    }
  },

  fetchApplications: async () => {
    try {
      const applications = await projectService.getApplications();
      set({ applications });
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  },

  applyForJob: async (jobId, bidAmount, coverLetter) => {
    set({ isLoading: true });
    try {
      const response = await projectService.applyForJob(jobId, bidAmount, coverLetter);
      if (response.success && response.application) {
        // Add new application to state
        const updatedApplications = [response.application, ...get().applications];
        set({
          applications: updatedApplications,
          isLoading: false
        });
        return response;
      }
      throw new Error(response.message || "Failed to apply");
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  }
}));
