import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const profileService = {
  getMyProfile: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROFILE.GET_MY_PROFILE);
      return response.data?.data?.profile || response.data?.data || response.data || null;
    } catch (error) {
      console.warn("Failed to fetch profile:", error.message);
      return null;
    }
  },

  updateMyProfile: async (payload) => {
    try {
      const response = await axiosInstance.put(API_PATHS.PROFILE.UPDATE_MY_PROFILE, payload);
      return response.data?.data?.profile || response.data?.data || response.data;
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
      if (Array.isArray(data?.data?.certifications)) return data.data.certifications;
      if (Array.isArray(data?.certifications)) return data.certifications;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      console.warn("Failed to fetch certifications:", error.message);
      return [];
    }
  },

  addCertification: async (payload) => {
    try {
      const response = await axiosInstance.post(API_PATHS.CERTIFICATIONS.ADD_CERTIFICATION, payload);
      return response.data?.certification || response.data?.data || response.data;
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
      if (Array.isArray(data?.data?.portfolioItems)) return data.data.portfolioItems;
      if (Array.isArray(data?.portfolioItems)) return data.portfolioItems;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      console.warn("Failed to fetch portfolio:", error.message);
      return [];
    }
  },

  addPortfolioItem: async (payload) => {
    try {
      const response = await axiosInstance.post(API_PATHS.PORTFOLIO.ADD_PORTFOLIO_ITEM, payload);
      return response.data?.portfolioItem || response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to add portfolio item:", error.message);
      throw error;
    }
  },

  // Catalog of standard system skills with fallback UUIDs
  DEFAULT_SKILLS: [
    {
      id: "25bf49c9-83d6-4869-ad83-a72753b1ecdc",
      name: "Carpentry",
      category: "Trades",
      description: "Furniture building, wardrobe and cabinet installation"
    },
    {
      id: "0d90705d-3e76-40bc-a6e3-f1597bacd955",
      name: "Content Writing",
      category: "Digital",
      description: "Copywriting, blog and marketing content"
    },
    {
      id: "614c5981-6c4c-4027-949a-8590d2e02c36",
      name: "Electrical Installation",
      category: "Trades",
      description: "Wiring, diagnostics and appliance installation"
    },
    {
      id: "1fe9bc00-9280-4745-98e8-9edfdaa5a0fe",
      name: "Graphic Design",
      category: "Digital",
      description: "Branding, print and digital design work"
    },
    {
      id: "e701e6cd-529f-4c05-b71e-e6c4cc3c6008",
      name: "Home Cleaning",
      category: "Trades",
      description: "Deep cleaning and routine housekeeping"
    },
    {
      id: "42ec6987-83d7-4138-ba13-37a20af7d33d",
      name: "House Painting",
      category: "Trades",
      description: "Interior and exterior painting services"
    },
    {
      id: "33f2e7d6-6b29-4267-9222-b78aa2913432",
      name: "Plumbing",
      category: "Trades",
      description: "Pipe repair, installation and fixture fitting"
    },
    {
      id: "7a67cb09-5a72-4b3f-a64c-fbee17aa9cc6",
      name: "Web Development",
      category: "Digital",
      description: "Frontend and backend web application development"
    }
  ],

  getSkillsCatalog: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.SKILLS.GET_SKILLS, {
        params: { limit: 100, ...params }
      });
      const data = response.data;
      let skillsList = [];
      if (Array.isArray(data)) skillsList = data;
      else if (Array.isArray(data?.data?.skills)) skillsList = data.data.skills;
      else if (Array.isArray(data?.skills)) skillsList = data.skills;
      else if (Array.isArray(data?.data)) skillsList = data.data;

      if (skillsList.length > 0) return skillsList;
      return profileService.DEFAULT_SKILLS;
    } catch (error) {
      console.warn("Failed to fetch skills catalog from API, using fallback:", error.message);
      return profileService.DEFAULT_SKILLS;
    }
  },

  getUserSkills: async (userId) => {
    try {
      if (!userId) return [];
      const response = await axiosInstance.get(API_PATHS.SKILLS.GET_USER_SKILLS(userId));
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data?.skills)) return data.data.skills;
      if (Array.isArray(data?.skills)) return data.skills;
      if (Array.isArray(data?.data)) return data.data;
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
      console.warn("Failed to add skill:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteMySkill: async (skillId) => {
    try {
      const response = await axiosInstance.delete(API_PATHS.SKILLS.DELETE_MY_SKILL(skillId));
      return response.data;
    } catch (error) {
      console.warn("Failed to delete skill:", error.response?.data || error.message);
      throw error;
    }
  },

  getReviews: async (professionalId) => {
    try {
      if (!professionalId) return [];
      const response = await axiosInstance.get(API_PATHS.REVIEWS.GET_PROFESSIONAL_REVIEWS(professionalId));
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data?.items)) return data.data.items;
      if (Array.isArray(data?.data?.reviews)) return data.data.reviews;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.reviews)) return data.reviews;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      console.warn("Failed to fetch reviews:", error.message);
      return [];
    }
  }
};
