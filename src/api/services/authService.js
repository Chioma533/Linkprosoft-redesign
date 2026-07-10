import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export const authService = {
  signup: async (userData) => {
    // payload: { fullName, email, password, role }
    // e.g. role can be "employer" or "professional"
    const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, userData);
    return response.data;
  },

  verifyEmail: async (verificationData) => {
    // payload: { email, code }
    const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY, verificationData);
    return response.data;
  },

  login: async (credentials) => {
    // payload: { email, password }
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    return response.data;
  }
};
