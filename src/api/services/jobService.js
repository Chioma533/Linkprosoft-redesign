import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const jobService = {
  /**
   * Create a new job post
   * POST /api/jobs
   * @param {Object} jobData
   * @param {string} jobData.title - Job title (required)
   * @param {string} jobData.description - Job description (required)
   * @param {string|number} [jobData.skillId] - Skill UUID / ID
   * @param {number} [jobData.budget] - Budget amount
   * @param {string} [jobData.currency="NGN"] - Currency
   * @param {number} [jobData.durationDays=7] - Duration in days
   * @param {string} [jobData.location] - Job location
   * @param {string} [jobData.visibility="public"] - Visibility (public/private)
   */
  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.JOBS.CREATE_JOB,
        jobData
      );
      return response.data;
    } catch (error) {
      console.warn("API createJob error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * List jobs with pagination and filters
   * GET /api/jobs
   */
  getJobs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS, {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("API getJobs error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get jobs created by the authenticated employer
   * GET /api/jobs/me
   */
  getMyEmployerJobs: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_POSTED_JOBS, {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("API getMyEmployerJobs error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get job by ID
   * GET /api/jobs/:id
   */
  getJobById: async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(id));
      return response.data;
    } catch (error) {
      console.warn("API getJobById error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update job
   * PUT /api/jobs/:id
   */
  updateJob: async (id, updateData) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.JOBS.UPDATE_JOB(id),
        updateData
      );
      return response.data;
    } catch (error) {
      console.warn("API updateJob error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete job
   * DELETE /api/jobs/:id
   */
  deleteJob: async (id) => {
    try {
      const response = await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(id));
      return response.data;
    } catch (error) {
      console.warn("API deleteJob error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get matching professionals for a job
   * GET /api/jobs/:id/matches
   */
  getJobMatches: async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.MATCH_JOB(id));
      return response.data;
    } catch (error) {
      console.warn("API getJobMatches error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get applications submitted for one job
   * GET /api/jobs/:id/applications?status=pending&page=1&limit=20
   */
  getJobApplications: async (id, params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_APPLICATIONS(id), {
        params: { status: "pending", page: 1, limit: 20, ...params },
      });
      return response.data;
    } catch (error) {
      console.warn("API getJobApplications error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get skills catalog
   * GET /api/skills
   */
  getSkillsCatalog: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.SKILLS.GET_SKILLS, {
        params: { limit: 100, ...params },
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data?.skills)) return data.data.skills;
      if (Array.isArray(data?.skills)) return data.skills;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      console.warn("API getSkillsCatalog error:", error.response?.data || error.message);
      return [];
    }
  },
};
