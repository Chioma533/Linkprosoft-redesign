import { create } from "zustand";
import { authService } from "../api/services/authService";
import { toast } from "react-hot-toast"


const storedUser = JSON.parse(localStorage.getItem("user")) || null;
const storedToken = localStorage.getItem("token") || null;

export const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken || !!storedUser,
  error: null,
  isLoading: false,

  setAuth: ({ user, token }) => {
    if (token !== undefined) {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }

    if (user !== undefined) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }

    const currentUser = user !== undefined ? user : storedUser;
    const currentToken = token !== undefined ? token : storedToken;

    set({
      user: currentUser || null,
      token: currentToken || null,
      isAuthenticated: !!currentToken || !!currentUser,
      error: null,
    });
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

  googleSignin: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.googleSignin();
      set({ isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Google login failed";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  verifyOtp: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.verifyEmail({ email, code });
      const token = data?.token || data?.accessToken;
      const user = data?.user || null;
      set({ isLoading: false });
      useAuthStore.getState().setAuth({ user, token });
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
      const token = authData.accessToken || authData.token;
      const user = authData.user || null;

      set({ isLoading: false });
      useAuthStore.getState().setAuth({ user, token });

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
