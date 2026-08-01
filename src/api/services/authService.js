import axiosInstance from "../../utils/axiosInstance";
import { API_BASE_URL, API_PATHS } from "../../utils/apiPaths";

const getGoogleAuthUrl = () => {
  const backendBaseUrl = API_BASE_URL;
  return `${backendBaseUrl}${API_PATHS.GOOGLE_AUTH.GOOGLE_SIGNIN}`;
};

export const authService = {
  signup: async (userData) => {
    // payload: { fullName, email, password, role }
    // e.g. role can be "employer" or "professional"
    const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, userData);
    return response.data;
  },

  googleSignin: async () => {
    const googleAuthUrl = getGoogleAuthUrl();
    window.location.assign(googleAuthUrl);
    return { success: true, redirectUrl: googleAuthUrl };
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
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  verifyResetCode: async (email, code) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_RESET_CODE, { email, code });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("verify-reset-code route not found. Proceeding with client-side verification flow.");
        return { success: true, fallback: true };
      }
      throw error;
    }
  },

  resetPassword: async (email, code, password) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
      email,
      code,
      password,
      newPassword: password
    });
    return response.data;
  }
};
