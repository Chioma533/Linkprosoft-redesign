import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

/**
 * Helper to unwrap standard backend response arrays.
 * Handles:
 * - response.data.data.items
 * - response.data.data.jobs / response.data.data.applications
 * - response.data.data (if array)
 * - response.data.items / response.data.jobs
 * - response.data (if array)
 */
function extractArray(response) {
  if (!response) return [];
  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.jobs)) return payload.data.jobs;
  if (Array.isArray(payload?.data?.applications)) return payload.data.applications;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.jobs)) return payload.jobs;
  if (Array.isArray(payload?.applications)) return payload.applications;
  return [];
}

export const projectService = {
  getJobs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS, {
        params: { status: "posted", ...params },
      });
      return extractArray(response);
    } catch (error) {
      console.warn("Live jobs endpoint error:", error.message);
      return [];
    }
  },

  getMyJobs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_MY_JOBS, {
        params,
      });
      return extractArray(response);
    } catch (error) {
      console.warn("Live user contracted jobs endpoint error:", error.message);
      return [];
    }
  },

  getApplications: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_APPLICATIONS,
        { params }
      );
      return extractArray(response);
    } catch (error) {
      console.warn("Live applications endpoint error:", error.message);
      return [];
    }
  },

  applyForJob: async (jobId, bidAmount, coverLetter = "", estimatedDeliveryDays = 7) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.APPLICATIONS.ADD_APPLICATION,
        {
          jobId,
          bidAmount,
          coverLetter,
          estimatedDeliveryDays,
        }
      );
      return response.data;
    } catch (error) {
      console.warn("Error submitting application:", error.message);
      throw error;
    }
  },
};
