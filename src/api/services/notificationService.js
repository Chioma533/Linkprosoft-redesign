import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const extractList = (response) => {
  if (!response) return [];

  const payload = response.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.jobs)) return payload.jobs;
  if (Array.isArray(payload?.data?.jobs)) return payload.data.jobs;
  if (Array.isArray(payload?.applications)) return payload.applications;
  if (Array.isArray(payload?.data?.applications))
    return payload.data.applications;

  return [];
};

const normalizeDateValue = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
};

const formatScheduleTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeScheduleItem = (job, index) => {
  const scheduledDateSource =
    job.scheduledDate ||
    job.scheduleDate ||
    job.date ||
    job.createdAt ||
    job.updatedAt ||
    job.assignedAt ||
    job.startedAt ||
    job.completedAt;

  const normalizedDate =
    normalizeDateValue(scheduledDateSource) ||
    new Date().toISOString().slice(0, 10);

  return {
    id: job.id || job.assignmentId || `schedule-${index + 1}`,
    orderId:
      job.orderId ||
      job.order_id ||
      `ORD-${String(job.id || index + 1).slice(0, 6)}`,
    jobTitle: job.title || job.jobTitle || "Assigned Job",
    location: job.location || "Remote",
    client:
      job.client?.fullName ||
      job.client?.name ||
      job.employer?.fullName ||
      job.employer?.name ||
      job.employerName ||
      "Client",
    date: normalizedDate,
    time: formatScheduleTime(scheduledDateSource),
    status: job.status || "active",
    budget: Number(job.budget || job.totalAmount || job.acceptedBudget || 0),
    category: job.category?.name || job.category || "General Service",
    createdAt: scheduledDateSource,
  };
};

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
      const response = await axiosInstance.get(
        API_PATHS.NOTIFICATIONS.GET_NOTIFICATIONS,
        {
          params: { filter, limit },
        },
      );
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
        axiosInstance.get(API_PATHS.PROFESSIONALS.PERFORMANCE, {
          params: { period },
        }),
      ]);

      const metricsData =
        metricsRes.status === "fulfilled" ? metricsRes.value.data : {};
      const perfData = perfRes.status === "fulfilled" ? perfRes.value.data : {};

      return {
        earningsTotal:
          metricsData?.earningsTotal ??
          metricsData?.earnings_total ??
          metricsData?.totalEarnings ??
          0,
        upcomingJobsCount:
          metricsData?.upcomingJobsCount ??
          metricsData?.upcoming_jobs_count ??
          0,
        completedJobsCount:
          metricsData?.completedJobsCount ??
          metricsData?.completed_jobs_count ??
          0,
        performancePercentage:
          metricsData?.performancePercentage ??
          metricsData?.performance_percentage ??
          0,
        responseRate:
          perfData?.responseRate ??
          perfData?.response_rate ??
          metricsData?.responseRate ??
          0,
        successRate:
          perfData?.successRate ??
          perfData?.success_rate ??
          metricsData?.successRate ??
          0,
        averageRating:
          perfData?.averageRating ??
          perfData?.avg_rating ??
          perfData?.rating ??
          0,
        reviewsCount: perfData?.reviewsCount ?? perfData?.reviews_count ?? 0,
      };
    } catch (error) {
      console.warn(
        "Live performance metrics endpoint not reachable:",
        error.message,
      );
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
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_MY_JOBS);
      const rawSchedules = extractList(response);

      return rawSchedules.map(normalizeScheduleItem);
    } catch (error) {
      console.warn("Live schedules endpoint not reachable:", error.message);
      return [];
    }
  },
};
