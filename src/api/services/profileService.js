import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const profileService = {
  getMyProfile: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROFILE.GET_MY_PROFILE);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.warn("Failed to fetch profile:", error.message);
      return null;
    }
  },

  updateMyProfile: async (payload) => {
    try {
      const response = await axiosInstance.put(API_PATHS.PROFILE.UPDATE_MY_PROFILE, payload);
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to update profile:", error.message);
      throw error;
    }
  },

  getCertifications: async (userId) => {
    try {
      if (!userId) return [];
      const response = await axiosInstance.get(API_PATHS.CERTIFICATIONS.GET_USER_CERTIFICATIONS(userId));
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.certifications)) return data.certifications;
      return [];
    } catch (error) {
      console.warn("Failed to fetch certifications:", error.message);
      return [];
    }
  },

  addCertification: async (payload) => {
    try {
      const response = await axiosInstance.post(API_PATHS.CERTIFICATIONS.ADD_CERTIFICATION, payload);
      return response.data?.certification || response.data;
    } catch (error) {
      console.warn("Failed to add certification:", error.message);
      throw error;
    }
  },

  getPortfolio: async (userId) => {
    try {
      if (!userId) return [];
      const response = await axiosInstance.get(API_PATHS.PORTFOLIO.GET_USER_PORTFOLIO(userId));
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.portfolioItems)) return data.portfolioItems;
      return [];
    } catch (error) {
      console.warn("Failed to fetch portfolio:", error.message);
      return [];
    }
  },

  addPortfolioItem: async (payload) => {
    try {
      const response = await axiosInstance.post(API_PATHS.PORTFOLIO.ADD_PORTFOLIO_ITEM, payload);
      return response.data?.portfolioItem || response.data;
    } catch (error) {
      console.warn("Failed to add portfolio item:", error.message);
      throw error;
    }
  },

  getUserSkills: async (userId) => {
    try {
      if (!userId) return [];
      const response = await axiosInstance.get(API_PATHS.SKILLS.GET_USER_SKILLS(userId));
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.skills)) return data.skills;
      return [];
    } catch (error) {
      console.warn("Failed to fetch user skills:", error.message);
      return [];
    }
  },

  addMySkill: async (payload) => {
    try {
      const response = await axiosInstance.post(API_PATHS.SKILLS.ADD_MY_SKILL, payload);
      return response.data;
    } catch (error) {
      console.warn("Failed to add skill:", error.message);
      throw error;
    }
  },

  getReviews: async (professionalId) => {
    try {
      if (!professionalId) return [];
      const response = await axiosInstance.get(API_PATHS.REVIEWS.GET_PROFESSIONAL_REVIEWS(professionalId));
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.reviews)) return data.reviews;
      return [];
    } catch (error) {
      console.warn("Failed to fetch reviews:", error.message);
      return [];
    }
  }
};
