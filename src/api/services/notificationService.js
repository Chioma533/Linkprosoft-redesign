import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Mock data references preserved for testing / non-live development
export const mockMessages = [
  { id: "msg-1", sender: "Jhon Miguel", text: "Hello how are you doing? let me know when you are available.", time: "10:30 AM", unread: true },
  { id: "msg-2", sender: "Jhon Miguel", text: "Are we still on for the Wardrobe installation?", time: "Yesterday", unread: true },
  { id: "msg-3", sender: "Jhon Miguel", text: "Thanks for the quick response. I appreciate your work.", time: "Jul 12", unread: false },
  { id: "msg-4", sender: "Jhon Miguel", text: "Hello Samuel, can you send the invoice?", time: "Jul 10", unread: false }
];

export const mockNotifications = [
  { id: "not-1", title: "Account Verified", body: "Your linkprosoft account is live", time: "Just now", unread: true },
  { id: "not-2", title: "Job Offer Accepted", body: "John M accepted your bid on Wardrobe Installation", time: "2 hrs ago", unread: true },
  { id: "not-3", title: "Payment Received", body: "Successfully received #45,000 for Kitchen Plumbing", time: "Yesterday", unread: false },
  { id: "not-4", title: "New Job Match", body: "A new Wardrobe installation match was found in Lekki", time: "3 days ago", unread: false }
];

export const mockPerformance = {
  responseRate: 75,
  successRate: 75,
  reviews: 5.0,
  reviewsCount: 12,
  earningsTotal: 500000,
  completedJobsCount: 288,
  upcomingJobsCount: 172,
  performancePercentage: 80
};

export const mockSchedules = [
  { id: "sch-1", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 10 • 9:00 AM", date: "2026-07-02" },
  { id: "sch-2", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 12 • 10:00 AM", date: "2026-07-09" },
  { id: "sch-3", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 15 • 11:30 AM", date: "2026-07-15" },
  { id: "sch-4", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 18 • 1:00 PM", date: "2026-07-18" }
];

export const notificationService = {
  getMessages: async () => {
    try {
      const response = await axiosInstance.get("/api/messages");
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.messages)) return response.data.messages;
      return [];
    } catch (error) {
      console.warn("Live messages endpoint not reachable:", error.message);
      return [];
    }
  },

  getNotifications: async (filter = "all", limit = 10) => {
    try {
      const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_NOTIFICATIONS, {
        params: { filter, limit }
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.notifications)) return data.notifications;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    } catch (error) {
      console.warn("Live notifications endpoint not reachable:", error.message);
      return [];
    }
  },

  getPerformanceMetrics: async (period = "this_week") => {
    try {
      const [metricsRes, perfRes] = await Promise.allSettled([
        axiosInstance.get(API_PATHS.PROFESSIONALS.DASHBOARD_METRICS),
        axiosInstance.get(API_PATHS.PROFESSIONALS.PERFORMANCE, { params: { period } })
      ]);

      const metricsData = metricsRes.status === "fulfilled" ? metricsRes.value.data : {};
      const perfData = perfRes.status === "fulfilled" ? perfRes.value.data : {};

      return {
        earningsTotal: metricsData?.earningsTotal ?? metricsData?.earnings_total ?? metricsData?.totalEarnings ?? 0,
        upcomingJobsCount: metricsData?.upcomingJobsCount ?? metricsData?.upcoming_jobs_count ?? 0,
        completedJobsCount: metricsData?.completedJobsCount ?? metricsData?.completed_jobs_count ?? 0,
        performancePercentage: metricsData?.performancePercentage ?? metricsData?.performance_percentage ?? 0,
        responseRate: perfData?.responseRate ?? perfData?.response_rate ?? metricsData?.responseRate ?? 0,
        successRate: perfData?.successRate ?? perfData?.success_rate ?? metricsData?.successRate ?? 0,
        averageRating: perfData?.averageRating ?? perfData?.avg_rating ?? perfData?.rating ?? 0,
        reviewsCount: perfData?.reviewsCount ?? perfData?.reviews_count ?? 0,
      };
    } catch (error) {
      console.warn("Live performance metrics endpoint not reachable:", error.message);
      return {
        earningsTotal: 0,
        upcomingJobsCount: 0,
        completedJobsCount: 0,
        performancePercentage: 0,
        responseRate: 0,
        successRate: 0,
        averageRating: 0,
        reviewsCount: 0,
      };
    }
  },

  getSchedules: async () => {
    try {
      const response = await axiosInstance.get("/api/schedules");
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.schedules)) return response.data.schedules;
      return [];
    } catch (error) {
      console.warn("Live schedules endpoint not reachable:", error.message);
      return [];
    }
  }
};
