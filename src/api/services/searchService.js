import axiosInstance from "../../utils/axiosInstance";
import { API_BASE_URL, API_PATHS } from "../../utils/apiPaths";

const getSearchUrl = () => {
  const backendBaseUrl = API_BASE_URL;
  return `${backendBaseUrl}${API_PATHS.SEARCH.PROFESSIONALS}`;
};

export const searchService = {
  // Search professionals with filters
  searchProfessionals: async (params) => {
    // params is an object containing query parameters like skills, minRating, etc.
    const response = await axiosInstance.get(getSearchUrl(), { params });
    return response.data;
  },

  // Get filter options
  getFilters: async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}${API_PATHS.SEARCH.FILTERS}`);
    return response.data;
  },

  // Get skill autocomplete suggestions
  getSkillSuggestions: async (query, limit = 10) => {
    const response = await axiosInstance.get(`${API_BASE_URL}${API_PATHS.SEARCH.SKILLS_AUTOCOMPLETE}`, {
      params: { q: query, limit },
    });
    return response.data;
  },
};