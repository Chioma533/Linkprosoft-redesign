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

  googleSignin: async (role, professionalType) => {
    let url = getGoogleAuthUrl();
    // Generate a nonce for CSRF protection and store it in sessionStorage
    const nonceArray = new Uint8Array(16);
    crypto.getRandomValues(nonceArray);
    // Convert to base64url string
    const nonce = btoa(String.fromCharCode(...nonceArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    sessionStorage.setItem('google_oauth_nonce', nonce);

    // Build state payload
    const statePayload = {
      nonce,
      role,
      professionalType: role === 'professional' ? professionalType : undefined,
    };
    // Encode as base64url-safe JSON
    const state = btoa(JSON.stringify(statePayload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const params = [`state=${encodeURIComponent(state)}`];
    url += '?' + params.join('&');
    console.log('Google OAuth redirect URL with state:', url);
    window.location.assign(url);
    return { success: true, redirectUrl: url };
  },

  verifyEmail: async (verificationData) => {
    // payload required by backend: { email, otp_code }
    const payload = {
      email: verificationData?.email,
      otp_code: verificationData?.otp_code || verificationData?.code,
    };
    const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY, payload);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get(API_PATHS.PROFILE.GET_PROFILE);
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
