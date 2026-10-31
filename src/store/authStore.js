import { create } from "zustand";
import { authService } from "../api/services/authService";
import { useMessagingStore } from "./messagingStore";
import { socketManager } from "../utils/socketManager";
import { clearPersistedAuth } from "../utils/cookieSession";
import { useDashboardStore } from "./dashboardStore";


const extractUser = (response) => {
  if (response?.user) return response.user;
  if (response?.data?.user) return response.data.user;
  if (response?.role) return response;
  if (response?.data?.role) return response.data;
  return null;
};

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isSessionLoading: true,

  setAuth: ({ user }) => {
    // User identity is derived from the cookie session, never persisted tokens.
    clearPersistedAuth();
    set({
      user: user || null,
      token: null,
      isAuthenticated: !!user,
      error: null,
      isSessionLoading: false,
    });
  },

  refreshCurrentUser: async () => {
    try {
      const user = extractUser(await authService.getCurrentUser());
      if (!user) {
        set({ isSessionLoading: false });
        return null;
      }

      useAuthStore.getState().setAuth({ user });
      return user;
    } catch (error) {
      // A failed cookie refresh means this identity is no longer authoritative.
      if (error.response?.status === 401 || error.status === 401) {
        clearPersistedAuth();
        useDashboardStore.getState().reset();
        useMessagingStore.getState().reset();
        set({ user: null, token: null, isAuthenticated: false, isSessionLoading: false });
      } else {
        set({ isSessionLoading: false });
      }
      return null;
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.signup(userData);
      set({ isLoading: false });
      return data;
    } catch (error) {
      let errorMsg = error.response?.data?.message || error.message || "Signup failed";

      // Translate common DB/constraint errors into user-friendly messages
      const serverMsg = String(error.response?.data?.message || "").toLowerCase();
      if (error.response?.status === 500 && serverMsg.includes("duplicate key")) {
        if (serverMsg.includes("users_email_key") || serverMsg.includes("email")) {
          errorMsg = "An account with that email already exists.";
        } else {
          errorMsg = "A resource conflict occurred. Please check your input.";
        }
      }

      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  googleSignin: async (role, professionalType) => {
    // Do this before leaving the app: a stale identity must not survive OAuth.
    clearPersistedAuth();
    useDashboardStore.getState().reset();
    useMessagingStore.getState().reset();
    set({ user: null, token: null, isAuthenticated: false, error: null, isSessionLoading: false });
    set({ isLoading: true, error: null });
    try {
      const data = await authService.googleSignin(role, professionalType);
      set({ isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Google login failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  verifyOtp: async (email, otpCode) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.verifyEmail({ email, otp_code: otpCode });
      let user = extractUser(data);

      if (!user) {
        user = extractUser(await authService.getCurrentUser());
      }

      if (!user?.role) {
        throw new Error("Unable to load the verified user's role");
      }

      set({ isLoading: false });
      useAuthStore.getState().setAuth({ user });
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

      // console.log("LOGIN RESPONSE:", response);

      const authData = response.data;
      const user = authData.user || null;

      set({ isLoading: false });
      useAuthStore.getState().setAuth({ user });

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
      socketManager.disconnect();
      useMessagingStore.getState().reset();
      useDashboardStore.getState().reset();
      clearPersistedAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isSessionLoading: false,
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
