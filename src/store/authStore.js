import { create } from "zustand";
import { authService } from "../api/services/authService";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
  isLoading: false,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.signup(userData);
      set({ isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Signup failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  verifyOtp: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.verifyEmail({ email, code });
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      set({
        user: data.user || null,
        token: data.token || null,
        isAuthenticated: !!data.token,
        isLoading: false,
      });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "OTP verification failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
    const response = await authService.login(credentials);
      
      console.log("LOGIN RESPONSE:", response);
     
      const authData = response.data;

      localStorage.setItem("token", authData.accessToken);
      localStorage.setItem("user", JSON.stringify(authData.user));

      set({
        user: authData.user,
        token: authData.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log("STORE:", useAuthStore.getState());

      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Login failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
    } catch (error) {
      console.warn("API logout call failed, completing local logout: ", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.forgotPassword(email);
      set({ isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Forgot password request failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  verifyResetCode: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.verifyResetCode(email, code);
      set({ isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Verify reset code failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  resetPassword: async (email, code, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.resetPassword(email, code, password);
      set({ isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Reset password failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  setLoading: (loadingState) => {
    set({ isLoading: loadingState });
  },

  setError: (errorState) => {
    set({ error: errorState });
  }
}));
