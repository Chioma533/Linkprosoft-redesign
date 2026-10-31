import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/services/authService";
import { clearPersistedAuth, extractAuthenticatedUser } from "../utils/cookieSession";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      clearPersistedAuth();
      try {
        setUser(extractAuthenticatedUser(await authService.getCurrentUser()));
      } catch {
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signup = async (userData) => {
    try {
      const data = await authService.signup(userData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Signup failed";
    }
  };

  const verifyOtp = async (email, code) => {
    try {
      const data = await authService.verifyEmail({ email, otp_code: code });
      setUser(extractAuthenticatedUser(data) || extractAuthenticatedUser(await authService.getCurrentUser()));
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Verification failed";
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(extractAuthenticatedUser(data) || extractAuthenticatedUser(await authService.getCurrentUser()));
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Login failed";
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearPersistedAuth();
      setToken(null);
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Request failed";
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      const data = await authService.verifyResetCode(email, code);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Code verification failed";
    }
  };

  const resetPassword = async (email, code, password) => {
    try {
      const data = await authService.resetPassword(email, code, password);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Password reset failed";
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token || !!user,
    isLoading,
    signup,
    verifyOtp,
    login,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
