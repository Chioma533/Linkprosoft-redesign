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
    // Map `profession` to `query` if `query` is not explicitly provided
    const requestPayload = {
      ...payload,
      query: payload.query || payload.profession,
    };

    const response = await axiosInstance.post(getSearchUrl(), requestPayload, { signal });
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

  /**
   * Smart hybrid search router.
   * Directs short 1-2 word queries to GET /api/search/professionals (searchProfessionalsByProfession)
   * and natural language sentences to POST /api/search/professionals (searchProfessionalsByText NLP AI endpoint).
   *
   * @param {{ query?: string, profession?: string, location?: string, rating?: string, budget?: string, minRating?: number, minRate?: number, maxRate?: number, page?: number, limit?: number }} payload
   * @param {AbortSignal} [signal]
   */
  smartSearchProfessionals: async (payload = {}, signal) => {
    const textQuery = payload.query || payload.profession || "";
    if (isNaturalLanguageQuery(textQuery)) {
      return searchService.searchProfessionalsByText({ ...payload, query: textQuery }, signal);
    }
    return searchProfessionalsByProfession({ ...payload, profession: textQuery });
  },
};

/**
 * Helper heuristic to determine whether a search query is a natural-language intent phrase
 * vs. a short direct profession keyword (e.g. "Plumber" vs "I need a plumber to fix my sink").
 *
 * @param {string} query
 * @returns {boolean}
 */
export const isNaturalLanguageQuery = (query) => {
  if (!query || typeof query !== "string") return false;
  const trimmed = query.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  // If longer than 2 words, treat as natural language
  if (words.length > 2) return true;
  // Words indicative of natural language intent even in short 1-2 word phrases
  const intentKeywords = [
    "need", "looking", "want", "find", "search", "fix", "repair",
    "help", "install", "clean", "build", "hire", "my", "some", "someone", "affordable", "cheap"
  ];
  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""));
  return lowerWords.some((w) => intentKeywords.includes(w));
};
