import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          logout();
        }
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
      const data = await authService.verifyEmail({ email, code });
      // If server returns a token and user details, save them
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Verification failed";
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Login failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
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
    isAuthenticated: !!token,
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
