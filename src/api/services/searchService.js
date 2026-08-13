import axiosInstance from "../../utils/axiosInstance";
import { API_BASE_URL, API_PATHS } from "../../utils/apiPaths";

const getSearchUrl = () => {
  const backendBaseUrl = API_BASE_URL;
  return `${backendBaseUrl}${API_PATHS.SEARCH.PROFESSIONALS}`;
};

/**
 * Search professionals by profession name and optional filters.
 * Contract: docs/integrations/SEARCH_PROFESSION_INTEGRATION_GUIDE.md
 *
 * @param {Object} params
 * @param {string} [params.profession] - Profession name (e.g. "Carpenter")
 * @param {number[]|string} [params.skills]
 * @param {number} [params.minRating]
 * @param {number} [params.maxRating]
 * @param {number} [params.minRate]
 * @param {number} [params.maxRate]
 * @param {string} [params.availabilityStatus]
 * @param {string} [params.sortBy]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 */
export const searchProfessionalsByProfession = async (params = {}) => {
  try {
    const response = await axiosInstance.get(getSearchUrl(), {
      params: {
        profession: params.profession?.trim() || undefined,
        skills: params.skills || undefined,
        minRating: params.minRating || undefined,
        maxRating: params.maxRating || undefined,
        minRate: params.minRate || undefined,
        maxRate: params.maxRate || undefined,
        availabilityStatus: params.availabilityStatus || undefined,
        sortBy: params.sortBy || 'rating_desc',
        page: params.page || 1,
        limit: params.limit || 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to search professionals by profession:', error);
    throw error;
  }
};

export const searchService = {
  // Search professionals with filters (legacy GET endpoint)
  searchProfessionals: async (params) => {
    // params is an object containing query parameters like skills, minRating, etc.
    const response = await axiosInstance.get(getSearchUrl(), { params });
    return response.data;
  },

  // Search professionals by profession name (GET endpoint)
  searchProfessionalsByProfession,

  /**
   * Natural-language professional search via POST.
   * Contract: docs/integrations/AI-SEARCH-NLP-INTEGRATION.md
   *
   * @param {{ query: string, location?: string, rating?: string, budget?: string, page?: number, limit?: number }} payload
   * @param {AbortSignal} [signal] - optional AbortSignal for request cancellation
   * @returns {Promise<import('axios').AxiosResponse['data']>}
   */
  searchProfessionalsByText: async (payload, signal) => {
    const response = await axiosInstance.post(getSearchUrl(), payload, { signal });
    if (!response.data || response.data.success !== true) {
      throw new Error(response.data?.message ?? "Professional search failed");
    }
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